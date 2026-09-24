import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Film, Loader2, Play, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Chapters, buildChapters, type Chapter } from "@/components/media/Chapters";
import { useAuth } from "@/hooks/use-auth";
import { useCinemora } from "@/hooks/use-cinemora";
import { createTitle, deleteTitle, listLibrary, signedUrl, uploadFile, type LibraryTitle } from "@/lib/library";

export const Route = createFileRoute('/_authenticated/library')({
  head: () => ({ meta: [
    { title: 'My Library — CINEMORA' },
    { name: 'description', content: 'Upload your own films and manage your personal CINEMORA collection.' },
    { property: 'og:title', content: 'My Library — CINEMORA' },
    { property: 'og:description', content: 'Upload your own films and manage your personal CINEMORA collection.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Library,
});

const MAX_VIDEO = 500 * 1024 * 1024;

function Library() {
  const { user } = useAuth();
  const [items, setItems] = useState<LibraryTitle[] | null>(null);
  const [posters, setPosters] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState<{ item: LibraryTitle; url: string } | null>(null);

  const load = async () => {
    try {
      const rows = await listLibrary();
      setItems(rows);
      const entries = await Promise.all(rows.map(async r => [r.id, (await signedUrl(r.poster_path)) ?? ""] as const));
      setPosters(Object.fromEntries(entries.filter(([, v]) => v)));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load your library");
      setItems([]);
    }
  };
  useEffect(() => { void load() }, []);

  const play = async (item: LibraryTitle) => {
    const url = item.video_path ? await signedUrl(item.video_path) : item.video_url;
    if (!url) { toast.error("This title has no video yet"); return }
    setPlaying({ item, url });
  };

  const remove = async (item: LibraryTitle) => {
    try { await deleteTitle(item); toast.success("Removed from your library"); void load() }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not remove") }
  };

  return <Page eyebrow="Your collection" title="My Library">
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <Button onClick={() => setOpen(o => !o)}>{open ? <X /> : <Plus />}{open ? "Close" : "Add a film"}</Button>
      <p className="text-sm text-muted-foreground">Films you own, up to 500 MB each. Only you can see them.</p>
    </div>

    {open && user && <AddForm userId={user.id} onDone={() => { setOpen(false); void load() }} />}

    {playing && <PlayerPanel item={playing.item} url={playing.url} onClose={() => setPlaying(null)} />}

    {items === null
      ? <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="aspect-[2/3] rounded-md" />)}</div>
      : items.length === 0
        ? <EmptyState title="Your library is empty" description="Upload a film you own to start your personal collection." />
        : <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {items.map(item => <article key={item.id} className="group overflow-hidden rounded-md border border-border bg-card">
              <div className="relative aspect-[2/3] bg-muted">
                {posters[item.id]
                  ? <img src={posters[item.id]} alt={`${item.title} poster`} className="size-full object-cover" loading="lazy" />
                  : <div className="grid size-full place-items-center text-muted-foreground"><Film className="size-8" /></div>}
                <div className="absolute inset-0 flex items-end gap-2 bg-gradient-to-t from-background/90 to-transparent p-3 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                  <Button size="sm" onClick={() => void play(item)}><Play /> Play</Button>
                  <Button size="icon" variant="glass" aria-label={`Delete ${item.title}`} onClick={() => void remove(item)}><Trash2 /></Button>
                </div>
              </div>
              <div className="p-3">
                <h3 className="truncate font-medium">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{[item.year, item.genres.join(", ")].filter(Boolean).join(" · ") || "Personal upload"}</p>
              </div>
            </article>)}
          </div>}
  </Page>;
}

function PlayerPanel({ item, url, onClose }: { item: LibraryTitle; url: string; onClose: () => void }) {
  const { setProgress, progress } = useCinemora();
  const mediaId = `lib:${item.id}`;
  const saved = progress[mediaId];
  const ref = useRef<HTMLVideoElement>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [current, setCurrent] = useState(0);
  const resumed = useRef(false);

  return <section className="mb-10 rounded-md border border-border bg-card p-4">
    <div className="mb-3 flex items-center justify-between gap-4">
      <h2 className="font-display text-xl">{item.title}</h2>
      <Button variant="ghost" size="icon" aria-label="Close player" onClick={onClose}><X /></Button>
    </div>
    <video ref={ref} src={url} controls playsInline className="aspect-video w-full rounded-md bg-background"
      onLoadedMetadata={e => {
        const v = e.currentTarget;
        setChapters(buildChapters(v.duration));
        if (!resumed.current && saved && saved.time > 5 && saved.pct < 95 && saved.time < v.duration) v.currentTime = saved.time;
        resumed.current = true;
      }}
      onTimeUpdate={e => { const v = e.currentTarget; setCurrent(v.currentTime); if (v.duration) setProgress(mediaId, v.currentTime, v.duration) }} />
    {item.description && <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{item.description}</p>}
    <Chapters chapters={chapters} current={current} onSeek={t => { const v = ref.current; if (!v) return; v.currentTime = t; setCurrent(t); void v.play().catch(() => undefined) }} />
  </section>;
}

function AddForm({ userId, onDone }: { userId: string; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [genres, setGenres] = useState("");
  const [poster, setPoster] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const canSave = useMemo(() => title.trim().length > 1 && (video || videoUrl.trim()), [title, video, videoUrl]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (video && video.size > MAX_VIDEO) { toast.error("Video must be 500 MB or smaller"); return }
    setBusy(true);
    try {
      const poster_path = poster ? await uploadFile(userId, poster, "poster") : null;
      const video_path = video ? await uploadFile(userId, video, "video") : null;
      await createTitle(userId, {
        title: title.trim(),
        description: description.trim(),
        year: year ? Number(year) : null,
        genres: genres.split(",").map(g => g.trim()).filter(Boolean),
        poster_path,
        video_path,
        video_url: video ? null : videoUrl.trim() || null,
      });
      toast.success("Added to your library");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return <form onSubmit={submit} className="mb-10 grid gap-5 rounded-md border border-border bg-glass p-5 backdrop-blur-xl md:grid-cols-2">
    <div>
      <Label htmlFor="lt-title">Title</Label>
      <Input id="lt-title" className="mt-2" value={title} onChange={e => setTitle(e.target.value)} required />
    </div>
    <div>
      <Label htmlFor="lt-year">Year</Label>
      <Input id="lt-year" className="mt-2" inputMode="numeric" value={year} onChange={e => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))} />
    </div>
    <div className="md:col-span-2">
      <Label htmlFor="lt-desc">Description</Label>
      <Textarea id="lt-desc" className="mt-2" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
    </div>
    <div>
      <Label htmlFor="lt-genres">Genres (comma separated)</Label>
      <Input id="lt-genres" className="mt-2" value={genres} onChange={e => setGenres(e.target.value)} placeholder="Drama, Thriller" />
    </div>
    <div>
      <Label htmlFor="lt-poster">Poster image</Label>
      <Input id="lt-poster" className="mt-2" type="file" accept="image/*" onChange={e => setPoster(e.target.files?.[0] ?? null)} />
    </div>
    <div>
      <Label htmlFor="lt-video">Video file (max 500 MB)</Label>
      <Input id="lt-video" className="mt-2" type="file" accept="video/*" onChange={e => setVideo(e.target.files?.[0] ?? null)} />
    </div>
    <div>
      <Label htmlFor="lt-url">…or a video link</Label>
      <Input id="lt-url" className="mt-2" type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://…/film.mp4" disabled={Boolean(video)} />
    </div>
    <div className="md:col-span-2">
      <Button type="submit" size="lg" disabled={!canSave || busy}>{busy ? <Loader2 className="animate-spin" /> : <Upload />}{busy ? "Uploading…" : "Save to my library"}</Button>
    </div>
  </form>;
}

import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { catalog } from "@/data/catalog";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { ProviderGrid } from "@/components/media/ProviderGrid";
import { useCinemora } from "@/hooks/use-cinemora";
import { PlayerSettings, type PlayerPrefs } from "@/components/media/PlayerSettings";
import { Chapters, buildChapters, type Chapter } from "@/components/media/Chapters";
import { captionUrl } from "@/utils/captions";
import { getOpenFilm } from "@/lib/search.functions";

export const Route = createFileRoute('/watch/$slug')({
  loader: async ({ params }) => {
    const m = catalog.find(x => x.slug === params.slug);
    if (m) return m;
    if (params.slug.startsWith('ia-')) { const remote = await getOpenFilm({ data: { slug: params.slug } }); if (remote) return remote }
    throw notFound();
  },
  head: ({ loaderData }) => ({ meta: [{ title: `Watch ${loaderData?.title ?? 'Trailer'} — CINEMORA` }, { name: 'description', content: 'Watch a legal preview on CINEMORA.' }, { property: 'og:title', content: `Watch ${loaderData?.title ?? 'Trailer'} — CINEMORA` }, { property: 'og:description', content: 'Watch a legal preview on CINEMORA.' }, { property: 'og:type', content: 'video.other' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Player,
});

const DEFAULTS: PlayerPrefs = { speed: "1", subtitle: "off", audio: "en", quality: "auto" };

/** "1h 36m" -> 5760 seconds, so chapters exist before the film's metadata loads. */
function runtimeSeconds(runtime: string) {
  const h = Number(runtime.match(/(\d+)\s*h/)?.[1] ?? 0);
  const min = Number(runtime.match(/(\d+)\s*m/)?.[1] ?? 0);
  return h * 3600 + min * 60;
}

function Player() {
  const m = Route.useLoaderData();
  const { setProgress, clearProgress, progress } = useCinemora();
  const ref = useRef<HTMLVideoElement>(null);
  const saved = progress[m.id];
  const [resumed, setResumed] = useState(false);
  const [prefs, setPrefs] = useState<PlayerPrefs>(DEFAULTS);
  const [chapters, setChapters] = useState<Chapter[]>(() => buildChapters(runtimeSeconds(m.runtime)));
  const [current, setCurrent] = useState(0);

  useEffect(() => { setResumed(false); setChapters(buildChapters(runtimeSeconds(m.runtime))); setCurrent(0) }, [m.id, m.runtime]);
  useEffect(() => {
    try { const raw = localStorage.getItem("cinemora-player"); if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) }) } catch { /* ignore */ }
  }, []);
  useEffect(() => { if (ref.current) ref.current.playbackRate = Number(prefs.speed) }, [prefs.speed]);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    for (const t of Array.from(v.textTracks)) t.mode = t.language === prefs.subtitle ? "showing" : "disabled";
  }, [prefs.subtitle]);

  const update = (p: Partial<PlayerPrefs>) => setPrefs(prev => {
    const next = { ...prev, ...p };
    localStorage.setItem("cinemora-player", JSON.stringify(next));
    return next;
  });

  const onLoaded = () => {
    const v = ref.current; if (!v) return;
    v.playbackRate = Number(prefs.speed);
    setChapters(buildChapters(v.duration));
    if (!resumed) {
      if (saved && saved.time > 5 && saved.pct < 95 && saved.time < v.duration) { v.currentTime = saved.time }
      setResumed(true);
    }
  };

  const seek = (t: number) => { const v = ref.current; if (!v) return; v.currentTime = t; setCurrent(t); void v.play().catch(() => undefined) };

  const isFull = Boolean(m.full);

  return <Page eyebrow={isFull ? "Full film — public domain" : "Official trailer"} title={m.title}>
    <div className="overflow-hidden rounded-md border border-border bg-card shadow-2xl">
      {isFull
        ? <video ref={ref} className="aspect-video w-full bg-background" controls playsInline poster={m.backdrop} src={m.full!}
            onLoadedMetadata={onLoaded}
            onTimeUpdate={e => { const v = e.currentTarget; setCurrent(v.currentTime); if (v.duration) setProgress(m.id, v.currentTime, v.duration) }}
            onEnded={() => { const v = ref.current; if (v?.duration) setProgress(m.id, v.duration, v.duration) }}>
            {["en", "es", "fr"].map(l => {
              const src = captionUrl(l);
              return src ? <track key={l} kind="subtitles" srcLang={l} src={src} label={l === "en" ? "English" : l === "es" ? "Spanish" : "French"} default={prefs.subtitle === l} /> : null;
            })}
            Your browser does not support video playback.
          </video>
        : m.youtube
          ? <iframe className="aspect-video w-full bg-background" src={`https://www.youtube-nocookie.com/embed/${m.youtube}?rel=0&modestbranding=1`}
              title={`${m.title} — official trailer`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen" allowFullScreen loading="lazy" />
          : <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-background p-6 text-center">
              <p className="font-medium">Trailer unavailable.</p>
              <p className="text-sm text-muted-foreground">View official streaming options below.</p>
            </div>}
    </div>

    {isFull ? <>
      <PlayerSettings prefs={prefs} onChange={update} />
      <p className="mt-2 text-xs text-muted-foreground">Audio language and quality options are demonstrations on this public-domain print.</p>
      {saved && saved.pct > 0 && saved.pct < 95 && <div className="mt-4 flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted-foreground" role="status">Resuming from {saved.pct}% watched.</p>
        <Button variant="glass" size="sm" onClick={() => { clearProgress(m.id); if (ref.current) ref.current.currentTime = 0; setCurrent(0) }}><RotateCcw /> Start over</Button>
      </div>}
      <Chapters chapters={chapters} current={current} onSeek={seek} />
    </> : <p className="mt-3 text-sm text-muted-foreground">This is the official trailer. {m.title} streams in full on the services below.</p>}

    <div className="mt-8 max-w-3xl">
      <p className="text-sm text-muted-foreground">{isFull ? "Full film" : "Official trailer"} • {m.ageRating} • {m.runtime}</p>
      <p className="mt-4 leading-7">{m.description}</p>
      <p className="mt-3 text-sm text-muted-foreground">Cast: {m.cast.join(', ')} · {m.genres.join(', ')}</p>
    </div>
    <section className="mt-10 max-w-3xl">
      <h2 className="mb-4 font-display text-xl">Where to watch</h2>
      <ProviderGrid providers={m.providers} />
    </section>
  </Page>;
}

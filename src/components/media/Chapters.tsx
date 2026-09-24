import { ListVideo, Play } from "lucide-react";

export type Chapter = { index: number; title: string; start: number; end: number };

/** Split a film into evenly spaced chapters (about 12 minutes each, 4–12 total). */
export function buildChapters(duration: number): Chapter[] {
  if (!duration || !isFinite(duration) || duration < 60) return [];
  const count = Math.min(12, Math.max(4, Math.round(duration / 720)));
  const span = duration / count;
  return Array.from({ length: count }, (_, i) => ({
    index: i + 1,
    title: `Part ${i + 1}`,
    start: Math.floor(i * span),
    end: Math.floor((i + 1) * span),
  }));
}

export const stamp = (s: number) => {
  const t = Math.max(0, Math.floor(s));
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), sec = t % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
};

export function Chapters({ chapters, current, onSeek }: { chapters: Chapter[]; current: number; onSeek: (t: number) => void }) {
  if (chapters.length === 0) return null;
  return <section className="mt-8" aria-label="Chapters">
    <h2 className="flex items-center gap-2 font-display text-xl"><ListVideo className="size-5 text-primary" />Chapters</h2>
    <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {chapters.map(c => {
        const active = current >= c.start && current < c.end;
        const pct = active ? Math.min(100, Math.round(((current - c.start) / (c.end - c.start)) * 100)) : current >= c.end ? 100 : 0;
        return <li key={c.index}>
          <button type="button" onClick={() => onSeek(c.start)} aria-current={active ? "true" : undefined}
            className={`group flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors ${active ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted/60"}`}>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold group-hover:bg-primary group-hover:text-primary-foreground">
              {active ? <Play className="size-3.5 fill-current" /> : c.index}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{c.title}</span>
              <span className="mt-1 block h-1 w-full overflow-hidden rounded-full bg-muted"><span className="block h-full bg-primary" style={{ width: `${pct}%` }} /></span>
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">{stamp(c.start)}</span>
          </button>
        </li>;
      })}
    </ol>
  </section>;
}

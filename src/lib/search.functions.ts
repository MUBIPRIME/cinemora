import { createServerFn } from "@tanstack/react-start";
import type { Media } from "@/types/media";

/** Open-library search: the Internet Archive's public-domain / freely licensed film
 *  collections. No API key needed, and the films are legally playable in-app. */

const COLLECTIONS = [
  "feature_films",
  "silent_films",
  "film_noir",
  "sci-fi_horror",
  "classic_cartoons",
  "short_films",
  "moviesandfilms",
  "SciFi_Horror",
];

type Doc = {
  identifier?: string;
  title?: string;
  year?: number | string;
  description?: string | string[];
  avg_rating?: number | string;
  runtime?: string;
  creator?: string | string[];
  subject?: string | string[];
};

const first = (v: string | string[] | undefined, fallback: string) =>
  (Array.isArray(v) ? v[0] : v) ?? fallback;

const list = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v : v ? [v] : []).flatMap(s => String(s).split(/[,;]/)).map(s => s.trim()).filter(Boolean);

/** "1:23:07" or "5256" seconds -> "1h 23m" */
function runtimeLabel(raw: string | undefined): string {
  if (!raw) return "Feature";
  const parts = raw.split(":").map(Number);
  let secs = 0;
  if (parts.length === 3 && parts.every(n => !Number.isNaN(n))) secs = parts[0]! * 3600 + parts[1]! * 60 + parts[2]!;
  else if (parts.length === 2 && parts.every(n => !Number.isNaN(n))) secs = parts[0]! * 60 + parts[1]!;
  else if (!Number.isNaN(Number(raw))) secs = Number(raw);
  if (!secs) return "Feature";
  const h = Math.floor(secs / 3600);
  const m = Math.round((secs % 3600) / 60);
  return h ? `${h}h ${m.toString().padStart(2, "0")}m` : `${m} min`;
}

function toMedia(doc: Doc): Media | null {
  const id = doc.identifier;
  if (!id) return null;
  const year = Number(doc.year);
  const rating = Number(doc.avg_rating);
  const img = `https://archive.org/services/img/${encodeURIComponent(id)}`;
  const description = String(first(doc.description, "A film from the Internet Archive's open film library."))
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 600);
  return {
    id: `ia-${id}`,
    slug: `ia-${id}`,
    type: "movie",
    title: String(doc.title ?? id),
    year: Number.isFinite(year) && year > 1800 ? year : 0,
    rating: Number.isFinite(rating) && rating > 0 ? Math.round(rating * 20) / 10 : 0,
    runtime: runtimeLabel(doc.runtime),
    genres: list(doc.subject).slice(0, 3),
    description,
    poster: img,
    backdrop: img,
    director: first(doc.creator, "Unknown"),
    cast: [],
    ageRating: "NR",
    providers: [
      { name: "Internet Archive", type: "stream", url: `https://archive.org/details/${encodeURIComponent(id)}` },
    ],
  };
}

async function fetchJson(url: string) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Film library unavailable (${res.status})`);
  return res.json() as Promise<Record<string, unknown>>;
}

const BLOCKED = /nudie|adult film|pornog|erotic|xxx/i;

async function query(expr: string): Promise<Doc[]> {
  const collections = `(${COLLECTIONS.map(c => `collection:(${c})`).join(" OR ")})`;
  const params = new URLSearchParams({ q: `${expr} AND mediatype:(movies) AND ${collections}`, rows: "40", output: "json", sort: "downloads desc" });
  for (const f of ["identifier", "title", "year", "description", "avg_rating", "runtime", "creator", "subject"]) params.append("fl[]", f);
  const json = await fetchJson(`https://archive.org/advancedsearch.php?${params.toString()}`);
  return (json["response"] as { docs?: Doc[] } | undefined)?.docs ?? [];
}

/** Search the open film library by title, then by description if a title search is thin. */
export const searchOpenFilms = createServerFn({ method: "GET" })
  .inputValidator((input: { q: string }) => ({ q: String(input?.q ?? "").trim().slice(0, 80) }))
  .handler(async ({ data }): Promise<Media[]> => {
    if (data.q.length < 2) return [];
    const safe = data.q.replace(/[^\p{L}\p{N} '&-]/gu, " ").trim();
    if (!safe) return [];
    try {
      let docs = await query(`title:(${safe})`);
      if (docs.length < 8) docs = [...docs, ...await query(`description:(${safe})`)];
      const seen = new Set<string>();
      return docs
        .map(toMedia)
        .filter((m): m is Media => Boolean(m))
        .filter(m => !BLOCKED.test(`${m.title} ${m.genres.join(" ")}`))
        .filter(m => (seen.has(m.slug) || seen.has(m.title.toLowerCase()) ? false : (seen.add(m.slug), seen.add(m.title.toLowerCase()), true)))
        .slice(0, 40);
    } catch {
      return [];
    }
  });

const VIDEO_FORMATS = ["h.264", "h.264 IA", "MPEG4", "512Kb MPEG4", "HiRes MPEG4", "Ogg Video", "WebM"];

/** Full record for one open-library film, including its playable video file. */
export const getOpenFilm = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => ({ slug: String(input?.slug ?? "").replace(/^ia-/, "").slice(0, 120) }))
  .handler(async ({ data }): Promise<Media | null> => {
    if (!data.slug) return null;
    const id = data.slug;
    try {
      const meta = await fetchJson(`https://archive.org/metadata/${encodeURIComponent(id)}`);
      const m = (meta["metadata"] ?? {}) as Doc & { runtime?: string };
      const files = (meta["files"] ?? []) as Array<{ name?: string; format?: string; length?: string }>;
      const base = toMedia({ ...m, identifier: id });
      if (!base) return null;
      const pick =
        files.find(f => f.format && VIDEO_FORMATS.slice(0, 3).includes(f.format)) ??
        files.find(f => f.format && VIDEO_FORMATS.includes(f.format)) ??
        files.find(f => /\.(mp4|webm|ogv)$/i.test(f.name ?? ""));
      if (!pick?.name) return base;
      return {
        ...base,
        runtime: runtimeLabel(m.runtime ?? pick.length),
        full: `https://archive.org/download/${encodeURIComponent(id)}/${encodeURIComponent(pick.name)}`,
      };
    } catch {
      return null;
    }
  });

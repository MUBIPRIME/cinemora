import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { catalog, genres } from "@/data/catalog";
import { MediaCard } from "@/components/media/MediaCard";
import { Page } from "@/components/layout/Page";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { searchOpenFilms } from "@/lib/search.functions";

export const Route = createFileRoute('/search')({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s['q'] === 'string' ? s['q'] : '',
    genre: typeof s['genre'] === 'string' ? s['genre'] : 'all',
    sort: typeof s['sort'] === 'string' ? s['sort'] : 'popularity',
  }),
  head: () => ({ meta: [
    { title: 'Search — CINEMORA' },
    { name: 'description', content: 'Search thousands of films — the CINEMORA library plus the open film archive.' },
    { property: 'og:title', content: 'Search — CINEMORA' },
    { property: 'og:description', content: 'Search thousands of films — the CINEMORA library plus the open film archive.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: SearchPage,
});

function useDebounced(value: string, ms = 450) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t) }, [value, ms]);
  return v;
}

function SearchPage() {
  const s = Route.useSearch();
  const nav = useNavigate({ from: '/search' });
  const q = useDebounced(s.q.trim());

  let local = catalog.filter(x =>
    (!s.q || `${x.title} ${x.cast.join(' ')}`.toLowerCase().includes(s.q.toLowerCase())) &&
    (s.genre === 'all' || x.genres.includes(s.genre)));
  local = [...local].sort((a, b) => s.sort === 'title' ? a.title.localeCompare(b.title) : s.sort === 'rating' ? b.rating - a.rating : b.year - a.year);

  const open = useQuery({
    queryKey: ['open-films', q],
    queryFn: () => searchOpenFilms({ data: { q } }),
    enabled: q.length > 1,
    staleTime: 5 * 60_000,
  });

  const openResults = (open.data ?? []).filter(x => s.genre === 'all' || x.genres.some(g => g.toLowerCase() === s.genre.toLowerCase()));
  const nothing = !local.length && !openResults.length && !open.isFetching;

  return <Page eyebrow="Discover" title="Search">
    <div className="relative">
      <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
      <Input value={s.q} onChange={e => nav({ search: p => ({ ...p, q: e.target.value }) })} className="h-14 pl-12 text-base" placeholder="Search any movie by title..." aria-label="Search any movie by title" />
      {open.isFetching && <Loader2 className="absolute right-4 top-1/2 size-5 -translate-y-1/2 animate-spin text-muted-foreground" aria-hidden />}
    </div>
    <div className="mt-4 flex flex-wrap gap-3">
      <Select value={s.genre} onValueChange={genre => nav({ search: p => ({ ...p, genre }) })}>
        <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="all">All genres</SelectItem>{genres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={s.sort} onValueChange={sort => nav({ search: p => ({ ...p, sort }) })}>
        <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="popularity">Release date</SelectItem><SelectItem value="rating">Rating</SelectItem><SelectItem value="title">Title</SelectItem></SelectContent>
      </Select>
    </div>

    {local.length > 0 && <>
      <h2 className="mt-8 text-sm font-semibold uppercase tracking-widest text-muted-foreground">In the CINEMORA library</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {local.map(x => <MediaCard key={x.id} media={x} />)}
      </div>
    </>}

    {q.length > 1 && <section className="mt-10">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">More films — open archive</h2>
      <p className="mt-1 text-sm text-muted-foreground">Thousands of freely licensed films that play in full inside CINEMORA.</p>
      {open.isFetching && !open.data
        ? <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="aspect-[2/3] animate-pulse rounded-md bg-muted" />)}</div>
        : open.isError
          ? <EmptyState title="Search is unavailable right now." description="Check your connection, then try again." />
          : openResults.length
            ? <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{openResults.map(x => <MediaCard key={x.id} media={x} />)}</div>
            : <p className="mt-4 text-sm text-muted-foreground">No extra matches for “{q}”.</p>}
    </section>}

    {nothing && <EmptyState title="No stories found." description="Try a different title or spelling." />}
  </Page>;
}

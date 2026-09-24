import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/layout/Page";
import { MediaCard } from "@/components/media/MediaCard";
import { publicDomainFilms } from "@/data/publicDomain";

export const Route = createFileRoute('/free-movies')({
  head: () => ({
    meta: [
      { title: 'Free Full Movies — CINEMORA' },
      { name: 'description', content: 'Watch classic public-domain films in full on CINEMORA, streamed free and legally from the Internet Archive.' },
      { property: 'og:title', content: 'Free Full Movies — CINEMORA' },
      { property: 'og:description', content: 'Classic public-domain films you can watch end to end, free and legal.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: FreeMovies,
});

function FreeMovies() {
  return <Page
    eyebrow="Watch free"
    title="Full films, free and legal"
    description="These classics are in the public domain, so you can watch every one of them end to end right here. Everything else in the library stays a preview with links to the services that hold the rights."
  >
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
      {publicDomainFilms.map(m => <MediaCard key={m.id} media={m} />)}
    </div>
    <p className="mt-10 text-sm text-muted-foreground">
      Streams are served by the Internet Archive. Playback quality depends on your connection.
    </p>
  </Page>;
}

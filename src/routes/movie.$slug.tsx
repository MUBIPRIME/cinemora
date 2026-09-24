import { createFileRoute, notFound } from "@tanstack/react-router";
import { catalog } from "@/data/catalog";
import { DetailsPage } from "@/components/media/DetailsPage";
import { getOpenFilm } from "@/lib/search.functions";

export const Route = createFileRoute('/movie/$slug')({
  loader: async ({ params }) => {
    const m = catalog.find(x => x.slug === params.slug && x.type === 'movie');
    if (m) return m;
    if (params.slug.startsWith('ia-')) {
      const remote = await getOpenFilm({ data: { slug: params.slug } });
      if (remote) return remote;
    }
    throw notFound();
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? 'Movie'} — CINEMORA` },
      { name: 'description', content: loaderData?.description ?? 'Movie details.' },
      { property: 'og:title', content: `${loaderData?.title ?? 'Movie'} — CINEMORA` },
      { property: 'og:description', content: loaderData?.description ?? 'Movie details.' },
      { property: 'og:type', content: 'video.movie' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    scripts: loaderData ? [{ type: 'application/ld+json', children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Movie', name: loaderData.title, dateCreated: String(loaderData.year), director: { '@type': 'Person', name: loaderData.director } }) }] : [],
  }),
  component: () => <DetailsPage media={Route.useLoaderData()} />,
});

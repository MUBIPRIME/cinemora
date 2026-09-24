import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Sparkle, Wand2 } from "lucide-react";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaCard } from "@/components/media/MediaCard";
import { catalog } from "@/data/catalog";
import { recommendTitles, type RecommendResult } from "@/lib/recommend.functions";

export const Route = createFileRoute('/discover')({
  head: () => ({ meta: [{ title: 'Find something to watch — CINEMORA' }, { name: 'description', content: 'Describe the mood you are in and let CINEMORA suggest films, series and trailers from its library.' }, { property: 'og:title', content: 'Find something to watch — CINEMORA' }, { property: 'og:description', content: 'Describe the mood you are in and let CINEMORA suggest films, series and trailers from its library.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Discover,
});

const IDEAS = [
  "A mind-bending sci-fi epic for a rainy Sunday",
  "Something funny and heartfelt with family chaos",
  "A tense thriller with a brilliant villain",
  "Beautiful animation the whole family can enjoy",
];

function Discover() {
  const [prompt, setPrompt] = useState("");
  const run = useServerFn(recommendTitles);
  const { mutate, data, isPending, error } = useMutation<RecommendResult, Error, string>({
    mutationFn: (p: string) => run({ data: { prompt: p } }),
  });
  const submit = (p: string) => { const v = p.trim(); if (v.length > 1) { setPrompt(v); mutate(v) } };

  return <Page eyebrow="Concierge" title="Tell us what you feel like watching">
    <form className="max-w-2xl" onSubmit={e => { e.preventDefault(); submit(prompt) }}>
      <label htmlFor="mood" className="text-sm text-muted-foreground">Describe a mood, a theme, or a night in</label>
      <Textarea id="mood" value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} maxLength={500} className="mt-2" placeholder="Something hopeful about space, with a great score…" />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="submit" disabled={isPending || prompt.trim().length < 2}><Wand2 />{isPending ? "Finding titles…" : "Find my picks"}</Button>
        {IDEAS.map(i => <Button key={i} type="button" variant="glass" size="sm" onClick={() => submit(i)}>{i}</Button>)}
      </div>
    </form>

    {isPending && <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{[0, 1, 2, 3].map(i => <div key={i}><Skeleton className="aspect-[2/3] w-full rounded-md" /><Skeleton className="mt-2 h-4 w-3/4" /></div>)}</div>}

    {error && <div className="mt-8 rounded-md border border-border bg-card p-5"><p className="text-sm">{error.message}</p><Button className="mt-3" variant="glass" size="sm" onClick={() => submit(prompt)}>Try again</Button></div>}

    {data && !isPending && <section className="mt-10">
      {data.note && <p className="flex items-start gap-2 text-muted-foreground"><Sparkle className="mt-1 size-4 text-primary" />{data.note}</p>}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.picks.map(p => { const m = catalog.find(x => x.id === p.id); return m ? <div key={p.id} className="flex gap-4"><MediaCard media={m} /><p className="pt-1 text-sm text-muted-foreground">{p.reason}</p></div> : null })}
      </div>
    </section>}
  </Page>;
}

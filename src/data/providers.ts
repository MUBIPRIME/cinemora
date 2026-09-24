import type { Provider } from "@/types/media";

/** Official destinations. Each link opens the service's own site, pre-filled with
 *  the title, so viewers land on the real page even as catalogues rotate. */
const SERVICES = {
  netflix: { name: "Netflix", type: "stream", url: (t: string) => `https://www.netflix.com/search?q=${encodeURIComponent(t)}` },
  prime: { name: "Prime Video", type: "stream", url: (t: string) => `https://www.amazon.com/s?i=instant-video&k=${encodeURIComponent(t)}` },
  max: { name: "HBO Max", type: "stream", url: (t: string) => `https://play.max.com/search?q=${encodeURIComponent(t)}` },
  hulu: { name: "Hulu", type: "stream", url: (t: string) => `https://www.hulu.com/search?q=${encodeURIComponent(t)}` },
  appletvplus: { name: "Apple TV+", type: "stream", url: (t: string) => `https://tv.apple.com/search?term=${encodeURIComponent(t)}` },
  peacock: { name: "Peacock", type: "stream", url: (t: string) => `https://www.peacocktv.com/search/result?q=${encodeURIComponent(t)}` },
  paramount: { name: "Paramount+", type: "stream", url: (t: string) => `https://www.paramountplus.com/search/?q=${encodeURIComponent(t)}` },
  apple: { name: "Apple TV", type: "rent", url: (t: string) => `https://tv.apple.com/search?term=${encodeURIComponent(t)}` },
  youtube: { name: "YouTube", type: "buy", url: (t: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(`${t} full movie`)}&sp=EgIQBA%253D%253D` },
  googletv: { name: "Google TV", type: "buy", url: (t: string) => `https://tv.google.com/search?q=${encodeURIComponent(t)}` },
} as const;

export type ServiceKey = keyof typeof SERVICES;

/** Build the Where to watch cards for a title. */
export function watchOn(title: string, keys: ServiceKey[]): Provider[] {
  return keys.map(k => {
    const s = SERVICES[k];
    return { name: s.name, type: s.type as Provider["type"], url: s.url(title) };
  });
}

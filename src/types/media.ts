export type MediaType = "movie" | "tv";
export type Provider = { name: string; type: "stream" | "rent" | "buy"; url: string };
export type Episode = { id: string; number: number; title: string; runtime: string; description: string };
export type Media = {
  id: string; slug: string; type: MediaType; title: string; year: number; rating: number;
  runtime: string; genres: string[]; description: string; backdrop: string; poster: string;
  director: string; cast: string[]; ageRating: string; featured?: boolean; trending?: boolean;
  seasons?: number | undefined; episodes?: Episode[] | undefined; trailer?: string | undefined; youtube?: string | undefined; full?: string | undefined; providers: Provider[];
};
export type Profile = { id: string; name: string; initials: string; color: string };

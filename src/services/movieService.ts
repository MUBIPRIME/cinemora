import { catalog } from "@/data/catalog";
import type { Media } from "@/types/media";
const key = import.meta.env["VITE_TMDB_API_KEY"];
const base = "https://api.themoviedb.org/3";
const cache = new Map<string, unknown>();
async function tmdb(path:string){ if(!key) return null; if(cache.has(path)) return cache.get(path); try { const r=await fetch(`${base}${path}${path.includes("?")?"&":"?"}api_key=${key}`); if(!r.ok) throw new Error("Movie service unavailable"); const d=await r.json(); cache.set(path,d); return d; } catch { return null; }}
const movies=()=>catalog.filter(x=>x.type==="movie");
export const movieService = {
 getTrendingMovies: async()=>{await tmdb("/trending/movie/week"); return movies().filter(x=>x.trending)},
 getPopularMovies: async()=>{await tmdb("/movie/popular"); return movies().slice().sort((a,b)=>b.rating-a.rating)},
 getTopRatedMovies: async()=>movies().filter(x=>x.rating>=8.2),
 getUpcomingMovies: async()=>movies().filter(x=>x.year>=2026),
 getNowPlayingMovies: async()=>movies().filter(x=>x.year>=2025),
 getMoviesByGenre: async(genre:string)=>movies().filter(x=>x.genres.some(g=>g.toLowerCase()===genre.toLowerCase())),
 searchMovies: async(q:string)=>catalog.filter(x=>`${x.title} ${x.cast.join(" ")} ${x.genres.join(" ")}`.toLowerCase().includes(q.toLowerCase())),
 getMovieDetails: async(slug:string)=>catalog.find(x=>x.slug===slug),
 getSimilarMovies: async(slug:string)=>{const m=catalog.find(x=>x.slug===slug); return m?catalog.filter(x=>x.id!==m.id&&x.genres.some(g=>m.genres.includes(g))).slice(0,8):[]},
 getMovieRecommendations: async(slug:string)=>{const m=catalog.find(x=>x.slug===slug); return catalog.filter(x=>x.id!==m?.id).sort((a,b)=>b.rating-a.rating).slice(0,8)},
 getTVShows: async()=>catalog.filter(x=>x.type==="tv"), getTVShowDetails: async(slug:string)=>catalog.find(x=>x.type==="tv"&&x.slug===slug),
};
export type MovieService = typeof movieService;

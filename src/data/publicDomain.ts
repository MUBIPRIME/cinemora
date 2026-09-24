import type { Media, Provider } from "@/types/media";
import nosferatuPoster from "@/assets/cinemora/pd/nosferatu-poster.jpg.asset.json";
import nosferatuBackdrop from "@/assets/cinemora/pd/nosferatu-backdrop.jpg.asset.json";
import nldPoster from "@/assets/cinemora/pd/night-living-dead-poster.jpg.asset.json";
import nldBackdrop from "@/assets/cinemora/pd/night-living-dead-backdrop.jpg.asset.json";
import carnivalPoster from "@/assets/cinemora/pd/carnival-of-souls-poster.jpg.asset.json";
import carnivalBackdrop from "@/assets/cinemora/pd/carnival-of-souls-backdrop.jpg.asset.json";
import detourPoster from "@/assets/cinemora/pd/detour-poster.jpg.asset.json";
import detourBackdrop from "@/assets/cinemora/pd/detour-backdrop.jpg.asset.json";
import generalPoster from "@/assets/cinemora/pd/the-general-poster.jpg.asset.json";
import generalBackdrop from "@/assets/cinemora/pd/the-general-backdrop.jpg.asset.json";
import phantomPoster from "@/assets/cinemora/pd/phantom-opera-poster.jpg.asset.json";
import phantomBackdrop from "@/assets/cinemora/pd/phantom-opera-backdrop.jpg.asset.json";

const art = (a: { url: string }) => a.url;
const archive = (id: string, file: string) =>
  `https://archive.org/download/${id}/${encodeURIComponent(file)}`;
const source = (id: string): Provider[] => [
  { name: "Internet Archive", type: "stream", url: `https://archive.org/details/${id}` },
];

/** Films in the public domain (or released under a public-domain dedication),
 *  streamed in full from the Internet Archive. */
export const publicDomainFilms: Media[] = [
  {
    id: "pd-nosferatu", slug: "nosferatu-1922", type: "movie", title: "Nosferatu", year: 1922,
    rating: 7.9, runtime: "1h 34m", genres: ["Horror", "Fantasy"], ageRating: "PG",
    description: "F. W. Murnau's silent vampire film, an expressionist landmark whose shadows and stark compositions shaped a century of horror cinema.",
    poster: art(nosferatuPoster), backdrop: art(nosferatuBackdrop),
    director: "F. W. Murnau", cast: ["Max Schreck", "Gustav von Wangenheim", "Greta Schröder"],
    full: archive("Nosferatu1922", "Nosferatu-smaller2.mp4"), providers: source("Nosferatu1922"),
  },
  {
    id: "pd-notld", slug: "night-of-the-living-dead-1968", type: "movie", title: "Night of the Living Dead", year: 1968,
    rating: 7.8, runtime: "1h 36m", genres: ["Horror", "Thriller"], ageRating: "16+",
    description: "George A. Romero's low-budget debut trapped strangers in a farmhouse and invented the modern zombie film in the process.",
    poster: art(nldPoster), backdrop: art(nldBackdrop),
    director: "George A. Romero", cast: ["Duane Jones", "Judith O'Dea", "Karl Hardman"],
    full: archive("night-of-the-living-dead-1968_202607", "Night of the Living Dead 1968.mp4"),
    providers: source("night-of-the-living-dead-1968_202607"),
  },
  {
    id: "pd-carnival", slug: "carnival-of-souls-1962", type: "movie", title: "Carnival of Souls", year: 1962,
    rating: 7.1, runtime: "1h 18m", genres: ["Horror", "Mystery"], ageRating: "12+",
    description: "A dreamlike cult chiller following an organist drawn toward an abandoned pavilion, shot on a shoestring and remembered for its eerie atmosphere.",
    poster: art(carnivalPoster), backdrop: art(carnivalBackdrop),
    director: "Herk Harvey", cast: ["Candace Hilligoss", "Frances Feist", "Sidney Berger"],
    full: archive("CarnivalOfSouls720p1962", "CarnivalOfSouls720p.mp4"),
    providers: source("CarnivalOfSouls720p1962"),
  },
  {
    id: "pd-detour", slug: "detour-1945", type: "movie", title: "Detour", year: 1945,
    rating: 7.2, runtime: "1h 8m", genres: ["Crime", "Drama", "Thriller"], ageRating: "12+",
    description: "A lean, fatalistic road noir about a pianist hitchhiking west whose luck keeps turning the wrong way.",
    poster: art(detourPoster), backdrop: art(detourBackdrop),
    director: "Edgar G. Ulmer", cast: ["Tom Neal", "Ann Savage", "Claudia Drake"],
    full: archive("detour-1945_202310", "Detour (1945).mp4"), providers: source("detour-1945_202310"),
  },
  {
    id: "pd-general", slug: "the-general-1926", type: "movie", title: "The General", year: 1926,
    rating: 8.1, runtime: "1h 18m", genres: ["Comedy", "Adventure", "War"], ageRating: "PG",
    description: "Buster Keaton's silent action comedy built around a locomotive chase, celebrated for stunts performed entirely for real.",
    poster: art(generalPoster), backdrop: art(generalBackdrop),
    director: "Buster Keaton", cast: ["Buster Keaton", "Marion Mack", "Glen Cavender"],
    full: archive("TheGeneral1926", "The_General_1926_720p_512kb.mp4"), providers: source("TheGeneral1926"),
  },
  {
    id: "pd-phantom", slug: "the-phantom-of-the-opera-1925", type: "movie", title: "The Phantom of the Opera", year: 1925,
    rating: 7.5, runtime: "1h 33m", genres: ["Horror", "Drama"], ageRating: "PG",
    description: "A silent gothic spectacle set beneath the Paris Opera House, famous for Lon Chaney's self-designed makeup and its grand set pieces.",
    poster: art(phantomPoster), backdrop: art(phantomBackdrop),
    director: "Rupert Julian", cast: ["Lon Chaney", "Mary Philbin", "Norman Kerry"],
    full: archive("the-phantom-of-the-opera-1925_202505", "The Phantom of the Opera (1925).mp4"),
    providers: source("the-phantom-of-the-opera-1925_202505"),
  },
];

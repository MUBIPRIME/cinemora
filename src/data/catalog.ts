import dune_part_twoPoster from "@/assets/cinemora/real/dune-part-two-poster.jpg.asset.json";
import dune_part_twoBackdrop from "@/assets/cinemora/real/dune-part-two-backdrop.jpg.asset.json";
import oppenheimerPoster from "@/assets/cinemora/real/oppenheimer-poster.jpg.asset.json";
import oppenheimerBackdrop from "@/assets/cinemora/real/oppenheimer-backdrop.jpg.asset.json";
import the_batmanPoster from "@/assets/cinemora/real/the-batman-poster.jpg.asset.json";
import the_batmanBackdrop from "@/assets/cinemora/real/the-batman-backdrop.jpg.asset.json";
import interstellarPoster from "@/assets/cinemora/real/interstellar-poster.jpg.asset.json";
import interstellarBackdrop from "@/assets/cinemora/real/interstellar-backdrop.jpg.asset.json";
import everything_everywherePoster from "@/assets/cinemora/real/everything-everywhere-poster.jpg.asset.json";
import everything_everywhereBackdrop from "@/assets/cinemora/real/everything-everywhere-backdrop.jpg.asset.json";
import spider_versePoster from "@/assets/cinemora/real/spider-verse-poster.jpg.asset.json";
import spider_verseBackdrop from "@/assets/cinemora/real/spider-verse-backdrop.jpg.asset.json";
import top_gun_maverickPoster from "@/assets/cinemora/real/top-gun-maverick-poster.jpg.asset.json";
import top_gun_maverickBackdrop from "@/assets/cinemora/real/top-gun-maverick-backdrop.jpg.asset.json";
import barbiePoster from "@/assets/cinemora/real/barbie-poster.jpg.asset.json";
import barbieBackdrop from "@/assets/cinemora/real/barbie-backdrop.jpg.asset.json";
import john_wick_4Poster from "@/assets/cinemora/real/john-wick-4-poster.jpg.asset.json";
import john_wick_4Backdrop from "@/assets/cinemora/real/john-wick-4-backdrop.jpg.asset.json";
import boy_and_heronPoster from "@/assets/cinemora/real/boy-and-heron-poster.jpg.asset.json";
import boy_and_heronBackdrop from "@/assets/cinemora/real/boy-and-heron-backdrop.jpg.asset.json";
import godzilla_minus_onePoster from "@/assets/cinemora/real/godzilla-minus-one-poster.jpg.asset.json";
import godzilla_minus_oneBackdrop from "@/assets/cinemora/real/godzilla-minus-one-backdrop.jpg.asset.json";
import the_creatorPoster from "@/assets/cinemora/real/the-creator-poster.jpg.asset.json";
import the_creatorBackdrop from "@/assets/cinemora/real/the-creator-backdrop.jpg.asset.json";
import shogunPoster from "@/assets/cinemora/real/shogun-poster.jpg.asset.json";
import shogunBackdrop from "@/assets/cinemora/real/shogun-backdrop.jpg.asset.json";
import last_of_usPoster from "@/assets/cinemora/real/last-of-us-poster.jpg.asset.json";
import last_of_usBackdrop from "@/assets/cinemora/real/last-of-us-backdrop.jpg.asset.json";
import severancePoster from "@/assets/cinemora/real/severance-poster.jpg.asset.json";
import severanceBackdrop from "@/assets/cinemora/real/severance-backdrop.jpg.asset.json";
import type { Media, Profile } from "@/types/media";
import { watchOn } from "./providers";
import { publicDomainFilms } from "./publicDomain";

const art = (asset: { url: string }) => asset.url;
const episodes = (prefix: string, titles: string[]) => titles.map((title, index) => ({
  id: `${prefix}-${index + 1}`,
  number: index + 1,
  title,
  runtime: "52 min",
  description: "Watch this episode and continue the story.",
}));

export const catalog: Media[] = [
  ...publicDomainFilms,
  { id:"693134", slug:"dune-part-two", type:"movie", title:"Dune: Part Two", year:2024, rating:8.5, runtime:"2h 47m", genres:["Science Fiction","Adventure","Drama"], description:"Paul Atreides unites with Chani and the Fremen while seeking revenge against those who destroyed his family, facing a choice between love and the fate of the universe.", poster:art(dune_part_twoPoster), backdrop:art(dune_part_twoBackdrop), director:"Denis Villeneuve", cast:["Timothée Chalamet","Zendaya","Rebecca Ferguson","Javier Bardem"], ageRating:"13+", featured:true, trending:true, providers:watchOn("Dune: Part Two",["max","apple","youtube","googletv"]), youtube:"Way9Dexny3w" },
  { id:"872585", slug:"oppenheimer", type:"movie", title:"Oppenheimer", year:2023, rating:8.3, runtime:"3h 01m", genres:["Drama","History"], description:"The story of J. Robert Oppenheimer and his role in developing the atomic bomb during World War II.", poster:art(oppenheimerPoster), backdrop:art(oppenheimerBackdrop), director:"Christopher Nolan", cast:["Cillian Murphy","Emily Blunt","Matt Damon","Robert Downey Jr."], ageRating:"16+", featured:true, trending:true, providers:watchOn("Oppenheimer",["peacock","prime","apple","youtube"]), youtube:"uYPbbksJxIg" },
  { id:"414906", slug:"the-batman", type:"movie", title:"The Batman", year:2022, rating:7.9, runtime:"2h 57m", genres:["Crime","Mystery","Thriller"], description:"In his second year of fighting crime, Batman uncovers corruption in Gotham City while pursuing a serial killer known as the Riddler.", poster:art(the_batmanPoster), backdrop:art(the_batmanBackdrop), director:"Matt Reeves", cast:["Robert Pattinson","Zoë Kravitz","Jeffrey Wright","Paul Dano"], ageRating:"16+", featured:true, trending:true, providers:watchOn("The Batman",["max","apple","youtube","googletv"]), youtube:"mqqft2x_Aa4" },
  { id:"157336", slug:"interstellar", type:"movie", title:"Interstellar", year:2014, rating:8.7, runtime:"2h 49m", genres:["Science Fiction","Adventure","Drama"], description:"Explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", poster:art(interstellarPoster), backdrop:art(interstellarBackdrop), director:"Christopher Nolan", cast:["Matthew McConaughey","Anne Hathaway","Jessica Chastain","Michael Caine"], ageRating:"13+", featured:true, trending:true, providers:watchOn("Interstellar",["paramount","prime","apple","youtube"]), youtube:"zSWdZVtXT7E" },
  { id:"545611", slug:"everything-everywhere-all-at-once", type:"movie", title:"Everything Everywhere All at Once", year:2022, rating:7.8, runtime:"2h 20m", genres:["Science Fiction","Comedy","Action"], description:"An overwhelmed laundromat owner is swept into a wild adventure where she alone can save existence by connecting with lives she could have led.", poster:art(everything_everywherePoster), backdrop:art(everything_everywhereBackdrop), director:"Daniel Kwan & Daniel Scheinert", cast:["Michelle Yeoh","Ke Huy Quan","Stephanie Hsu","Jamie Lee Curtis"], ageRating:"16+", trending:true, providers:watchOn("Everything Everywhere All at Once",["netflix","prime","apple","youtube"]), youtube:"wxN1T1uxQ2g" },
  { id:"569094", slug:"spider-man-across-the-spider-verse", type:"movie", title:"Spider-Man: Across the Spider-Verse", year:2023, rating:8.4, runtime:"2h 20m", genres:["Animation","Action","Adventure"], description:"Miles Morales journeys across the Multiverse and meets a team of Spider-People charged with protecting its very existence.", poster:art(spider_versePoster), backdrop:art(spider_verseBackdrop), director:"Joaquim Dos Santos, Kemp Powers & Justin K. Thompson", cast:["Shameik Moore","Hailee Steinfeld","Brian Tyree Henry","Luna Lauren Vélez"], ageRating:"13+", trending:true, providers:watchOn("Spider-Man: Across the Spider-Verse",["netflix","prime","apple","youtube"]), youtube:"cqGjhVJWtEg" },
  { id:"361743", slug:"top-gun-maverick", type:"movie", title:"Top Gun: Maverick", year:2022, rating:8.2, runtime:"2h 11m", genres:["Action","Drama","Adventure"], description:"After decades as a top naval aviator, Maverick confronts his past while training elite graduates for a dangerous mission.", poster:art(top_gun_maverickPoster), backdrop:art(top_gun_maverickBackdrop), director:"Joseph Kosinski", cast:["Tom Cruise","Miles Teller","Jennifer Connelly","Jon Hamm"], ageRating:"13+", trending:true, providers:watchOn("Top Gun: Maverick",["paramount","prime","apple","youtube"]), youtube:"qSqVVswa420" },
  { id:"346698", slug:"barbie", type:"movie", title:"Barbie", year:2023, rating:7.0, runtime:"1h 54m", genres:["Comedy","Adventure","Fantasy"], description:"Barbie and Ken leave the perfection of Barbie Land and discover the joys and complications of the real world.", poster:art(barbiePoster), backdrop:art(barbieBackdrop), director:"Greta Gerwig", cast:["Margot Robbie","Ryan Gosling","America Ferrera","Kate McKinnon"], ageRating:"13+", trending:true, providers:watchOn("Barbie",["max","apple","youtube","googletv"]), youtube:"pBk4NYhWNMM" },
  { id:"603692", slug:"john-wick-chapter-4", type:"movie", title:"John Wick: Chapter 4", year:2023, rating:7.8, runtime:"2h 50m", genres:["Action","Crime","Thriller"], description:"John Wick uncovers a path to defeating the High Table, but must face a powerful new enemy with alliances across the globe.", poster:art(john_wick_4Poster), backdrop:art(john_wick_4Backdrop), director:"Chad Stahelski", cast:["Keanu Reeves","Donnie Yen","Bill Skarsgård","Laurence Fishburne"], ageRating:"18+", providers:watchOn("John Wick: Chapter 4",["peacock","prime","apple","youtube"]), youtube:"qEVUtrk8_B4" },
  { id:"508883", slug:"the-boy-and-the-heron", type:"movie", title:"The Boy and the Heron", year:2023, rating:7.5, runtime:"2h 04m", genres:["Animation","Adventure","Fantasy"], description:"A young boy enters a dreamlike world shared by the living and the dead after encountering a mysterious talking heron.", poster:art(boy_and_heronPoster), backdrop:art(boy_and_heronBackdrop), director:"Hayao Miyazaki", cast:["Soma Santoki","Masaki Suda","Ko Shibasaki","Aimyon"], ageRating:"13+", providers:watchOn("The Boy and the Heron",["max","apple","youtube","googletv"]), youtube:"t5khm-VjEu4" },
  { id:"940721", slug:"godzilla-minus-one", type:"movie", title:"Godzilla Minus One", year:2023, rating:7.6, runtime:"2h 05m", genres:["Science Fiction","Horror","Action"], description:"In postwar Japan, a traumatized former pilot joins civilians fighting a colossal monster that threatens their devastated country.", poster:art(godzilla_minus_onePoster), backdrop:art(godzilla_minus_oneBackdrop), director:"Takashi Yamazaki", cast:["Ryunosuke Kamiki","Minami Hamabe","Yuki Yamada","Munetaka Aoki"], ageRating:"13+", providers:watchOn("Godzilla Minus One",["netflix","prime","apple","youtube"]), youtube:"r7DqccP1Q_4" },
  { id:"670292", slug:"the-creator", type:"movie", title:"The Creator", year:2023, rating:7.1, runtime:"2h 14m", genres:["Science Fiction","Action","Thriller"], description:"A former special-forces agent is recruited to hunt down the mysterious creator of an advanced artificial intelligence.", poster:art(the_creatorPoster), backdrop:art(the_creatorBackdrop), director:"Gareth Edwards", cast:["John David Washington","Madeleine Yuna Voyles","Gemma Chan","Ken Watanabe"], ageRating:"13+", providers:watchOn("The Creator",["hulu","prime","apple","youtube"]), youtube:"ex3C1-5Dhb8" },
  { id:"126308", slug:"shogun", type:"tv", title:"Shōgun", year:2024, rating:8.5, runtime:"58m", genres:["Drama","War","History"], description:"In feudal Japan, Lord Toranaga fights for his life as his enemies unite and a mysterious European ship is found nearby.", poster:art(shogunPoster), backdrop:art(shogunBackdrop), director:"Rachel Kondo & Justin Marks", cast:["Hiroyuki Sanada","Cosmo Jarvis","Anna Sawai","Tadanobu Asano"], ageRating:"16+", trending:true, seasons:1, providers:watchOn("Shogun",["hulu","prime"]), youtube:"yAN5uspO_hk", episodes:episodes("shogun",["Anjin","Servants of Two Masters","Tomorrow Is Tomorrow","The Eightfold Fence"]) },
  { id:"100088", slug:"the-last-of-us", type:"tv", title:"The Last of Us", year:2023, rating:8.6, runtime:"55m", genres:["Drama","Adventure","Thriller"], description:"A hardened survivor escorts a teenage girl across a devastated America twenty years after modern civilization has been destroyed.", poster:art(last_of_usPoster), backdrop:art(last_of_usBackdrop), director:"Craig Mazin & Neil Druckmann", cast:["Pedro Pascal","Bella Ramsey","Gabriel Luna","Isabela Merced"], ageRating:"18+", trending:true, seasons:2, providers:watchOn("The Last of Us",["max","prime"]), youtube:"uLtkt8BonwM", episodes:episodes("tlou",["When You're Lost in the Darkness","Infected","Long, Long Time","Please Hold to My Hand"]) },
  { id:"95396", slug:"severance", type:"tv", title:"Severance", year:2022, rating:8.7, runtime:"50m", genres:["Science Fiction","Drama","Mystery"], description:"Employees at Lumon Industries undergo a procedure that surgically divides their work memories from their personal lives.", poster:art(severancePoster), backdrop:art(severanceBackdrop), director:"Dan Erickson", cast:["Adam Scott","Britt Lower","Zach Cherry","Patricia Arquette"], ageRating:"16+", featured:true, trending:true, seasons:2, providers:watchOn("Severance",["appletvplus","apple"]), youtube:"xEQP4VVuyrY", episodes:episodes("severance",["Good News About Hell","Half Loop","In Perpetuity","The You You Are"]) },
];

export const profiles: Profile[] = [
  {id:"mubarak",name:"Mubarak",initials:"MK",color:"bg-primary"},
  {id:"aisha",name:"Aisha",initials:"AI",color:"bg-accent"},
  {id:"david",name:"David",initials:"DA",color:"bg-secondary"},
  {id:"sarah",name:"Sarah",initials:"SA",color:"bg-chart-2"},
];
export const genres = ["Action","Adventure","Animation","Comedy","Crime","Documentary","Drama","Fantasy","History","Horror","Mystery","Romance","Science Fiction","Thriller","War"];

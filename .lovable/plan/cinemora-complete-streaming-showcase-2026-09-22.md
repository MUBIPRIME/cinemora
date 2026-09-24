# CINEMORA — Complete Streaming Showcase

## Goal
Build a polished, responsive streaming-discovery demo that feels commercially credible, supports legal trailers and provider links, and remains fully functional without an API key.

## Experience
- Establish CINEMORA’s dark charcoal, burgundy, and restrained purple design system with cinematic typography, selective glass effects, gradients, shadows, focus states, and reduced-motion support.
- Build a shared desktop header, mobile menu, mobile bottom navigation, notification menu, profile switcher, footer, page transitions, loading skeletons, errors, toasts, and accessible dialogs.
- Generate a cohesive original visual set for fictional demo films and shows, ensuring every image is local, optimized, and has a graceful fallback.

## Pages and Navigation
- Home: rotating featured-film banner, movie shelves, continue watching, and personalized “Because You Watched” recommendations.
- Movies, Trending, and TV Shows: curated shelves and responsive grids.
- Genres and genre collections: visual genre explorer plus filterable collection pages.
- Movie details and TV details: metadata, cast/crew, seasons, episodes, recommendations, trailers, and legal provider availability.
- Player: legal/public sample video with custom cinematic controls and an unavailable-source fallback.
- Search: instant suggestions, history, popular searches, URL-backed filters/sorting, result states, and empty/error views.
- My List and Profile: add/remove/search saved titles, progress, recent activity, preferences, and profile switching.
- Authentication screens: login, sign up, and password recovery as clearly labeled demo flows with guest access.
- Plans: Free, Plus, and Ultra comparison without payment processing.
- Admin at `/admin`: mock statistics, charts, movie controls, and user table with working local demo interactions.
- Supporting About, Help, Privacy, Terms, Contact, Careers, and Accessibility pages so every footer link resolves.

## Data and Interactions
- Create typed movie/TV/provider/profile models and a rich fallback catalog with fictional titles, cast, episodes, trailers, and availability.
- Create `movieService.ts` with the requested TMDB-compatible methods, request caching, normalized results, and automatic fallback behavior when `VITE_TMDB_API_KEY` is absent or requests fail.
- Keep API configuration client-safe and document `VITE_TMDB_API_KEY=` in an example environment file.
- Persist My List, playback progress, search history, and active profile in browser storage.
- Implement recommendation scoring from genres, ratings, watched items, and saved items.
- Ensure every visible command works: details, filters, provider links, trailer playback, list changes, notifications, profile switching, forms, player controls, and mock admin actions.

## Technical Structure
- Use TanStack Start’s route system with React 19, TypeScript, Tailwind v4, shadcn components, Lucide icons, TanStack Query, Embla, and Recharts already available in the project.
- Organize reusable layout, media, discovery, player, feedback, admin, hooks, services, data, types, and utility modules.
- Add route-specific metadata for every content page and movie structured data on detail pages.
- Lazy-load images and heavy views, limit initial media requests, cache remote metadata, and avoid loading the full catalog at once.

## Verification
- Verify desktop and mobile layouts with browser screenshots.
- Exercise navigation, search/filtering, details, genre collections, My List persistence, profile switching, trailer playback, player controls, notifications, and admin interactions.
- Check API-off fallback mode, loading/error states, broken images, keyboard focus, console errors, network failures, and all linked destinations.

## Boundaries
- No unauthorized streams, scraping, proprietary brand assets, real authentication, or real payments.
- Provider cards link only to official destinations; regional availability messaging remains visible.
- Demo authentication and admin mutations remain local and are presented as showcase behavior.

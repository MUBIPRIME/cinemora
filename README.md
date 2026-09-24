# Cinemora: Your Streaming Universe

Build a complete, modern, premium movie discovery and streaming-platform showcase website called CINEMORA.

This is a polished sample/demo project intended to showcase what a professional streaming platform could look like. The design should feel as refined and immersive as major streaming services such as Netflix, Disney+, Max, Prime Video, and Hulu, but it must have its own original branding, layout details, typography, components, animations, and visual identity.

1. BRAND IDENTITY

Name: CINEMORA

Tagline:
"Your world of stories, all in one place."

Create a sophisticated cinematic visual identity.

Primary style:

Dark cinematic interface

Black / charcoal background

Deep burgundy and subtle purple accents

White and soft-gray typography

Large cinematic imagery

Glassmorphism used selectively

Subtle gradients

Soft shadows

Smooth transitions

Premium entertainment feel

The website should feel like a real commercial streaming product, not a basic movie listing website.

Use high-quality placeholder movie posters and backdrop images from legal image/metadata sources.

Do NOT use copyrighted Netflix/Disney/Prime branding, logos, proprietary assets, or exact UI copies.

2. TECHNOLOGY

Build the project using:

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

Lucide icons

Responsive design

Modern component architecture

Use clean reusable components.

Organize the project professionally with folders such as:

src/
components/
pages/
layouts/
hooks/
services/
data/
types/
utils/

Create reusable components instead of putting everything into one file.

3. DATA / MOVIE API

Create a movie-service abstraction so the application can retrieve real movie metadata.

Use a legal movie metadata API such as TMDB if an API key is available.

The API layer should support:

Popular movies

Trending movies

Now playing

Upcoming movies

Top rated

Movies by genre

Search

Movie details

Cast

Crew

Similar movies

Recommendations

Trailers

TV shows

TV show details

Seasons and episodes

Create:

movieService.ts

with reusable functions such as:

getTrendingMovies()
getPopularMovies()
getTopRatedMovies()
getUpcomingMovies()
getMoviesByGenre()
searchMovies()
getMovieDetails()
getSimilarMovies()
getMovieRecommendations()

Do not hardcode the entire movie catalog.

If an API key has not been configured, create a beautiful demo/fallback dataset so the website still works perfectly.

Create an easy environment configuration:

VITE_TMDB_API_KEY=

Include a clear setup comment explaining where the developer should put the API key.

Never expose private server-side API secrets unnecessarily.

4. IMPORTANT STREAMING / LEGAL MEDIA BEHAVIOR

The website should NOT scrape pirate websites or embed unauthorized movie streams.

Instead, create a legal streaming experience.

For each movie, display:

Watch Trailer

Where to Watch

Streaming providers

Rent options

Buy options

Official provider links

If a legal playable video/trailer URL is available, allow it to play inside a beautiful cinematic video player.

For unavailable movies, show:

"Streaming availability varies by region."

Add provider cards such as:

Netflix

Prime Video

Disney+

Max

Apple TV

Hulu

YouTube

Google TV

Use these as availability/provider examples and link to official provider destinations when appropriate.

5. HOME PAGE

Create an immersive homepage.

Top navigation:

CINEMORA logo

Navigation:

Home
Movies
TV Shows
Genres
Trending
My List

Right side:

Search icon
Notifications
Profile avatar

Desktop navigation should be elegant and compact.

Mobile navigation should transform into a clean responsive menu.

6. HERO SECTION

Create a huge cinematic hero banner.

The hero should dynamically display a featured movie.

Example fictional movie:

"THE LAST HORIZON"

Genre:
Sci-Fi • Adventure • Drama

Rating:
8.7

Year:
2026

Duration:
2h 18m

Description:

"After humanity receives a mysterious signal from beyond the solar system, a former astronaut is forced back into space to uncover a secret that could redefine the future of civilization."

Buttons:

▶ Watch Trailer
＋ Add to My List
More Info

Use a large cinematic backdrop with:

Gradient overlay

Dark fade toward the bottom

Subtle animated particles

Smooth image transitions

Text animation

Allow the hero carousel to rotate through several movies automatically.

7. MOVIE CAROUSELS

Create professional horizontal movie shelves.

Sections:

Trending Now
Popular Movies
Top Rated
New Releases
Coming Soon
Action
Comedy
Drama
Science Fiction
Horror
Romance
Animation
Thriller
Documentary
Adventure
Crime
Fantasy

Each section should have horizontal scrolling.

Movie cards should include:

Poster

Title

Year

Rating

Genre

Hover animation

On desktop:

Hovering over a card should slightly enlarge it and reveal:

▶ Play Trailer
＋ My List
ⓘ Details

Do not make the animation excessive.

8. MOVIE DETAILS PAGE

Create a dedicated movie details page.

Example:

THE LAST HORIZON

Large cinematic backdrop.

Display:

Poster
Title
Rating
Release year
Runtime
Genres
Age rating
Description
Director
Cast

Buttons:

▶ Watch Trailer
＋ Add to My List
Where to Watch

Then:

"About this movie"

"Cast & Crew"

"Similar Movies"

"More Like This"

"Where to Watch"

Create a provider availability section.

9. VIDEO PLAYER PAGE

Create a premium video player interface.

The page should contain:

Large video player

Controls:

Play/Pause
Volume
Progress bar
Playback speed
Subtitles
Quality
Fullscreen
Picture-in-picture

Add cinematic overlay controls.

Under the player:

Movie title
Description
Cast
Genre
Rating

For the demo, use legal/public-domain/sample video content or trailer URLs.

Create a clean message if a playable source is unavailable:

"Trailer unavailable. View official streaming options."

10. SEARCH

Build a powerful search page.

Search bar:

"Search movies, shows, actors..."

Include:

Instant search suggestions

Search history

Popular searches

Results grid

Filters

Sorting

Filters:

Genre
Year
Rating
Language
Movie / TV
Streaming provider

Sorting:

Popularity
Rating
Release date
Title

Create a beautiful empty state:

"No stories found."

Then suggest related searches.

11. GENRES PAGE

Create a visually impressive genre explorer.

Cards:

Action
Adventure
Animation
Comedy
Crime
Documentary
Drama
Fantasy
Horror
Mystery
Romance
Science Fiction
Thriller
War
Western

Each genre card should have:

Background movie image

Gradient overlay

Genre name

Number of titles

Hover animation

Clicking a genre opens the corresponding movie collection.

12. TV SHOWS

Create a dedicated TV Shows page.

Sections:

Trending Shows
Popular Series
New Episodes
Top Rated Series
Drama
Comedy
Crime
Sci-Fi
Documentary

TV show cards should show:

Poster

Title

Seasons

Rating

Create TV show detail pages.

Include:

Seasons dropdown
Episodes list
Episode runtime
Episode description
Episode thumbnail
Watch trailer

13. MY LIST

Allow users to save movies and shows.

Create:

My List

Tabs:

Movies
TV Shows

Users should be able to:

Add
Remove
View
Search

Persist the list using localStorage for the demo.

Create a beautiful empty state:

"Your watchlist is waiting."

14. USER PROFILE

Create a profile page.

Example:

Mubarak
Premium Member

Sections:

Continue Watching
My List
Recently Watched
Favorite Genres
Account Settings

Create multiple demo profiles:

Mubarak
Aisha
David
Sarah

Allow profile switching.

15. CONTINUE WATCHING

Create a horizontal section showing partially watched titles.

Each card should have:

Poster
Title
Episode/movie name
Progress bar
Remaining time

Example:

The Last Horizon
1h 14m remaining

Allow users to continue playback.

Persist progress using localStorage.

16. AUTHENTICATION UI

Create polished:

Login
Sign Up
Forgot Password

pages.

Login fields:

Email
Password

Sign-up:

Name
Email
Password
Confirm Password

Include:

Remember me
Show/hide password
Google login button
Continue as guest

For the demo, authentication can use mock/local state unless a backend is configured.

Structure the application so Firebase/Supabase authentication can easily be added later.

17. SUBSCRIPTION PAGE

Create a premium subscription comparison page.

Plans:

FREE
$0/month

CINEMORA PLUS
$9.99/month

CINEMORA ULTRA
$14.99/month

Include features:

HD streaming
4K streaming
Multiple devices
Offline downloads
No advertisements
Multiple profiles
Premium content

This is only a demo pricing interface.

Do not implement real payments unless a payment provider is explicitly configured.

18. RESPONSIVE DESIGN

The website must work beautifully on:

Desktop
Laptop
Tablet
Mobile

Desktop:

Large cinematic layouts.

Tablet:

Reduced spacing and smaller cards.

Mobile:

Bottom navigation:

Home
Search
Movies
My List
Profile

Movie grids should automatically adapt.

Hero section should become vertical and mobile-friendly.

19. ANIMATIONS

Use polished animations throughout the application.

Include:

Fade-in

Slide-up

Card hover

Hero transitions

Page transitions

Skeleton loading

Button hover

Modal transitions

Search animations

Smooth scrolling

Keep animations sophisticated and performant.

Do not make everything bounce or move unnecessarily.

20. LOADING STATES

Create skeleton loaders for:

Movie cards
Hero
Movie details
Search results
Cast
TV episodes

The application should never feel broken while API data loads.

21. ERROR HANDLING

Create beautiful error states.

Examples:

"No internet connection."

"Unable to load movies."

"Movie information is currently unavailable."

"Something went wrong."

Include:

Retry button

If the API fails, gracefully fall back to demo data.

22. NOTIFICATION SYSTEM

Create a notification dropdown.

Example notifications:

"New releases available"

"Your watchlist has been updated"

"New episode available"

"Because you watched Interstellar"

Use toast notifications for:

Added to My List
Removed from My List
Trailer started
Profile switched

23. PERSONALIZED RECOMMENDATIONS

Create a "Because You Watched..." section.

Example:

Because you watched Interstellar

Because you watched The Dark Knight

Because you watched Stranger Things

Create a basic recommendation algorithm using:

Genres
Ratings
Previously watched titles
My List

For the demo, recommendations can be generated from the available API data.

24. FOOTER

Create a professional footer.

CINEMORA

"Your world of stories, all in one place."

Links:

About
Help Center
Privacy
Terms
Contact
Careers
Accessibility

Social icons:

Instagram
X
YouTube
TikTok

Include:

© 2026 Cinemora. Demo project.

25. ADMIN DASHBOARD

Create a hidden/demo admin dashboard accessible through:

/admin

Dashboard statistics:

Total Movies
Total Users
Active Users
Watch Time
Popular Movies
Trending Genres

Charts:

Users over time
Most watched genres
Most watched movies
Monthly watch time

Create movie management UI:

Add Movie
Edit Movie
Delete Movie
Feature Movie
Mark Trending

Create user management:

Users
Subscription
Status
Last Active

This dashboard can use mock data.

26. ACCESSIBILITY

Follow accessibility best practices.

Include:

Semantic HTML

Keyboard navigation

Proper labels

Focus states

ARIA labels where needed

Sufficient contrast

Accessible dialogs

Accessible video controls

27. SEO

Add:

Page titles
Meta descriptions
Open Graph metadata
Structured movie metadata where appropriate
Clean URLs

Examples:

/movie/the-last-horizon
/movie/interstellar
/genre/action
/tv-shows
/search
/my-list

28. PERFORMANCE

Optimize the website.

Use:

Lazy loading
Image optimization
Code splitting
Reusable components
Efficient API requests
Caching where appropriate

Do not load every movie image at once.

29. DARK CINEMATIC UI DETAILS

Make the interface feel premium.

Use:

Large cinematic imagery
Blurred backgrounds
Glass panels
Subtle gradients
Rounded cards
Thin borders
Soft shadows
Elegant typography
Minimal icons
Smooth hover effects

Use generous spacing.

Avoid making the interface look like a generic dashboard.

30. DEMO DATA

If no movie API is configured, include a rich demo dataset with fictional and public-domain/sample titles.

Example fictional titles:

The Last Horizon
Neon City
Midnight Protocol
Echoes of Tomorrow
The Silent Ocean
Beyond Earth
Black Meridian
Kingdom of Ash
Parallel
After Midnight
The Forgotten Signal
Red Horizon

Give every movie:

title
poster
backdrop
description
rating
year
runtime
genres
cast
director
trailer
streaming availability

31. FINAL UI REQUIREMENT

The final result should look like a real, production-quality streaming platform.

The first impression should immediately communicate:

"CINEMORA is a premium movie streaming/discovery service."

Prioritize:

Visual quality

Cinematic imagery

Excellent responsive design

Smooth UX

Fast navigation

Powerful search

Movie discovery

Legal streaming/provider links

Personalized recommendations

Clean reusable code

Do not create a basic CRUD website.

Build the entire experience end-to-end.

Before finishing, verify:

Every navigation link works

Movie cards open details

Search works

Genre filtering works

My List works

Profile switching works

Trailer player works with available legal/sample videos

API fallback works

Responsive layouts work

Loading states work

Error states work

No broken images

No console errors

No placeholder buttons that do nothing

Make the website feel polished enough to use as a professional developer portfolio showcase.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4b711a84-9c9f-4415-a5c0-18688836cdcc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

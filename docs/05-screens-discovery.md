# 05 — Discovery Screens

Covers Splash (summary), Home, Movies, Search, and Movie detail. Splash choreography is specified in `10-splash-and-motion.md`; this document defines what is on screen and how it behaves.

---

## 1. Splash (summary)

**Route:** rendered as a root overlay above the navigator, not a route.

- Full-bleed `brand` `#280056`.
- Popcorn mark centered, “Joko” wordmark below, exactly as `joko-screens/old/Splash Screen - 1.jpg`.
- Native splash uses a composite asset that matches the React overlay’s first frame.
- Cold start only. Warm resume shows no splash.
- The splash expands into Home; it does not fade to a spinner or cut.
- Reduced motion: 200 ms cross-fade, no scale/travel.

The asset must be re-exported; the current `assets/splash.png` is the wrong image. See `14-content-and-assets.md` and `10-splash-and-motion.md`.

---

## 2. Home

**Route:** `(tabs)/index`
**Purpose:** answer “What should I watch tonight, and can I book it quickly?”

### 2.1 Layout

```
Safe area
┌──────────────────────────────────────────────┐
│ [Joko wordmark]                 [search] [bell•] │  sticky 56
│ [pin] Victoria Island, Lagos [chevron]         │
├──────────────────────────────────────────────┤
│ Good evening, Joshua                         │  display 32
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 4:5 featured image                       │ │
│ │ [Joko pick]                              │ │
│ │                                          │ │
│ │ ★ 8.6  12+  2h 08m  Sci-fi               │ │
│ │ Midnight Meridian                        │ │
│ │ [Book tickets]  [Details]        [save]  │ │
│ │ ▬▬▬  ▬▬▬  ▬▬▬  ▬▬▬                       │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ┌ Upcoming ticket (only if one exists) ────┐ │
│ │ [poster] The Green Room   Today · 7:20 PM│ │
│ │          The Meridian · E5, F6        ›  │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ [All] [2D] [3D] [IMAX] [Under ₦8,000]        │  quick filters
│                                              │
│ Popular this week                 See all ›  │
│ The stories everyone's talking about         │
│ [ranked poster rail]                         │
│                                              │
│ New releases                      See all ›  │
│ [poster rail]                                │
│                                              │
│ Coming soon                       See all ›  │
│ [poster rail with release date]              │
│                                              │
│ Because you love sci-fi           See all ›  │
│ [poster rail]                                │
│                                              │
│ Cinemas near you                 All cinemas ›│
│ [cinema row]                                 │
│ [cinema row]                                 │
└──────────────────────────────────────────────┘
Tab bar (64 + inset)
```

### 2.2 Header

- Sticky, 56 dp content height plus safe area.
- Left: wordmark asset, 28 dp tall, 20 dp gutter. It is a button that scrolls to top; label “Joko, go to top”.
- Under the wordmark: location chip, 28 dp tall, `pin` 14 + city 12/600 + `chevron-down` 14. Tap opens the location sheet.
- Right: search icon (44×44) and bell (44×44). Bell shows a 6 dp `primary` dot when unread notifications exist.
- On scroll past 24 dp: wordmark fades out over 120 ms; location chip remains. Header gains `surface` background at 92% with `expo-blur` on iOS.
- No hamburger.

### 2.3 Greeting

- “Good evening, Joshua” / “Good morning” / “Good afternoon” based on local time.
- Display 32/800, `on-background`. No emoji.
- If the user has no name, use “Good evening” only.
- 20 dp gutter, 24 dp below the header.

### 2.4 Featured hero

- 4 featured films, horizontally paged. Card width = screen − 40, height = width × 1.25 (4:5), radius 24.
- Full-bleed to the 20 dp gutters. Peek of the next card is not required; page indicator communicates more.
- Image: `expo-image`, `contentFit="cover"`, placeholder `surface+1`.
- Scrim: `expo-linear-gradient` from transparent at 35% to `#1D1B1E` at 100%, bottom 60% of the card.
- Top-left chip: `Joko pick`, `surface` at 90% with blur, 12/600, `on-surface`.
- Bottom content, 16 dp padding:
  - Meta row: star icon + `8.6` (label 12/600, `on-brand`), age chip `12+`, runtime, genre. Separated by 8 dp.
  - Title: 24/700, `on-brand`, max 2 lines.
  - Actions row: `Book tickets` (brand fill, 44 dp, leading ticket icon) and `Details` (ghost on scrim: transparent, `on-brand`, 1 px `on-brand` at 40%). Save icon button (44×44) on the right.
- Page indicator: 4 bars, 3 dp tall, 24 dp wide, radius 999. Active `on-brand`; inactive `on-brand` at 30%. Not dots.
- Auto-advance every 6 s. Pause while the user is touching or dragging; resume 8 s after release. Respect reduced motion: no auto-advance.
- Tapping the card (not a button) opens movie detail.
- Accessibility: each card is a group with label “Featured: Midnight Meridian, 8.6 out of 10, 2 hours 8 minutes, sci-fi. Book tickets or view details.”

### 2.5 Upcoming ticket strip

Only when a persisted upcoming ticket exists.

- 88 dp tall card, radius 16, `surface+1`.
- Poster 48×72, radius 8.
- Title 15/600, one line.
- Meta 13: `Today · 7:20 PM · The Meridian`.
- Seats 12: `E5, F6` with a ticket icon.
- Chevron right.
- Tap opens `ticket/[id]`.
- If more than one upcoming ticket, show the soonest and a “+1 more” label.
- Empty state: omit the strip entirely. Do not show an empty card.

### 2.6 Quick filters

- Horizontal scroll, 32 dp chips, 8 dp gap, 20 dp edge padding.
- Options: All, 2D, 3D, IMAX, Dolby, Under ₦8,000.
- Selected: `primary-container` + `on-primary-container` + check icon.
- Unselected: `surface+1` + `on-surface-variant`.
- Selecting a filter updates the rails in place (client-side filter on the mock data) and shows a small “Filtered by 3D · Clear” row above the first rail. Clearing restores.
- Filters are not persisted across app restarts.

### 2.7 Rails

Each rail:

- Section header: title 18/600 left; `See all` text button right (primary, 44 dp target), no pill.
- Optional subtitle 13 `on-surface-variant`, one line.
- Horizontal `FlatList`, 12 dp gap, 20 dp edge padding, `showsHorizontalScrollIndicator={false}`.
- Card width 124, poster 124×186, radius 16.
- Poster: score chip top-right (`★ 8.6`, dark blurred pill, `on-brand`), optional `NEW` badge top-left.
- Title 13/600, max 2 lines, 8 dp below poster.
- Meta 11 `year · genre`, `on-surface-variant`, one line.
- Save icon: do not place it beside the title in the rail. Saving is available on the detail screen and via long-press context menu. This removes the crowded bookmark icons from the mockup.
- Pressed: scale 0.97, 120 ms.
- Tap: movie detail.

**Rails, in order:**

1. **Popular this week** — 5 films, ranked. Oversized numeral `01`–`05` behind the poster, 72/800, `primary-container` at 60%, positioned bottom-left, clipped by the card. Title/meta below.
2. **New releases** — 6 films.
3. **Coming soon** — 6 films with release date line instead of year/genre: `In cinemas 24 Nov`.
4. **Because you love sci-fi** — 6 films, personalized label. If no history, use “More like Midnight Meridian”.
5. **Your favourites** — only if non-empty. Omit entirely otherwise.
6. **Cinemas near you** — 3 compact cinema rows, see 2.8.

Do not show three near-identical rails with the same content. Each rail must have a distinct reason to exist.

### 2.8 Cinemas near you

- Section header `Cinemas near you` + `All cinemas` link.
- Row: 72×72 photo (radius 12), name 15/600, distance + area 13, next showtime chip `Next 6:30 PM`, amenity icons (max 3 + “+n”), chevron.
- Height ~96. `surface+1` card, 16 radius.
- Tap opens cinema detail.
- Empty state: “No cinemas nearby yet” + `Browse all cinemas`.

### 2.9 States

| State | Treatment |
|---|---|
| Loading | Header skeleton, hero skeleton (4:5 block), 2 rail skeletons, 2 cinema row skeletons. No spinner. |
| Empty (no films) | Hero replaced by a `surface+1` card: “New films are on the way” + `Browse cinemas`. Rails hidden. |
| Error | Inline `ErrorBanner` below the header: “We couldn’t load what’s showing. Check your connection.” + `Try again`. Cached content remains if available. |
| Offline | Small banner: “You’re offline. Showing saved information.” + `Retry`. |
| Pull-to-refresh | `RefreshControl` tinted `primary`; refreshes featured + rails. |

### 2.10 Data

- `getFeaturedMovies()` — 4.
- `getTrendingMovies()` — 5.
- `getNewReleases()` — 6.
- `getComingSoon()` — 6.
- `getRecommendedMovies(genre)` — 6.
- `getUpcomingTicket()` — soonest persisted ticket.
- `getNearbyCinemas(limit 3)`.

### 2.11 Acceptance

- [ ] No hamburger or drawer.
- [ ] Wordmark and location chip visible; location is changeable.
- [ ] Hero has title, score, runtime, genre, and a working primary CTA.
- [ ] Auto-advance pauses on touch and respects reduced motion.
- [ ] Upcoming ticket strip appears only when a ticket exists.
- [ ] Quick filters update rails and can be cleared.
- [ ] Rails are virtualized and visually distinct.
- [ ] No empty favourites block.
- [ ] Cinema rows show next showtime and amenities.
- [ ] Loading/empty/error/offline states exist.
- [ ] Bottom content is not hidden by the tab bar.

---

## 3. Movies

**Route:** `(tabs)/movies`
**Purpose:** browse the full catalogue and find a film by title, genre, or filter.

### 3.1 Layout

```
Safe area
Movies                                   (no app-bar title; H1 in content)
YOUR NEXT GREAT STORY                    overline, one only
Find your film.                          display 32
Good stories. The best seat in the house. body 15
[ search films or genres            ]    52 dp
[All] [Now showing] [Coming soon]        segmented
[Filters 2] [Sort: Popular]              row
┌─────────┐ ┌─────────┐
│ poster  │ │ poster  │                  2-column grid
│ ★ 8.4   │ │ ★ 8.6   │
└─────────┘ └─────────┘
Title        Title
Sci-fi · 2h  Adventure · 2h
...
14 films · All showtimes in local time
Tab bar
```

### 3.2 Header and search

- No app-bar title. The H1 is the title.
- Overline “Your next great story” (one per screen), `primary`, 11/700.
- H1 32/800. Subtitle 15/400 `on-surface-variant`.
- Search field 52 dp, `surface+1`, radius 16, leading search icon, trailing clear button when text exists. Placeholder “Search films or genres”. No `⌘K` or keyboard shortcut hint.
- Tapping the field focuses it inline; the search icon on Home opens the modal Search screen instead. Both share the same query state.

### 3.3 Segmented control

- Options: All, Now showing, Coming soon.
- 3 equal segments, height 36, `surface+1` track, `primary-container` thumb with `on-primary-container` label, 120 ms slide.
- Default: All.
- “Coming soon” cards show release date instead of “in cinemas”.

### 3.4 Filters and sort

- Filter button: `options-outline` + “Filters” + count badge when active. Opens a bottom sheet.
- Filter sheet sections:
  - Genre (multi-select chips): Action, Adventure, Animation, Comedy, Drama, Horror, Music, Romance, Sci-fi, Thriller.
  - Rating (single): Any, 7+, 8+, 9+.
  - Language (multi): English, Yoruba, French, Arabic, Subtitled.
  - Format (multi): 2D, 3D, IMAX, Dolby.
  - Cinema (single): nearby cinemas.
  - Price (single): Any, Under ₦8,000, ₦8,000–₦12,000, ₦12,000+.
  - Footer: `Clear all` (ghost) and `Show 12 films` (brand, 52).
- Active filters appear as removable chips above the grid. Count badge on the filter button.
- Sort menu (bottom sheet): Popular, Newest, A–Z, Rating. Default Popular. Current option has a check.

### 3.5 Grid

- 2 columns below 600 dp; 3 columns at ≥ 600 dp.
- Gap 16 horizontal, 24 vertical.
- Card width = (screen − 40 − 16) / 2. At 390 dp: 167 dp wide, poster 167×250.5.
- Poster radius 16. Score chip top-left or top-right consistently; choose top-left to avoid the save affordance. `NEW` badge below the score if applicable.
- Title 13/600, max 2 lines. Meta 11 `year · genre`, one line.
- No bookmark icon in the grid. Saving is on detail.
- Pressed scale 0.97.
- Footer count: “14 films · All showtimes in local time” 12 `on-surface-variant`, centered, 24 dp bottom padding above the tab bar.

### 3.6 States

| State | Treatment |
|---|---|
| Loading | 6 poster skeletons in the grid; search and segmented control remain interactive. |
| Empty (no results) | Centered `film-outline` 48, “No films match those filters”, “Try removing a filter or searching for something else.”, `Clear filters` (brand). |
| Empty (coming soon) | “Nothing announced yet” + `See what’s showing`. |
| Error | `ErrorBanner` above the grid + `Try again`. |
| Offline | Banner + cached results. |

### 3.7 Data

- `getMovies({ status, query, genres, rating, languages, formats, cinemaId, priceBand, sort })`.
- 14 seeded films; see `11-data-and-state.md`.
- Search matches title, genre, director, cast, and cinema name (for cinema results, see Search).

### 3.8 Acceptance

- [ ] Search field works and clears.
- [ ] Segmented control filters the grid.
- [ ] Filter sheet has all six groups, active count, clear all, and a result count CTA.
- [ ] Sort changes order.
- [ ] Two columns at phone width; three at tablet.
- [ ] Empty state offers a way out.
- [ ] No `⌘K`.
- [ ] Grid is virtualized (`FlatList` with `numColumns`).

---

## 4. Search

**Route:** `search` (modal, no tab bar)
**Purpose:** find a film or cinema fast, with useful starting points.

### 4.1 Layout

```
[Search]                                   [close]
FIND YOUR NEXT FAVOURITE                   overline (one)
Search Joko.                               display 32
[ search films, cinemas or areas      ]    52 dp, autofocus
Recent searches                            (when empty query)
  [chip] [chip] [chip]
A good place to start
  [Tonight near me]                        row
  [Something new]                          row
  [A little adventure]                     row
  [Easy date night]                        row
Trending now
  [poster] [poster] [poster]
```

When the query is non-empty, replace the starting content with grouped results:

```
Movies
  [row: poster, title, meta, score]
Cinemas
  [row: photo, name, distance, next showtime]
No results
  icon + "No matches for “x”" + suggestions
```

### 4.2 Behavior

- Opens with the keyboard focused, 250 ms debounce.
- Close button 44×44, label “Close search”. Dismissing returns focus to the search trigger.
- Recent searches: last 5, persisted in AsyncStorage, with a clear-all action. Tapping a chip fills the query.
- Quick prompts map to filters:
  - Tonight near me → today’s showtimes, sorted by distance.
  - Something new → New releases.
  - A little adventure → Adventure genre.
  - Easy date night → Romance + evening times.
- Results are grouped; max 5 per group with “See all”.
- Tapping a film opens movie detail; tapping a cinema opens cinema detail.
- Empty query shows recent + prompts + trending; no results shows the empty state.
- No tab bar.

### 4.3 States

| State | Treatment |
|---|---|
| Loading | 3 result-row skeletons after the debounce. |
| No results | `search-outline` 48, “No matches for “x””, “Try a film title, a genre, or a cinema.”, `Clear search`. |
| Error | `ErrorBanner` + `Try again`. |
| Offline | Banner + recent/prompt content only. |

### 4.4 Acceptance

- [ ] Opens as a modal, no tab bar.
- [ ] Autofocus, clear, close.
- [ ] Recent searches persist and can be cleared.
- [ ] Quick prompts produce sensible results.
- [ ] Results are grouped and virtualized.
- [ ] No `⌘K`.
- [ ] No-results state is helpful.

---

## 5. Movie detail

**Route:** `movie/[id]`
**Purpose:** sell the film and get the user to a showtime in one tap.

### 5.1 Layout

```
┌──────────────────────────────────────────────┐
│ [back]                            [share] [save] │  transparent app bar
│                                              │
│           backdrop 3:4 image                 │
│                                              │
│  [poster 96×144]                             │
├──────────────────────────────────────────────┤
│ THE FILM EVERYONE'S TALKING ABOUT            │  one overline, optional
│ The Last Horizon                             │  H1 28/700
│ 2025 · 2h 11m · Adventure, Sci-fi            │
│ [Adventure] [Sci-fi] [12+]                   │
│                                              │
│ [Audience 84%] [★ Joko 8.6] [Critic 7.1]     │  3 equal cards
│                                              │
│ [Book tickets] [Watch trailer] [save] [share]│
│                                              │
│ About | Showtimes | Cast | Reviews           │  sticky segmented tabs
│                                              │
│ The story                                    │
│ Paragraph ...                                │
│ More about the film ⌄                        │
│                                              │
│ Director      Ada Nwosu                      │
│ Runtime       2h 11m                         │
│ Release       2026                           │
│ Language      English                        │
│ Format        2D · IMAX                      │
│ Age rating    12+                            │
│                                              │
│ The cast                          See all ›  │
│ (A) Ada Nwosu   (T) Tunde Bakare ...        │
│                                              │
│ Watch the trailer                All clips › │
│ [16:9 thumbnail with play + 2:18]            │
│                                              │
│ Audience reviews                  All 128 ›  │
│ 4.2  ★★★★☆  Based on 128 ratings            │
│ 5★ ███████ 4★ ███ 3★ █ 2★ ▏ 1★ ▏           │
│ [review card]                                │
│ [review card]                                │
│                                              │
│ ┌ sticky ──────────────────────────────────┐ │
│ │ Tickets from ₦7,500      [Choose a time] │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### 5.2 Immersive header

- Backdrop 3:4, full width, `expo-image`, top 40% visible behind the transparent app bar.
- Bottom gradient: transparent → `background` at 85%, starting at 55% height.
- App bar: back 44×44 (`surface` at 90% + blur), share 44×44, save 44×44. No three-dot menu.
- Poster 96×144, radius 16, 2 dp `background` border, overlapping the backdrop bottom by 48 dp, left 20 dp.
- On scroll, the app bar becomes solid `surface` with a hairline; title fades in at 18/600.
- Back and actions remain reachable.

### 5.3 Title block

- Overline optional, max one: “The film everyone’s talking about” only if it is the featured film; otherwise omit.
- Title 28/700, up to 2 lines.
- Meta 13 `on-surface-variant`: year · runtime · genres.
- Chips: genre chips (tonal, non-interactive) + age rating chip. Max 4; overflow is not shown.
- Score row: three equal cards in a row, 12 radius, `surface+1`:
  - Audience: `84%`, label “Audience score”.
  - Joko: `★ 8.6`, label “Joko score”. This one uses `primary-container` to stand out.
  - Critic: `7.1`, label “Critic score”.
  - No third-party logos, letters, or lookalike badges. Plain text only.
- On 320 dp, the three cards stack 1 column or use a horizontal scroll; do not shrink text below 11.

### 5.4 Actions

- `Book tickets`: brand, 52, full width minus 20 gutters, leading ticket icon. Opens the Showtimes tab and scrolls to it (or directly to date-time if a showtime is preselected).
- `Watch trailer`: tonal (`primary-container` + `on-primary-container`), 52, play icon. Opens the trailer modal. Not a filled charcoal button.
- Save: 44×44 icon button (`bookmark-outline` / `bookmark`), label “Save to favourites”.
- Share: 44×44 icon button, opens the native share sheet with a deep link.
- The row wraps gracefully at large text: primary CTA full width, secondary actions below.

### 5.5 Sticky bottom bar

- Appears after the main CTA scrolls out of view (scroll offset > ~420).
- Left: “Tickets from ₦7,500” 13/600 + “Next: Today, 7:20 PM · The Meridian” 11 `on-surface-variant`.
- Right: `Book tickets` brand, 44.
- Respects the safe area.
- Hides when the Showtimes section is on screen and a showtime is already selected.

### 5.6 Segmented tabs

- Sticky below the app bar when scrolled.
- Tabs: About, Showtimes, Cast, Reviews.
- Default About on cold open.
- Default Showtimes when the user arrives from “Book tickets”, “Choose a showtime”, a cinema showtime, or a deep link with `?tab=showtimes`.
- Sliding underline 2 dp `primary`, label 14/600; active `on-surface`, inactive `on-surface-variant`.
- Tab content is not a nested `VirtualizedList` inside the page scroll. Use a single `ScrollView` for About/Cast and a `SectionList`/`FlatList` for Showtimes/Reviews, or a pager with one virtualized list per page.

### 5.7 About

- Synopsis 15/22, max 4 lines, “More about the film” expands with a chevron.
- Metadata grid 2 columns: Director, Runtime, Release, Language, Format, Age rating.
- No third-party trivia before showtimes.

### 5.8 Showtimes (the most important section)

```
Choose a day
[Today 12] [Tomorrow 13] [Sat 14] ... (10 days)
Pick a showtime
All times are local to Victoria Island.
[2D] [3D] [IMAX]                            format segmented
The Meridian, Victoria Island        ★ 4.8   0.8 km
[12:15 PM ₦7,500] [1:30 PM ₦7,500] [3:45 PM ₦7,500]
[5:10 PM ₦7,500] [7:20 PM ₦7,500] [8:40 PM Sold out]
[The Picture House, Surulere] ...
```

- Date strip: 10 days, 64 dp items, horizontal, 20 dp edge padding. Selected `brand` fill, `on-brand` text, radius 16. Today has a dot. Past dates disabled.
- Format segmented: 2D, 3D, IMAX (only formats available for the film).
- Cinema rows: 40×40 logo/photo, name 15/600, distance + rating, format chips, time chips, price.
- Time chip: 72 min width, 44 height, 12 radius. States per design system. Tapping a time:
  - Sets `cinemaId`, `showtimeId`, `date`.
  - Navigates directly to `booking/[movieId]/seats`.
  - This removes two screens from the funnel.
- `Select` is not needed if the time chip itself is the action. If a cinema has no times, show “No showtimes on this day” and a next-day link.
- “All times are local to {cinema area}.” Include timezone label if the cinema is outside the device timezone.
- The section is virtualized by cinema row; time chips are a wrapping row, not a nested list.

### 5.9 Cast

- Horizontal `FlatList`, 72 dp circles, 16 dp gap.
- Avatar: initials on `primary-container`, `secondary-container`, `tertiary-container`, or `surface-variant`, rotating in that order. No blue/green.
- Name 13/600, role 11 `on-surface-variant`, centered, max 2 lines.
- No container fill, no clipping.
- `See all` opens a grid sheet with all cast.

### 5.10 Trailer

- 16:9 thumbnail, radius 16, play button 56 dp `surface` at 90% + `brand` play icon, duration chip bottom-right.
- Tap opens a full-screen modal with a close button, 16:9 player placeholder (no video dependency in MVP; use a static frame + “Trailer preview” if a real player is unavailable).
- Multiple trailers: horizontal rail of thumbnails; `All clips` opens the modal list.
- Do not ship a dead play button. If no trailer URL exists, hide the section.

### 5.11 Reviews

- Summary: big `4.2` 40/800, star row, “Based on 128 ratings”, distribution bars for 5→1 with counts.
- Show 3 reviews, then `See all reviews`.
- Review card: avatar 40, name 13/600, star row, date 11, body 15/22 clamped to 4 lines with “More”, helpful count button (`heart-outline` + “Helpful 12”), overflow menu with “Report”.
- No “Reply” pill on every card.
- Reviews are seeded, varied, realistic. No repeated demo text.
- `See all reviews` opens a virtualized list with sort (Most helpful, Newest, Highest, Lowest).

### 5.12 States

| State | Treatment |
|---|---|
| Loading | Backdrop skeleton, title lines, score-card skeletons, 2 review skeletons. |
| Not found | “We couldn’t find that film” + `Browse movies`. |
| No showtimes | “No showtimes yet” + `Notify me` (local toggle) or `See other films`. |
| Error | Error banner in the affected section; the rest of the page remains usable. |
| Offline | Cached movie detail + banner. Showtimes show “Connect to see live times.” |

### 5.13 Data

- `getMovie(id)`.
- `getShowtimes(movieId, date)`.
- `getCinemasForMovie(movieId)`.
- `getReviews(movieId)`.
- `getCast(movieId)`.
- `getTrailers(movieId)`.
- `isSaved(movieId)`.

### 5.14 Acceptance

- [ ] No duplicate title; app bar is transparent and image-led.
- [ ] Poster overlaps the backdrop cleanly at 320–430 dp and at 200% text.
- [ ] No third-party rating marks.
- [ ] Joko score is visually primary; audience/critic are plain text.
- [ ] `Book tickets` opens Showtimes; tapping a time goes straight to seats.
- [ ] Sticky bar shows price and next showtime, and appears only after scroll.
- [ ] Showtimes are complete: date strip, formats, cinemas, times, prices, sold out.
- [ ] Cast avatars use palette containers only.
- [ ] Reviews are varied and clamped; see-all works.
- [ ] Trailer is hidden if unavailable.
- [ ] All sections have loading/empty/error states.

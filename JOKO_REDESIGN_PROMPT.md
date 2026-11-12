# Joko — Mobile UI/UX Redesign Prompt

> Paste this entire document into the AI agent as the source of truth. It is written for an AI that will modify the existing Expo/React Native codebase in this repository, not for a greenfield project.

---

## 0. Your role

You are a senior product designer and React Native engineer. Redesign **Joko**, a mobile movie-ticket booking app, end to end. The result must feel like a premium, calm, cinematic consumer app — not an admin panel — while remaining unmistakably Joko.

Work inside the existing repo. Inspect `joko-screens/` (the current UI mockups) and `src/` (the current code) before changing anything. Treat this document as the design and behaviour specification. Where this document and the existing screens disagree, this document wins.

Do not ask clarifying questions unless a requirement is genuinely impossible. Make confident, defensible decisions and state them briefly in your summary.

---

## 1. Product context

Joko helps people discover trending movies and reserve seats at theatres showing them.

Core user journey:

1. Discover a movie (home / browse / search)
2. Open the movie and see details + showtimes
3. Choose a cinema
4. Choose a date and showtime
5. Choose seats on a theatre seat map
6. Review the order
7. Pay
8. Receive and save a ticket

Secondary jobs: browse cinemas, manage saved tickets, favourites, account/settings.

The redesign must make this journey feel like **four confident steps**, never like a stack of disconnected forms. The current flow repeats the movie poster/title on almost every screen and splits seat selection across two separate bottom sheets. Fix that.

---

## 2. Technical constraints

- Expo SDK 56, React Native 0.85, React 19, TypeScript (strict).
- Expo Router (file-based routing) — `src/app`.
- NativeWind + Tailwind CSS 3 for layout and styling.
- `react-native-reanimated` 4 + `react-native-worklets` for motion.
- `react-native-gesture-handler`, `react-native-safe-area-context`, `react-native-screens` available.
- `@expo/vector-icons` available — use Ionicons or MaterialCommunityIcons with filled/outline pairs.
- Zustand for state. `expo-splash-screen`, `expo-font`, `expo-status-bar`, `expo-system-ui` available.
- You may add only these dependencies if needed: `expo-image`, `expo-haptics`, `expo-linear-gradient`, `expo-blur`, `@gorhom/bottom-sheet`, `@react-native-async-storage/async-storage`, `react-native-qrcode-svg`, `@expo-google-fonts/plus-jakarta-sans`, `@react-native-masked-view/masked-view`. Prefer the smallest set. Do not add a UI kit.
- No backend exists. Use a typed mock data layer (`src/data/`) with realistic movies, cinemas, showtimes, seat layouts, and tickets. Keep it easy to swap for an API later.
- Everything must run on iOS and Android. Web is a bonus, not a requirement.

Suggested structure (adapt if the repo already has conventions):

```
src/
  app/
    _layout.tsx                 // root: providers, splash overlay, stack
    (tabs)/_layout.tsx          // bottom tab bar
    (tabs)/index.tsx            // Home
    (tabs)/movies.tsx
    (tabs)/theaters.tsx
    (tabs)/tickets.tsx
    (tabs)/account.tsx
    movie/[id].tsx
    theater/[id].tsx
    booking/[movieId]/theater.tsx
    booking/[movieId]/date-time.tsx
    booking/[movieId]/seats.tsx
    booking/[movieId]/review.tsx
    booking/[movieId]/payment.tsx
    booking/[movieId]/success.tsx
    ticket/[id].tsx
  components/
    ui/                         // Button, Chip, Input, Sheet, etc.
    movie/ theater/ booking/ ticket/
  theme/
    tokens.ts                   // palette + semantic tokens
    typography.ts
    motion.ts
  data/
  store/booking.ts
  store/tickets.ts
```

---

## 3. Non-negotiables

1. **Keep the palette.** Only the colours in section 5. Do not introduce new hues, gradients that leave the palette, or pure `#000`/`#FFF` surfaces.
2. **Keep the splash identity.** The splash is deep plum `#280056` with the popcorn mark and the “Joko” wordmark, exactly as it looks now. It must not be replaced with a spinner or a generic logo animation.
3. **Splash expands into Home.** The first thing on cold start is the current splash, followed by a seamless expansion into the Home screen (section 7). No flash, no white frame, no hard cut.
4. **Bottom navigation, not a side drawer.** Delete the hamburger/drawer. Mobile navigation lives in a bottom bar (section 6).
5. **No third-party trademarks in the UI.** Do not ship Rotten Tomatoes / IMDb / Metacritic logos or real film posters. Replace with a single Joko rating plus plain-text critic scores, and use neutral placeholder artwork with the same aspect ratios.
6. **No colour-only state.** Seat availability, errors, success, and active tabs must also use icon, shape, pattern, or label.
7. **Both themes.** Implement light and dark from the provided schemes. Follow the system setting (`userInterfaceStyle: "automatic"`). The current app forces light.
8. **Accessible by default.** 44×44 pt minimum targets, ≥4.5:1 text contrast, screen-reader labels, dynamic type tolerance, reduced-motion support.
9. **No duplicated booking summary.** One compact `BookingSummary` component, reused. The poster + title block must not appear three times in one flow.
10. **Every screen has loading, empty, and error states** (skeletons, not spinners, for content).

---

## 4. Design direction

**Keywords:** cinematic, premium, quiet, editorial, tactile.

- Deep plum is the anchor; lavender is the air; blush is the accent. Large imagery, generous negative space, restrained chrome.
- Typography does the hierarchy work. Fewer borders, fewer boxes, fewer all-caps labels. Use surface tint and spacing instead of outlines.
- Cards are soft: 16–20 px radius, no heavy shadows, 1 px `outline-variant` only when needed.
- The booking flow is a focused “task mode”: hide the tab bar, keep a persistent order summary, use one primary action per screen.
- Motion is short, physical, and purposeful. Nothing bounces for decoration except the splash mark.

---

## 5. Design tokens

### 5.1 Tonal palettes (exact values from `Tonal Palettes.jpg`)

| Tone | Primary | Secondary | Tertiary | Error | Neutral | Neutral Variant |
|---|---|---|---|---|---|---|
| 0 | `#000000` | `#000000` | `#000000` | `#000000` | `#000000` | `#000000` |
| 10 | `#280056` | `#1F182A` | `#311019` | `#410102` | `#1D1B1E` | `#1D1A21` |
| 20 | `#430486` | `#362D40` | `#4A252D` | `#690005` | `#312F34` | `#322F36` |
| 30 | `#5A299C` | `#4C4358` | `#643A44` | `#93000A` | `#48464B` | `#4B454F` |
| 40 | `#7445B7` | `#645B70` | `#80525C` | `#BA1A1A` | `#625D61` | `#625C66` |
| 50 | `#8E5FD1` | `#7D7489` | `#9C6A75` | `#DE372F` | `#7B767A` | `#7B757F` |
| 60 | `#A879ED` | `#988CA4` | `#B7848D` | `#FF544A` | `#948F95` | `#958D98` |
| 70 | `#C196FF` | `#B3A7BF` | `#D59DA8` | `#FF897D` | `#AFAAAE` | `#B0A8B3` |
| 80 | `#D8BAFF` | `#CFC2DC` | `#F1B7C3` | `#FEB4AB` | `#CAC5CB` | `#CBC3CE` |
| 90 | `#EDDCFF` | `#EBDDF7` | `#FFD8E0` | `#FFDAD7` | `#E7E0E7` | `#E8E0EB` |
| 95 | `#F8EDFE` | `#F8EDFE` | `#FFECEE` | `#FFEDEB` | `#F5EEF5` | `#F6EEF9` |
| 99 | `#FFFBFF` | `#FFFBFF` | `#FFFBFF` | `#FFFBFF` | `#FFFBFF` | `#FFFBFF` |
| 100 | `#FFFBFF` | `#FFFBFF` | `#FFFBFF` | `#FFFBFF` | `#FFFBFF` | `#FFFBFF` |

### 5.2 Semantic tokens — light

| Token | Value | Use |
|---|---|---|
| `background` | `#FFFBFF` | App background |
| `on-background` | `#1D1B1E` | Primary text |
| `surface` | `#FFFBFF` | Cards, bars |
| `on-surface` | `#1D1B1E` | Text on surface |
| `surface-variant` | `#E8E0EB` | Inactive fills, skeletons |
| `on-surface-variant` | `#4B454F` | Secondary text |
| `outline` | `#7B757F` | Strong borders, icons |
| `outline-variant` | `#CBC3CE` | Hairlines |
| `primary` | `#7445B7` | Interactive accent, active icons |
| `on-primary` | `#FFFBFF` | Text on primary |
| `primary-container` | `#EDDCFF` | Chips, active pill, highlights |
| `on-primary-container` | `#280056` | Text on lavender |
| `brand` | `#280056` | Filled CTAs, splash, wordmark |
| `on-brand` | `#FFFBFF` | Text on brand |
| `secondary` | `#645B70` | Supporting text/icons |
| `secondary-container` | `#EBDDF7` | Secondary chips |
| `on-secondary-container` | `#1F182A` | |
| `tertiary` | `#80525C` | Blush accent |
| `tertiary-container` | `#FFD8E0` | Premium seats, highlights |
| `on-tertiary-container` | `#311019` | |
| `error` | `#BA1A1A` | Errors only |
| `error-container` | `#FFDAD7` | Error banners |
| `on-error-container` | `#410102` | |

Note: the shipped UI uses `Primary10 #280056` for filled CTAs and the splash, while `Schemes.jpg` labels `Primary40 #7445B7` as “Primary”. Preserve both: `brand` = `#280056` for filled actions and identity, `primary` = `#7445B7` for accents/links/active states. Do not use `#7445B7` for large filled buttons — it loses the brand’s depth.

### 5.3 Semantic tokens — dark

| Token | Value |
|---|---|
| `background` | `#1D1B1E` |
| `on-background` | `#E7E0E7` |
| `surface` | `#1D1B1E` |
| `on-surface` | `#CAC5CB` |
| `surface-variant` | `#4B454F` |
| `on-surface-variant` | `#CBC3CE` |
| `outline` | `#958D98` |
| `outline-variant` | `#4B454F` |
| `primary` | `#D8BAFF` |
| `on-primary` | `#430486` |
| `primary-container` | `#5A299C` |
| `on-primary-container` | `#EDDCFF` |
| `brand` | `#280056` |
| `on-brand` | `#FFFBFF` |
| `secondary` | `#CFC2DC` |
| `secondary-container` | `#4C4358` |
| `tertiary` | `#F1B7C3` |
| `tertiary-container` | `#643A44` |
| `error` | `#FFB4AB` |
| `error-container` | `#93000A` |

### 5.4 Surface elevations (from `Surfaces.jpg`)

Light: base `#FFFBFF`, overlay primary at 5 / 8 / 11 / 12 / 14 %.

| Level | Value |
|---|---|
| Surface | `#FFFBFF` |
| +1 | `#F4EEF7` |
| +2 | `#EEE7F1` |
| +3 | `#E7DFEC` |
| +4 | `#E5DDEB` |
| +5 | `#E1D8E7` |

Dark: base `#1D1B1E`, overlay `#D8BAFF` at 5 / 8 / 11 / 12 / 14 %.

| Level | Value |
|---|---|
| Surface | `#1D1B1E` |
| +1 | `#262329` |
| +2 | `#2C2830` |
| +3 | `#322C37` |
| +4 | `#332E39` |
| +5 | `#37313E` |

Use `+1` for cards on background, `+2` for sheets/menus, `+3` for pressed/hover, `+4` for modals, `+5` for tooltips. Do not use drop shadows to separate more than one level.

### 5.5 Typography

- UI: **Plus Jakarta Sans** (or Inter / Manrope if already present). Weights 400/500/600/700/800.
- Wordmark: keep the existing “Joko” lettering as an SVG/asset. Do not retype it in a random font. If a font is required, **Baloo 2 ExtraBold** is the closest match.
- Tabular numerals for prices, times, seat labels, and totals (`fontVariant: ['tabular-nums']`).

| Style | Size / line | Weight | Tracking |
|---|---|---|---|
| Display | 32 / 38 | 800 | −0.03em |
| H1 | 28 / 34 | 700 | −0.02em |
| H2 | 22 / 28 | 700 | −0.02em |
| H3 | 18 / 24 | 600 | −0.01em |
| Body | 15 / 22 | 400 | 0 |
| Body Strong | 15 / 22 | 600 | 0 |
| Body S | 13 / 18 | 400 | 0 |
| Label | 12 / 16 | 600 | 0.01em |
| Caption | 11 / 14 | 500 | 0.02em |
| Overline | 11 / 14 | 700 | 0.08em uppercase — max one per screen |

Never use all-caps for buttons, titles, or navigation labels. Sentence case everywhere.

### 5.6 Spacing, radius, elevation

- Spacing scale: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64.
- Screen gutter: 20. Section gap: 28. Card padding: 16. List row gap: 12.
- Radius: 8 (small inputs), 12 (chips/inner), 16 (cards), 20 (buttons/sheets), 24 (hero), 28 (bottom sheet top), 999 (pills).
- Light shadow: `0 8 24 rgba(40,0,86,0.08)` — only for floating elements (tab bar, FAB, sheets). Android: `elevation: 3`.
- Hairline: 1 px `outline-variant` at 60 % opacity.

### 5.7 Token implementation

Create `src/theme/tokens.ts` exporting the palette and two semantic token maps. Create `useTheme()` returning the active map plus `isDark`. Extend `tailwind.config.js` with the ramps and semantic names so `bg-surface`, `text-on-surface`, `border-outline-variant` work. Set `darkMode: 'media'` unless the repo already uses a class strategy.

Set `app.json` → `expo.userInterfaceStyle` to `"automatic"`, and configure the splash for both themes.

---

## 6. Information architecture and navigation

### 6.1 Bottom tab bar (replaces the side drawer)

Five tabs, in this order:

1. **Home** — `home` / `home-outline`
2. **Movies** — `film` / `film-outline`
3. **Cinemas** — `location` / `location-outline` (label “Cinemas”, not “Movie Theaters”)
4. **Tickets** — `ticket` / `ticket-outline` — **new; required by the product**
5. **Account** — `person-circle` / `person-circle-outline`

Specification:

- Height 64 + bottom safe-area inset. Background `surface` (light) / `surface+2` (dark), 1 px top hairline, no hard shadow in light mode (use a very soft shadow only when content scrolls under it).
- Icon 24 px; label 11 px / 600, 2 px below.
- Active state: 32×32 `primary-container` pill behind the icon, icon + label in `brand` (light) / `primary` (dark). Inactive: `on-surface-variant`.
- A small 6 px dot badge on **Tickets** when an upcoming showtime is within 24 h. A numeric badge on **Tickets** for unused tickets is acceptable if ≤9.
- Tap targets ≥48×48. Labels always visible — no icon-only bar.
- Hide the tab bar on: movie detail, theater detail, and all booking-flow screens. Show it on the five tab roots only.
- Remove `FEATURED MOVIE NAVIGATION SCREEN.jpg` entirely. Move **Settings** and **Help** into Account.
- Keep **search** in the Home header, not in the tab bar.
- Transition between tabs: cross-fade 120 ms; no horizontal slide (tabs are peers).

### 6.2 Route map

```
(tabs)/index              Home
(tabs)/movies             Browse + search
(tabs)/theaters           Cinema list + map
(tabs)/tickets            Upcoming / past tickets
(tabs)/account            Profile, settings, help

movie/[id]                Movie detail + showtimes
theater/[id]              Cinema detail + showtimes

booking/[movieId]/theater     Step 1 — choose cinema
booking/[movieId]/date-time   Step 2 — date + showtime
booking/[movieId]/seats       Step 3 — seat map
booking/[movieId]/review      Step 4 — review order
booking/[movieId]/payment     Step 5 — payment
booking/[movieId]/success     Confirmation + ticket
ticket/[id]                   Saved ticket detail
```

The visible progress indicator has **three** steps: `Date & time → Seats → Payment`. Cinema selection happens before the indicator starts (it is part of “choose a showtime”), and review is a sub-state of Payment. Do not show five diamonds.

Booking flow shell: no tab bar, a compact back button, a 3-step progress bar, and a sticky bottom action area. The progress bar is 4 px tall with a 2 px `primary` fill and numbered 24 px circles; the current step label is `brand`, completed steps show a check.

---

## 7. Splash → Home expansion (signature motion)

### 7.1 Current state

`Splash Screen - 1.jpg` is the canonical splash: full-bleed `#280056`, popcorn bucket mark centred, “Joko” wordmark below. `Splash Screen - 2.jpg` is the same composition with a larger mark — treat it as the **expanded frame** of the animation, not a separate screen.

The native splash is configured in `app.json` with `./assets/splash.png` on `#280056`. Keep that.

### 7.2 Choreography

Total 1.6–1.8 s, cold start only. The splash must not fade out — it **expands** into the app.

| Time | Phase | What happens |
|---|---|---|
| 0 ms | Native handoff | Native splash is visible. Mount a pixel-identical React overlay above the navigator. Call `SplashScreen.hideAsync()` only after the overlay has laid out (use `onLayout` + `requestAnimationFrame`) so there is zero flash. |
| 0–300 ms | Hold | Nothing moves. Preload fonts, first images, and the Home data. No spinner. |
| 300–950 ms | Expand | The mark group (popcorn + wordmark) scales `1 → 1.55` with `cubic-bezier(0.2, 0, 0, 1)`. The popcorn rises 6 px and the wordmark drops 4 px, echoing `Splash Screen - 2`. A soft radial glow in `Primary20 #430486` grows behind the mark (`opacity 0 → 0.35`, `scale 0.8 → 1.4`). Light haptic at 300 ms. |
| 950–1250 ms | Reveal | The plum field scales to `1.08` while fading to 0, and the Home screen underneath scales `0.96 → 1` and fades in. The wordmark travels from centre to the Home header position (top-left, 20 px gutter) and settles at its normal size; the popcorn mark fades out between 950–1100 ms. |
| 1250–1700 ms | Settle | Home content staggers in: hero (0 ms), hero CTA/dots (60 ms), quick filters (120 ms), first rail (180 ms), remaining rails (240 ms). Each item: `translateY 16 → 0`, `opacity 0 → 1`, 420 ms. |

Rules:

- Animate only `transform` and `opacity` on the UI thread. Never animate `width`, `height`, or `top`.
- The overlay must be `pointerEvents="none"` from the start; interaction is enabled when the reveal begins (≈1250 ms).
- Run once per cold start. Do **not** replay on app resume or tab switches. Gate with an in-memory flag.
- If the app is opened via a deep link to a booking screen, skip the Home destination but keep the splash expansion as a background reveal (do not block the deep link).
- Reduced motion (`useReducedMotion()`): 200 ms cross-fade, no scale, no travel. Same total order.
- The native splash image and the React overlay must use the same asset, size, and vertical position. Export the overlay at the same logical size as `splash.png` and use `resizeMode="contain"` + `imageWidth` in the plugin config.
- Optional upgrade if time allows: the expanded mark cross-morphs into the featured hero poster (shared-element). Only do this if it can be made frame-perfect; otherwise use the wordmark dock described above.

### 7.3 Acceptance

- Recording at 60 fps shows no white frame, no jump in logo position, and no double logo.
- Cold start to interactive Home ≤ 1.8 s on a mid-range device.
- Warm resume shows no splash.
- Reduce-motion path is a clean fade.

---

## 8. Screen-by-screen redesign

For each screen: fix the listed problems, keep the stated intent, and apply the design system. Every list must be virtualised and every image must have a placeholder.

### 8.1 Home (`HOME.jpg`)

Current problems: a hamburger that opens a drawer; a hero with no title, rating, or showtime; three near-identical rails; an empty “Favorite Movies” block with a lone `+`; no upcoming ticket; a bottom bar without Tickets; tiny 10 px labels.

Redesign:

- **Header (sticky, 56 px):** Joko wordmark left (28 px). Under it a location chip: pin icon + “Hollywood, CA” + chevron. Right: search and notifications (bell with dot). The header condenses on scroll — wordmark fades, location stays.
- **Hero carousel:** 4 featured movies. Card 16:9 (or 4:5 for stronger posters), radius 24, full-bleed to the gutters. Gradient scrim from transparent to `#1D1B1E` at 85 %. Overlay content bottom-left: overline “NOW SHOWING”, title 24/700 max 2 lines, meta row (`2h 41m · Action · ★ 8.4`), then `Book tickets` (filled brand, 44 px) and `Details` (ghost on scrim). Page indicator: 3 px progress bars, not dots. Auto-advance 6 s, pause while touching.
- **Upcoming ticket strip** (only if a ticket exists): a compact 88 px ticket card — poster thumb, movie, “Today · 7:30 PM · El Capitan”, seats, chevron. Tapping opens the ticket.
- **Quick filters:** horizontally scrollable chips: All, 2D, 3D, IMAX, Dolby, Under $15. Selected = `primary-container` with `on-primary-container`; unselected = `surface+1` with `on-surface-variant`.
- **Rails:** `Trending now` (ranked, oversized 01–05 numerals behind the poster), `New releases`, `Coming soon` (with release date), `Because you watched …`. Section header: title 18/600 left, `See all` text button right — no pill.
- Remove the empty favourites block. Show `Your favourites` only when non-empty; otherwise omit.
- **Movie card:** 124×186 poster (2:3), radius 16, rating chip top-right (`★ 8.4`, blurred dark pill), optional `NEW` badge, title 13/600 max 2 lines, meta 11 `2022 · Action`. Pressed: scale 0.97.
- **Bottom bar:** five tabs (section 6).
- Pull-to-refresh; skeleton shimmer in `surface+1`; 24 px bottom padding above the tab bar.

### 8.2 Movies tab (new / expanded from `movies.tsx`)

- Search field first: 52 px, `surface+1`, leading search icon, clear button, “Search movies, cinemas, genres”.
- Segmented control: `Now showing` / `Coming soon`.
- Filter button opens a bottom sheet: genre, rating, language, format, cinema, price. Show an active-filter count badge and a `Clear all` action.
- 2-column poster grid, 16 px gap. Sort menu: Popular, Newest, A–Z, Rating.
- Empty state: illustration/icon, “No movies match those filters”, `Clear filters`.
- Keep the tab bar.

### 8.3 Movie detail (`FEATURED TODAY.jpg`)

Current problems: three competing header actions; third-party rating logos; a lavender cast container that clips; repetitive dummy reviews; a sticky `BOOK SEAT` bar with no price or next showtime; no showtimes anywhere.

Redesign:

- **Immersive header:** backdrop image 3:4 with a bottom gradient into `background`; floating circular back and share buttons (44 px, `surface` at 90 % + blur). Poster 96×144 overlapping the backdrop bottom-left, radius 16, 2 px `background` border.
- Title 28/700, meta row `2022 · 2h 41m · Action/Adventure`, then a single **Joko Score** chip (`★ 8.4`) plus plain text `RT 84% · IMDb 6.9 · MC 67` in `on-surface-variant` — no external logos.
- Primary CTA `Book tickets` (full width, brand) with a secondary `♥ Save`. Below it, the next available showtime: “Next: Today, 1:30 PM · El Capitan · from $22”.
- **Sticky bottom bar** (appears after scrolling past the CTA): left = “From $22 · 1:30 PM”, right = `Book tickets`. Respect the safe area.
- **Sticky segmented tabs:** About · Showtimes · Cast · Reviews. Showtimes is the default when the user taps “Book tickets” from Home; About is the default on cold open.
- **About:** synopsis 15/22, expandable after 4 lines, then a 2-column metadata grid (Director, Runtime, Release, Language, Format, Age rating).
- **Showtimes:** the most important section — date strip (next 7 days), cinema rows with logo/thumb, format chips (2D/3D/IMAX), time chips, prices, and `Select`. Tapping a time goes straight to seat selection with cinema + showtime preselected. This removes two screens from the funnel.
- **Cast:** horizontal list, 72 px circles, name 13/600, role 11 `on-surface-variant`. No container fill, no clipping. `See all` opens a grid sheet.
- **Trailer:** 16:9 thumbnail with play button and duration; opens a full-screen modal with a close button. Support multiple trailers in a horizontal rail.
- **Reviews:** rating summary (big 8.4, distribution bars), 3 reviews, `See all reviews`. Each review: avatar, name, star row, date, text clamped to 4 lines, helpful count. Reply lives behind an overflow menu — do not show a `Reply` pill on every card. Remove the duplicated demo text; write 6–8 varied, realistic reviews in the mock data.
- Remove the three-dot header menu; move “Add to watchlist” into the Save action and “Report” into the review overflow.

### 8.4 Cinemas list (`SELECT MOVIE THEATER.jpg`)

Current problems: the entire movie header is repeated at the top; dense paragraph cards with address, owner, and founding date; no distance, sort, map, or showtime preview; hearts overlap text; no selection affordance.

Redesign:

- Header: back, title `Cinemas`, search, and a **List / Map** toggle.
- Sub-header: “Near Hollywood, CA” + `Change` link, and a sort control (Distance · Price · Rating).
- Filter chips: Open now, Recliner, IMAX, Parking, Food, Accessible.
- **Cinema row card:** 88×88 photo left (radius 12), name 16/600, one-line address, distance + drive time (“1.2 km · 6 min”), star rating + review count, amenity icons (max 4 + “+2”), price range, and the next showtime chip (“Next 6:30 PM”). Chevron right. Heart as a 40 px icon button in the top-right of the photo, not over text. Height ~112 px; no paragraphs.
- Group by distance: `Within 2 km`, `Within 5 km`, `Further away`.
- Map view: clustered pins in `brand`; selected pin shows a preview card at the bottom; request location with a clear rationale sheet and a manual postcode fallback.
- Tapping a row opens the cinema detail; the movie context (if any) is carried in a single compact chip at the top, not a full poster block.
- Empty state: “No cinemas match those filters”.

### 8.5 Cinema detail (`MOVIE THEATER.jpg`)

Current problems: a huge hero plus three thumbnails; three equal-weight text buttons; architect/firm trivia before showtimes; reviews dominate; `BOOK SEAT` with no showtime; no showtimes on the page at all.

Redesign:

- **Gallery:** swipeable 16:9 hero with a 1/3 counter and `See all photos`; thumbnails removed from the main flow.
- Title 26/700, rating, distance, `Open now · closes 11 PM`, amenity chips.
- Action row: four icon buttons with labels — Directions, Call, Website, Share. Equal 44 px targets, `surface+1` circles. No filled text buttons.
- Primary CTA `See showtimes` scrolls to the showtime section; sticky bar repeats it with the next time.
- **Showtimes first**, grouped by date (horizontal strip) and then format/auditorium, with prices and `Select`. This is the page’s main content.
- **About** collapsed to 3 lines with `More`; move capacity/opened/architect data into an expandable “Venue details” list. Do not lead with trivia.
- **Reviews:** summary + 2 reviews + `See all`; same review component as the movie page.
- Map preview card with `Open in Maps`.

### 8.6 Date & time (`SELECT DATE AND TIME.jpg`)

Current problems: two bordered fields that look like text inputs; a single time; a large empty area; the movie poster duplicated again; the diamond step marker is decorative rather than informative.

Redesign:

- 3-step progress: `Date & time` (active) → `Seats` → `Payment`.
- **Compact booking summary** at the top: poster 48×72, movie title, cinema name, format. One line each. Reused component.
- **Date strip:** horizontal, 10 days, 64 px items. Day-of-week 11 px, date 18/700, month 10 px. Selected = `brand` fill, `on-brand` text, radius 16. Today shows a dot. Past dates disabled. Full-width edge padding so the strip bleeds.
- **Showtimes:** grouped by format (`Standard`, `IMAX`, `Dolby`) and auditorium (`Auditorium 4`). Time chips 44 px tall, 72 px min width, radius 12. States: available (`surface+1` + outline), selected (`brand`), almost full (`tertiary-container` + “Few left”), sold out (`surface-variant`, strikethrough, disabled).
- Show price per format above the chips. No time selected → CTA disabled with helper “Choose a showtime”.
- **Sticky CTA:** `Continue · 1:30 PM` or `Choose a time`; secondary text shows seat availability (“Good availability”).
- Remove the huge empty space; the list scrolls under the sticky bar.
- The date and time are not form fields. If a calendar is needed for dates beyond 10 days, open a month sheet from a `Calendar` icon — do not render a fake input.

### 8.7 Seat selection (`SELECT SEAT OPTIONS SLIDEUP.jpg` + `SELECT SEAT OPTIONS SLIDEUP 2.jpg`)

Current problems: two separate bottom sheets for one step; ticket-type quantities are chosen before seats, so totals can disagree with the map; 10 px unlabeled seats; six legend items with tiny icons; the map is not zoomable; no total on screen; colours outside the palette; no max-seat rule.

Redesign — **one screen, one sheet**:

- Full-screen step with the compact booking summary (movie, cinema, date/time, auditorium).
- **Seat map** occupies the main area:
  - Curved screen at the top: a shallow arc with the label `SCREEN` and a soft `primary-container` glow. Do not use a flat grey bar.
  - Sections labelled `Orchestra`, `Balcony`, `Accessible`. Row letters on both sides (A–N), seat numbers every 5 seats. Aisle gaps 16 px.
  - Seat 24×24, radius 6 with the top corners more rounded (seat silhouette), 4 px gap. Selected: `brand` fill + white seat glyph + small check. Available: `surface-variant` fill, 1 px `outline-variant`, `on-surface-variant` glyph. Unavailable: `neutral-80` fill with a 45° hatch and 40 % opacity, not focusable. Accessible: wheelchair icon, `secondary-container`. Companion: wheelchair + plus, `secondary-container`. Premium/recliner: `tertiary-container` + recliner icon.
  - Pinch-to-zoom and pan (gesture-handler + Reanimated), plus `+`/`−` buttons and a `Reset` control. Initial zoom fits the width; do not shrink seats below 20 px.
  - Legend collapses into a `?` button that opens a small sheet with four rows maximum: Available, Selected, Unavailable, Accessible. Use icons, not colour alone.
  - Haptics on select/deselect; accessibility announcement: “F12 selected. 2 of 8 seats.”
  - Max 8 seats. On the 9th, show an inline toast: “Up to 8 seats per booking.”
  - `Best available` button picks the closest contiguous block and highlights it.
- **Bottom sheet (peek 120 px, expandable):**
  - Collapsed: `2 seats · F12, F13` + `$44.00` + `Continue`.
  - Expanded: per-seat rows with the seat label and a ticket-type selector (Adult $22 / Child $18 / Student $20 / Senior $16), a remove `×`, and a `+ Add seats` hint. Total updates live.
  - Remove the separate quantity screen entirely. Quantity is derived from selected seats.
- Empty state: “Pick your seats — tap any available seat.” CTA disabled until ≥1 seat.
- Optional: 10-minute seat hold with a subtle countdown in the summary (`Seats held 09:58`). If implemented, release on back with a confirmation sheet.

### 8.8 Review order (`MAKE PAYMENT SLIDEUP.jpg`)

Current problems: titled “Make payment” but it is a review screen; a boxed total; no fee/tax breakdown; no edit actions; the poster is repeated.

Redesign:

- Title `Review order`. Step 3 active.
- **Ticket stub card:** poster 56×84, movie, cinema, `Thu, Feb 23 · 1:30 PM`, `Auditorium 4 · Screen 1`, seat chips (`F12`, `F13`), ticket types with prices. A perforated divider (dashed `outline-variant`) separates the stub from the totals — this card is the visual signature of the flow.
- **Price breakdown:** Tickets (2 × $22.00), Booking fee ($1.50), Taxes ($0.00), divider, **Total** 18/700. Right-aligned, tabular numerals.
- `Edit` links next to Seats and Showtime, each returning to the relevant step with state preserved.
- Promo code row: `Have a promo code?` expands an input with an `Apply` button; success/error inline.
- Trust row: shield icon + “Free cancellation up to 2 hours before showtime”.
- Sticky CTA `Continue to payment`. Secondary `Back`.

### 8.9 Payment (`PAYMENT.jpg`)

Current problems: a raw card form as the first and only option; placeholder-only labels; no card brand, formatting, or validation; no saved methods or wallet; no security cues; `PAYMENT` in all caps; the total is far from the CTA.

Redesign:

- Title `Payment`. Same 3-step progress.
- **Order total** pinned at the top right of the header or in a compact summary line: `Total $45.50`.
- **Payment methods** as a radio list:
  - Saved card (Visa •••• 4242) with brand mark, default selected.
  - Apple Pay / Google Pay (platform-appropriate), with the native mark.
  - `New card` expands an inline form.
- **Card form** (only when expanded): card number with brand icon and `#### #### #### ####` formatting; expiry `MM/YY`; CVC with a `?` tooltip; cardholder name; billing ZIP. Floating labels that never disappear, 56 px fields, `surface+1`, focus ring 2 px `primary`, inline error text in `error` with an icon. Autofill hints (`autoComplete="cc-number"` etc.).
- **Security:** lock icon + “Encrypted and secure. Joko never stores your card details.” Small, `on-surface-variant`.
- **Sticky CTA:** `Pay $45.50` (brand, 52 px). Disabled until valid; loading state with a spinner and “Processing…”; on failure, an inline banner in `error-container` with `Try again` — never a dead end.
- Add a 3-D Secure note: “You may be asked to verify with your bank.”
- Never use all-caps for the title. Do not use placeholder text as the only label.

### 8.10 Success + ticket (`PAYMENT SUCCESSFUL.jpg`)

Current problems: a giant green circle in a hue outside the palette; `PAYMENT SUCCESSFUL!`; a single outline button; no ticket, QR, booking reference, or confirmation details.

Redesign:

- **No green.** Use a 72 px `primary-container` circle with a `brand` check, and a soft radial pulse on entry. Optional confetti in primary/tertiary/secondary, disabled under reduced motion.
- Headline `You're going to the movies` (28/700). Sub: “Your seats are confirmed. A receipt is on its way to you@email.com.”
- **Ticket card** (the hero of the screen): poster thumb, movie, cinema, `Thu, Feb 23 · 1:30 PM`, `Auditorium 4 · Screen 1`, seats `F12 · F13`, booking ref `JKO-8F3K2`, QR code 140×140. Perforated divider. This is the same ticket component used in the Tickets tab.
- Actions: `Add to Wallet` (primary), `Share ticket` and `View ticket` (secondary row). `Back to home` as a text button at the bottom.
- Auto-save the ticket to the Tickets tab and persist it. Show a one-line note: “Saved to Tickets.”
- If “Add to Wallet” is not implemented, hide it rather than showing a dead button.
- Haptic success notification.
- The screen must be reachable only after a successful payment; deep-linking to it without a booking shows a graceful empty state.

### 8.11 Tickets tab (new)

- Segmented `Upcoming` / `Past`.
- Upcoming ticket card: poster 64×96, movie, cinema, date/time, seats, countdown (“Starts in 2 days”), QR thumbnail, chevron.
- Detail (`ticket/[id]`): large QR on a white card (QR needs light background even in dark mode), booking ref, full details, `Add to calendar`, `Directions`, `Share`, `Cancel booking` (with policy). Boost screen brightness while the QR is visible.
- Empty state: ticket icon, “No tickets yet”, `Browse movies`.
- Badge on the tab for an upcoming showtime within 24 h.

### 8.12 Account tab (new)

- Profile header: avatar, name, email, `Edit`.
- Rows: Personal details, Payment methods, Favourites, Notifications, Appearance (System / Light / Dark), Help & support, About, Sign out.
- Move Settings and Help here from the removed drawer.
- Group rows in `surface+1` cards with 16 px radius; chevrons; 56 px rows.

---

## 9. Component library

Build these once and reuse. Each needs pressed, focused, disabled, and (where relevant) loading/error states.

- `Button` — primary (brand fill), secondary (outline), ghost, destructive; sizes 52/44/36; optional leading icon, loading spinner, full-width.
- `IconButton` — 44 px circular, `surface+1`.
- `Chip` — filter/selectable, 32 px, radius 999, leading icon, selected state.
- `SegmentedControl` — 2–4 options, sliding `primary-container` thumb.
- `Input` — floating label, 56 px, leading/trailing icons, helper, error.
- `BottomSheet` — 28 px top radius, grabber 36×4, scrim `#1D1B1E` at 40 %, snap points, keyboard-avoiding.
- `AppBar` — back/title/actions, blurred on scroll.
- `SectionHeader` — title + `See all`.
- `MovieCard` — poster 2:3, rating chip, title, meta.
- `MovieHero` — carousel item with scrim + overlay content.
- `CinemaCard` — 88 px photo, distance, amenities, next showtime.
- `ShowtimeChip` — available/selected/few-left/sold-out.
- `DateStrip` — 10-day horizontal selector.
- `SeatMap` + `Seat` — zoomable, labelled, accessible.
- `TicketCard` — stub with perforation, QR, ref.
- `BookingSummary` — one compact row used across the flow.
- `StepProgress` — 3 steps.
- `Rating` — Joko score + star row.
- `Avatar`, `Badge`, `Divider`, `Skeleton`, `EmptyState`, `ErrorBanner`, `Toast`.
- `PriceRow` — label/value with tabular numerals.

---

## 10. Booking state and rules

Zustand stores:

```ts
type BookingState = {
  movieId: string | null;
  cinemaId: string | null;
  showtimeId: string | null;
  date: string | null;       // ISO
  seats: Seat[];             // { id, row, number, section, type, price }
  ticketTypes: Record<string, TicketType>;
  promoCode: string | null;
  fees: { booking: number; taxes: number };
  status: 'idle' | 'held' | 'paid' | 'failed';
  holdExpiresAt: number | null;
  reset: () => void;
};
```

Rules:

- Max 8 seats per booking.
- Seat prices come from the showtime, not the UI. Totals are derived, never stored twice.
- Ticket type is assigned per seat; changing it updates the total immediately.
- Showtime must be in the future; disable past times.
- Currency: `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`. Times: device locale, 12 h default, include the timezone label when the cinema is in another zone.
- Preserve state when navigating back; reset only after success or explicit cancel.
- Persist tickets with `zustand/persist` + AsyncStorage. Keep the booking draft in memory.
- A booking cannot reach `success` without a paid status. Guard the route.

---

## 11. Motion system

| Token | Duration | Easing |
|---|---|---|
| micro | 120 ms | `ease-out` |
| short | 200 ms | `cubic-bezier(0.2, 0, 0, 1)` |
| medium | 320 ms | `cubic-bezier(0.2, 0, 0, 1)` |
| long | 480 ms | `cubic-bezier(0.2, 0, 0, 1)` |
| splash | 300–1700 ms | see section 7 |

- Press feedback: scale 0.97 + opacity 0.9, 120 ms. No ripple on iOS; use the platform ripple on Android buttons.
- Sheets: translateY with a spring (`damping 22`, `stiffness 200`); scrim fades 200 ms.
- Screen push: native stack slide from the right (iOS) / fade-through (Android). Do not invent custom full-screen transitions.
- List entrance: only on first mount, 24 ms stagger, max 6 items, never on scroll.
- Haptics: light on seat select, medium on booking confirmed, warning on max seats.
- Respect `useReducedMotion()` globally: replace transforms with fades.

---

## 12. Accessibility

- Minimum 44×44 pt touch targets, 8 px spacing between adjacent targets.
- Contrast: body text ≥4.5:1, large text ≥3:1. `on-surface-variant` on `surface` is acceptable for secondary text; `#EDDCFF` on `#FFFBFF` is **not** acceptable for text.
- Seats: `accessibilityRole="button"`, `accessibilityState={{ selected, disabled }}`, label “Row F seat 12, available, $22”. Announce the running count.
- The seat map must be usable with a screen reader: provide a “Select by row” list alternative (a modal listing rows and seats).
- Dynamic type: no fixed-height text containers; allow titles to wrap to 2 lines; test at 200 %.
- Focus order follows visual order; modals trap focus and restore it on close.
- Errors are announced and linked to their fields; never colour-only.
- Provide `accessibilityLabel` on every icon-only button.
- Test with VoiceOver and TalkBack on the booking flow.

---

## 13. Content and copy

- Sentence case. No `BOOK SEAT`, `PAYMENT`, `NEXT`, `PROCEED`.
- Use “Book tickets”, “Continue”, “Pay $45.50”, “View ticket”, “Add to Wallet”.
- Replace “Download Seat details” with “View ticket”.
- Replace “Movie Theaters” with “Cinemas”.
- Show real, specific information: exact date/time, auditorium, seat labels, price. Never “February 23 - 25” as a showtime.
- Reviews must read like real people wrote them, with varied length and tone.
- Empty states are helpful and action-oriented, not cute.
- Error messages say what happened and what to do next.

---

## 14. Implementation order

1. **Audit** the current repo and screens; list the concrete gaps you will fix.
2. **Tokens and theme:** `tokens.ts`, `useTheme`, Tailwind extension, fonts, `userInterfaceStyle: automatic`.
3. **Shell:** root layout, splash overlay, tab layout, stack groups, safe areas, status bar.
4. **Splash animation** (section 7) — get this pixel-perfect before building screens.
5. **Primitives:** Button, Chip, Input, Sheet, AppBar, SectionHeader, Skeleton, EmptyState.
6. **Mock data layer:** movies, cinemas, showtimes, seat maps, reviews, tickets.
7. **Home + Movies + movie detail.**
8. **Cinemas + cinema detail.**
9. **Booking flow:** date/time → seats → review → payment → success.
10. **Tickets + Account.**
11. **States:** loading, empty, error, offline.
12. **Accessibility + reduced motion + dark mode pass.**
13. **QA:** 320 px, 375 px, 430 px, tablet; iOS + Android; light + dark; large text.

Do not leave placeholder screens, `TODO` buttons, or dead links. If a feature is out of scope (e.g. Wallet), hide it.

---

## 15. Acceptance criteria

- [ ] Cold start shows the current splash, then a seamless expansion into Home with no flash, no white frame, and no logo jump.
- [ ] Warm resume does not replay the splash.
- [ ] No side drawer anywhere; a five-tab bottom bar with Home, Movies, Cinemas, Tickets, Account.
- [ ] The booking flow has one progress indicator, one compact summary, and no duplicated movie header.
- [ ] Seat quantity is derived from selected seats; the separate quantity sheet is gone.
- [ ] The seat map is labelled, zoomable, palette-compliant, and usable with a screen reader.
- [ ] Payment has saved methods, formatted inputs, validation, and a loading/failure state.
- [ ] Success shows a real ticket with QR, reference, seats, and cinema; the ticket persists in the Tickets tab.
- [ ] Only palette colours are used; the green success circle is gone.
- [ ] Light and dark mode both complete and contrast-checked.
- [ ] Every list is virtualised; every image has a placeholder; no nested VirtualizedLists.
- [ ] All touch targets ≥44 pt; all icon buttons labelled.
- [ ] Works at 320 px width and at 200 % text size.
- [ ] `npm run lint` and `npx tsc --noEmit` pass.

---

## 16. Do not

- Do not add new hues, neon greens, or gradients outside the plum/lavender/blush family.
- Do not use pure `#000000` or `#FFFFFF` for large surfaces (the QR card is the only exception).
- Do not use all-caps labels, 10 px body text, or placeholder-only form labels.
- Do not keep the side drawer, the hamburger, or the duplicate movie header on every booking step.
- Do not use colour alone to communicate seat state.
- Do not use third-party rating logos, real movie posters, or celebrity likenesses.
- Do not add a UI kit, a state library, or a navigation library beyond what is installed.
- Do not animate layout properties; do not block the UI for longer than 1.8 s on launch.
- Do not ship dead buttons, fake “Download” actions, or lorem-ipsum reviews.

---

## 17. Current-screen audit (reference)

Use this to verify you have addressed the real issues, not an imagined app.

| File | Key issues |
|---|---|
| `Splash Screen - 1.jpg` | Good identity; static only. Keep as the animation’s first frame. |
| `Splash Screen - 2.jpg` | Enlarged mark — use as the expansion frame, not a second screen. |
| `HOME.jpg` | Hamburger/drawer; hero with no info; 3 duplicate rails; empty favourites; no ticket; tab bar missing Tickets. |
| `FEATURED MOVIE NAVIGATION SCREEN.jpg` | Side drawer with 6 items; must be deleted and replaced by the bottom bar (Settings/Help → Account). |
| `FEATURED TODAY.jpg` | 3 header actions; third-party rating logos; clipped cast row; repetitive reviews; CTA with no price/time; no showtimes. |
| `SELECT MOVIE THEATER.jpg` | Repeated movie header; dense paragraphs; no distance/sort/map/showtime; hearts overlap text. |
| `MOVIE THEATER.jpg` | Gallery + 3 thumbnails; equal-weight text buttons; trivia before showtimes; reviews dominate; no showtimes. |
| `SELECT DATE AND TIME.jpg` | Fake input fields; one time; huge empty area; repeated poster; decorative step marker. |
| `SELECT SEAT OPTIONS SLIDEUP.jpg` | Quantity chosen before seats; totals can disagree with the map; separate sheet. |
| `SELECT SEAT OPTIONS SLIDEUP 2.jpg` | Tiny unlabeled seats; 6-item legend; no zoom; off-palette red/green/blue/yellow; no total; no max-seat rule. |
| `MAKE PAYMENT SLIDEUP.jpg` | Review screen misnamed; boxed total; no fee breakdown; repeated poster; no edit actions. |
| `PAYMENT.jpg` | Raw card form only; placeholder labels; no formatting/validation/wallet/saved cards; all-caps title; total far from CTA. |
| `PAYMENT SUCCESSFUL.jpg` | Off-palette green circle; all-caps; no ticket/QR/reference; single dead-end button. |
| `Schemes.jpg` / `Surfaces.jpg` / `Tonal Palettes.jpg` | Canonical palette. Note the app currently uses `Primary10` for CTAs while the scheme labels `Primary40`; keep both as specified in 5.2. |

---

## 18. Deliverable

When you are done, report:

1. A short design rationale (5 bullets max).
2. The token/theme files and the component inventory you created.
3. The screen-by-screen changes, mapped to section 8.
4. Exactly how the splash animation is implemented (timings, easing, files).
5. Any dependency added and why.
6. What you deliberately left out and what would come next.
7. Confirmation that every item in section 15 passes.

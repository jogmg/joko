# 06 — Cinema Screens

Covers the Cinemas tab (list + map) and cinema detail. The old brief called this “Movie Theaters”; the product language is **Cinemas**.

---

## 1. Cinemas tab

**Route:** `(tabs)/cinemas`
**Purpose:** find a cinema nearby, understand what it offers, and get to a showtime.

### 1.1 Layout

```
Safe area
Cinemas
THE GOOD SEAT IS CLOSE                     overline (one)
Pick your cinema.                          display 32
Great screens and an easy way there.       body 15
[ search cinemas or areas            ]     52 dp
[Near me] [Today] [Under 5 km] [IMAX] [Open now]
8 cinemas nearby              Sorted by distance
┌──────────────────────────────────────────────┐
│ [88×88 photo]  The Meridian, Victoria Island │
│  [IMAX]        0.8 km · 6 min · Victoria Island│
│                ★ 4.8 (214) · Open until 11 PM │
│                [recliner] [parking] [food] +2 │
│                From ₦7,500 · Next 6:30 PM   › │
└──────────────────────────────────────────────┘
...
[ map preview / list-map toggle ]
Tab bar
```

### 1.2 Header

- No app-bar title. H1 “Pick your cinema.” 32/800.
- One overline maximum: “The good seat is close.”
- Subtitle 15/400.
- Search field 52, `surface+1`, radius 16, placeholder “Search cinemas or areas”. No `⌘K`.
- Trailing `List / Map` toggle: two 36 dp icon buttons in a `surface+1` pill, `list-outline` and `map-outline`. Selected has `primary-container` background and `brand` icon. Labels via accessibility.

### 1.3 Location and sort

- Row: pin icon + “Near Victoria Island, Lagos” 13/600 + `Change` link (44 dp target).
- Right: sort button `swap-vertical-outline` + “Distance”. Opens a sheet: Distance, Price, Rating.
- If location permission is denied, show “Using Victoria Island” with a `Change` action. Never block the list.

### 1.4 Filter chips

- Horizontal scroll: Near me, Today, Under 5 km, IMAX, Open now, Recliner, Parking, Food, Accessible.
- Selected: `primary-container` + check. Unselected: `surface+1`.
- “Near me” requests location with a rationale sheet; if denied, falls back to the default area.
- Active filters produce a result count and a `Clear all` action.

### 1.5 Cinema list

- Group by distance:
  - “Within 2 km”
  - “Within 5 km”
  - “Further away”
- Section headers 18/600 with count 13 `on-surface-variant`.
- Card height ~112, radius 16, `surface+1`, 12 padding.
- Left: 88×88 photo, radius 12, `expo-image`, placeholder. Format badge (`IMAX`, `Dolby`) top-left of the photo, 10/700 `on-brand` on `brand` at 80%.
- Content:
  - Name 16/600, one line.
  - Address 13 `on-surface-variant`, one line, truncated.
  - Distance + drive time: `0.8 km · 6 min`, 12/600.
  - Rating: star + `4.8` + `(214)`, 12.
  - Status: “Open until 11 PM” in `primary` (or “Closed” in `on-surface-variant` with a clock icon; not error red).
  - Amenity icons: max 4, 16 dp, + `+2` label. Icons: recliner (`seat`), parking (`car`), food (`fast-food`), accessible (`accessibility`), IMAX (`film`), Dolby (`volume-high`).
  - Price: “From ₦7,500” 12/600.
  - Next showtime chip: `Next 6:30 PM` tonal.
- Right: chevron 20 `on-surface-variant`. The whole card is the tap target.
- No heart/bookmark on the card. Favourites are managed on cinema detail.
- No two competing CTAs. In a booking context, the card gets a single `Choose` button instead of the chevron; the rest of the card still opens detail.

### 1.6 Map view

No map SDK is allowed. Use a stylized, dependency-free map:

- A static, locally bundled map illustration of Lagos (neutral `surface+1` land, `surface+2` water, `outline-variant` roads). It is decorative; it must not pretend to be live navigation.
- Pins: 36×36 `brand` circles with a white cinema glyph, 2 dp `on-brand` border, positioned by normalized x/y in the mock data.
- Selected pin: 44×44, `primary-container` ring, scales 1.1.
- Tapping a pin opens a preview card at the bottom (88 dp): photo, name, distance, next showtime, `View cinema` button, close.
- Clustering: if two pins are within 24 dp, group into a count badge; tapping zooms the cluster into a list sheet.
- A “Recenter” 44 dp button and a `List` toggle.
- “Open in Maps” uses `Linking.openURL` with a geo/query URL; no SDK.
- If the map asset fails, fall back to the list with a banner.
- Accessibility: pins are buttons with labels “The Meridian, 0.8 km, next showtime 6:30 PM”. The list remains the primary accessible interface.

### 1.7 States

| State | Treatment |
|---|---|
| Loading | 4 cinema-card skeletons; map skeleton block. |
| Empty (no cinemas) | `location-outline` 48, “No cinemas in this area yet”, “Try a different area or clear your filters.”, `Change area` + `Clear filters`. |
| Empty (filters) | “No cinemas match those filters” + `Clear filters`. |
| Location denied | Inline banner: “Location is off. Showing Victoria Island.” + `Turn on` / `Change area`. |
| Error | `ErrorBanner` + `Try again`. |
| Offline | Banner + cached list; map shows “Map unavailable offline.” |

### 1.8 Data

- `getCinemas({ area, filters, sort })`.
- `getNearbyCinemas()`.
- `getCinemaAmenities(id)`.
- `getNextShowtime(cinemaId)`.
- `getCinemaMapPoints()` — normalized coordinates for the static map.

### 1.9 Acceptance

- [ ] Header says “Cinemas”, not “Theatres”.
- [ ] Search, list/map toggle, location change, and sort work.
- [ ] Cards show distance, drive time, rating, status, amenities, price, and next showtime.
- [ ] One tap target per card; no overlapping hearts.
- [ ] Grouped by distance.
- [ ] Map is dependency-free, tappable, and accessible; list remains primary.
- [ ] Empty/error/location-denied states exist.
- [ ] List is virtualized with `SectionList`.

---

## 2. Cinema detail

**Route:** `cinema/[id]`
**Purpose:** confirm the venue is right and choose a showtime.

### 2.1 Layout

```
[back]                                      [share] [save]
┌──────────────────────────────────────────────┐
│ swipeable 16:9 gallery       1/5   See all   │
└──────────────────────────────────────────────┘
The Meridian, Victoria Island                H1 26/700
★ 4.8 (214) · 0.8 km · Open until 11 PM
[IMAX] [Recliner] [Parking] [Food] [Accessible]
[Directions] [Call] [Website] [Share]        4 icon actions
[See showtimes]                              brand 52
──────────────────────────────────────────────
Showtimes                                    H2
[Today 12] [Tomorrow 13] ...                 date strip
2D
  Auditorium 1 · Standard
  [12:15 PM ₦7,500] [1:30 PM ₦7,500] ...
3D
  Auditorium 3 · 3D
  ...
IMAX
  IMAX Auditorium
  ...
──────────────────────────────────────────────
About                                        H2
3 lines + More
Venue details ⌄
  Capacity, opened, architect, parking ...
Reviews                                      H2
4.6 ★ · 214 reviews · See all
[review] [review]
Map preview                                  H2
[static map] Open in Maps
```

### 2.2 Gallery

- Swipeable 16:9 `FlatList`, radius 24, full-bleed to 20 dp gutters.
- Page counter 1/5 bottom-right, `surface` at 90%, 12/600.
- `See all photos` opens a full-screen pager.
- No thumbnails in the main flow.
- Backdrop/hero uses `expo-image` with a placeholder.

### 2.3 Title and status

- Title 26/700, max 2 lines.
- Rating: star + 4.8 + (214).
- Distance + drive time.
- Open status: “Open until 11 PM” in `primary`; closed uses `on-surface-variant` + clock icon. Do not use error red for closed.
- Amenity chips: tonal, 32 dp, max 6 visible + `+n`; tapping opens a sheet with all amenities and descriptions.

### 2.4 Actions

Four equal icon buttons with labels:

- Directions — `navigate-outline` — opens Maps via `Linking`.
- Call — `call-outline` — opens `tel:`.
- Website — `globe-outline` — opens the browser.
- Share — `share-outline` — native share.

Each is a 44×44 `surface+1` circle with a 11/500 label below. No filled text buttons. If a phone/website is missing, hide that action; do not show a dead button.

### 2.5 Primary CTA

- `See showtimes` brand, 52, full width.
- Scrolls to the Showtimes section (or opens a date sheet if already there).
- Sticky bottom bar repeats `See showtimes` with “Next: Today, 6:30 PM” after the CTA scrolls out.

### 2.6 Showtimes

- Date strip: same component as movie detail, 10 days.
- Group by format, then auditorium:
  - Format header 18/600 (`2D`, `3D`, `IMAX`).
  - Auditorium line 13 `on-surface-variant`: “Auditorium 1 · Standard”, “Auditorium 3 · 3D”, “IMAX Auditorium”.
  - Time chips 44 dp, 72 min width, price below or inside.
- Tapping a time starts the booking flow with the cinema and showtime preselected. It goes directly to seats, unless the user arrived without a movie context, in which case it goes to `booking/[movieId]/date-time` after the movie is chosen.
- If no showtimes: “No showtimes on this day” + `Choose another day`.
- If sold out: chip disabled with “Sold out” label.
- Prices are per format and visible before selection.

### 2.7 About

- 3 lines, `More` expands.
- “Venue details” expandable list:
  - Screens, capacity, opened, architect, parking, accessibility, food & drink policy.
- Do not lead with architect/founding trivia. Showtimes come first.

### 2.8 Reviews

- Summary: rating 4.6, count 214, distribution bars.
- 2 reviews + `See all reviews`.
- Same review component as movie detail. No duplicated demo text.
- Review overflow has “Report”; no reply pill.

### 2.9 Map preview

- Static map card 16:9, radius 16, with one `brand` pin.
- Address 13 below.
- `Open in Maps` text button.
- If the map asset fails, show the address + button only.

### 2.10 States

| State | Treatment |
|---|---|
| Loading | Gallery skeleton, title lines, action circles, showtime skeletons. |
| Not found | “We couldn’t find that cinema” + `Browse cinemas`. |
| No showtimes | “No showtimes on this day” + next-day action. |
| Closed | Status chip “Closed” + next opening time. Showtimes for future days still visible. |
| Error | Section-level error banner; gallery/title remain. |
| Offline | Cached venue info + “Connect to see live showtimes.” |

### 2.11 Data

- `getCinema(id)`.
- `getCinemaGallery(id)`.
- `getCinemaShowtimes(id, date)`.
- `getCinemaReviews(id)`.
- `getVenueDetails(id)`.
- `getCinemaLocation(id)`.

### 2.12 Acceptance

- [ ] Gallery is swipeable with a counter and see-all.
- [ ] Title, rating, distance, open status, and amenities are visible.
- [ ] Four icon actions, each 44 pt and labeled; missing data hides the action.
- [ ] Showtimes are the main content, grouped by format and auditorium, with prices.
- [ ] Tapping a time starts booking with cinema + showtime preselected.
- [ ] About is collapsed and venue trivia is secondary.
- [ ] Reviews reuse the shared component.
- [ ] Map preview opens Maps.
- [ ] Sticky CTA appears after scroll and shows the next time.
- [ ] Loading/empty/error/offline states exist.

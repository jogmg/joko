# 11 — Data and State

No backend exists. The app uses a typed mock data layer behind a repository boundary so an API can replace it later without rewriting screens.

All money is stored in minor units (kobo) as integers. All dates are ISO strings. All derived totals are computed, never stored twice.

---

## 1. Market configuration

`src/config/market.ts` is the only place that knows the market.

```ts
export const market = {
  city: 'Lagos',
  area: 'Victoria Island',
  country: 'Nigeria',
  countryCode: 'NG',
  currency: 'NGN',
  locale: 'en-NG',
  timezone: 'Africa/Lagos',
  currencySymbol: '₦',
  defaultLocation: { latitude: 6.4281, longitude: 3.4219 },
} as const;

export type Market = typeof market;
```

Formatting:

```ts
export const formatMoney = (minor: number) =>
  new Intl.NumberFormat(market.locale, {
    style: 'currency',
    currency: market.currency,
    maximumFractionDigits: 0,
  }).format(minor / 100);
```

- NGN has no practical subunit display; format with 0 fraction digits.
- If the market changes to USD, set `maximumFractionDigits: 2` and update the mock prices.
- Never concatenate a currency symbol manually.

---

## 2. Core types

```ts
export type MovieStatus = 'now-showing' | 'coming-soon';
export type Format = '2D' | '3D' | 'IMAX' | 'Dolby';
export type SeatType = 'standard' | 'premium' | 'accessible' | 'companion';
export type TicketTypeId = 'adult' | 'child' | 'student' | 'senior';

export type Movie = {
  id: string;
  title: string;
  year: number;
  runtimeMinutes: number;
  genres: string[];
  ageRating: string;            // "12+", "PG", "18"
  score: number;                // Joko score, 0–10
  audienceScore: number;        // percentage
  criticScore: number;          // 0–10
  synopsis: string;
  director: string;
  cast: CastMember[];
  poster: ImageSource;
  backdrop: ImageSource;
  trailer?: Trailer;
  status: MovieStatus;
  releaseDate?: string;         // ISO, for coming soon
  formats: Format[];
  isFeatured?: boolean;
  rank?: number;
};

export type CastMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatar?: ImageSource;
};

export type Trailer = {
  id: string;
  title: string;
  duration: string;             // "2:18"
  thumbnail: ImageSource;
  url?: string;                 // optional; hidden if absent
};

export type Cinema = {
  id: string;
  name: string;
  area: string;
  address: string;
  distanceKm: number;
  driveMinutes: number;
  rating: number;
  reviewCount: number;
  amenities: Amenity[];
  formats: Format[];
  image: ImageSource;
  gallery: ImageSource[];
  openUntil: string;            // "11 PM"
  isOpen: boolean;
  phone?: string;
  website?: string;
  mapPoint: { x: number; y: number }; // normalized 0–1 for the static map
};

export type Amenity =
  | 'imax' | 'dolby' | 'recliner' | 'parking' | 'food'
  | 'accessible' | '3d' | 'air-conditioned';

export type Screen = {
  id: string;
  cinemaId: string;
  name: string;                 // "Screen 1", "IMAX Auditorium"
  format: Format;
  auditorium: string;           // "Auditorium 3"
  seatLayoutId: string;
};

export type Showtime = {
  id: string;
  movieId: string;
  cinemaId: string;
  screenId: string;
  startsAt: string;             // ISO
  format: Format;
  basePriceMinor: number;
  seatsRemaining: number;
  totalSeats: number;
};

export type SeatLayout = {
  id: string;
  screenId: string;
  rows: SeatRow[];
  aislesAfter: number[];        // e.g. [5, 10]
  sections: { name: string; rows: string[] }[];
};

export type SeatRow = {
  label: string;                // "A"
  seats: SeatDefinition[];
};

export type SeatDefinition = {
  id: string;                   // "A1"
  row: string;
  number: number;
  type: SeatType;
  priceMinor: number;           // base + seat surcharge
  unavailable?: boolean;
};

export type SeatSelection = {
  id: string;
  row: string;
  number: number;
  section: string;
  type: SeatType;
  priceMinor: number;
  ticketType: TicketTypeId;
};

export type TicketType = {
  id: TicketTypeId;
  label: string;
  description: string;
  adjustmentMinor: number;      // negative for discounts
};

export type Review = {
  id: string;
  subjectId: string;            // movie or cinema id
  author: string;
  initials: string;
  rating: number;               // 1–5
  date: string;                 // ISO
  body: string;
  helpful: number;
};

export type Ticket = {
  id: string;
  bookingRef: string;           // JKO-XXXXXXXX
  movieId: string;
  cinemaId: string;
  showtimeId: string;
  movieSnapshot: Pick<Movie, 'id' | 'title' | 'poster' | 'runtimeMinutes'>;
  cinemaSnapshot: Pick<Cinema, 'id' | 'name' | 'area' | 'address'>;
  startsAt: string;
  screenName: string;
  format: Format;
  seats: SeatSelection[];
  totalMinor: number;
  status: 'upcoming' | 'attended' | 'cancelled';
  createdAt: string;
  qrValue: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: ImageSource;
  savedMovieIds: string[];
};

export type Promo = {
  code: string;
  kind: 'percent' | 'fixed';
  value: number;                // 10 for 10%, or minor units
  appliesTo: 'tickets';
  requiresTicketType?: TicketTypeId;
};

export type ImageSource = number | { uri: string; blurhash?: string };

export type MovieFilters = {
  status?: MovieStatus | 'all';
  query?: string;
  genres?: string[];
  minRating?: number;
  languages?: string[];
  formats?: Format[];
  cinemaId?: string;
  priceBand?: 'any' | 'under-8000' | '8000-12000' | 'over-12000';
  sort?: 'popular' | 'newest' | 'az' | 'rating';
};

export type CinemaFilters = {
  area?: string;
  query?: string;
  openNow?: boolean;
  maxDistanceKm?: number;
  amenities?: Amenity[];
  formats?: Format[];
  sort?: 'distance' | 'price' | 'rating';
};

export type CreateTicketInput = {
  bookingRef: string;
  movieId: string;
  cinemaId: string;
  showtimeId: string;
  startsAt: string;
  screenName: string;
  format: Format;
  seats: SeatSelection[];
  totalMinor: number;
};
```

---

## 3. Booking state

```ts
type BookingStatus = 'idle' | 'held' | 'paid' | 'failed';

type BookingState = {
  movieId: string | null;
  cinemaId: string | null;
  screenId: string | null;
  showtimeId: string | null;
  date: string | null;          // ISO date
  seats: SeatSelection[];
  promoCode: string | null;
  promoDiscountMinor: number;
  status: BookingStatus;
  holdExpiresAt: number | null;
  paymentMethod: PaymentMethod | null;
  lastPaymentError: string | null;
  idempotencyKey: string | null;

  // actions
  start: (movieId: string) => void;
  setCinema: (cinemaId: string) => void;
  setShowtime: (showtime: Showtime, screen: Screen) => void;
  toggleSeat: (seat: SeatDefinition, showtime: Showtime) => void;
  setTicketType: (seatId: string, type: TicketTypeId) => void;
  clearSeats: () => void;
  applyPromo: (promo: Promo) => void;
  clearPromo: () => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setPaymentError: (message: string | null) => void;
  markPaid: () => void;
  reset: () => void;
};
```

Rules:

- `start(movieId)` resets if the movie differs; otherwise preserves.
- `setShowtime` clears seats and promo if the showtime changes.
- `toggleSeat` enforces max 8 and sets a default `ticketType: 'adult'`.
- `setTicketType` updates the seat in place.
- Totals are selectors, not state.
- `markPaid` sets `status: 'paid'`; the success screen then creates the ticket.
- `reset` clears everything, including payment error and idempotency key.

### 3.1 Selectors

```ts
export const selectSeatCount = (s: BookingState) => s.seats.length;
export const selectSubtotalMinor = (s: BookingState) =>
  s.seats.reduce((sum, seat) => sum + linePriceMinor(seat), 0);
export const selectServiceFeeMinor = (_: BookingState) => 300_00;
export const selectTotalMinor = (s: BookingState) =>
  Math.max(0, selectSubtotalMinor(s) + selectServiceFeeMinor(s) - s.promoDiscountMinor);
export const selectIsValid = (s: BookingState) =>
  Boolean(s.movieId && s.cinemaId && s.showtimeId && s.date) &&
  s.seats.length >= 1 && s.seats.length <= 8;
```

`linePriceMinor(seat) = max(0, seat.priceMinor + ticketTypeAdjustment[seat.ticketType])`.

---

## 4. Tickets store

```ts
type TicketsState = {
  tickets: Ticket[];
  addTicket: (ticket: Ticket) => void;
  cancelTicket: (id: string) => void;
  markAttended: () => void;
  getTicket: (id: string) => Ticket | undefined;
  getUpcoming: () => Ticket[];
  getPast: () => Ticket[];
};
```

- Persist with `zustand/persist` + AsyncStorage.
- Version the storage (`version: 1`) and provide a `migrate`.
- `addTicket` is idempotent by `bookingRef`; calling it twice must not duplicate.
- `cancelTicket` sets `status: 'cancelled'`; it does not delete history.
- `markAttended` runs on app focus: upcoming tickets whose showtime was > 3 hours ago become `attended`.
- Tickets contain snapshots of movie/cinema fields so a later catalogue change does not break an old ticket.

---

## 5. Preferences and profile

```ts
type PreferencesState = {
  scheme: 'system' | 'light' | 'dark';
  haptics: boolean;
  reminders: boolean;
  reminderLead: '24h' | '2h';
  newReleases: boolean;
  offers: boolean;
  emailReceipts: boolean;
  setScheme: (s: 'system' | 'light' | 'dark') => void;
  setPreference: <K extends keyof PreferencesState>(key: K, value: PreferencesState[K]) => void;
};
```

Persist with AsyncStorage. `scheme` drives the theme override.

Profile store:

```ts
type ProfileState = {
  user: User;
  updateUser: (patch: Partial<User>) => void;
  toggleSavedMovie: (movieId: string) => void;
  signOut: () => void;          // resets to a local guest profile; no auth
};
```

Persist profile and saved movies. Sign out clears the profile and saved movies but not tickets (tickets are device-local in MVP). Document this behavior in the UI.

---

## 6. Repository boundary

```ts
export interface JokoRepository {
  getMovies(filters?: MovieFilters): Promise<Movie[]>;
  getMovie(id: string): Promise<Movie | null>;
  getFeatured(): Promise<Movie[]>;
  getTrending(): Promise<Movie[]>;
  getNewReleases(): Promise<Movie[]>;
  getComingSoon(): Promise<Movie[]>;

  getCinemas(filters?: CinemaFilters): Promise<Cinema[]>;
  getCinema(id: string): Promise<Cinema | null>;
  getNearbyCinemas(limit?: number): Promise<Cinema[]>;

  getShowtimes(input: { movieId?: string; cinemaId?: string; date: string }): Promise<Showtime[]>;
  getSeatLayout(showtimeId: string): Promise<SeatLayout>;
  getSeatsRemaining(showtimeId: string): Promise<number>;

  getReviews(subjectId: string): Promise<Review[]>;
  createTicket(input: CreateTicketInput): Promise<Ticket>;
  getTickets(): Promise<Ticket[]>;
  cancelTicket(id: string): Promise<void>;

  search(query: string): Promise<{ movies: Movie[]; cinemas: Cinema[] }>;
  validatePromo(code: string): Promise<Promo | null>;
}
```

- `src/data/mock/` implements the interface.
- Screens never import mock arrays directly; they use hooks like `useMovies(filters)` that call the repository.
- Add artificial latency (250–450 ms) in dev so skeletons are visible; set to 0 in tests.
- The repository is the seam for a future API.

---

## 7. Mock catalogue

### 7.1 Films (14)

| id | Title | Year | Runtime | Genres | Score | Status | Featured |
|---|---|---|---|---|---|---|---|
| `midnight-meridian` | Midnight Meridian | 2026 | 128 | Sci-fi, Thriller | 8.6 | now-showing | yes |
| `the-last-horizon` | The Last Horizon | 2025 | 131 | Adventure, Sci-fi | 8.6 | now-showing | yes |
| `the-green-room` | The Green Room | 2026 | 116 | Drama | 8.3 | now-showing | yes |
| `a-paris-between-us` | A Paris Between Us | 2025 | 109 | Romance | 7.9 | now-showing | yes |
| `the-deep-quiet` | The Deep Quiet | 2026 | 143 | Thriller | 8.1 | now-showing | no |
| `open-road` | Open Road | 2025 | 114 | Action | 7.8 | now-showing | no |
| `foxglove-and-moss` | Foxglove & Moss | 2026 | 97 | Animation | 9.0 | now-showing | no |
| `the-last-witness` | The Last Witness | 2025 | 124 | Drama | 8.0 | now-showing | no |
| `whiteout` | Whiteout | 2026 | 118 | Survival, Thriller | 7.7 | now-showing | no |
| `blue-note-sunday` | Blue Note Sunday | 2025 | 106 | Music, Drama | 8.2 | now-showing | no |
| `the-quiet-green` | The Quiet Green | 2026 | 121 | Sci-fi | 8.5 | now-showing | no |
| `the-island-map` | The Island Map | 2025 | 112 | Adventure | 8.1 | now-showing | no |
| `curtain-call` | Curtain Call | 2026 | 111 | Drama | 7.9 | now-showing | no |
| `the-bamboo-line` | The Bamboo Line | 2026 | 127 | Action | 8.4 | coming-soon | no |

- Posters and backdrops are original neutral artwork in `assets/mock/posters/` and `assets/mock/backdrops/`, 2:3 and 3:4. Do not use real film assets.
- Cast names are fictional; initials are used for avatars.
- Reviews: 6–8 per film, varied length, 1–5 stars, realistic tone. No repeated demo text.

### 7.2 Cinemas (8)

| id | Name | Area | Distance | Drive | Rating | Amenities |
|---|---|---|---|---|---|---|
| `meridian-vi` | The Meridian, Victoria Island | Victoria Island | 0.8 km | 6 min | 4.8 | imax, recliner, parking, food, accessible |
| `palace-ikeja` | Palace Cinemas, Ikeja | Ikeja GRA | 2.4 km | 12 min | 4.7 | imax, parking, food, accessible |
| `picture-house-surulere` | The Picture House, Surulere | Surulere | 3.1 km | 14 min | 4.6 | recliner, food, accessible |
| `open-air-lekki` | The Open Air, Lekki | Lekki Phase 1 | 4.2 km | 18 min | 4.9 | food, parking, accessible |
| `silverbird-yaba` | Silverbird Screens, Yaba | Yaba | 4.8 km | 20 min | 4.5 | 3d, parking, food |
| `screening-room-ikoyi` | The Screening Room, Ikoyi | Ikoyi | 4.9 km | 16 min | 4.8 | recliner, food, accessible |
| `grand-view-ajah` | Grand View Cinema, Ajah | Sangotedo | 5.4 km | 24 min | 4.4 | parking, food |
| `west-end-festac` | West End Cinemas, Festac | Festac Town | 6.2 km | 28 min | 4.6 | 3d, parking, food |

- All names are fictional. Do not imply a real cinema partnership.
- Gallery images are original neutral cinema interiors, 16:9.
- `mapPoint` is a normalized coordinate for the static map; keep pins inside the land area.

### 7.3 Screens and seat layouts

| Screen | Format | Rows | Seats/row | Aisles after | Sections |
|---|---|---|---|---|---|
| Screen 1 | 2D | A–G | 10 | 5 | Orchestra A–E, Balcony F–G, Accessible A1–A2 |
| Screen 2 | 3D | A–H | 12 | 6 | Orchestra A–E, Balcony F–H, Accessible A1–A2 |
| Screen 3 | IMAX | A–J | 14 | 4, 10 | Orchestra A–F, Balcony G–J, Accessible A1–A2 |

Seat types:

- Accessible: A1–A2.
- Premium: Screen 1 F–G; Screen 2 G–H; Screen 3 H–J.
- Standard: all other seats.
- Companion: available adjacent to accessible seats; created on demand in the UI, not in the base layout.

Deterministic unavailable seats: use a seeded hash of `showtimeId + seatId` so the same showtime always has the same availability. Reserve ~8–15% unavailable, plus a few seats to create “few left” scenarios. Never randomize on every render.

### 7.4 Showtimes

Generate for the next 10 days:

- Times: 12:15, 13:30, 15:45, 17:10, 19:20, 20:40.
- Each cinema/screen gets a subset based on format and film.
- `basePriceMinor`: Standard ₦7,500; 3D ₦8,500; IMAX ₦12,000; Dolby ₦10,000. Premium surcharge ₦2,500.
- `seatsRemaining` derived from the layout + unavailable seats.
- `startsAt` in `Africa/Lagos`, rendered in the device locale but labeled with the cinema area.
- Past times are filtered out; the date strip starts today.

### 7.5 Ticket types

| id | Label | Description | Adjustment |
|---|---|---|---|
| `adult` | Adult | Ages 12+ | 0 |
| `child` | Child | Ages 3–11 | −₦1,500 |
| `student` | Student | Valid student ID required | −₦1,000 |
| `senior` | Senior | Ages 65+ | −₦2,000 |

### 7.6 Promo codes

| Code | Kind | Value | Requires |
|---|---|---|---|
| `JOKO10` | percent | 10% of tickets | — |
| `STUDENT500` | fixed | ₦500 | at least one student ticket |

Validation is case-insensitive; trim whitespace. Expired codes return `null` and the UI shows an inline error.

### 7.7 Reviews

- 6–8 per film, 2–3 per cinema.
- Ratings distributed realistically (not all 5).
- Bodies 1–4 sentences, varied tone, no repeated phrases.
- Helpful counts varied.
- Dates within the last 90 days.
- No real people or celebrity names.

### 7.8 Notifications (seeded)

Three items as described in `08-tickets-and-account.md`, tied to the seeded ticket/movie data.

---

## 8. Pricing functions

```ts
export const SERVICE_FEE_MINOR = 300_00;

export const linePriceMinor = (seat: SeatSelection) => {
  const type = TICKET_TYPES[seat.ticketType];
  return Math.max(0, seat.priceMinor + type.adjustmentMinor);
};

export const subtotalMinor = (seats: SeatSelection[]) =>
  seats.reduce((sum, seat) => sum + linePriceMinor(seat), 0);

export const promoDiscountMinor = (promo: Promo | null, seats: SeatSelection[]) => {
  if (!promo) return 0;
  if (promo.requiresTicketType && !seats.some(s => s.ticketType === promo.requiresTicketType)) return 0;
  const subtotal = subtotalMinor(seats);
  return promo.kind === 'percent'
    ? Math.round(subtotal * (promo.value / 100))
    : Math.min(subtotal, promo.value);
};

export const totalMinor = (seats: SeatSelection[], promo: Promo | null) =>
  Math.max(0, subtotalMinor(seats) + SERVICE_FEE_MINOR - promoDiscountMinor(promo, seats));
```

- The service fee is per booking, not per seat.
- Taxes are included; show “Included”.
- Promo applies to tickets only.
- Rounding is integer; no floating point in the final amount.

---

## 9. Date and time utilities

```ts
export const toISODate = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000);
export const isSameDay = (a: Date, b: Date) => toISODate(a) === toISODate(b);
export const isFuture = (iso: string) => new Date(iso).getTime() > Date.now();

export const formatShowtime = (iso: string, timezone: string) =>
  new Intl.DateTimeFormat(market.locale, {
    hour: 'numeric', minute: '2-digit', hour12: true, timeZone: timezone,
  }).format(new Date(iso));

export const formatDate = (iso: string, timezone: string) =>
  new Intl.DateTimeFormat(market.locale, {
    weekday: 'short', day: 'numeric', month: 'short', timeZone: timezone,
  }).format(new Date(iso));
```

- 12-hour default for `en-NG`; respect the device locale where possible.
- Include a timezone label when the cinema is outside `market.timezone`.
- Use tabular numerals in the UI.

---

## 10. Payment adapter

See `07-booking-flow.md` for the interface. Implementation rules:

- `src/services/payments/mockProvider.ts` implements `PaymentProvider`.
- Deterministic test outcomes: card ending `0002` declines, `0003` times out, otherwise succeeds.
- `charge` returns a `reference` on success.
- Store only the last 4 and brand for saved cards; never the PAN or CVC.
- Idempotency key generated when the payment screen mounts; reused on retry.
- In production, replace with a backend endpoint that uses Paystack/Flutterwave server-side. Do not call provider secret keys from the app.

---

## 11. Persistence matrix

| Data | Storage | Survives restart |
|---|---|---|
| Booking draft | Zustand memory | No |
| Tickets | Zustand persist + AsyncStorage | Yes |
| Profile | Zustand persist + AsyncStorage | Yes |
| Saved movies | Profile persist | Yes |
| Preferences (theme, haptics, notifications) | Zustand persist + AsyncStorage | Yes |
| Recent searches | AsyncStorage | Yes |
| Card details / CVC | Never stored | No |
| Location permission | OS | Managed by OS |

Storage keys:

```
joko.tickets.v1
joko.profile.v1
joko.preferences.v1
joko.recent-searches.v1
```

Version every persisted store and provide a migration.

---

## 12. Route guards

Implement as small hooks:

```ts
useRequireShowtime();   // seats
useRequireSeats();      // review
useRequireDraft();      // payment
useRequirePaidBooking();// success
useRequireTicket(id);   // ticket detail
```

- If the guard fails, redirect with `router.replace` and show a toast explaining why.
- Never render a payment or success screen with missing data.
- Guards must not create infinite redirect loops; use a `from` param or a one-time toast.

---

## 13. Data acceptance

- [ ] Every screen reads through the repository/hook, not mock arrays directly.
- [ ] Types are strict; no `any` in data or stores.
- [ ] Money is integer minor units; formatting is centralized.
- [ ] Totals are derived, not duplicated in state.
- [ ] Tickets are persisted and idempotent by booking reference.
- [ ] Preferences persist; the booking draft does not.
- [ ] Showtimes are future-only and deterministic.
- [ ] Seat availability is deterministic per showtime.
- [ ] Promo rules match the spec.
- [ ] Route guards prevent invalid payment/success states.
- [ ] Mock content is original, varied, and free of third-party marks.

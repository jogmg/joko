# 17 — Decision Log

ADR-style record of the choices that shape the build. Add a new entry before changing a screen or a rule.

Format: **Context → Decision → Consequences**.

---

## D1 — Five bottom tabs, no drawer

**Context:** The old screens use a hamburger/side drawer. The new screens use a four-tab bar without Tickets. The product requires saved tickets.

**Decision:** Five tabs: Home, Movies, Cinemas, Tickets, Account. Remove the drawer entirely. Settings and Help move into Account.

**Consequences:** Tickets is a first-class destination. The Account “My tickets” card remains as a shortcut. No hamburger anywhere.

---

## D2 — Three visible booking steps

**Context:** The new screens show inconsistent step 2 labels (“Choose your seats”, “Choose tickets”, “Review booking”). The brief asks for three confident steps.

**Decision:** `Date & time → Seats → Payment`. Cinema selection is a pre-step without an indicator. Review order is step 3a, a sub-state of Payment.

**Consequences:** No five-diamond indicator. Review and payment share step 3. The step labels are canonical across screens.

---

## D3 — Ticket types per seat, no quantity screen

**Context:** The new “Choose tickets” screen picks quantities before seats, so totals can disagree with the map. The brief explicitly says to remove it.

**Decision:** Delete the quantity screen. Each selected seat gets a ticket type (Adult/Child/Student/Senior) in the seat selection sheet. Seat count = ticket count. Max 8 seats.

**Consequences:** One less step. The seat sheet becomes the place for per-seat pricing. The review reflects mixed ticket types. Pricing must be derived.

---

## D4 — Lagos/NGN default, configurable market

**Context:** The new screens show Lagos cinemas, a Nigerian user, Paystack/Flutterwave, and Nigeria billing, but keep `$` prices from the US brief. That is an unresolved placeholder.

**Decision:** Default to Lagos, Nigeria, `NGN`, `en-NG`, `Africa/Lagos`. Put locale/currency/timezone/city in `src/config/market.ts`.

**Consequences:** Mock prices are in kobo and formatted as ₦. Payment methods include transfer and local wallets. A US/UK launch is a config change, not a rewrite. The mockups’ `$` is ignored.

---

## D5 — Two-column poster grid on phones

**Context:** The new Movies screen uses three columns at phone width, which makes cards ~104 dp and titles cramped.

**Decision:** Two columns below 600 dp; three at ≥ 600 dp. Remove desktop artifacts like `⌘K`.

**Consequences:** Larger posters, readable titles. Tablet gets a denser grid. The Movies screen remains virtualized with `numColumns`.

---

## D6 — Splash expands; asset must be replaced

**Context:** The canonical splash is `old/Splash Screen - 1.jpg`. The current `assets/splash.png` is a white image with a small purple roundel and no wordmark. The app has no splash overlay.

**Decision:** Replace the asset with a plum composite lockup. Implement the 1.7 s expansion with a shared layout contract between the native splash and the React overlay. Cold start only.

**Consequences:** A new asset pipeline is required. The overlay and native image must be frame-matched. If matching fails, fall back to a plain plum native background and hold until the overlay is ready.

---

## D7 — One title per screen

**Context:** The new screens repeat the app-bar title as a large H1 and add an overline (“Choose a showtime” three times on one screen).

**Decision:** Discovery screens use a large H1 with no app-bar title. Task/detail screens use an app-bar title and no duplicate H1. Booking screens use the app-bar title + step progress. At most one overline per screen.

**Consequences:** Less vertical waste, clearer hierarchy. The “A GREAT NIGHT STARTS HERE” overline is removed from booking screens. Copy is less repetitive.

---

## D8 — Success is brand, not green

**Context:** The new confirmation uses a large green circle, green “Confirmed”, and green security locks. Green is outside the palette.

**Decision:** Success uses a `primary-container` circle with a `brand` check and a “Confirmed” chip. No green anywhere. Availability uses blush + label; security uses `on-surface-variant`.

**Consequences:** The palette stays cohesive. State still reads clearly because of the check icon and text.

---

## D9 — Card / Transfer / Wallet, simulated provider

**Context:** The brief asks for saved cards, Apple Pay/Google Pay, and a new card form. The new screens add Transfer and local wallet providers. There is no backend or payment SDK.

**Decision:** Three methods: Card (saved + new), Transfer (one-time account), Wallet (platform-aware + Paystack/Flutterwave). Implement a `PaymentProvider` adapter with deterministic simulation. Never store PAN/CVC. Production uses provider-hosted checkout/tokenization.

**Consequences:** The UI is complete and testable without a backend. The simulation must be clearly dev-only. Real payments require a backend and provider integration.

---

## D10 — No map SDK

**Context:** The Cinemas screen shows a map. The approved dependency list has no map library.

**Decision:** Use a static, locally bundled map illustration with normalized pins, clustering, and a preview card. “Open in Maps” uses `Linking`.

**Consequences:** No API keys, no native map setup. The map is decorative/selective, not live navigation. The list remains the primary accessible interface.

---

## D11 — Repository boundary, typed mock data

**Context:** No backend. Screens need realistic data now, but an API will replace it later.

**Decision:** All data access goes through `JokoRepository`; `src/data/mock` implements it. Screens use hooks, never raw arrays. Money in minor units, dates in ISO.

**Consequences:** A future API is a swap. Mock latency makes skeletons visible. Types are the contract.

---

## D12 — Booking draft in memory, tickets persisted

**Context:** A booking is transient; a ticket is a keepsake. Persisting a draft can resurrect stale showtimes.

**Decision:** Booking draft in Zustand memory only. Tickets, profile, preferences, saved movies, and recent searches persisted with AsyncStorage. Card details never persisted.

**Consequences:** Killing the app mid-booking loses the draft. Tickets survive restarts. Stale showtimes cannot be paid for. Persisted stores are versioned.

---

## D13 — Review is not a separate step

**Context:** The new review screen shows step 2 “Review booking”, while other screens show step 2 as seats. The brief says review is a sub-state of payment.

**Decision:** Review and payment share step 3. The indicator label is “Payment”; the app-bar title changes from “Review order” to “Payment”.

**Consequences:** Three steps stay honest. Review is still a distinct screen for clarity and editing.

---

## D14 — One summary per screen

**Context:** The new review screen shows a compact booking card and a second large movie card. The brief forbids a duplicated summary.

**Decision:** Use `BookingSummary` on date-time, seats, and payment. On review, the ticket stub is the only summary. Never show both.

**Consequences:** Less repetition. The ticket stub becomes the visual signature of review/success/tickets.

---

## D15 — No third-party rating marks

**Context:** The old screens use RT/IMDb/Metacritic logos; the new uses “R” and “M” circles that look like the brands.

**Decision:** One Joko Score (star + number) plus plain text audience/critic scores. No logos, letters, or lookalike badges.

**Consequences:** Avoids trademark issues. The Joko score becomes the brand’s own signal.

---

## D16 — Palette-only, no off-palette state colors

**Context:** The new screens use green for success/availability/security, blue for info/accessibility, and pastel avatars outside the ramps.

**Decision:** Every color comes from `03-design-system.md`. States use tokens + icon/label/pattern. Accessible seats use `secondary-container`; info uses `primary-container`; success uses `brand`/`primary-container`; security uses `on-surface-variant`.

**Consequences:** Visual cohesion. State still accessible because color is never the only channel. Design review must catch drift.

---

## D17 — Light and dark are both first-class

**Context:** The app forces light. The brief requires both schemes and `automatic`.

**Decision:** Semantic tokens with light/dark maps, CSS variables, `userInterfaceStyle: "automatic"`, and an Account override (System/Light/Dark) persisted.

**Consequences:** More QA, but no retrofit later. The splash stays plum in both schemes.

---

## D18 — Accessibility is part of the build

**Context:** The seat map is the hardest surface and is easy to make sighted-only.

**Decision:** 44 pt targets, contrast table, labels, dynamic type, reduced motion, focus management, and a “Select by row” modal for screen readers. Seat states always have icon/label.

**Consequences:** Extra work in Phase 6, but the core flow is usable by everyone. The row picker is a required component, not an optional extra.

---

## D19 — Hide unimplemented actions

**Context:** The confirmation shows “Add to wallet” and “Add to calendar”; neither is implemented, and the allowed dependency list lacks the SDKs.

**Decision:** Hide both in MVP. Keep “View ticket” and “Share ticket”. Document them as P1.

**Consequences:** No dead buttons. The confirmation remains useful. Adding them later is additive.

---

## D20 — Payment form is a UI demo; production uses tokenization

**Context:** The brief asks for a card form with number/CVC. Handling raw card data in a consumer app is a security and compliance risk.

**Decision:** The MVP form validates and formats locally, never stores or logs PAN/CVC, and uses a simulated provider. Production must use Paystack/Flutterwave hosted checkout or tokenization via a backend.

**Consequences:** The demo is safe. Real payments require a backend. The UI can keep the same shape when the provider is integrated.

---

## D21 — No emoji, no all-caps, sentence case

**Context:** The new Home greeting uses an emoji; confirmation and section labels use all-caps.

**Decision:** No emoji in UI chrome. Sentence case for buttons, titles, tabs, and section headers. One optional overline per screen may be uppercase.

**Consequences:** A calmer, more premium voice. The overline becomes a deliberate accent rather than decoration.

---

## D22 — QR stays white in dark mode; no brightness dependency

**Context:** QR codes need a light background to scan. The brief suggests boosting screen brightness, but `expo-brightness` is not approved.

**Decision:** Render the QR on a pure-white card with a quiet zone in both schemes. Do not add a brightness dependency in MVP. Document brightness as P1.

**Consequences:** Reliable scanning without a new dependency. The white card is the only allowed pure-white surface.

---

## D23 — Cancel policy: 2 hours

**Context:** The review and ticket screens promise free cancellation up to 2 hours before showtime.

**Decision:** Cancel is available only when the showtime is > 2 hours away. Cancelling sets the ticket to `cancelled`, removes it from Upcoming, and keeps it in Past. Refund is simulated in MVP.

**Consequences:** Clear policy, testable. Real refunds need a backend.

---

## D24 — “Cinemas”, not “Theatres”

**Context:** The old and new screens use “Theatres” / “Movie Theaters”.

**Decision:** Use “Cinemas” in the tab, headers, routes, and copy. Route folder `cinema/[id]`.

**Consequences:** Consistent product language. Existing file names from the brief (`theater/[id]`) are superseded.

---

## D25 — No auth in MVP

**Context:** There is no backend, but the Account screen has a profile and sign out.

**Decision:** Use a local seeded profile. Sign out clears the local profile/saved movies with a confirmation and a toast; it does not block browsing or fake a login screen.

**Consequences:** Account is demonstrable without auth. Real auth is a post-MVP addition. The sign-out copy must be honest.

---

## D26 — Temporary typeset wordmark for the Phase 0 splash

**Context:** The splash contract requires a 504×144 wordmark asset (3× of 168×48). The reference exports in `joko-screens/old` are 375×667, so the plain wordmark is only ~95 px wide and upscaling it to 3× is visibly soft. The documented fallback is Baloo 2 ExtraBold, which is not available offline.

**Decision:** Ship a temporary wordmark typeset in Plus Jakarta Sans ExtraBold at 6× and downsampled to 504×144. Keep the canvas and the splash contract unchanged so final art is a drop-in replacement. The popcorn mark is extracted from the existing plum icon and is faithful to the reference.

**Consequences:** The launch is crisp on 3× screens. The letterforms are close but not identical to the brand wordmark; final brand art is still required before release. Do not derive a permanent wordmark from UI type without revisiting this decision.

---

## Decision review checklist

Before adding a decision:

- [ ] Does it conflict with an existing decision? If so, supersede it explicitly.
- [ ] Does it introduce a dependency outside the approved list?
- [ ] Does it introduce a color outside the palette?
- [ ] Does it affect the booking rules or pricing? Update `07` and `11`.
- [ ] Does it affect accessibility? Update `13`.
- [ ] Does it affect the splash? Update `10`.
- [ ] Is the consequence acceptable for MVP?

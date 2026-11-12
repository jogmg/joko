# 02 — UI Audit and Redesign Decisions

This document records what the reference screens actually show, what is worth keeping, and what must change before implementation. It covers both `joko-screens/old/` (the original brief) and `joko-screens/new/` (the later, more editorial exploration).

The `new/` screens are the stronger visual direction. They are not final: they still contain structural and palette conflicts. The decisions below resolve them.

---

## 1. Summary

### Keep from the new screens

- The editorial voice: large display headings, generous whitespace, sentence case, confident imagery.
- The deep-plum `#280056` and lavender `#EDDCFF` system, warm off-white surfaces, and blush accents.
- The poster-led Home hero with a “Joko pick” chip, score, runtime, age rating, and progress bars.
- Ranked rails with oversized numerals behind posters.
- The compact booking summary card with poster, title, cinema, format, and `Change`.
- The horizontal date strip and format-segmented showtime grid.
- The seat map’s curved screen, labeled rows, premium/accessible seat differentiation, and selection summary.
- The ticket-stub treatment on review and confirmation (poster, perforation, seat chips, QR).
- The payment method segmented control (Card / Transfer / Wallet) and the “Due now” sticky footer.
- The Account “My tickets” card in deep plum.

### Fix across the board

| Issue | Where it appears | Decision |
|---|---|---|
| Four tabs, no Tickets | New Home, Movies, Cinemas, Account, Search | Five tabs: Home, Movies, Cinemas, Tickets, Account. Tickets is a product requirement, not an Account sub-page. |
| “Theatres” naming | Tab bar, Cinemas header | Rename to “Cinemas” everywhere. |
| Duplicated titles | Every booking screen: app bar title + large H1 + overline | One title per screen. Booking screens use the app-bar title + step progress only. Discovery screens use a large H1 and no app-bar title. |
| Repeated overline | “A GREAT NIGHT STARTS HERE” on every booking screen | Remove. Use at most one overline per screen, and only when it adds information. |
| Separate ticket quantity screen | `choose_tickets.png`, `choose_tickets_1.png` | Delete. Ticket types are assigned per selected seat in the seat sheet. Seat count = ticket count. |
| Inconsistent progress steps | Seats says step 2 “Choose your seats”; Tickets says step 2 “Choose tickets”; Review says step 2 “Review booking” | Canonical three steps: Date & time → Seats → Payment. Review is a sub-state of Payment. |
| Off-palette green | Success circle, “8 seats left”, “Confirmed”, security lock | Replace with brand/primary/tertiary tokens. Success = `primary-container` + `brand` check. Availability = `tertiary-container` + icon + label. Security = `on-surface-variant`. |
| Off-palette blue | Accessible seat outline, info banners, wallet info | Replace with `secondary-container` / `primary-container` / `surface-variant`. No blue. |
| Off-palette pastel avatars | Cast initials in blue/green/pink | Use `primary-container`, `secondary-container`, `tertiary-container`, `surface-variant` only. |
| Desktop artifacts | `⌘K` in search fields; 3-column grid on phone width | Remove `⌘K`. Two-column poster grid below 600 dp. |
| All-caps labels | “ADMIT 3 GUESTS”, “DATE”, “TIME”, “YOUR JOKO”, “SUPPORT & SETTINGS” | Sentence case. One overline maximum per screen; avoid all-caps section labels. |
| Low-contrast disabled CTAs | Lavender button with white text | Disabled = `surface-variant` fill + `on-surface-variant` text + lock/disabled icon. Never white on light lavender. |
| Tiny seat map | ~20 px seats with no pan/zoom, only “Zoom in” | Full-screen map, 24 px seats, pinch zoom, pan, +/−/Reset, row picker for screen readers. |
| Error styling for guidance | “Pick 3 more seats to match your tickets” in pink error banner | Guidance is neutral (`surface+1` + info icon). Reserve `error-container` for real errors. |
| Duplicate summary cards | Review shows compact summary + a second large movie card | One summary per screen. On review, the ticket stub is the summary. |
| Missing showtimes on movie detail | New movie detail has no showtimes section | Add a Showtimes section and a sticky “Choose a showtime” CTA that opens it. |
| Static map | Cinemas screen shows a non-interactive map card | List/Map toggle with a stylized map and tappable pins; no map SDK dependency. |
| No loading/empty/error states | All screens | Add skeletons, empty states, error banners, offline state. |
| No dark mode | All screens | Implement both schemes from tokens. |
| “$” prices with Lagos locations | All booking screens | Use NGN by default via `market.ts`; mockups’ `$` is a placeholder. |
| Real-film/celebrity references | Old screens use Black Panther, Avatar, etc. | Replace with original fictional films and neutral poster art. |
| Third-party rating marks | Old screens use RT/IMDb/Metacritic; new uses “R” and “M” circles | One Joko Score plus plain text `Critic 84% · Audience 7.1/10`. No logos or lookalike badges. |
| Green success | Confirmation | Brand check in a `primary-container` circle. No confetti in MVP; optional reduced-motion-safe pulse. |
| “Add to wallet” / “Add to calendar” | Confirmation | Hide until implemented. Do not ship dead buttons. |

---

## 2. Screen-by-screen audit

### 2.1 Splash — `old/Splash Screen - 1.jpg`, `- 2.jpg`

**What works:** the deep plum field, the white popcorn mark, and the “Joko” wordmark are distinctive and calm. The larger mark in `- 2` is a natural expansion frame.

**Problems:**

- The current `assets/splash.png` is not the canonical splash. It is a white image with a small purple popcorn roundel and no wordmark. The native splash will not match the mockup.
- The splash is static; there is no transition into Home.
- The two splash images are treated as separate screens rather than one animation.

**Decision:** keep the identity, replace the asset, and implement the expansion in `10-splash-and-motion.md`. The native splash and React overlay share one layout contract. Cold start only.

### 2.2 Home — `new/home.png`, `old/HOME.jpg`

**New screen strengths:**

- Strong editorial hierarchy: greeting, “Featured today”, curated indicator.
- Hero card with “Joko pick”, score, age rating, runtime, genre, title, primary CTA, save, and progress bars.
- Ranked “Popular this week” rail with oversized 01–05 numerals.
- Multiple taste-based rails (“Because you love sci-fi”).
- “Cinemas near you” rows with thumbnail, name, distance.

**Problems:**

- Four tabs; Tickets missing.
- No location chip, despite the product being location-sensitive.
- The notification bell has a badge but no destination.
- Bookmark icons sit awkwardly beside titles and repeat on every card.
- “Cinemas near you” rows lack next showtime, amenities, and a clear tap affordance.
- No quick format filters (2D/3D/IMAX) even though the brief asks for them.
- No upcoming ticket strip.
- No loading, empty, or error states.
- The greeting uses an emoji; the brand should stay restrained.
- The screen is extremely tall; the rails need virtualization, not a single scroll of all content.

**Decision:** keep the editorial hero and ranked rails; add the location chip, a real notification destination, an upcoming ticket strip, quick filters, and richer cinema rows. Use a `FlatList`/`SectionList` composition with virtualization. Remove the emoji. See `05-screens-discovery.md`.

### 2.3 Movies — `new/movies.png`

**Strengths:**

- “Find your film.” is a strong editorial H1.
- Search-first layout, segmented All / Now showing / Coming soon.
- Poster grid with score chips, title, and meta.
- Footer count (“14 films · All showtimes in local time”).

**Problems:**

- Three columns on a phone-width screenshot. At 390 dp this yields ~104 dp cards, below the 124 dp target and too dense for title legibility.
- `⌘K` shortcut is a desktop/web artifact.
- No filter or sort control.
- Bookmark icons crowd the title row.
- The bottom tab bar overlaps content in the mockup; needs bottom content inset.
- No empty state for no matches.
- No “Coming soon” release-date treatment.

**Decision:** two-column grid on phones, three at ≥ 600 dp; remove `⌘K`; add filter sheet, sort menu, and empty state. Keep the editorial heading. See `05-screens-discovery.md`.

### 2.4 Search — `new/search.png`

**Strengths:**

- Clear search field, quick-start prompts (“Tonight near me”, “Something new”, etc.).
- Calm, spacious layout.

**Problems:**

- Tab bar is visible even though search is a modal task; it distracts and can switch context mid-search.
- `⌘K` again.
- No recent searches, results, or empty state.
- Quick prompts are not obviously tappable rows with a clear outcome.
- No cinema results or grouped results.

**Decision:** make Search a modal route without the tab bar. Include recent searches, trending films, grouped results (Movies / Cinemas), and a helpful no-results state. See `05-screens-discovery.md`.

### 2.5 Movie detail — `new/movie_details.png`, `old/FEATURED TODAY.jpg`

**Strengths:**

- Immersive backdrop, overlapping poster, strong title.
- Metadata chips, score row, dual CTAs.
- Cast rail, story, trailer, review summary.
- Sticky “Tickets from” + “Choose a showtime” bar.

**Problems:**

- “R” and “M” circular badges are lookalikes for third-party rating brands. Replace with plain text.
- The cast avatar backgrounds use blue and green outside the palette.
- “Watch trailer” is a filled charcoal button; it competes with “Book a seat” and is outside the button hierarchy.
- No showtimes section at all. The sticky CTA has nowhere obvious to go.
- The review section says “All 128” but only shows two reviews; no distribution detail beyond bars.
- The “Film details” app bar plus the backdrop is fine, but the page has three header actions in the old version; the new version is cleaner.
- The sticky bar shows a price but not the next showtime.
- “The film everyone’s talking about” is a generic overline; keep only if it is true for the film.
- The poster overlap can collide with the title at large text sizes.

**Decision:** keep the structure, replace rating badges with plain text, palette-safe avatars, make “Watch trailer” a tonal/outline button, add a full Showtimes section with date strip and cinema rows, and make the sticky CTA open that section. Add `Save` and `Share` as icon buttons. See `05-screens-discovery.md`.

### 2.6 Cinemas — `new/theatres.png`, `old/SELECT MOVIE THEATER.jpg`

**Strengths:**

- “Pick your cinema.” editorial H1.
- Search, filter chips, distance-sorted list.
- Cinema cards with image, IMAX badge, name, distance, price-from, show count, rating.
- Two actions per card: `Choose cinema` and `Details`.

**Problems:**

- Tab label “Theatres” contradicts the product language.
- No list/map toggle; the map is a static image at the bottom.
- No drive time, open-now status, amenity icons, or next showtime.
- Two competing actions per card. The whole row should open detail; the CTA should select the cinema in a booking context.
- Bookmark icon sits inside the card without a clear purpose.
- No grouping by distance, despite a distance sort.
- No empty state for filters.
- The map card is decorative, not functional.

**Decision:** rename to Cinemas; add list/map toggle, distance groups, open-now and amenity metadata, next showtime, and one primary row action. Map is a stylized, dependency-free view with tappable pins and a preview card. See `06-screens-cinemas.md`.

### 2.7 Cinema detail — `old/MOVIE THEATER.jpg` (no new screen)

**Problems in the old screen:**

- Huge hero plus three thumbnails; trivia before showtimes.
- Three equal-weight text buttons.
- Reviews dominate.
- “BOOK SEAT” with no showtime.
- No showtimes on the page.

**Decision:** gallery first, then title/status/amenities, four icon actions (Directions, Call, Website, Share), showtimes as the main content, collapsed About, two reviews + See all, map preview. See `06-screens-cinemas.md`.

### 2.8 Choose a showtime — `new/choose_a_showtime.png`, `_1.png`, `old/SELECT DATE AND TIME.jpg`

**Strengths:**

- Clear 3-step progress.
- Compact summary with poster, title, cinema, format, date, and `Change`.
- Date strip with Today/Tomorrow labels and selected state.
- Format segmented control (2D/3D/IMAX).
- Time chips with price and sold-out state.
- Sticky footer with a disabled/enabled CTA and contextual summary.

**Problems:**

- Duplicate title: app bar “Choose a showtime” + H1 “Choose a showtime” + overline.
- “8 seats left” in green, outside the palette.
- Sold-out chip is only differentiated by dashed border and gray; it does include the label, which is good, but the contrast is low.
- The disabled “Next” button is white on light lavender; contrast fails.
- The “3D” segment changes the price but the summary still says “From $22.00” in the first screenshot; ensure the price is tied to the selected format.
- No “few left” state, only sold out.
- The step labels differ from the other screens (“Choose a showtime / Seats / Pay” vs “Showtime / Choose your seats / Pay”).
- Huge empty space between the time grid and the footer on tall devices; the content should scroll naturally, with the footer pinned.
- The calendar icon opens nothing in the mockup; it needs a month sheet.

**Decision:** canonical step labels `Date & time`, `Seats`, `Payment`; remove the duplicate H1 and overline; use `tertiary-container` + “Few left” for low availability; fix disabled contrast; bind prices to format; add month sheet. See `07-booking-flow.md`.

### 2.9 Choose tickets — `new/choose_tickets.png`, `_1.png`

**This screen must be removed.** It contradicts the seat-derived model:

- Quantities are chosen before seats, so the total can disagree with the map.
- It inserts an extra step into a flow that should be three confident steps.
- It asks users to “choose 3 seats on the next screen” without knowing which seats are available together.
- The fee line (“0 tickets · $1.50”) is confusing when no ticket is selected.
- It duplicates the progress indicator and summary.

**Decision:** delete the route and the screen. Assign a ticket type per selected seat in the seat sheet. The seat count is the ticket count. Maximum 8. See `07-booking-flow.md`.

### 2.10 Choose seats — `new/choose_seats.png`, `_1.png`, `old/SELECT SEAT OPTIONS SLIDEUP*.jpg`

**Strengths:**

- Curved screen with a soft glow.
- Row labels, seat numbers, premium and accessible differentiation.
- Selected seat chips and total in the summary.
- Sticky Back / Review booking actions.
- “Every seat is a good seat.” is a nice line.

**Problems:**

- Seats are small and the map is not zoomable beyond a single “Zoom in” button; no pan, zoom out, or reset.
- Accessible seats use a blue outline outside the palette.
- Premium seats use a pink fill that is close to the palette but not tokenized; the star glyph is decorative and unexplained.
- Unavailable seats use a dashed lavender outline; the state relies on low contrast and a pattern that is not explained.
- No row picker for screen readers.
- No max-seat rule or warning.
- “Pick 3 more seats to match your tickets” uses an error banner for guidance.
- The “Choose 3 seats to continue” chip in the summary is confusing; it looks like a button.
- The disabled “Review booking” CTA has poor contrast.
- No per-seat ticket-type selector; the removed quantity screen was doing that job badly.
- No “Best available” action.
- No seat hold or countdown.

**Decision:** full-screen seat step with a 24 px seat grid, pinch/pan, +/−/Reset, legend sheet, row picker, max 8, best available, haptics, per-seat ticket types in an expandable sheet, and a single total. See `07-booking-flow.md`.

### 2.11 Review booking — `new/review_booking.png`, `old/MAKE PAYMENT SLIDEUP.jpg`

**Strengths:**

- Ticket-stub card with poster, perforation, date/time/cinema/screen, seat chips, price breakdown.
- Edit links.
- Free-cancellation trust row.
- Sticky Back / Proceed to payment.

**Problems:**

- Duplicate title and overline.
- Two summaries: the compact booking card at the top and the ticket card below. Remove the compact card on this screen.
- Progress says step 2 “Review booking” while other screens say step 2 is seats. Review should be part of Payment (step 3).
- The popcorn upsell is out of scope for MVP and adds a decision at the worst moment.
- “Taxes Included” is not a price row; use a clear `Included` value or omit.
- The seat list shows `E5`, `F6`, `A2` but the ticket line says `3 × Adult tickets`; with per-seat types this should reflect mixed types.
- Edit links are scattered and small; use a consistent edit affordance per section.

**Decision:** one ticket-stub summary, step 3 active, per-seat types, promo row, trust row, sticky CTA. Remove the upsell. See `07-booking-flow.md`.

### 2.12 Payment — `new/payment_card.png`, `payment_transfer.png`, `payment_wallet.png`, `old/PAYMENT.jpg`

**Strengths:**

- Card / Transfer / Wallet segmented control.
- Clear field labels, inline icons, saved-card affordance, billing country.
- Order summary row and “Due now” sticky footer.
- Security note.

**Problems:**

- Duplicate title and overline.
- “SAFE & SECURE CHECKOUT” and “Order summary” labels are inconsistent in case and weight.
- Green lock icon and blue info banner are outside the palette.
- Card number placeholder has no brand mark until typed; no formatting/validation shown.
- No saved-card list or default selection; the mockup jumps straight to a new card form.
- No loading, failure, or 3-D Secure state.
- “This is a booking preview; no payment information is sent or stored” is honest for a demo, but the production path must use tokenization/provider-hosted checkout.
- The wallet provider chips (Paystack, Flutterwave, Apple Pay) are not platform-aware.
- The “Save this card” toggle is a custom switch; use the platform switch for accessibility.
- Billing country is a dropdown with no visible options.

**Decision:** keep Card/Transfer/Wallet; add saved cards and a new-card form; format and validate inputs; add loading/failure/retry and 3DS note; use palette-safe security cues; simulated provider adapter. See `07-booking-flow.md`.

### 2.13 Booking confirmed — `new/booking_confirmed.png`, `old/PAYMENT SUCCESSFUL.jpg`

**Strengths:**

- Ticket card with QR, booking reference, date/time/cinema/screen, seats, total.
- Clear primary “View ticket”, secondary actions, “Done — back to Home”.
- “Getting to…” row.

**Problems:**

- Large green success circle and green “Confirmed” text are outside the palette.
- “YOUR NIGHT IS SORTED” and “ADMIT 3 GUESTS” are all-caps.
- “Add to wallet” and “Add to calendar” are shown but not implemented; they are dead buttons.
- “Done — back to Home” uses an em dash and competes with the primary action.
- The QR has no booking reference under it (it is above), and the ticket is not obviously saved.
- No auto-save confirmation.
- Deep-link guard is unspecified.

**Decision:** brand check, no green, sentence case, auto-save with a one-line note, hide unimplemented actions, guard the route, reuse the ticket component. See `07-booking-flow.md`.

### 2.14 Account — `new/account.png`

**Strengths:**

- Profile header with avatar, name, email, overflow.
- Deep-plum “My tickets” card.
- Clear grouped rows with icons and chevrons.

**Problems:**

- No Tickets tab; “My tickets” is a card, not a destination in the bar.
- All-caps section labels (“YOUR JOKO”, “SUPPORT & SETTINGS”).
- Missing Appearance/theme control, Sign out, About, and notification settings detail.
- “Saved movies 0 saved” should show a real empty-state action.
- “Preferences” bundles notifications and accessibility without explaining them.
- The overflow menu is undefined.

**Decision:** five tabs, sentence-case section headers, add Appearance, Notifications, About, Sign out, and make “My tickets” a shortcut to the Tickets tab. See `08-tickets-and-account.md`.

---

## 3. Cross-cutting visual issues

### 3.1 Color

The new screens drift outside the palette in five places: success green, availability green, info blue, accessible-seat blue, and security green. They also use pastel avatar colors that are not in the tonal ramps.

**Rule:** every color must come from `03-design-system.md`. If a state needs emphasis, use a token plus an icon, label, or pattern. Never introduce a new hue.

### 3.2 Typography

- The display face is close to Plus Jakarta Sans ExtraBold; keep it.
- The wordmark is a custom rounded face. Do not retype it; use the exported wordmark asset.
- The mockups use large H1s and then repeat the same words in the app bar. Remove the duplication.
- Several labels are all-caps with wide tracking. Limit to one overline per screen; everything else sentence case.
- Prices and times should use tabular numerals.

### 3.3 Spacing and density

- The mockups are generous, which is good, but the booking screens have large dead zones between content and the sticky footer. Let content scroll under the footer; do not stretch cards to fill.
- Cards are 20–24 dp radius; keep that. Reduce the number of 1 px outlines; use surface tint and spacing.
- The phone grid must not be three columns. Two columns at 390 dp; three at ≥ 600 dp.

### 3.4 Hierarchy

- The new screens often have three competing emphasis points: app-bar title, H1, and a filled CTA. Keep one H1, one primary CTA, and let the rest be secondary.
- The “Change” link on the booking summary is useful; keep it but make it a 44 pt target.
- The sticky footer is the right pattern for booking. It must show the current choice and total, not just “Next”.

### 3.5 Motion

The mockups are static. The plan adds motion only where it clarifies state: splash expansion, sheet transitions, seat selection, step changes, success. No decorative bounce, no scroll-jacking, no layout animation.

### 3.6 Content

- Replace generic marketing lines with specific information: exact date, time, auditorium, seat labels, price.
- Reviews must read like real people, with varied length and tone. The mockups repeat “Helpful 12” and similar lines; replace with a seeded set of 6–8 reviews per film.
- Remove emoji from greetings.
- Use “Cinemas”, “Book tickets”, “Continue”, “Pay ₦…”, “View ticket”.

---

## 4. What the final app should feel like

- **Opening:** a calm plum field, the popcorn mark, the wordmark, then the mark expands and the wordmark docks into Home. No white flash.
- **Home:** a film magazine cover, not a dashboard. One hero, one upcoming ticket, a few strong rails, cinemas nearby.
- **Booking:** a focused task mode. No tab bar. One summary, one step indicator, one primary action. The seat map is the star.
- **Ticket:** a keepsake. The same stub appears on review, success, the Tickets tab, and ticket detail.
- **Account:** quiet utility, not a settings maze.

---

## 5. Audit acceptance

Before a screen is considered “designed”, it must answer:

- [ ] Is there exactly one title and one primary action?
- [ ] Does every color come from a token?
- [ ] Is there a loading, empty, and error state?
- [ ] Is every touch target ≥ 44 pt and labeled?
- [ ] Does it work in light and dark mode?
- [ ] Does it work at 320 dp and 200% text size?
- [ ] Is the content specific and in sentence case?
- [ ] Is the screen free of third-party marks and real film assets?
- [ ] If it is a booking screen, does it reuse `BookingSummary` and `StepProgress`?
- [ ] If it shows a list, is it virtualized?

# 01 — Product Brief

## 1. One-line description

Joko helps people in Lagos find a film worth leaving home for, pick a cinema and showtime, choose exact seats, pay, and carry a valid ticket in their pocket.

## 2. The problem

Booking a cinema seat today is fragmented:

- Discovery happens on social media, trailers, and word of mouth.
- Showtimes live on cinema websites or in WhatsApp posts.
- Seat selection is often a static image or a phone call.
- Payment and confirmation are separate from the ticket.
- People arrive without a record of what they booked.

Joko collapses discovery, showtime selection, seat choice, payment, and the ticket into one continuous flow.

## 3. Audience

**Primary:** 18–34, urban Lagos, comfortable paying on mobile, goes to the cinema 1–4 times a month, often books 1–3 days ahead for evenings and weekends.

**Secondary:** small groups (dates, friends, family) booking 2–6 seats together; students looking for cheaper weekday shows; film enthusiasts who care about format (IMAX, Dolby) and seat quality.

**Not the target for MVP:** cinema operators, ticketing staff, enterprise reporting, concessions ordering, or social features.

## 4. Jobs to be done

| When… | I want to… | So I can… |
|---|---|---|
| I hear about a film | see whether it is showing near me and whether it is good | decide if it is worth a trip |
| I am planning a night out | compare cinemas, times, formats, and prices | pick the best combination |
| I am booking for a group | see which seats are available together | sit with my people |
| I am paying | use a familiar method and know the total before I commit | trust the purchase |
| I arrive at the cinema | show a clear, scannable ticket | get in without friction |
| I change my mind | find or cancel my booking | recover without calling anyone |

## 5. Product principles

1. **One decision per screen.** Each step asks for one thing and makes the next action obvious.
2. **Show the real thing.** Exact date, time, auditorium, seat labels, and price — never “Feb 23–25” or a vague “evening”.
3. **Calm, not clinical.** Editorial typography and large imagery; no admin-panel tables, no dense chrome.
4. **The seat map is the product.** It must be legible, fast, zoomable, and honest about availability.
5. **Never dead-end.** Every empty, error, sold-out, or failed-payment state offers a next action.
6. **The ticket is the reward.** Confirmation and the Tickets tab use the same beautiful, reusable ticket component.

## 6. Core journey

```
Discover ──► Movie detail ──► Choose cinema ──► Date & time ──► Seats ──► Review ──► Pay ──► Ticket
   │              │                                                                         │
   ├─ Home        ├─ About / Showtimes / Cast / Reviews                                     ├─ Tickets tab
   ├─ Movies      └─ Trailer                                                                ├─ Ticket detail
   ├─ Search                                                                                 └─ Share / cancel
   └─ Cinemas
```

Two entry paths must both work:

- **Movie-first:** Home → movie → showtimes → pick a cinema + time → seats.
- **Cinema-first:** Cinemas → cinema → showtimes → pick a film + time → seats.

Both converge on the same booking draft.

## 7. MVP scope

### In scope

- Splash expansion into Home.
- Home with featured carousel, upcoming ticket strip, quick filters, ranked rails, cinemas nearby.
- Movies browse with search, segmented Now showing / Coming soon, filters, sort, 2-column grid.
- Movie detail with About, Showtimes, Cast, Reviews, trailer, sticky booking CTA.
- Cinemas list with distance grouping, filters, sort, list/map toggle.
- Cinema detail with gallery, amenities, showtimes, about, reviews, map link.
- Booking: cinema selection (when needed), date & time, seat map with per-seat ticket types, review, payment, success.
- Payment: card, bank transfer, wallet; saved card and new card form; simulated provider; loading, failure, retry.
- Tickets: upcoming/past, persisted, ticket detail with QR, share, cancel with policy.
- Account: profile, saved movies, payment methods, booking history, preferences (appearance, notifications), help, privacy, about, sign out.
- Light and dark themes.
- Loading skeletons, empty states, error states, offline state.
- Accessibility: screen-reader seat picker, 44 pt targets, dynamic type, reduced motion.

### Explicitly out of scope for MVP

- Real backend, authentication, or server-side seat locking.
- Real payment processing; the provider is simulated behind an adapter.
- Concessions ordering (popcorn/drinks upsell).
- Add to Apple/Google Wallet.
- Add to device calendar.
- Push notifications; the bell opens a seeded notification sheet.
- Social features, reviews written by users, following.
- Loyalty points, gift cards, subscriptions.
- Cinema operator tools.
- Tablet-specific layouts beyond a responsive grid.
- Web as a supported target (it may run, but is not QA’d).

## 8. Success metrics

For a real launch, instrument these. For the build, they define what “good” means.

| Metric | Target |
|---|---|
| Time from app open to Home interactive | ≤ 1.8 s on a mid-range Android device |
| Discovery → showtime selection completion | ≥ 60% of movie-detail sessions |
| Seat step completion (≥ 1 seat → Continue) | ≥ 75% |
| Payment success rate (simulated) | ≥ 95% in test scenarios |
| Booking abandonment at payment | < 20% |
| Crash-free sessions | ≥ 99.5% |
| Accessibility: booking flow usable with VoiceOver/TalkBack | 100% of steps |
| Cold-start white flash | 0 frames |

## 9. Constraints

- Expo SDK 56, React Native 0.85, React 19, TypeScript strict.
- Expo Router with `src/app`.
- NativeWind + Tailwind CSS 3.
- Reanimated 4 + worklets for motion.
- Zustand for state.
- No backend. Typed mock data with a repository boundary so an API can replace it.
- Only the dependencies listed in `JOKO_REDESIGN_PROMPT.md` may be added, plus their required peers. No UI kit, no extra navigation library, no map SDK.
- iOS and Android are required. Web is a bonus.

## 10. Market and currency decision

The new mockups show Lagos locations, a Nigerian user, Paystack and Flutterwave, and a billing country of Nigeria, but they retain `$` prices from the older US brief. That is an unresolved placeholder, not a product decision.

**Decision:** ship the default market as Lagos, Nigeria, with `NGN`, `en-NG`, and `Africa/Lagos`. Keep the market in one config file so a US or UK launch is a configuration change, not a rewrite.

Implications:

- Prices in mock data are in kobo (minor units). The pricing model is defined once in [11-data-and-state.md](./11-data-and-state.md) (§7.4–7.5) and [07-booking-flow.md](./07-booking-flow.md) (§8): a showtime base price per format (Standard ₦7,500, 3D ₦8,500, Dolby ₦10,000, IMAX ₦12,000) plus a seat-type surcharge (Premium +₦2,500), then a per-seat ticket-type adjustment (Child −₦1,500, Student −₦1,000, Senior −₦2,000), plus a flat ₦300 booking fee. Do not duplicate these numbers elsewhere; link to the pricing section.
- Format with `Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 })`.
- Payment methods: Card, Bank transfer, Wallet. Wallet surfaces Apple Pay / Google Pay where the platform supports them and Paystack / Flutterwave as provider choices.
- Cinema names and addresses stay fictional but Lagos-plausible. Do not imply a real cinema partnership.

## 11. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Splash and React overlay do not align, causing a logo jump | One shared layout contract, native composite asset, `onLayout` gate, frame-by-frame QA |
| Seat map is too dense on 320 px screens | 20 px minimum seat, horizontal pan, pinch zoom, row picker fallback |
| Payment form implies real processing | Simulated adapter, explicit “demo” behavior in dev, no PAN storage, provider-hosted checkout recommended for production |
| Mockup content includes off-palette green/blue | Token audit in review; lint rule or palette allowlist |
| Booking state drifts between screens | One Zustand draft, derived totals, no duplicated price state |
| Two entry paths create inconsistent drafts | A single `startBooking()` action that resets or preserves state intentionally |
| No backend means no real seat locking | Local 10-minute hold simulation; clear copy that availability is confirmed at payment |
| Dark mode contrast regressions | Contrast table in `13-accessibility.md`, visual QA in both schemes |

## 12. What “done” looks like for the user

A first-time user can open Joko, understand what is playing, find a film and a cinema, pick two seats together, see the exact total, pay, and show a QR ticket — without leaving the app, without seeing a dead button, and without wondering whether the booking worked.

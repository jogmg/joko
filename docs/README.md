# Joko — Implementation Documentation

This folder is the working source of truth for building the Joko mobile app. It turns the reference mockups in `joko-screens/` and the brief in `JOKO_REDESIGN_PROMPT.md` into an implementable plan.

The app is a seat-reservation product: discover a film, choose a cinema and showtime, pick seats on a theatre map, pay, and keep a ticket.

---

## Read in this order

| # | Document | What it answers |
|---|---|---|
| 01 | [Product brief](./01-product-brief.md) | Who it is for, what ships in MVP, how success is measured |
| 02 | [UI audit](./02-ui-audit.md) | What the old and new mockups get right, what must change, and why |
| 03 | [Design system](./03-design-system.md) | Palette, semantic tokens, type, spacing, surfaces, imagery rules |
| 04 | [Navigation and IA](./04-navigation-and-ia.md) | Route map, five-tab bar, headers, deep links, booking shell |
| 05 | [Discovery screens](./05-screens-discovery.md) | Splash, Home, Movies, Search, Movie detail |
| 06 | [Cinema screens](./06-screens-cinemas.md) | Cinemas list/map and cinema detail |
| 07 | [Booking flow](./07-booking-flow.md) | Cinema → date/time → seats → review → payment → success |
| 08 | [Tickets and Account](./08-tickets-and-account.md) | Tickets tab, ticket detail, account and settings |
| 09 | [Component library](./09-component-library.md) | Every reusable component, its props and states |
| 10 | [Splash and motion](./10-splash-and-motion.md) | The signature splash expansion, motion tokens, haptics |
| 11 | [Data and state](./11-data-and-state.md) | Types, mock data, stores, pricing, persistence, guards |
| 12 | [Architecture](./12-architecture.md) | Folder structure, providers, theming, performance, tooling |
| 13 | [Accessibility](./13-accessibility.md) | Touch targets, contrast, screen reader seat picker, dynamic type |
| 14 | [Content and assets](./14-content-and-assets.md) | Voice, terminology, copy deck, asset production, splash fix |
| 15 | [QA and release](./15-qa-and-release.md) | Test matrix, acceptance criteria, release checklist |
| 16 | [Roadmap](./16-roadmap.md) | Phased build order, dependencies, exit criteria |
| 17 | [Decisions](./17-decisions.md) | ADR-style record of the choices that shape the build |

---

## Product snapshot

- **Name:** Joko
- **Category:** Movie discovery and cinema seat reservation
- **Platforms:** iOS and Android (Expo SDK 56, React Native 0.85, React 19, TypeScript strict)
- **Default market:** Lagos, Nigeria. Currency `NGN`, locale `en-NG`, timezone `Africa/Lagos`.
- **Market is configurable:** one `src/config/market.ts` file controls locale, currency, timezone, and default city. The mockups show `$` placeholders; the shipped copy uses the configured currency.
- **Visual identity:** deep plum `#280056`, lavender `#EDDCFF`, blush `#FFD8E0`, warm off-white `#FFFBFF`, near-black `#1D1B1E`. Cinematic, editorial, quiet.
- **Signature moment:** the existing popcorn + “Joko” splash expands into Home on cold start.

---

## Canonical decisions (short form)

These are expanded in [17-decisions.md](./17-decisions.md). Every screen spec assumes them.

1. **Five bottom tabs:** Home, Movies, Cinemas, Tickets, Account. No side drawer, no hamburger.
2. **Three visible booking steps:** Date & time → Seats → Payment. Cinema selection happens before the indicator. Review order is a sub-state of Payment.
3. **Ticket types are assigned per seat.** The separate “Choose tickets” quantity screen is removed. Seat count is the ticket count. Maximum 8 seats.
4. **One title per screen.** Do not repeat the app-bar title as a large heading directly below it. Booking screens use the app-bar title plus the step progress, not a second H1.
5. **“Cinemas”, not “Theatres”.** Use sentence case everywhere.
6. **Success is brand-colored, never green.** No off-palette success, info, or availability colors.
7. **Light and dark are both first-class.** Follow the system setting; persist an override in Account.
8. **Two-column poster grid on phones.** Three columns only at tablet width (≥ 600 dp). Remove desktop artifacts such as `⌘K`.
9. **No third-party rating marks, real posters, or celebrity likenesses.** One Joko Score plus plain-text critic scores.
10. **The mockups are references, not final specs.** Where they conflict with this documentation, this documentation wins.

---

## Source-of-truth hierarchy

When documents disagree, resolve in this order:

1. `docs/03-design-system.md` for color, type, spacing, and component appearance.
2. `docs/04-navigation-and-ia.md` for routes and navigation behavior.
3. `docs/07-booking-flow.md` and `docs/11-data-and-state.md` for booking rules and pricing.
4. `docs/10-splash-and-motion.md` for the launch sequence.
5. The screen documents (`05`, `06`, `08`) for layout and interactions.
6. `joko-screens/new/*` for visual intent and content tone.
7. `JOKO_REDESIGN_PROMPT.md` for background rationale.

If a new decision is needed during implementation, add it to `17-decisions.md` before changing a screen.

---

## Definition of “docs complete”

- Every route in the route map has a spec with layout, states, interactions, data, and acceptance criteria.
- Every reusable component has a defined API and state set.
- The booking rules are unambiguous: seat limits, pricing, holds, guards, persistence.
- The splash sequence is specified frame by frame with a fallback.
- The design tokens are exact and include light/dark values.
- Accessibility and QA checklists are actionable, not aspirational.

---

## Conventions used in these docs

- **Must** = required for MVP. **Should** = required unless explicitly cut. **Could** = post-MVP.
- Sizes are in density-independent points (dp) unless marked px.
- “Screen” means a route. “Sheet” means a bottom sheet over the current route.
- `brand` = `#280056`; `primary` = `#7445B7` in light, `#D8BAFF` in dark. They are not interchangeable.
- All prices are stored in minor units (kobo) and formatted at the edge.
- All dates are stored as ISO strings and rendered in the cinema’s timezone.

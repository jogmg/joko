# 16 — Implementation Roadmap

Build in vertical slices, not horizontal layers. Each phase ends with something you can open, use, and judge on a device.

Estimates assume one experienced React Native engineer. They are relative, not promises.

---

## Phase 0 — Foundations (1–2 days)

**Goal:** the repo is ready for the real app.

- [x] Replace the placeholder root layout with the provider tree.
- [x] Create the five-tab structure and remove the placeholder header image.
- [x] Add `src/theme/tokens.ts`, `typography.ts`, `motion.ts`, `splash.ts`.
- [x] Add `ThemeProvider`, `useTheme`, CSS variables, Tailwind extension.
- [x] Set `userInterfaceStyle: "automatic"`.
- [x] Add Plus Jakarta Sans and the font loading gate.
- [x] Add the approved dependencies.
- [x] Delete the bear store.
- [x] Add `typecheck` script.
- [x] Replace `assets/splash.png` with the canonical lockup; update the adaptive icon background.

**Exit:** app boots to a blank themed screen in light and dark; lint and typecheck pass.

**Phase 0 notes:**

- The wordmark is a typeset fallback (Plus Jakarta Sans ExtraBold) because the reference splash exports are 375×667. Replace it with final brand art; see `assets/brand/README.md` and D26.
- The app icon and adaptive icon were regenerated from the popcorn mark on the plum field so the adaptive background change does not expose the Expo placeholder grid.
- `example/` (the Expo starter demo) was removed; it was untracked and broke `tsc`.
- `baseUrl` was removed from `tsconfig.json` because TypeScript 6 deprecates it; `paths` still resolve from the config directory.

---

## Phase 1 — Splash and shell (2–3 days)

**Goal:** the signature launch works before any real screen is built.

- [ ] Build `SplashOverlay` with the shared layout contract.
- [ ] Implement the 1.7 s timeline: hold, expand, reveal, settle.
- [ ] Add the wordmark dock to the Home header slot.
- [ ] Gate with a module-level cold-start flag.
- [ ] Add reduced-motion cross-fade.
- [ ] Add the native splash handoff (`preventAutoHideAsync`, `onLayout`, `requestAnimationFrame`).
- [ ] Add a temporary Home shell with a header wordmark slot and a hero skeleton.
- [ ] Record at 60 fps and compare frames.

**Exit:** cold start has no white frame, no logo jump, and no double logo; warm resume has no splash.

---

## Phase 2 — Primitives (3–4 days)

**Goal:** the component vocabulary exists.

- [ ] `Text`, `Screen`, `Button`, `IconButton`, `Chip`, `SegmentedControl`.
- [ ] `Input`, `BottomSheet`, `AppBar`, `SectionHeader`, `PressableScale`.
- [ ] `Skeleton`, `EmptyState`, `ErrorBanner`, `Toast`, `PriceRow`.
- [ ] `Avatar`, `Badge`, `Divider`, `PerforatedDivider`, `SwitchRow`.
- [ ] `TabBar` / `TabBarItem` with the active pill and badges.
- [ ] A dev-only component gallery route to inspect light/dark/states.

**Exit:** every primitive renders in light/dark and has pressed/disabled/loading states; the tab bar is usable.

---

## Phase 3 — Data layer (2–3 days)

**Goal:** screens can be built against typed, realistic data.

- [ ] `market.ts`, `types.ts`, `repository.ts`.
- [ ] 14 films with original metadata and mock image references.
- [ ] 8 cinemas, screens, seat layouts.
- [ ] Deterministic showtimes for 10 days.
- [ ] Reviews, cast, trailers, promos, notifications.
- [ ] Mock repository with latency and typed errors.
- [ ] Hooks: movies, cinemas, showtimes, seat layout, tickets.
- [ ] Zustand stores: booking, tickets, profile, preferences, search.
- [ ] Persistence + migrations.
- [ ] Unit tests for pricing, dates, max seats, idempotency (if Jest is added).

**Exit:** a dev screen can list movies, showtimes, and seats from the repository; totals compute correctly.

---

## Phase 4 — Discovery (4–5 days)

**Goal:** Home, Movies, Search, and Movie detail are real.

- [ ] Home header, location chip, hero carousel, upcoming strip, quick filters, rails, cinemas nearby.
- [ ] Movies search, segmented control, filter sheet, sort, grid, empty state.
- [ ] Search modal with recent/prompts/results/empty.
- [ ] Movie detail header, score row, actions, tabs, About, Showtimes, Cast, Reviews, trailer, sticky bar.
- [ ] Loading/empty/error/offline states for each.
- [ ] Virtualized lists; image placeholders.

**Exit:** a user can browse from Home to a movie and tap a showtime that starts a booking draft.

---

## Phase 5 — Cinemas (3–4 days)

**Goal:** cinema discovery and cinema detail.

- [ ] Cinemas list with search, location, sort, filters, distance groups, cards.
- [ ] List/map toggle with the static map, pins, clustering, preview.
- [ ] Cinema detail gallery, title/status, amenities, actions, showtimes, about, reviews, map.
- [ ] Empty/error/location-denied/offline states.

**Exit:** a user can find a cinema, open it, and start a booking with cinema + time preselected.

---

## Phase 6 — Booking (6–8 days)

**Goal:** the full flow works end to end.

- [ ] Booking shell: app bar, `StepProgress`, sticky actions, `BookingSummary`.
- [ ] Choose cinema step (conditional).
- [ ] Date & time: date strip, month sheet, format segmented, showtime chips, states, CTA.
- [ ] Seats: map, zoom/pan, legend, best available, max 8, row picker, selection sheet, per-seat ticket types, total, haptics.
- [ ] Review: ticket stub, breakdown, edit links, promo, trust row.
- [ ] Payment: methods, saved cards, card form, validation, loading/failure/retry/3DS, simulated adapter.
- [ ] Success: brand check, ticket, QR, auto-save, share, guard.
- [ ] Route guards and state preservation.
- [ ] Booking flow accessibility pass.

**Exit:** a complete booking from any entry point produces a persisted ticket; all edge states work.

---

## Phase 7 — Tickets and Account (3–4 days)

**Goal:** the post-booking and settings experience.

- [ ] Tickets tab: segmented, upcoming/past cards, countdown, badge, empty states.
- [ ] Ticket detail: QR, reference, directions, share, cancel policy, past/cancelled states.
- [ ] Account: profile, My tickets card, rows, sign out.
- [ ] Personal details, payment methods, favourites, notifications, appearance, help, about, privacy.
- [ ] Notifications sheet for the Home bell.
- [ ] Theme override persists.

**Exit:** a ticket survives restart, is scannable, can be cancelled, and the Account tab fully replaces the old drawer.

---

## Phase 8 — Polish and hardening (4–5 days)

**Goal:** production quality.

- [ ] Full light/dark audit.
- [ ] 320/375/390/430/768 layouts.
- [ ] 200% text.
- [ ] VoiceOver/TalkBack booking flow.
- [ ] Contrast audit.
- [ ] Reduced motion everywhere.
- [ ] Performance: list virtualization, image caching, splash timing, seat map fps.
- [ ] Offline behavior.
- [ ] Copy audit: sentence case, no all-caps, no dead ends.
- [ ] Palette audit: remove every off-token color.
- [ ] Remove all dev-only copy and dead buttons.
- [ ] Final QA matrix and release checklist.

**Exit:** every item in `15-qa-and-release.md` section 3 passes.

---

## Phase 9 — Post-MVP (optional)

Prioritized backlog:

1. **Real backend + auth.** Replace the repository with API calls; add login.
2. **Real payments.** Paystack/Flutterwave via backend; tokenization; webhooks; refunds.
3. **Seat holds with server enforcement.** 10-minute lock, release on back, expiry.
4. **Add to Wallet / calendar.** `expo-brightness` for QR, `expo-calendar` for events.
5. **Push notifications.** Booking reminders, new releases, offers.
6. **Concessions.** Popcorn/drinks upsell after booking.
7. **Social.** Shareable booking cards, friend invitations.
8. **Loyalty.** Points, rewards, gift cards.
9. **Cinema operator tools.** Separate app, out of scope.
10. **Localization.** Yoruba, French, Arabic; RTL.

---

## 10. Dependency graph

```
Phase 0 (foundations)
  ├── Phase 1 (splash/shell)
  │     └── Phase 2 (primitives)
  │           ├── Phase 4 (discovery)
  │           └── Phase 5 (cinemas)
  └── Phase 3 (data)
        ├── Phase 4
        ├── Phase 5
        └── Phase 6 (booking)
              └── Phase 7 (tickets/account)
                    └── Phase 8 (polish)
```

- Phase 3 can run in parallel with Phase 2 if the data types are agreed first.
- Phase 4 and 5 can run in parallel after primitives + data.
- Phase 6 is the critical path; do not start it before the seat layout and pricing selectors are tested.
- Phase 7 depends on the ticket shape from Phase 6.

---

## 11. Suggested weekly cadence

| Week | Focus | Demo |
|---|---|---|
| 1 | Foundations, tokens, shell, splash | Cold start with expansion |
| 2 | Primitives, data layer | Component gallery + data dev screen |
| 3 | Home, Movies, Search | Browse to movie detail |
| 4 | Movie detail showtimes, Cinemas, cinema detail | Showtime → seats entry |
| 5 | Date/time, seats | Seat map with totals |
| 6 | Review, payment, success | Full booking + ticket |
| 7 | Tickets, Account, notifications | Persisted ticket + settings |
| 8 | Polish, accessibility, QA | Release candidate |

---

## 12. Milestone acceptance

### M1 — Shell
- Splash works.
- Five tabs.
- Theme switch.
- No placeholder screens.

### M2 — Discovery
- Home, Movies, Search, Movie detail complete.
- Showtime tap starts a draft.

### M3 — Cinemas
- Cinemas list/map and detail complete.
- Cinema + time preselection works.

### M4 — Booking
- Full flow works.
- Seat map accessible.
- Payment simulated with failure/retry.
- Ticket persists.

### M5 — Account
- Tickets and Account complete.
- Settings replace the drawer.
- Theme override persists.

### M6 — Release
- QA matrix passes.
- No off-palette colors.
- No dead buttons.
- Lint/typecheck pass.
- 60 fps splash recording reviewed.

---

## 13. What not to do

- Do not build the booking flow before the seat layout, pricing, and guards are settled.
- Do not build screens against raw mock arrays; use the repository.
- Do not add a UI kit or a map SDK to save time.
- Do not postpone accessibility to the end; the seat map is hard to retrofit.
- Do not postpone dark mode; token drift is expensive.
- Do not ship placeholder screens or dead buttons.
- Do not add features outside the MVP before the booking flow is solid.

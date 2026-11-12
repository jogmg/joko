# 15 — QA and Release

## 1. Quality gates

Every merge must pass:

- `npm run lint`
- `npx tsc --noEmit`
- Manual smoke of the changed screens on iOS and Android
- Light and dark screenshots for any visual change
- Accessibility labels on new interactive elements

Every release candidate must pass the full checklist in section 9.

---

## 2. Device matrix

| Device | Width | OS | Why |
|---|---|---|---|
| iPhone SE (3rd gen) | 375 | iOS 17+ | Small screen, home button |
| iPhone 15 | 393 | iOS 18+ | Reference |
| iPhone 15 Pro Max | 430 | iOS 18+ | Large screen |
| Pixel 6a | 412 | Android 14+ | Android reference |
| Small Android | 320 | Android 13+ | Minimum width |
| iPad (optional) | 768 | iPadOS | Tablet grid |

Test each in light and dark, at 100% and 200% text, with VoiceOver/TalkBack for the booking flow.

---

## 3. Functional test cases

### 3.1 Launch

- [ ] Cold start shows the native splash, then the React overlay with no white frame.
- [ ] The mark expands and the wordmark docks into Home.
- [ ] No double logo, no jump, no flash.
- [ ] Cold start to interactive Home ≤ 1.8 s on a mid-range Android.
- [ ] Warm resume shows no splash.
- [ ] Reduced motion shows a 200 ms cross-fade.
- [ ] Deep link to a movie/ticket is not blocked by the splash.

### 3.2 Navigation

- [ ] Five tabs, correct order and labels.
- [ ] No drawer/hamburger anywhere.
- [ ] Tab bar hidden on detail/booking screens.
- [ ] Back and Android hardware back behave correctly.
- [ ] Tab switch cross-fades, no slide.
- [ ] Search is a modal without the tab bar.
- [ ] Tickets badge appears for a show within 24 h.

### 3.3 Home

- [ ] Location chip opens and changes area.
- [ ] Hero auto-advances and pauses on touch.
- [ ] Hero CTA opens the movie/booking path.
- [ ] Upcoming ticket strip appears only when a ticket exists.
- [ ] Quick filters update rails and clear.
- [ ] Rails are virtualized; no nested-list warning.
- [ ] Pull-to-refresh works.
- [ ] Loading/empty/error/offline states render.

### 3.4 Movies

- [ ] Search filters the grid.
- [ ] Segmented control filters.
- [ ] Filter sheet applies/clears and shows a count.
- [ ] Sort changes order.
- [ ] Two columns at 390; three at 768.
- [ ] Empty state clears filters.
- [ ] No `⌘K`.

### 3.5 Movie detail

- [ ] Backdrop/poster layout holds at 320–430 and 200% text.
- [ ] Score row has no third-party marks.
- [ ] Book tickets opens Showtimes.
- [ ] Showtime tap goes directly to seats.
- [ ] Sticky bar appears after scroll and shows the next time.
- [ ] Cast avatars use palette containers.
- [ ] Trailer hidden if unavailable.
- [ ] Reviews varied; see-all works.

### 3.6 Cinemas

- [ ] List/map toggle works.
- [ ] Location change and sort work.
- [ ] Cards show distance, drive time, rating, status, amenities, price, next showtime.
- [ ] Grouped by distance.
- [ ] Map pins select and show a preview; list remains accessible.
- [ ] Empty/error/location-denied states render.
- [ ] Cinema detail showtimes start booking with cinema + time preselected.

### 3.7 Booking — date/time

- [ ] Three steps, correct labels.
- [ ] Date strip 10 days; today marked.
- [ ] Month sheet works.
- [ ] Format changes times and prices.
- [ ] Few-left/sold-out states have labels.
- [ ] CTA reflects selection; disabled helper.
- [ ] No fake inputs, no duplicate H1.

### 3.8 Booking — seats

- [ ] One screen, one sheet; no quantity screen.
- [ ] Seats labeled; zoom/pan/+/−/Reset work.
- [ ] Selected/unavailable/premium/accessible states are clear without color.
- [ ] Max 8 enforced with toast + haptic.
- [ ] Best available selects a block.
- [ ] Per-seat ticket types update the total live.
- [ ] Clear all works.
- [ ] Row picker works with screen reader.
- [ ] Back preserves seats; release confirmation if hold is on.
- [ ] Sold-out/error/offline states render.

### 3.9 Booking — review

- [ ] One ticket stub, no duplicate summary.
- [ ] Step 3 active.
- [ ] Price breakdown correct (tickets, fee, taxes, total).
- [ ] Edit links preserve state.
- [ ] Promo success/error works.
- [ ] Trust row present.
- [ ] CTA disabled for invalid draft.

### 3.10 Booking — payment

- [ ] Card/Transfer/Wallet all work in simulation.
- [ ] Saved cards and new card form.
- [ ] Card number formats and validates (Luhn).
- [ ] Expiry/CVC/name/country validate.
- [ ] Autofill hints work.
- [ ] Total visible near CTA.
- [ ] Loading, declined, timeout, retry, 3DS.
- [ ] No PAN/CVC stored or logged.
- [ ] Success uses replace; back doesn’t return to payment.

### 3.11 Success and tickets

- [ ] No green; brand check.
- [ ] Ticket has QR, reference, seats, cinema, time.
- [ ] Ticket auto-saves and appears in Tickets.
- [ ] View ticket/share work.
- [ ] Back goes Home.
- [ ] Deep link without paid booking shows the empty state.
- [ ] Tickets Upcoming/Past, countdown, badge.
- [ ] Ticket detail QR is white/high contrast in dark mode.
- [ ] Cancel respects the 2-hour policy.
- [ ] Past/cancelled states.

### 3.12 Account

- [ ] Profile and rows work.
- [ ] Appearance System/Light/Dark persists.
- [ ] Saved films empty state.
- [ ] Payment methods add/remove.
- [ ] Notifications toggles persist.
- [ ] Help/About/Privacy screens.
- [ ] Sign out confirms; no fake auth.
- [ ] No all-caps section labels.

### 3.13 Cross-cutting

- [ ] Every list virtualized.
- [ ] Every image has a placeholder.
- [ ] Every icon-only button labeled.
- [ ] Every state has an icon/label, not color alone.
- [ ] Light/dark contrast passes.
- [ ] 320 dp and 200% text.
- [ ] No dead buttons or TODO placeholders.
- [ ] No third-party marks/real posters.
- [ ] No pure black/white surfaces except the QR card.

---

## 4. Performance

| Metric | Target | How |
|---|---|---|
| Cold start to interactive | ≤ 1.8 s | Splash timeline, local data, preloaded hero |
| JS frame rate | 60 fps | UI-thread animations, memoized lists |
| Poster grid scroll | No dropped frames | `expo-image`, `getItemLayout`, memo |
| Seat map pan/zoom | 60 fps | Reanimated transforms, no layout |
| Memory | No unbounded image cache | `expo-image` cache policy |
| Bundle | No unnecessary deps | Approved list only |

Test on a mid-range Android device, not just a simulator.

---

## 5. Offline and failure behavior

- Home: cached content + banner.
- Movies: cached grid + banner.
- Movie detail: cached detail; showtimes disabled with “Connect to see live times.”
- Cinemas: cached list; map unavailable.
- Seats: “Connect to choose seats.” CTA disabled.
- Payment: “Connect to pay.” CTA disabled.
- Tickets: local; “Saved on this device.”
- Success: ticket visible; “Saved on this device.”

No screen may show a blank white page or an infinite spinner.

---

## 6. Analytics events (optional, privacy-safe)

If analytics are added, use a typed event layer. Do not log seat numbers, card data, or personal messages.

| Event | Properties |
|---|---|
| `app_open` | cold/warm |
| `splash_complete` | duration_ms |
| `movie_view` | movie_id, source |
| `showtime_select` | movie_id, cinema_id, format, price_band |
| `seat_select` | showtime_id, seat_count |
| `booking_review` | seat_count, total_band |
| `payment_start` | method, total_band |
| `payment_result` | status, method, error_code |
| `ticket_view` | ticket_id |
| `ticket_cancel` | ticket_id, hours_before |
| `search` | query_length, result_count (not the raw query) |

---

## 7. Release checklist

### Build

- [ ] `app.json` has the correct name, slug, scheme, version, and bundle IDs.
- [ ] `userInterfaceStyle: "automatic"`.
- [ ] Splash asset is the canonical lockup; `imageWidth` matches.
- [ ] Adaptive icon background is `#280056`.
- [ ] No dev-only copy (“demo”, “preview”) in production strings.
- [ ] No console logs of card data.
- [ ] `npm run lint` passes.
- [ ] `npx tsc --noEmit` passes.
- [ ] Production build installs and launches on both platforms.

### Product

- [ ] Full booking flow completes on iOS and Android.
- [ ] Ticket persists across restart.
- [ ] Cancel policy works.
- [ ] Deep links resolve.
- [ ] All empty/error/offline states checked.
- [ ] No dead buttons.
- [ ] No third-party marks.

### Design

- [ ] Light and dark screenshots for every screen.
- [ ] 320/375/390/430 widths.
- [ ] 200% text.
- [ ] Palette audit: no off-palette colors.
- [ ] One title, one primary CTA per screen.
- [ ] Splash recording at 60 fps reviewed.

### Accessibility

- [ ] VoiceOver booking flow.
- [ ] TalkBack booking flow.
- [ ] Seat row picker.
- [ ] Contrast table verified.
- [ ] Reduced motion.
- [ ] Focus trap/restore.

---

## 8. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Splash logo jump | Medium | High | Shared layout contract; frame-by-frame QA; fallback to plain plum |
| Seat map density on 320 | High | Medium | 20 dp min, pan/zoom, row picker |
| Payment implies real charge | Medium | High | Simulated adapter, clear dev copy, provider-hosted production path |
| Off-palette drift | High | Medium | Token-only rule, design review checklist |
| State loss on back | Medium | Medium | Single draft store, guard tests |
| Dark mode contrast | Medium | Medium | Contrast table, screenshots |
| Nested list warnings | Medium | Low | Section data + one virtualized list |
| Fonts fail to load | Low | Medium | System fallback; never block splash |
| QR fails in dark mode | Low | High | White QR card, quiet zone |
| No backend seat locking | High | Medium | Local hold UI, honest copy, no guarantee |

---

## 9. Definition of done

A screen is done when:

- It matches its spec in `docs/05`–`08`.
- It uses only tokens from `docs/03`.
- It has loading, empty, error, and offline states.
- It is accessible (labels, targets, contrast, dynamic type, reduced motion).
- It works in light and dark.
- It has no dead buttons, TODOs, or placeholder copy.
- It passes lint and typecheck.
- It has been tested on at least one iOS and one Android device.
- It has screenshots in the PR.

The app is done when every item in section 3 and the acceptance criteria in `JOKO_REDESIGN_PROMPT.md` section 15 pass.

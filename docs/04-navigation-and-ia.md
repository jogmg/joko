# 04 — Navigation and Information Architecture

## 1. Principles

- Mobile navigation lives in a five-tab bottom bar. There is no drawer and no hamburger anywhere.
- Tabs are peers. Moving between them is a cross-fade, not a horizontal push.
- Detail and task screens push from the right on iOS and fade-through on Android, using the native stack.
- The booking flow is “task mode”: the tab bar is hidden, there is one back affordance, one step indicator, and one primary action.
- Search is a modal task, not a tab.
- Every route is deep-linkable and has a graceful fallback if its required data is missing.

---

## 2. Tab bar

### 2.1 Items

| Order | Label | Route | Active icon | Inactive icon |
|---|---|---|---|---|
| 1 | Home | `(tabs)/index` | `home` | `home-outline` |
| 2 | Movies | `(tabs)/movies` | `film` | `film-outline` |
| 3 | Cinemas | `(tabs)/cinemas` | `location` | `location-outline` |
| 4 | Tickets | `(tabs)/tickets` | `ticket` | `ticket-outline` |
| 5 | Account | `(tabs)/account` | `person-circle` | `person-circle-outline` |

“Cinemas”, not “Theatres” or “Movie Theaters”.

### 2.2 Specification

- Height: 64 + bottom safe-area inset.
- Background: `surface` in light, `surface+2` in dark. 1 px top hairline `outline-variant` at 60% opacity.
- No hard shadow in light mode. A very soft shadow may appear only when content scrolls under the bar.
- Icon 24. Label 11/600, 2 dp below. Labels always visible.
- Active: 32×32 `primary-container` pill behind the icon; icon and label in `brand` (light) or `primary` (dark).
- Inactive: `on-surface-variant`.
- Tap target: at least 48×48, full tab column.
- Transition: 120 ms cross-fade. No slide.
- Content inset: every tab screen adds bottom padding equal to the bar height + 24 dp so content never hides behind it.

### 2.3 Badges

- **Tickets:** a 6 dp dot when an upcoming ticket starts within 24 hours. If there are unused tickets and the count is ≤ 9, a numeric badge is acceptable. Never both.
- **Notifications:** a 6 dp dot on the Home bell when there are unread seeded notifications.
- Badges are not the only indicator: the Tickets screen also shows “Starts in 2 days” and the ticket card is visually distinct.

### 2.4 Visibility

Show the tab bar only on the five tab roots:

- Home
- Movies
- Cinemas
- Tickets
- Account

Hide it on:

- Movie detail
- Cinema detail
- All booking screens
- Ticket detail
- Search
- Notifications
- Any settings/detail screen pushed from Account

---

## 3. Route map

```
src/app/
  _layout.tsx                         Root providers, fonts, splash overlay, stack
  +not-found.tsx

  (tabs)/
    _layout.tsx                       Five-tab bar
    index.tsx                         Home
    movies.tsx                        Browse + search entry
    cinemas.tsx                       Cinema list + map
    tickets.tsx                       Upcoming / past tickets
    account.tsx                       Profile, settings, help

  search.tsx                          Search modal (no tab bar)

  movie/[id].tsx                      Movie detail + showtimes
  cinema/[id].tsx                     Cinema detail + showtimes

  booking/[movieId]/
    cinema.tsx                        Step 0 — choose cinema (skipped when known)
    date-time.tsx                     Step 1 — date + showtime
    seats.tsx                         Step 2 — seat map + ticket types
    review.tsx                        Step 3a — review order
    payment.tsx                       Step 3b — payment
    success.tsx                       Confirmation + ticket

  ticket/[id].tsx                     Saved ticket detail

  account/
    personal-details.tsx
    payment-methods.tsx
    favourites.tsx
    notifications.tsx
    appearance.tsx
    help.tsx
    about.tsx

  notifications.tsx                   Notification sheet/screen
```

### 3.1 Route notes

- `booking/[movieId]/cinema` is the only pre-step. It has no step indicator.
- `booking/[movieId]/date-time` starts the visible three-step indicator.
- `review` and `payment` share step 3. The indicator label is “Payment” on both; the app-bar title changes from “Review order” to “Payment”.
- `success` is guarded: it requires `booking.status === 'paid'` and a created ticket. Otherwise redirect to the movie detail or show an empty state.
- `ticket/[id]` requires a persisted ticket. If missing, show “Ticket not found” with a link to Tickets.
- `movie/[id]` and `cinema/[id]` require valid mock IDs. If missing, show “We couldn’t find that film/cinema” with a back action.

### 3.2 Deep links

The scheme is `joko://` (already configured in `app.json`).

| Link | Behavior |
|---|---|
| `joko://movie/123` | Open movie detail directly; splash still plays as a background reveal but does not force Home |
| `joko://cinema/abc` | Open cinema detail |
| `joko://booking/123/seats` | If a valid draft exists, open seats; otherwise redirect to movie detail with a toast “Start a booking first” |
| `joko://ticket/tkt_123` | Open ticket detail if it exists; otherwise the Tickets tab empty state |
| `joko://booking/123/success` | Only if paid; otherwise redirect to movie detail |

Deep links must not be blocked by the splash. The splash overlay is visual only and `pointerEvents="none"`; navigation happens underneath.

---

## 4. Header strategy

The mockups duplicate the title (app bar + large H1 + overline). The app uses one of two header patterns, never both.

### 4.1 Discovery pattern (Home, Movies, Cinemas, Tickets, Account)

- No app-bar title.
- Large editorial H1 or wordmark in the scroll content.
- Safe-area top padding.
- Actions live in the content header (search, bell, filter, etc.).
- When scrolling, a compact sticky header may fade in (Home: wordmark fades, location chip stays).

### 4.2 Task pattern (detail, booking, settings)

- App bar height 56 + top safe area.
- Left: 44×44 back button (`chevron-back`), labeled “Go back”.
- Center or left-aligned: title 18/600, one line, truncated.
- Right: up to two 44×44 actions.
- Optional progress indicator directly below the app bar (booking only).
- No large H1 repeating the title.
- App bar becomes blurred/solid after 12 dp of scroll on image-led screens.

### 4.3 Booking app-bar titles

| Route | Title | Progress |
|---|---|---|
| `cinema` | Choose a cinema | none |
| `date-time` | Date & time | Step 1 |
| `seats` | Seats | Step 2 |
| `review` | Review order | Step 3 |
| `payment` | Payment | Step 3 |
| `success` | Booking confirmed | none |

---

## 5. Booking shell

A shared `BookingScreen` wrapper provides:

- Safe area and app bar.
- `StepProgress` (except cinema and success).
- A scrollable content area with bottom padding for the sticky action bar.
- A sticky bottom action area above the keyboard and safe area.
- A single `BookingSummary` where the spec calls for it.
- A dimmed/scrim background when a sheet is open.
- Haptic feedback on step transitions (light).

### 5.1 Sticky action area

- Background: `surface` with a top hairline, or a soft `primary-container` tint on the showtime screen (as in the mockup).
- Left: contextual summary (selection + price), 2 lines max.
- Right: primary CTA, min width 148, height 52.
- Disabled CTA: `surface-variant` fill, `on-surface-variant` text, helper text above or below.
- Bottom padding includes the safe-area inset.
- The content scrolls under the bar; do not add a permanent spacer that creates a large empty gap.

### 5.2 Back behavior

- Back from seats → date-time, preserving the selected showtime.
- Back from date-time → cinema (or movie detail if cinema was preselected).
- Back from review → seats, preserving seats and ticket types.
- Back from payment → review, preserving payment method (but not card details).
- Back from success → Home (not payment). The booking is complete; back must not re-enter payment.
- Android hardware back follows the same rules.
- If a 10-minute seat hold is active and the user backs out of seats, show a confirmation sheet: “Release your seats?” with “Keep booking” and “Release”.

### 5.3 State preservation

- The booking draft lives in Zustand memory and survives navigation within the flow.
- It resets on success, explicit cancel, or when starting a new booking for a different movie/showtime.
- It is not persisted across app restarts. If the app is killed mid-booking, the draft is lost; show a fresh flow.
- Tickets are persisted and survive restarts.

---

## 6. Screen ownership and entry points

| Screen | Entry points | Exit points |
|---|---|---|
| Home | App launch, Home tab, wordmark tap | Movie, cinema, ticket, search, notifications, tabs |
| Movies | Movies tab, “See all” from Home | Movie detail, search, filters |
| Search | Home search icon, Movies search field | Movie detail, cinema detail, close |
| Movie detail | Home hero/card, Movies grid, search, deep link | Booking cinema/date-time, cinema detail, trailer modal, share |
| Cinemas | Cinemas tab, “All cinemas” from Home, “Change” in booking | Cinema detail, map preview, booking |
| Cinema detail | Cinemas list, map preview, movie detail showtime row | Booking date-time, directions, call, website, share |
| Date & time | Movie detail showtimes, cinema detail showtimes, booking cinema | Seats |
| Seats | Date & time | Review, back |
| Review | Seats | Payment, edit seats/showtime |
| Payment | Review | Success, back |
| Success | Successful payment only | View ticket, Home, share |
| Tickets | Tickets tab, Home upcoming strip, success, Account card | Ticket detail |
| Ticket detail | Tickets list, success, deep link | Share, directions, cancel, back |
| Account | Account tab | Settings screens, Tickets, sign out |

---

## 7. Navigation transitions

| Transition | Behavior |
|---|---|
| Tab switch | Cross-fade 120 ms; no horizontal slide |
| Push detail | Native stack slide from right (iOS), fade-through (Android) |
| Modal (search, filters, trailer, legend) | Slide up with a 28 dp top radius; scrim fades 200 ms |
| Booking step | Push, same as detail. Do not invent a custom full-screen transition. |
| Success | Push with a fade + slight scale of the check; no confetti in MVP |
| Bottom sheet | Spring translateY (`damping 22`, `stiffness 200`); scrim 200 ms |

---

## 8. Tab bar and keyboard

- The tab bar hides when the keyboard opens on screens with a bottom input (search, payment card form).
- The sticky booking action bar rises above the keyboard with `KeyboardAvoidingView` behavior `padding` on iOS and `height` on Android.
- Sheets are keyboard-avoiding and dismiss on drag when appropriate; payment forms do not dismiss accidentally.

---

## 9. Accessibility of navigation

- Tab bar: `accessibilityRole="tab"`, `accessibilityState={{ selected }}`, label “Home, tab, 1 of 5”.
- The active tab has a visible pill and a selected state; not color alone.
- Back buttons: label “Go back”, not just an icon.
- Screen titles are announced on focus via `accessibilityRole="header"`.
- Focus order follows visual order. Modals trap focus and restore it on close.
- Deep links announce the destination screen title.

---

## 10. Navigation acceptance

- [ ] Five tabs, correct order, labels always visible.
- [ ] No drawer, no hamburger, no “Theatres” label.
- [ ] Tab bar hidden on detail and booking screens.
- [ ] Every screen has a back path; Android hardware back matches.
- [ ] Booking state survives back/forward within the flow.
- [ ] Success cannot be reached without a paid booking.
- [ ] Deep links resolve or fail gracefully.
- [ ] No duplicate title on any screen.
- [ ] Tab switch is a cross-fade, not a slide.

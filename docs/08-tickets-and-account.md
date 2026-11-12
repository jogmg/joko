# 08 — Tickets and Account

Covers the Tickets tab, ticket detail, Account, and the settings screens that replace the removed side drawer.

---

## 1. Tickets tab

**Route:** `(tabs)/tickets`
**Purpose:** find the ticket for the next cinema trip and keep a record of past nights.

### 1.1 Layout

```
Safe area
Tickets
YOUR CINEMA NIGHTS                       overline (one)
Your tickets.                            display 32
Everything you've booked, in one place.  body 15
[Upcoming] [Past]                        segmented
┌ Upcoming ───────────────────────────────────┐
│ [poster 64×96] The Green Room               │
│                The Meridian · Victoria Island│
│                Today · 7:20 PM              │
│                E5, F6 · 2 seats             │
│                Starts in 2 hours            │
│                [QR thumb]                ›  │
└─────────────────────────────────────────────┘
...
Empty: ticket icon + "No tickets yet" + [Browse movies]
Tab bar
```

### 1.2 Header

- No app-bar title. H1 “Your tickets.” 32/800.
- One overline maximum: “Your cinema nights.”
- Subtitle 15.
- Segmented control: Upcoming / Past. Default Upcoming.
- If the user arrived from a ticket deep link, scroll to and highlight that ticket.

### 1.3 Upcoming ticket card

- Radius 20, `surface+1`, 16 padding, 12 gap.
- Poster 64×96, radius 12.
- Title 18/600, max 2 lines.
- Cinema 13 `on-surface-variant`, one line.
- Date/time 15/600, tabular: “Today · 7:20 PM” or “Fri, 21 Nov · 7:20 PM”.
- Seats 13: “E5, F6 · 2 seats”.
- Countdown 12 `primary`: “Starts in 2 hours”, “Starts in 2 days”, “Started 20 min ago” (for a just-started show).
- QR thumbnail 56×56 on a white card (light background required), or a ticket icon if QR generation is deferred.
- Chevron 20.
- Whole card opens `ticket/[id]`.
- Pressed: scale 0.98.
- If the showtime has passed but is within 3 hours, keep it in Upcoming with “In progress” and move it to Past after 3 hours.

### 1.4 Past ticket card

- Same structure, lower emphasis:
  - Poster 56×84, grayscale? Do not use a filter that harms recognition; use `opacity: 0.85` on the poster only.
  - Title 15/600.
  - “Watched · 12 Nov” instead of countdown.
  - No QR thumbnail; show a small `checkmark-circle` + “Attended”.
  - `Book again` text button (optional, P1).
- Tapping opens ticket detail in a read-only past state.

### 1.5 Empty states

| Segment | Empty state |
|---|---|
| Upcoming | `ticket-outline` 48, “No tickets yet”, “When you book a seat, your ticket will live here.”, `Browse movies` (brand). |
| Past | `time-outline` 48, “No past nights yet”, “Your cinema history will appear here.”, `Browse movies`. |

### 1.6 Badge

- Tab bar dot when an upcoming ticket starts within 24 hours.
- Numeric badge (≤ 9) for unused tickets is acceptable, but not both.
- The badge is supplementary; the card countdown is the primary signal.

### 1.7 States

| State | Treatment |
|---|---|
| Loading | 3 ticket-card skeletons. |
| Empty | See above. |
| Error reading storage | “We couldn’t load your tickets.” + `Try again`. |
| Offline | Tickets are local, so they remain visible; show “Saved on this device.” |
| Deleted/cancelled | Removed from Upcoming; show in Past with “Cancelled” if history is kept. |

### 1.8 Data

- `getTickets({ status: 'upcoming' | 'past' })` from the persisted tickets store.
- Sort upcoming by showtime ascending; past by showtime descending.
- `getTicket(id)`.
- `getCountdown(showtime)`.

### 1.9 Acceptance

- [ ] Five-tab bar includes Tickets.
- [ ] Upcoming/Past segmented control.
- [ ] Cards show poster, movie, cinema, date/time, seats, countdown, QR/chevron.
- [ ] Empty states are action-oriented.
- [ ] Tickets persist across restarts.
- [ ] Tab badge works for a show within 24 h.
- [ ] List is virtualized (`FlatList`).

---

## 2. Ticket detail

**Route:** `ticket/[id]`
**Purpose:** present a scannable ticket at the door and provide trip actions.

### 2.1 Layout

```
[back] Ticket
┌ Ticket card ────────────────────────────────┐
│ [poster] The Green Room                     │
│          The Meridian · Victoria Island     │
│          Today · 7:20 PM                    │
│          Screen 1 · 3D                      │
│          E5, F6 · 2 seats                   │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │                                       │  │
│  │            QR 220×220                 │  │  white card
│  │                                       │  │
│  └───────────────────────────────────────┘  │
│  JKO-8F42Q1                    [copy]       │
│  Show this ticket at the door.              │
│  ✓ Confirmed                                │
└─────────────────────────────────────────────┘
[Add to calendar]  (hidden in MVP)
[Directions] [Share]
Free cancellation up to 2 hours before showtime.
[Cancel booking]                              destructive text
```

### 2.2 Ticket card

- Radius 24, `surface+1`, 1 px `outline-variant`.
- Poster 64×96.
- Movie 22/700, cinema 13, date/time 15/600, screen 13, seats chips.
- Perforated divider with notches.
- QR 220×220 centered on a `#FFFFFF` card with 24 dp quiet zone and 16 dp padding. The white card is allowed in dark mode; it is the only pure-white surface.
- Booking reference 15/700 tabular + copy button (44×44) with toast.
- “Show this ticket at the door.” 13.
- Confirmed chip: `primary-container` + brand check + “Confirmed” (no green).
- If the showtime is in the past, the card shows “Attended” or “Expired” and the QR is dimmed (opacity 0.4) but still visible; do not allow scanning a past ticket.

### 2.3 Actions

- `Directions`: `Linking` to Maps with the cinema address.
- `Share`: native share with a text summary and deep link. Do not share the raw QR image unless the user chooses “Share image”.
- `Add to calendar`: **hidden in MVP** (no calendar dependency). Do not show a dead button.
- `Cancel booking`: only if the showtime is more than 2 hours away and the booking is upcoming. Opens a confirmation sheet with the policy and a `Cancel booking` destructive button. On confirm:
  - Set ticket status `cancelled`.
  - Remove from Upcoming; keep in Past with a “Cancelled” label.
  - Show a toast “Booking cancelled. A refund will be processed.” (simulated).
  - If within 2 hours, hide cancel and show “Cancellation closes 2 hours before showtime.”
- `Book again`: P1; opens the movie detail with the same cinema preselected.

### 2.4 QR brightness

The brief asks to boost screen brightness while the QR is visible. `expo-brightness` is not in the allowed dependency list. **Do not add it for MVP.** Instead:

- Use a high-contrast QR on white, 220×220.
- Keep the screen awake only if a dependency already exists; otherwise do not.
- Document the brightness boost as a P1 enhancement.

### 2.5 States

| State | Treatment |
|---|---|
| Loading | Ticket skeleton. |
| Not found | “We couldn’t find that ticket.” + `Go to Tickets`. |
| Cancelled | Ticket card with a “Cancelled” chip; QR hidden. |
| Past | “Attended” / “Expired”; actions reduced. |
| Share failed | Toast “Couldn’t share the ticket. Try again.” |
| Offline | Ticket is local; show “Saved on this device.” |

### 2.6 Acceptance

- [ ] QR is large, high-contrast, on white, with a quiet zone.
- [ ] Booking reference is visible and copyable.
- [ ] Details match the booking exactly.
- [ ] Directions and Share work.
- [ ] Cancel respects the 2-hour policy and updates the list.
- [ ] No dead Add to calendar/Wallet buttons.
- [ ] Past/cancelled states are clear.

---

## 3. Account

**Route:** `(tabs)/account`
**Purpose:** manage identity, tickets, preferences, and support without a drawer.

### 3.1 Layout

```
Safe area
Account
YOUR JOKO ACCOUNT                        overline (one)
[J]  Joshua Attah                        H1 26/700
     joshua@example.com                  body 13
     [Edit]                              ghost
┌ My tickets ─────────────────────────────────┐
│ READY WHEN YOU ARE? → "Your tickets"        │
│ My tickets                    [ticket]   ›  │  brand card
│ Upcoming plans and past movie nights        │
└─────────────────────────────────────────────┘
Your Joko
  [bookmark] Saved movies        0 saved    ›
  [card]     Payment methods     Manage     ›
  [calendar] Booking history     Every night›
Support & settings
  [options]  Preferences         Notifications, appearance ›
  [headset]  Help & support      We're here  ›
  [lock]     Privacy & security  Your account›
  [info]     About Joko          v1.0       ›
  [log-out]  Sign out
Joko · Good films. Good company.
Tab bar
```

### 3.2 Profile header

- Avatar 56, `primary-container`, initials 20/700 `on-primary-container`. If an avatar URL exists, use it with a placeholder.
- Name 26/700.
- Email 13 `on-surface-variant`.
- `Edit` text button → `account/personal-details`.
- Overflow `...` 44×44 with “Share profile” (optional) and “Sign out”. Do not duplicate settings in the overflow.

### 3.3 My tickets card

- Deep plum `brand` card, radius 20, 20 padding, 16 margin.
- `ticket` icon in a `primary-container` circle, 40.
- “My tickets” 22/700 `on-brand`.
- “Upcoming plans and past movie nights” 13 `on-brand` at 80%.
- Chevron `on-brand`.
- Tapping switches to the Tickets tab. This is a shortcut, not a replacement for the tab.
- If there are no tickets, subtitle “Your first cinema night starts here.”

### 3.4 Rows

Group rows in `surface+1` cards with 16 radius, 56 dp rows, 16 horizontal padding, chevrons. Sentence-case section headers 13/600 `on-surface-variant` (not all-caps).

| Section | Row | Destination |
|---|---|---|
| Your Joko | Saved movies | `account/favourites` |
| Your Joko | Payment methods | `account/payment-methods` |
| Your Joko | Booking history | Tickets tab, Past segment |
| Support & settings | Preferences | `account/notifications` + `account/appearance` (two rows or a combined screen) |
| Support & settings | Help & support | `account/help` |
| Support & settings | Privacy & security | `account/privacy` (P1; can be a static screen) |
| Support & settings | About Joko | `account/about` |
| — | Sign out | Confirmation sheet |

“Preferences” can open a small hub with two rows: Notifications and Appearance. Do not bury the theme toggle.

### 3.5 Settings screens

**Personal details** (`account/personal-details`)
- Avatar, name, email, phone.
- Edit locally; no backend. Save updates the profile store and returns.
- Validation: name ≥ 2, email format, phone optional.
- “Changes are saved on this device.” note in dev/demo.

**Payment methods** (`account/payment-methods`)
- Saved cards list with brand, last 4, expiry, default chip.
- `Add card` opens the same card form as payment (simulated; does not store PAN).
- Remove card with confirmation; cannot remove the default if it is the only card.
- “Joko never stores your card details.” note.

**Saved movies / Favourites** (`account/favourites`)
- Grid of saved films (2 columns).
- Empty: “No saved films yet” + `Browse movies`.
- Remove via long-press or a bookmark button; undo toast.

**Notifications** (`account/notifications`)
- Toggles: Booking reminders, New releases, Offers.
- Reminder timing: 24 hours / 2 hours (single choice).
- All local; no push permission in MVP. If push is unavailable, show “Reminders are shown in the app.”
- “Email receipts” toggle (local).

**Appearance** (`account/appearance`)
- Options: System, Light, Dark. Radio list with previews.
- Persisted in AsyncStorage; applies immediately.
- Default System.

**Help & support** (`account/help`)
- FAQ accordion: booking, payment, cancellations, seats, accessibility.
- `Contact support` opens `mailto:` or a sheet with email/phone.
- `Report a problem` (optional) opens a mail draft.

**About** (`account/about`)
- Joko wordmark, version, “Good films. Good company.”
- Licenses, privacy policy, terms (static links).
- “Made for cinema lovers.”

**Sign out**
- Confirmation sheet: “Sign out of Joko?” + `Cancel` / `Sign out`.
- In MVP there is no auth; sign out clears the local profile and returns to a signed-out Home? Decision: keep a mock signed-in user; `Sign out` resets local profile and shows a “Signed out” toast, but does not block browsing. Do not fake a login screen.

### 3.6 States

| State | Treatment |
|---|---|
| Loading | Profile skeleton + 4 row skeletons. |
| Empty saved movies | Action-oriented empty state. |
| No payment methods | “No saved cards” + `Add card`. |
| Error | Inline banner + retry. |
| Offline | Settings are local; show “Saved on this device.” |

### 3.7 Acceptance

- [ ] Account is a tab, not a drawer.
- [ ] Profile, My tickets card, and all rows work.
- [ ] Appearance has System/Light/Dark and persists.
- [ ] Settings and Help live here, not in a drawer.
- [ ] No all-caps section labels.
- [ ] Sign out is confirmed and does not fake authentication.
- [ ] No dead rows; every row has a destination or is removed.

---

## 4. Notifications (MVP lightweight)

**Route:** `notifications` (modal sheet/screen)
**Purpose:** give the Home bell a destination.

- App bar “Notifications” + close.
- Seeded items:
  - “Your show starts in 2 hours” — The Green Room, Today 7:20 PM.
  - “New showtimes added” — The Last Horizon, The Meridian.
  - “Your booking is confirmed” — JKO-8F42Q1.
- Each row: icon in a tonal circle, title 15/600, body 13, time 11, unread dot.
- Tapping a booking item opens the ticket; a movie item opens movie detail.
- Mark all as read (text button).
- Empty: “You’re all caught up.”
- No push permissions in MVP.
- Bell dot clears when the sheet is opened.

### 4.1 Acceptance

- [ ] Bell opens a real destination.
- [ ] Items are seeded and tappable.
- [ ] Unread dot clears.
- [ ] Empty state exists.

---

## 5. Cross-screen rules

- Every row and card is at least 44 dp tall.
- Every icon-only action has a label.
- Destructive actions use `error-container` + `on-error-container`, not a red fill.
- Confirmation sheets use 28 dp top radius, grabber, title, body, and two actions.
- Toasts are 12 dp from the bottom safe area, `on-surface` background at 92%, `surface` text, 2.5 s, with an icon.
- Persisted preferences: theme, notification toggles, saved movies, tickets, recent searches.
- Not persisted: booking draft, card details, CVC, location permission state.

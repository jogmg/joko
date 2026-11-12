# 07 — Booking Flow

The booking flow is the product. It must feel like three confident steps, not a stack of forms.

```
[Choose cinema]  →  Date & time  →  Seats  →  Payment (review → pay)  →  Confirmed
     step 0            step 1        step 2          step 3
```

- Cinema selection happens before the visible indicator and is skipped when the user already chose a cinema/time.
- The visible indicator has exactly three steps: **Date & time → Seats → Payment**.
- Review order is a sub-state of Payment (step 3a). It is not a fourth step.
- The tab bar is hidden throughout.
- One compact `BookingSummary` is reused. The poster/title block never appears three times in one flow.

---

## 1. Shared booking shell

### 1.1 App bar

- 56 + safe area.
- Back 44×44, title 18/600, no large H1 duplicate.
- Optional right action: `Change` on the summary, or nothing.
- Titles: “Choose a cinema”, “Date & time”, “Seats”, “Review order”, “Payment”, “Booking confirmed”.

### 1.2 Step progress

- 4 dp track, 2 dp `primary` fill, numbered 24 dp circles.
- Completed: `brand` circle with a white check.
- Current: `brand` circle with the number, label `brand` 12/600.
- Upcoming: `surface-variant` circle, `on-surface-variant` number, label `on-surface-variant`.
- Labels: `Date & time`, `Seats`, `Payment`. Sentence case.
- Connector line 2 dp; completed `primary`, upcoming `outline-variant`.
- Not interactive; steps cannot be skipped by tapping.
- Accessibility: “Step 2 of 3, Seats”.

### 1.3 Compact BookingSummary

One component, reused on date-time, seats, and payment (not on review, where the ticket stub is the summary).

- 96 dp card, radius 16, `surface+1`.
- Poster 48×72, radius 8.
- Title 15/600, one line, ellipsis.
- Cinema 13, one line.
- Format + date/time 12, one line, tabular.
- `Change` text button (44 dp) on the right, optional.
- No price in the summary; the sticky bar carries price.
- Tap opens a read-only sheet with “Change cinema”, “Change date/time”, “Change seats” as appropriate.

### 1.4 Sticky action bar

- Left: contextual 2-line summary.
- Right: primary CTA, min width 148, height 52.
- Disabled state: `surface-variant` + `on-surface-variant` + helper line.
- Bottom safe-area inset.
- Content scrolls under it; no large spacer.
- On date-time, the bar may use a soft `primary-container` tint (as in the mockup); on other steps, `surface` + top hairline.

### 1.5 State preservation

- Draft in Zustand memory.
- Back preserves selections.
- Reset on success, cancel, or starting a different movie/showtime.
- Do not persist card details.

---

## 2. Step 0 — Choose a cinema

**Route:** `booking/[movieId]/cinema`
**When:** user tapped “Book tickets” without a showtime; or changed cinema from the summary.

### 2.1 Layout

- App bar “Choose a cinema”.
- No step indicator.
- Compact summary with movie + “Choose a cinema below”; no `Change` yet.
- Location row: “Near Victoria Island” + `Change`.
- Filter chips: Today, Under 5 km, IMAX, Dolby, Open now.
- Cinema cards showing:
  - Photo 88×88, name, address, distance + drive time.
  - Rating, amenities, price from.
  - Next showtime chip.
  - `Choose` button (brand, 44) on the right; tapping the card opens cinema detail instead.
- If a cinema is chosen, navigate to `date-time` and set `cinemaId`.

### 2.2 States

| State | Treatment |
|---|---|
| Loading | 4 skeleton rows. |
| No cinemas | “No cinemas are showing this film nearby” + `See all cinemas`. |
| Error | Banner + retry. |
| Offline | Cached list + banner. |

### 2.3 Acceptance

- [ ] No progress indicator on this step.
- [ ] Cinema selection sets the draft and moves to date-time.
- [ ] Card tap opens cinema detail; `Choose` selects.
- [ ] Location and filters work.

---

## 3. Step 1 — Date & time

**Route:** `booking/[movieId]/date-time`
**Purpose:** pick the exact day, format, and showtime.

### 3.1 Layout

```
[back] Date & time
●──────○──────○
Date & time   Seats   Payment
┌ BookingSummary ─────────────────────────────┐
│ [poster] The Green Room        Change ›     │
│          The Meridian · 3D · Today          │
└─────────────────────────────────────────────┘
Choose a day                          [calendar]
Pick the night that works for you.
[Today 12] [Tomorrow 13] [Sat 14] [Sun 15] ...
Pick a showtime
All times are local to Victoria Island.
[2D] [3D] [IMAX]                       segmented
The Meridian · Auditorium 3 · 3D
[12:15 PM ₦8,500] [1:30 PM ₦8,500] [3:45 PM ₦8,500]
[5:10 PM ₦8,500] [7:20 PM ₦8,500] [8:40 PM Sold out]
┌ sticky ─────────────────────────────────────┐
│ 15 Nov · 7:20 PM · 3D       [Continue →]     │
│ From ₦8,500 · Good availability              │
└─────────────────────────────────────────────┘
```

### 3.2 Date strip

- Horizontal, 10 days starting today, 64 dp item height, 56 dp width, 8 dp gap, 20 dp edge padding.
- Day label 11 (Today / Tomorrow / Mon), date 18/700, month 10.
- Selected: `brand` fill, `on-brand`, radius 16, check icon top-right.
- Today: 4 dp dot under the date when unselected.
- Past dates disabled (only relevant if the list starts before today; normally it does not).
- Tapping a date updates showtimes and clears the selected time.
- Calendar icon 44×44 opens a month sheet for dates beyond 10 days. The month sheet has month navigation, available dates marked with a dot, disabled past dates, and a `Done` action. Do not render a fake text input.

### 3.3 Format and showtimes

- Format segmented: only formats available for the selected date. Defaults to the first available format, or the format carried from the movie detail.
- Group by format, then auditorium:
  - Format header 18/600.
  - Auditorium line 13 `on-surface-variant` with screen icon.
  - Price line 12: “From ₦8,500”.
  - Time chips wrap in rows of 3 (2 on 320 dp).
- Time chip: 72 min width, 44 height, 12 radius, tabular numerals.
  - Available: `surface+1`, 1 px `outline-variant`.
  - Selected: `brand`, `on-brand`, check.
  - Few left (≤ 20% seats): `tertiary-container`, `on-tertiary-container`, “Few left” label.
  - Sold out: `surface-variant`, dashed `outline`, strikethrough time + “Sold out”, disabled.
- No color-only states.
- Price per format is visible above the chips; the chip shows the actual price, not “From”.
- Selecting a time sets `showtimeId`, `date`, `cinemaId`, `format`, `basePriceMinor`.
- CTA label: `Continue · 7:20 PM` when selected; `Choose a time` when not. Disabled until a time is selected.
- Helper under the CTA: “Good availability” / “Filling up” / “Almost full” based on seats remaining. Use an icon + text.

### 3.4 Month sheet

- 28 dp top radius, grabber, title “Choose a date”, month header with chevrons, 7-column calendar.
- Available dates have a dot; sold-out dates are disabled with a label; past dates disabled.
- Selecting a date closes the sheet and updates the strip.
- Keyboard-avoiding not needed; focus trap.

### 3.5 States

| State | Treatment |
|---|---|
| Loading | Summary skeleton, 7 date skeletons, 6 time skeletons. |
| No showtimes | “No showtimes on this day” + `Choose another day` / `Next day`. |
| Sold out day | Date disabled with “Sold out” in the calendar; strip item shows a small “Full” label. |
| Error | Banner + retry. |
| Offline | “Connect to see live showtimes.” Cached dates remain visible but times are disabled. |

### 3.6 Acceptance

- [ ] Exactly three progress steps, canonical labels.
- [ ] No duplicate H1 or overline.
- [ ] Date strip is 10 days and scrolls.
- [ ] Month sheet works for later dates.
- [ ] Format changes prices and times.
- [ ] Time states are available/selected/few-left/sold-out with labels.
- [ ] CTA reflects the selection and is disabled with a helper until a time is chosen.
- [ ] No fake input fields.
- [ ] No large dead space; content scrolls under the sticky bar.

---

## 4. Step 2 — Seats

**Route:** `booking/[movieId]/seats`
**Purpose:** choose exact seats, assign ticket types, and see the total.

This is the most important screen. It replaces the old two-sheet flow and the deleted “Choose tickets” screen.

### 4.1 Layout

```
[back] Seats
●──────●──────○
Date & time   Seats   Payment
┌ BookingSummary ─────────────────────────────┐
│ [poster] The Green Room        Change ›     │
│          The Meridian · 3D · 15 Nov 7:20 PM │
└─────────────────────────────────────────────┘
        ╭──────────────────────────╮
        │        SCREEN            │  curved arc + glow
        ╰──────────────────────────╯
        Every seat is a good seat.
[Standard ₦8,500] [Premium ₦11,000] [Accessible]   legend summary + ?
┌ seat map ───────────────────────────────────┐
│ A  [♿1][♿2] [3][4][5]  [6][7][8][9][10]    │
│ B  [1][2][3][4][5]  [6][7][8][9][10]        │
│ ...                                          │
│ G  [premium...]                              │
└─────────────────────────────────────────────┘
[+ Best available]                 [−] [+] [Reset]
┌ selection sheet (peek 132) ─────────────────┐
│ 3 seats · E5, F6, A2              ₦26,800    │
│ [Continue]                                   │
└─────────────────────────────────────────────┘
```

### 4.2 Seat map

- Full-width area; the map scrolls/pans independently of the page.
- Screen: shallow arc, 2 dp `primary-container` stroke with a soft glow (`primary-container` at 30%), label “SCREEN” 10/700 letter-spaced. Not a flat grey bar.
- Sections:
  - `Orchestra`: rows A–E.
  - `Balcony`: rows F–G.
  - `Accessible`: row A seats 1–2.
- Row labels on both sides, 12/600 `on-surface-variant`.
- Seat numbers every seat, 9/600 inside the seat; every 5th seat is bolder.
- Aisle gap 16 dp after seat 5 (and after seat 10 for wider screens).
- Seat visual: 24×24, radius 6, top corners more rounded (seat silhouette), 4 dp gap. Hit area 44×44 via `hitSlop`.
- Initial zoom fits the width; seats never render below 20 dp.
- Pinch-to-zoom and pan with gesture-handler + Reanimated. `+` / `−` buttons step 0.25×, `Reset` returns to fit. Clamp 1×–2.5×.
- Do not animate layout; transform only.
- Seat states per `03-design-system.md`:
  - Available: `surface-variant` fill, `outline-variant` border, seat glyph.
  - Selected: `brand` fill, `on-brand` glyph, check badge.
  - Unavailable: `neutral-80` fill, 45° hatch, 40% opacity, not focusable.
  - Premium: `tertiary-container` fill, recliner glyph, star badge.
  - Accessible: `secondary-container` fill, wheelchair glyph.
  - Companion: `secondary-container`, wheelchair + plus.
- No red/green/blue/yellow. Ever.
- Selected seats show a small check; selection is never color-only.
- Haptics: light on select/deselect; warning on max; medium on continue.
- Accessibility announcement: “F12 selected. 2 of 8 seats.”

### 4.3 Selection rules

- Minimum 1 seat to continue.
- Maximum 8 seats. On the 9th, show an inline toast “Up to 8 seats per booking” and a warning haptic; do not select.
- Accessible seats are selectable; a companion seat can be added adjacent. If a user selects an accessible seat, offer “Add companion seat” in the selection sheet.
- Seats held by others are unavailable.
- Selecting a seat adds it to the draft with:
  - `id`, `row`, `number`, `section`, `type` (standard/premium/accessible/companion), `priceMinor`, `ticketType` (default adult).
- Deselecting removes it and its ticket type.
- “Best available” finds the closest contiguous block to the screen center for the current seat count (default 2 if none selected), highlights the block for 1.5 s, then selects it. If no contiguous block, choose the closest available seats and show “Best available (not together)”.
- “Clear” removes all seats, with a confirmation toast/undo (not a modal).

### 4.4 Legend

- The inline row shows three key states (Standard, Premium, Accessible) with prices.
- A `?` 44×44 icon button opens a small sheet with four rows maximum: Available, Selected, Unavailable, Accessible. Each row has a seat sample + label. Use icons, not color alone.
- The legend sheet is accessible and dismissible.

### 4.5 Selection sheet

- Peek height 132; expandable to 70% with a grabber.
- Collapsed:
  - `3 seats · E5, F6, A2` 15/600.
  - Total ₦26,800 18/700, tabular.
  - `Continue` brand 52.
- Expanded:
  - One row per seat: seat label chip, section, ticket-type selector (Adult / Child / Student / Senior), price, remove `×`.
  - Ticket type changes update the total immediately.
  - `+ Add seats` hint closes the sheet and focuses the map.
  - `Clear all` text button.
- The sheet is the only place ticket types are chosen. There is no separate quantity screen.
- The CTA is disabled at 0 seats with helper “Pick your seats — tap any available seat.”
- The total is derived, never stored twice.

### 4.6 Seat hold (P1, behind a flag)

- On the first selection, start a 10-minute local hold.
- Show `Seats held 09:58` in the summary, 12 `on-surface-variant`.
- If it expires, show a sheet: “Your hold expired” + `Pick seats again`.
- Backing out with seats selected shows “Release your seats?” with `Keep booking` / `Release`.
- No server enforcement in MVP; the UI must not claim a guaranteed hold. Copy: “We’ll hold these seats while you finish.”

### 4.7 Screen-reader alternative

- A “Select by row” button (44×44, `list-outline`) opens a modal listing rows and seats.
- Each row is a list of seat buttons with labels: “Row F seat 12, available, ₦11,000, premium”.
- Selected state announced; running count announced.
- The map itself is accessible as a group with a summary, but the row picker is the primary accessible path.
- Focus is trapped in the modal and restored to the button on close.

### 4.8 States

| State | Treatment |
|---|---|
| Loading | Map skeleton block + summary skeleton. |
| No seats available | “This showtime is sold out” + `Choose another time`. |
| Error loading map | “We couldn’t load the seat map” + `Try again` / `Choose another time`. |
| Offline | “Connect to choose seats.” CTA disabled. |
| Max seats | Toast + warning haptic. |
| Hold expired | Sheet with re-pick action. |

### 4.9 Acceptance

- [ ] One screen, one sheet. No separate ticket quantity screen.
- [ ] Seat count = ticket count.
- [ ] Seat map is labeled, zoomable, pannable, and palette-compliant.
- [ ] Every seat state has an icon/label, not color alone.
- [ ] Max 8 enforced with feedback.
- [ ] Per-seat ticket types update the total live.
- [ ] Total is derived; no duplicated price state.
- [ ] Screen-reader row picker exists.
- [ ] Haptics on select/deselect/max.
- [ ] CTA disabled until ≥ 1 seat.
- [ ] Back preserves seats; release confirmation if a hold is active.

---

## 5. Step 3a — Review order

**Route:** `booking/[movieId]/review`
**Purpose:** confirm the exact booking before paying.

### 5.1 Layout

```
[back] Review order
●──────●──────●
Date & time   Seats   Payment
┌ Ticket stub ────────────────────────────────┐
│ [poster] YOUR MOVIE NIGHT                   │
│          The Green Room                     │
│          3D · 1h 56m                        │
│                                             │
│ Date              Time                      │
│ 15 Nov            7:20 PM          Edit     │
│ Cinema            Screen                    │
│ The Meridian      Screen 1 · 3D    Edit     │
│                                             │
│ Your seats                         Edit     │
│ [E5] [F6] [A2]                              │
│ 2 × Adult · 1 × Child                       │
│ - - - - - - - - - - - - - - - - - - - - - - │  perforation
│ Tickets                        ₦26,500      │
│ Service fee                       ₦300      │
│ Taxes                          Included     │
│ ─────────────────────────────────────────── │
│ Total                          ₦26,800      │
└─────────────────────────────────────────────┘
[Have a promo code? ⌄]
🛡 Free cancellation up to 2 hours before showtime
┌ sticky ─────────────────────────────────────┐
│ [Back]              [Continue to payment →] │
└─────────────────────────────────────────────┘
```

### 5.2 Ticket stub card

- One summary only. Do not show the compact `BookingSummary` above it.
- Poster 56×84, radius 12.
- Overline “Your movie night” (one per screen), `primary`.
- Title 22/700.
- Format + runtime 13.
- Grid: Date, Time, Cinema, Screen. Labels 11 `on-surface-variant`; values 15/600.
- `Edit` links next to Seats and Showtime (44 dp targets). Edit returns to the relevant step with state preserved.
- Seat chips: `primary-container`, 32 dp, radius 12, label 12/600. Max 8; wrap.
- Ticket types line: “2 × Adult · 1 × Child” (derived from per-seat types).
- Perforated divider: 1 dp dashed `outline-variant` with two 12 dp `background` notches at the edges.
- Price breakdown right-aligned, tabular:
  - Tickets (sum of seat prices after ticket types).
  - Service fee.
  - Taxes: “Included” (no amount) or a real amount if configured.
  - Divider.
  - Total 18/700.
- No boxed total. No duplicated poster.

### 5.3 Promo code

- Row “Have a promo code?” with chevron; expands to an input + `Apply`.
- Success: `primary-container` chip with code + “−₦2,250” + remove.
- Error: inline `error-container` message with icon: “That code isn’t valid. Check the spelling and try again.”
- Promo applies to tickets only, not the service fee.
- Seeded codes: `JOKO10` (10% off tickets), `STUDENT500` (₦500 off, requires a student ticket). Document in `11-data-and-state.md`.

### 5.4 Trust row

- Shield icon + “Free cancellation up to 2 hours before showtime.” 13 `on-surface-variant`.
- No green.

### 5.5 Sticky actions

- Left: `Back` secondary/outline 52.
- Right: `Continue to payment` brand 52.
- Disabled if the draft is invalid (no showtime/seats) with helper text.
- No upsell banner in MVP. Concessions are out of scope.

### 5.6 States

| State | Treatment |
|---|---|
| Loading | Stub skeleton + price row skeletons. |
| Invalid draft | “Your booking expired” + `Start again`. |
| Promo error | Inline error, rest of the card intact. |
| Error | Banner + retry. |

### 5.7 Acceptance

- [ ] One summary (ticket stub), no duplicate compact card.
- [ ] Step 3 active; review is not a separate step.
- [ ] Per-seat ticket types reflected.
- [ ] Price breakdown is correct and tabular.
- [ ] Edit links work and preserve state.
- [ ] Promo works with success/error states.
- [ ] Trust row present.
- [ ] No popcorn upsell.

---

## 6. Step 3b — Payment

**Route:** `booking/[movieId]/payment`
**Purpose:** pay with a familiar method and know the exact total.

### 6.1 Layout

```
[back] Payment                    Total ₦26,800
●──────●──────●
Date & time   Seats   Payment
┌ BookingSummary ─────────────────────────────┐
│ [poster] The Green Room        Change ›     │
│          The Meridian · 3D · 15 Nov 7:20 PM │
└─────────────────────────────────────────────┘
How would you like to pay?
Your ₦26,800 ticket is one step away.
[ Card ] [ Transfer ] [ Wallet ]              segmented

Card:
  Saved cards
  ( ) Visa •••• 4242   Exp 09/28   Default
  ( ) Mastercard •••• 8810
  ( ) Use a new card
  [card form when expanded]

Transfer:
  Pay from your bank app
  We'll give you a one-time account number.
  Bank: Joko Payments (demo)
  Account number: shown after you continue
  Seats held for 10 minutes while you transfer.

Wallet:
  Pay with your mobile wallet
  [Apple Pay] [Google Pay] [Paystack] [Flutterwave]
  Provider handoff is simulated in this build.

🔒 Encrypted and secure. Joko never stores your card details.
ℹ You may be asked to verify with your bank.
┌ sticky ─────────────────────────────────────┐
│ Due now ₦26,800          [Pay ₦26,800 🔒]   │
└─────────────────────────────────────────────┘
```

### 6.2 Methods

Use a segmented control with three options: Card, Transfer, Wallet.

**Card**

- Saved card list with radio selection. Each row: brand mark (text/icon, not a third-party logo asset), `Visa •••• 4242`, expiry, `Default` chip.
- “Use a new card” expands the form inline.
- New card form:
  - Card number: 56 dp, floating label, brand icon, groups of 4, max 19 digits, Luhn validation.
  - Name on card: 56, letters/spaces, min 2.
  - Expiry: `MM/YY`, auto-slash, must be future.
  - CVC: 3–4 digits, `?` tooltip “The 3 or 4 digits on the back of your card.”
  - Billing country: select, default Nigeria.
  - Save this card: platform `Switch`, default off.
  - Autofill hints: `cc-number`, `cc-exp`, `cc-csc`, `cc-name`, `postal-code`.
- Validation on blur and on submit; inline error text with `alert-circle`; focus the first invalid field.
- No card data is persisted. In production, use provider tokenization/hosted checkout; never send PAN to Joko servers.

**Transfer**

- Explanation: “We’ll give you a one-time account number. Your seats are held for 10 minutes while you transfer.”
- Bank/account rows are read-only; the account number is revealed after `Continue`.
- Copy button for the account number with a toast.
- “I’ve sent the transfer” triggers a simulated verification (loading 1.5 s), then success or failure.
- In production, this is a provider webhook; the UI polls or receives a deep link.

**Wallet**

- Platform-aware: Apple Pay on iOS, Google Pay on Android. If unavailable, hide the option.
- Provider chips: Paystack, Flutterwave (simulated in this build).
- Tapping a provider shows a confirmation sheet, then simulated processing.
- No real wallet SDK in MVP; do not claim a charge occurred.

### 6.3 Total and CTA

- Total pinned top-right in the app bar: `Total ₦26,800` 13/600 tabular.
- Sticky bar: “Due now” + amount left, `Pay ₦26,800` brand 52 right.
- Disabled until the selected method is valid. Helper: “Enter your card details” / “Select a saved card” / “Choose a wallet”.
- Loading: button shows spinner + “Processing…”, disabled, no double submit.
- Failure: inline `error-container` banner above the CTA: “Your payment didn’t go through. No charge was made.” + `Try again`. Keep the method and form values (except CVC).
- Timeout: same banner with “This is taking longer than usual. Check your connection and try again.”
- Success: create ticket, set `status: 'paid'`, navigate to `success` with `replace` so back does not return to payment.

### 6.4 Security and trust

- Lock icon + “Encrypted and secure. Joko never stores your card details.” 13 `on-surface-variant`.
- “You may be asked to verify with your bank.” 12.
- No green lock; use `on-surface-variant`.
- No “demo” copy in production; the simulated behavior is documented in dev only.

### 6.5 Payment adapter

```ts
type PaymentMethod =
  | { kind: 'card'; savedCardId?: string; card?: NewCard }
  | { kind: 'transfer'; bankId: string }
  | { kind: 'wallet'; provider: 'apple-pay' | 'google-pay' | 'paystack' | 'flutterwave' };

type PaymentResult =
  | { status: 'paid'; reference: string }
  | { status: 'failed'; code: string; message: string }
  | { status: 'requires_action'; action: '3ds' };

interface PaymentProvider {
  charge(input: { amountMinor: number; currency: string; method: PaymentMethod; idempotencyKey: string }): Promise<PaymentResult>;
}
```

Simulation rules:

- Any valid new card succeeds, except numbers ending `0002` (declined) and `0003` (timeout).
- Saved cards succeed.
- Transfer succeeds after 1.5 s unless the test bank is `demo-fail`.
- Wallet succeeds after 1 s.
- Every attempt returns an idempotency key; retries reuse it.

### 6.6 States

| State | Treatment |
|---|---|
| Loading (initial) | Summary skeleton + method skeleton. |
| Invalid form | Inline field errors; CTA disabled. |
| Processing | Button spinner, inputs disabled. |
| Declined | Error banner + retry; keep values except CVC. |
| Timeout | Error banner + retry. |
| 3DS required | Modal “Verify with your bank” + simulated approve/fail. |
| Success | Navigate to success with replace. |
| Offline | Banner “Connect to pay.” CTA disabled. |

### 6.7 Acceptance

- [ ] Card, Transfer, and Wallet all work in simulation.
- [ ] Saved cards and new card form exist.
- [ ] Inputs format, validate, and autofill.
- [ ] Total is visible near the CTA.
- [ ] Loading, failure, retry, and 3DS states exist.
- [ ] No raw card data is stored or logged.
- [ ] Security copy is palette-safe.
- [ ] Success uses `replace` and guards the route.

---

## 7. Confirmation — Success

**Route:** `booking/[movieId]/success`
**Purpose:** confirm the booking and hand over the ticket.

### 7.1 Layout

```
(no back button; success is terminal)
        ╭─────────╮
        │   ✓     │   72 dp primary-container circle, brand check
        ╰─────────╯
Booking confirmed                      app bar title
You're booked.                         H1 28/700
A happy cinema night, with a ticket that's right here when you need it.
Booking ref  JKO-8F42Q1  [copy]
┌ Ticket card ────────────────────────────────┐
│ [poster] 3 guests                           │
│          The Green Room                     │
│          3D · 1h 56m                        │
│  Date 15 Nov      Time 7:20 PM              │
│  Cinema The Meridian   Screen 1 · 3D        │
│  Your seats [E5] [F6] [A2]                  │
│ - - - - - - - - - - - - - - - - - - - - - - │
│ [QR 140×140]  3 tickets · ₦26,800           │
│               Show this ticket at the door. │
│               ✓ Confirmed                   │
└─────────────────────────────────────────────┘
[View ticket]                                  brand 52
[Share ticket]                                 secondary 52
Saved to Tickets.                             13 on-surface-variant
Getting to The Meridian, Victoria Island    ↗
Done — back to Home                           text button
```

### 7.2 Success check

- 72 dp circle `primary-container`, 32 dp `brand` check.
- Soft radial pulse on entry (scale 0.9→1, opacity 0→1, 320 ms). No confetti in MVP; if added later, use primary/tertiary/secondary and disable under reduced motion.
- Haptic success notification.
- No green.

### 7.3 Copy

- App bar: “Booking confirmed”.
- H1: “You’re booked.”
- Sub: “A happy cinema night, with a ticket that’s right here when you need it.”
- No all-caps. No exclamation mark.
- Booking reference: `JKO-XXXXXXXX`, copy button with toast “Copied”.
- “Saved to Tickets.” one line, with a ticket icon. This confirms persistence.

### 7.4 Ticket card

- The same `TicketCard` used in the Tickets tab and ticket detail.
- Poster 64×96.
- “3 guests” (sentence case) instead of “ADMIT 3 GUESTS”.
- Movie title 22/700.
- Date, time, cinema, screen in a 2-column grid.
- Seat chips.
- Perforated divider.
- QR 140×140 on a `#FFFFFF` card with a quiet zone. In dark mode, the QR card stays white; everything around it uses dark tokens.
- Total and “Show this ticket at the door.”
- Confirmed state: `primary-container` chip with a brand check + “Confirmed”. No green.
- Ticket card radius 24, `surface+1`, 1 px `outline-variant`.

### 7.5 Actions

- `View ticket` brand 52 → `ticket/[id]` (replace or push; back should go Home).
- `Share ticket` secondary 52 → native share with a deep link + text summary.
- `Done — back to Home` text button → Home (dismiss the booking stack).
- `Add to Wallet` and `Add to calendar`: **hidden in MVP** because they are not implemented. Do not show dead buttons.
- “Getting to …” row: pin icon, cinema name + distance, external-link icon → Maps.

### 7.6 Persistence and guards

- On mount, verify `booking.status === 'paid'` and a ticket exists for the booking.
- If valid: auto-save the ticket to the tickets store (idempotent by booking reference), show “Saved to Tickets.”
- If invalid: render an empty state “We couldn’t find that booking” + `Browse movies`; do not show a fake ticket.
- Deep-linking to success without a paid booking redirects to the movie detail or Tickets empty state.
- Back from success goes Home, not payment. Use `router.replace` or reset the booking stack.

### 7.7 States

| State | Treatment |
|---|---|
| Saving ticket | Brief inline “Saving…” (should be instant); no spinner over the ticket. |
| Save failed | “We couldn’t save your ticket. Try again.” + `Retry`; ticket still visible. |
| Invalid booking | Empty state, no QR. |
| Offline | Ticket still visible (local); “Saved on this device.” |

### 7.8 Acceptance

- [ ] No green anywhere.
- [ ] Ticket card has poster, movie, cinema, date/time, screen, seats, reference, QR, total.
- [ ] Ticket is persisted and appears in Tickets.
- [ ] `View ticket` and `Share ticket` work; unimplemented actions are hidden.
- [ ] Back goes Home, not payment.
- [ ] Route is guarded.
- [ ] Haptic success fires once.
- [ ] Reduced motion uses a fade.

---

## 8. Pricing and rules

### 8.1 Money

- Store all amounts in minor units (kobo) as integers.
- Format with `Intl.NumberFormat(market.locale, { style: 'currency', currency: market.currency, maximumFractionDigits: 0 })` for NGN.
- Never store a formatted string in state.
- Use tabular numerals.

### 8.2 Worked example (used throughout this document)

The Green Room, 3D, The Meridian, Screen 1:

| Seat | Type | Base | Ticket type | Line |
|---|---|---|---|---|
| E5 | Standard | ₦8,500 | Adult | ₦8,500 |
| F6 | Premium | ₦11,000 | Child (−₦1,500) | ₦9,500 |
| A2 | Accessible | ₦8,500 | Adult | ₦8,500 |
|  |  |  | Tickets | ₦26,500 |
|  |  |  | Service fee | ₦300 |
|  |  |  | **Total** | **₦26,800** |

### 8.3 Seat price

```
seatPrice = showtime.basePriceMinor
          + seatTypeSurcharge[seat.type]
```

| Seat type | Surcharge (NGN) |
|---|---|
| Standard | 0 |
| Premium | 2,500 |
| Accessible | 0 |
| Companion | 0 |

### 8.4 Ticket type adjustment

| Ticket type | Adjustment (NGN) | Rules |
|---|---|---|
| Adult | 0 | Default |
| Child | −1,500 | Ages 3–11; at least one adult per booking is recommended |
| Student | −1,000 | Requires student ID at the door |
| Senior | −2,000 | Ages 65+ |

`linePrice = max(0, seatPrice + ticketTypeAdjustment)`

### 8.5 Fees

- Service fee: ₦300 per booking (not per seat).
- Taxes: included in the displayed price for MVP; show “Included” rather than a fake amount.
- Total: `sum(linePrice) + serviceFee − promoDiscount`.
- Promo discount applies to tickets only, never the fee.
- Rounding: none; integer kobo.

### 8.6 Promo codes

| Code | Effect | Conditions |
|---|---|---|
| `JOKO10` | 10% off tickets | One per booking |
| `STUDENT500` | ₦500 off | At least one student ticket |

Invalid/expired codes produce an inline error; never silently ignore.

### 8.7 Showtime rules

- Showtime must be in the future. Past times are disabled.
- A showtime with 0 seats is sold out.
- “Few left” at ≤ 20% of seats remaining.
- The same seat cannot be in two bookings (local mock enforcement).
- Changing the showtime clears seats and ticket types; confirm first if seats are selected.

### 8.8 Booking validity

A draft is valid when:

- `movieId`, `cinemaId`, `showtimeId`, `date` are set.
- `seats.length` is between 1 and 8.
- Every seat has a ticket type.
- The showtime is in the future.
- The total is ≥ 0.

The review and payment CTAs are disabled with a helper when invalid.

### 8.9 Route guards

- `seats` requires a showtime; otherwise redirect to date-time.
- `review` requires ≥ 1 seat; otherwise redirect to seats.
- `payment` requires a valid draft; otherwise redirect to review.
- `success` requires `status === 'paid'` and a persisted ticket; otherwise show the empty state.
- `ticket/[id]` requires a persisted ticket; otherwise “Ticket not found”.

---

## 9. Booking acceptance (end to end)

- [ ] Three visible steps, canonical labels, no duplicated title.
- [ ] Cinema selection is skipped when a showtime is already known.
- [ ] Tapping a showtime on movie/cinema detail goes straight to seats.
- [ ] Seat count = ticket count; no quantity screen.
- [ ] Per-seat ticket types and live totals.
- [ ] Max 8 seats with feedback.
- [ ] Review uses one ticket stub, correct breakdown, working edit links and promo.
- [ ] Payment supports card, transfer, wallet; validates; handles loading/failure/retry/3DS.
- [ ] Success has a real ticket, QR, reference, and persists to Tickets.
- [ ] No green, no off-palette colors, no all-caps.
- [ ] Back behavior preserves state and never returns to payment after success.
- [ ] Every step has loading, empty, error, and offline states.

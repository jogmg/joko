# 13 — Accessibility

Accessibility is a build requirement, not a polish pass. The booking flow must be completable with VoiceOver and TalkBack, at 200% text size, on a 320 dp screen.

---

## 1. Targets

- Minimum touch target: 44×44 dp.
- Preferred: 48×48 for tab items, icon buttons, and seat hit areas.
- Adjacent targets: at least 8 dp apart.
- Seat visual: 24×24; hit area 44×44 via `hitSlop` (do not overlap neighbors’ hit areas).
- Text links inside paragraphs: 44 dp height via padding, or a separate button.

---

## 2. Contrast

Use the measured table in `03-design-system.md`. Requirements:

- Body text ≥ 4.5:1.
- Large text (≥ 18.66 bold or ≥ 24 regular) ≥ 3:1.
- Icons and UI boundaries ≥ 3:1 where they carry meaning.
- `outline-variant` is 1.67:1 in light and 1.84:1 in dark: hairlines only, never text.
- `outline` is 4.37:1 in light: icons/borders only, not small text.
- Never use `#EDDCFF` text on `#FFFBFF`.

Check every new color pair in both schemes before merging.

---

## 3. Semantic structure

- Every screen has one `accessibilityRole="header"` title.
- Sections use header roles where appropriate.
- Lists expose item counts (“3 tickets”, “8 showtimes”).
- Buttons are buttons, not `Text` with `onPress`.
- Decorative images have `accessibilityElementsHidden` / `importantForAccessibility="no"`.
- Content images have concise labels (“Poster for The Green Room”).
- Icon-only buttons have `accessibilityLabel` and `accessibilityHint` where useful.

---

## 4. Labels and hints

| Element | Label | Hint |
|---|---|---|
| Back | “Go back” | — |
| Search | “Search films and cinemas” | — |
| Bell | “Notifications, 3 unread” | “Opens notifications” |
| Save | “Save The Green Room to favourites” / “Remove …” | — |
| Share | “Share The Green Room” | — |
| Tab | “Home, tab, 1 of 5” | — |
| Filter | “Filters, 2 active” | “Opens filter options” |
| Date | “Friday 15 November” | “Shows showtimes for this day” |
| Showtime | “7:20 PM, 3D, ₦7,500, 8 seats left” | “Selects this showtime” |
| Seat | “Row F seat 12, available, ₦7,500, standard” | “Double tap to select” |
| Selected seat | “Row F seat 12, selected, adult, ₦7,500” | “Double tap to remove” |
| Unavailable seat | “Row F seat 12, unavailable” | Not focusable |
| Pay | “Pay ₦26,800” | “Charges your selected payment method” |
| QR | “QR code for booking JKO-8F42Q1” | “Show at the door” |

---

## 5. Booking flow accessibility

### 5.1 Date strip

- Each date is a button with selected/disabled state.
- Announce the full date, not just “12”.
- Today is announced as “Today, 12 November”.
- The strip announces “10 days available”.

### 5.2 Showtime chips

- Announce time, format, price, and availability.
- Sold out: `accessibilityState={{ disabled: true }}` + “sold out”.
- Few left: announce “few seats left”.
- Selecting announces the new selection and the CTA state.

### 5.3 Seat map

The seat map is the hardest surface. Provide **two** paths:

1. **Map path:** each seat is a button with row/number/state/price. The map is a group with a summary built from the layout data, e.g. “Seat map, rows A to G, 12 seats per row”. Pinch/pan gestures are not required for screen-reader users.
2. **Row picker path (primary for screen readers):** a “Select by row” button opens a modal:
   - List of rows A–G.
   - Expanding a row lists seats with labels and states.
   - Selected state and running count are announced: “F12 selected. 2 of 8 seats.”
   - “Best available” and “Clear all” are available.
   - Focus is trapped; closing restores focus to the button.

- The selected seat count is announced after every change.
- Max-seat warning is announced via `accessibilityLiveRegion="assertive"`.
- Haptics are supplementary; never the only feedback.
- Seat colors are never the only state; each has an icon/label and an accessibility label.
- Unavailable seats are not focusable.
- The legend sheet is accessible and lists state names, not just swatches.

### 5.4 Ticket types

- The per-seat ticket type selector is a radio group: “Adult, selected”, “Child”, etc.
- Changing a type announces the new line price and total.
- The remove button is labeled “Remove seat F12”.
- The total is announced when it changes, politely.

### 5.5 Review and payment

- Price rows are read as “Tickets, ₦26,500”; the total is “Total, ₦26,800”.
- Promo input has a label and error linked via `accessibilityHint`/`accessibilityLiveRegion`.
- Payment method tabs are a tablist; each announces selected.
- Card fields have persistent labels, not placeholders.
- Errors are announced and focus moves to the first invalid field.
- The “Pay” button announces the amount.
- Processing state announces “Processing payment”; failure announces the message and offers retry.
- 3DS modal traps focus and restores it.

### 5.6 Success

- Announce “Booking confirmed” on mount.
- The ticket is a group with a summary; the QR has a label.
- “Saved to Tickets” is announced politely.
- The success haptic is supplementary.

---

## 6. Dynamic type

- No fixed-height text containers. Rows grow.
- Titles wrap to 2 lines on cards; detail titles wrap freely.
- Buttons grow vertically if the label wraps; min height 44.
- Do not use `adjustsFontSizeToFit` to shrink important text; allow wrapping.
- Test at 200% on iOS and Android.
- At 200%, the seat map remains usable via the row picker; the map itself may scroll horizontally.
- The tab bar labels may wrap to 2 lines; keep the bar height flexible or truncate with an accessible full label.
- Never clip text with `overflow: hidden` unless it is a single-line ellipsis with a full accessibility label.

---

## 7. Focus and keyboard

- Focus order follows visual order.
- Modals and sheets trap focus; closing restores focus to the trigger.
- The search modal autofocuses the field; closing returns focus to the search button.
- The bottom sheet grabber is not the only dismiss affordance; provide a close button.
- Hardware keyboard: tab order, Enter/Space activate, Escape closes modals.
- Android back closes modals/sheets before navigating.

---

## 8. Reduced motion

- Use `useReducedMotion()`.
- Replace transforms with fades; no scale/travel.
- Disable auto-advancing carousels.
- Disable skeleton shimmer (static placeholder).
- Disable haptics.
- Keep durations ≤ 200 ms.
- The splash becomes a 200 ms cross-fade.

---

## 9. Color independence

Every state must have at least two channels:

| State | Channels |
|---|---|
| Selected seat | Fill + check badge + accessibility state |
| Unavailable seat | Hatch + opacity + label + disabled state |
| Few left | Blush fill + “Few left” label + icon |
| Sold out | Muted fill + strikethrough + “Sold out” label + disabled |
| Active tab | Pill + filled icon + label weight + selected state |
| Error | Error container + alert icon + text |
| Success | Brand check + “Confirmed” text |
| Unread | Dot + “unread” in the accessibility label |

---

## 10. Screen reader test script

Run this on iOS (VoiceOver) and Android (TalkBack).

### Home
- [ ] Wordmark, location, search, and bell are announced with roles.
- [ ] Hero announces title, score, runtime, genre, and actions.
- [ ] Page indicator is not read as four meaningless buttons.
- [ ] Rails announce section titles and item counts.
- [ ] Tab bar announces “Home, tab, 1 of 5” and selected state.

### Movie detail
- [ ] Back/share/save are labeled.
- [ ] Title and score row read in order.
- [ ] Score cards do not read “R” or “M” badges.
- [ ] Tabs are a tablist; switching announces the panel.
- [ ] Showtime chips announce time, format, price, availability.
- [ ] Selecting a time announces the navigation.

### Seats
- [ ] “Select by row” is reachable and opens the modal.
- [ ] Rows and seats are navigable; states are announced.
- [ ] Selecting announces the count.
- [ ] Max-seat warning is announced.
- [ ] Ticket type radio group works.
- [ ] Total changes are announced.
- [ ] Continue is disabled at 0 and announces why.

### Payment
- [ ] Method tabs announce selected.
- [ ] Card fields have labels and autofill hints.
- [ ] Invalid field announces the error and moves focus.
- [ ] Pay announces the amount.
- [ ] Processing and failure are announced.
- [ ] Retry is reachable.

### Ticket
- [ ] QR has a label with the booking reference.
- [ ] Details read in a sensible order.
- [ ] Cancel is reachable and the policy is read.

---

## 11. Manual device matrix

| Device | Width | Why |
|---|---|---|
| iPhone SE (3rd gen) | 375 | Small screen, home button |
| iPhone 15 | 393 | Reference |
| iPhone 15 Pro Max | 430 | Large screen |
| Pixel 6a | 412 | Android reference |
| Small Android | 320 | Minimum width |
| iPad | 768 | Tablet grid |

Test both light and dark, and 100% / 200% text.

---

## 12. Common failures to avoid

- A seat map that is only usable by sighted touch.
- Color-only seat states.
- A 10 dp label that becomes unreadable at 200%.
- Icon buttons without labels.
- A sheet with no close button.
- A disabled CTA with no explanation.
- A form with placeholder-only labels.
- A success screen announced as “image, image, button”.
- A QR that is dark-on-dark in dark mode.
- A tab bar that hides labels on small screens.
- A toast that is the only feedback for an error.
- A modal that loses focus on close.

---

## 13. Accessibility acceptance

- [ ] All touch targets ≥ 44 dp.
- [ ] All text meets the contrast table in both schemes.
- [ ] Every icon-only button has a label.
- [ ] The booking flow is completable with VoiceOver and TalkBack.
- [ ] The seat row picker works.
- [ ] Seat states have icon/label, not color alone.
- [ ] Dynamic type at 200% does not clip or overlap.
- [ ] Reduced motion is honored everywhere.
- [ ] Focus is trapped/restored in modals.
- [ ] Errors are announced and linked to fields.
- [ ] The QR is high-contrast on white in both schemes.
- [ ] No screen has an unlabeled interactive element.

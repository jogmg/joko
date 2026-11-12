# 09 — Component Library

Build each component once, in `src/components`, and reuse it. Every interactive component needs pressed, focused, disabled, and — where relevant — loading/error states. Every icon-only component needs an `accessibilityLabel`.

Do not add a UI kit. These are thin, typed components on top of React Native, NativeWind, Reanimated, and the design tokens.

---

## 1. Folder structure

```
src/components/
  ui/
    AppBar.tsx
    Avatar.tsx
    Badge.tsx
    BottomSheet.tsx
    Button.tsx
    Chip.tsx
    Divider.tsx
    EmptyState.tsx
    ErrorBanner.tsx
    IconButton.tsx
    Input.tsx
    PerforatedDivider.tsx
    PressableScale.tsx
    PriceRow.tsx
    Screen.tsx
    SectionHeader.tsx
    SegmentedControl.tsx
    Skeleton.tsx
    SwitchRow.tsx
    Text.tsx
    Toast.tsx

  movie/
    MovieCard.tsx
    MovieHero.tsx
    MovieRail.tsx
    Rating.tsx
    CastRail.tsx
    ReviewCard.tsx
    TrailerCard.tsx

  cinema/
    CinemaCard.tsx
    CinemaRow.tsx
    CinemaMap.tsx
    AmenityChip.tsx

  booking/
    BookingSummary.tsx
    StepProgress.tsx
    DateStrip.tsx
    ShowtimeChip.tsx
    ShowtimeGroup.tsx
    SeatMap.tsx
    Seat.tsx
    SeatLegend.tsx
    SeatRowPicker.tsx
    SeatSelectionSheet.tsx
    TicketStub.tsx
    PaymentMethodTabs.tsx
    CardForm.tsx
    SavedCardRow.tsx

  ticket/
    TicketCard.tsx
    QrCode.tsx

  navigation/
    TabBar.tsx
    TabBarItem.tsx
```

---

## 2. Primitives

### 2.1 `Button`

```ts
type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tonal' | 'ghost' | 'destructive';
  size?: 'lg' | 'md' | 'sm';          // 52 / 44 / 36
  leadingIcon?: keyof typeof Ionicons.glyphMap;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityHint?: string;
};
```

- Primary: `brand` fill, `on-brand` text.
- Secondary: transparent, 1 px `outline`, `on-surface`.
- Tonal: `primary-container`, `on-primary-container`.
- Ghost: transparent, `primary` text.
- Destructive: `error-container`, `on-error-container`.
- Disabled: `surface-variant`, `on-surface-variant`; no shadow.
- Loading: spinner replaces the leading icon; label becomes “Processing…” where appropriate; disabled.
- Pressed: scale 0.97 + opacity 0.9, 120 ms. Android ripple allowed.
- Min height 44; min width 44; label 12/600 (or 15/600 for lg).
- Full-width option for sticky CTAs.

### 2.2 `IconButton`

```ts
type IconButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  label: string;                     // required
  size?: 36 | 44 | 48;
  variant?: 'surface' | 'ghost' | 'tonal' | 'blur';
  selected?: boolean;
  disabled?: boolean;
  badge?: boolean;
};
```

- Circular, `surface+1` by default.
- `blur` uses `expo-blur` over imagery.
- Selected: `primary-container` + `brand` icon.
- Hit target at least 44×44.

### 2.3 `Chip`

```ts
type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  size?: 'sm' | 'md';                // 28 / 32
};
```

- 32 dp height, radius 999, 12 horizontal padding.
- Selected: `primary-container` + `on-primary-container` + optional check.
- Unselected: `surface+1` + `on-surface-variant`.
- Non-interactive chips (genre) use `surface-variant` + `on-surface-variant` and no pressed state.

### 2.4 `SegmentedControl`

```ts
type SegmentedControlProps<T extends string> = {
  options: { value: T; label: string; icon?: keyof typeof Ionicons.glyphMap }[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
};
```

- `surface+1` track, `primary-container` thumb, 120 ms slide.
- 2–4 options; if more, use a scrollable row.
- Each segment min height 36, min width 44.
- Accessibility: `tablist`, `tab`, selected state.

### 2.5 `Input`

```ts
type InputProps = {
  label: string;                     // floating label, always visible
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  leadingIcon?: keyof typeof Ionicons.glyphMap;
  trailing?: React.ReactNode;
  helper?: string;
  error?: string;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoComplete?: TextInputProps['autoComplete'];
  textContentType?: TextInputProps['textContentType'];
  maxLength?: number;
  editable?: boolean;
  onBlur?: () => void;
};
```

- 56 dp height, radius 8, `surface+1`.
- Floating label 12/600, always visible when focused or filled.
- Focus: 2 px `primary` ring.
- Error: 2 px `error` ring + inline `alert-circle` message.
- Disabled: `surface-variant`, 50% opacity.
- Never use placeholder as the only label.

### 2.6 `BottomSheet`

```ts
type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  snapPoints?: (string | number)[];
  children: React.ReactNode;
  keyboardAvoiding?: boolean;
  scrollable?: boolean;
};
```

- Uses `@gorhom/bottom-sheet`.
- 28 dp top radius, grabber 36×4, scrim `#1D1B1E` at 40%, fade 200 ms.
- Spring `damping 22`, `stiffness 200`.
- Focus trap; restore focus on close.
- Keyboard-avoiding for forms.

### 2.7 `AppBar`

```ts
type AppBarProps = {
  title?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  transparent?: boolean;
  blurred?: boolean;
  large?: boolean;
};
```

- 56 + safe area.
- Back 44×44, label “Go back”.
- Title 18/600, one line, truncated.
- Transparent variant for image-led detail screens; becomes solid after 12 dp scroll.
- No duplicate large title below.

### 2.8 `SectionHeader`

```ts
type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};
```

- Title 18/600 left, optional subtitle 13.
- `See all` text button right, `primary`, 44 dp target, no pill.

### 2.9 `Screen`

- Safe area wrapper with background, optional scroll, optional bottom inset.
- Props: `scroll?: boolean`, `contentContainerStyle`, `bottomInset?: number`, `testID`.
- Tab screens set `bottomInset = tabBarHeight + 24`.

### 2.10 `Text`

- Typography wrapper with `variant` (`display`, `h1`, `h2`, `h3`, `body`, `bodyStrong`, `bodyS`, `label`, `caption`, `overline`).
- Applies color token, tabular numerals when `numeric`.
- `numberOfLines` respected; no fixed heights.

### 2.11 `PressableScale`

- Wraps children with a 0.97 scale + 0.9 opacity press animation, 120 ms.
- Respects reduced motion (opacity only).
- Used by cards, hero actions, seat buttons.

### 2.12 `Skeleton`

- `surface+1` base + `surface+2` shimmer.
- Props: `width`, `height`, `radius`, `style`.
- No spinners for content.

### 2.13 `EmptyState`

```ts
type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
};
```

- Icon 48 `on-surface-variant` in a 72 `surface+1` circle.
- Title 18/600, body 15, action brand or tonal.
- Centered, 32 padding.

### 2.14 `ErrorBanner`

```ts
type ErrorBannerProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'error' | 'info';
};
```

- Error: `error-container` + `on-error-container` + `alert-circle`.
- Info: `primary-container` + `on-primary-container` + `information-circle`.
- Never use error styling for guidance.

### 2.15 `Toast`

- Bottom safe area + 12, `on-surface` at 92%, `surface` text, radius 12, 12 padding, icon.
- 2.5 s; optional action (“Undo”).
- Announced with `accessibilityLiveRegion="polite"`.

### 2.16 `PriceRow`

```ts
type PriceRowProps = {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
};
```

- Label 13/15, value 13/15, tabular, right-aligned.
- Strong: 18/700.
- No boxes; use spacing and a divider before the total.

### 2.17 `Avatar`

- Sizes 32/40/56/72.
- Image or initials.
- Initials background rotates through `primary-container`, `secondary-container`, `tertiary-container`, `surface-variant`.
- No blue/green.

### 2.18 `Badge`

- Dot 6 or numeric pill.
- `primary` fill, `on-primary` text, 10/700.
- Max “9+”.

### 2.19 `SwitchRow`

- 56 dp row, label 15/600, description 13, platform `Switch` with `primary` track.
- Used for notification toggles and “Save this card”.

### 2.20 `PerforatedDivider`

- 1 dp dashed `outline-variant`.
- Optional notches: two 12 dp `background` circles at the edges.
- Used in ticket stubs.

---

## 3. Movie components

### 3.1 `MovieCard`

```ts
type MovieCardProps = {
  movie: Movie;
  variant?: 'rail' | 'grid';
  rank?: number;
  showReleaseDate?: boolean;
  onPress: () => void;
};
```

- Rail: 124×186 poster, title 13/600, meta 11.
- Grid: fluid width, 2:3 poster, title 13/600, meta 11.
- Score chip top-left, `NEW` badge below.
- Ranked variant: oversized numeral behind poster.
- No bookmark icon in the card.
- Placeholder shimmer; pressed scale 0.97.

### 3.2 `MovieHero`

- 4:5 card, radius 24, image + scrim.
- Overlay: `Joko pick`, meta, title, `Book tickets`, `Details`, save.
- Page indicator bars.
- Props: `movie`, `onBook`, `onDetails`, `onSave`, `saved`.
- Accessibility group label.

### 3.3 `MovieRail`

- `FlatList` horizontal, `SectionHeader`, 12 gap, 20 padding.
- Props: `title`, `subtitle`, `movies`, `ranked`, `onSeeAll`.
- Virtualized; no nested VirtualizedList in a vertical ScrollView. Use a single vertical `FlatList` with section data on Home.

### 3.4 `Rating`

- Joko score: star + number + optional “Joko score” label.
- Critic/audience: plain text, no logos.
- Sizes sm/md/lg.
- Star row: filled/half/outline, 12–16 dp.

### 3.5 `CastRail`

- Horizontal `FlatList`, 72 circles, name 13/600, role 11.
- Avatar palette containers only.
- `See all` opens a grid sheet.

### 3.6 `ReviewCard`

- Avatar 40, name 13/600, star row, date 11, body 15/22 clamped 4 lines with More, helpful button, overflow (Report).
- No reply pill.
- Props: `review`, `onHelpful`, `onReport`.

### 3.7 `TrailerCard`

- 16:9 thumbnail, play 56, duration chip.
- Props: `trailer`, `onPress`.
- Hidden if no trailer.

---

## 4. Cinema components

### 4.1 `CinemaCard`

- 88×88 photo, name, address, distance/drive time, rating, status, amenities, price, next showtime, chevron.
- Props: `cinema`, `onPress`, `onSelect?`, `selectLabel?`.
- In booking context, a single `Choose` button replaces the chevron.

### 4.2 `CinemaRow`

- Compact Home variant: 72×72 photo, name, distance, next showtime, amenities, chevron.

### 4.3 `CinemaMap`

- Static bundled map + pins.
- Props: `points`, `selectedId`, `onSelect`, `onRecenter`.
- Pins 36/44, labels, clustering.
- Accessibility: pins are buttons; list fallback.

### 4.4 `AmenityChip`

- Icon + label 11, `surface+1`, 28 dp.
- Max 4 + `+n`.

---

## 5. Booking components

### 5.1 `BookingSummary`

```ts
type BookingSummaryProps = {
  movie: Movie;
  cinema?: Cinema;
  showtime?: Showtime;
  onChange?: () => void;
  compact?: boolean;
};
```

- 96 dp card, poster 48×72, title, cinema, format/date/time, optional Change.
- Reused on date-time, seats, payment. Not used on review (ticket stub is the summary).

### 5.2 `StepProgress`

```ts
type StepProgressProps = {
  current: 1 | 2 | 3;
  labels?: [string, string, string]; // Date & time, Seats, Payment
};
```

- 4 dp track, 2 dp fill, 24 dp circles.
- Completed check, current brand, upcoming muted.
- Accessibility: “Step 2 of 3, Seats”.

### 5.3 `DateStrip`

```ts
type DateStripProps = {
  dates: DateOption[];               // { iso, dayLabel, date, month, isToday, disabled }
  selected: string;
  onSelect: (iso: string) => void;
  onOpenCalendar?: () => void;
};
```

- 10 days, 64 dp height, 56 dp width, 8 gap.
- Selected brand, today dot.
- Horizontal `FlatList`, 20 edge padding.

### 5.4 `ShowtimeChip`

```ts
type ShowtimeChipProps = {
  time: string;
  price: string;
  state: 'available' | 'selected' | 'few-left' | 'sold-out';
  onPress: () => void;
};
```

- 72 min width, 44 height, 12 radius.
- States per design system; sold out includes strikethrough + label.

### 5.5 `ShowtimeGroup`

- Format header, auditorium line, price line, wrapping chips.
- Props: `format`, `auditorium`, `price`, `times`, `selectedId`, `onSelect`.

### 5.6 `SeatMap`

```ts
type SeatMapProps = {
  layout: SeatLayout;                // rows, seats, sections, aisles, screen
  selected: string[];
  unavailable: string[];
  onToggle: (seat: Seat) => void;
  maxSeats: number;
};
```

- Curved screen, section labels, row labels both sides, 24 dp seats, 4 gap, aisle 16.
- Pinch/pan, +/−/Reset.
- `onToggle` handles max-seat feedback.
- Accessibility: group summary + “Select by row” button.
- No nested scroll conflict with the page: the map owns its gestures.

### 5.7 `Seat`

```ts
type SeatProps = {
  seat: Seat;
  state: 'available' | 'selected' | 'unavailable' | 'premium' | 'accessible' | 'companion';
  onPress: () => void;
};
```

- 24×24 visual, 44×44 hit area.
- Glyph + check/star/wheelchair badges.
- `accessibilityRole="button"`, `accessibilityState={{ selected, disabled }}`, label “Row F seat 12, available, ₦7,500”.

### 5.8 `SeatLegend`

- `?` button opens a sheet with four rows: Available, Selected, Unavailable, Accessible.
- Icons + labels, not color alone.

### 5.9 `SeatRowPicker`

- Modal list of rows and seats for screen readers.
- Running count announcement.
- Focus trap, restore.

### 5.10 `SeatSelectionSheet`

```ts
type SeatSelectionSheetProps = {
  seats: SeatSelection[];
  total: string;
  onContinue: () => void;
  onRemove: (id: string) => void;
  onChangeTicketType: (id: string, type: TicketType) => void;
  onClear: () => void;
};
```

- Peek 132, expandable 70%.
- Collapsed: count, seat labels, total, Continue.
- Expanded: per-seat rows with ticket type selector, price, remove.
- `+ Add seats` closes the sheet.
- CTA disabled at 0.

### 5.11 `TicketStub`

- Review variant and ticket variant.
- Poster, title, date/time/cinema/screen grid, seat chips, ticket types, perforation, price breakdown or QR.
- Props: `ticket`, `mode: 'review' | 'ticket'`, `onEdit?`.

### 5.12 `PaymentMethodTabs`

- Card / Transfer / Wallet segmented control.
- Props: `value`, `onChange`.
- Platform-aware wallet content handled by parent.

### 5.13 `CardForm`

- Card number, name, expiry, CVC, billing country, save switch.
- Formatting + validation + autofill.
- Props: `value`, `onChange`, `errors`, `disabled`.
- Never store or log values.

### 5.14 `SavedCardRow`

- Radio, brand, last 4, expiry, default chip.
- 56 dp row.

---

## 6. Ticket components

### 6.1 `TicketCard`

```ts
type TicketCardProps = {
  ticket: Ticket;
  variant: 'upcoming' | 'past' | 'detail' | 'success';
  onPress?: () => void;
  onShare?: () => void;
};
```

- Uses `TicketStub` + `QrCode`.
- Upcoming: 64×96 poster, countdown, QR thumb.
- Detail: 220 QR, reference, actions.
- Success: full ticket + confirmed chip.
- Past/cancelled: dimmed QR, status chip.

### 6.2 `QrCode`

- Wraps `react-native-qrcode-svg`.
- 220/140/56 sizes.
- White background card + quiet zone.
- Props: `value`, `size`, `label`.
- Accessibility: label “QR code for booking JKO-…”.
- No logo in the center (keeps scanning reliable).

---

## 7. Navigation components

### 7.1 `TabBar`

- Five items, height 64 + inset, hairline, active pill.
- Props: `state`, `descriptors`, `navigation` from React Navigation, or a custom typed wrapper.
- Labels always visible.
- Badge support for Tickets/Notifications.
- Cross-fade transition handled by the tab navigator.

### 7.2 `TabBarItem`

- Icon 24, label 11/600, active pill 32×32.
- 48×48 target.
- `accessibilityRole="tab"`, selected state, “Home, tab, 1 of 5”.

---

## 8. Component quality bar

Every component must have:

- [ ] Typed props, no `any`.
- [ ] Light and dark token usage.
- [ ] Pressed/focused/disabled states.
- [ ] Accessibility label/role/state.
- [ ] Minimum 44 dp target for interactive elements.
- [ ] No hard-coded colors or spacing outside tokens.
- [ ] A loading/empty/error state where it fetches or can fail.
- [ ] A reduced-motion path for any animation.
- [ ] A testID for QA automation (optional but recommended).

---

## 9. Anti-patterns

- Do not create screen-specific button variants; extend `Button`.
- Do not duplicate `BookingSummary` or `TicketCard` per screen.
- Do not use a `ScrollView` around a `FlatList`.
- Do not animate width/height/top/left.
- Do not use `#FFF`/`#000` except the QR card.
- Do not add a component library or a second icon family.
- Do not use a spinner for content loading.
- Do not use color alone for seat/showtime/tab state.

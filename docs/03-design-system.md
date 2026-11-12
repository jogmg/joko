# 03 — Design System

The system is cinematic, quiet, and editorial. Deep plum anchors identity, lavender creates air, blush adds warmth, and near-black/off-white surfaces carry the content. Typography and imagery do the hierarchy work; borders and shadows are used sparingly.

All values below are canonical. No screen may introduce a color outside this document.

---

## 1. Tonal palettes

Exact values. Use the semantic tokens in section 2 for UI; use the ramps only when a semantic token does not exist.

| Tone | Primary | Secondary | Tertiary | Error | Neutral | Neutral Variant |
|---|---|---|---|---|---|---|
| 0 | `#000000` | `#000000` | `#000000` | `#000000` | `#000000` | `#000000` |
| 10 | `#280056` | `#1F182A` | `#311019` | `#410102` | `#1D1B1E` | `#1D1A21` |
| 20 | `#430486` | `#362D40` | `#4A252D` | `#690005` | `#312F34` | `#322F36` |
| 30 | `#5A299C` | `#4C4358` | `#643A44` | `#93000A` | `#48464B` | `#4B454F` |
| 40 | `#7445B7` | `#645B70` | `#80525C` | `#BA1A1A` | `#625D61` | `#625C66` |
| 50 | `#8E5FD1` | `#7D7489` | `#9C6A75` | `#DE372F` | `#7B767A` | `#7B757F` |
| 60 | `#A879ED` | `#988CA4` | `#B7848D` | `#FF544A` | `#948F95` | `#958D98` |
| 70 | `#C196FF` | `#B3A7BF` | `#D59DA8` | `#FF897D` | `#AFAAAE` | `#B0A8B3` |
| 80 | `#D8BAFF` | `#CFC2DC` | `#F1B7C3` | `#FEB4AB` | `#CAC5CB` | `#CBC3CE` |
| 90 | `#EDDCFF` | `#EBDDF7` | `#FFD8E0` | `#FFDAD7` | `#E7E0E7` | `#E8E0EB` |
| 95 | `#F8EDFE` | `#F8EDFE` | `#FFECEE` | `#FFEDEB` | `#F5EEF5` | `#F6EEF9` |
| 99 | `#FFFBFF` | `#FFFBFF` | `#FFFBFF` | `#FFFBFF` | `#FFFBFF` | `#FFFBFF` |
| 100 | `#FFFBFF` | `#FFFBFF` | `#FFFBFF` | `#FFFBFF` | `#FFFBFF` | `#FFFBFF` |

**Note on dark error:** the brief’s semantic table says `#FFB4AB`, but that value is not in the tonal ramp. Use Error80 `#FEB4AB` so every color traces to the palette.

---

## 2. Semantic tokens

### 2.1 Light

| Token | Value | Use |
|---|---|---|
| `background` | `#FFFBFF` | App background |
| `on-background` | `#1D1B1E` | Primary text |
| `surface` | `#FFFBFF` | Cards, bars |
| `on-surface` | `#1D1B1E` | Text on surface |
| `surface-variant` | `#E8E0EB` | Inactive fills, skeletons, disabled |
| `on-surface-variant` | `#4B454F` | Secondary text |
| `outline` | `#7B757F` | Strong borders, icons (not small text) |
| `outline-variant` | `#CBC3CE` | Hairlines only |
| `primary` | `#7445B7` | Links, active icons, focus ring |
| `on-primary` | `#FFFBFF` | Text on primary |
| `primary-container` | `#EDDCFF` | Chips, active pill, highlights |
| `on-primary-container` | `#280056` | Text on lavender |
| `brand` | `#280056` | Filled CTAs, splash, wordmark |
| `on-brand` | `#FFFBFF` | Text on brand |
| `secondary` | `#645B70` | Supporting text/icons |
| `secondary-container` | `#EBDDF7` | Secondary chips |
| `on-secondary-container` | `#1F182A` | Text on secondary container |
| `tertiary` | `#80525C` | Blush accent, premium labels |
| `tertiary-container` | `#FFD8E0` | Premium seats, low-availability |
| `on-tertiary-container` | `#311019` | Text on blush |
| `error` | `#BA1A1A` | Errors only |
| `error-container` | `#FFDAD7` | Error banners |
| `on-error-container` | `#410102` | Text on error banner |

### 2.2 Dark

| Token | Value |
|---|---|
| `background` | `#1D1B1E` |
| `on-background` | `#E7E0E7` |
| `surface` | `#1D1B1E` |
| `on-surface` | `#CAC5CB` |
| `surface-variant` | `#4B454F` |
| `on-surface-variant` | `#CBC3CE` |
| `outline` | `#958D98` |
| `outline-variant` | `#4B454F` |
| `primary` | `#D8BAFF` |
| `on-primary` | `#430486` |
| `primary-container` | `#5A299C` |
| `on-primary-container` | `#EDDCFF` |
| `brand` | `#280056` |
| `on-brand` | `#FFFBFF` |
| `secondary` | `#CFC2DC` |
| `secondary-container` | `#4C4358` |
| `on-secondary-container` | `#EBDDF7` |
| `tertiary` | `#F1B7C3` |
| `tertiary-container` | `#643A44` |
| `on-tertiary-container` | `#FFD8E0` |
| `error` | `#FEB4AB` |
| `error-container` | `#93000A` |
| `on-error-container` | `#FFDAD7` |

### 2.3 Rules

- `brand` is for filled actions and identity. Never use `primary` for a large filled button; it loses the depth of the plum.
- `primary` is for links, active icons, focus rings, and small accents.
- `on-primary` is the text color on `primary`; `on-brand` is the text color on `brand`.
- `tertiary-container` is for premium seats and “few left” — always with a label/icon.
- `error` is only for errors. Do not use it for guidance, warnings, or sold-out states.
- `outline-variant` is a hairline. It is 1.67:1 against the light background and must never carry text.
- Never use pure `#FFFFFF` or `#000000` for surfaces. The QR card is the only white exception.

---

## 3. Surface elevations

Light: base `#FFFBFF` with primary overlay at 5 / 8 / 11 / 12 / 14%.

| Level | Value | Use |
|---|---|---|
| Surface | `#FFFBFF` | Page |
| +1 | `#F4EEF7` | Cards on background, inputs |
| +2 | `#EEE7F1` | Sheets, menus |
| +3 | `#E7DFEC` | Pressed/hover |
| +4 | `#E5DDEB` | Modals |
| +5 | `#E1D8E7` | Tooltips |

Dark: base `#1D1B1E` with `#D8BAFF` overlay at 5 / 8 / 11 / 12 / 14%.

| Level | Value | Use |
|---|---|---|
| Surface | `#1D1B1E` | Page |
| +1 | `#262329` | Cards |
| +2 | `#2C2830` | Sheets, tab bar |
| +3 | `#322C37` | Pressed/hover |
| +4 | `#332E39` | Modals |
| +5 | `#37313E` | Tooltips |

Use `+1` for cards on the page and `+2` for sheets/menus. Do not stack more than one elevation level plus a hairline. Do not use drop shadows to separate more than one level.

**Floating shadow (light only):** `0 8 24 rgba(40,0,86,0.08)`, Android `elevation: 3`. Use only for the tab bar, FAB, and sheets.

---

## 4. Typography

### 4.1 Families

- **UI:** Plus Jakarta Sans, weights 400/500/600/700/800. Fallback: system sans (`System`, `sans-serif`).
- **Wordmark:** exported “Joko” asset. Never retype it. If an asset is unavailable, Baloo 2 ExtraBold is the closest fallback, but the asset is required for shipping.
- **Numerals:** tabular for prices, times, seat labels, totals, and countdowns.

### 4.2 Scale

| Style | Size / line | Weight | Tracking | Use |
|---|---|---|---|---|
| Display | 32 / 38 | 800 | −0.03em | Home greeting, editorial H1 |
| H1 | 28 / 34 | 700 | −0.02em | Screen title |
| H2 | 22 / 28 | 700 | −0.02em | Section title, sheet title |
| H3 | 18 / 24 | 600 | −0.01em | Card title, rail header |
| Body | 15 / 22 | 400 | 0 | Paragraphs |
| Body Strong | 15 / 22 | 600 | 0 | Emphasis, row labels |
| Body S | 13 / 18 | 400 | 0 | Secondary rows |
| Label | 12 / 16 | 600 | 0.01em | Chips, buttons, tab labels |
| Caption | 11 / 14 | 500 | 0.02em | Metadata, helper text |
| Overline | 11 / 14 | 700 | 0.08em uppercase | Max one per screen |

Rules:

- Sentence case for buttons, titles, navigation labels, and section headers.
- No all-caps except the single optional overline.
- No body text below 11 dp. Never use 10 dp labels.
- Titles wrap to a maximum of two lines on cards; allow full wrap on detail screens.
- Do not use fixed-height text containers. Test at 200% text size.

### 4.3 Type tokens

```ts
export const type = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: '800', letterSpacing: -0.96 },
  h1:      { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.56 },
  h2:      { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.44 },
  h3:      { fontSize: 18, lineHeight: 24, fontWeight: '600', letterSpacing: -0.18 },
  body:    { fontSize: 15, lineHeight: 22, fontWeight: '400', letterSpacing: 0 },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600', letterSpacing: 0 },
  bodyS:   { fontSize: 13, lineHeight: 18, fontWeight: '400', letterSpacing: 0 },
  label:   { fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 0.12 },
  caption: { fontSize: 11, lineHeight: 14, fontWeight: '500', letterSpacing: 0.22 },
  overline:{ fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 0.88, textTransform: 'uppercase' },
} as const;
```

---

## 5. Spacing, radius, and sizing

### 5.1 Spacing

`4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64`

- Screen gutter: 20.
- Section gap: 28.
- Card padding: 16.
- List row gap: 12.
- Inline icon gap: 8.
- Button inner horizontal padding: 20 (primary), 16 (secondary).

### 5.2 Radius

| Token | Value | Use |
|---|---|---|
| `sm` | 8 | Small inputs, tags |
| `md` | 12 | Chips, inner cards, time chips |
| `lg` | 16 | Cards, posters |
| `xl` | 20 | Buttons, sheets |
| `2xl` | 24 | Hero cards |
| `sheet` | 28 | Bottom sheet top corners |
| `full` | 999 | Pills, avatars |

### 5.3 Touch targets

- Minimum 44×44. Preferred 48×48 for tab items and icon buttons.
- Adjacent targets must have at least 8 dp between them.
- Seat targets are 24×24 visual with a 44×44 hit area via `hitSlop`.

### 5.4 Layout widths

- Reference phone: 390×844.
- Test widths: 320, 375, 390, 430, 768 (tablet).
- Content max width on tablet: 720, centered.
- Poster grid: 2 columns below 600 dp, 3 columns at ≥ 600 dp.
- Movie poster aspect: 2:3. Hero aspect: 4:5. Cinema photo: 1:1. Trailer: 16:9. Backdrop: 3:4.

---

## 6. Color contrast

Measured WCAG ratios for the pairs used in the UI.

| Pair | Ratio | Verdict |
|---|---|---|
| `on-surface` / `background` (light) | 16.69 | AAA |
| `on-surface-variant` / `surface` (light) | 9.06 | AAA |
| `on-surface-variant` / `surface+1` (light) | 8.14 | AAA |
| `primary` / `background` (light) | 6.25 | AA |
| `on-primary` / `primary` (light) | 6.25 | AA |
| `on-brand` / `brand` | 16.74 | AAA |
| `on-primary-container` / `primary-container` (light) | 13.30 | AAA |
| `tertiary` / `background` (light) | 6.25 | AA |
| `on-tertiary-container` / `tertiary-container` (light) | 13.25 | AAA |
| `error` / `background` (light) | 6.31 | AA |
| `on-error-container` / `error-container` (light) | 13.22 | AAA |
| `outline` / `background` (light) | 4.37 | Icons/borders only, not small text |
| `outline-variant` / `background` (light) | 1.67 | Hairlines only |
| `on-background` / `background` (dark) | 13.21 | AAA |
| `on-surface` / `surface` (dark) | 10.07 | AAA |
| `on-surface-variant` / `surface+2` (dark) | 8.42 | AAA |
| `primary` / `background` (dark) | 10.09 | AAA |
| `on-primary` / `primary` (dark) | 7.74 | AAA |
| `on-primary-container` / `primary-container` (dark) | 7.29 | AAA |
| `error` / `background` (dark) | 10.04 | AAA |
| `outline` / `background` (dark) | 5.33 | AA |
| `outline-variant` / `background` (dark) | 1.84 | Hairlines only |

**Never** use `#EDDCFF` as text on `#FFFBFF` (1.28:1). Use `on-primary-container` on `primary-container`, or `primary` on `background`.

---

## 7. Iconography

- Use Ionicons (preferred) or MaterialCommunityIcons.
- Use filled icons for active/selected states, outline for inactive.
- Sizes: 16 (inline), 20 (chips/rows), 24 (nav/actions), 28 (hero actions).
- Stroke weight must match the type weight visually; do not mix icon families in one surface.
- Every icon-only button needs an `accessibilityLabel`.
- Do not use emoji as icons or decoration in UI chrome.

**Core icon map**

| Concept | Ionicons |
|---|---|
| Home | `home` / `home-outline` |
| Movies | `film` / `film-outline` |
| Cinemas | `location` / `location-outline` |
| Tickets | `ticket` / `ticket-outline` |
| Account | `person-circle` / `person-circle-outline` |
| Search | `search` |
| Notifications | `notifications-outline` |
| Location | `location-outline` |
| Calendar | `calendar-outline` |
| Clock | `time-outline` |
| Card | `card-outline` |
| Transfer | `business-outline` |
| Wallet | `wallet-outline` |
| Lock | `lock-closed-outline` |
| Check | `checkmark` |
| Close | `close` |
| Chevron | `chevron-forward` / `chevron-down` |
| Edit | `create-outline` |
| Share | `share-outline` |
| Save | `bookmark` / `bookmark-outline` |
| Star | `star` / `star-outline` |
| Seat | `seat` (MaterialCommunityIcons) |
| Accessible | `accessibility` |
| Screen | `tv-outline` |
| Filter | `options-outline` |
| Sort | `swap-vertical-outline` |
| Map | `map-outline` |
| List | `list-outline` |

---

## 8. Imagery

- **Movie posters:** 2:3, 124×186 in cards, 96×144 in detail, 64×96 in tickets, 48×72 in compact summaries. Neutral, original artwork only. No real film posters, logos, or celebrity likenesses.
- **Backdrops:** 3:4, full-bleed, with a bottom gradient into `background` (transparent → `background` at 85%).
- **Cinema photos:** 1:1, 88×88 in rows, 16:9 in gallery.
- **Avatars:** 40/56/72 circles, initials on palette containers.
- **Placeholders:** every image has a `surface+1` placeholder with a subtle shimmer; no blank holes. Use `expo-image` with `placeholder`/`transition`.
- **Scrims:** use `expo-linear-gradient`; plum/near-black only. Never a colored gradient outside the palette.
- **QR:** black modules on `#FFFFFF` only, with a quiet zone. The white card is the single allowed pure-white surface.

---

## 9. State recipes

### 9.1 Buttons

| Variant | Fill | Text | Border | Use |
|---|---|---|---|---|
| Primary | `brand` | `on-brand` | none | Main action |
| Secondary | transparent | `on-surface` | 1 px `outline` | Secondary action |
| Tonal | `primary-container` | `on-primary-container` | none | Supporting action |
| Ghost | transparent | `primary` | none | Tertiary/text action |
| Destructive | `error-container` | `on-error-container` | none | Cancel/remove |
| Disabled | `surface-variant` | `on-surface-variant` | none | Any variant |
| Loading | same as variant | spinner + label | same | Async action |

Sizes: 52 (primary), 44 (standard), 36 (compact). Pressed: scale 0.97 + opacity 0.9, 120 ms. Android ripple allowed on buttons; no iOS ripple.

### 9.2 Chips

- Height 32, radius 999, padding 12 horizontal, label 12/600.
- Selected: `primary-container` fill, `on-primary-container` text, optional check icon.
- Unselected: `surface+1` fill, `on-surface-variant` text, no border.
- Disabled: `surface-variant`, 50% opacity, no interaction.

### 9.3 Showtime chips

| State | Fill | Text | Border | Extra |
|---|---|---|---|---|
| Available | `surface+1` | `on-surface` | 1 px `outline-variant` | Price below |
| Selected | `brand` | `on-brand` | none | Check icon |
| Few left | `tertiary-container` | `on-tertiary-container` | none | “Few left” label |
| Sold out | `surface-variant` | `on-surface-variant` | dashed `outline` | Strikethrough time + “Sold out”, disabled |

Never communicate availability by color alone.

### 9.4 Seat states

| State | Fill | Border | Glyph | Extra |
|---|---|---|---|---|
| Available | `surface-variant` | 1 px `outline-variant` | seat, `on-surface-variant` | — |
| Selected | `brand` | none | seat, `on-brand` | check badge |
| Unavailable | `neutral-80` (`#CAC5CB`) | none | seat, `on-surface-variant` | 45° hatch, 40% opacity, not focusable |
| Premium | `tertiary-container` | none | recliner, `on-tertiary-container` | star badge |
| Accessible | `secondary-container` | none | wheelchair, `on-secondary-container` | — |
| Companion | `secondary-container` | none | wheelchair + plus | — |
| Held by others | `surface-variant` | dashed `outline` | lock | “Held” label |

Dark mode uses the dark equivalents of the same tokens; do not invert to new hues.

### 9.5 Inputs

- Height 56, radius 8, fill `surface+1`, no visible border at rest.
- Floating label 12/600, always visible once focused or filled.
- Focus: 2 px `primary` ring.
- Error: 2 px `error` ring + inline message with `alert-circle` icon.
- Disabled: `surface-variant`, 50% opacity.
- Autofill hints for card fields.

### 9.6 Skeletons

- `surface+1` base with a subtle `surface+2` shimmer.
- Match the final layout’s dimensions; no spinners for content.
- Skeletons for Home rails, poster grids, cinema rows, showtimes, seat map, ticket list.
- Spinners only inside buttons during async actions.

---

## 10. Elevation and separation

- Prefer surface tint + spacing over borders.
- Use a 1 px `outline-variant` at 60% opacity only when two surfaces of the same tone touch.
- One shadow level only, for floating elements.
- The tab bar uses a 1 px top hairline in light mode and `surface+2` in dark; no hard shadow unless content scrolls under it.

---

## 11. Do / do not

**Do**

- Use one primary CTA per screen.
- Use `brand` for filled actions.
- Use `primary-container` for active/selected pills.
- Use tabular numerals for prices and times.
- Use icons plus labels for every state.
- Use sentence case.
- Use generous whitespace and large imagery.
- Use the ticket stub as a recurring visual signature.

**Do not**

- Add new hues, neon greens, or gradients outside plum/lavender/blush.
- Use pure `#000` or `#FFF` for large surfaces (QR card excepted).
- Use `primary` as a large button fill.
- Use all-caps labels or 10 dp body text.
- Use placeholder text as the only label.
- Use color alone to communicate state.
- Use third-party rating logos, real posters, or celebrity likenesses.
- Use heavy shadows, multiple nested cards, or dense tables.
- Animate layout properties.
- Ship dead buttons or lorem-ipsum reviews.

---

## 12. Token implementation

The canonical TypeScript shape lives in `src/theme/tokens.ts`. The full implementation plan is in `12-architecture.md`, but the contract is:

```ts
export const palette = {
  primary: { 10: '#280056', 20: '#430486', /* … */ },
  secondary: { /* … */ },
  tertiary: { /* … */ },
  error: { /* … */ },
  neutral: { /* … */ },
  neutralVariant: { /* … */ },
} as const;

export type Theme = {
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  brand: string;
  onBrand: string;
  secondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  errorContainer: string;
  onErrorContainer: string;
  surface1: string;
  surface2: string;
  surface3: string;
  surface4: string;
  surface5: string;
};
```

`useTheme()` returns `{ theme, isDark, scheme, setScheme }`. Tailwind exposes the same names as `bg-surface`, `text-on-surface`, `border-outline-variant`, etc.

---

## 13. Design review checklist

- [ ] Every color maps to a token in this document.
- [ ] One title, one primary CTA.
- [ ] Type uses the scale; no 10 dp text; sentence case.
- [ ] Prices/times use tabular numerals.
- [ ] Every state has an icon/label in addition to color.
- [ ] Light and dark both pass the contrast table.
- [ ] Touch targets ≥ 44 pt.
- [ ] Images have placeholders and correct aspect ratios.
- [ ] No third-party marks or real film assets.
- [ ] Motion uses transform/opacity only.

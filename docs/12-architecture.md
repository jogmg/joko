# 12 — Architecture

This document defines the project structure, provider tree, theming implementation, app configuration, dependencies, and engineering conventions.

The repo is currently a minimal Expo Router starter. The implementation replaces the placeholder screens and store, not the tooling.

---

## 1. Target structure

```
src/
  app/
    _layout.tsx
    +not-found.tsx
    (tabs)/
      _layout.tsx
      index.tsx
      movies.tsx
      cinemas.tsx
      tickets.tsx
      account.tsx
    search.tsx
    notifications.tsx
    movie/[id].tsx
    cinema/[id].tsx
    booking/[movieId]/
      cinema.tsx
      date-time.tsx
      seats.tsx
      review.tsx
      payment.tsx
      success.tsx
    ticket/[id].tsx
    account/
      personal-details.tsx
      payment-methods.tsx
      favourites.tsx
      notifications.tsx
      appearance.tsx
      help.tsx
      about.tsx

  components/
    ui/
    movie/
    cinema/
    booking/
    ticket/
    navigation/

  config/
    market.ts

  data/
    types.ts
    repository.ts
    mock/
      movies.ts
      cinemas.ts
      screens.ts
      showtimes.ts
      seatLayouts.ts
      reviews.ts
      notifications.ts
    index.ts

  hooks/
    useMovies.ts
    useMovie.ts
    useCinemas.ts
    useCinema.ts
    useShowtimes.ts
    useSeatLayout.ts
    useTickets.ts
    useCountdown.ts
    useDebounce.ts
    useReducedMotionSafe.ts
    useRequireDraft.ts
    useRequireSeats.ts
    useRequireShowtime.ts
    useRequirePaidBooking.ts

  services/
    payments/
      types.ts
      mockProvider.ts
      index.ts

  store/
    booking.ts
    tickets.ts
    profile.ts
    preferences.ts
    search.ts

  theme/
    tokens.ts
    typography.ts
    motion.ts
    splash.ts
    ThemeProvider.tsx
    useTheme.ts

  utils/
    money.ts
    dates.ts
    seats.ts
    validation.ts
    haptics.ts

  global.css
```

---

## 2. Provider tree

```tsx
// src/app/_layout.tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { SplashOverlay } from '@/components/SplashOverlay';
import '@/global.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="movie/[id]" />
            <Stack.Screen name="cinema/[id]" />
            <Stack.Screen name="booking/[movieId]" />
            <Stack.Screen name="ticket/[id]" />
            <Stack.Screen name="search" options={{ presentation: 'modal' }} />
            <Stack.Screen name="notifications" options={{ presentation: 'modal' }} />
          </Stack>
          <SplashOverlay />
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

Order matters:

1. `GestureHandlerRootView` wraps everything.
2. `SafeAreaProvider` provides insets.
3. `ThemeProvider` provides tokens and the scheme override.
4. The `Stack` mounts Home underneath the splash overlay.
5. `SplashOverlay` is absolute and above the navigator.
6. `StatusBar` is controlled per screen; the splash forces light content.

Fonts load in `ThemeProvider` or a dedicated `useFonts` gate. Do not block the splash indefinitely; fall back to system fonts if loading fails.

---

## 3. Theming

### 3.1 Token source

`src/theme/tokens.ts` exports:

- `palette` (all tonal ramps).
- `lightTheme` and `darkTheme` (semantic maps).
- `surfaces` (light/dark elevation values).
- `radius`, `spacing`, `type`.
- `Theme` type.

`useTheme()` returns `{ theme, isDark, scheme, setScheme }`.

### 3.2 Scheme resolution

- Default: system (`userInterfaceStyle: "automatic"`).
- User override: `preferences.scheme` (`system` | `light` | `dark`), persisted.
- `useColorScheme()` from React Native, combined with the override, decides `isDark`.
- `setScheme` updates the preference store and applies immediately.

### 3.3 Tailwind + CSS variables

NativeWind works best when semantic colors are CSS variables. Define them in `src/global.css`:

```css
:root {
  --background: 255 251 255;
  --on-background: 29 27 30;
  --surface: 255 251 255;
  --on-surface: 29 27 30;
  --surface-variant: 232 224 235;
  --on-surface-variant: 75 69 79;
  --outline: 123 117 127;
  --outline-variant: 203 195 206;
  --primary: 116 69 183;
  --on-primary: 255 251 255;
  --primary-container: 237 220 255;
  --on-primary-container: 40 0 86;
  --brand: 40 0 86;
  --on-brand: 255 251 255;
  --secondary: 100 91 112;
  --secondary-container: 235 221 247;
  --on-secondary-container: 31 24 42;
  --tertiary: 128 82 92;
  --tertiary-container: 255 216 224;
  --on-tertiary-container: 49 16 25;
  --error: 186 26 26;
  --error-container: 255 218 215;
  --on-error-container: 65 1 2;
  --surface-1: 244 238 247;
  --surface-2: 238 231 241;
  --surface-3: 231 223 236;
  --surface-4: 229 221 235;
  --surface-5: 225 216 231;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: 29 27 30;
    --on-background: 231 224 231;
    --surface: 29 27 30;
    --on-surface: 202 197 203;
    --surface-variant: 75 69 79;
    --on-surface-variant: 203 195 206;
    --outline: 149 141 152;
    --outline-variant: 75 69 79;
    --primary: 216 186 255;
    --on-primary: 67 4 134;
    --primary-container: 90 41 156;
    --on-primary-container: 237 220 255;
    --brand: 40 0 86;
    --on-brand: 255 251 255;
    --secondary: 207 194 220;
    --secondary-container: 76 67 88;
    --on-secondary-container: 235 221 247;
    --tertiary: 241 183 195;
    --tertiary-container: 100 58 68;
    --on-tertiary-container: 255 216 224;
    --error: 254 180 171;
    --error-container: 147 0 10;
    --on-error-container: 255 218 215;
    --surface-1: 38 35 41;
    --surface-2: 44 40 48;
    --surface-3: 50 44 55;
    --surface-4: 51 46 57;
    --surface-5: 55 49 62;
  }
}
```

`tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        'on-background': 'rgb(var(--on-background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'on-surface': 'rgb(var(--on-surface) / <alpha-value>)',
        'surface-variant': 'rgb(var(--surface-variant) / <alpha-value>)',
        'on-surface-variant': 'rgb(var(--on-surface-variant) / <alpha-value>)',
        outline: 'rgb(var(--outline) / <alpha-value>)',
        'outline-variant': 'rgb(var(--outline-variant) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'on-primary': 'rgb(var(--on-primary) / <alpha-value>)',
        'primary-container': 'rgb(var(--primary-container) / <alpha-value>)',
        'on-primary-container': 'rgb(var(--on-primary-container) / <alpha-value>)',
        brand: 'rgb(var(--brand) / <alpha-value>)',
        'on-brand': 'rgb(var(--on-brand) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        'secondary-container': 'rgb(var(--secondary-container) / <alpha-value>)',
        'on-secondary-container': 'rgb(var(--on-secondary-container) / <alpha-value>)',
        tertiary: 'rgb(var(--tertiary) / <alpha-value>)',
        'tertiary-container': 'rgb(var(--tertiary-container) / <alpha-value>)',
        'on-tertiary-container': 'rgb(var(--on-tertiary-container) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        'error-container': 'rgb(var(--error-container) / <alpha-value>)',
        'on-error-container': 'rgb(var(--on-error-container) / <alpha-value>)',
        'surface-1': 'rgb(var(--surface-1) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        'surface-3': 'rgb(var(--surface-3) / <alpha-value>)',
        'surface-4': 'rgb(var(--surface-4) / <alpha-value>)',
        'surface-5': 'rgb(var(--surface-5) / <alpha-value>)',
      },
      borderRadius: {
        sm: '8px', md: '12px', lg: '16px', xl: '20px',
        '2xl': '24px', sheet: '28px',
      },
      spacing: {
        1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px',
        6: '24px', 7: '28px', 8: '32px', 10: '40px', 12: '48px', 16: '64px',
      },
    },
  },
  plugins: [],
};
```

**Fallback if `darkMode: 'media'` does not switch CSS variables reliably in NativeWind:**

- Keep the CSS variables, but apply them with `vars()` from `nativewind` on the root `View` based on `useTheme().isDark`.
- Or use `useTheme()` inline styles for semantic colors and Tailwind only for layout/spacing.
- Do not use `dark:` variants for semantic surfaces; use the token classes so the variable switches once.

### 3.4 ThemeProvider

```tsx
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const scheme = usePreferencesStore(s => s.scheme);
  const isDark = scheme === 'system' ? system === 'dark' : scheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.background);
  }, [theme.background]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, scheme, setScheme }}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>{children}</View>
    </ThemeContext.Provider>
  );
}
```

- `expo-system-ui` sets the root background to avoid a white flash between screens.
- Status bar: `light` on the splash and image-led headers; `auto` elsewhere.

---

## 4. App configuration

Update `app.json`:

```json
{
  "expo": {
    "userInterfaceStyle": "automatic",
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/splash.png",
          "imageWidth": 220,
          "resizeMode": "contain",
          "backgroundColor": "#280056",
          "dark": {
            "image": "./assets/splash.png",
            "backgroundColor": "#280056"
          }
        }
      ]
    ],
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#280056"
      }
    }
  }
}
```

- Keep `scheme: "joko"`.
- Keep `typedRoutes` and `tsconfigPaths`.
- Add iOS/Android bundle identifiers when releasing.
- Do not force `"light"` anymore.

---

## 5. Dependencies

Add only what is needed. Proposed set:

| Package | Why |
|---|---|
| `expo-image` | Cached images, placeholders, transitions |
| `expo-linear-gradient` | Hero scrims, seat screen glow |
| `expo-blur` | Header/backdrop blur over imagery |
| `expo-haptics` | Seat select, success, max-seat warning |
| `@gorhom/bottom-sheet` | Seat sheet, filters, legend, calendar |
| `@react-native-async-storage/async-storage` | Persist tickets, profile, preferences, recent searches |
| `react-native-qrcode-svg` | Ticket QR |
| `react-native-svg` | Peer dependency of the QR library |
| `@expo-google-fonts/plus-jakarta-sans` | UI typeface |

Optional, only if needed:

- `@react-native-masked-view/masked-view` — skip unless a shimmer requires it.
- `expo-brightness` — **not allowed / not added**; QR brightness boost is P1.

Do not add a UI kit, a second navigation library, a state library, or a map SDK.

Install with `npx expo install` so versions match SDK 56.

---

## 6. Fonts

- Load Plus Jakarta Sans 400/500/600/700/800 with `useFonts`.
- Set default `Text` styles in the `Text` component, not globally via a monkey patch.
- Wordmark is an image asset, not a font.
- If fonts fail, use system sans and continue; never block the splash.

---

## 7. Navigation implementation notes

- Use Expo Router groups: `(tabs)` for the five roots.
- The root `Stack` has `headerShown: false`; screens render their own `AppBar`.
- Tab layout uses a custom `tabBar` component for the pill/label design.
- Hide the tab bar on non-tab routes automatically because they live outside `(tabs)`.
- Search and notifications use `presentation: 'modal'`.
- Booking routes live under `booking/[movieId]`; use a nested `_layout.tsx` if a shared shell is helpful.
- Use `router.replace` for success and for guards; use `router.push` for forward steps.
- Deep links are handled by Expo Router automatically; add guards in the screens.

---

## 8. Performance

- Virtualize every list: `FlatList`, `SectionList`, horizontal `FlatList`. No `ScrollView` around a `FlatList`.
- Use `expo-image` with `cachePolicy="memory-disk"`, `transition={150}`, and a placeholder.
- Use `getItemLayout` for fixed-height rows where possible.
- Memoize heavy components (`MovieCard`, `Seat`, `CinemaCard`) with `React.memo`.
- Avoid inline objects/functions in list renderers where it causes re-renders; use `useCallback`.
- Keep the splash overlay mounted ≤ 1.8 s.
- Preload the first hero image and fonts.
- Use `React.startTransition` for filter changes if needed.
- Target 60 fps; test on a mid-range Android device.
- Use `expo-image` `priority="high"` for the first hero.
- Do not animate layout properties.
- Avoid nested `VirtualizedList` warnings; compose with section data.

---

## 9. Error handling

- A root `ErrorBoundary` shows a calm fallback: “Something went wrong” + `Reload`.
- Section-level errors use `ErrorBanner`, not a full-screen crash.
- The repository catches mock errors and returns typed results; screens decide the UI.
- Payment failures are never dead ends; always offer retry.
- Log errors only in dev; do not log card data.

---

## 10. Tooling and scripts

Keep the existing scripts:

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "lint": "eslint \"**/*.{js,jsx,ts,tsx}\" && prettier -c \"**/*.{js,jsx,ts,tsx,json}\"",
    "format": "eslint \"**/*.{js,jsx,ts,tsx}\" --fix && prettier \"**/*.{js,jsx,ts,tsx,json}\" --write",
    "typecheck": "tsc --noEmit"
  }
}
```

- Add `typecheck` for CI and local use.
- Run `npm run lint` and `npx tsc --noEmit` before every merge.
- Optional: add `jest-expo` + `@testing-library/react-native` for unit tests of pricing, dates, and store selectors. This is a dev dependency, not a runtime UI dependency. If added, test:
  - `linePriceMinor`, `promoDiscountMinor`, `totalMinor`.
  - Seat max rule.
  - Ticket idempotency.
  - Date/showtime filtering.
  - Route guards.

---

## 11. Coding conventions

- TypeScript strict; no `any`. Use `unknown` + narrowing at boundaries.
- Named exports for components and hooks; default exports for routes (Expo Router requirement).
- Co-locate screen-specific components under the feature folder if they are not reused.
- Use the `Text` wrapper, not raw `Text`, so type tokens are applied.
- Use `PressableScale` for cards, not `TouchableOpacity`.
- Use `useTheme()` for dynamic colors that cannot be expressed as a token class; prefer token classes.
- No hard-coded hex values outside `tokens.ts`, `global.css`, and asset files.
- No magic numbers for spacing/radius; use the scale.
- Accessibility props are required for icon-only controls.
- Keep components under ~200 lines; split when a screen grows.
- Comments explain “why”, not “what”.
- Do not add a dependency without updating this document and `17-decisions.md`.

---

## 12. Migration from the starter

Phase 0 replaced the starter shell. Current state:

- `src/app/_layout.tsx` is the provider stack: gesture root, safe area, theme, font gate, root stack.
- `src/app/(tabs)/` holds the five tabs with themed labels and Ionicons.
- `src/store/preferences.ts` holds the appearance override (in-memory until Phase 3 persistence).
- `src/theme/` holds tokens, typography, motion, splash, the provider, and the font gate.
- `src/global.css` and `tailwind.config.js` carry the semantic color variables.
- `app.json` uses `userInterfaceStyle: "automatic"`, the plum splash, and a plum adaptive icon.
- `assets/splash.png` is the canonical 660×900 lockup; `assets/brand/` holds the mark and wordmark.
- The bear store, the starter `example/` folder, and the placeholder screens are removed.

Remaining migration steps:

1. Build `SplashOverlay` and the Home shell (Phase 1).
2. Add the component vocabulary (Phase 2).
3. Add the repository, hooks, and the four data stores (Phase 3).
4. Implement the screens in roadmap order (Phases 4–6).
5. Replace the temporary wordmark with final brand art before release (D26).

---

## 13. Architecture acceptance

- [ ] Root provider tree matches the spec.
- [ ] Five tabs, no drawer.
- [ ] Theme switches automatically and via the Account override.
- [ ] No hard-coded colors outside tokens.
- [ ] All data goes through the repository.
- [ ] All money/dates are centralized.
- [ ] All lists are virtualized.
- [ ] The splash overlay is above the navigator and unmounts after the timeline.
- [ ] `app.json` is updated for automatic appearance and the correct splash/icon.
- [ ] `npm run lint` and `npx tsc --noEmit` pass.
- [ ] Only the approved dependencies are added.

# 10 — Splash and Motion

The splash is Joko’s signature moment. It must feel like the plum field opens up into Home, not like a loading screen that disappears.

This document specifies the choreography, the asset contract, the implementation, and the fallbacks. It is intentionally precise: a logo jump or a white frame is a failure.

---

## 1. Current state and what must change

- `joko-screens/old/Splash Screen - 1.jpg` is the canonical first frame: full-bleed `#280056`, white popcorn mark centered, “Joko” wordmark below.
- `Splash Screen - 2.jpg` is the same composition with a larger mark. Treat it as the expanded frame, not a second screen.
- `assets/splash.png` is currently **wrong**: a white image with a small purple popcorn roundel and no wordmark. It must be replaced before the native splash can match the overlay.
- The app currently forces light mode and has no splash overlay. Both change.

---

## 2. Asset contract

### 2.1 Required assets

| Asset | Format | Size | Use |
|---|---|---|---|
| `assets/splash.png` | PNG, transparent lockup | 660×900 (3x of 220×300) | Native splash image, centered on `#280056` |
| `assets/brand/popcorn.png` | PNG, transparent | 3x of 92×92 | React overlay mark |
| `assets/brand/wordmark.png` | PNG, transparent | 3x of 168×48 | Splash wordmark and Home header |
| `assets/brand/wordmark-small.png` | PNG, transparent | 3x of 96×28 | Home header if needed |
| `assets/brand/icon.png` | PNG | 1024×1024 | App icon |
| `assets/brand/adaptive-icon.png` | PNG | 1024×1024, safe zone | Android adaptive icon |

### 2.2 Native splash configuration

```json
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
```

- The native image is the **composite lockup**: popcorn + wordmark, exactly positioned as in the React overlay’s first frame.
- `imageWidth` is the logical width of the composite image. The overlay must use the same logical size and position.
- Background is `#280056` in both schemes. The splash is the one place that does not switch to dark surfaces.
- The app icon and adaptive icon background should be `#280056`, not white. Update `app.json`:
  - `android.adaptiveIcon.backgroundColor`: `#280056`.
  - `userInterfaceStyle`: `"automatic"`.

### 2.3 Shared layout contract

Create `src/theme/splash.ts`:

```ts
export const SPLASH = {
  background: '#280056',
  // Logical design canvas used to position the native image and the overlay.
  canvas: { width: 390, height: 844 },
  lockup: {
    // Center of the composite lockup, in canvas coordinates.
    centerX: 195,
    centerY: 422,
    width: 220,
    height: 300,
  },
  popcorn: {
    size: 92,
    // Offset from the lockup center, in canvas coordinates.
    offsetY: -52,
  },
  wordmark: {
    width: 168,
    height: 48,
    offsetY: 64,
  },
} as const;
```

The overlay renders:

```
<View style={StyleSheet.absoluteFill, backgroundColor: SPLASH.background}>
  <Animated.View style={markGroup}>
    <Animated.Image source={popcorn} style={{ width: 92, height: 92, transform: [{ translateY: popcornY }] }} />
    <Animated.Image source={wordmark} style={{ width: 168, height: 48, transform: [{ translateY: wordmarkY }] }} />
  </Animated.View>
</View>
```

- The group is centered at `(centerX, centerY)` using absolute positioning and `transform`.
- The popcorn sits at `offsetY -52`; the wordmark at `+64`.
- The native composite asset is exported from the same layout so the handoff is pixel-identical.
- If the native image cannot be made to match, use a **plain plum native background** (no image) and hold it until the React overlay has laid out. This avoids a double-logo jump; the trade-off is a brief plum field before the mark appears. The composite approach is preferred.

---

## 3. Choreography

Total: **1.6–1.8 s** on cold start. The splash does not fade out; it expands.

| Time | Phase | What happens |
|---|---|---|
| 0 ms | Native handoff | Native splash visible. Mount the React overlay above the navigator. Hide the native splash only after the overlay has laid out (`onLayout` + `requestAnimationFrame`). |
| 0–300 ms | Hold | Nothing moves. Preload fonts, first images, and Home data. No spinner. |
| 300–950 ms | Expand | Mark group scales `1 → 1.55` with `cubic-bezier(0.2, 0, 0, 1)`. Popcorn rises 6 dp; wordmark drops 4 dp. A radial glow in `#430486` grows behind the mark (`opacity 0 → 0.35`, `scale 0.8 → 1.4`). Light haptic at 300 ms. |
| 950–1250 ms | Reveal | Plum field scales to `1.08` while fading to 0. Home underneath scales `0.96 → 1` and fades in. Wordmark travels from center to the Home header slot (20 dp gutter), settling at its normal size. Popcorn fades out 950–1100 ms. |
| 1250–1700 ms | Settle | Home content staggers in: hero 0 ms, hero CTA/dots 60 ms, quick filters 120 ms, first rail 180 ms, remaining rails 240 ms. Each: `translateY 16 → 0`, `opacity 0 → 1`, 420 ms. |

### 3.1 Easing

- Expand: `cubic-bezier(0.2, 0, 0, 1)`.
- Reveal: `cubic-bezier(0.2, 0, 0, 1)`.
- Settle: `cubic-bezier(0.2, 0, 0, 1)`.
- Wordmark travel: `cubic-bezier(0.2, 0, 0, 1)`, 300 ms.
- Glow: 650 ms, ease-out.
- Fade of plum field: 300 ms, ease-out.

### 3.2 What not to animate

- No width, height, top, left, margin, or padding.
- No layout animation.
- No bounce except the splash mark’s subtle scale; no spring overshoot on the wordmark.
- No white frame between native and React.

---

## 4. Implementation

### 4.1 Root layout order

```
GestureHandlerRootView
  SafeAreaProvider
    ThemeProvider
      Queryless data bootstrap (fonts, market, first images)
        <Stack />
        <SplashOverlay />   ← absolute, above the navigator
        <StatusBar style="light" />
```

- The Stack mounts Home underneath the overlay from the start, so the reveal has something to show.
- The overlay is `pointerEvents="none"` from the start. Interaction is enabled when the reveal begins (~1250 ms).
- The overlay unmounts at ~1700 ms, or after the settle completes.
- Run once per cold start. Use a module-level `hasPlayedSplash` flag, not component state, so Fast Refresh and re-renders do not replay it.

### 4.2 Handoff

```ts
const onLayout = useCallback(() => {
  if (hiddenRef.current) return;
  hiddenRef.current = true;
  requestAnimationFrame(() => {
    SplashScreen.hideAsync().catch(() => {});
    startAnimation();
  });
}, []);
```

- The overlay’s root `View` calls `onLayout`.
- `SplashScreen.preventAutoHideAsync()` is called at module scope before the component mounts.
- Fonts and the first Home data are prefetched during the hold. Do not block the animation on network data; use local mock data so the hold is always 300 ms.
- If fonts fail, use the system fallback and continue; never hang on the splash.

### 4.3 Shared values

```ts
const progress = useSharedValue(0);       // 0 → 1 master timeline
const markScale = useSharedValue(1);
const popcornY = useSharedValue(0);
const wordmarkY = useSharedValue(0);
const glowOpacity = useSharedValue(0);
const fieldScale = useSharedValue(1);
const fieldOpacity = useSharedValue(1);
const homeScale = useSharedValue(0.96);
const homeOpacity = useSharedValue(0);
```

Use `withTiming`/`withDelay` sequences, or a single `withTimeline`-style sequence. Keep all animations on the UI thread.

### 4.4 Wordmark travel

1. The Home header renders an invisible wordmark slot with `onLayout` and `ref.measureInWindow`.
2. At the reveal phase, compute the target position in window coordinates.
3. The overlay wordmark animates from its centered position to the target:
   - `translateX`, `translateY`, `scale` (from 1.55 to 1), and `opacity` if needed.
4. The Home header wordmark is hidden (`opacity: 0`) until the overlay wordmark lands, then cross-fades in over 80 ms.
5. If measurement fails, skip the travel and cross-fade the header wordmark in at 1250 ms. Never leave two wordmarks visible.

### 4.5 Home content stagger

- Use a `SplashRevealContext` with `revealed: boolean`.
- Home sections read `revealed` and animate in once.
- Stagger only on first mount, not on scroll or tab return.
- Max 6 staggered items; remaining content appears with the group.
- Reduced motion: no translateY; opacity only, 200 ms.

### 4.6 Deep links

- If the app opens via a deep link, do not force Home.
- Keep the splash expansion as a background reveal; navigate to the target underneath.
- The overlay still unmounts after the timeline; it must not block the deep link.
- If the target is a booking screen and the draft is invalid, show the graceful redirect from `04-navigation-and-ia.md`.

### 4.7 Warm resume

- The splash plays once per cold start.
- On app resume, show no splash. If the OS killed the app, that is a cold start and the splash plays.
- Do not replay on tab switches, navigation, or Fast Refresh.

### 4.8 Reduced motion

`useReducedMotion()` path:

- 200 ms cross-fade from plum to Home.
- No scale, no travel, no glow animation.
- Same order: native → overlay → Home.
- The wordmark appears in the header at the start of the fade; the popcorn fades out.
- Haptics disabled.

---

## 5. Timing diagram

```
0        300        950       1250                1700
|--hold--|--expand--|--reveal--|------settle--------|
native    scale 1→1.55         field 1→1.08→0
handoff   popcorn -6            home 0.96→1
          wordmark +4           wordmark travels
          glow 0→0.35           popcorn fades
          haptic light          interaction on
```

---

## 6. Motion system

### 6.1 Tokens

| Token | Duration | Easing | Use |
|---|---|---|---|
| `micro` | 120 ms | ease-out | Press, tab cross-fade, chip select |
| `short` | 200 ms | cubic-bezier(0.2, 0, 0, 1) | Scrim, small fades |
| `medium` | 320 ms | cubic-bezier(0.2, 0, 0, 1) | Sheets, success check |
| `long` | 480 ms | cubic-bezier(0.2, 0, 0, 1) | Page/section entrance |
| `splash` | 300–1700 ms | see above | Cold start |

### 6.2 Patterns

- **Press:** scale 0.97 + opacity 0.9, 120 ms. No iOS ripple; Android ripple on buttons.
- **Sheet:** translateY spring (`damping 22`, `stiffness 200`); scrim fade 200 ms.
- **Screen push:** native stack slide from right (iOS), fade-through (Android). No custom full-screen transition.
- **Tab switch:** cross-fade 120 ms; no horizontal slide.
- **Seat select:** scale 0.9 → 1, 120 ms; check badge fades in; light haptic.
- **Success check:** scale 0.9 → 1 + opacity 0 → 1, 320 ms; radial pulse 600 ms; medium haptic.
- **List entrance:** only on first mount, 24 ms stagger, max 6 items; never on scroll.
- **Skeleton shimmer:** 1.2 s loop, opacity 0.4 → 0.8; disabled under reduced motion (static `surface+1`).
- **Toast:** translateY 12 → 0 + opacity, 200 ms; out 150 ms.

### 6.3 Haptics

| Event | Haptic |
|---|---|
| Splash expand | light |
| Seat select/deselect | light |
| Max seats | warning |
| Continue to next step | light |
| Payment success | success/medium |
| Payment failure | error |
| Pull-to-refresh threshold | light (optional) |

Use `expo-haptics`. Guard with a user preference and `useReducedMotion()`.

### 6.4 Performance

- Animate only transform and opacity.
- Use `useAnimatedStyle` and shared values; no `setState` per frame.
- Keep the splash overlay mounted for at most 1.8 s.
- Preload the hero image and fonts during the hold.
- Avoid re-rendering Home during the splash: use context + shared values, not prop drilling.
- Target 60 fps; test on a mid-range Android device.
- Use `expo-image` caching and `priority="high"` for the first hero.

### 6.5 Reduced motion globally

- `useReducedMotion()` from Reanimated.
- Replace transforms with fades.
- Disable auto-advancing carousels.
- Disable skeleton shimmer.
- Disable haptics.
- Keep durations ≤ 200 ms.

---

## 7. Splash acceptance

- [ ] Native splash and React overlay use the same asset, size, and vertical position.
- [ ] No white frame, no logo jump, no double logo on a 60 fps recording.
- [ ] Cold start to interactive Home ≤ 1.8 s on a mid-range device.
- [ ] Warm resume shows no splash.
- [ ] Deep links are not blocked; the splash plays as a background reveal.
- [ ] Reduced motion is a clean 200 ms cross-fade.
- [ ] The wordmark lands in the Home header without a duplicate.
- [ ] Home content staggers once, not on scroll or tab return.
- [ ] The overlay is `pointerEvents="none"` and interaction is enabled at ~1250 ms.
- [ ] No spinner, no generic logo animation, no replacement of the popcorn identity.
- [ ] `assets/splash.png` is the canonical transparent lockup on the plum background, not the current white image.
- [ ] `app.json` uses `userInterfaceStyle: "automatic"` and a plum adaptive icon background.

---

## 8. Motion acceptance (global)

- [ ] No animation of width/height/top/left.
- [ ] No scroll-jacking or decorative bounce.
- [ ] Sheets use the specified spring and scrim.
- [ ] Tab switches cross-fade.
- [ ] Haptics respect the preference and reduced motion.
- [ ] Skeleton shimmer stops under reduced motion.
- [ ] Every animation has a reduced-motion fallback.

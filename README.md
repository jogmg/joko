# Joko

A seat-reservation mobile app for discovering trending films, choosing a cinema and showtime, picking seats on a theatre map, paying, and keeping a ticket.

Built with Expo SDK 56, React Native, TypeScript, Expo Router, NativeWind, Reanimated, and Zustand.

## Documentation

The implementation plan lives in [`docs/`](./docs/README.md). Start with the index, then read the product brief and UI audit before touching code.

- [Docs index](./docs/README.md)
- [Product brief](./docs/01-product-brief.md)
- [UI audit and decisions](./docs/02-ui-audit.md)
- [Design system](./docs/03-design-system.md)
- [Navigation and IA](./docs/04-navigation-and-ia.md)
- [Booking flow](./docs/07-booking-flow.md)
- [Splash and motion](./docs/10-splash-and-motion.md)
- [Roadmap](./docs/16-roadmap.md)

## Status

The repo is currently a minimal Expo Router starter. The docs describe the target app; implementation begins with Phase 0 in the roadmap.

## Get started

```bash
npm install
npx expo start
```

Then open the app in a development build, Android emulator, or iOS simulator.

## Scripts

```bash
npm run start      # start the dev server
npm run android    # run on Android
npm run ios        # run on iOS
npm run lint       # eslint + prettier check
npm run format     # eslint + prettier fix
```

## Project shape

```
src/
  app/        Expo Router routes
  components/ reusable UI
  data/       typed mock data + repository
  hooks/      data and UI hooks
  services/   payment adapter
  store/      Zustand stores
  theme/      tokens, typography, motion, splash contract
docs/         product, design, and implementation plans
joko-screens/ reference mockups (old and new)
```

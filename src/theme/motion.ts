/**
 * Motion tokens. Source of truth: docs/10-splash-and-motion.md §6.
 *
 * Durations are milliseconds. Easing tuples are for Reanimated's
 * `Easing.bezier(...)`; keep this module free of runtime dependencies so it can
 * be imported from tests and the splash contract.
 */

export const duration = {
  micro: 120,
  short: 200,
  medium: 320,
  long: 480,
} as const;

export type DurationToken = keyof typeof duration;

/** Standard decelerating curve used across the app. */
export const easeStandard = [0.2, 0, 0, 1] as const;

export const easing = {
  /** Press, chip select, tab cross-fade. */
  micro: 'ease-out',
  /** Scrims, small fades. */
  short: easeStandard,
  /** Sheets, success check. */
  medium: easeStandard,
  /** Page and section entrances. */
  long: easeStandard,
} as const;

export const springs = {
  /** Bottom sheets: damping 22, stiffness 200. */
  sheet: { damping: 22, stiffness: 200 },
} as const;

/** Splash timeline in milliseconds. See docs/10-splash-and-motion.md §5. */
export const splashTimeline = {
  holdStart: 0,
  holdEnd: 300,
  expandStart: 300,
  expandEnd: 950,
  revealStart: 950,
  revealEnd: 1250,
  settleStart: 1250,
  settleEnd: 1700,
  /** Interaction is enabled when the reveal begins. */
  interactiveAt: 1250,
  /** Hard upper bound for the overlay mount. */
  unmountAt: 1750,
} as const;

/** Stagger applied to the first Home sections during the settle phase. */
export const settleStagger = 60;
export const settleItemDuration = 420;
export const settleMaxItems = 6;

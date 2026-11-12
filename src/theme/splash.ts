/**
 * Shared splash layout contract. Source of truth:
 * docs/10-splash-and-motion.md §2.3.
 *
 * The native splash image and the React overlay must be positioned from the
 * same numbers, or the handoff produces a visible logo jump.
 */

export const SPLASH = {
  background: '#280056',
  /** Logical design canvas used to position the native image and the overlay. */
  canvas: { width: 390, height: 844 },
  lockup: {
    /** Center of the composite lockup, in canvas coordinates. */
    centerX: 195,
    centerY: 422,
    width: 220,
    height: 300,
  },
  popcorn: {
    size: 92,
    /** Offset from the lockup center, in canvas coordinates. */
    offsetY: -52,
  },
  wordmark: {
    width: 168,
    height: 48,
    offsetY: 64,
  },
} as const;

/** Native splash `imageWidth`; must match `SPLASH.lockup.width`. */
export const SPLASH_IMAGE_WIDTH = SPLASH.lockup.width;

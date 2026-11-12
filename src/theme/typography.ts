/**
 * Typography tokens. Source of truth: docs/03-design-system.md §4.
 *
 * `type` is the canonical scale. `fonts` maps weights to the loaded Plus
 * Jakarta Sans families; React Native needs the family per weight rather than
 * `fontWeight` on Android.
 */
import type { TextStyle } from 'react-native';

export const fonts = {
  400: 'PlusJakartaSans_400Regular',
  500: 'PlusJakartaSans_500Medium',
  600: 'PlusJakartaSans_600SemiBold',
  700: 'PlusJakartaSans_700Bold',
  800: 'PlusJakartaSans_800ExtraBold',
} as const;

export type FontWeightToken = keyof typeof fonts;

export const type = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: '800', letterSpacing: -0.96 },
  h1: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.56 },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.44 },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '600', letterSpacing: -0.18 },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400', letterSpacing: 0 },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600', letterSpacing: 0 },
  bodyS: { fontSize: 13, lineHeight: 18, fontWeight: '400', letterSpacing: 0 },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 0.12 },
  caption: { fontSize: 11, lineHeight: 14, fontWeight: '500', letterSpacing: 0.22 },
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.88,
    textTransform: 'uppercase',
  },
} as const satisfies Record<string, TextStyle>;

export type TypeToken = keyof typeof type;

/** Font family for a weight token, or the regular family as a fallback. */
export function fontFamilyFor(weight: TextStyle['fontWeight']): string {
  const parsed = Number(weight);
  if (parsed >= 800) return fonts[800];
  if (parsed >= 700) return fonts[700];
  if (parsed >= 600) return fonts[600];
  if (parsed >= 500) return fonts[500];
  return fonts[400];
}

/** Resolved text style for a type token, including the matching font family. */
export function typeStyle(token: TypeToken): TextStyle {
  const { fontWeight, ...rest } = type[token];
  // The family file already encodes the weight; passing fontWeight as well can
  // make Android synthesize a second bold or fall back to the system face.
  return { ...rest, fontFamily: fontFamilyFor(fontWeight) };
}

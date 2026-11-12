/**
 * Canonical design tokens for Joko.
 *
 * Source of truth: docs/03-design-system.md.
 * Do not introduce colors outside these ramps. Screens consume the semantic
 * theme, not the raw palette.
 */

export const palette = {
  primary: {
    0: '#000000',
    10: '#280056',
    20: '#430486',
    30: '#5A299C',
    40: '#7445B7',
    50: '#8E5FD1',
    60: '#A879ED',
    70: '#C196FF',
    80: '#D8BAFF',
    90: '#EDDCFF',
    95: '#F8EDFE',
    99: '#FFFBFF',
    100: '#FFFBFF',
  },
  secondary: {
    0: '#000000',
    10: '#1F182A',
    20: '#362D40',
    30: '#4C4358',
    40: '#645B70',
    50: '#7D7489',
    60: '#988CA4',
    70: '#B3A7BF',
    80: '#CFC2DC',
    90: '#EBDDF7',
    95: '#F8EDFE',
    99: '#FFFBFF',
    100: '#FFFBFF',
  },
  tertiary: {
    0: '#000000',
    10: '#311019',
    20: '#4A252D',
    30: '#643A44',
    40: '#80525C',
    50: '#9C6A75',
    60: '#B7848D',
    70: '#D59DA8',
    80: '#F1B7C3',
    90: '#FFD8E0',
    95: '#FFECEE',
    99: '#FFFBFF',
    100: '#FFFBFF',
  },
  error: {
    0: '#000000',
    10: '#410102',
    20: '#690005',
    30: '#93000A',
    40: '#BA1A1A',
    50: '#DE372F',
    60: '#FF544A',
    70: '#FF897D',
    80: '#FEB4AB',
    90: '#FFDAD7',
    95: '#FFEDEB',
    99: '#FFFBFF',
    100: '#FFFBFF',
  },
  neutral: {
    0: '#000000',
    10: '#1D1B1E',
    20: '#312F34',
    30: '#48464B',
    40: '#625D61',
    50: '#7B767A',
    60: '#948F95',
    70: '#AFAAAE',
    80: '#CAC5CB',
    90: '#E7E0E7',
    95: '#F5EEF5',
    99: '#FFFBFF',
    100: '#FFFBFF',
  },
  neutralVariant: {
    0: '#000000',
    10: '#1D1A21',
    20: '#322F36',
    30: '#4B454F',
    40: '#625C66',
    50: '#7B757F',
    60: '#958D98',
    70: '#B0A8B3',
    80: '#CBC3CE',
    90: '#E8E0EB',
    95: '#F6EEF9',
    99: '#FFFBFF',
    100: '#FFFBFF',
  },
} as const;

export interface Theme {
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
}

export const lightTheme: Theme = {
  background: '#FFFBFF',
  onBackground: '#1D1B1E',
  surface: '#FFFBFF',
  onSurface: '#1D1B1E',
  surfaceVariant: '#E8E0EB',
  onSurfaceVariant: '#4B454F',
  outline: '#7B757F',
  outlineVariant: '#CBC3CE',
  primary: '#7445B7',
  onPrimary: '#FFFBFF',
  primaryContainer: '#EDDCFF',
  onPrimaryContainer: '#280056',
  brand: '#280056',
  onBrand: '#FFFBFF',
  secondary: '#645B70',
  secondaryContainer: '#EBDDF7',
  onSecondaryContainer: '#1F182A',
  tertiary: '#80525C',
  tertiaryContainer: '#FFD8E0',
  onTertiaryContainer: '#311019',
  error: '#BA1A1A',
  errorContainer: '#FFDAD7',
  onErrorContainer: '#410102',
  surface1: '#F4EEF7',
  surface2: '#EEE7F1',
  surface3: '#E7DFEC',
  surface4: '#E5DDEB',
  surface5: '#E1D8E7',
};

export const darkTheme: Theme = {
  background: '#1D1B1E',
  onBackground: '#E7E0E7',
  surface: '#1D1B1E',
  onSurface: '#CAC5CB',
  surfaceVariant: '#4B454F',
  onSurfaceVariant: '#CBC3CE',
  outline: '#958D98',
  outlineVariant: '#4B454F',
  primary: '#D8BAFF',
  onPrimary: '#430486',
  primaryContainer: '#5A299C',
  onPrimaryContainer: '#EDDCFF',
  brand: '#280056',
  onBrand: '#FFFBFF',
  secondary: '#CFC2DC',
  secondaryContainer: '#4C4358',
  onSecondaryContainer: '#EBDDF7',
  tertiary: '#F1B7C3',
  tertiaryContainer: '#643A44',
  onTertiaryContainer: '#FFD8E0',
  error: '#FEB4AB',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD7',
  surface1: '#262329',
  surface2: '#2C2830',
  surface3: '#322C37',
  surface4: '#332E39',
  surface5: '#37313E',
};

/** Light elevation overlays, exported for surfaces that need an explicit level. */
export const lightSurfaces = {
  surface: lightTheme.surface,
  surface1: lightTheme.surface1,
  surface2: lightTheme.surface2,
  surface3: lightTheme.surface3,
  surface4: lightTheme.surface4,
  surface5: lightTheme.surface5,
} as const;

/** Dark elevation overlays, exported for surfaces that need an explicit level. */
export const darkSurfaces = {
  surface: darkTheme.surface,
  surface1: darkTheme.surface1,
  surface2: darkTheme.surface2,
  surface3: darkTheme.surface3,
  surface4: darkTheme.surface4,
  surface5: darkTheme.surface5,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  sheet: 28,
  full: 999,
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

/** Screen gutter, section gap, and card padding from the layout scale. */
export const layout = {
  gutter: spacing[5],
  sectionGap: spacing[7],
  cardPadding: spacing[4],
  rowGap: spacing[3],
  iconGap: spacing[2],
  minTouchTarget: 44,
  preferredTouchTarget: 48,
  phone: { width: 390, height: 844 },
  contentMaxWidth: 720,
  tabletBreakpoint: 600,
} as const;

/**
 * NativeWind CSS variables derived from a semantic theme.
 *
 * Values are space-separated RGB channels so Tailwind can apply opacity with
 * `rgb(var(--token) / <alpha-value>)`.
 */
export function themeToCssVars(theme: Theme): Record<string, string> {
  return {
    '--background': hexToRgbChannels(theme.background),
    '--on-background': hexToRgbChannels(theme.onBackground),
    '--surface': hexToRgbChannels(theme.surface),
    '--on-surface': hexToRgbChannels(theme.onSurface),
    '--surface-variant': hexToRgbChannels(theme.surfaceVariant),
    '--on-surface-variant': hexToRgbChannels(theme.onSurfaceVariant),
    '--outline': hexToRgbChannels(theme.outline),
    '--outline-variant': hexToRgbChannels(theme.outlineVariant),
    '--primary': hexToRgbChannels(theme.primary),
    '--on-primary': hexToRgbChannels(theme.onPrimary),
    '--primary-container': hexToRgbChannels(theme.primaryContainer),
    '--on-primary-container': hexToRgbChannels(theme.onPrimaryContainer),
    '--brand': hexToRgbChannels(theme.brand),
    '--on-brand': hexToRgbChannels(theme.onBrand),
    '--secondary': hexToRgbChannels(theme.secondary),
    '--secondary-container': hexToRgbChannels(theme.secondaryContainer),
    '--on-secondary-container': hexToRgbChannels(theme.onSecondaryContainer),
    '--tertiary': hexToRgbChannels(theme.tertiary),
    '--tertiary-container': hexToRgbChannels(theme.tertiaryContainer),
    '--on-tertiary-container': hexToRgbChannels(theme.onTertiaryContainer),
    '--error': hexToRgbChannels(theme.error),
    '--error-container': hexToRgbChannels(theme.errorContainer),
    '--on-error-container': hexToRgbChannels(theme.onErrorContainer),
    '--surface-1': hexToRgbChannels(theme.surface1),
    '--surface-2': hexToRgbChannels(theme.surface2),
    '--surface-3': hexToRgbChannels(theme.surface3),
    '--surface-4': hexToRgbChannels(theme.surface4),
    '--surface-5': hexToRgbChannels(theme.surface5),
  };
}

function hexToRgbChannels(hex: string): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

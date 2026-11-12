import { createContext, useEffect, useMemo } from 'react';
import { useColorScheme, View } from 'react-native';
import { vars } from 'nativewind';
import * as SystemUI from 'expo-system-ui';
import { darkTheme, lightTheme, themeToCssVars, type Theme } from './tokens';
import type { SchemePreference } from '@/store/preferences';

export interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  scheme: SchemePreference;
  setScheme: (scheme: SchemePreference) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  scheme: SchemePreference;
  setScheme: (scheme: SchemePreference) => void;
}

/**
 * Resolves the active theme, exposes it through context, and publishes the
 * semantic colors as NativeWind CSS variables so token classes work in both
 * schemes and under a manual override.
 */
export function ThemeProvider({ children, scheme, setScheme }: ThemeProviderProps) {
  const system = useColorScheme();
  const isDark = scheme === 'system' ? system === 'dark' : scheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const cssVars = useMemo(() => vars(themeToCssVars(theme)), [theme]);

  useEffect(() => {
    // Keeps the native root from flashing the wrong color between screens.
    SystemUI.setBackgroundColorAsync(theme.background).catch(() => {});
  }, [theme.background]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, isDark, scheme, setScheme }),
    [theme, isDark, scheme, setScheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={[cssVars, { flex: 1, backgroundColor: theme.background }]}>{children}</View>
    </ThemeContext.Provider>
  );
}

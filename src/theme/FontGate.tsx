import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans/400Regular';
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';
import { SPLASH } from './splash';

interface FontGateProps {
  children: React.ReactNode;
}

/**
 * Holds the tree until Plus Jakarta Sans is ready, then renders children.
 *
 * A failed load must not trap the app behind the splash: on error we continue
 * with the system sans fallback.
 */
export function FontGate({ children }: FontGateProps) {
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  if (!loaded && !error) {
    return <View style={{ flex: 1, backgroundColor: SPLASH.background }} />;
  }

  return <>{children}</>;
}

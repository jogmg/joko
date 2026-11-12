import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '@/global.css';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { FontGate } from '@/theme/FontGate';
import { useTheme } from '@/theme/useTheme';
import { usePreferencesStore } from '@/store/preferences';

function RootNavigator() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  const scheme = usePreferencesStore((state) => state.scheme);
  const setScheme = usePreferencesStore((state) => state.setScheme);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider scheme={scheme} setScheme={setScheme}>
          <FontGate>
            <RootNavigator />
          </FontGate>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

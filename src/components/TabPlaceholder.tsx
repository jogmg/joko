import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/useTheme';
import { fonts, typeStyle } from '@/theme/typography';
import { layout, radius, spacing } from '@/theme/tokens';

interface TabPlaceholderProps {
  title: string;
  description: string;
  /** Optional label rendered above the title. */
  eyebrow?: string;
}

/**
 * Temporary Phase 0 surface. It proves the theme, fonts, and tab shell render
 * before the real screens land, and disappears as each tab is implemented.
 */
export function TabPlaceholder({ title, description, eyebrow }: TabPlaceholderProps) {
  const { theme, isDark, scheme } = useTheme();
  const swatches = [
    theme.brand,
    theme.primary,
    theme.primaryContainer,
    theme.tertiaryContainer,
    theme.surface2,
    theme.surfaceVariant,
  ];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: layout.gutter,
          paddingTop: spacing[8],
          paddingBottom: spacing[10],
          gap: spacing[4],
        }}>
        {eyebrow ? (
          <Text
            style={[
              typeStyle('overline'),
              { color: theme.onSurfaceVariant, fontFamily: fonts[700] },
            ]}>
            {eyebrow}
          </Text>
        ) : null}

        <Text style={[typeStyle('display'), { color: theme.onBackground }]}>{title}</Text>

        <Text style={[typeStyle('body'), { color: theme.onSurfaceVariant }]}>{description}</Text>

        <View
          style={{
            marginTop: spacing[6],
            padding: layout.cardPadding,
            borderRadius: radius.lg,
            backgroundColor: theme.surface1,
            gap: spacing[3],
          }}>
          <Text style={[typeStyle('label'), { color: theme.onSurfaceVariant }]}>
            {scheme === 'system'
              ? `System theme · ${isDark ? 'dark' : 'light'}`
              : `Override · ${scheme}`}
          </Text>

          <View style={{ flexDirection: 'row', gap: spacing[2] }}>
            {swatches.map((color) => (
              <View
                key={color}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.md,
                  backgroundColor: color,
                  borderWidth: 1,
                  borderColor: theme.outlineVariant,
                }}
              />
            ))}
          </View>

          <Text style={[typeStyle('bodyS'), { color: theme.onSurfaceVariant }]}>
            Phase 0 foundation. Screens arrive in the roadmap order.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

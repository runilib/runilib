import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const LIBRARIES = [
  {
    id: 'walkit',
    title: '@runilib/react-walkit',
    eyebrow: 'Guided journeys',
    description:
      'Tour flows, route-aware onboarding, tooltips, anchors, and custom native popovers.',
    route: '/walkit',
    accent: '#e8a020',
    surface: '#1d140b',
    bullets: ['Dashboard tour', 'Tooltip placements', 'Anchor API', 'Custom content'],
  },
  {
    id: 'formbridge',
    title: '@runilib/react-formbridge',
    eyebrow: 'Form platform',
    description:
      'Generated fields, route-based wizard flows, masks, styling patterns, resolvers, and async options.',
    route: '/formbridge',
    accent: '#60a5fa',
    surface: '#0f172a',
    bullets: ['Checkout flow', 'Cross-screen wizard', 'Masks', 'Resolvers', 'Styling'],
  },
] as const;

export function ExampleHubScreen() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={s.safe}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <StatusBar
        style="light"
        backgroundColor="#090909"
      />
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.hero}>
          <Text style={s.eyebrow}>runilib examples</Text>
          <Text style={s.title}>Open the library you want to inspect.</Text>
          <Text style={s.subtitle}>
            The example app now starts with a clean split so `react-walkit` and
            `react-formbridge` each have their own dedicated area.
          </Text>
        </View>

        <View style={s.cardList}>
          {LIBRARIES.map((library) => (
            <TouchableOpacity
              key={library.id}
              activeOpacity={0.92}
              style={[s.card, { backgroundColor: library.surface }]}
              onPress={() => router.push(library.route)}
            >
              <View style={s.cardTop}>
                <Text style={[s.cardEyebrow, { color: library.accent }]}>
                  {library.eyebrow}
                </Text>
                <View style={[s.routeBadge, { borderColor: `${library.accent}33` }]}>
                  <Text style={s.routeBadgeText}>{library.route}</Text>
                </View>
              </View>

              <Text style={s.cardTitle}>{library.title}</Text>
              <Text style={s.cardDescription}>{library.description}</Text>

              <View style={s.bulletList}>
                {library.bullets.map((bullet) => (
                  <View
                    key={bullet}
                    style={s.bulletRow}
                  >
                    <View style={[s.bulletDot, { backgroundColor: library.accent }]} />
                    <Text style={s.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>

              <View style={[s.openButton, { backgroundColor: library.accent }]}>
                <Text style={s.openButtonText}>Open examples</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#090909' },
  content: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 28, gap: 18 },
  hero: {
    backgroundColor: '#13110d',
    borderRadius: 28,
    padding: 22,
    gap: 12,
  },
  eyebrow: {
    color: '#e8a020',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#fff8ef',
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.9,
  },
  subtitle: {
    color: '#cbbba6',
    fontSize: 14,
    lineHeight: 22,
  },
  cardList: {
    gap: 16,
  },
  card: {
    borderRadius: 28,
    padding: 22,
    gap: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  routeBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  routeBadgeText: {
    color: '#d1d5db',
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  cardDescription: {
    color: '#d7dde8',
    fontSize: 14,
    lineHeight: 22,
  },
  bulletList: {
    gap: 10,
    marginTop: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  bulletText: {
    color: '#f3f4f6',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },
  openButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 6,
  },
  openButtonText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '800',
  },
});

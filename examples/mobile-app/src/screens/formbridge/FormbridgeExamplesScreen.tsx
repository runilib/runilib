import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomerCheckoutExample } from '../../components/formbridge-examples/CustomerCheckoutExample';
import { CustomMaskExamplesShowcase } from '../../components/formbridge-examples/CustomMaskExamplesShowcase';
import { FieldVariantsShowcase } from '../../components/formbridge-examples/FieldVariantsShowcase';
import { ResolverExamplesShowcase } from '../../components/formbridge-examples/ResolverExamplesShowcase';
import { StylingExamplesShowcase } from '../../components/formbridge-examples/StylingExamplesShowcase';

export function FormbridgeExamplesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={s.safe}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <StatusBar
        style="light"
        backgroundColor="#0b0f19"
      />
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.hero}>
          <View style={s.heroTop}>
            <TouchableOpacity
              style={s.ghostButton}
              onPress={() => router.replace('/')}
            >
              <Text style={s.ghostButtonText}>← Library hub</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.ghostButton}
              onPress={() => router.push('/walkit')}
            >
              <Text style={s.ghostButtonText}>Walkit</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.eyebrow}>Formbridge examples</Text>
          <Text style={s.title}>Everything related to forms now lives here.</Text>
          <Text style={s.subtitle}>
            This section gathers the route-based wizard, checkout flow, field variants,
            masks, styling overrides, and resolver demos in one dedicated place.
          </Text>

          <TouchableOpacity
            style={s.primaryButton}
            onPress={() => router.push('/formbridge/wizard/personal')}
          >
            <Text style={s.primaryButtonText}>Open cross-screen wizard</Text>
          </TouchableOpacity>
        </View>

        <View style={s.sectionCard}>
          <Text style={s.sectionEyebrow}>High level flows</Text>
          <Text style={s.sectionTitle}>
            Start with the bigger production-style demos.
          </Text>
          <Text style={s.sectionText}>
            The wizard and checkout examples are now separated from the walkit dashboard
            so people can understand `react-formbridge` without hunting through unrelated
            UI patterns.
          </Text>
          <CustomerCheckoutExample />
        </View>

        <View style={s.sectionCard}>
          <Text style={s.sectionEyebrow}>Field systems</Text>
          <Text style={s.sectionTitle}>Variants, masks, styling, and resolvers.</Text>
          <Text style={s.sectionText}>
            The rest of the examples are grouped by concern so the package behavior is
            easier to compare at a glance.
          </Text>
          <FieldVariantsShowcase />
          <CustomMaskExamplesShowcase />
          <StylingExamplesShowcase />
          <ResolverExamplesShowcase />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b0f19' },
  content: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 28, gap: 18 },
  hero: {
    backgroundColor: '#111827',
    borderRadius: 28,
    padding: 22,
    gap: 12,
  },
  heroTop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  ghostButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  ghostButtonText: {
    color: '#e2e8f0',
    fontWeight: '700',
    fontSize: 12,
  },
  eyebrow: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#eff6ff',
    fontSize: 33,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 22,
  },
  primaryButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: '#60a5fa',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 18,
    gap: 14,
  },
  sectionEyebrow: {
    color: '#93c5fd',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: '#eff6ff',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  sectionText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
  },
});

import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreateSchemaAdvancedExample } from '../../components/formbridge-examples/CreateSchemaAdvancedExample';
import { CustomerCheckoutExample } from '../../components/formbridge-examples/CustomerCheckoutExample';
import { CustomMaskExamplesShowcase } from '../../components/formbridge-examples/CustomMaskExamplesShowcase';
import { CustomStorageAdapterExample } from '../../components/formbridge-examples/CustomStorageAdapterExample';
import { FieldVariantsShowcase } from '../../components/formbridge-examples/FieldVariantsShowcase';
import { PasswordVariantsExample } from '../../components/formbridge-examples/PasswordVariantsExample';
import { PhoneVariantsExample } from '../../components/formbridge-examples/PhoneVariantsExample';
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
        style="dark"
        backgroundColor="#f4f7fc"
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
            password recipes, phone recipes, file upload demos, masks, styling overrides,
            and resolver demos in one dedicated place.
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
          <CustomStorageAdapterExample />
        </View>

        <View style={s.sectionCard}>
          <Text style={s.sectionEyebrow}>Field systems</Text>
          <Text style={s.sectionTitle}>
            Passwords, phone flows, schema rules, masks, styling, and resolvers.
          </Text>
          <Text style={s.sectionText}>
            The rest of the examples are grouped by concern so the package behavior is
            easier to compare at a glance, including one advanced `createSchema` scenario
            to exercise cross-field mobile validation.
          </Text>
          <PasswordVariantsExample />
          <PhoneVariantsExample />
          <FieldVariantsShowcase />
          <CustomMaskExamplesShowcase />
          <StylingExamplesShowcase />
          <CreateSchemaAdvancedExample />
          <ResolverExamplesShowcase />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f7fc' },
  content: { paddingHorizontal: 5, paddingTop: 16, paddingBottom: 28, gap: 5 },
  hero: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 22,
    gap: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
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
    backgroundColor: '#eff4fb',
  },
  ghostButtonText: {
    color: '#31507f',
    fontWeight: '700',
    fontSize: 12,
  },
  eyebrow: {
    color: '#2563eb',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#10203a',
    fontSize: 33,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: '#5f6f88',
    fontSize: 14,
    lineHeight: 22,
  },
  primaryButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: '#2563eb',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    gap: 14,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 22,
    elevation: 3,
  },
  sectionEyebrow: {
    color: '#2563eb',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: '#10203a',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  sectionText: {
    color: '#5f6f88',
    fontSize: 13,
    lineHeight: 20,
  },
});

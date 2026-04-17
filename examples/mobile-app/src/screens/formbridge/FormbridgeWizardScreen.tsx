import { useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { type FormSchema, field, useFormBridgeWizard } from '@runilib/react-formbridge';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  createNativeFormUi,
  formatDemoJson,
  simulateSubmitDelay,
} from '../../components/formbridge-examples/shared';

const wizardStorage = (() => {
  const store = new Map<string, string>();

  return {
    getItem: async (key: string) => store.get(key) ?? null,
    setItem: async (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: async (key: string) => {
      store.delete(key);
    },
  };
})();

const wizardUi = () => createNativeFormUi();

const WIZARD_STEPS = [
  {
    id: 'personal',
    label: 'Personal info',
    schema: {
      firstName: field.text().required('First name is required'),
      lastName: field.text().required('Last name is required'),
      email: field.email().required('Email is required'),
    } satisfies FormSchema,
    formOptions: {
      globalDefaults: wizardUi,
    },
  },
  {
    id: 'company',
    label: 'Company info',
    schema: {
      companyName: field.text().required('Company name is required'),
      role: field.text().required('Role is required'),
      workspace: field.select().options([
        { label: 'Operations workspace', value: 'ops' },
        { label: 'Revenue cockpit', value: 'revenue' },
        { label: 'Product squad', value: 'product' },
      ]),
    } satisfies FormSchema,
    formOptions: {
      globalDefaults: wizardUi,
    },
  },
  {
    id: 'review',
    label: 'Review',
    schema: {} satisfies FormSchema,
    formOptions: {
      globalDefaults: wizardUi,
    },
  },
] as const;

type WizardStepId = (typeof WIZARD_STEPS)[number]['id'];

function isWizardStepId(value: string | string[] | undefined): value is WizardStepId {
  return typeof value === 'string' && WIZARD_STEPS.some((step) => step.id === value);
}

export function FormbridgeWizardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ stepId?: string }>();
  const routeStepId = isWizardStepId(params.stepId) ? params.stepId : undefined;

  const wizard = useFormBridgeWizard([...WIZARD_STEPS], {
    stepId: routeStepId,
    initialStepId: 'personal',
    persist: {
      key: 'mobile-cross-page-wizard',
      storage: wizardStorage,
    },
    onStepChange: ({ step }) => {
      router.replace(`/formbridge/wizard/${step.id}`);
    },
    onSubmit: async (values) => {
      await simulateSubmitDelay(280);
      console.log('[@examples/mobile] cross-page wizard submit', values);
      Alert.alert('Wizard submitted', 'Payload logged to the console.');
    },
  });

  useEffect(() => {
    if (wizard.isHydrating || !wizard.currentStepId) {
      return;
    }

    if (routeStepId !== wizard.currentStepId) {
      router.replace(`/formbridge/wizard/${wizard.currentStepId}`);
    }
  }, [routeStepId, router, wizard.currentStepId, wizard.isHydrating]);

  if (wizard.isHydrating) {
    return (
      <SafeAreaView
        style={s.safe}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <StatusBar
          style="dark"
          backgroundColor="#f7f1e7"
        />
        <View style={s.loadingWrap}>
          <TouchableOpacity
            style={s.backGhost}
            onPress={() => router.replace('/formbridge')}
          >
            <Text style={s.backGhostText}>Back</Text>
          </TouchableOpacity>
          <Text style={s.eyebrow}>Cross-screen wizard</Text>
          <Text style={s.loadingTitle}>Restoring wizard state…</Text>
          <Text style={s.loadingText}>
            This demo keeps the current step and merged payload when screens remount.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!wizard.step) {
    return (
      <SafeAreaView
        style={s.safe}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <StatusBar
          style="dark"
          backgroundColor="#f7f1e7"
        />
        <View style={s.loadingWrap}>
          <TouchableOpacity
            style={s.backGhost}
            onPress={() => router.replace('/formbridge')}
          >
            <Text style={s.backGhostText}>Back</Text>
          </TouchableOpacity>
          <Text style={s.loadingText}>No wizard step is currently available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { Form, fields } = wizard.currentStep;

  return (
    <SafeAreaView
      style={s.safe}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <StatusBar
        style="dark"
        backgroundColor="#f7f1e7"
      />
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.hero}>
          <View style={s.heroTop}>
            <TouchableOpacity
              style={s.backGhost}
              onPress={() => router.replace('/formbridge')}
            >
              <Text style={s.backGhostText}>Back</Text>
            </TouchableOpacity>
            <View style={s.routeBadge}>
              <Text style={s.routeBadgeText}>Expo Router demo</Text>
            </View>
          </View>

          <Text style={s.eyebrow}>Cross-screen wizard</Text>
          <Text style={s.title}>A real multi-step flow split across screens.</Text>
          <Text style={s.subtitle}>
            The active screen comes from the route param. The wizard emits transitions,
            the router turns them into navigation, and the payload survives remounts.
          </Text>
        </View>

        <View style={s.stepStrip}>
          {wizard.visibleSteps.map((item, index) => {
            const active = item.id === wizard.currentStepId;
            const complete = wizard.completedSteps.has(item.id);

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  void wizard.goTo(index, true);
                }}
                style={[
                  s.stepPill,
                  active && s.stepPillActive,
                  complete && s.stepPillComplete,
                ]}
              >
                <Text style={[s.stepPillText, active && s.stepPillTextActive]}>
                  {index + 1}. {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={s.card}>
          <Text style={s.stepCount}>
            Step {wizard.currentStepIndex + 1} / {wizard.totalSteps}
          </Text>
          <Text style={s.stepTitle}>{wizard.step.label}</Text>

          <Form
            onSubmit={async () => {
              if (wizard.isLastStep) {
                await wizard.submit();
                return;
              }

              await wizard.next();
            }}
            style={s.form}
          >
            {'firstName' in fields && <fields.firstName />}
            {'lastName' in fields && <fields.lastName />}
            {'email' in fields && <fields.email />}
            {'companyName' in fields && <fields.companyName />}
            {'role' in fields && <fields.role />}
            {'workspace' in fields && <fields.workspace />}

            {wizard.currentStepId === 'review' ? (
              <View style={s.reviewCard}>
                <Text style={s.reviewTitle}>Ready to submit</Text>
                <Text style={s.reviewText}>
                  This review screen is another route. The JSON below is the merged wizard
                  payload restored from persistent state.
                </Text>
                <Text style={s.code}>{formatDemoJson(wizard.allValues)}</Text>
              </View>
            ) : null}

            <View style={s.footer}>
              <TouchableOpacity
                style={[s.backButton, wizard.isFirstStep && s.backButtonDisabled]}
                onPress={wizard.prev}
                disabled={wizard.isFirstStep}
              >
                <Text
                  style={[
                    s.backButtonText,
                    wizard.isFirstStep && s.backButtonTextDisabled,
                  ]}
                >
                  Back
                </Text>
              </TouchableOpacity>

              <Form.Submit>
                {wizard.isLastStep ? 'Submit wizard' : 'Save and continue'}
              </Form.Submit>
            </View>
          </Form>
        </View>

        <View style={s.sideCard}>
          <Text style={s.sideCardLabel}>Current payload</Text>
          <Text style={s.code}>{formatDemoJson(wizard.allValues)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f7f1e7',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 32,
    gap: 16,
  },
  loadingWrap: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 28,
    gap: 14,
  },
  hero: {
    backgroundColor: '#1d140b',
    borderRadius: 26,
    padding: 22,
    gap: 10,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  backGhost: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  backGhostText: {
    color: '#f6ecdd',
    fontWeight: '700',
  },
  routeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(240,165,0,0.18)',
  },
  routeBadgeText: {
    color: '#f0c36c',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  eyebrow: {
    color: '#f0c36c',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#fff7ed',
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: '#dcc9b4',
    fontSize: 14,
    lineHeight: 22,
  },
  loadingTitle: {
    color: '#1d140b',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  loadingText: {
    color: '#6a5641',
    fontSize: 14,
    lineHeight: 22,
  },
  stepStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stepPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#fffaf2',
    borderWidth: 1,
    borderColor: 'rgba(108,76,33,0.12)',
  },
  stepPillActive: {
    backgroundColor: '#1d140b',
    borderColor: '#1d140b',
  },
  stepPillComplete: {
    borderColor: 'rgba(91,191,122,0.45)',
  },
  stepPillText: {
    color: '#6a5641',
    fontWeight: '700',
    fontSize: 12,
  },
  stepPillTextActive: {
    color: '#f7f1e7',
  },
  card: {
    backgroundColor: '#fffdf8',
    borderRadius: 26,
    padding: 20,
    gap: 14,
  },
  stepCount: {
    color: '#9a6f37',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  stepTitle: {
    color: '#1d140b',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  form: {
    gap: 14,
  },
  reviewCard: {
    backgroundColor: '#f5ecdd',
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },
  reviewTitle: {
    color: '#1d140b',
    fontSize: 17,
    fontWeight: '800',
  },
  reviewText: {
    color: '#6a5641',
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  backButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#f1e7d8',
  },
  backButtonDisabled: {
    opacity: 0.45,
  },
  backButtonText: {
    color: '#1d140b',
    fontWeight: '700',
  },
  backButtonTextDisabled: {
    color: '#7f6d57',
  },
  sideCard: {
    backgroundColor: '#1d140b',
    borderRadius: 24,
    padding: 18,
    gap: 12,
  },
  sideCardLabel: {
    color: '#f0c36c',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  code: {
    color: '#f7f1e7',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Courier',
  },
});

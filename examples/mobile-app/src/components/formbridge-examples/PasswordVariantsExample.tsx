import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { field, useFormBridge } from '@runilib/react-formbridge';

import { FieldVariantCard } from './FieldVariantCard';
import { formExampleStyles as s } from './FormExamples.styles';
import { createNativeFormUi, simulateSubmitDelay } from './shared';

type PasswordVariantValues = {
  accountPassword: string;
  adminSecret: string;
  recoveryPassphrase: string;
};

const ADMIN_LEVELS = [
  { label: 'Blocked', color: '#ef4444', minScore: 0 },
  { label: 'Fragile', color: '#f97316', minScore: 1 },
  { label: 'Review', color: '#eab308', minScore: 2 },
  { label: 'Ready', color: '#22c55e', minScore: 3 },
  { label: 'High trust', color: '#14b8a6', minScore: 4 },
] as const;

function describePasswordState(value: string, error?: string): string {
  if (!value) {
    return 'empty';
  }

  if (error) {
    return 'needs work';
  }

  return `${value.length} chars`;
}

export function PasswordVariantsExample() {
  const [lastSubmission, setLastSubmission] = useState<PasswordVariantValues | null>(
    null,
  );

  const schema = useMemo(
    () => ({
      accountPassword: field
        .password('Account password')
        .required()
        .placeholder('Create the customer-facing password')
        .hint(
          'Classic signup policy with checklist, entropy, and weak-password blocking.',
        )
        .withStrengthIndicator({
          showRules: true,
          showEntropy: true,
          blockWeak: true,
          blockMsg: 'Choose a stronger account password before continuing.',
        }),
      adminSecret: field
        .password('Admin secret')
        .required()
        .placeholder('Rotate the privileged secret')
        .hint('Custom levels, custom toggle copy, and a branded readiness row.')
        .withStrengthIndicator({
          showRules: false,
          showLabel: true,
          showEntropy: false,
          blockWeak: true,
          blockMsg: 'The admin secret needs a stronger score.',
          config: {
            minAcceptableScore: 3,
          },
          levels: [...ADMIN_LEVELS],
        }),
      recoveryPassphrase: field
        .password('Recovery passphrase')
        .required()
        .min(12)
        .placeholder('Store a longer emergency passphrase')
        .hint(
          'Compact passphrase treatment with custom rule rows and a softer strength label.',
        )
        .withStrengthIndicator({
          showRules: true,
          showLabel: true,
          showEntropy: true,
          blockWeak: true,
          hideRulesWhenValid: true,
          blockMsg: 'The recovery passphrase is still too weak.',
          config: {
            minAcceptableScore: 3,
          },
        }),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalConfigs: () => {
      const baseUi = createNativeFormUi();
      const baseInputStyle =
        (baseUi.field?.styles &&
        typeof baseUi.field.styles === 'object' &&
        'input' in baseUi.field.styles
          ? baseUi.field.styles.input
          : undefined) ?? {};
      const baseRootStyle =
        (baseUi.field?.styles &&
        typeof baseUi.field.styles === 'object' &&
        'wrapper' in baseUi.field.styles
          ? baseUi.field.styles.wrapper
          : undefined) ?? {};

      return {
        ...baseUi,
        submit: {
          ...baseUi.submit,
          loadingText: 'Saving password playbook...',
        },
        field: {
          ...baseUi.field,
          styles: {
            ...baseUi.field?.styles,
            input: {
              ...(typeof baseInputStyle === 'object' ? baseInputStyle : {}),
              paddingRight: 110,
              color: '#10203a',
              borderColor: 'rgba(148, 163, 184, 0.2)',
              backgroundColor: '#ffffff',
            },
            wrapper: {
              ...(typeof baseRootStyle === 'object' ? baseRootStyle : {}),
              gap: 8,
            },
            toggle: {
              position: 'absolute',
              right: 10,
              top: 10,
              minHeight: 34,
              paddingHorizontal: 12,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: 'rgba(148, 163, 184, 0.20)',
              backgroundColor: '#ffffff',
              alignItems: 'center',
              justifyContent: 'center',
            },
            toggleText: {
              color: '#10203a',
              fontSize: 12,
              fontWeight: '700',
            },
            strengthRow: {
              gap: 10,
              marginTop: 2,
            },
            strengthBar: {
              minHeight: 6,
              borderRadius: 999,
              backgroundColor: 'rgba(148, 163, 184, 0.18)',
            },
            strengthFill: {
              minHeight: 6,
              borderRadius: 999,
            },
            strengthMeta: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
            },
            strengthLabel: {
              fontSize: 12,
              fontWeight: '700',
            },
            strengthEntropy: {
              fontSize: 11,
              color: '#64748b',
            },
            rulesList: {
              gap: 8,
            },
            ruleItem: {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: 'rgba(148, 163, 184, 0.14)',
              backgroundColor: '#ffffff',
            },
            ruleBullet: {
              width: 22,
              height: 22,
              borderRadius: 999,
              textAlign: 'center',
              textAlignVertical: 'center',
              overflow: 'hidden',
              color: '#10203a',
              backgroundColor: 'rgba(148, 163, 184, 0.16)',
              fontSize: 11,
              fontWeight: '800',
              paddingTop: 4,
            },
            ruleText: {
              flex: 1,
              color: '#20304b',
              fontSize: 12,
              lineHeight: 18,
            },
          },
        },
      };
    },
  });

  const { Form, fields, state, watchAll } = form;
  const values = watchAll();
  const healthyCount = (
    [
      ['accountPassword', values.accountPassword],
      ['adminSecret', values.adminSecret],
      ['recoveryPassphrase', values.recoveryPassphrase],
    ] as const
  ).filter(([name, value]) => Boolean(value) && !state.errors[name]).length;

  return (
    <FieldVariantCard
      familyName="Password"
      accent="#f59e0b"
      title="Strength indicators, toggle copy, and different password policies"
      description="This showcase keeps the generated password field intact while varying the UX around it. One field feels like signup, one feels like privileged admin security, and one behaves like a longer recovery passphrase."
      highlights={[
        'weak-password blocking',
        'custom toggle copy',
        'custom strength rows',
        'custom rule rendering',
      ]}
      preview={
        <>
          <Text style={s.previewValue}>{healthyCount} flows look healthy</Text>
          <Text style={s.previewText}>
            Signup:{' '}
            {describePasswordState(values.accountPassword, state.errors.accountPassword)}.
            Admin: {describePasswordState(values.adminSecret, state.errors.adminSecret)}.
            Recovery:{' '}
            {describePasswordState(
              values.recoveryPassphrase,
              state.errors.recoveryPassphrase,
            )}
            .
          </Text>
        </>
      }
      snapshot={lastSubmission ?? values}
      submittedLabel={
        lastSubmission ? 'Saved the password playbook with all three variants.' : null
      }
      footer="Use the builder for policy, then use field overrides for product voice. The same generated password field can feel like signup UX, admin security UX, or recovery UX without forking the renderer."
    >
      <Form
        onSubmit={async (submittedValues) => {
          await simulateSubmitDelay(320);
          setLastSubmission(submittedValues as PasswordVariantValues);
        }}
      >
        <fields.accountPassword />

        <fields.adminSecret
          {...{
            showPasswordText: 'Reveal',
            hidePasswordText: 'Mask',
            renderToggleContent: ({ defaultContent, revealed }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 12 }}>{revealed ? '🙈' : '👁️'}</Text>
                {typeof defaultContent === 'string' ? (
                  <Text style={{ color: '#10203a', fontSize: 12, fontWeight: '700' }}>
                    {defaultContent}
                  </Text>
                ) : (
                  defaultContent
                )}
              </View>
            ),
            renderStrengthRowContent: ({ defaultBarContent, result }) => (
              <View
                style={{
                  gap: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: 'rgba(96, 165, 250, 0.20)',
                  backgroundColor: 'rgba(37, 99, 235, 0.10)',
                }}
              >
                {defaultBarContent}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: `${result.color}44`,
                      backgroundColor: `${result.color}20`,
                    }}
                  >
                    <Text
                      style={{ color: result.color, fontSize: 12, fontWeight: '700' }}
                    >
                      {result.label}
                    </Text>
                  </View>
                  <Text style={{ color: '#5f6f88', fontSize: 12 }}>
                    {result.percent}% of the target security posture
                  </Text>
                </View>
              </View>
            ),
          }}
        />

        <fields.recoveryPassphrase
          {...{
            showPasswordText: ({ hasValue }) => (hasValue ? 'Peek' : 'Show'),
            hidePasswordText: 'Hide again',
            renderStrengthLabel: ({ result }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ color: result.color, fontSize: 13 }}>✦</Text>
                <Text style={{ color: result.color, fontSize: 12, fontWeight: '700' }}>
                  {result.label}
                </Text>
              </View>
            ),
            renderStrengthEntropy: ({ result }) => (
              <Text style={{ color: '#64748b', fontSize: 11 }}>
                {result.entropy} bits of entropy
              </Text>
            ),
            renderStrengthRule: ({ rule }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: rule.passed
                    ? 'rgba(34, 197, 94, 0.24)'
                    : 'rgba(148, 163, 184, 0.14)',
                  backgroundColor: rule.passed ? 'rgba(34, 197, 94, 0.08)' : '#ffffff',
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: rule.passed
                      ? 'rgba(34, 197, 94, 0.18)'
                      : 'rgba(148, 163, 184, 0.16)',
                  }}
                >
                  <Text
                    style={{
                      color: rule.passed ? '#15803d' : '#64748b',
                      fontSize: 11,
                      fontWeight: '800',
                    }}
                  >
                    {rule.passed ? '✓' : '·'}
                  </Text>
                </View>
                <Text style={{ flex: 1, color: '#20304b', fontSize: 12, lineHeight: 18 }}>
                  {rule.label}
                </Text>
              </View>
            ),
          }}
        />

        <Form.Submit>Save password playbook</Form.Submit>
      </Form>
    </FieldVariantCard>
  );
}

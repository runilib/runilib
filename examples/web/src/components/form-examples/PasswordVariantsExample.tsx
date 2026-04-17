import { useMemo, useState } from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

import { FieldVariantFrame } from './FieldVariantFrame';
import styles from './FormExamples.module.css';
import { createDemoFormUi, simulateSubmitDelay } from './shared';

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
          'Classic signup setup with a visible checklist, entropy, and weak-password blocking.',
        )
        .withStrengthIndicator({
          showRules: true,
          showEntropy: true,
          blockWeak: true,
          blockMsg: 'Choose a stronger account password before continuing.',
          hideRulesWhenValid: true,
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
    globalDefaults: () => {
      const baseUi = createDemoFormUi(styles);

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
            passwordInput: {
              ...baseUi.field?.styles?.textInput,
              width: '100%',
              paddingRight: '132px',
            },
            wrapper: {
              ...baseUi.field?.styles?.wrapper,
              gap: 8,
            },
            passwordToggle: {
              position: 'absolute',
              top: '50%',
              right: 12,
              transform: 'translateY(-50%)',
              minHeight: 34,
              padding: '0 12px',
              borderRadius: 999,
              border: '1px solid rgba(148, 163, 184, 0.18)',
              background: '#ffffff',
              color: '#10203a',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              gap: 8,
              whiteSpace: 'nowrap',
            },
            passwordStrengthRow: {
              display: 'grid',
              gap: 10,
              marginTop: 2,
            },
            passwordStrengthBar: {
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 6,
              alignItems: 'stretch',
            },
            passwordStrengthMeta: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              flexWrap: 'wrap',
            },
            passwordStrengthFill: {
              minHeight: 6,
              borderRadius: 999,
              background: 'rgba(148, 163, 184, 0.18)',
              transition: 'background-color 120ms ease, transform 120ms ease',
            },
            passwordStrengthLabel: {
              fontSize: 12,
              fontWeight: 700,
            },
            passwordStrengthEntropy: {
              fontSize: 11,
              color: '#64748b',
            },
            passwordRulesList: {
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'grid',
              gap: 8,
            },
            passwordRuleItem: {
              display: 'grid',
              gridTemplateColumns: '20px minmax(0, 1fr)',
              gap: 10,
              alignItems: 'center',
              padding: '10px 12px',
              borderRadius: 14,
              border: '1px solid rgba(148, 163, 184, 0.14)',
              background: '#ffffff',
            },
            passwordRuleBullet: {
              width: 20,
              height: 20,
              borderRadius: 999,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(148, 163, 184, 0.16)',
              color: '#10203a',
              fontSize: 11,
              fontWeight: 800,
            },
            passwordRuleText: {
              fontSize: 12,
              lineHeight: 1.45,
              color: '#5f6f88',
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
    <FieldVariantFrame
      familyName="Password"
      accent="#f59e0b"
      title="Strength indicators, toggle copy, and different password policies"
      description="This showcase keeps the underlying generated password field intact while varying the UX around it. One field leans on the default checklist, one reframes the score as an operational readiness signal, and one treats the password like a longer recovery passphrase."
      highlights={[
        'weak-password blocking',
        'custom toggle copy',
        'custom strength rows',
        'custom rule rendering',
      ]}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>{healthyCount} flows look healthy</p>
          <p className={styles.resolverPreviewMuted}>
            Signup:{' '}
            {describePasswordState(values.accountPassword, state.errors.accountPassword)}.
            Admin: {describePasswordState(values.adminSecret, state.errors.adminSecret)}.
            Recovery:{' '}
            {describePasswordState(
              values.recoveryPassphrase,
              state.errors.recoveryPassphrase,
            )}
            .
          </p>
        </>
      }
      snapshot={lastSubmission ?? values}
      submittedLabel={
        lastSubmission ? 'Saved the password playbook with all three variants.' : null
      }
      footer="Use the builder for policy, then use the field overrides for product voice. The important part is that the same generated password field can feel like signup UX, admin security UX, or recovery UX without forking the component."
    >
      <Form
        className={styles.resolverForm}
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
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span aria-hidden="true">{revealed ? '🙈' : '👁️'}</span>
                <span>{defaultContent}</span>
              </span>
            ),
            renderStrengthRowContent: ({ defaultBarContent, result }) => (
              <div
                style={{
                  display: 'grid',
                  gap: 10,
                  padding: '12px 14px',
                  borderRadius: 18,
                  border: '1px solid rgba(96, 165, 250, 0.20)',
                  background:
                    'linear-gradient(180deg, rgba(37, 99, 235, 0.08), rgba(255, 255, 255, 0.98))',
                }}
              >
                {defaultBarContent}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: 999,
                      padding: '6px 10px',
                      background: `${result.color}20`,
                      border: `1px solid ${result.color}44`,
                      color: result.color,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {result.label}
                  </span>
                  <span style={{ color: '#5f6f88', fontSize: 12 }}>
                    {result.percent}% of the target security posture
                  </span>
                </div>
              </div>
            ),
          }}
        />

        <fields.recoveryPassphrase
          {...{
            showPasswordText: ({ hasValue }) => (hasValue ? 'Peek' : 'Show'),
            hidePasswordText: 'Hide again',
            renderStrengthLabel: ({ result }) => (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: result.color,
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                <span aria-hidden="true">✦</span>
                {result.label}
              </span>
            ),
            renderStrengthEntropy: ({ result }) => (
              <span style={{ color: '#64748b', fontSize: 11 }}>
                {result.entropy} bits of entropy
              </span>
            ),
            renderStrengthRule: ({ rule }) => (
              <li
                style={{
                  display: 'grid',
                  gridTemplateColumns: '22px minmax(0, 1fr)',
                  gap: 10,
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: 14,
                  border: `1px solid ${rule.passed ? 'rgba(34, 197, 94, 0.24)' : 'rgba(148, 163, 184, 0.14)'}`,
                  background: rule.passed ? 'rgba(34, 197, 94, 0.08)' : '#ffffff',
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: rule.passed
                      ? 'rgba(34, 197, 94, 0.18)'
                      : 'rgba(148, 163, 184, 0.16)',
                    color: rule.passed ? '#15803d' : '#64748b',
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {rule.passed ? '✓' : '·'}
                </span>
                <span style={{ color: '#20304b', fontSize: 12, lineHeight: 1.45 }}>
                  {rule.label}
                </span>
              </li>
            ),
          }}
        />

        <Form.Submit>Save password playbook</Form.Submit>
      </Form>
    </FieldVariantFrame>
  );
}

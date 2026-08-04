import { useMemo, useState } from 'react';
import { Text } from 'react-native';

import { field, useFormBridge } from '@runilib/react-formbridge';

import { FieldVariantCard } from './FieldVariantCard';
import { formExampleStyles as s } from './FormExamples.styles';
import { NativeField, NativeSubmit } from './nativeFormHelpers';
import { simulateSubmitDelay } from './shared';

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
  });

  const { Form, fieldController, state, watchAll } = form;
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
            {describePasswordState(
              String(values.accountPassword ?? ''),
              state.errors.accountPassword,
            )}
            . Admin:{' '}
            {describePasswordState(
              String(values.adminSecret ?? ''),
              state.errors.adminSecret,
            )}
            . Recovery:{' '}
            {describePasswordState(
              String(values.recoveryPassphrase ?? ''),
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
        <NativeField controller={fieldController('accountPassword')} />

        <NativeField controller={fieldController('adminSecret')} />

        <NativeField controller={fieldController('recoveryPassphrase')} />

        <NativeSubmit onPress={() => void form.submit()}>
          Save password playbook
        </NativeSubmit>
      </Form>
    </FieldVariantCard>
  );
}

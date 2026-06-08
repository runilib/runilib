import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { field, useFormBridge, valibotBridge } from '@/src/demoFormBridge';

import * as v from 'valibot';
import { BridgeExampleCard } from './BridgeExampleCard';
import { formExampleStyles as s } from './FormExamples.styles';
import { createNativeFieldProps, DEMO_PLANS, simulateSubmitDelay } from './shared';

export function ValibotBridgeExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);
  const fieldProps = useMemo(() => createNativeFieldProps(), []);

  const formSchema = useMemo(
    () => ({
      plan: field.select().label('Plan').options(DEMO_PLANS),
      cardholder: field.text().label('Cardholder').placeholder('Ava Stone'),
      receiptEmail: field
        .email()
        .label('Receipt email')
        .placeholder('billing@runilib.dev'),
      cardLast4: field.text().label('Card last 4').placeholder('1842'),
    }),
    [],
  );

  const schema = useMemo(
    () =>
      v.object({
        plan: v.pipe(
          v.string(),
          v.picklist(['starter', 'scale', 'enterprise'], 'Choose a plan.'),
        ),
        cardholder: v.pipe(
          v.string(),
          v.trim(),
          v.minLength(2, 'Cardholder name is required.'),
        ),
        receiptEmail: v.pipe(v.string(), v.trim(), v.email('Use a valid receipt email.')),
        cardLast4: v.pipe(
          v.string(),
          v.trim(),
          v.regex(/^\d{4}$/, 'Use exactly four digits.'),
        ),
      }),
    [],
  );

  const bridge = useMemo(
    () =>
      valibotBridge(schema, {
        module: v as NonNullable<Parameters<typeof valibotBridge>[1]>['module'],
        mode: 'sync',
      }),
    [schema],
  );

  const form = useFormBridge(formSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    validatorBridge: bridge,
  });

  const { Form, fields, state, watchAll } = form;

  const liveValues = watchAll();
  const planLabel =
    DEMO_PLANS.find((item) => item.value === liveValues.plan)?.label ??
    'No plan selected';

  return (
    <BridgeExampleCard
      bridgeName="Valibot"
      accent="#a78bfa"
      title="Billing enrollment"
      description="Composable validation pipelines with explicit module injection for stable browser and ESM usage."
      highlights={['Composable pipelines', 'Module injection', 'Tree-shakable']}
      preview={
        <>
          <Text style={s.previewValue}>{planLabel}</Text>
          <Text style={s.previewText}>
            This demo passes module injection explicitly so the bridge stays stable in
            browser-first environments.
          </Text>
        </>
      }
      parsedSubmission={lastSubmission}
      submittedLabel={
        lastSubmission ? `Enrollment ready for ${String(planLabel).toLowerCase()}` : null
      }
      submitError={state.submitError}
      footer="Valibot is attractive when bundle size matters and you prefer highly composable validation pipes."
    >
      <Form
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <View style={s.sectionBlock}>
          <Text style={s.sectionBlockTitle}>Enrollment</Text>

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.plan {...fieldProps} />
            </View>
            <View style={s.halfField}>
              <fields.cardholder {...fieldProps} />
            </View>
          </View>

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.receiptEmail {...fieldProps} />
            </View>
            <View style={s.halfField}>
              <fields.cardLast4 {...fieldProps} />
            </View>
          </View>
        </View>

        <Form.Submit
          style={s.submitButton}
          loadingText="Parsing with Valibot..."
        >
          Validate with Valibot
        </Form.Submit>
      </Form>
    </BridgeExampleCard>
  );
}

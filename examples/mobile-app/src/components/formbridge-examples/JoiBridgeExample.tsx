import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { field, joiBridge, useFormBridge } from '@/src/demoFormBridge';

import Joi from 'joi';
import { BridgeExampleCard } from './BridgeExampleCard';
import { formExampleStyles as s } from './FormExamples.styles';
import {
  CUSTOMER_DEPARTMENTS,
  createNativeFieldProps,
  simulateSubmitDelay,
} from './shared';

export function JoiBridgeExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);
  const fieldProps = useMemo(() => createNativeFieldProps(), []);

  const formSchema = useMemo(
    () => ({
      city: field.text().label('City').placeholder('Lyon'),
      department: field
        .select()
        .label('Department')
        .options(CUSTOMER_DEPARTMENTS)
        .searchable(),
      phone: field.tel().label('Support phone').placeholder('+33 6 98 12 45 78'),
      postalCode: field.text().label('Postal code').placeholder('69002'),
    }),
    [],
  );

  const schema = useMemo(
    () =>
      Joi.object({
        city: Joi.string().trim().min(2).required().messages({
          'string.empty': 'Choose a city.',
          'string.min': 'Use at least 2 characters.',
        }),
        department: Joi.string()
          .valid(...CUSTOMER_DEPARTMENTS.map((item) => item.value))
          .required()
          .messages({
            'any.only': 'Pick a listed department.',
            'string.empty': 'Department is required.',
          }),
        phone: Joi.string()
          .pattern(/^[+\d\s()-]{8,20}$/)
          .required()
          .messages({
            'string.pattern.base': 'Use a valid support phone format.',
          }),
        postalCode: Joi.string()
          .pattern(/^\d{5}$/)
          .required()
          .messages({
            'string.pattern.base': 'Postal code should contain 5 digits.',
          }),
      }),
    [],
  );

  const bridge = useMemo(
    () =>
      joiBridge(schema, {
        stripQuotes: true,
        validateOptions: {
          allowUnknown: false,
        },
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
  const departmentLabel =
    CUSTOMER_DEPARTMENTS.find((item) => item.value === liveValues.department)?.label ??
    'No department yet';

  return (
    <BridgeExampleCard
      bridgeName="Joi"
      accent="#60a5fa"
      title="Regional support routing"
      description="Strict business rules and predictable path-based errors, backed by Joi."
      highlights={['Custom messages', 'Strict rules', 'Quote stripping']}
      preview={
        <>
          <Text style={s.previewValue}>{departmentLabel}</Text>
          <Text style={s.previewText}>
            Joi validates city, phone, department, and postal code with clear
            business-facing copy.
          </Text>
        </>
      }
      parsedSubmission={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Support route ready for ${String(liveValues.city || 'region')}`
          : null
      }
      submitError={state.submitError}
      footer="Joi is a strong fit when frontend validation should mirror backend business logic closely."
    >
      <Form
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <View style={s.sectionBlock}>
          <Text style={s.sectionBlockTitle}>Routing rules</Text>

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.city {...fieldProps} />
            </View>
            <View style={s.halfField}>
              <fields.department {...fieldProps} />
            </View>
          </View>

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.phone {...fieldProps} />
            </View>
            <View style={s.halfField}>
              <fields.postalCode {...fieldProps} />
            </View>
          </View>
        </View>

        <Form.Submit
          style={s.submitButton}
          loadingText="Routing with Joi..."
        >
          Validate with Joi
        </Form.Submit>
      </Form>
    </BridgeExampleCard>
  );
}

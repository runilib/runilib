import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { field, useFormBridge } from '@runilib/react-formbridge';

import { formExampleStyles as s } from './FormExamples.styles';
import { StylingExampleCard } from './StylingExampleCard';
import { simulateSubmitDelay } from './shared';

export function FieldOverridesStylingExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);

  const schema = useMemo(
    () => ({
      receiptEmail: field
        .email('Receipt email')
        .required('Receipt email is required')
        .placeholder('billing@runilib.dev')
        .behavior({
          keyboardType: 'email-address',
        }),
      postalCode: field
        .text('Postal code')
        .required('Postal code is required')
        .placeholder('75002'),
      cardholder: field
        .text('Cardholder')
        .required('Cardholder is required')
        .placeholder('Ava Stone'),
      specialInstructions: field
        .textarea('Special instructions')
        .hint('Great for delivery notes or internal finance context.')
        .placeholder('Leave the invoice open for 14 days.'),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onTouched',
    globalUi: {
      submit: {
        loadingText: 'Saving inline theme...',
        containerStyle: {
          marginTop: 6,
          minHeight: 52,
          borderRadius: 18,
          backgroundColor: '#f59e0b',
        },
        textStyle: {
          color: '#2a1602',
          fontWeight: '800',
        },
      },
      field: {
        ui: {
          styles: {
            root: {
              marginBottom: 0,
              gap: 8,
            },
            label: {
              fontSize: 12,
              fontWeight: '800',
              letterSpacing: 0.7,
              textTransform: 'uppercase',
              color: '#f8fafc',
            },
            input: {
              minHeight: 52,
              borderWidth: 1.5,
              borderColor: 'rgba(251, 191, 36, 0.18)',
              borderRadius: 16,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 15,
              color: '#f8fafc',
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
            },
            hint: {
              color: '#fde68a',
            },
            error: {
              color: '#fca5a5',
            },
          },
          renderRequiredMark: () => <Text style={{ color: '#f59e0b' }}>•</Text>,
        },
      },
    },
  });

  const { Form, fields, state, watchAll } = form;
  const liveValues = watchAll();

  return (
    <StylingExampleCard
      recipeName="Field overrides"
      accent="#f59e0b"
      title="Style the form with plain objects and local overrides"
      description="This recipe uses only native style objects, a global ui theme, and one-off field ui overrides. No styling library is required."
      highlights={[
        'inline native styles',
        'custom required mark',
        'one-off field override',
      ]}
      preview={
        <>
          <Text style={s.previewValue}>{liveValues.cardholder || 'Ava Stone'}</Text>
          <Text style={s.previewText}>
            Receipt destination: {liveValues.receiptEmail || 'billing@runilib.dev'}.
          </Text>
        </>
      }
      submittedPayload={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Inline theme saved for ${String(liveValues.cardholder || 'customer')}`
          : null
      }
      submitError={state.submitError}
      footer="This is the lightest option when you just want to prove the styling API or ship a theme without adding another styling dependency."
    >
      <Form
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <View style={s.sectionBlock}>
          <Text style={s.sectionBlockTitle}>Billing context</Text>

          <fields.receiptEmail
            ui={{
              highlightOnError: false,
              renderHint: () => (
                <Text style={{ color: '#cbd5e1', fontSize: 12 }}>
                  We only use it for invoices and receipts.
                </Text>
              ),
            }}
          />

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.postalCode
                ui={{
                  styles: {
                    input: {
                      textAlign: 'center',
                      letterSpacing: 2,
                    },
                  },
                }}
              />
            </View>
            <View style={s.halfField}>
              <fields.cardholder />
            </View>
          </View>

          <fields.specialInstructions />
        </View>

        <Form.Submit>Save field override recipe</Form.Submit>
      </Form>
    </StylingExampleCard>
  );
}

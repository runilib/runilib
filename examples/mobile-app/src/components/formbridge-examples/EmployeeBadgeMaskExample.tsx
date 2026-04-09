import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { field, useFormBridge } from '@runilib/react-formbridge';

import { formExampleStyles as s } from './FormExamples.styles';
import { MaskExampleCard } from './MaskExampleCard';
import { createNativeFieldProps, simulateSubmitDelay } from './shared';

export function EmployeeBadgeMaskExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);
  const fieldProps = useMemo(() => createNativeFieldProps(), []);

  const formSchema = useMemo(
    () => ({
      teammateName: field
        .text()
        .label('Teammate name')
        .placeholder('Ava Stone')
        .required('Required'),
      badgeCode: field
        .masked('EMP-9999-LL')
        .label('Badge code')
        .placeholder('EMP-2048-AX')
        .tokens({
          L: /[A-Z]/,
        })
        .required('Required')
        .showMaskInPlaceholder()
        .uppercase()
        .validateComplete('Incomplete badge code'),
    }),
    [],
  );

  const form = useFormBridge(formSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  });

  const { Form, fields, state, watchAll } = form;
  const liveValues = watchAll();

  return (
    <MaskExampleCard
      maskName="Badge code"
      accent="#a78bfa"
      title="Employee access badge issuance"
      description="Fixed prefixes are another practical use case for custom masks when teams need recognizable internal codes."
      highlights={['Fixed prefix', 'Structured suffix', 'Human-friendly IDs']}
      preview={
        <>
          <Text style={s.previewValue}>{liveValues.badgeCode || 'EMP-2048-AX'}</Text>
          <Text style={s.previewText}>
            The static prefix is rendered automatically, while the mask keeps the rest of
            the badge code in the expected format and stores that formatted value.
          </Text>
        </>
      }
      parsedSubmission={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Badge issued for ${String(liveValues.teammateName || 'teammate')}`
          : null
      }
      submitError={state.submitError}
      footer="This style of mask fits HR, security, CRM, warehouse, or support identifiers that combine a prefix with a controlled suffix."
    >
      <Form
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <View style={s.sectionBlock}>
          <Text style={s.sectionBlockTitle}>Access badge</Text>

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.teammateName {...fieldProps} />
            </View>
            <View style={s.halfField}>
              <fields.badgeCode {...fieldProps} />
            </View>
          </View>
        </View>

        <Form.Submit
          style={s.submitButton}
          loadingText="Issuing badge..."
        >
          Issue badge
        </Form.Submit>
      </Form>
    </MaskExampleCard>
  );
}

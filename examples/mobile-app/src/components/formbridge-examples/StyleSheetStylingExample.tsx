import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { field, useFormBridge } from '@runilib/react-formbridge';

import { formExampleStyles as s } from './FormExamples.styles';
import { StylingExampleCard } from './StylingExampleCard';
import { CUSTOMER_DEPARTMENTS, createNativeFormUi, simulateSubmitDelay } from './shared';

export function StyleSheetStylingExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);

  const schema = useMemo(
    () => ({
      projectName: field
        .text('Project name')
        .required('Project name is required')
        .trim()
        .placeholder('Billing redesign'),
      ownerEmail: field
        .email('Owner email')
        .required('Owner email is required')
        .trim()
        .placeholder('owner@runilib.dev')
        .behavior({
          autoComplete: 'email',
          keyboardType: 'email-address',
        }),
      department: field
        .select('Department')
        .options(CUSTOMER_DEPARTMENTS)
        .required('Pick a department'),
      launchNotes: field
        .textarea('Launch notes')
        .placeholder('Describe the tone, audience, and review plan.')
        .hint('Textarea inherits the same StyleSheet theme through the shared ui layer.'),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalUi: createNativeFormUi(),
  });

  const { Form, fields, state, watchAll } = form;
  const liveValues = watchAll();
  const departmentLabel =
    CUSTOMER_DEPARTMENTS.find((item) => item.value === liveValues.department)?.label ??
    'No department yet';

  return (
    <StylingExampleCard
      recipeName="StyleSheet"
      accent="#f59e0b"
      title="Apply one ui theme to every native field"
      description="This mirrors the main mobile checkout demo: one shared StyleSheet theme feeds text inputs, select-like pickers, textareas, and the submit button."
      highlights={['shared StyleSheet', 'global ui theme', 'picker support']}
      preview={
        <>
          <Text style={s.previewValue}>
            {liveValues.projectName || 'Billing redesign'}
          </Text>
          <Text style={s.previewText}>
            Current owner: {liveValues.ownerEmail || 'owner@runilib.dev'}.
          </Text>
          <Text style={s.customerPreviewDepartment}>{departmentLabel}</Text>
        </>
      }
      submittedPayload={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `StyleSheet theme shipped for ${String(liveValues.projectName || 'project')}`
          : null
      }
      submitError={state.submitError}
      footer="Choose this pattern when the screen already relies on React Native StyleSheet objects and you want the form to inherit the same visual language quickly."
    >
      <Form
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <View style={s.sectionBlock}>
          <Text style={s.sectionBlockTitle}>Launch brief</Text>

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.projectName />
            </View>
            <View style={s.halfField}>
              <fields.ownerEmail />
            </View>
          </View>

          <fields.department
            ui={{
              styles: {
                optionTrigger: {
                  borderColor: '#f5bf67',
                },
              },
            }}
          />

          <fields.launchNotes />
        </View>

        <Form.Submit
          style={s.submitButton}
          loadingText="Applying StyleSheet theme..."
        >
          Save StyleSheet recipe
        </Form.Submit>
      </Form>
    </StylingExampleCard>
  );
}

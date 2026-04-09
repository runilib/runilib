import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { field, useFormBridge, zodResolver } from '@runilib/react-formbridge';

import { z } from 'zod';
import { formExampleStyles as s } from './FormExamples.styles';
import { ResolverExampleCard } from './ResolverExampleCard';
import { createNativeFieldProps, simulateSubmitDelay } from './shared';

export function ZodResolverExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);
  const fieldProps = useMemo(() => createNativeFieldProps(), []);

  const formSchema = useMemo(
    () => ({
      workspaceName: field.text().label('Workspace name').placeholder('New workspace'),
      contactEmail: field.email().label('Contact email').placeholder('ops@runilib.dev'),
      teamSize: field.text().label('Team size').placeholder('12'),
      launchDate: field.date().label('Launch date').placeholder('YYYY-MM-DD'),
    }),
    [],
  );

  const schema = useMemo(
    () =>
      z.object({
        workspaceName: z.string().trim().min(3, 'Use at least 3 characters.'),
        contactEmail: z.string().trim().email('Use a valid email address.'),
        teamSize: z.coerce.number().int().min(2, 'Plan for at least 2 seats.'),
        launchDate: z.string().trim().min(1, 'Pick a launch date.'),
      }),
    [],
  );

  const resolver = useMemo(
    () => zodResolver(schema as Parameters<typeof zodResolver>[0], { mode: 'sync' }),
    [schema],
  );

  const form = useFormBridge(formSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    resolver,
  });

  const { Form, fields, state, watchAll } = form;

  const liveValues = watchAll();

  return (
    <ResolverExampleCard
      resolverName="Zod"
      accent="#fb923c"
      title="Product launch intake"
      description="One schema validates raw inputs and returns a typed payload to the submit handler."
      highlights={['Number coercion', 'Typed output', 'Trimmed strings']}
      preview={
        <>
          <Text style={s.previewValue}>
            {liveValues.workspaceName || 'New workspace'}
          </Text>
          <Text style={s.previewText}>
            Team size stays textual in the UI, then Zod coerces it into a number for the
            final payload.
          </Text>
        </>
      }
      parsedSubmission={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Payload saved for ${String(liveValues.workspaceName || 'workspace')}`
          : null
      }
      submitError={state.submitError}
      footer="Use Zod when you want runtime validation and type-safe output from the same schema."
    >
      <Form
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <View style={s.sectionBlock}>
          <Text style={s.sectionBlockTitle}>Launch details</Text>

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.workspaceName {...fieldProps} />
            </View>
            <View style={s.halfField}>
              <fields.contactEmail {...fieldProps} />
            </View>
          </View>

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.teamSize {...fieldProps} />
            </View>
            <View style={s.halfField}>
              <fields.launchDate {...fieldProps} />
            </View>
          </View>
        </View>

        <Form.Submit
          style={s.submitButton}
          loadingText="Normalizing with Zod..."
        >
          Validate with Zod
        </Form.Submit>
      </Form>
    </ResolverExampleCard>
  );
}

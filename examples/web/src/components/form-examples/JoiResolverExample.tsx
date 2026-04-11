import { useMemo, useState } from 'react';

import { field, joiResolver, useFormBridge } from '@runilib/react-formbridge';

import Joi from 'joi';
import styles from './FormExamples.module.css';
import { ResolverExampleFrame } from './ResolverExampleFrame';
import { CUSTOMER_DEPARTMENTS, createDemoFormUi, simulateSubmitDelay } from './shared';

export function JoiResolverExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);

  const formSchema = useMemo(
    () => ({
      city: field.text().label('City').placeholder('Lyon'),
      department: field.select().label('Department').options(CUSTOMER_DEPARTMENTS),
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

  const resolver = useMemo(
    () =>
      joiResolver(schema, {
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
    globalStyles: () => createDemoFormUi(styles),
    resolver,
  });

  const { Form, fields, state, watchAll } = form;

  const liveValues = watchAll();
  const departmentLabel =
    CUSTOMER_DEPARTMENTS.find((item) => item.value === liveValues.department)?.label ??
    'No department yet';

  return (
    <ResolverExampleFrame
      resolverName="Joi"
      accent="#60a5fa"
      title="Regional support routing"
      description="Handy when you want strict business rules, custom enterprise messages, and predictable path-based errors coming from Joi."
      highlights={['Custom messages', 'Strict rules', 'Quote stripping']}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>{departmentLabel}</p>
          <p className={styles.resolverPreviewMuted}>
            Joi is validating the combination of city, phone, department, and postal code
            with clear business-facing copy.
          </p>
        </>
      }
      parsedSubmission={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Support route ready for ${String(liveValues.city || 'region')}`
          : null
      }
      submitError={state.submitError}
      footer="Joi shines when validation logic already exists on the backend and you want the frontend to mirror it closely."
    >
      <Form
        className={styles.resolverForm}
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <div className={styles.formRow}>
          <fields.city />
          <fields.department />
        </div>

        <div className={styles.formRow}>
          <fields.phone />
          <fields.postalCode />
        </div>

        <div className={styles.footerRow}>
          <p className={styles.helperText}>
            Joi keeps the final payload raw, but its error system is excellent for dense
            business rules.
          </p>

          <Form.Submit
            className={styles.submitButton}
            loadingText="Routing with Joi…"
          >
            Validate with Joi
          </Form.Submit>
        </div>
      </Form>
    </ResolverExampleFrame>
  );
}

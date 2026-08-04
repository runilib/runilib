import { useId, useState } from 'react';

import { createSchema, field, MASKS, useFormBridge } from '@runilib/react-formbridge';

import styles from './FormExamples.module.css';
import { QuickTestExample } from './quickTest';

type ManualController = {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
  label?: string;
};

function NativeField({
  controller,
  FieldError,
  FieldLabel,
  type = 'text',
}: {
  controller: ManualController;
  FieldError: (props: { name: string }) => React.JSX.Element | null;
  FieldLabel: (props: { name: string; htmlFor: string }) => React.JSX.Element | null;
  type?: string;
}) {
  const id = useId();
  const value = controller.value ?? '';

  return (
    <div className={styles.formField}>
      <FieldLabel
        name={controller.name}
        htmlFor={id}
      />
      <input
        id={id}
        type={type}
        value={String(value)}
        onChange={(event) => controller.onChange(event.target.value)}
        onBlur={controller.onBlur}
        onFocus={controller.onFocus}
      />
      <FieldError name={controller.name} />
    </div>
  );
}

const checkoutSchema = createSchema({
  firstName: field
    .text()
    .required('First name is required')
    .label('First name')
    .trim()
    .placeholder('Ava'),
  email: field
    .email()
    .required('Email is required')
    .label('Email')
    .trim()
    .lowercase()
    .placeholder('ava@runilib.dev')
    .excludeEmailDomains(
      ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'],
      'Please use a professional email address.',
    ),
  cardNumber: field
    .masked(MASKS.CARD_16)
    .label('Card number')
    .required('Card number is required')
    .showMaskInPlaceholder('5555 5555 5555 5555')
    .storeRaw()
    .validateComplete('Complete the card number.'),
  expiry: field
    .masked(MASKS.EXPIRY)
    .label('Expiry')
    .required('Expiry date is required')
    .showMaskInPlaceholder('DD/MM')
    .validateComplete('Complete the expiry date.'),
  cvv: field
    .masked(MASKS.CVV)
    .label('CVV')
    .required('CVV is required')
    .showMaskInPlaceholder()
    .validateComplete('Complete the CVV.'),
  code: field.otp('Enter code').required().digitsOnly().groups([3, 3, 2], '-'),
  alphanumeric: field.otp('alphanumeric').required().length(6).alphanumeric(),
  lettersOnly: field.otp('lettersOnly').required().length(6).lettersOnly(),
  dateDeNaissance: field.date('DATE DE NAISSANCE').required(),
});

export function BrutTestExample() {
  const [lastSubmission, setLastSubmission] = useState<Record<string, unknown> | null>(
    null,
  );

  const checkoutForm = useFormBridge(checkoutSchema, {
    validateOn: 'onTouched',
    revalidateOn: 'onChange',
  });

  const { Form, FieldError, FieldLabel, fieldController, state, watchAll } = checkoutForm;

  const checkoutFieldCount = Object.keys(checkoutSchema).length;
  const liveCheckout = watchAll() as Record<string, unknown>;

  const completedFields = Object.values(liveCheckout).filter((value) =>
    typeof value === 'string' ? value.trim().length > 0 : Boolean(value),
  ).length;

  const cardPreview = liveCheckout.cardNumber
    ? String(liveCheckout.cardNumber).replace(/\s+/g, '').slice(-4)
    : '1842';

  return (
    <section className={`${styles.sectionCard} ${styles.customerSection}`}>
      <div className={styles.customerShell}>
        <aside className={styles.customerAside}>
          <span className={styles.customerEyebrow}>react-formbridge demo</span>
          <h2 className={styles.customerTitle}>Customer checkout</h2>
          <p className={styles.customerIntro}>
            A schema-driven contact and payment form embedded directly inside the
            dashboard. One hook handles rendering, validation, persistence, and submit
            state.
          </p>

          <div className={styles.customerMetric}>
            <p className={styles.customerMetricValue}>
              {completedFields}/{checkoutFieldCount}
            </p>
            <p className={styles.customerMetricLabel}>fields ready</p>
          </div>

          <div className={styles.previewCard}>
            <p className={styles.previewLabel}>Payment preview</p>
            <p className={styles.previewCardNumber}>•••• •••• •••• {cardPreview}</p>
            <div className={styles.previewMeta}>
              <span>{String(liveCheckout.firstName ?? 'First name')} </span>
              <span>{String(liveCheckout.expiry ?? 'MM/YY')}</span>
            </div>
          </div>

          <div className={styles.points}>
            <span className={styles.point}>Masked card capture</span>
            <span className={styles.point}>Custom CRM code mask</span>
            <span className={styles.point}>Draft saved automatically</span>
            <span className={styles.point}>Ready for web and native</span>
          </div>
        </aside>

        <div className={styles.customerPanel}>
          <div className={styles.customerPanelHead}>
            <div>
              <p className={styles.customerPanelTitle}>Customer details</p>
              <p className={styles.customerPanelSubtitle}>
                Contact details, billing context, and payment credentials in one polished
                form.
              </p>
            </div>

            {lastSubmission ? (
              <div className={styles.successBadge}>
                Saved for {String(lastSubmission.firstName ?? 'customer')}
              </div>
            ) : null}
          </div>

          <Form
            className={styles.formColumn}
            onSubmit={async (values) => {
              setLastSubmission(values as Record<string, unknown>);
            }}
          >
            <div className={styles.formRow}>
              <NativeField
                controller={fieldController('firstName') as ManualController}
                FieldError={
                  FieldError as (props: { name: string }) => React.JSX.Element | null
                }
                FieldLabel={
                  FieldLabel as (props: {
                    name: string;
                    htmlFor: string;
                  }) => React.JSX.Element | null
                }
              />
            </div>

            <NativeField
              controller={fieldController('email') as ManualController}
              FieldError={
                FieldError as (props: { name: string }) => React.JSX.Element | null
              }
              FieldLabel={
                FieldLabel as (props: {
                  name: string;
                  htmlFor: string;
                }) => React.JSX.Element | null
              }
              type="email"
            />

            <div className={styles.paymentSection}>
              <div className={styles.paymentHeader}>
                <div>
                  <p className={styles.paymentTitle}>Payment details</p>
                  <p className={styles.paymentSubtitle}>
                    Styled masked fields for card number, expiry, and CVV.
                  </p>
                </div>
                <span className={styles.paymentBadge}>PCI-style UI demo</span>
              </div>

              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <NativeField
                  controller={fieldController('cardNumber') as ManualController}
                  FieldError={
                    FieldError as (props: { name: string }) => React.JSX.Element | null
                  }
                  FieldLabel={
                    FieldLabel as (props: {
                      name: string;
                      htmlFor: string;
                    }) => React.JSX.Element | null
                  }
                />
                <NativeField
                  controller={fieldController('expiry') as ManualController}
                  FieldError={
                    FieldError as (props: { name: string }) => React.JSX.Element | null
                  }
                  FieldLabel={
                    FieldLabel as (props: {
                      name: string;
                      htmlFor: string;
                    }) => React.JSX.Element | null
                  }
                />
                <NativeField
                  controller={fieldController('cvv') as ManualController}
                  FieldError={
                    FieldError as (props: { name: string }) => React.JSX.Element | null
                  }
                  FieldLabel={
                    FieldLabel as (props: {
                      name: string;
                      htmlFor: string;
                    }) => React.JSX.Element | null
                  }
                />
              </div>
              <NativeField
                controller={fieldController('code') as ManualController}
                FieldError={
                  FieldError as (props: { name: string }) => React.JSX.Element | null
                }
                FieldLabel={
                  FieldLabel as (props: {
                    name: string;
                    htmlFor: string;
                  }) => React.JSX.Element | null
                }
              />
              <NativeField
                controller={fieldController('alphanumeric') as ManualController}
                FieldError={
                  FieldError as (props: { name: string }) => React.JSX.Element | null
                }
                FieldLabel={
                  FieldLabel as (props: {
                    name: string;
                    htmlFor: string;
                  }) => React.JSX.Element | null
                }
              />
              <NativeField
                controller={fieldController('lettersOnly') as ManualController}
                FieldError={
                  FieldError as (props: { name: string }) => React.JSX.Element | null
                }
                FieldLabel={
                  FieldLabel as (props: {
                    name: string;
                    htmlFor: string;
                  }) => React.JSX.Element | null
                }
              />
              <NativeField
                controller={fieldController('dateDeNaissance') as ManualController}
                FieldError={
                  FieldError as (props: { name: string }) => React.JSX.Element | null
                }
                FieldLabel={
                  FieldLabel as (props: {
                    name: string;
                    htmlFor: string;
                  }) => React.JSX.Element | null
                }
                type="date"
              />
            </div>

            {state.submitError ? (
              <p className={styles.errorBox}>{state.submitError}</p>
            ) : null}

            <div className={styles.footerRow}>
              <p className={styles.helperText}>
                Secure entry, built-in presets, formatted mask values, and stored draft
                recovery included.
              </p>

              <button
                type="submit"
                className={styles.submitButton}
              >
                Valider Votre element
              </button>
            </div>
          </Form>
          <QuickTestExample />
        </div>
      </div>
    </section>
  );
}

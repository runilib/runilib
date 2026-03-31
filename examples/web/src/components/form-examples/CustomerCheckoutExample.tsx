import { useMemo, useState } from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

import styles from './FormExamples.module.css';
import {
  CUSTOMER_DEPARTMENTS,
  createDemoFieldAppearance,
  createDemoFormUi,
  simulateSubmitDelay,
} from './shared';

export function CustomerCheckoutExample() {
  const [lastSubmission, setLastSubmission] = useState<Record<string, unknown> | null>(
    null,
  );

  const checkoutSchema = useMemo(() => {
    const { compactFieldAppearance } = createDemoFieldAppearance(styles);

    return {
      firstName: field
        .text('First name')
        .required('First name is required')
        .trim()
        .placeholder('Ava')
        .appearance({
          autoComplete: 'given-name'
        }),
      lastName: field
        .text('Last name')
        .required('Last name is required')
        .trim()
        .placeholder('Stone')
        .appearance({
          autoComplete: 'family-name',
        }),
      email: field
        .email('Email')
        .required('Email is required')
        .trim()
        .lowercase()
        .placeholder('ava@runilib.dev')
        .appearance({
          autoComplete: 'email',
          inputMode: 'email',
        })
        .excludeEmailDomains(
          ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'],
          'Please use a professional email address.',
        ),
      entrepriseEmail: field
        .email('Entreprise Email')
        .required('Email is required')
        .trim()
        .lowercase()
        .placeholder('ava@runilib.dev')
        .appearance({
          autoComplete: 'email',
          inputMode: 'email',
        })
        .pattern(
          /^[^\s@]+@(?!gmail\.com$|yahoo\.com$|hotmail\.com$|outlook\.com$)[^\s@]+\.[^\s@]+$/i,
          'Please use a professional email address.',
        ),
      phone: field
        .tel('Phone')
        .required('Phone is required')
        .placeholder('+33 6 12 34 56 78')
        .appearance({
          autoComplete: 'tel',
          inputMode: 'tel',
        }),
      department: field
        .select('Department')
        .options(CUSTOMER_DEPARTMENTS)
        .required('Department is required')
        .appearance({}),
      city: field
        .text('City')
        .required('City is required')
        .trim()
        .placeholder('Paris')
        .appearance({
          autoComplete: 'address-level2',
        }),
      customerCode: field
        .masked('Customer code', 'LL-9999')
        .tokens({
          L: /[A-Z]/,
        })
        .required('Customer code is required')
        .showMaskInPlaceholder()
        .uppercase()
        .validateComplete('Complete the customer code.')
        .hint('Custom mask example: two uppercase letters and four digits.')
        .appearance({
          ...compactFieldAppearance,
          autoComplete: 'off',
        }),
      cardNumber: field
        .masked('Card number', 'CARD_16')
        .required('Card number is required')
        .showMaskInPlaceholder()
        .validateComplete('Complete the card number.')
        .appearance({
          autoComplete: 'cc-number',
        }),
      expiry: field
        .masked('Expiry', 'EXPIRY')
        .required('Expiry date is required')
        .showMaskInPlaceholder()
        .validateComplete('Complete the expiry date.')
        .appearance({
          ...compactFieldAppearance,
          autoComplete: 'cc-exp',
        }),
      cvv: field
        .masked('CVV', 'CVV')
        .required('CVV is required')
        .showMaskInPlaceholder()
        .validateComplete('Complete the CVV.')
        .appearance({
          ...compactFieldAppearance,
          autoComplete: 'cc-csc',
        }),
    };
  }, []);

  const checkoutForm = useFormBridge(checkoutSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalAppearance: createDemoFormUi(styles),
    persist: {
      key: 'dashboard-customer-checkout',
      storage: 'local',
    },
  });

  const { Form, fields, state, watchAll } = checkoutForm;

  const checkoutFieldCount = Object.keys(checkoutSchema).length;
  const liveCheckout = watchAll();
  const completedFields = Object.values(liveCheckout).filter((value) =>
    typeof value === 'string' ? value.trim().length > 0 : Boolean(value),
  ).length;
  const selectedDepartment =
    CUSTOMER_DEPARTMENTS.find((item) => item.value === liveCheckout.department)?.label ??
    'Choose a department';
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
              <span>
                {liveCheckout.firstName || 'First name'}{' '}
                {liveCheckout.lastName || 'Last name'}
              </span>
              <span>{liveCheckout.expiry || 'MM/YY'}</span>
            </div>
            <div className={styles.previewDepartment}>{selectedDepartment}</div>
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
              await simulateSubmitDelay(700);
              setLastSubmission(values as Record<string, unknown>);
            }}
          >
            <div className={styles.formRow}>
              <fields.firstName
                appearance={{ inputProps: { 'aria-checked': 'false' } }}
              />
              <fields.lastName />
            </div>

            <fields.email />
            <fields.entrepriseEmail />

            <div className={styles.formRow}>
              <fields.phone />
              <fields.department />
            </div>

            <div className={styles.formRow}>
              <fields.city />
              <fields.customerCode />
            </div>

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

              <fields.cardNumber />

              <div className={styles.formRow}>
                <fields.expiry />
                <fields.cvv
                  appearance={{
                    styles: {
                      input: {
                        letterSpacing: '0.18em',
                        textAlign: 'center',
                      },
                    },
                  }}
                />
              </div>
            </div>

            {state.submitError ? (
              <p className={styles.errorBox}>{state.submitError}</p>
            ) : null}

            <div className={styles.footerRow}>
              <p className={styles.helperText}>
                Secure entry, built-in presets, formatted mask values, and stored draft
                recovery included.
              </p>

              <Form.Submit
                className={styles.submitButton}
                loadingText="Saving customer…"
              >
                Save customer
              </Form.Submit>
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
}

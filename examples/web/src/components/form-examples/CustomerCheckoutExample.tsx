import { useMemo, useState } from 'react';

import { field, MASKS, useFormBridge } from '@runilib/react-formbridge';

import styles from './FormExamples.module.css';
import {
  CUSTOMER_DEPARTMENTS,
  createDemoFieldUi,
  createDemoFormUi,
  simulateSubmitDelay,
} from './shared';

export function CustomerCheckoutExample() {
  const [lastSubmission, setLastSubmission] = useState<Record<string, unknown> | null>(
    null,
  );
  const { compactFieldUi } = createDemoFieldUi(styles);

  const checkoutSchema = useMemo(() => {
    return {
      firstName: field
        .text()
        .required('First name is required')
        .label('First name')
        .trim()
        .placeholder('Ava'),
      lastName: field
        .text()
        .required('Last name is required')
        .label('Last name')
        .trim()
        .placeholder('Stone'),
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
      entrepriseEmail: field
        .email()
        .required('Email is required')
        .label('Work email')
        .trim()
        .lowercase()
        .placeholder('ava@runilib.dev')
        .pattern(
          /^[^\s@]+@(?!gmail\.com$|yahoo\.com$|hotmail\.com$|outlook\.com$)[^\s@]+\.[^\s@]+$/i,
          'Please use a professional email address.',
        ),
      phone: field
        .tel()
        .required('Phone is required')
        .label('Phone')
        .placeholder('+33 6 12 34 56 78'),
      department: field
        .select()
        .label('Department')
        .options(CUSTOMER_DEPARTMENTS)
        .required('Department is required'),
      city: field
        .text()
        .required('City is required')
        .label('City')
        .trim()
        .placeholder('Paris'),
      customerCode: field
        .masked('LL-9999')
        .label('Customer code')
        .tokens({
          L: /[A-Z]/,
        })
        .required('Customer code is required')
        .showMaskInPlaceholder()
        .uppercase()
        .validateComplete('Complete the customer code.')
        .hint('Custom mask example: two uppercase letters and four digits.'),
      cardNumber: field
        .masked(MASKS.CARD_16)
        .label('Card number')
        .required('Card number is required')
        .showMaskInPlaceholder()
        .validateComplete('Complete the card number.'),
      expiry: field
        .masked(MASKS.EXPIRY)
        .label('Expiry')
        .required('Expiry date is required')
        .showMaskInPlaceholder()
        .validateComplete('Complete the expiry date.'),
      cvv: field
        .masked(MASKS.CVV)
        .label('CVV')
        .required('CVV is required')
        .showMaskInPlaceholder()
        .validateComplete('Complete the CVV.'),
    };
  }, []);

  const checkoutForm = useFormBridge(checkoutSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalStyles: () => createDemoFormUi(styles),
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
              // readOnly
              // highlightOnError={false}
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
              <div>
                <fields.city />
              </div>
              <fields.customerCode {...compactFieldUi} />
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
                <fields.expiry {...compactFieldUi} />
                <fields.cvv />
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

import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { field, useFormBridge } from '@runilib/react-formbridge';

import * as Haptics from 'expo-haptics';
import { formExampleStyles as s } from './FormExamples.styles';
import { CUSTOMER_DEPARTMENTS, createNativeFormUi, simulateSubmitDelay } from './shared';

export function CustomerCheckoutExample() {
  const [submittedCustomer, setSubmittedCustomer] = useState<Record<
    string,
    unknown
  > | null>(null);

  const customerSchema = useMemo(
    () => ({
      firstName: field.text('Prenom').required('Required').trim(),
      lastName: field.text('Nom').required('Required').trim(),
      email: field.email('Email').required('Required').trim().lowercase(),
      phone: field.tel('Telephone').required('Required'),
      department: field
        .select('Departement')
        .options(CUSTOMER_DEPARTMENTS)
        .required('Required'),
      city: field.text('Ville').required('Required').trim(),
      customerCode: field
        .masked('Customer code', 'LL-9999')
        .tokens({
          L: /[A-Z]/,
        })
        .required('Required')
        .showMaskInPlaceholder()
        .uppercase()
        .validateComplete('Incomplete customer code')
        .hint('Custom mask example: two uppercase letters and four digits.'),
      cardNumber: field
        .masked('Numero de carte', 'CARD_16')
        .required('Required')
        .showMaskInPlaceholder()
        .validateComplete('Incomplete card number'),
      expiry: field
        .masked("Date d'expiration", 'EXPIRY')
        .required('Required')
        .showMaskInPlaceholder()
        .validateComplete('Incomplete expiry'),
      cvv: field
        .masked('CVV', 'CVV')
        .required('Required')
        .showMaskInPlaceholder()
        .validateComplete('Incomplete CVV'),
    }),
    [],
  );

  const customerForm = useFormBridge(customerSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalAppearance: createNativeFormUi(),
    persist: {
      key: 'mobile-customer-checkout',
      storage: 'local',
    },
  });

  const { Form, fields, state, watchAll } = customerForm;

  const customerFieldCount = Object.keys(customerSchema).length;
  const liveCustomer = watchAll();
  const completion = Object.values(liveCustomer).filter((value) =>
    typeof value === 'string' ? value.trim().length > 0 : Boolean(value),
  ).length;
  const departmentLabel =
    CUSTOMER_DEPARTMENTS.find((item) => item.value === liveCustomer.department)?.label ??
    'Select a department';
  const cardPreview = liveCustomer.cardNumber
    ? String(liveCustomer.cardNumber).replace(/\s+/g, '').slice(-4)
    : '1842';

  return (
    <View style={s.sectionCard}>
      <View style={s.customerHeader}>
        <View>
          <Text style={s.customerEyebrow}>react-formbridge demo</Text>
          <Text style={s.customerTitle}>Customer checkout</Text>
          <Text style={s.customerSubtitle}>
            A polished schema-driven form for contact and payment details.
          </Text>
        </View>
        <View style={s.customerPill}>
          <Text style={s.customerPillText}>
            {completion}/{customerFieldCount} ready
          </Text>
        </View>
      </View>

      <View style={s.customerPreview}>
        <View>
          <Text style={s.customerPreviewLabel}>Card preview</Text>
          <Text style={s.customerPreviewNumber}>•••• •••• •••• {cardPreview}</Text>
        </View>
        <View style={s.customerPreviewMeta}>
          <Text style={s.customerPreviewMetaText}>
            {liveCustomer.firstName || 'First'} {liveCustomer.lastName || 'Last'}
          </Text>
          <Text style={s.customerPreviewMetaText}>{liveCustomer.expiry || 'MM/YY'}</Text>
        </View>
        <Text style={s.customerPreviewDepartment}>{departmentLabel}</Text>
      </View>

      {submittedCustomer ? (
        <View style={s.successBox}>
          <Text style={s.successText}>
            Saved for {String(submittedCustomer.firstName ?? 'customer')}
          </Text>
        </View>
      ) : null}

      <Form
        onSubmit={async (values) => {
          await simulateSubmitDelay(700);
          setSubmittedCustomer(values as Record<string, unknown>);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      >
        <View style={s.sectionBlock}>
          <Text style={s.sectionBlockTitle}>Contact</Text>

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.firstName />
            </View>
            <View style={s.halfField}>
              <fields.lastName />
            </View>
          </View>

          <fields.email />
          <fields.phone />

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.department />
            </View>
            <View style={s.halfField}>
              <fields.city />
            </View>
          </View>

          <fields.customerCode />
        </View>

        <View style={s.sectionBlock}>
          <Text style={s.sectionBlockTitle}>Payment</Text>
          <fields.cardNumber
            appearance={{
              styles: {
                input: {
                  letterSpacing: 1.8,
                },
              },
            }}
          />

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.expiry />
            </View>
            <View style={s.halfField}>
              <fields.cvv />
            </View>
          </View>

          <View style={s.tips}>
            <Text style={s.tip}>Masked card number</Text>
            <Text style={s.tip}>Custom customer code</Text>
            <Text style={s.tip}>Formatted expiry and CVV values</Text>
            <Text style={s.tip}>Draft saved locally</Text>
          </View>
        </View>

        {state.submitError ? (
          <View style={s.errorBox}>
            <Text style={s.errorText}>{state.submitError}</Text>
          </View>
        ) : null}

        <Form.Submit
          style={s.submitButton}
          loadingText="Saving customer..."
        >
          Save customer
        </Form.Submit>
      </Form>
    </View>
  );
}

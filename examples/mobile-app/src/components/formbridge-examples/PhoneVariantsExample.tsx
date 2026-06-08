import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { field, type PhoneValue, useFormBridge } from '@/src/demoFormBridge';

import { FieldVariantCard } from './FieldVariantCard';
import { formExampleStyles as s } from './FormExamples.styles';
import { createNativeFormUi, simulateSubmitDelay } from './shared';

type PhoneVariantValues = {
  supportLine: PhoneValue | null;
  salesHotline: string | null;
  executiveDesk: PhoneValue | null;
};

function describePhone(value: PhoneValue | string | null | undefined): string {
  if (!value) {
    return 'Nothing selected yet';
  }

  if (typeof value === 'string') {
    return value;
  }

  return `${value.country} · ${value.e164 || value.national}`;
}

function countResolvedPhones(values: PhoneVariantValues): number {
  return [values.supportLine, values.salesHotline, values.executiveDesk].filter(Boolean)
    .length;
}

export function PhoneVariantsExample() {
  const [lastSubmission, setLastSubmission] = useState<PhoneVariantValues | null>(null);

  const schema = useMemo(
    () => ({
      supportLine: field
        .phone('Support line')
        .required()
        .defaultCountry('FR')
        .countryLayout('detached')
        .preferredCountries(['FR', 'BE', 'CH', 'CA'])
        .hint(
          'Searchable picker with custom country rows and a friendlier support-routing summary.',
        ),
      salesHotline: field
        .phone('Sales hotline')
        .required()
        .defaultCountry('US')
        .countryLayout('integrated')
        .preferredCountries(['US', 'CA', 'GB'])
        .storeE164()
        .hint(
          'Stores a plain E.164 string while the picker copy stays product-specific.',
        ),
      executiveDesk: field
        .phone('Executive desk')
        .defaultCountry('GB')
        .countryLayout('integrated')
        .preferredCountries(['GB', 'AE', 'SG'])
        .showDialCode(false)
        .hint('Minimal country trigger and cleaner directory formatting.'),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalDefaults: () => {
      const baseUi = createNativeFormUi();
      const baseInputStyle =
        (baseUi.field?.styles &&
        typeof baseUi.field.styles === 'object' &&
        'phoneInput' in baseUi.field.styles
          ? baseUi.field.styles.phoneInput
          : undefined) ?? {};

      return {
        ...baseUi,
        submit: {
          ...baseUi.submit,
          loadingText: 'Saving phone playbook...',
        },
        field: {
          ...baseUi.field,
          styles: {
            ...baseUi.field?.styles,
            phoneInput: {
              ...(typeof baseInputStyle === 'object' ? baseInputStyle : {}),
              flex: 1,
              borderColor: 'rgba(96, 165, 250, 0.22)',
              backgroundColor: '#ffffff',
              color: '#10203a',
            },
            phoneCountryFlag: {
              fontSize: 16,
            },
            phoneCountryDial: {
              color: '#93c5fd',
              fontSize: 12,
              fontWeight: '700',
            },
            phoneChevron: {
              color: '#93c5fd',
              fontSize: 12,
            },
            phoneCountryDivider: {
              backgroundColor: 'rgba(96, 165, 250, 0.16)',
            },
            phoneE164: {
              color: '#64748b',
              fontSize: 12,
            },
            phoneModalBackdrop: {
              flex: 1,
              backgroundColor: 'rgba(2, 6, 23, 0.62)',
              justifyContent: 'center',
              padding: 18,
            },
            phoneModalCard: {
              maxHeight: '78%',
              borderRadius: 22,
              backgroundColor: '#ffffff',
              borderWidth: 1,
              borderColor: 'rgba(148, 163, 184, 0.18)',
              padding: 14,
              gap: 12,
            },
            phoneSearchInput: {
              borderRadius: 14,
              borderWidth: 1,
              borderColor: 'rgba(148, 163, 184, 0.16)',
              backgroundColor: '#f8fbff',
              color: '#10203a',
              paddingHorizontal: 14,
              paddingVertical: 12,
            },
            phoneSeparator: {
              height: 1,
              marginVertical: 6,
              backgroundColor: 'rgba(148, 163, 184, 0.12)',
            },
            phoneCountryRow: {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingHorizontal: 12,
              paddingVertical: 12,
            },
            phoneCountryName: {
              flex: 1,
              color: '#10203a',
              fontSize: 13,
              fontWeight: '700',
            },
            phoneEmptyText: {
              color: '#64748b',
              fontSize: 12,
              textAlign: 'center',
              paddingVertical: 18,
            },
          },
        },
      };
    },
  });

  const { Form, fields, watchAll } = form;
  const values = watchAll() as PhoneVariantValues;
  const resolvedCount = countResolvedPhones(values);

  return (
    <FieldVariantCard
      familyName="Phone"
      accent="#22c55e"
      title="Country pickers, integrated layouts, and custom routing language"
      description="These phone recipes keep the built-in renderer, but now let you choose whether the country trigger stays integrated with the input or sits as a detached picker beside it."
      highlights={[
        'integrated or detached layout',
        'custom country trigger',
        'custom option rows',
        'search empty state',
        'custom E.164 helper',
      ]}
      preview={
        <>
          <Text style={s.previewValue}>{resolvedCount} routes resolved</Text>
          <Text style={s.previewText}>
            Support: {describePhone(values.supportLine)}. Sales:{' '}
            {describePhone(values.salesHotline)}. Executive:{' '}
            {describePhone(values.executiveDesk)}.
          </Text>
        </>
      }
      snapshot={lastSubmission ?? values}
      submittedLabel={
        lastSubmission ? 'Saved the phone playbook with all three routing recipes.' : null
      }
      footer="Use the builder for country behavior and storage, then choose an integrated or detached trigger layout and tailor the picker copy with phone overrides."
    >
      <Form
        onSubmit={async (submittedValues) => {
          await simulateSubmitDelay(320);
          setLastSubmission(submittedValues as PhoneVariantValues);
        }}
      >
        <fields.supportLine
          {...{
            styles: {
              phoneRow: {
                flexDirection: 'row',
                alignItems: 'stretch',
                gap: 12,
              },
              phoneCountryButton: {
                minWidth: 128,
                minHeight: 54,
                paddingHorizontal: 14,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: 'rgba(96, 165, 250, 0.22)',
                backgroundColor: '#ffffff',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              },
            },
            countryButtonAriaLabel: 'Select support market',
            searchPlaceholderText: 'Search support market',
            renderCountryButtonContent: ({ currentCountry, defaultContent }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  flex: 1,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text>{currentCountry.flag}</Text>
                  <Text style={{ color: '#10203a', fontWeight: '700', fontSize: 12 }}>
                    {currentCountry.code}
                  </Text>
                </View>
                {typeof defaultContent === 'string' ? (
                  <Text style={{ color: '#93c5fd', fontSize: 12 }}>{defaultContent}</Text>
                ) : (
                  defaultContent
                )}
              </View>
            ),
            renderCountryItemContent: ({ country, selected }) => (
              <>
                <Text>{country.flag}</Text>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ color: '#10203a', fontSize: 13, fontWeight: '700' }}>
                    {country.name}
                  </Text>
                  <Text style={{ color: '#64748b', fontSize: 11 }}>
                    {selected
                      ? 'Currently routing support here'
                      : 'Available support market'}
                  </Text>
                </View>
                <Text style={{ color: '#86efac', fontSize: 12, fontWeight: '700' }}>
                  +{country.dial}
                </Text>
              </>
            ),
            renderE164: ({ e164 }) => (
              <Text style={{ color: '#86efac', fontSize: 12 }}>Stored route {e164}</Text>
            ),
          }}
        />

        <fields.salesHotline
          {...{
            styles: {
              phoneRow: {
                borderColor: 'rgba(96, 165, 250, 0.22)',
                backgroundColor: '#ffffff',
              },
              phoneCountryButton: {
                minWidth: 122,
              },
              phoneInput: {
                color: '#10203a',
              },
            },
            countryButtonAriaLabel: 'Choose the sales market',
            searchPlaceholderText: 'Search revenue market',
            emptySearchText: ({ search }) => `No sales market found for "${search}"`,
            renderCountryButtonContent: ({ currentCountry }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  flex: 1,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text>{currentCountry.flag}</Text>
                  <Text style={{ color: '#10203a', fontWeight: '700', fontSize: 12 }}>
                    Sales
                  </Text>
                </View>
                <Text style={{ color: '#93c5fd', fontSize: 12 }}>
                  +{currentCountry.dial}
                </Text>
              </View>
            ),
            renderCountryItemContent: ({ country, selected }) => (
              <>
                <Text>{country.flag}</Text>
                <Text
                  style={{ flex: 1, color: '#10203a', fontSize: 13, fontWeight: '700' }}
                >
                  {country.name}
                </Text>
                <Text
                  style={{
                    color: selected ? '#fbbf24' : '#93c5fd',
                    fontSize: 12,
                    fontWeight: '700',
                  }}
                >
                  {selected ? 'ACTIVE' : `+${country.dial}`}
                </Text>
              </>
            ),
            e164Text: ({ e164 }) => `CRM storage: ${e164}`,
          }}
        />

        <fields.executiveDesk
          {...{
            styles: {
              phoneRow: {
                borderColor: 'rgba(148, 163, 184, 0.2)',
                backgroundColor: '#ffffff',
              },
              phoneCountryButton: {
                minWidth: 94,
              },
              phoneInput: {
                color: '#10203a',
              },
            },
            renderCountryButtonContent: ({ currentCountry }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  flex: 1,
                }}
              >
                <Text style={{ color: '#10203a', fontWeight: '700', fontSize: 12 }}>
                  {currentCountry.name}
                </Text>
                <Text style={{ color: '#93c5fd', fontSize: 12 }}>▾</Text>
              </View>
            ),
            renderE164: ({ e164 }) => (
              <Text style={{ color: '#5f6f88', fontSize: 12 }}>
                Directory format: {e164}
              </Text>
            ),
          }}
        />

        <Form.Submit>Save phone playbook</Form.Submit>
      </Form>
    </FieldVariantCard>
  );
}

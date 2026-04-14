import { useMemo, useState } from 'react';

import { field, type PhoneValue, useFormBridge } from '@runilib/react-formbridge';

import { FieldVariantFrame } from './FieldVariantFrame';
import styles from './FormExamples.module.css';
import { createDemoFormUi, simulateSubmitDelay } from './shared';

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
          'Searchable country picker with a richer trigger, custom option rows, and formatted storage preview.',
        ),
      salesHotline: field
        .phone('Sales hotline')
        .required()
        .defaultCountry('US')
        .countryLayout('integrated')
        .preferredCountries(['US', 'CA', 'GB'])
        .storeE164()
        .hint(
          'Stores a plain E.164 string while still letting the UI speak in market-specific language.',
        ),
      executiveDesk: field
        .phone('Executive desk')
        .defaultCountry('GB')
        .countryLayout('integrated')
        .preferredCountries(['GB', 'AE', 'SG'])
        .showDialCode(false)
        .hint(
          'Minimal country trigger with a cleaner summary and a more editorial E.164 helper.',
        ),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalConfigs: () => {
      const baseUi = createDemoFormUi(styles);
      const baseInputStyle =
        (baseUi.field?.styles &&
        typeof baseUi.field.styles === 'object' &&
        'input' in baseUi.field.styles
          ? baseUi.field.styles.input
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
            input: {
              ...(typeof baseInputStyle === 'object' ? baseInputStyle : {}),
              width: '100%',
              color: '#10203a',
              border: '1px solid rgba(96, 165, 250, 0.22)',
              background: '#ffffff',
            },
            countryFlag: {
              fontSize: 16,
            },
            chevron: {
              color: '#93c5fd',
              fontSize: 12,
            },
            countryDivider: {
              background: 'rgba(96, 165, 250, 0.16)',
            },
            countryList: {
              width: 320,
              marginTop: 8,
              borderRadius: 20,
              border: '1px solid rgba(148, 163, 184, 0.18)',
              background: '#ffffff',
              boxShadow: '0 18px 50px rgba(15, 23, 42, 0.14)',
              overflow: 'hidden',
            },
            countrySearchWrapper: {
              padding: '12px 12px 0',
            },
            countrySearchInput: {
              width: '100%',
              borderRadius: 14,
              border: '1px solid rgba(148, 163, 184, 0.16)',
              background: '#f8fbff',
              color: '#10203a',
              padding: '12px 14px',
            },
            countryScroll: {
              maxHeight: 260,
              overflowY: 'auto',
              display: 'grid',
            },
            separator: {
              height: 1,
              margin: '4px 12px',
              background: 'rgba(148, 163, 184, 0.12)',
            },
            countryItem: {
              display: 'grid',
              gridTemplateColumns: '24px minmax(0, 1fr) auto',
              gap: 10,
              alignItems: 'center',
              padding: '12px 14px',
              border: 'none',
              borderRadius: 0,
              background: 'transparent',
              color: '#10203a',
              textAlign: 'left',
            },
            countryName: {
              color: '#10203a',
              fontSize: 13,
              fontWeight: 600,
            },
            countryDial: {
              color: '#93c5fd',
              fontSize: 12,
              fontWeight: 700,
            },
            emptyText: {
              margin: 0,
              padding: '18px 16px',
              color: '#64748b',
              fontSize: 12,
            },
            e164: {
              color: '#64748b',
              fontSize: 12,
              lineHeight: 1.6,
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
    <FieldVariantFrame
      familyName="Phone"
      accent="#22c55e"
      title="Country pickers, integrated layouts, and custom market language"
      description="The phone field now supports both integrated and detached country triggers, plus the same kind of copy and render overrides as the password and file fields."
      highlights={[
        'integrated or detached layout',
        'custom country trigger',
        'custom option rows',
        'search empty state',
        'custom E.164 helper',
      ]}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>{resolvedCount} routes resolved</p>
          <p className={styles.resolverPreviewMuted}>
            Support: {describePhone(values.supportLine)}. Sales:{' '}
            {describePhone(values.salesHotline)}. Executive:{' '}
            {describePhone(values.executiveDesk)}.
          </p>
        </>
      }
      snapshot={lastSubmission ?? values}
      submittedLabel={
        lastSubmission ? 'Saved the phone playbook with all three routing recipes.' : null
      }
      footer="Use the phone builder for country behavior and storage, then pick an integrated or detached trigger layout and make the picker sound like your product instead of a generic telecom widget."
    >
      <Form
        className={styles.resolverForm}
        onSubmit={async (submittedValues) => {
          await simulateSubmitDelay(320);
          setLastSubmission(submittedValues as PhoneVariantValues);
        }}
      >
        <fields.supportLine
          {...{
            styles: {
              row: {
                display: 'grid',
                gridTemplateColumns: '132px minmax(0, 1fr)',
                gap: 12,
                alignItems: 'stretch',
              },
              countryButton: {
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                minHeight: 54,
                padding: '0 14px',
                borderRadius: 16,
                border: '1px solid rgba(96, 165, 250, 0.22)',
                background: '#ffffff',
                color: '#10203a',
                fontWeight: 700,
              },
            },
            countryButtonAriaLabel: 'Select support market',
            searchPlaceholderText: 'Search support market',
            renderCountryButtonContent: ({ currentCountry, defaultContent }) => (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  width: '100%',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span aria-hidden="true">{currentCountry.flag}</span>
                  <span>{currentCountry.code}</span>
                </span>
                <span>{defaultContent}</span>
              </span>
            ),
            renderCountryItemContent: ({ country, selected }) => (
              <>
                <span aria-hidden="true">{country.flag}</span>
                <span
                  style={{
                    display: 'grid',
                    gap: 2,
                  }}
                >
                  <span style={{ color: '#10203a', fontSize: 13, fontWeight: 700 }}>
                    {country.name}
                  </span>
                  <span style={{ color: '#64748b', fontSize: 11 }}>
                    {selected
                      ? 'Currently routing support here'
                      : 'Available support market'}
                  </span>
                </span>
                <span style={{ color: '#86efac', fontSize: 12, fontWeight: 700 }}>
                  +{country.dial}
                </span>
              </>
            ),
            renderE164: ({ e164 }) => (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#86efac',
                  fontSize: 12,
                }}
              >
                <span aria-hidden="true">↳</span>
                Stored route {e164}
              </span>
            ),
          }}
        />

        <fields.salesHotline
          {...{
            styles: {
              row: {
                borderColor: 'rgba(96, 165, 250, 0.22)',
                background: '#ffffff',
              },
              countryButton: {
                minWidth: 122,
                color: '#10203a',
                fontWeight: 700,
              },
              input: {
                color: '#10203a',
              },
            },
            countryButtonAriaLabel: 'Choose the sales market',
            searchPlaceholderText: 'Search revenue market',
            emptySearchText: ({ search }) => `No sales market found for "${search}"`,
            renderCountryButtonContent: ({ currentCountry }) => (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  width: '100%',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span aria-hidden="true">{currentCountry.flag}</span>
                  <span>Sales</span>
                </span>
                <span style={{ color: '#93c5fd' }}>+{currentCountry.dial}</span>
              </span>
            ),
            renderCountryItemContent: ({ country, selected }) => (
              <>
                <span aria-hidden="true">{country.flag}</span>
                <span style={{ color: '#10203a', fontSize: 13, fontWeight: 700 }}>
                  {country.name}
                </span>
                <span
                  style={{
                    color: selected ? '#fbbf24' : '#93c5fd',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {selected ? 'ACTIVE' : `+${country.dial}`}
                </span>
              </>
            ),
            e164Text: ({ e164 }) => `CRM storage: ${e164}`,
          }}
        />

        <fields.executiveDesk
          {...{
            styles: {
              row: {
                borderColor: 'rgba(148, 163, 184, 0.2)',
                background: '#ffffff',
              },
              countryButton: {
                minWidth: 94,
                color: '#10203a',
                fontWeight: 700,
              },
              input: {
                color: '#10203a',
              },
            },
            renderCountryButtonContent: ({ currentCountry }) => (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  width: '100%',
                }}
              >
                <span>{currentCountry.name}</span>
                <span style={{ color: '#93c5fd' }}>▾</span>
              </span>
            ),
            renderE164: ({ e164 }) => (
              <span style={{ color: '#5f6f88', fontSize: 12 }}>
                Directory format: {e164}
              </span>
            ),
          }}
        />

        <Form.Submit>Save phone playbook</Form.Submit>
      </Form>
    </FieldVariantFrame>
  );
}

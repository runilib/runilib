import type React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { field } from '../../../core/field-builders/field';
import {
  buildPhoneValue,
  getCountry,
} from '../../../core/field-builders/phone/countries';
import { PhoneInput } from '../PhoneInput';

function renderPhoneField(
  builder: ReturnType<typeof field.phone>,
  overrides?: Partial<React.ComponentProps<typeof PhoneInput>>,
) {
  const descriptor = builder._build();
  const resolvedDescriptor = {
    ...descriptor,
    fieldPropsFromClient: {},
  } as React.ComponentProps<typeof PhoneInput>['descriptor'];

  return render(
    <PhoneInput
      descriptor={resolvedDescriptor}
      name="phone"
      value={null}
      label={descriptor._label ?? ''}
      placeholder={descriptor._placeholder}
      allValues={{}}
      error={null}
      touched={false}
      dirty={false}
      validating={false}
      disabled={false}
      required={Boolean(descriptor._required)}
      hint={descriptor._hint}
      onChange={() => {}}
      onBlur={() => {}}
      onFocus={() => {}}
      {...overrides}
    />,
  );
}

describe('WebPhoneInput ui', () => {
  it('uses the integrated layout by default and supports detached overrides', () => {
    const { container, rerender } = renderPhoneField(field.phone('Phone'));

    expect(container.firstElementChild?.getAttribute('data-fb-layout')).toBe(
      'integrated',
    );

    const descriptor = field.phone('Phone')._build();
    const resolvedDescriptor = {
      ...descriptor,
      fieldPropsFromClient: {},
    } as React.ComponentProps<typeof PhoneInput>['descriptor'];

    rerender(
      <PhoneInput
        descriptor={resolvedDescriptor}
        name="phone"
        value={null}
        label={descriptor._label ?? ''}
        placeholder={descriptor._placeholder}
        allValues={{}}
        error={null}
        touched={false}
        dirty={false}
        validating={false}
        disabled={false}
        required={Boolean(descriptor._required)}
        hint={descriptor._hint}
        onChange={() => {}}
        onBlur={() => {}}
        onFocus={() => {}}
        extra={{ countryLayout: 'detached' }}
      />,
    );

    expect(container.firstElementChild?.getAttribute('data-fb-layout')).toBe('detached');
  });

  it('supports custom button, option, empty-search, and e164 rendering', () => {
    const country = getCountry('FR');

    if (!country) {
      throw new Error('Expected FR to be available in the phone country list.');
    }

    const value = buildPhoneValue(country, '06 12 34 56 78');

    const { getByRole, getByPlaceholderText, getByTestId, getByText } = renderPhoneField(
      field.phone('Phone').preferredCountries(['FR', 'US']).searchable(),
      {
        value,
        extra: {
          countryButtonAriaLabel: 'Pick a market',
          searchPlaceholderText: 'Find a market',
          emptySearchText: ({ search }) => `No matches for ${search}`,
          renderCountryButtonContent: ({ currentCountry }) => (
            <span data-testid="phone-button-content">{currentCountry.code}</span>
          ),
          renderCountryItemContent: ({ country, selected }) => (
            <span data-testid={`phone-option-${country.code}`}>
              {selected ? 'selected' : 'option'}-{country.code}
            </span>
          ),
          renderE164: ({ e164 }) => (
            <strong data-testid="phone-e164">Stored as {e164}</strong>
          ),
        },
      },
    );

    expect(getByTestId('phone-button-content').textContent).toBe('FR');
    expect(getByTestId('phone-e164').textContent).toContain('+33612345678');

    fireEvent.click(getByRole('button', { name: 'Pick a market' }));

    getByTestId('phone-option-FR');

    const searchInput = getByPlaceholderText('Find a market');
    fireEvent.change(searchInput, { target: { value: 'zzz' } });

    getByText('No matches for zzz');
  });

  it('lets runtime input styles override integrated defaults', () => {
    const { getByRole } = renderPhoneField(field.phone('Phone'), {
      extra: {
        styles: {
          input: {
            padding: '32px',
            color: 'rgb(1, 2, 3)',
          },
        },
      },
    });

    const input = getByRole('textbox') as HTMLInputElement;

    expect(input.style.padding).toBe('32px');
    expect(input.style.color).toBe('rgb(1, 2, 3)');
  });
});

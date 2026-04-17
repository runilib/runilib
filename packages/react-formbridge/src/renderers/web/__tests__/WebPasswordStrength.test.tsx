import type React from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { field } from '../../../core/field-builders/field';
import { PasswordStrength } from '../PasswordStrength';

function renderPasswordField(
  builder: ReturnType<typeof field.password>,
  overrides?: Partial<React.ComponentProps<typeof PasswordStrength>>,
) {
  const descriptor = builder._build();
  const resolvedDescriptor = {
    ...descriptor,
    fieldPropsFromClient: {},
  } as React.ComponentProps<typeof PasswordStrength>['strengthMeta'];

  return render(
    <PasswordStrength
      strengthMeta={resolvedDescriptor}
      name="password"
      value=""
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

describe('WebPasswordStrength', () => {
  it('can hide the rules once the password is valid', () => {
    const { queryByRole, queryByText } = renderPasswordField(
      field.password('Password').withStrengthIndicator({
        showRules: true,
        hideRulesWhenValid: true,
      }),
      {
        value: 'Abcdef1!',
      },
    );

    expect(queryByRole('list')).toBeNull();
    expect(queryByText(/uppercase letter/i)).toBeNull();
  });

  it('keeps the rules visible while the password is still invalid', () => {
    const { getByRole, getByText } = renderPasswordField(
      field.password('Password').withStrengthIndicator({
        showRules: true,
        hideRulesWhenValid: true,
      }),
      {
        value: 'abc',
      },
    );

    expect(getByRole('list')).toBeTruthy();
    getByText(/uppercase letter/i);
  });

  it('uses a minimal default input style and toggle chrome', () => {
    const { container } = renderPasswordField(field.password('Password'));

    const input = container.querySelector('[data-fb-slot="input"]');
    const toggle = container.querySelector('[data-fb-slot="toggle"]');

    expect(input instanceof HTMLInputElement).toBe(true);
    expect(toggle instanceof HTMLButtonElement).toBe(true);

    if (!(input instanceof HTMLInputElement) || !(toggle instanceof HTMLButtonElement)) {
      throw new TypeError('Expected password input and toggle to render.');
    }

    expect(input.style.width).toBe('100%');
    expect(input.style.paddingTop).toBe('8px');
    expect(input.style.paddingLeft).toBe('12px');
    expect(input.style.paddingRight).toBe('44px');
    expect(input.style.borderWidth).toBe('1px');
    expect(toggle.style.position).toBe('absolute');
    expect(toggle.style.right).toBe('10px');
    expect(toggle.style.backgroundColor).toBe('transparent');
  });

  it('lets generic textInput and passwordInput styles override the defaults', () => {
    const { container } = renderPasswordField(field.password('Password'), {
      extra: {
        styles: {
          textInput: {
            padding: '20px',
            backgroundColor: 'rgb(10, 11, 12)',
          },
          passwordInput: {
            paddingRight: '120px',
            borderRadius: 14,
          },
          passwordToggle: {
            right: 20,
            backgroundColor: 'rgb(20, 21, 22)',
          },
        },
      },
    });

    const input = container.querySelector('[data-fb-slot="input"]');
    const toggle = container.querySelector('[data-fb-slot="toggle"]');

    expect(input instanceof HTMLInputElement).toBe(true);
    expect(toggle instanceof HTMLButtonElement).toBe(true);

    if (!(input instanceof HTMLInputElement) || !(toggle instanceof HTMLButtonElement)) {
      throw new TypeError('Expected password input and toggle to render.');
    }

    expect(input.style.paddingTop).toBe('20px');
    expect(input.style.paddingLeft).toBe('20px');
    expect(input.style.paddingRight).toBe('120px');
    expect(input.style.borderRadius).toBe('14px');
    expect(input.style.backgroundColor).toBe('rgb(10, 11, 12)');
    expect(toggle.style.right).toBe('20px');
    expect(toggle.style.backgroundColor).toBe('rgb(20, 21, 22)');
  });
});

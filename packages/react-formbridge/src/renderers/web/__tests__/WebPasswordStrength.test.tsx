import type React from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { field } from '../../../core/field-builders/field';
import { resolveWebFieldConfig } from '../../../hooks/shared/ui-utils';
import { PasswordStrength } from '../PasswordStrength';

function renderPasswordField(
  builder: ReturnType<typeof field.password>,
  overrides?: Partial<React.ComponentProps<typeof PasswordStrength>>,
) {
  const descriptor = builder._build();
  const resolvedDescriptor = {
    ...descriptor,
    _ui: resolveWebFieldConfig(descriptor._behavior),
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
});

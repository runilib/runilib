import type React from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { field } from '../../../core/field-builders/field';
import { resolveWebFieldConfig } from '../../../hooks/shared/ui-utils';
import { Field } from '../Field';

function renderTextField(
  builder: ReturnType<typeof field.text>,
  overrides?: Partial<React.ComponentProps<typeof Field>>,
) {
  const { required: requiredOverride, ...restOverrides } = overrides ?? {};
  const descriptor = builder._build();
  const resolvedDescriptor = {
    ...descriptor,
    _ui: resolveWebFieldConfig(descriptor._behavior),
  } as React.ComponentProps<typeof Field>['descriptor'];

  return render(
    <Field
      descriptor={resolvedDescriptor}
      name="value"
      value=""
      label={descriptor._label ?? ''}
      placeholder={descriptor._placeholder}
      allValues={{}}
      error={null}
      touched={false}
      dirty={false}
      validating={false}
      disabled={false}
      required={requiredOverride ?? Boolean(descriptor._required)}
      hint={descriptor._hint}
      onChange={() => {}}
      onBlur={() => {}}
      onFocus={() => {}}
      {...restOverrides}
    />,
  );
}

describe('WebField ui', () => {
  it('keeps text inputs minimally styled by default', () => {
    const { getByRole, getByText } = renderTextField(
      field.text().label('Name').required(),
    );

    const input = getByRole('textbox') as HTMLInputElement;
    const label = getByText('Name');

    expect(input.style.padding).toBe('');
    expect(input.style.borderRadius).toBe('');
    expect(input.style.width).toBe('');
    expect(label.style.fontWeight).toBe('');
  });

  it('supports styling through runtime ui overrides', () => {
    const { getByRole, getByText } = renderTextField(field.text().label('Email'), {
      extra: {
        styles: {
          root: { marginTop: '9px' },
          label: { fontWeight: 700 },
          input: { padding: '24px', borderRadius: 12 },
        },
      },
    });

    const input = getByRole('textbox') as HTMLInputElement;
    const label = getByText('Email');
    const root = label.closest('div');

    expect(input.style.padding).toBe('24px');
    expect(input.style.borderRadius).toBe('12px');
    expect(label.style.fontWeight).toBe('700');
    expect(root?.style.marginTop).toBe('9px');
  });

  it('adds red error chrome by default when a field is invalid', () => {
    const { getByRole } = renderTextField(field.text().required(), {
      error: 'Required field',
    });

    const input = getByRole('textbox') as HTMLInputElement;

    expect(input.style.borderColor).toBe('rgb(239, 68, 68)');
  });

  it('can suppress the default red error chrome', () => {
    const { getByRole } = renderTextField(field.text().required(), {
      error: 'Required field',
      extra: {
        highlightOnError: false,
      },
    });

    const input = getByRole('textbox') as HTMLInputElement;

    expect(input.style.borderColor).toBe('');
  });
});

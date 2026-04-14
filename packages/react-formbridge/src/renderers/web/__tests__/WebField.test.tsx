import type React from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { field } from '../../../core/field-builders/field';
import { Field } from '../Field';

function renderTextField(
  builder: ReturnType<typeof field.text>,
  overrides?: Partial<React.ComponentProps<typeof Field>>,
) {
  const { required: requiredOverride, ...restOverrides } = overrides ?? {};
  const descriptor = builder._build();
  const resolvedDescriptor = {
    ...descriptor,
    fieldPropsFromClient: {},
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

describe('WebField', () => {
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

    expect(input.style.padding).toBe('24px');
    expect(input.style.borderRadius).toBe('12px');
    expect(label.style.fontWeight).toBe('700');
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

  it('supports dedicated switch button slot overrides', () => {
    const descriptor = field.switch('Enable feature')._build();
    const resolvedDescriptor = {
      ...descriptor,
      fieldPropsFromClient: {},
    } as React.ComponentProps<typeof Field>['descriptor'];

    const { container } = render(
      <Field
        descriptor={resolvedDescriptor}
        name="feature"
        value={false}
        label={descriptor._label ?? ''}
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
        extra={{
          styles: {
            switchButton: { backgroundColor: 'rgb(1, 2, 3)' },
          },
        }}
      />,
    );

    const button = container.querySelector('[data-fb-slot="switch-button"]');

    expect(button instanceof HTMLButtonElement).toBe(true);

    if (!(button instanceof HTMLButtonElement)) {
      throw new TypeError('Expected switch button to render.');
    }

    expect(button.style.backgroundColor).toBe('rgb(1, 2, 3)');
  });

  it('supports dedicated radio slot overrides', () => {
    const descriptor = field
      .radio('Role')
      .options([
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ])
      ._build();
    const resolvedDescriptor = {
      ...descriptor,
      fieldPropsFromClient: {},
    } as React.ComponentProps<typeof Field>['descriptor'];

    const { container } = render(
      <Field
        descriptor={resolvedDescriptor}
        name="role"
        value="admin"
        label={descriptor._label ?? ''}
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
        extra={{
          styles: {
            radioGroup: { display: 'grid' },
            radioOption: { padding: '4px' },
            radioInput: { marginTop: '3px' },
            radioLabel: { color: 'rgb(4, 5, 6)' },
          },
        }}
      />,
    );

    const group = container.querySelector('[data-fb-slot="radio-group"]');
    const option = container.querySelector('[data-fb-slot="radio-option"]');
    const input = container.querySelector('[data-fb-slot="radio-input"]');
    const label = container.querySelector('[data-fb-slot="radio-label"]');

    expect(group instanceof HTMLDivElement).toBe(true);
    expect(option instanceof HTMLLabelElement).toBe(true);
    expect(input instanceof HTMLInputElement).toBe(true);
    expect(label instanceof HTMLSpanElement).toBe(true);

    if (
      !(group instanceof HTMLDivElement) ||
      !(option instanceof HTMLLabelElement) ||
      !(input instanceof HTMLInputElement) ||
      !(label instanceof HTMLSpanElement)
    ) {
      throw new TypeError('Expected radio slots to render.');
    }

    expect(group.style.display).toBe('grid');
    expect(option.style.padding).toBe('4px');
    expect(input.style.marginTop).toBe('3px');
    expect(label.style.color).toBe('rgb(4, 5, 6)');
  });

  it('gives OTP fields a sensible default OTP layout', () => {
    const descriptor = field.otp('Enter code').length(5)._build();
    const resolvedDescriptor = {
      ...descriptor,
      fieldPropsFromClient: {},
    } as React.ComponentProps<typeof Field>['descriptor'];

    const { container } = render(
      <Field
        descriptor={resolvedDescriptor}
        name="code"
        value=""
        label={descriptor._label ?? ''}
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
      />,
    );

    const otpContainer = container.querySelector('[data-fb-slot="otp-container"]');
    const otpInput = container.querySelector('[data-fb-slot="otp-input"]');

    expect(otpContainer instanceof HTMLDivElement).toBe(true);
    expect(otpInput instanceof HTMLInputElement).toBe(true);

    if (
      !(otpContainer instanceof HTMLDivElement) ||
      !(otpInput instanceof HTMLInputElement)
    ) {
      throw new TypeError('Expected OTP container and inputs to render.');
    }

    expect(otpContainer.style.display).toBe('flex');
    expect(otpContainer.style.gap).toBe('8px');
    expect(otpInput.style.width).toBe('40px');
    expect(otpInput.style.minHeight).toBe('40px');
    expect(otpInput.style.textAlign).toBe('center');
  });

  it('lets runtime OTP styles override the defaults', () => {
    const descriptor = field.otp('Enter code').length(5)._build();
    const resolvedDescriptor = {
      ...descriptor,
      fieldPropsFromClient: {},
    } as React.ComponentProps<typeof Field>['descriptor'];

    const { container } = render(
      <Field
        descriptor={resolvedDescriptor}
        name="code"
        value=""
        label={descriptor._label ?? ''}
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
        extra={{
          styles: {
            otpContainer: { gap: '14px' },
            otpInput: { width: '64px', borderRadius: '20px' },
          },
        }}
      />,
    );

    const otpContainer = container.querySelector('[data-fb-slot="otp-container"]');
    const otpInput = container.querySelector('[data-fb-slot="otp-input"]');

    expect(otpContainer instanceof HTMLDivElement).toBe(true);
    expect(otpInput instanceof HTMLInputElement).toBe(true);

    if (
      !(otpContainer instanceof HTMLDivElement) ||
      !(otpInput instanceof HTMLInputElement)
    ) {
      throw new TypeError('Expected OTP container and inputs to render.');
    }

    expect(otpContainer.style.gap).toBe('14px');
    expect(otpInput.style.width).toBe('64px');
    expect(otpInput.style.borderRadius).toBe('20px');
  });
});

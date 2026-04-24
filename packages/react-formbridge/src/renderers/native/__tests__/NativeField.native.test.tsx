import type React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { field } from '../../../core/field-descriptors/field';
import { NativeField } from '../Field';

function renderNativeField(
  descriptor: React.ComponentProps<typeof NativeField>['descriptor'],
  overrides?: Partial<React.ComponentProps<typeof NativeField>>,
) {
  return render(
    <NativeField
      descriptor={descriptor}
      name="value"
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
      {...overrides}
    />,
  );
}

describe('NativeField', () => {
  it('renders the switch label only once and supports switch slot styles', () => {
    const descriptor = {
      ...field.switch('Enable feature')._build(),
      fieldPropsFromClient: {},
    } as React.ComponentProps<typeof NativeField>['descriptor'];

    renderNativeField(descriptor, {
      value: false,
      extra: {
        styles: {
          switchRow: { marginTop: 7 },
          switchLabel: { color: 'rgb(1, 2, 3)' },
        },
      },
    });

    const labels = screen.getAllByText('Enable feature');

    expect(labels).toHaveLength(1);
    expect(labels[0].style.color).toBe('rgb(1, 2, 3)');
    expect(labels[0].parentElement?.style.marginTop).toBe('7px');
  });

  it('supports native select trigger label style overrides', () => {
    const descriptor = {
      ...field
        .select('Role')
        .options([
          { label: 'Admin', value: 'admin' },
          { label: 'Editor', value: 'editor' },
        ])
        ._build(),
      fieldPropsFromClient: {},
    } as React.ComponentProps<typeof NativeField>['descriptor'];

    renderNativeField(descriptor, {
      extra: {
        styles: {
          selectTriggerLabel: { color: 'rgb(4, 5, 6)' },
        },
      },
    });

    const label = screen.getByText('Select Role');

    expect(label.style.color).toBe('rgb(4, 5, 6)');
  });

  it('gives native OTP fields a default OTP layout and keeps it overridable', () => {
    const descriptor = {
      ...field.otp('Enter code').length(5)._build(),
      fieldPropsFromClient: {},
    } as React.ComponentProps<typeof NativeField>['descriptor'];

    const { container, rerender } = renderNativeField(descriptor);

    const otpInputs = container.querySelectorAll('input[maxlength="1"]');
    const firstOtpInput = otpInputs[0] as HTMLElement | null;
    const otpContainer = firstOtpInput?.parentElement;

    expect(otpInputs).toHaveLength(5);
    expect(otpContainer?.style.gap).toBe('8px');
    expect(firstOtpInput?.style.width).toBe('56px');
    expect(firstOtpInput?.style.minHeight).toBe('56px');
    expect(firstOtpInput?.style.textAlign).toBe('center');

    rerender(
      <NativeField
        descriptor={descriptor}
        name="value"
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
            otpContainer: { gap: 14 },
            otpInput: { width: 64, borderRadius: 20 },
          },
        }}
      />,
    );

    const overriddenInput = container.querySelector(
      'input[maxlength="1"]',
    ) as HTMLElement | null;
    const overriddenContainer = overriddenInput?.parentElement;

    expect(overriddenContainer?.style.gap).toBe('14px');
    expect(overriddenInput?.style.width).toBe('64px');
    expect(overriddenInput?.style.borderRadius).toBe('20px');
  });
});

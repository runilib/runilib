import type React from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { field } from '../core/field-descriptors/field';
import type { MaskedDescriptor } from '../core/field-descriptors/mask/types';
import { MaskedInput } from '../renderers/web/MaskedInput';

function renderMaskedInput(
  descriptor: MaskedDescriptor<string>,
  value = '',
  overrides?: Partial<React.ComponentProps<typeof MaskedInput>>,
) {
  const view = render(
    <MaskedInput
      descriptor={descriptor}
      name="code"
      value={value}
      label="Code"
      error={null}
      touched={false}
      dirty={false}
      validating={false}
      disabled={false}
      required={descriptor._required}
      onChange={vi.fn()}
      onBlur={vi.fn()}
      onFocus={vi.fn()}
      allValues={{}}
      {...overrides}
    />,
  );

  const input = view.container.querySelector('input');

  if (!(input instanceof HTMLInputElement)) {
    throw new Error('Masked input did not render an input element.');
  }

  return input;
}

describe('web masked input', () => {
  it('switches to text input mode when the mask accepts letters via custom tokens', () => {
    const input = renderMaskedInput(
      field
        .masked('LL-999')
        .tokens({
          L: /[A-Z]/,
        })
        ._build(),
    );

    expect(input.getAttribute('inputmode')).toBe('text');
  });

  it('uses the mask visual length to cap input length and size the field', () => {
    const shortInput = renderMaskedInput(field.masked('99/99')._build());

    expect(shortInput.getAttribute('maxlength')).toBe('5');
    expect(shortInput.getAttribute('size')).toBe('10');

    const longInput = renderMaskedInput(field.masked('9999 9999 9999 9999')._build());

    expect(Number(longInput.getAttribute('size'))).toBeGreaterThan(
      Number(shortInput.getAttribute('size')),
    );
  });

  it('uses the same minimal chrome as standard text inputs by default', () => {
    const input = renderMaskedInput(field.masked('99/99')._build());

    expect(input.style.width).toBe('100%');
    expect(input.style.padding).toBe('8px 12px');
    expect(input.style.backgroundColor).toBe('rgb(255, 255, 255)');
    expect(input.style.borderWidth).toBe('1px');
    expect(input.style.borderStyle).toBe('solid');
  });

  it('lets consumers fully override the masked input chrome', () => {
    const input = renderMaskedInput(field.masked('99/99')._build(), '', {
      extra: {
        styles: {
          textInput: {
            width: '22ch',
            minWidth: '22ch',
            padding: '2px 3px',
            borderRadius: 12,
          },
        },
        inputProps: {
          style: {
            backgroundColor: 'rgb(1, 2, 3)',
          },
        },
      },
    });

    expect(input.style.width).toBe('22ch');
    expect(input.style.minWidth).toBe('22ch');
    expect(input.style.padding).toBe('2px 3px');
    expect(input.style.borderRadius).toBe('12px');
    expect(input.style.backgroundColor).toBe('rgb(1, 2, 3)');
  });
});

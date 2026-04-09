import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { field } from '../core/field-builders/field';
import type { MaskedDescriptor } from '../core/field-builders/mask/types';
import { MaskedInput } from '../renderers/web/MaskedInput';

function renderMaskedInput(descriptor: MaskedDescriptor<string>, value = '') {
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
});

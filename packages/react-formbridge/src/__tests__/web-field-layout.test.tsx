import type { ComponentProps } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { field } from '../core/field-builders/field';
import { Field } from '../renderers/web/Field';
import { MaskedInput } from '../renderers/web/MaskedInput';

describe('web field layout defaults', () => {
  it('stacks standard field labels, controls, and errors vertically', () => {
    const descriptor = field
      .text('Card number')
      .required('Card number is required')
      ._build() as ComponentProps<typeof Field>['descriptor'];
    const view = render(
      <Field
        descriptor={descriptor}
        name="cardNumber"
        value=""
        label="Card number"
        error="Card number is required"
        touched
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

    const root = view.container.querySelector('[data-fb-field="text"]');
    const label = view.container.querySelector('[data-fb-slot="label"]');
    const requiredMark = view.container.querySelector('[data-fb-slot="required-mark"]');
    const error = screen.getByRole('alert');

    expect(root instanceof HTMLElement).toBe(true);
    expect(label instanceof HTMLElement).toBe(true);
    expect(requiredMark instanceof HTMLElement).toBe(true);

    if (
      !(root instanceof HTMLElement) ||
      !(label instanceof HTMLElement) ||
      !(requiredMark instanceof HTMLElement)
    ) {
      throw new TypeError('Expected field root, label, and required mark to render.');
    }

    expect(root.style.display).toBe('flex');
    expect(root.style.flexDirection).toBe('column');
    expect(root.style.gap).toBe('8px');
    expect(label.style.alignSelf).toBe('flex-start');
    expect(label.style.gap).toBe('4px');
    expect(requiredMark.textContent).toBe('*');
    expect(error.textContent).toBe('Card number is required');
  });

  it('uses the same stacked layout defaults for masked fields', () => {
    const descriptor = field
      .masked('99/99')
      .required('Expiry is required')
      ._build() as ComponentProps<typeof MaskedInput>['descriptor'];
    const view = render(
      <MaskedInput
        descriptor={descriptor}
        name="expiry"
        value=""
        label="Expiry"
        error="Expiry is required"
        touched
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

    const root = view.container.querySelector('[data-fb-field="masked"]');
    const input = view.container.querySelector('[data-fb-slot="input"]');

    expect(root instanceof HTMLElement).toBe(true);
    expect(input instanceof HTMLElement).toBe(true);

    if (!(root instanceof HTMLElement) || !(input instanceof HTMLElement)) {
      throw new TypeError('Expected masked root and input to render.');
    }

    expect(root.style.display).toBe('flex');
    expect(root.style.flexDirection).toBe('column');
    expect(root.style.gap).toBe('8px');
    expect(input.style.boxSizing).toBe('border-box');
    expect(input.style.lineHeight).toBe('1.35');
  });
});

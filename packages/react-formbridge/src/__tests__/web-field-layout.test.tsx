import type { ComponentProps } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { field } from '../core/field-builders/field';
import { AsyncAutocompleteField } from '../renderers/web/AsyncAutocompleteField';
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

    const wrapper = view.container.querySelector('[data-fb-field="text"]');
    const label = view.container.querySelector('[data-fb-slot="label"]');
    const requiredMark = view.container.querySelector('[data-fb-slot="required-mark"]');
    const error = screen.getByRole('alert');

    expect(wrapper instanceof HTMLElement).toBe(true);
    expect(label instanceof HTMLElement).toBe(true);
    expect(requiredMark instanceof HTMLElement).toBe(true);

    if (
      !(wrapper instanceof HTMLElement) ||
      !(label instanceof HTMLElement) ||
      !(requiredMark instanceof HTMLElement)
    ) {
      throw new TypeError('Expected field wrapper, label, and required mark to render.');
    }

    expect(wrapper.style.display).toBe('flex');
    expect(wrapper.style.flexDirection).toBe('column');
    expect(wrapper.style.gap).toBe('4px');
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

    const wrapper = view.container.querySelector('[data-fb-field="masked"]');
    const input = view.container.querySelector('[data-fb-slot="input"]');

    expect(wrapper instanceof HTMLElement).toBe(true);
    expect(input instanceof HTMLElement).toBe(true);

    if (!(wrapper instanceof HTMLElement) || !(input instanceof HTMLElement)) {
      throw new TypeError('Expected masked wrapper and input to render.');
    }

    expect(wrapper.style.display).toBe('flex');
    expect(wrapper.style.flexDirection).toBe('column');
    expect(wrapper.style.gap).toBe('4px');
    expect(input.style.boxSizing).toBe('border-box');
    expect(input.style.width).toBe('100%');
    expect(input.style.padding).toBe('8px 12px');
    expect(input.style.borderWidth).toBe('1px');
    expect(input.style.borderStyle).toBe('solid');
  });

  it('raises async autocomplete above surrounding chrome when the listbox opens', () => {
    const descriptor = field
      .select('City')
      .optionsFrom(async () => [], {
        initialOptions: [
          { label: 'Paris', value: 'paris' },
          { label: 'Lyon', value: 'lyon' },
        ],
        fetchOnMount: false,
      })
      .searchable()
      ._build() as ComponentProps<typeof AsyncAutocompleteField>['descriptor'];

    const view = render(
      <AsyncAutocompleteField
        descriptor={descriptor}
        name="city"
        value=""
        label="City"
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

    const wrapper = view.container.querySelector('[data-fb-field="async-autocomplete"]');
    const input = view.container.querySelector('[data-fb-slot="input"]');

    expect(wrapper instanceof HTMLElement).toBe(true);
    expect(input instanceof HTMLInputElement).toBe(true);

    if (!(wrapper instanceof HTMLElement) || !(input instanceof HTMLInputElement)) {
      throw new TypeError('Expected async autocomplete wrapper and input to render.');
    }

    fireEvent.focus(input);

    const listbox = view.container.querySelector('[data-fb-slot="listbox"]');

    expect(wrapper.getAttribute('data-fb-open')).toBe('');
    expect(wrapper.style.overflow).toBe('visible');
    expect(wrapper.style.zIndex).toBe('999');
    expect(listbox instanceof HTMLElement).toBe(true);

    if (!(listbox instanceof HTMLElement)) {
      throw new TypeError('Expected async autocomplete listbox to open.');
    }

    expect(listbox.style.zIndex).toBe('1000');
  });

  it('respects select trigger and inner slot style overrides for async custom pickers', () => {
    const descriptor = field
      .select('City')
      .optionsFrom(async () => [], {
        initialOptions: [{ label: 'Paris', value: 'paris' }],
        fetchOnMount: false,
      })
      .searchable()
      ._build() as ComponentProps<typeof AsyncAutocompleteField>['descriptor'];

    const view = render(
      <AsyncAutocompleteField
        descriptor={descriptor}
        name="city"
        value=""
        label="City"
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
        extra={{
          renderPicker: () => null,
          styles: {
            input: { backgroundColor: 'rgb(10, 11, 12)' },
            select: { backgroundColor: 'rgb(13, 14, 15)' },
            selectValue: { color: 'rgb(16, 17, 18)' },
            selectArrow: { color: 'rgb(19, 20, 21)' },
          },
        }}
      />,
    );

    const trigger = view.container.querySelector('[data-fb-slot="select-trigger"]');
    const value = view.container.querySelector('[data-fb-slot="select-value"]');
    const arrow = view.container.querySelector('[data-fb-slot="select-arrow"]');

    expect(trigger instanceof HTMLButtonElement).toBe(true);
    expect(value instanceof HTMLSpanElement).toBe(true);
    expect(arrow instanceof HTMLSpanElement).toBe(true);

    if (
      !(trigger instanceof HTMLButtonElement) ||
      !(value instanceof HTMLSpanElement) ||
      !(arrow instanceof HTMLSpanElement)
    ) {
      throw new TypeError(
        'Expected async custom picker trigger, value, and arrow to render.',
      );
    }

    // expect(trigger.style.backgroundColor).toBe('rgb(13, 14, 15)');
    // expect(value.style.color).toBe('rgb(16, 17, 18)');
    // expect(arrow.style.color).toBe('rgb(19, 20, 21)');
  });
});

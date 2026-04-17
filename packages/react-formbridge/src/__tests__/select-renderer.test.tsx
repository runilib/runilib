import type { ComponentProps } from 'react';
import { useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { field } from '../core/field-builders/field';
import { Field } from '../renderers/web/Field';

type WebFieldProps = ComponentProps<typeof Field>;

function DefaultSelectedOptionHarness() {
  const descriptor = field
    .select('Country')
    .options([
      { label: 'France', value: 'FR' },
      { label: 'United States', value: 'US' },
    ])
    .defaultSelected({ label: 'France', value: 'FR' })
    ._build() as WebFieldProps['descriptor'];

  return (
    <Field
      descriptor={descriptor}
      name="country"
      value={descriptor._defaultValue}
      label="Country"
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
    />
  );
}

function NumericSelectHarness() {
  const descriptor = field
    .select('Plan')
    .options([
      { label: 'Starter', value: 1 },
      { label: 'Pro', value: 2 },
    ])
    .defaultSelected(1)
    ._build() as WebFieldProps['descriptor'];

  const [value, setValue] = useState<number | string | ''>(
    descriptor._defaultValue as number | string | '',
  );

  return (
    <>
      <Field
        descriptor={descriptor}
        name="plan"
        value={value}
        label="Plan"
        error={null}
        touched={false}
        dirty={false}
        validating={false}
        disabled={false}
        required={descriptor._required}
        onChange={(nextValue) => {
          setValue(nextValue as number | string | '');
        }}
        onBlur={vi.fn()}
        onFocus={vi.fn()}
        allValues={{}}
      />
      <output data-testid="plan-value">{String(value)}</output>
      <output data-testid="plan-type">{typeof value}</output>
    </>
  );
}

describe('web select field', () => {
  it('uses the configured default selection instead of rendering an empty option', () => {
    render(<DefaultSelectedOptionHarness />);

    const select = screen.getByRole('combobox', { name: 'Country' }) as HTMLSelectElement;

    expect(select.value).toBe('FR');
    expect(screen.queryByRole('option', { name: 'Select Country' })).toBeNull();
  });

  it('keeps the original numeric option value when the browser select changes', () => {
    render(<NumericSelectHarness />);

    const select = screen.getByRole('combobox', { name: 'Plan' }) as HTMLSelectElement;

    fireEvent.change(select, {
      target: { value: '2' },
    });

    expect(screen.getByTestId('plan-value').textContent).toBe('2');
    expect(screen.getByTestId('plan-type').textContent).toBe('number');
  });

  it('applies picker trigger and inner slot style overrides', () => {
    const descriptor = field
      .select('Country')
      .options([
        { label: 'France', value: 'FR' },
        { label: 'United States', value: 'US' },
      ])
      ._build() as WebFieldProps['descriptor'];

    const view = render(
      <Field
        descriptor={descriptor}
        name="country"
        value=""
        label="Country"
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
            select: { backgroundColor: 'rgb(1, 2, 3)' },
            selectValue: { color: 'rgb(4, 5, 6)' },
            selectArrow: { color: 'rgb(7, 8, 9)' },
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
      throw new TypeError('Expected custom picker trigger, value, and arrow to render.');
    }

    expect(trigger.style.backgroundColor).toBe('rgb(1, 2, 3)');
    expect(value.style.color).toBe('rgb(4, 5, 6)');
    expect(arrow.style.color).toBe('rgb(7, 8, 9)');
  });

  it('forces blur on the first outside click for native selects', async () => {
    vi.useFakeTimers();

    const onBlur = vi.fn();
    const descriptor = field
      .select('Country')
      .options([
        { label: 'France', value: 'FR' },
        { label: 'United States', value: 'US' },
      ])
      .required()
      ._build() as WebFieldProps['descriptor'];

    render(
      <Field
        descriptor={descriptor}
        name="country"
        value=""
        label="Country"
        error="Country is required"
        touched={false}
        dirty={false}
        validating={false}
        disabled={false}
        required={descriptor._required}
        onChange={vi.fn()}
        onBlur={onBlur}
        onFocus={vi.fn()}
        allValues={{}}
      />,
    );

    const select = screen.getByRole('combobox', {
      name: 'Country *',
    }) as HTMLSelectElement;

    select.focus();
    fireEvent.click(document.body);
    vi.runAllTimers();

    expect(onBlur).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});

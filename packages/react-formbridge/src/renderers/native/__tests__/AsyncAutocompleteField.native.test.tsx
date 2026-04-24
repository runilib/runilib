import type React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { field } from '../../../core/field-descriptors/field';
import { AsyncAutocompleteField } from '../AsyncAutocompleteField';

describe('Native AsyncAutocompleteField', () => {
  it('opens in a modal and lets the user select an async option', () => {
    const descriptor = {
      ...field
        .select('City')
        .optionsFrom(async () => [], {
          initialOptions: [
            { label: 'Paris', value: 'paris' },
            { label: 'Lyon', value: 'lyon' },
          ],
          fetchOnMount: false,
        })
        .searchable()
        ._build(),
      fieldPropsFromClient: {},
    } as React.ComponentProps<typeof AsyncAutocompleteField>['descriptor'];

    const onChange = vi.fn();

    render(
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
        hint={descriptor._hint}
        dependencyValues={{}}
        onChange={onChange}
        onBlur={vi.fn()}
        onFocus={vi.fn()}
        extra={{
          testID: 'city-trigger',
          styles: {
            autocompleteTrigger: { backgroundColor: 'rgb(1, 2, 3)' },
          },
        }}
      />,
    );

    const trigger = screen.getByTestId('city-trigger');

    expect(trigger.style.backgroundColor).toBe('rgb(1, 2, 3)');

    fireEvent.click(trigger);

    expect(screen.getByPlaceholderText('Search City...')).toBeTruthy();

    fireEvent.click(screen.getByText('Paris'));

    expect(onChange).toHaveBeenCalledWith('paris');
  });
});

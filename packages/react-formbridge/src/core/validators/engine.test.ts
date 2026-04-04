import { describe, expect, it } from 'vitest';
import type { FieldDescriptor, FieldType } from '../../types';
import { field } from '../field-builders/field';
import { validateField } from './engine';

const desc = <TValue, TType extends FieldType>(builder: {
  _build: () => FieldDescriptor<TValue, TType>;
}) => builder._build();

describe('validateField patterns', () => {
  it('accepts multiple pattern alternatives from a single call', async () => {
    const err = await validateField(
      desc(
        field
          .text('x')
          .pattern(
            [/^[^\s@]+@aks\.com$/i, /^[^\s@]+@sosthene\.dev$/i],
            'Use an allowed company email.',
          ),
      ),
      'ava@sosthene.dev',
      {},
    );

    expect(err).toBeNull();
  });

  it('accepts multiple pattern alternatives when chained', async () => {
    const err = await validateField(
      desc(
        field
          .text('x')
          .pattern(/^[^\s@]+@aks\.com$/i, 'Use an allowed company email.')
          .pattern(/^[^\s@]+@sosthene\.dev$/i),
      ),
      'ava@aks.com',
      {},
    );

    expect(err).toBeNull();
  });
});

describe('field.email helpers', () => {
  it('rejects blocked personal inbox domains while accepting custom domains', async () => {
    const descriptor = desc(
      field
        .email('x')
        .excludeEmailDomains(
          ['gmail.com', '@yahoo.com', 'hotmail.com'],
          'Please use a non-personal email address.',
        ),
    );

    await expect(validateField(descriptor, 'ava@gmail.com', {})).resolves.toBe(
      'Please use a non-personal email address.',
    );
    await expect(validateField(descriptor, 'ava@YAHOO.com', {})).resolves.toBe(
      'Please use a non-personal email address.',
    );
    await expect(validateField(descriptor, 'ava@startup.dev', {})).resolves.toBeNull();
  });

  it('keeps the built-in email validation when excludeEmailDomains() is used', async () => {
    const descriptor = desc(field.email('x').excludeEmailDomains(['gmail.com']));

    await expect(validateField(descriptor, 'notanemail', {})).resolves.toBe(
      'Please enter a valid email address.',
    );
  });
});

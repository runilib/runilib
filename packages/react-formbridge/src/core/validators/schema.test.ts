import { describe, expect, it } from 'vitest';
import { field } from '../field-builders/field';
import { ref } from './reference';
import { FormBridgeSchemaValidationError, schema } from './schema';

describe('schema()', () => {
  it('returns structured field issues and supports errorMap()', () => {
    const signupSchema = schema({
      email: field.email('Email').required(),
      role: field.select('Role').disallowPlaceholder(),
    }).errorMap((issue) =>
      issue.code === 'required' ? 'Required via errorMap.' : undefined,
    );

    const result = signupSchema.safeParse({
      email: '',
      role: '',
    });

    expect(result.success).toBe(false);
    expect(result.errorsByField.email).toBe('Required via errorMap.');
    expect(result.errorsByField.role).toBe('Required via errorMap.');
    expect(result.issues.map((issue) => issue.code)).toEqual(['required', 'required']);
  });

  it('supports refine() and superRefine()', () => {
    const contactSchema = schema({
      email: field.text('Email'),
      phone: field.text('Phone'),
      coupon: field.text('Coupon'),
    })
      .refine(
        (values) => Boolean(values.email || values.phone),
        'Provide at least one contact channel.',
      )
      .superRefine((values, ctx) => {
        if (values.coupon === 'blocked') {
          ctx.addIssue({
            path: 'coupon',
            code: 'blocked_coupon',
            message: 'Coupon unavailable.',
          });
        }
      });

    const result = contactSchema.safeParse({
      email: '',
      phone: '',
      coupon: 'blocked',
    });

    expect(result.success).toBe(false);
    expect(result.formErrors).toEqual(['Provide at least one contact channel.']);
    expect(result.errorsByField.coupon).toBe('Coupon unavailable.');
  });

  it('supports cross-field helpers like atLeastOne, exactlyOne, allOrNone and dateRange', () => {
    const checkoutSchema = schema({
      primaryEmail: field.text('Primary email'),
      backupEmail: field.text('Backup email'),
      city: field.text('City'),
      zip: field.text('Zip'),
      start: field.date('Start date'),
      end: field.date('End date'),
      password: field.text('Password'),
      confirmPassword: field
        .text('Confirm password')
        .sameAs(ref('password'), 'Must match.'),
    })
      .exactlyOne(['primaryEmail', 'backupEmail'], 'Choose exactly one email.')
      .allOrNone(['city', 'zip'], 'Provide both city and zip.')
      .dateRange(
        {
          start: 'start',
          end: 'end',
        },
        'End date must be after start date.',
      );

    const result = checkoutSchema.safeParse({
      primaryEmail: 'hello@example.com',
      backupEmail: 'backup@example.com',
      city: 'Paris',
      zip: '',
      start: '2026-01-10',
      end: '2026-01-05',
      password: 'secret',
      confirmPassword: 'other',
    });

    expect(result.success).toBe(false);
    expect(result.formErrors).toEqual([
      'Choose exactly one email.',
      'Provide both city and zip.',
    ]);
    expect(result.errorsByField.end).toBe('End date must be after start date.');
    expect(result.errorsByField.confirmPassword).toBe('Must match.');
  });

  it('supports async validators and async refinements', async () => {
    const asyncSchema = schema({
      username: field.text('Username').validateAsync(async (value) => {
        await new Promise((resolve) => setTimeout(resolve, 5));
        return value === 'taken' ? 'Already taken.' : null;
      }),
    }).refineAsync(async (values) => values.username !== 'blocked', 'Blocked by policy.');

    await expect(
      asyncSchema.safeParseAsync({ username: 'taken' }),
    ).resolves.toMatchObject({
      success: false,
      errorsByField: {
        username: 'Already taken.',
      },
    });

    expect(() => asyncSchema.safeParse({ username: 'taken' })).toThrow(/safeParseAsync/);
    await expect(
      asyncSchema.validateAsync({ username: 'blocked' }),
    ).rejects.toBeInstanceOf(FormBridgeSchemaValidationError);
  });
});

import { describe, expect, it } from 'vitest';
import { field } from '../field-builders/field';
import { createSchema, FormBridgeSchemaValidationError } from './createSchema';

describe('createSchema()', () => {
  it('returns structured field issues and supports errorMap()', () => {
    const signupSchema = createSchema({
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
    const contactSchema = createSchema({
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
    expect(result.formLevelErrors).toEqual(['Provide at least one contact channel.']);
    expect(result.errorsByField.coupon).toBe('Coupon unavailable.');
  });

  it('supports cross-field helpers like exactlyOne and allOrNone', () => {
    const checkoutSchema = createSchema({
      primaryEmail: field.text('Primary email'),
      backupEmail: field.text('Backup email'),
      city: field.text('City'),
      zip: field.text('Zip'),
      password: field.text('Password'),
      confirmPassword: field.text('Confirm password').sameAs('password', 'Must match.'),
    })
      .exactlyOne(['primaryEmail', 'backupEmail'], 'Choose exactly one email.')
      .allOrNone(['city', 'zip'], 'Provide both city and zip.');

    const result = checkoutSchema.safeParse({
      primaryEmail: 'hello@example.com',
      backupEmail: 'backup@example.com',
      city: 'Paris',
      zip: '',
      password: 'secret',
      confirmPassword: 'other',
    });

    expect(result.success).toBe(false);
    expect(result.formLevelErrors).toEqual([
      'Choose exactly one email.',
      'Provide both city and zip.',
    ]);
    expect(result.errorsByField.confirmPassword).toBe('Must match.');
  });

  it('supports async validators and async refinements', async () => {
    const asyncSchema = createSchema({
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

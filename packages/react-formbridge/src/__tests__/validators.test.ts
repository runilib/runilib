import { describe, expect, it } from 'vitest';
import { field } from '../core/field-descriptors/field';
import { validateAll, validateField } from '../core/validators/engine';
import { ref } from '../core/validators/reference';

const desc = (f: ReturnType<typeof field.text>) => f._build();

// ─── required ─────────────────────────────────────────────────────────────────
describe('validateField - required', () => {
  it('returns error for empty string', async () =>
    expect(await validateField(desc(field.text('x').required()), '', {})).not.toBeNull());
  it('returns error for null', async () =>
    expect(
      await validateField(desc(field.text('x').required()), null, {}),
    ).not.toBeNull());
  it('returns error for whitespace', async () =>
    expect(
      await validateField(desc(field.text('x').required()), '   ', {}),
    ).not.toBeNull());
  it('passes for non-empty value', async () =>
    expect(
      await validateField(desc(field.text('x').required()), 'hello', {}),
    ).toBeNull());
  it('uses custom required message', async () => {
    const err = await validateField(
      desc(field.text('x').required('Obligatoire')),
      '',
      {},
    );
    expect(err).toBe('Obligatoire');
  });
});

// ─── min / max ────────────────────────────────────────────────────────────────
describe('validateField - min/max (string)', () => {
  it('fails min length', async () =>
    expect(await validateField(desc(field.text('x').min(5)), 'abc', {})).not.toBeNull());
  it('passes min length', async () =>
    expect(await validateField(desc(field.text('x').min(3)), 'hello', {})).toBeNull());
  it('fails max length', async () =>
    expect(
      await validateField(desc(field.text('x').max(3)), 'toolong', {}),
    ).not.toBeNull());
  it('passes max length', async () =>
    expect(await validateField(desc(field.text('x').max(10)), 'short', {})).toBeNull());
  it('uses custom message', async () => {
    const err = await validateField(
      desc(field.text('x').min(5, 'Trop court.')),
      'ab',
      {},
    );
    expect(err).toBe('Trop court.');
  });
});

describe('validateField - min/max (number)', () => {
  const numDesc = (f: any) => f._build();
  it('fails min', async () =>
    expect(
      await validateField(numDesc(field.number('x').min(18)), 10, {}),
    ).not.toBeNull());
  it('passes min', async () =>
    expect(await validateField(numDesc(field.number('x').min(18)), 20, {})).toBeNull());
  it('fails max', async () =>
    expect(
      await validateField(numDesc(field.number('x').max(100)), 150, {}),
    ).not.toBeNull());

  it('supports gt/gte/lt/lte/between/multipleOf', async () => {
    const descriptor = numDesc(
      field.number('Amount').gt(10).gte(11).lt(20).lte(19).between(11, 19).multipleOf(2),
    );

    await expect(validateField(descriptor, 8, {})).resolves.toBe(
      'Must be greater than 10.',
    );
    await expect(validateField(descriptor, 14, {})).resolves.toBeNull();
  });

  it('supports greaterThan/lowerThan with refs', async () => {
    const minDescriptor = numDesc(field.number('Max').greaterThan(ref('min')));
    const maxDescriptor = numDesc(field.number('Min').lowerThan(ref('max')));

    await expect(validateField(minDescriptor, 10, { min: 12 })).resolves.toBe(
      'Must be greater than 12.',
    );
    await expect(validateField(minDescriptor, 14, { min: 12 })).resolves.toBeNull();
    await expect(validateField(maxDescriptor, 20, { max: 18 })).resolves.toBe(
      'Must be lower than 18.',
    );
  });
});

// ─── pattern ──────────────────────────────────────────────────────────────────
describe('validateField - pattern', () => {
  it('fails non-matching pattern', async () => {
    const err = await validateField(
      desc(field.text('x').pattern(/^\d+$/, 'Digits only.')),
      'abc',
      {},
    );
    expect(err).toBe('Digits only.');
  });
  it('passes matching pattern', async () => {
    const err = await validateField(desc(field.text('x').pattern(/^\d+$/)), '123', {});
    expect(err).toBeNull();
  });
});

// ─── email built-in ───────────────────────────────────────────────────────────
describe('field.email', () => {
  it('rejects invalid email', async () =>
    expect(
      await validateField(field.email('x')._build(), 'notanemail', {}),
    ).not.toBeNull());
  it('accepts valid email', async () =>
    expect(
      await validateField(field.email('x')._build(), 'aks@unikit.dev', {}),
    ).toBeNull());
  it('skips validation if empty and not required', async () =>
    expect(await validateField(field.email('x')._build(), '', {})).toBeNull());
});

// ─── password strength ────────────────────────────────────────────────────────
describe('field.password.strong()', () => {
  const d = field.password('x').required().strong()._build();
  it('rejects short password', async () =>
    expect(await validateField(d, 'Ab1!', {})).not.toBeNull());
  it('rejects no uppercase', async () =>
    expect(await validateField(d, 'abcdef1!', {})).not.toBeNull());
  it('rejects no number', async () =>
    expect(await validateField(d, 'Abcdefg!', {})).not.toBeNull());
  it('rejects no special char', async () =>
    expect(await validateField(d, 'Abcdefg1', {})).not.toBeNull());
  it('accepts strong password', async () =>
    expect(await validateField(d, 'Abcdef1!', {})).toBeNull());
});

describe('field.password.withStrengthIndicator({ blockWeak: true })', () => {
  const d = field
    .password('Password')
    .withStrengthIndicator({
      blockWeak: true,
      blockMsg: 'Need a stronger password.',
    })
    ._build();

  it('rejects weak passwords when blockWeak is enabled', async () => {
    expect(await validateField(d, 'abc', {})).toBe('Need a stronger password.');
  });

  it('allows strong enough passwords when blockWeak is enabled', async () => {
    expect(await validateField(d, 'Abcdef1!', {})).toBeNull();
  });

  it('does not turn an optional empty field into an error', async () => {
    expect(await validateField(d, '', {})).toBeNull();
  });

  it('can remember that rules should hide once the password becomes valid', () => {
    const configured = field
      .password('Password')
      .withStrengthIndicator({
        showRules: true,
        hideRulesWhenValid: true,
      })
      ._build();

    const fluent = field
      .password('Password')
      .hideRulesWhenValid()
      .withStrengthIndicator({
        showRules: true,
      })
      ._build();

    expect(configured._strengthHideRulesWhenValid).toBe(true);
    expect(fluent._strengthHideRulesWhenValid).toBe(true);
  });
});

// ─── matches ──────────────────────────────────────────────────────────────────
describe('field.text.matches()', () => {
  const d = field
    .text('Confirm')
    .required()
    .matches('password', 'Does not match.')
    ._build();
  it('fails when values differ', async () => {
    const err = await validateField(d, 'abc', { password: 'xyz' });
    expect(err).toBe('Does not match.');
  });
  it('passes when values are equal', async () => {
    const err = await validateField(d, 'same', { password: 'same' });
    expect(err).toBeNull();
  });

  it('accepts ref() references too', async () => {
    const refDescriptor = field
      .text('Confirm')
      .sameAs(ref('password'), 'Passwords must match.')
      ._build();

    await expect(
      validateField(refDescriptor, 'secret', { password: 'secret' }),
    ).resolves.toBeNull();
    await expect(
      validateField(refDescriptor, 'secret', { password: 'other' }),
    ).resolves.toBe('Passwords must match.');
  });
});

// ─── custom async validator ───────────────────────────────────────────────────
describe('custom async validator', () => {
  it('returns error from async validator', async () => {
    const d = field
      .text('x')
      .required()
      .validate(async (v) => {
        await new Promise((r) => setTimeout(r, 10));
        return v === 'taken' ? 'Already taken.' : null;
      })
      ._build();
    expect(await validateField(d, 'taken', {})).toBe('Already taken.');
    expect(await validateField(d, 'free', {})).toBeNull();
  });
});

// ─── transform + trim ────────────────────────────────────────────────────────
describe('trim & transform', () => {
  it('trims whitespace before required check', async () => {
    const d = field.text('x').required().trim()._build();
    expect(await validateField(d, '   ', {})).not.toBeNull();
  });
  it('applies transform before validation', async () => {
    const d = field
      .text('x')
      .required()
      .transform((v) => v.toUpperCase())
      .min(3)
      ._build();
    expect(await validateField(d, 'ab', {})).not.toBeNull();
    expect(await validateField(d, 'abc', {})).toBeNull();
  });
});

describe('additional string validators', () => {
  it('supports nonEmpty, length, between, oneOf and notOneOf', async () => {
    const nonEmpty = desc(field.text('Code').nonEmpty());
    const exactLength = desc(field.text('Code').length(4));
    const betweenDescriptor = desc(field.text('Code').between(2, 4));
    const oneOfDescriptor = desc(field.text('Role').oneOf(['admin', 'editor']));
    const notOneOfDescriptor = desc(field.text('Role').notOneOf(['banned']));

    await expect(validateField(nonEmpty, '   ', {})).resolves.toBe(
      'This field cannot be empty.',
    );
    await expect(validateField(exactLength, 'abc', {})).resolves.toBe(
      'Must be exactly 4 characters.',
    );
    await expect(validateField(betweenDescriptor, 'abc', {})).resolves.toBeNull();
    await expect(validateField(oneOfDescriptor, 'user', {})).resolves.toBe(
      'Value must be one of: admin, editor.',
    );
    await expect(validateField(notOneOfDescriptor, 'banned', {})).resolves.toBe(
      'Value must not be one of: banned.',
    );
  });
});

describe('date validators', () => {
  const dateDesc = (builder: any) => builder._build();

  it('supports before and after', async () => {
    const beforeDescriptor = dateDesc(
      field.date('Start').before('2026-01-10', 'Too late.'),
    );
    const afterDescriptor = dateDesc(field.date('End').after('2026-01-10', 'Too early.'));

    await expect(validateField(beforeDescriptor, '2026-01-11', {})).resolves.toBe(
      'Too late.',
    );
    await expect(validateField(afterDescriptor, '2026-01-12', {})).resolves.toBeNull();
  });

  it('supports past, future, minAge and maxAge', async () => {
    const today = new Date();
    const pastDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate())
      .toISOString()
      .slice(0, 10);
    const futureDate = new Date(
      today.getFullYear() + 1,
      today.getMonth(),
      today.getDate(),
    )
      .toISOString()
      .slice(0, 10);
    const teenDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate())
      .toISOString()
      .slice(0, 10);

    await expect(
      validateField(dateDesc(field.date('Past').past()), futureDate, {}),
    ).resolves.toBe('Date must be in the past.');
    await expect(
      validateField(dateDesc(field.date('Future').future()), futureDate, {}),
    ).resolves.toBeNull();
    await expect(
      validateField(dateDesc(field.date('Birthdate').minAge(18)), teenDate, {}),
    ).resolves.toBe('Must be at least 18 years old.');
    await expect(
      validateField(dateDesc(field.date('Birthdate').maxAge(30)), pastDate, {}),
    ).resolves.toBeNull();
  });
});

describe('select validators', () => {
  const selectDesc = (builder: any) => builder._build();

  it('supports oneOf, notOneOf and disallowPlaceholder', async () => {
    const oneOfDescriptor = selectDesc(field.select('Role').oneOf(['admin', 'editor']));
    const notOneOfDescriptor = selectDesc(field.select('Role').notOneOf(['guest']));
    const placeholderDescriptor = selectDesc(field.select('Role').disallowPlaceholder());

    await expect(validateField(oneOfDescriptor, 'guest', {})).resolves.toBe(
      'Please select an allowed option.',
    );
    await expect(validateField(notOneOfDescriptor, 'guest', {})).resolves.toBe(
      'Please choose a different option.',
    );
    await expect(validateField(placeholderDescriptor, '', {})).resolves.toBe(
      'Please select an option.',
    );
    await expect(validateField(placeholderDescriptor, 'admin', {})).resolves.toBeNull();
  });
});

// ─── validateAll ──────────────────────────────────────────────────────────────
describe('validateAll', () => {
  it('returns empty object when all valid', async () => {
    const descriptors = {
      email: (field.email('Email').required() as any)._build(),
      password: (field.password('Password').required() as any)._build(),
    };
    const errors = await validateAll(descriptors, {
      email: 'a@b.com',
      password: 'secret123',
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('returns errors for invalid fields', async () => {
    const descriptors = {
      email: (field.email('Email').required() as any)._build(),
      password: (field.password('Password').required() as any)._build(),
    };
    const errors = await validateAll(descriptors, { email: '', password: '' });
    expect(errors.email).toBeTruthy();
    expect(errors.password).toBeTruthy();
  });
});

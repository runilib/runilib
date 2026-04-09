import { describe, expect, it } from 'vitest';
import { field } from '../core/field-builders/field';
import { validateAll, validateField } from '../core/validators/engine';

const desc = (f: ReturnType<typeof field.text>) => f._build();

// ─── required ─────────────────────────────────────────────────────────────────
describe('validateField — required', () => {
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
describe('validateField — min/max (string)', () => {
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

describe('validateField — min/max (number)', () => {
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
});

// ─── pattern ──────────────────────────────────────────────────────────────────
describe('validateField — pattern', () => {
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

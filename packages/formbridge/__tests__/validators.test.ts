import { runRules } from '../src/validators/rules';
import { validators } from '../src/validators/presets';

describe('runRules — required', () => {
  it('returns error when value is empty string', async () => {
    const err = await runRules('', { required: true }, {});
    expect(err).toBe('This field is required.');
  });

  it('returns custom message', async () => {
    const err = await runRules('', { required: 'Champ obligatoire.' }, {});
    expect(err).toBe('Champ obligatoire.');
  });

  it('passes when value is not empty', async () => {
    const err = await runRules('hello', { required: true }, {});
    expect(err).toBeNull();
  });

  it('catches null and undefined', async () => {
    expect(await runRules(null,      { required: true }, {})).not.toBeNull();
    expect(await runRules(undefined, { required: true }, {})).not.toBeNull();
  });

  it('catches whitespace-only strings', async () => {
    expect(await runRules('   ', { required: true }, {})).not.toBeNull();
  });
});

describe('runRules — minLength / maxLength', () => {
  it('fails minLength', async () => {
    const err = await runRules('ab', { minLength: 5 }, {});
    expect(err).toContain('5');
  });

  it('passes minLength', async () => {
    const err = await runRules('hello world', { minLength: 5 }, {});
    expect(err).toBeNull();
  });

  it('fails maxLength', async () => {
    const err = await runRules('toolongstring', { maxLength: 5 }, {});
    expect(err).toContain('5');
  });

  it('uses custom message for maxLength', async () => {
    const err = await runRules('toolong', { maxLength: { value: 3, message: 'Trop long.' } }, {});
    expect(err).toBe('Trop long.');
  });
});

describe('runRules — min / max (numbers)', () => {
  it('fails min', async () => {
    const err = await runRules(3, { min: 10 }, {});
    expect(err).toContain('10');
  });

  it('passes min', async () => {
    const err = await runRules(15, { min: 10 }, {});
    expect(err).toBeNull();
  });

  it('fails max', async () => {
    const err = await runRules(100, { max: 50 }, {});
    expect(err).toContain('50');
  });

  it('passes max', async () => {
    const err = await runRules(25, { max: 50 }, {});
    expect(err).toBeNull();
  });
});

describe('runRules — pattern', () => {
  it('fails regex', async () => {
    const err = await runRules('not-an-email', { pattern: /^[\w.]+@[\w.]+$/ }, {});
    expect(err).toBe('Invalid format.');
  });

  it('passes regex', async () => {
    const err = await runRules('hello@example.com', { pattern: /^[\w.]+@[\w.]+$/ }, {});
    expect(err).toBeNull();
  });

  it('uses custom message', async () => {
    const err = await runRules('bad', { pattern: { value: /^\d+$/, message: 'Digits only.' } }, {});
    expect(err).toBe('Digits only.');
  });
});

describe('runRules — custom validate', () => {
  it('sync validator returns error', async () => {
    const err = await runRules('admin', { validate: (v) => v === 'admin' ? 'Username taken.' : null }, {});
    expect(err).toBe('Username taken.');
  });

  it('async validator returns error', async () => {
    const err = await runRules('taken', {
      validate: async (v) => {
        await new Promise(r => setTimeout(r, 10));
        return v === 'taken' ? 'Already in use.' : null;
      },
    }, {});
    expect(err).toBe('Already in use.');
  });

  it('multiple named validators — stops at first error', async () => {
    const err = await runRules('a', {
      validate: {
        len:  (v) => typeof v === 'string' && v.length >= 3 ? null : 'Min 3 chars.',
        upper:(v) => typeof v === 'string' && /[A-Z]/.test(v) ? null : 'Need uppercase.',
      },
    }, {});
    expect(err).toBe('Min 3 chars.');
  });

  it('receives allValues', async () => {
    const err = await runRules('pass', {
      validate: (v, all) => v === all.password ? null : 'Passwords must match.',
    }, { password: 'different' });
    expect(err).toBe('Passwords must match.');
  });

  it('returns null when valid', async () => {
    const err = await runRules('hello', { validate: () => null }, {});
    expect(err).toBeNull();
  });
});

describe('runRules — no rules', () => {
  it('returns null with no rules', async () => {
    const err = await runRules('anything', {}, {});
    expect(err).toBeNull();
  });
});

// ─── Preset validators ────────────────────────────────────────────────────────

describe('validators.email', () => {
  it('rejects invalid emails', async () => {
    for (const bad of ['notanemail', 'a@', '@b.com', 'a b@c.com']) {
      const err = await runRules(bad, validators.email, {});
      expect(err).not.toBeNull();
    }
  });
  it('accepts valid emails', async () => {
    for (const good of ['user@example.com', 'a.b+c@x.co', 'USER@DOMAIN.ORG']) {
      const err = await runRules(good, validators.email, {});
      expect(err).toBeNull();
    }
  });
});

describe('validators.url', () => {
  it('rejects non-urls', async () => {
    expect(await runRules('just-text', validators.url, {})).not.toBeNull();
    expect(await runRules('ftp://bad', validators.url, {})).not.toBeNull();
  });
  it('accepts valid urls', async () => {
    expect(await runRules('https://example.com', validators.url, {})).toBeNull();
    expect(await runRules('http://sub.domain.co/path?q=1', validators.url, {})).toBeNull();
  });
});

describe('validators.strongPassword', () => {
  it('rejects weak passwords', async () => {
    expect(await runRules('short', validators.strongPassword, {})).not.toBeNull();
    expect(await runRules('alllowercase1', validators.strongPassword, {})).not.toBeNull();
    expect(await runRules('ALLUPPERCASE1', validators.strongPassword, {})).not.toBeNull();
    expect(await runRules('NoNumbers!!', validators.strongPassword, {})).not.toBeNull();
  });
  it('accepts strong passwords', async () => {
    expect(await runRules('StrongPass1', validators.strongPassword, {})).toBeNull();
    expect(await runRules('Abc12345', validators.strongPassword, {})).toBeNull();
  });
});

describe('validators.numeric', () => {
  it('rejects non-numeric strings', async () => {
    expect(await runRules('12a', validators.numeric, {})).not.toBeNull();
  });
  it('accepts digit-only strings', async () => {
    expect(await runRules('123456', validators.numeric, {})).toBeNull();
  });
});

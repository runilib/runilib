import { setLocale, t, tOr, getLocale, registerLocale, LOCALE_FR, LOCALE_DE } from '../src/i18n/locale';

describe('i18n — default locale (en)', () => {
  beforeEach(() => setLocale('en'));

  it('t() returns English message for required', () => {
    expect(t('required')).toBe('This field is required.');
  });

  it('t() interpolates min', () => {
    const msg = t('min', { min: 8 });
    expect(msg).toContain('8');
  });

  it('t() interpolates max', () => {
    const msg = t('max', { max: 50 });
    expect(msg).toContain('50');
  });

  it('t() returns email message', () => {
    expect(t('email')).toContain('email');
  });

  it('t() returns mustBeTrue message', () => {
    expect(typeof t('mustBeTrue')).toBe('string');
    expect(t('mustBeTrue').length).toBeGreaterThan(0);
  });

  it('tOr() returns fallback when key fails', () => {
    const result = tOr('nonexistent' as any, 'Fallback');
    expect(result).toBe('Fallback');
  });

  it('getLocale() returns active locale', () => {
    expect(getLocale()).toBe('en');
  });
});

describe('i18n — setLocale("fr")', () => {
  beforeEach(() => setLocale('fr'));
  afterAll(() => setLocale('en'));

  it('switches to French messages', () => {
    expect(t('required')).toBe('Ce champ est obligatoire.');
  });

  it('returns French email message', () => {
    expect(t('email')).toContain('email');
  });

  it('interpolates min in French', () => {
    const msg = t('min', { min: 8 });
    expect(msg).toContain('8');
  });

  it('returns French mustBeTrue', () => {
    expect(t('mustBeTrue')).toContain('accepter');
  });

  it('getLocale() returns fr', () => {
    expect(getLocale()).toBe('fr');
  });
});

describe('i18n — setLocale with overrides', () => {
  afterAll(() => setLocale('en'));

  it('applies per-key overrides on top of locale', () => {
    setLocale('fr', { required: 'Champ requis.' });
    expect(t('required')).toBe('Champ requis.');
    // Other fr messages unchanged
    expect(t('email')).toContain('email');
  });

  it('override does not affect other locales', () => {
    setLocale('fr', { required: 'Override.' });
    setLocale('en');
    expect(t('required')).toBe('This field is required.');
  });
});

describe('i18n — setLocale("de")', () => {
  beforeEach(() => setLocale('de'));
  afterAll(() => setLocale('en'));

  it('returns German required message', () => {
    expect(t('required')).toContain('erforderlich');
  });

  it('interpolates min in German', () => {
    const msg = t('minLength', { min: 3 });
    expect(msg).toContain('3');
  });
});

describe('i18n — setLocale("es")', () => {
  beforeEach(() => setLocale('es'));
  afterAll(() => setLocale('en'));

  it('returns Spanish required message', () => {
    expect(t('required')).toContain('obligatorio');
  });
});

describe('i18n — setLocale("pt")', () => {
  beforeEach(() => setLocale('pt'));
  afterAll(() => setLocale('en'));

  it('returns Portuguese required message', () => {
    expect(t('required')).toContain('obrigatório');
  });
});

describe('i18n — registerLocale', () => {
  afterAll(() => setLocale('en'));

  it('registers and activates a new locale', () => {
    registerLocale('ar', {
      ...LOCALE_FR,
      required: 'هذا الحقل مطلوب.',
      email:    'البريد الإلكتروني غير صالح.',
    });
    setLocale('ar');
    expect(t('required')).toBe('هذا الحقل مطلوب.');
    expect(t('email')).toBe('البريد الإلكتروني غير صالح.');
  });

  it('falls back to English for unregistered locale', () => {
    setLocale('zzz');
    expect(typeof t('required')).toBe('string');
  });
});

describe('i18n — interpolation edge cases', () => {
  beforeEach(() => setLocale('en'));

  it('returns key string when message function throws', () => {
    setLocale('en', { min: () => { throw new Error('oops'); } });
    const result = t('min', { min: 8 });
    expect(typeof result).toBe('string');
    setLocale('en');
  });

  it('all numeric interpolations include the number', () => {
    const cases: Array<[any, object]> = [
      ['min',      { min: 5  }],
      ['max',      { max: 20 }],
      ['minLength',{ min: 3  }],
      ['maxLength',{ max: 100}],
      ['minValue', { min: 0  }],
      ['maxValue', { max: 99 }],
    ];
    for (const [key, ctx] of cases) {
      const msg = t(key, ctx);
      const num = String(Object.values(ctx)[0]);
      expect(msg).toContain(num);
    }
  });
});

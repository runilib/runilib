import { describe, expect, it } from 'vitest';
import {
  STRENGTH_CONFIG_FR,
  STRENGTH_CONFIG_SIMPLE,
  STRENGTH_CONFIG_STRICT,
} from '../core/field-descriptors/password/constant';
import { scorePassword } from '../core/field-descriptors/password/strength';

describe('scorePassword - default config', () => {
  it('returns score 0 for empty string', () => {
    const r = scorePassword('');
    expect(r.score).toBe(0);
    expect(r.acceptable).toBe(false);
    expect(r.percent).toBe(0);
  });

  it('gives low score to very simple passwords', () => {
    expect(scorePassword('123456').score).toBeLessThanOrEqual(1);
    expect(scorePassword('password').score).toBeLessThanOrEqual(1);
    expect(scorePassword('aaaaaa').score).toBeLessThanOrEqual(1);
  });

  it('gives medium score to moderately complex passwords', () => {
    const r = scorePassword('Hello123');
    expect(r.score).toBeGreaterThanOrEqual(2);
  });

  it('gives high score to strong passwords', () => {
    const r = scorePassword('MySecure#Pass99!');
    expect(r.score).toBeGreaterThanOrEqual(3);
    expect(r.acceptable).toBe(true);
  });

  it('gives max score to excellent passwords', () => {
    const r = scorePassword('Tr0ub4dor&3#Secure!');
    expect(r.score).toBe(4);
  });

  it('detects common passwords', () => {
    const r = scorePassword('password123');
    const commonRule = r.rules.find((rule) => rule.id === 'no_common');
    expect(commonRule?.passed).toBe(false);
  });

  it('detects repeated chars', () => {
    const r = scorePassword('aaabbbccc');
    const repeatRule = r.rules.find((rule) => rule.id === 'no_repeat');
    expect(repeatRule?.passed).toBe(false);
  });

  it('detects sequential chars', () => {
    const r = scorePassword('abc123def');
    const seqRule = r.rules.find((rule) => rule.id === 'no_sequential');
    expect(seqRule?.passed).toBe(false);
  });

  it('returns correct rule states', () => {
    const r = scorePassword('MyPass1');
    const upper = r.rules.find((rule) => rule.id === 'uppercase');
    const lower = r.rules.find((rule) => rule.id === 'lowercase');
    const number = r.rules.find((rule) => rule.id === 'number');
    const special = r.rules.find((rule) => rule.id === 'special');
    expect(upper?.passed).toBe(true);
    expect(lower?.passed).toBe(true);
    expect(number?.passed).toBe(true);
    expect(special?.passed).toBe(false);
  });

  it('percent is between 0 and 100', () => {
    const p1 = scorePassword('').percent;
    const p2 = scorePassword('MyStr0ng!Password#99').percent;
    expect(p1).toBeGreaterThanOrEqual(0);
    expect(p2).toBeLessThanOrEqual(100);
  });

  it('entropy increases with password length', () => {
    const e1 = scorePassword('abc').entropy;
    const e2 = scorePassword('abcdefghijklmno').entropy;
    expect(e2).toBeGreaterThan(e1);
  });

  it('provides label and color', () => {
    const r = scorePassword('StrongP@ss1!');
    expect(typeof r.label).toBe('string');
    expect(r.color).toMatch(/^#/);
  });
});

describe('scorePassword - STRICT config', () => {
  it('requires 12+ chars for full score', () => {
    const r = scorePassword('MyP@ss1', STRENGTH_CONFIG_STRICT);
    const lenRule = r.rules.find((rule) => rule.id === 'length');
    expect(lenRule?.passed).toBe(false);
  });

  it('requires higher minAcceptableScore', () => {
    expect(STRENGTH_CONFIG_STRICT.minAcceptableScore).toBe(3);
    const r = scorePassword('MyP@ss1', STRENGTH_CONFIG_STRICT);
    expect(r.acceptable).toBe(false);
  });

  it('accepts very strong passwords', () => {
    const r = scorePassword('Tr0ub4dor&3SecureLong!', STRENGTH_CONFIG_STRICT);
    expect(r.acceptable).toBe(true);
  });
});

describe('scorePassword - SIMPLE config', () => {
  it('accepts simpler passwords', () => {
    const r = scorePassword('Hello123', STRENGTH_CONFIG_SIMPLE);
    expect(r.acceptable).toBe(true);
  });

  it('has fewer rules', () => {
    const r = scorePassword('test', STRENGTH_CONFIG_SIMPLE);
    expect(r.rules.length).toBe(4);
  });
});

describe('scorePassword - FRENCH config', () => {
  it('returns French labels', () => {
    const r = scorePassword('', STRENGTH_CONFIG_FR);
    expect(r.label).toBe('Très faible');
  });

  it('returns correct French level for good password', () => {
    const r = scorePassword('MonMotDePasse#99!', STRENGTH_CONFIG_FR);
    expect(['Bon', 'Excellent']).toContain(r.label);
  });
});

describe('scorePassword - custom config', () => {
  it('uses custom rules', () => {
    const r = scorePassword('test', {
      rules: [
        { id: 'len', label: 'Min 4 chars', test: (p) => p.length >= 4 },
        { id: 'num', label: 'Has digit', test: (p) => /\d/.test(p) },
      ],
    });
    const lenRule = r.rules.find((rule) => rule.id === 'len');
    expect(lenRule?.passed).toBe(true);
  });

  it('uses custom levels', () => {
    const r = scorePassword('Hello', {
      levels: [
        { label: 'Mauvais', color: '#ef4444', minScore: 0 },
        { label: 'Passable', color: '#f97316', minScore: 1 },
        { label: 'Correct', color: '#22c55e', minScore: 2 },
        { label: 'Parfait', color: '#16a34a', minScore: 3 },
      ],
    });
    expect(['Mauvais', 'Passable', 'Correct', 'Parfait']).toContain(r.label);
  });
});

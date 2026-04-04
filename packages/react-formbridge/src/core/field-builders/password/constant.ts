// ─── Default rules ────────────────────────────────────────────────────────────

import type { StrengthConfig, StrengthRuleConfig, StrengthScoreLevel } from './types';

function hasSequential(str: string, length = 3): boolean {
  const seqs = [
    'abcdefghijklmnopqrstuvwxyz',
    '0123456789',
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm',
    'azertyuiop',
  ];
  const lower = str.toLowerCase();
  for (const seq of seqs) {
    for (let i = 0; i <= seq.length - length; i++) {
      const chunk = seq.substring(i, i + length);
      if (lower.includes(chunk) || lower.includes(chunk.split('').reverse().join(''))) {
        return true;
      }
    }
  }
  return false;
}

export const DEFAULT_RULES: StrengthRuleConfig[] = [
  {
    id: 'length8',
    label: 'At least 8 characters',
    test: (p) => p.length >= 8,
    weight: 1,
  },
  {
    id: 'length12',
    label: 'At least 12 characters',
    test: (p) => p.length >= 12,
    weight: 1,
  },
  {
    id: 'uppercase',
    label: 'At least one uppercase letter (A–Z)',
    test: (p) => /[A-Z]/.test(p),
    weight: 1,
  },
  {
    id: 'lowercase',
    label: 'At least one lowercase letter (a–z)',
    test: (p) => /[a-z]/.test(p),
    weight: 1,
  },
  {
    id: 'number',
    label: 'At least one number (0–9)',
    test: (p) => /\d/.test(p),
    weight: 1,
  },
  {
    id: 'special',
    label: 'At least one special character (!@#$...)',
    test: (p) => /[^A-Za-z0-9]/.test(p),
    weight: 1,
  },
  {
    id: 'no_common',
    label: 'Not a common password',
    test: (p) => !COMMON_PASSWORDS.has(p.toLowerCase()),
    weight: 1,
  },
  {
    id: 'no_repeat',
    label: 'No repeated characters (aaa, 111)',
    test: (p) => !/(.)\1{2,}/.test(p),
    weight: 0.5,
  },
  {
    id: 'no_sequential',
    label: 'No sequential characters (abc, 123)',
    test: (p) => !hasSequential(p),
    weight: 0.5,
  },
];

// ─── Default levels ───────────────────────────────────────────────────────────

export const DEFAULT_LEVELS: StrengthScoreLevel[] = [
  { label: 'Too weak', color: '#ef4444', minScore: 0 }, // score 0
  { label: 'Weak', color: '#f97316', minScore: 1 }, // score 1
  { label: 'Fair', color: '#eab308', minScore: 2 }, // score 2
  { label: 'Good', color: '#22c55e', minScore: 3 }, // score 3
  { label: 'Strong', color: '#16a34a', minScore: 4 }, // score 4
];

// ─── Common passwords list (top 100) ─────────────────────────────────────────

export const COMMON_PASSWORDS = new Set([
  'password',
  'password1',
  'password123',
  '123456',
  '1234567',
  '12345678',
  '123456789',
  '1234567890',
  'qwerty',
  'qwerty123',
  'abc123',
  'letmein',
  'monkey',
  'dragon',
  'master',
  'iloveyou',
  'admin',
  'welcome',
  'login',
  'pass',
  'test',
  '1234',
  '111111',
  '000000',
  'baseball',
  'football',
  'soccer',
  'sunshine',
  'princess',
  'shadow',
  'superman',
  'michael',
  'jessica',
  'charlie',
  'donald',
  'batman',
  'trustno1',
  'hello',
  'passw0rd',
  'p@ssword',
  'p@ssw0rd',
  'admin123',
  'root',
  'toor',
  'test123',
  'user',
  'guest',
  'changeme',
  'secret',
  'access',
  'qazwsx',
  'zxcvbn',
  'azerty',
  'azertyuiop',
]);

/**
 * Strict config: requires 12+ chars, uppercase, lowercase, number, special.
 */
export const STRENGTH_CONFIG_STRICT: StrengthConfig = {
  rules: [
    {
      id: 'length',
      label: 'At least 12 characters',
      test: (p) => p.length >= 12,
      weight: 2,
      required: true,
    },
    {
      id: 'upper',
      label: 'Uppercase letter (A–Z)',
      test: (p) => /[A-Z]/.test(p),
      weight: 1,
      required: true,
    },
    {
      id: 'lower',
      label: 'Lowercase letter (a–z)',
      test: (p) => /[a-z]/.test(p),
      weight: 1,
      required: true,
    },
    {
      id: 'number',
      label: 'Number (0–9)',
      test: (p) => /\d/.test(p),
      weight: 1,
      required: true,
    },
    {
      id: 'special',
      label: 'Special character',
      test: (p) => /[^A-Za-z0-9]/.test(p),
      weight: 1,
      required: true,
    },
    {
      id: 'no_common',
      label: 'Not a common password',
      test: (p) => !COMMON_PASSWORDS.has(p.toLowerCase()),
      weight: 2,
    },
  ],
  minAcceptableScore: 3,
};

/**
 * Simple config: just length + character variety.
 */
export const STRENGTH_CONFIG_SIMPLE: StrengthConfig = {
  rules: [
    {
      id: 'length6',
      label: 'At least 6 characters',
      test: (p) => p.length >= 6,
      weight: 1,
    },
    {
      id: 'length8',
      label: 'At least 8 characters',
      test: (p) => p.length >= 8,
      weight: 1,
    },
    {
      id: 'mixed',
      label: 'Mix of letters & numbers',
      test: (p) => /[a-zA-Z]/.test(p) && /\d/.test(p),
      weight: 1,
    },
    {
      id: 'special',
      label: 'Special character',
      test: (p) => /[^A-Za-z0-9]/.test(p),
      weight: 1,
    },
  ],
  minAcceptableScore: 2,
};

/**
 * French-labeled config.
 */
export const STRENGTH_CONFIG_FR: StrengthConfig = {
  rules: [
    {
      id: 'length',
      label: '8 caractères minimum',
      test: (p) => p.length >= 8,
      weight: 1,
    },
    {
      id: 'length12',
      label: '12 caractères (recommandé)',
      test: (p) => p.length >= 12,
      weight: 1,
    },
    {
      id: 'upper',
      label: 'Une lettre majuscule (A–Z)',
      test: (p) => /[A-Z]/.test(p),
      weight: 1,
    },
    {
      id: 'lower',
      label: 'Une lettre minuscule (a–z)',
      test: (p) => /[a-z]/.test(p),
      weight: 1,
    },
    { id: 'number', label: 'Un chiffre (0–9)', test: (p) => /\d/.test(p), weight: 1 },
    {
      id: 'special',
      label: 'Un caractère spécial (!@#$...)',
      test: (p) => /[^A-Za-z0-9]/.test(p),
      weight: 1,
    },
    {
      id: 'common',
      label: 'Pas un mot de passe courant',
      test: (p) => !COMMON_PASSWORDS.has(p.toLowerCase()),
      weight: 1,
    },
  ],
  levels: [
    { label: 'Très faible', color: '#ef4444', minScore: 0 },
    { label: 'Faible', color: '#f97316', minScore: 1 },
    { label: 'Moyen', color: '#eab308', minScore: 2 },
    { label: 'Bon', color: '#22c55e', minScore: 3 },
    { label: 'Excellent', color: '#16a34a', minScore: 4 },
  ],
  minAcceptableScore: 2,
};

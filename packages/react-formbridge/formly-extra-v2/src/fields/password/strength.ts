/**
 * formura — Password Strength Engine
 * ──────────────────────────────────────
 * Scores a password from 0 to 4 based on multiple criteria.
 * Fully customizable: rules, labels, colors, feedback messages.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

/** A single password rule with its pass/fail state */
export interface PasswordRule {
  /** Unique key for this rule */
  id:          string;
  /** Human-readable description */
  label:       string;
  /** Whether the current value satisfies this rule */
  passed:      boolean;
  /** Whether this rule is required to hit each score level */
  required?:   boolean;
}

/** The result of scoring a password */
export interface StrengthResult {
  /** Score 0–4 */
  score:        number;
  /** Normalized 0–100 percentage */
  percent:      number;
  /** Label for the score (e.g. "Weak") */
  label:        string;
  /** Color associated with the score */
  color:        string;
  /** Array of rule states */
  rules:        PasswordRule[];
  /** Whether the password meets the minimum acceptable strength */
  acceptable:   boolean;
  /** Entropy estimate in bits */
  entropy:      number;
}

// ─── Scoring configuration ────────────────────────────────────────────────────

export interface StrengthScoreLevel {
  /** Label shown to the user */
  label: string;
  /** Color (hex or CSS color) */
  color: string;
  /** Minimum score to reach this level (0–4) */
  minScore: number;
}

export interface StrengthConfig {
  /** Custom rule definitions */
  rules?: StrengthRuleConfig[];
  /** Score level definitions (5 levels: 0–4) */
  levels?: StrengthScoreLevel[];
  /** Minimum score considered acceptable (default: 2) */
  minAcceptableScore?: number;
}

export interface StrengthRuleConfig {
  id:       string;
  label:    string;
  /** Test function — return true if the rule passes */
  test:     (password: string) => boolean;
  /** Points awarded when this rule passes (default: 1) */
  weight?:  number;
}

// ─── Default rules ────────────────────────────────────────────────────────────

const DEFAULT_RULES: StrengthRuleConfig[] = [
  {
    id:     'length8',
    label:  'At least 8 characters',
    test:   (p) => p.length >= 8,
    weight: 1,
  },
  {
    id:     'length12',
    label:  'At least 12 characters',
    test:   (p) => p.length >= 12,
    weight: 1,
  },
  {
    id:     'uppercase',
    label:  'At least one uppercase letter (A–Z)',
    test:   (p) => /[A-Z]/.test(p),
    weight: 1,
  },
  {
    id:     'lowercase',
    label:  'At least one lowercase letter (a–z)',
    test:   (p) => /[a-z]/.test(p),
    weight: 1,
  },
  {
    id:     'number',
    label:  'At least one number (0–9)',
    test:   (p) => /\d/.test(p),
    weight: 1,
  },
  {
    id:     'special',
    label:  'At least one special character (!@#$...)',
    test:   (p) => /[^A-Za-z0-9]/.test(p),
    weight: 1,
  },
  {
    id:     'no_common',
    label:  'Not a common password',
    test:   (p) => !COMMON_PASSWORDS.has(p.toLowerCase()),
    weight: 1,
  },
  {
    id:     'no_repeat',
    label:  'No repeated characters (aaa, 111)',
    test:   (p) => !/(.)\1{2,}/.test(p),
    weight: 0.5,
  },
  {
    id:     'no_sequential',
    label:  'No sequential characters (abc, 123)',
    test:   (p) => !hasSequential(p),
    weight: 0.5,
  },
];

// ─── Default levels ───────────────────────────────────────────────────────────

const DEFAULT_LEVELS: StrengthScoreLevel[] = [
  { label: 'Too weak',  color: '#ef4444', minScore: 0 },  // score 0
  { label: 'Weak',      color: '#f97316', minScore: 1 },  // score 1
  { label: 'Fair',      color: '#eab308', minScore: 2 },  // score 2
  { label: 'Good',      color: '#22c55e', minScore: 3 },  // score 3
  { label: 'Strong',    color: '#16a34a', minScore: 4 },  // score 4
];

// ─── Common passwords list (top 100) ─────────────────────────────────────────

const COMMON_PASSWORDS = new Set([
  'password','password1','password123','123456','1234567','12345678','123456789',
  '1234567890','qwerty','qwerty123','abc123','letmein','monkey','dragon','master',
  'iloveyou','admin','welcome','login','pass','test','1234','111111','000000',
  'baseball','football','soccer','sunshine','princess','shadow','superman','michael',
  'jessica','charlie','donald','batman','trustno1','hello','passw0rd','p@ssword',
  'p@ssw0rd','admin123','root','toor','test123','user','guest','changeme',
  'secret','access','qazwsx','zxcvbn','azerty','azertyuiop',
]);

// ─── Sequential check ─────────────────────────────────────────────────────────

function hasSequential(str: string, length = 3): boolean {
  const seqs = [
    'abcdefghijklmnopqrstuvwxyz',
    '0123456789',
    'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
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

// ─── Entropy estimation ───────────────────────────────────────────────────────

function estimateEntropy(password: string): number {
  if (!password) return 0;
  let charsetSize = 0;
  if (/[a-z]/.test(password))      charsetSize += 26;
  if (/[A-Z]/.test(password))      charsetSize += 26;
  if (/\d/.test(password))         charsetSize += 10;
  if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32;
  return password.length * Math.log2(charsetSize || 1);
}

// ─── Score calculator ─────────────────────────────────────────────────────────

/**
 * Score a password and return a StrengthResult.
 * Uses the default rule set unless a custom config is provided.
 *
 * @example
 * const result = scorePassword("MyP@ss123");
 * result.score   // 3
 * result.label   // "Good"
 * result.color   // "#22c55e"
 * result.rules   // [{ id: "length8", passed: true, ... }, ...]
 */
export function scorePassword(
  password: string,
  config:   StrengthConfig = {},
): StrengthResult {
  const rules  = config.rules  ?? DEFAULT_RULES;
  const levels = config.levels ?? DEFAULT_LEVELS;
  const minAcceptable = config.minAcceptableScore ?? 2;

  if (!password) {
    return {
      score: 0, percent: 0,
      label: levels[0].label, color: levels[0].color,
      rules: rules.map(r => ({ id: r.id, label: r.label, passed: false })),
      acceptable: false,
      entropy: 0,
    };
  }

  // Evaluate rules
  const evaluated = rules.map(r => ({
    id:     r.id,
    label:  r.label,
    passed: r.test(password),
    weight: r.weight ?? 1,
  }));

  // Compute weighted score
  const totalWeight = evaluated.reduce((s, r) => s + r.weight, 0);
  const passedWeight = evaluated.filter(r => r.passed).reduce((s, r) => s + r.weight, 0);
  const ratio  = totalWeight > 0 ? passedWeight / totalWeight : 0;

  // Map to 0–4 score
  const raw   = ratio * 4;
  const score = Math.min(4, Math.floor(raw + 0.1)) as 0 | 1 | 2 | 3 | 4;

  // Find label & color
  const level = [...levels].reverse().find(l => score >= l.minScore) ?? levels[0];

  return {
    score,
    percent:    Math.round(ratio * 100),
    label:      level.label,
    color:      level.color,
    rules:      evaluated.map(r => ({ id: r.id, label: r.label, passed: r.passed })),
    acceptable: score >= minAcceptable,
    entropy:    Math.round(estimateEntropy(password)),
  };
}

// ─── Preset configurations ────────────────────────────────────────────────────

/**
 * Strict config: requires 12+ chars, uppercase, lowercase, number, special.
 */
export const STRENGTH_CONFIG_STRICT: StrengthConfig = {
  rules: [
    { id: 'length',    label: 'At least 12 characters', test: p => p.length >= 12,    weight: 2 },
    { id: 'upper',     label: 'Uppercase letter (A–Z)',  test: p => /[A-Z]/.test(p),   weight: 1 },
    { id: 'lower',     label: 'Lowercase letter (a–z)',  test: p => /[a-z]/.test(p),   weight: 1 },
    { id: 'number',    label: 'Number (0–9)',            test: p => /\d/.test(p),       weight: 1 },
    { id: 'special',   label: 'Special character',       test: p => /[^A-Za-z0-9]/.test(p), weight: 1 },
    { id: 'no_common', label: 'Not a common password',   test: p => !COMMON_PASSWORDS.has(p.toLowerCase()), weight: 2 },
  ],
  minAcceptableScore: 3,
};

/**
 * Simple config: just length + character variety.
 */
export const STRENGTH_CONFIG_SIMPLE: StrengthConfig = {
  rules: [
    { id: 'length6',  label: 'At least 6 characters',  test: p => p.length >= 6,      weight: 1 },
    { id: 'length8',  label: 'At least 8 characters',  test: p => p.length >= 8,      weight: 1 },
    { id: 'mixed',    label: 'Mix of letters & numbers',test: p => /[a-zA-Z]/.test(p) && /\d/.test(p), weight: 1 },
    { id: 'special',  label: 'Special character',       test: p => /[^A-Za-z0-9]/.test(p), weight: 1 },
  ],
  minAcceptableScore: 2,
};

/**
 * French-labeled config.
 */
export const STRENGTH_CONFIG_FR: StrengthConfig = {
  rules: [
    { id: 'length',  label: '8 caractères minimum',           test: p => p.length >= 8,         weight: 1 },
    { id: 'length12',label: '12 caractères (recommandé)',      test: p => p.length >= 12,        weight: 1 },
    { id: 'upper',   label: 'Une lettre majuscule (A–Z)',      test: p => /[A-Z]/.test(p),       weight: 1 },
    { id: 'lower',   label: 'Une lettre minuscule (a–z)',      test: p => /[a-z]/.test(p),       weight: 1 },
    { id: 'number',  label: 'Un chiffre (0–9)',                test: p => /\d/.test(p),          weight: 1 },
    { id: 'special', label: 'Un caractère spécial (!@#$...)',  test: p => /[^A-Za-z0-9]/.test(p),weight: 1 },
    { id: 'common',  label: 'Pas un mot de passe courant',     test: p => !COMMON_PASSWORDS.has(p.toLowerCase()), weight: 1 },
  ],
  levels: [
    { label: 'Très faible', color: '#ef4444', minScore: 0 },
    { label: 'Faible',      color: '#f97316', minScore: 1 },
    { label: 'Moyen',       color: '#eab308', minScore: 2 },
    { label: 'Bon',         color: '#22c55e', minScore: 3 },
    { label: 'Excellent',   color: '#16a34a', minScore: 4 },
  ],
  minAcceptableScore: 2,
};

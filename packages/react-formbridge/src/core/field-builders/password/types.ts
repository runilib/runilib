/** A single password rule with its pass/fail state */
export interface PasswordRule {
  /** Unique key for this rule */
  id: string;
  /** Human-readable description */
  label: string;
  /** Whether the current value satisfies this rule */
  passed: boolean;
  /** Whether this rule is required to hit each score level */
  required?: boolean;
}

/** The result of scoring a password */
export interface StrengthResult {
  /** Score 0–4 */
  score: number;
  /** Normalized 0–100 percentage */
  percent: number;
  /** Label for the score (e.g. "Weak") */
  label: string;
  /** Color associated with the score */
  color: string;
  /** Array of rule states */
  rules: PasswordRule[];
  /** Whether the password meets the minimum acceptable strength */
  acceptable: boolean;
  /** Entropy estimate in bits */
  entropy: number;
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
  id: string;
  label: string;
  /** Test function — return true if the rule passes */
  test: (password: string) => boolean;
  /** Points awarded when this rule passes (default: 1) */
  weight?: number;
}

/**
 * react-formbridge — Password Strength Engine
 * ──────────────────────────────────────
 * Scores a password from 0 to 4 based on multiple criteria.
 * Fully customizable: rules, labels, colors, feedback messages.
 */

import { DEFAULT_LEVELS, DEFAULT_RULES } from './constant';
import type { StrengthConfig, StrengthResult } from './types';

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Sequential check ─────────────────────────────────────────────────────────

// ─── Entropy estimation ───────────────────────────────────────────────────────

function estimateEntropy(password: string): number {
  if (!password) return 0;
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/\d/.test(password)) charsetSize += 10;
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
  config: StrengthConfig = {},
): StrengthResult {
  const rules = config.rules ?? DEFAULT_RULES;
  const levels = config.levels ?? DEFAULT_LEVELS;
  const minAcceptable = config.minAcceptableScore ?? 2;

  if (!password) {
    return {
      score: 0,
      percent: 0,
      label: levels[0].label,
      color: levels[0].color,
      rules: rules.map((r) => ({ id: r.id, label: r.label, passed: false })),
      acceptable: false,
      entropy: 0,
    };
  }

  // Evaluate rules
  const evaluated = rules.map((r) => ({
    id: r.id,
    label: r.label,
    passed: r.test(password),
    weight: r.weight ?? 1,
    required: r.required ?? false,
  }));

  // Compute weighted score
  const totalWeight = evaluated.reduce((s, r) => s + r.weight, 0);
  const passedWeight = evaluated
    .filter((r) => r.passed)
    .reduce((s, r) => s + r.weight, 0);
  const ratio = totalWeight > 0 ? passedWeight / totalWeight : 0;

  // Map to 0–4 score
  const raw = ratio * 4;
  const score = Math.min(4, Math.floor(raw + 0.1)) as 0 | 1 | 2 | 3 | 4;

  // Find label & color
  const level = [...levels].reverse().find((l) => score >= l.minScore) ?? levels[0];
  const requiredRulesPassed = evaluated.every((rule) => !rule.required || rule.passed);

  return {
    score,
    percent: Math.round(ratio * 100),
    label: level.label,
    color: level.color,
    rules: evaluated.map((r) => ({
      id: r.id,
      label: r.label,
      passed: r.passed,
      required: r.required,
    })),
    acceptable: score >= minAcceptable && requiredRulesPassed,
    entropy: Math.round(estimateEntropy(password)),
  };
}

// ─── Preset configurations ────────────────────────────────────────────────────

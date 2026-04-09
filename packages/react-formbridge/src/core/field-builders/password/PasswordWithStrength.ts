import type { StrengthConfig, StrengthScoreLevel } from './types';

// ─── Extended descriptor ──────────────────────────────────────────────────────

export interface PasswordStrengthMeta {
  _strengthEnabled: boolean;
  _strengthConfig: StrengthConfig;
  _strengthShowBar: boolean;
  _strengthShowLabel: boolean;
  _strengthShowRules: boolean;
  _strengthHideRulesWhenValid: boolean;
  _strengthShowEntropy: boolean;
  _strengthBarHeight: number;
  _strengthBarRadius: number;
  _strengthMinAccept: number;
  _strengthBlockWeak: boolean;
  _strengthBlockMsg: string;
  _strengthCustomLevels: StrengthScoreLevel[] | null;
}

/** Default meta values */
export const DEFAULT_STRENGTH_META: PasswordStrengthMeta = {
  _strengthEnabled: false,
  _strengthConfig: {},
  _strengthShowBar: true,
  _strengthShowLabel: true,
  _strengthShowRules: false,
  _strengthHideRulesWhenValid: false,
  _strengthShowEntropy: false,
  _strengthBarHeight: 5,
  _strengthBarRadius: 3,
  _strengthMinAccept: 2,
  _strengthBlockWeak: false,
  _strengthBlockMsg: 'Password is too weak.',
  _strengthCustomLevels: null,
};

/**
 * Mixin applied to PasswordFieldBuilder — adds the .withStrengthIndicator() method.
 *
 * @example
 * field.password('Password')
 *   .required()
 *   .withStrengthIndicator({
 *     showRules:    true,
 *     showLabel:    true,
 *     showEntropy:  false,
 *     config:       STRENGTH_CONFIG_STRICT,
 *     blockWeak:    true,       // prevents submit if score < minAcceptableScore
 *   })
 */
export class PasswordStrengthMixin {
  protected _strength: PasswordStrengthMeta = { ...DEFAULT_STRENGTH_META };

  withStrengthIndicator(
    options: {
      /** Show the strength progress bar (default: true) */
      showBar?: boolean;
      /** Show the strength label (default: true) */
      showLabel?: boolean;
      /** Show the checklist of rules (default: false) */
      showRules?: boolean;
      /** Hide the checklist once the password is valid/acceptable (default: false) */
      hideRulesWhenValid?: boolean;
      /** Show entropy estimate in bits (default: false) */
      showEntropy?: boolean;
      /** Bar height in pixels (default: 5) */
      barHeight?: number;
      /** Bar border radius (default: 3) */
      barRadius?: number;
      /** Use a specific strength config (rules, levels, minAcceptableScore) */
      config?: StrengthConfig;
      /**
       * Override score level definitions.
       * If provided, overrides config.levels.
       */
      levels?: StrengthScoreLevel[];
      /**
       * Block form submission if score < minAcceptableScore.
       * Adds a validator that returns the blockMsg.
       */
      blockWeak?: boolean;
      blockMsg?: string;
    } = {},
  ): this {
    this._strength = {
      _strengthEnabled: true,
      _strengthConfig: options.config ?? {},
      _strengthShowBar: options.showBar ?? true,
      _strengthShowLabel: options.showLabel ?? true,
      _strengthShowRules: options.showRules ?? false,
      _strengthHideRulesWhenValid:
        options.hideRulesWhenValid ?? this._strength._strengthHideRulesWhenValid,
      _strengthShowEntropy: options.showEntropy ?? false,
      _strengthBarHeight: options.barHeight ?? 5,
      _strengthBarRadius: options.barRadius ?? 3,
      _strengthMinAccept: options.config?.minAcceptableScore ?? 2,
      _strengthBlockWeak: options.blockWeak ?? false,
      _strengthBlockMsg: options.blockMsg ?? 'Password is too weak.',
      _strengthCustomLevels: options.levels ?? null,
    };
    return this;
  }

  hideRulesWhenValid(enabled = true): this {
    this._strength = {
      ...this._strength,
      _strengthHideRulesWhenValid: enabled,
    };

    return this;
  }
}

/** Check if a descriptor has strength metadata */
export function isStrengthDescriptor(d: object): d is PasswordStrengthMeta {
  return '_strengthEnabled' in d && (d as PasswordStrengthMeta)._strengthEnabled === true;
}

import { StringFieldBuilder } from '../string/StringFieldBuilder';
import {
  DEFAULT_STRENGTH_META,
  type PasswordStrengthMeta,
  PasswordStrengthMixin,
} from './PasswordWithStrength';
import { scorePassword } from './strength';

// ─── Password field builder ──────────────────────────────────────────────────

export class PasswordFieldBuilder extends StringFieldBuilder<'password'> {
  protected _strength: PasswordStrengthMeta = { ...DEFAULT_STRENGTH_META };
  constructor() {
    super('password');
  }

  /** Enforce a strong password */
  strong(message?: string): this {
    this._desc._strongPassword = true;

    this._desc._validators.push((value: string) => {
      if (value.length < 8) {
        return message ?? 'Password must be at least 8 characters.';
      }
      if (!/[A-Z]/.test(value)) {
        return message ?? 'Password must contain at least one uppercase letter.';
      }
      if (!/[a-z]/.test(value)) {
        return message ?? 'Password must contain at least one lowercase letter.';
      }
      if (!/\d/.test(value)) {
        return message ?? 'Password must contain at least one number.';
      }
      if (!/[^A-Za-z0-9]/.test(value)) {
        return message ?? 'Password must contain at least one special character.';
      }

      return null;
    });

    return this;
  }

  // ── NOUVEAU : brancher le mixin ──
  withStrengthIndicator(
    options: Parameters<PasswordStrengthMixin['withStrengthIndicator']>[0] = {},
  ): this {
    PasswordStrengthMixin.prototype.withStrengthIndicator.call(this, options);
    return this;
  }

  hideRulesWhenValid(enabled = true): this {
    PasswordStrengthMixin.prototype.hideRulesWhenValid.call(this, enabled);
    return this;
  }

  /**
   * @internal
   */
  _build() {
    const base = super._build(); // descriptor de StringFieldBuilder
    const validators = [...base._validators];

    if (this._strength._strengthEnabled && this._strength._strengthBlockWeak) {
      validators.push((value: string) => {
        if (!value) {
          return null;
        }

        const result = scorePassword(value, {
          ...this._strength._strengthConfig,
          levels:
            this._strength._strengthCustomLevels ?? this._strength._strengthConfig.levels,
          minAcceptableScore: this._strength._strengthMinAccept,
        });

        return result.acceptable ? null : this._strength._strengthBlockMsg;
      });
    }

    return {
      ...base,
      ...this._strength, // ajoute tous les _strengthXxx dans le descriptor
      _validators: validators,
    };
  }
}

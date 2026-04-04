import { StringFieldBuilder } from '../string/StringFieldBuilder';
import {
  DEFAULT_STRENGTH_META,
  type PasswordStrengthMeta,
  PasswordStrengthMixin,
} from './PasswordWithStrength';

// ─── Password field builder ──────────────────────────────────────────────────

export class PasswordFieldBuilder extends StringFieldBuilder<'password'> {
  protected _strength: PasswordStrengthMeta = { ...DEFAULT_STRENGTH_META };
  constructor(label: string) {
    super('password', label);
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

  // ── surcharger _build() pour injecter _strength dans le descriptor ──
  _build() {
    const base = super._build(); // descriptor de StringFieldBuilder
    return {
      ...base,
      ...this._strength, // ajoute tous les _strengthXxx dans le descriptor
    };
  }
}

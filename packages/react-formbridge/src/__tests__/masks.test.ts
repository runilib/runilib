import { describe, expect, it } from 'vitest';
import { MASKS } from '../core/field-builders/mask/constants';
import {
  applyMask,
  extractRaw,
  maskCompleteValidator,
  parsePattern,
} from '../core/field-builders/mask/masks';

describe('parsePattern', () => {
  it('parses digit tokens', () => {
    const tokens = parsePattern('99');
    expect(tokens).toHaveLength(2);
    expect(tokens[0].isInput).toBe(true);
    expect(tokens[0].regex).toEqual(/\d/);
  });

  it('parses separator tokens', () => {
    const tokens = parsePattern('99/99');
    expect(tokens[2].isInput).toBe(false);
    expect(tokens[2].separator).toBe('/');
  });

  it('parses letter tokens', () => {
    const tokens = parsePattern('aa');
    expect(tokens[0].regex).toEqual(/[a-zA-Z]/);
  });

  it('parses mixed tokens', () => {
    const tokens = parsePattern('a9*');
    expect(tokens[0].regex).toEqual(/[a-zA-Z]/);
    expect(tokens[1].regex).toEqual(/\d/);
    expect(tokens[2].regex).toEqual(/./);
  });

  it('parses escaped characters', () => {
    const tokens = parsePattern('9\\-9');
    expect(tokens[1].isInput).toBe(false);
    expect(tokens[1].separator).toBe('-');
  });
});

describe('applyMask — card number', () => {
  const PATTERN = MASKS.CARD_16;

  it('formats 16 digits', () => {
    const { display, raw, complete } = applyMask('4111111111111111', PATTERN);
    expect(display).toBe('4111 1111 1111 1111');
    expect(raw).toBe('4111111111111111');
    expect(complete).toBe(true);
  });

  it('formats partial input', () => {
    const { display, complete } = applyMask('4111', PATTERN);
    expect(display).toBe('4111');
    expect(complete).toBe(false);
  });

  it('strips non-digits from input', () => {
    const { display } = applyMask('4111-1111-1111-1111', PATTERN);
    expect(display).toBe('4111 1111 1111 1111');
  });

  it('handles empty input', () => {
    const { display, raw, complete } = applyMask('', PATTERN);
    expect(display).toBe('');
    expect(raw).toBe('');
    expect(complete).toBe(false);
  });

  it('truncates to pattern length', () => {
    const { raw } = applyMask('41111111111111119999', PATTERN);
    expect(raw.length).toBe(16);
  });
});

describe('applyMask — date', () => {
  it('formats DD/MM/YYYY', () => {
    const { display, complete } = applyMask('31122025', MASKS.DATE_DMY);
    expect(display).toBe('31/12/2025');
    expect(complete).toBe(true);
  });

  it('formats partial date', () => {
    const { display } = applyMask('3112', MASKS.DATE_DMY);
    expect(display).toBe('31/12');
  });
});

describe('applyMask — IBAN', () => {
  it('formats French IBAN', () => {
    const { display } = applyMask('FR7630006000011234567890189', MASKS.IBAN_FR);
    expect(display).toBe('FR76 3000 6000 0112 3456 7890 189');
  });
});

describe('applyMask — placeholder', () => {
  it('shows placeholder chars for empty slots', () => {
    const { display } = applyMask('4111', MASKS.CARD_16, {
      showPlaceholder: true,
      placeholder: '_',
    });
    expect(display).toContain('_');
    expect(display.startsWith('4111')).toBe(true);
  });
});

describe('extractRaw', () => {
  it('extracts raw from formatted card', () => {
    const raw = extractRaw('4111 1111 1111 1111', MASKS.CARD_16);
    expect(raw).toBe('4111111111111111');
  });

  it('extracts raw from partial', () => {
    const raw = extractRaw('4111 11', MASKS.CARD_16);
    expect(raw).toBe('411111');
  });

  it('returns empty for empty string', () => {
    expect(extractRaw('', MASKS.CARD_16)).toBe('');
  });
});

describe('maskCompleteValidator', () => {
  it('returns null when complete', () => {
    const validate = maskCompleteValidator(MASKS.EXPIRY);
    expect(validate('1225')).toBeNull();
  });

  it('returns error when incomplete', () => {
    const validate = maskCompleteValidator(MASKS.EXPIRY, 'Incomplete.');
    expect(validate('12')).toBe('Incomplete.');
  });

  it('returns error for empty value', () => {
    const validate = maskCompleteValidator(MASKS.CVV);
    expect(validate('')).not.toBeNull();
  });
});

describe('MASKS presets', () => {
  it('CARD_AMEX is 15 input slots', () => {
    const tokens = parsePattern(MASKS.CARD_AMEX);
    const inputCount = tokens.filter((t) => t.isInput).length;
    expect(inputCount).toBe(15);
  });

  it('EXPIRY is 4 input slots', () => {
    const tokens = parsePattern(MASKS.EXPIRY);
    const inputCount = tokens.filter((t) => t.isInput).length;
    expect(inputCount).toBe(4);
  });

  it('DATE_ISO produces YYYY-MM-DD format', () => {
    const { display } = applyMask('20250315', MASKS.DATE_ISO);
    expect(display).toBe('2025-03-15');
  });

  it('SIREN formats French company ID', () => {
    const { display } = applyMask('123456789', MASKS.SIREN);
    expect(display).toBe('123 456 789');
  });
});

import { describe, expect, it } from 'vitest';
import { field } from '../field';
import { applyMask, extractRaw, getMaskAutoLayout, getMaskPlaceholder } from './masks';

describe('mask helpers', () => {
  it('builds a placeholder string from the mask pattern', () => {
    expect(getMaskPlaceholder('99/99')).toBe('__/__');
    expect(getMaskPlaceholder('9999 9999 9999 9999')).toBe('____ ____ ____ ____');
  });

  it('keeps the next cursor position at the first editable slot when empty', () => {
    expect(
      applyMask('', '99/99', {
        showPlaceholder: true,
        placeholder: '_',
      }).nextCursorPos,
    ).toBe(0);
  });

  it('returns a more usable compact width for short masks', () => {
    const cvvLayout = getMaskAutoLayout('999');
    const expiryLayout = getMaskAutoLayout('99/99');

    expect(cvvLayout.compact).toBe(true);
    expect(expiryLayout.compact).toBe(true);
    expect(cvvLayout.webWidthCh).toBeGreaterThanOrEqual(10);
    expect(expiryLayout.webWidthCh).toBeGreaterThanOrEqual(10);
    expect(cvvLayout.nativeWidthPx).toBeGreaterThanOrEqual(128);
    expect(expiryLayout.nativeWidthPx).toBeGreaterThanOrEqual(128);
  });

  it('supports custom mask tokens for user-defined patterns', () => {
    const customTokens = {
      L: /[A-Z]/,
    };

    expect(
      applyMask('AB123', 'LL-999', {
        tokens: customTokens,
      }).display,
    ).toBe('AB-123');

    expect(extractRaw('AB-123', 'LL-999', customTokens)).toBe('AB123');
    expect(getMaskPlaceholder('LL-999', '_', customTokens)).toBe('__-___');
  });

  it('keeps formatted separators when an already formatted value is reapplied', () => {
    expect(
      applyMask('23/2027', '99/9999', {
        tokens: undefined,
      }).display,
    ).toBe('23/2027');

    expect(
      applyMask('AB-1234', 'LL-9999', {
        tokens: {
          L: /[A-Z]/,
        },
      }).display,
    ).toBe('AB-1234');
  });

  it('stores the formatted mask by default and supports opting into raw storage', () => {
    const formattedByDefault = field.masked('99/9999')._build();
    const rawOptIn = field.masked('99/9999').storeRaw()._build();

    expect(formattedByDefault._maskStoreRaw).toBe(false);
    expect(rawOptIn._maskStoreRaw).toBe(true);
  });
});

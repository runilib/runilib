/**
 * formbridge - Input Mask Engine
 */

import { type MASK_PRESET, MASK_REGEX, MASKS } from './constants';
import type {
  ApplyMaskOptions,
  MaskPatternConfig,
  MaskResult,
  MaskToken,
  MaskTokenMap,
} from './types';

export type MaskPatternInput = string | MASK_PRESET | MaskPatternConfig;

function getMaskTokenMap(tokens?: MaskTokenMap): MaskTokenMap {
  return {
    ...MASK_REGEX,
    ...tokens,
  };
}

export function resolveMaskPattern(patternInput: MaskPatternInput): {
  pattern: string;
  tokens?: MaskTokenMap;
} {
  if (typeof patternInput === 'string') {
    return {
      pattern: Object.hasOwn(MASKS, patternInput)
        ? MASKS[patternInput as MASK_PRESET]
        : patternInput,
    };
  }

  return {
    pattern: patternInput.pattern,
    tokens: patternInput.tokens,
  };
}

export function parsePattern(pattern: string, customTokens?: MaskTokenMap): MaskToken[] {
  const tokens: MaskToken[] = [];
  const tokenMap = getMaskTokenMap(customTokens);
  let index = 0;

  while (index < pattern.length) {
    const char = pattern[index];

    if (char === '\\') {
      const next = pattern[index + 1] ?? '';
      tokens.push({
        regex: /.*/,
        isInput: false,
        separator: next,
      });
      index += 2;
      continue;
    }

    if (tokenMap[char]) {
      tokens.push({
        regex: tokenMap[char] ?? /.*/,
        isInput: true,
        separator: '',
      });
      index += 1;
      continue;
    }

    tokens.push({
      regex: /.*/,
      isInput: false,
      separator: char,
    });
    index += 1;
  }

  return tokens;
}

function createRegexProbe(regex: RegExp): RegExp {
  const safeFlags = regex.flags.replace(/[gy]/g, '');
  return new RegExp(regex.source, safeFlags);
}

function acceptsAnySample(regex: RegExp, samples: string[]): boolean {
  return samples.some((sample) => createRegexProbe(regex).test(sample));
}

export interface MaskCharacterProfile {
  acceptsLetters: boolean;
  acceptsDigits: boolean;
}

export function getMaskCharacterProfile(
  pattern: string,
  tokenMap?: MaskTokenMap,
): MaskCharacterProfile {
  const tokens = parsePattern(pattern, tokenMap);

  return tokens.reduce<MaskCharacterProfile>(
    (profile, token) => {
      if (!token.isInput) {
        return profile;
      }

      return {
        acceptsLetters:
          profile.acceptsLetters || acceptsAnySample(token.regex, ['A', 'a', 'Z', 'z']),
        acceptsDigits:
          profile.acceptsDigits || acceptsAnySample(token.regex, ['0', '5', '9']),
      };
    },
    {
      acceptsLetters: false,
      acceptsDigits: false,
    },
  );
}

export function getFirstInputPosition(pattern: string, tokenMap?: MaskTokenMap): number {
  const tokens = parsePattern(pattern, tokenMap);
  let position = 0;

  for (const token of tokens) {
    if (token.isInput) {
      return position;
    }

    position += token.separator.length || 1;
  }

  return position;
}

function hasRemainingMatchingChar(
  rawChars: string[],
  rawStartIndex: number,
  tokens: MaskToken[],
  tokenStartIndex: number,
): boolean {
  for (let rawIndex = rawStartIndex; rawIndex < rawChars.length; rawIndex += 1) {
    for (
      let tokenIndex = tokenStartIndex + 1;
      tokenIndex < tokens.length;
      tokenIndex += 1
    ) {
      const token = tokens[tokenIndex];

      if (token?.isInput && token.regex.test(rawChars[rawIndex] ?? '')) {
        return true;
      }
    }
  }

  return false;
}

export function applyMask(
  raw: string,
  pattern: string,
  opts: ApplyMaskOptions = {},
): MaskResult {
  const tokens = parsePattern(pattern, opts.tokens);
  const rawChars = Array.from(raw ?? '');
  const placeholder = opts.placeholder ?? '_';
  const showPlaceholder = opts.showPlaceholder ?? false;

  let display = '';
  let rawOut = '';
  let rawIndex = 0;
  let inputSlots = 0;
  let filledSlots = 0;
  let nextCursorPos = -1;

  const firstInputTokenIndex = tokens.findIndex((token) => token.isInput);
  const firstEditablePos = getFirstInputPosition(pattern, opts.tokens);

  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {
    const token = tokens[tokenIndex];

    if (!token) continue;

    if (!token.isInput) {
      const isLeadingPrefix =
        firstInputTokenIndex === -1 || tokenIndex < firstInputTokenIndex;

      const shouldRenderSeparator =
        isLeadingPrefix ||
        showPlaceholder ||
        (filledSlots > 0 &&
          hasRemainingMatchingChar(rawChars, rawIndex, tokens, tokenIndex));

      if (shouldRenderSeparator) {
        display += token.separator;
      }

      continue;
    }

    inputSlots += 1;

    while (rawIndex < rawChars.length && !token.regex.test(rawChars[rawIndex] ?? '')) {
      rawIndex += 1;
    }

    if (rawIndex < rawChars.length) {
      const char = rawChars[rawIndex] ?? '';
      display += char;
      rawOut += char;
      rawIndex += 1;
      filledSlots += 1;
    } else {
      if (nextCursorPos === -1) {
        nextCursorPos = display.length;
      }

      if (showPlaceholder) {
        display += placeholder;
      }
    }
  }

  return {
    display,
    raw: rawOut,
    complete: inputSlots > 0 && filledSlots === inputSlots,
    nextCursorPos:
      nextCursorPos === -1
        ? Math.max(display.length, firstEditablePos)
        : Math.max(nextCursorPos, firstEditablePos),
  };
}

export function getMaskPlaceholder(
  pattern: string,
  placeholder = '_',
  tokens?: MaskTokenMap,
): string {
  return applyMask('', pattern, {
    showPlaceholder: true,
    placeholder,
    tokens,
  }).display;
}

export function extractRaw(
  display: string,
  pattern: string,
  tokenMap?: MaskTokenMap,
): string {
  const tokens = parsePattern(pattern, tokenMap);
  const chars = Array.from(display ?? '');

  let rawOut = '';
  let charIndex = 0;

  for (const token of tokens) {
    if (charIndex >= chars.length) break;

    if (!token.isInput) {
      if (chars[charIndex] === token.separator) {
        charIndex += 1;
      }
      continue;
    }

    const char = chars[charIndex] ?? '';
    if (token.regex.test(char)) {
      rawOut += char;
      charIndex += 1;
    }
  }

  return rawOut;
}

export function computeCursorPosition(
  display: string,
  cursorAfterRaw: number,
  pattern: string,
  tokenMap?: MaskTokenMap,
): number {
  const tokens = parsePattern(pattern, tokenMap);

  let inputCount = 0;
  let position = 0;

  for (const token of tokens) {
    if (position >= display.length + 1) break;

    if (!token.isInput) {
      position += token.separator.length || 1;
      continue;
    }

    if (inputCount >= cursorAfterRaw) break;

    inputCount += 1;
    position += 1;
  }

  return position;
}

export function maskCompleteValidator(
  pattern: string,
  message = 'Please complete this field.',
  tokens?: MaskTokenMap,
): (value: string) => string | null {
  return (value: string) => {
    const result = applyMask(value, pattern, { tokens });
    return result.complete ? null : message;
  };
}

export interface MaskAutoLayout {
  visualLength: number;
  inputSlots: number;
  compact: boolean;
  webWidthCh: number;
  nativeWidthPx: number;
}

export function getMaskAutoLayout(
  pattern: string,
  tokenMap?: MaskTokenMap,
): MaskAutoLayout {
  const tokens = parsePattern(pattern, tokenMap);
  const visualLength = tokens.length;
  const inputSlots = tokens.filter((token) => token.isInput).length;

  // Masques courts => champ compact par défaut
  // CVV, MM/YY, ZIP, petits codes...
  const compact = visualLength <= 10;

  // Web: largeur en "ch" fonctionne très bien pour les masques
  const webWidthCh = Math.min(
    Math.max(visualLength + (compact ? 5 : 2), compact ? 10 : 12),
    30,
  );

  // Native: estimation simple en px
  const nativeWidthPx = compact
    ? Math.max(128, Math.min(webWidthCh * 12 + 24, 220))
    : Math.max(176, Math.min(webWidthCh * 12 + 24, 320));

  return {
    visualLength,
    inputSlots,
    compact,
    webWidthCh,
    nativeWidthPx,
  };
}

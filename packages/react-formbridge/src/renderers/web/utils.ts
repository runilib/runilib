import type {
  FieldDescriptor,
  FieldRenderProps,
  SelectOption,
  WebFieldPropsOverrides,
} from '../../types';
import type { ExtraFieldProps } from '../../types.web';
import type { ResolvedWebFieldProps } from './shared';

interface Props extends FieldRenderProps<unknown> {
  descriptor: FieldDescriptor<unknown> & {
    fieldPropsFromClient?: ResolvedWebFieldProps;
  };
  extra?: ExtraFieldProps<WebFieldPropsOverrides>;
}

const HTML_PATTERN_CLASS_RESERVED_CHARS = new Set(['(', ')', '[', '{', '}', '/', '|']);

function toHtmlCompatiblePatternSource(source: string): string {
  let result = '';
  let inCharacterClass = false;
  let isEscaped = false;
  let classTokenCount = 0;
  let classAllowsNegation = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index] ?? '';

    if (isEscaped) {
      result += char;
      isEscaped = false;

      if (inCharacterClass) {
        classTokenCount += 1;
        classAllowsNegation = false;
      }

      continue;
    }

    if (char === '\\') {
      result += char;
      isEscaped = true;
      continue;
    }

    if (!inCharacterClass) {
      if (char === '[') {
        inCharacterClass = true;
        classTokenCount = 0;
        classAllowsNegation = true;
      }

      result += char;
      continue;
    }

    if (char === ']') {
      inCharacterClass = false;
      classTokenCount = 0;
      classAllowsNegation = false;
      result += char;
      continue;
    }

    if (classAllowsNegation && char === '^') {
      classAllowsNegation = false;
      result += char;
      continue;
    }

    classAllowsNegation = false;

    const isLiteralHyphen =
      char === '-' && (classTokenCount === 0 || source[index + 1] === ']');
    const needsEscaping = HTML_PATTERN_CLASS_RESERVED_CHARS.has(char) || isLiteralHyphen;

    result += needsEscaping ? `\\${char}` : char;
    classTokenCount += 1;
  }

  return result;
}

export function toHtmlPatternSource(descriptor: Props['descriptor']): string | undefined {
  const patterns = descriptor._patterns?.length
    ? descriptor._patterns
    : descriptor._pattern
      ? [descriptor._pattern]
      : [];

  if (!patterns.length) return undefined;

  if (patterns.some((pattern) => pattern.flags.length > 0)) {
    return undefined;
  }

  if (patterns.length === 1) {
    return patterns[0] ? toHtmlCompatiblePatternSource(patterns[0].source) : undefined;
  }

  return patterns
    .map((pattern) => `(?:${toHtmlCompatiblePatternSource(pattern.source)})`)
    .join('|');
}

export function normalizeOptionValue(value: unknown): string {
  return value == null ? '' : String(value);
}

export function resolveSelectedOption(
  options: SelectOption[] | undefined,
  value: unknown,
): SelectOption | null {
  if (!options?.length) return null;

  return (
    options.find(
      (option) => normalizeOptionValue(option.value) === normalizeOptionValue(value),
    ) ?? null
  );
}

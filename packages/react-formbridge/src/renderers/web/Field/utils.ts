import type {
  FieldDescriptor,
  FieldRenderProps,
  SelectOption,
  WebFieldUiOverrides,
} from '../../../types';
import type { ExtraFieldProps } from '../../../types.web';
import type { ResolvedWebFieldUi } from '../shared';

interface Props extends FieldRenderProps<unknown> {
  descriptor: FieldDescriptor<unknown> & {
    _ui?: ResolvedWebFieldUi;
  };
  extra?: ExtraFieldProps<WebFieldUiOverrides>;
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
    return patterns[0]?.source;
  }

  return patterns.map((pattern) => `(?:${pattern.source})`).join('|');
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

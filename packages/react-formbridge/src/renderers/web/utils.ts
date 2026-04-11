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

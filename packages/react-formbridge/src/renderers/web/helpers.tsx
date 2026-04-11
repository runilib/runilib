import type { CSSProperties, ReactNode } from 'react';

import { defaultErrorTextStyle, defaultRequiredMarkStyle } from './shared';

/**
 * Shared utilities for all web field renderers.
 * Deduplicated from per-renderer copies.
 */

export function cx(
  ...values: Array<string | undefined | false | null>
): string | undefined {
  const result = values.filter(Boolean).join(' ');
  return result || undefined;
}

export function mergeStyles(
  ...styles: Array<CSSProperties | Record<string, unknown> | undefined>
): CSSProperties | undefined {
  const filtered = styles.filter(Boolean);
  if (filtered.length === 0) return undefined;

  const merged = Object.assign({}, ...filtered) as CSSProperties;

  normalizeBorderShorthand(merged, 'border');
  normalizeBorderShorthand(merged, 'borderTop');
  normalizeBorderShorthand(merged, 'borderRight');
  normalizeBorderShorthand(merged, 'borderBottom');
  normalizeBorderShorthand(merged, 'borderLeft');

  return merged;
}

type BorderSideKey =
  | 'border'
  | 'borderTop'
  | 'borderRight'
  | 'borderBottom'
  | 'borderLeft';

type BorderLonghandKey =
  | 'borderWidth'
  | 'borderStyle'
  | 'borderColor'
  | 'borderTopWidth'
  | 'borderTopStyle'
  | 'borderTopColor'
  | 'borderRightWidth'
  | 'borderRightStyle'
  | 'borderRightColor'
  | 'borderBottomWidth'
  | 'borderBottomStyle'
  | 'borderBottomColor'
  | 'borderLeftWidth'
  | 'borderLeftStyle'
  | 'borderLeftColor';

const BORDER_LONGHAND_MAP: Record<
  BorderSideKey,
  {
    width: BorderLonghandKey;
    style: BorderLonghandKey;
    color: BorderLonghandKey;
  }
> = {
  border: {
    width: 'borderWidth',
    style: 'borderStyle',
    color: 'borderColor',
  },
  borderTop: {
    width: 'borderTopWidth',
    style: 'borderTopStyle',
    color: 'borderTopColor',
  },
  borderRight: {
    width: 'borderRightWidth',
    style: 'borderRightStyle',
    color: 'borderRightColor',
  },
  borderBottom: {
    width: 'borderBottomWidth',
    style: 'borderBottomStyle',
    color: 'borderBottomColor',
  },
  borderLeft: {
    width: 'borderLeftWidth',
    style: 'borderLeftStyle',
    color: 'borderLeftColor',
  },
};

function parseBorderShorthand(value: string): {
  width?: string | number;
  style?: string;
  color?: string;
} | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed === 'none') {
    return {
      width: 0,
      style: 'none',
    };
  }

  const match = trimmed.match(/^(\S+)\s+(\S+)\s+(.+)$/);

  if (!match) {
    return null;
  }

  const [, width, style, color] = match;

  return {
    width,
    style,
    color,
  };
}

function normalizeBorderShorthand(style: CSSProperties, key: BorderSideKey): void {
  const shorthand = style[key];

  if (typeof shorthand !== 'string') {
    return;
  }

  const parsed = parseBorderShorthand(shorthand);

  if (!parsed) {
    return;
  }

  const longhands = BORDER_LONGHAND_MAP[key];
  const styleRecord = style as Record<BorderLonghandKey, unknown>;

  if (styleRecord[longhands.width] === undefined && parsed.width !== undefined) {
    styleRecord[longhands.width] = parsed.width;
  }

  if (styleRecord[longhands.style] === undefined && parsed.style !== undefined) {
    styleRecord[longhands.style] = parsed.style;
  }

  if (styleRecord[longhands.color] === undefined && parsed.color !== undefined) {
    styleRecord[longhands.color] = parsed.color;
  }

  delete style[key];
}

export function toInputValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * Build a data-attribute map for the field root element.
 * Allows consumers to target fields with CSS selectors like:
 *   [data-fb-field="text"]
 *   [data-fb-error]
 *   [data-fb-disabled]
 */
export function fieldRootAttrs(ctx: {
  type: string;
  name: string;
  error: boolean;
  touched: boolean;
  dirty: boolean;
  disabled: boolean;
  required: boolean;
}): Record<string, string | undefined> {
  return {
    'data-fb-field': ctx.type,
    'data-fb-name': ctx.name,
    ...(ctx.error ? { 'data-fb-error': '' } : {}),
    ...(ctx.touched ? { 'data-fb-touched': '' } : {}),
    ...(ctx.dirty ? { 'data-fb-dirty': '' } : {}),
    ...(ctx.disabled ? { 'data-fb-disabled': '' } : {}),
    ...(ctx.required ? { 'data-fb-required': '' } : {}),
  };
}

/**
 * Render the label slot.
 * Shared across all web field renderers.
 */
export function renderLabelSlot(ctx: {
  id: string;
  label: ReactNode;
  name: string;
  required: boolean;
  hideLabel?: boolean;
  skipForTypes?: string[];
  fieldType?: string;
  classNames?: Record<string, string | undefined>;
  styles?: Record<string, CSSProperties | undefined>;
  labelProps?: Record<string, unknown>;
  renderLabel?: (ctx: {
    id: string;
    label: ReactNode;
    name: string;
    required: boolean;
  }) => ReactNode;
  renderRequiredMark?: () => ReactNode;
}): ReactNode {
  if (ctx.hideLabel) return null;
  if (ctx.skipForTypes?.includes(ctx.fieldType ?? '')) return null;

  if (ctx.renderLabel) {
    return ctx.renderLabel({
      id: ctx.id,
      label: ctx.label,
      required: ctx.required,
      name: ctx.name,
    });
  }

  const {
    className: labelPropsClassName,
    style: labelPropsStyle,
    ...labelPropsRest
  } = (ctx.labelProps ?? {}) as {
    className?: string;
    style?: CSSProperties;
  } & Record<string, unknown>;

  const requiredMark = ctx.required
    ? (ctx.renderRequiredMark?.() ?? (
        <span
          data-fb-slot="required-mark"
          className={ctx.classNames?.requiredMark}
          style={mergeStyles(
            {
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1,
            },
            defaultRequiredMarkStyle(),
            ctx.styles?.requiredMark,
          )}
        >
          *
        </span>
      ))
    : null;

  return (
    <label
      htmlFor={ctx.id}
      data-fb-slot="label"
      className={cx(ctx.classNames?.label, labelPropsClassName)}
      style={mergeStyles(
        {
          display: 'inline-flex',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: 4,
          lineHeight: 1.2,
        },
        ctx.styles?.label,
        labelPropsStyle,
      )}
      {...labelPropsRest}
    >
      {ctx.label}
      {requiredMark}
    </label>
  );
}

/**
 * Render the error or hint helper slot.
 * Shared across all web field renderers.
 */
export function renderHelperSlot(ctx: {
  error: string | null;
  hint?: string;
  name: string;
  errorId: string;
  hintId: string;
  classNames?: Record<string, string | undefined>;
  styles?: Record<string, CSSProperties | undefined>;
  errorProps?: Record<string, unknown>;
  hintProps?: Record<string, unknown>;
  renderError?: (ctx: { id: string; name: string; error: ReactNode }) => ReactNode;
  renderHint?: (ctx: { id: string; name: string; hint: ReactNode }) => ReactNode;
}): ReactNode {
  if (ctx.error) {
    if (ctx.renderError) {
      return ctx.renderError({ id: ctx.errorId, name: ctx.name, error: ctx.error });
    }

    const {
      className: errorPropsClassName,
      style: errorPropsStyle,
      ...errorPropsRest
    } = (ctx.errorProps ?? {}) as {
      className?: string;
      style?: CSSProperties;
    } & Record<string, unknown>;

    return (
      <span
        id={ctx.errorId}
        role="alert"
        data-fb-slot="error"
        className={cx(ctx.classNames?.error, errorPropsClassName)}
        style={mergeStyles(
          {
            display: 'block',
            lineHeight: 1.45,
          },
          defaultErrorTextStyle(true),
          ctx.styles?.error,
          errorPropsStyle,
        )}
        {...errorPropsRest}
      >
        {ctx.error}
      </span>
    );
  }

  if (ctx.hint) {
    if (ctx.renderHint) {
      return ctx.renderHint({ id: ctx.hintId, name: ctx.name, hint: ctx.hint });
    }

    const {
      className: hintPropsClassName,
      style: hintPropsStyle,
      ...hintPropsRest
    } = (ctx.hintProps ?? {}) as {
      className?: string;
      style?: CSSProperties;
    } & Record<string, unknown>;

    return (
      <span
        id={ctx.hintId}
        data-fb-slot="hint"
        className={cx(ctx.classNames?.hint, hintPropsClassName)}
        style={mergeStyles(
          {
            display: 'block',
            lineHeight: 1.45,
          },
          ctx.styles?.hint,
          hintPropsStyle,
        )}
        {...hintPropsRest}
      >
        {ctx.hint}
      </span>
    );
  }

  return null;
}

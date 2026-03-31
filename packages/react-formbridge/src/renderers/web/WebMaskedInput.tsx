import React, {
  type CSSProperties,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';

import {
  applyMask,
  extractRaw,
  getFirstInputPosition,
  getMaskAutoLayout,
  getMaskPlaceholder,
  parsePattern,
} from '../../core/field-builders/mask/masks';
import type { MaskedDescriptor } from '../../core/field-builders/mask/types';
import type { ExtraFieldProps, FieldRenderProps } from '../../types';
import { defaultBorderColor, shouldHighlightOnError } from './shared';

type MaskedSlot = 'root' | 'label' | 'input' | 'error' | 'hint' | 'requiredMark';

interface MaskedUiOverrides {
  id?: string;
  hideLabel?: boolean;
  highlightOnError?: boolean;
  classNames?: Partial<Record<MaskedSlot, string>>;
  styles?: Partial<Record<MaskedSlot, CSSProperties>>;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'id'
    | 'type'
  >;
  hintProps?: HTMLAttributes<HTMLSpanElement>;
  errorProps?: HTMLAttributes<HTMLSpanElement>;
  renderLabel?: (ctx: {
    id: string;
    label: React.ReactNode;
    required: boolean;
  }) => React.ReactNode;
  renderError?: (ctx: { id: string; error: React.ReactNode }) => React.ReactNode;
  renderHint?: (ctx: { id: string; hint: React.ReactNode }) => React.ReactNode;
  renderRequiredMark?: () => React.ReactNode;
}

interface Props extends FieldRenderProps<string> {
  descriptor: MaskedDescriptor<string> & {
    _ui?: {
      id?: string;
      readOnly?: boolean;
      autoComplete?: string;
      autoFocus?: boolean;
      spellCheck?: boolean;
      rootClassName?: string;
      labelClassName?: string;
      inputClassName?: string;
      rootStyle?: Record<string, unknown>;
      labelStyle?: Record<string, unknown>;
      inputStyle?: Record<string, unknown>;
      highlightOnError?: boolean;
    };
  };
  extra?: ExtraFieldProps;
}

function cx(...values: Array<string | undefined | false | null>) {
  return values.filter(Boolean).join(' ');
}

function mergeStyles(
  ...styles: Array<CSSProperties | Record<string, unknown> | undefined>
): CSSProperties | undefined {
  return Object.assign({}, ...styles.filter(Boolean));
}

function getMaskInputMode(
  pattern: string,
): InputHTMLAttributes<HTMLInputElement>['inputMode'] {
  const hasLetters = parsePattern(pattern).some(
    (token) => token.isInput && String(token.regex) === String(/[a-zA-Z]/),
  );

  return hasLetters ? 'text' : 'numeric';
}

export const WebMaskedInput: React.FC<Props> = ({ descriptor: d, extra, ...props }) => {
  const reactId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCaretRef = useRef<{ start: number; end: number } | null>(null);

  const web = d._ui ?? {};
  const ui = extra?.appearance as MaskedUiOverrides | undefined;
  const { rootProps, labelProps, inputProps, hintProps, errorProps } = ui ?? {};
  const {
    className: rootPropsClassName,
    style: rootPropsStyle,
    ...rootPropsRest
  } = rootProps ?? {};
  const {
    className: labelPropsClassName,
    style: labelPropsStyle,
    ...labelPropsRest
  } = labelProps ?? {};
  const {
    className: inputPropsClassName,
    style: inputPropsStyle,
    ...inputPropsRest
  } = inputProps ?? {};
  const {
    className: hintPropsClassName,
    style: hintPropsStyle,
    ...hintPropsRest
  } = hintProps ?? {};
  const {
    className: errorPropsClassName,
    style: errorPropsStyle,
    ...errorPropsRest
  } = errorProps ?? {};

  const id = ui?.id ?? web.id ?? `${props.name}-${reactId}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = props.error ? errorId : props.hint ? hintId : undefined;
  const hasError = Boolean(props.error);
  const highlightOnError = shouldHighlightOnError(
    ui?.highlightOnError,
    web.highlightOnError,
  );
  const firstEditablePos = useMemo(
    () => getFirstInputPosition(d._maskPattern, d._maskTokens),
    [d._maskPattern, d._maskTokens],
  );

  const maskState = useMemo(() => {
    const incoming = props.value ?? '';
    const raw = d._maskStoreRaw
      ? incoming
      : extractRaw(incoming, d._maskPattern, d._maskTokens);

    const result = applyMask(raw, d._maskPattern, {
      showPlaceholder: d._maskShowPlaceholder,
      placeholder: d._maskPlaceholder,
      tokens: d._maskTokens,
    });

    return {
      ...result,
    };
  }, [
    props.value,
    d._maskPattern,
    d._maskPlaceholder,
    d._maskShowPlaceholder,
    d._maskStoreRaw,
    d._maskTokens,
  ]);

  const displayValue = maskState.display;
  const maxCaretPos = Math.max(maskState.nextCursorPos, firstEditablePos);
  const placeholderText =
    props.placeholder ??
    d._placeholder ??
    (d._maskShowInPlaceholder
      ? getMaskPlaceholder(d._maskPattern, d._maskPlaceholder, d._maskTokens)
      : undefined);

  const resolveMaxCaretPos = useCallback(
    (currentDisplay: string) => {
      const raw = extractRaw(currentDisplay, d._maskPattern, d._maskTokens);
      const nextState = applyMask(raw, d._maskPattern, {
        showPlaceholder: d._maskShowPlaceholder,
        placeholder: d._maskPlaceholder,
        tokens: d._maskTokens,
      });

      return Math.max(nextState.nextCursorPos, firstEditablePos);
    },
    [
      d._maskPattern,
      d._maskPlaceholder,
      d._maskShowPlaceholder,
      d._maskTokens,
      firstEditablePos,
    ],
  );

  const clampCaretRange = useCallback(
    (start: number, end: number, currentDisplay = displayValue) => {
      const currentMaxCaretPos = resolveMaxCaretPos(currentDisplay);

      return {
        start: Math.min(Math.max(start, firstEditablePos), currentMaxCaretPos),
        end: Math.min(Math.max(end, firstEditablePos), currentMaxCaretPos),
      };
    },
    [displayValue, firstEditablePos, resolveMaxCaretPos],
  );

  const syncCaretWithinMask = useCallback(
    (selection?: { start?: number; end?: number }, currentDisplay?: string) => {
      const input = inputRef.current;
      if (!input) return;

      const display = currentDisplay ?? input.value;
      const currentMaxCaretPos = resolveMaxCaretPos(display);
      const next = clampCaretRange(
        selection?.start ?? input.selectionStart ?? currentMaxCaretPos,
        selection?.end ?? input.selectionEnd ?? selection?.start ?? currentMaxCaretPos,
        display,
      );
      const currentStart = input.selectionStart ?? next.start;
      const currentEnd = input.selectionEnd ?? next.end;

      if (currentStart !== next.start || currentEnd !== next.end) {
        input.setSelectionRange(next.start, next.end);
      }
    },
    [clampCaretRange, resolveMaxCaretPos],
  );

  useLayoutEffect(() => {
    const pendingCaret = pendingCaretRef.current;
    if (!pendingCaret) return;

    syncCaretWithinMask(pendingCaret, displayValue);
    pendingCaretRef.current = null;
  }, [displayValue, syncCaretWithinMask]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let incoming = e.target.value;

      if (d._maskUppercase) incoming = incoming.toUpperCase();
      if (d._maskLowercase) incoming = incoming.toLowerCase();

      const cleaned = extractRaw(incoming, d._maskPattern, d._maskTokens);
      const result = applyMask(cleaned, d._maskPattern, {
        showPlaceholder: d._maskShowPlaceholder,
        placeholder: d._maskPlaceholder,
        tokens: d._maskTokens,
      });

      props.onChange(d._maskStoreRaw ? result.raw : result.display);

      const pos = Math.max(result.nextCursorPos, firstEditablePos);
      pendingCaretRef.current = { start: pos, end: pos };
    },
    [
      d._maskLowercase,
      d._maskPattern,
      d._maskPlaceholder,
      d._maskShowPlaceholder,
      d._maskStoreRaw,
      d._maskTokens,
      d._maskUppercase,
      firstEditablePos,
      props.onChange,
    ],
  );

  const handleFocus = useCallback(() => {
    props.onFocus();
    syncCaretWithinMask({ start: maxCaretPos, end: maxCaretPos }, displayValue);
  }, [displayValue, maxCaretPos, props.onFocus, syncCaretWithinMask]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const input = inputRef.current;
      if (!input) return;

      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      const currentMaxCaretPos = resolveMaxCaretPos(input.value);

      if (event.key === 'Home') {
        event.preventDefault();
        input.setSelectionRange(firstEditablePos, firstEditablePos);
        return;
      }

      if (event.key === 'End') {
        event.preventDefault();
        input.setSelectionRange(currentMaxCaretPos, currentMaxCaretPos);
        return;
      }

      if (
        (event.key === 'Backspace' || event.key === 'ArrowLeft') &&
        start <= firstEditablePos &&
        end <= firstEditablePos
      ) {
        event.preventDefault();
        input.setSelectionRange(firstEditablePos, firstEditablePos);
        return;
      }

      if (
        (event.key === 'ArrowRight' || event.key === 'Delete') &&
        start >= currentMaxCaretPos &&
        end >= currentMaxCaretPos
      ) {
        event.preventDefault();
        input.setSelectionRange(currentMaxCaretPos, currentMaxCaretPos);
      }
    },
    [firstEditablePos, resolveMaxCaretPos],
  );

  const requiredMark = ui?.renderRequiredMark?.() ?? (
    <span
      className={ui?.classNames?.requiredMark}
      style={mergeStyles({ color: '#ef4444', marginLeft: 3 }, ui?.styles?.requiredMark)}
    >
      *
    </span>
  );

  const inputClassName = cx(
    web.inputClassName,
    ui?.classNames?.input,
    inputPropsClassName,
  );
  const labelClassName = cx(
    web.labelClassName,
    ui?.classNames?.label,
    labelPropsClassName,
  );
  const rootClassName = cx(
    extra?.className,
    web.rootClassName,
    ui?.classNames?.root,
    rootPropsClassName,
  );

  const autoLayout = useMemo(
    () => getMaskAutoLayout(d._maskPattern, d._maskTokens),
    [d._maskPattern, d._maskTokens],
  );

  return (
    <div
      className={rootClassName}
      style={mergeStyles(
        { display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 },
        extra?.style as CSSProperties | undefined,
        web.rootStyle,
        ui?.styles?.root,
        rootPropsStyle,
      )}
      {...rootPropsRest}
    >
      {!ui?.hideLabel &&
        (ui?.renderLabel ? (
          ui.renderLabel({
            id,
            label: props.label,
            required: Boolean(d._required),
          })
        ) : (
          <label
            htmlFor={id}
            className={labelClassName}
            style={mergeStyles(
              { fontSize: 13, fontWeight: 600, color: '#374151' },
              web.labelStyle,
              ui?.styles?.label,
              labelPropsStyle,
            )}
            {...labelPropsRest}
          >
            {props.label}
            {d._required && requiredMark}
          </label>
        ))}

      <input
        ref={inputRef}
        id={id}
        name={props.name}
        type="text"
        size={autoLayout.compact ? autoLayout.webWidthCh : undefined}
        value={displayValue}
        placeholder={placeholderText}
        disabled={props.disabled}
        readOnly={web.readOnly}
        autoComplete={web.autoComplete ?? 'off'}
        spellCheck={web.spellCheck}
        inputMode={getMaskInputMode(d._maskPattern)}
        aria-invalid={hasError || undefined}
        aria-required={d._required || undefined}
        aria-describedby={describedBy}
        aria-disabled={props.disabled || undefined}
        className={inputClassName}
        onChange={handleChange}
        onBlur={props.onBlur}
        onFocus={handleFocus}
        onClick={() => syncCaretWithinMask()}
        onMouseUp={() => syncCaretWithinMask()}
        onSelect={() => syncCaretWithinMask()}
        onKeyDown={handleKeyDown}
        style={mergeStyles(
          {
            padding: '10px 13px',
            borderRadius: 8,
            border: `1.5px solid ${defaultBorderColor(
              hasError,
              highlightOnError,
              '#e5e7eb',
            )}`,
            fontSize: 14,
            outline: 'none',
            background: props.disabled ? '#f9fafb' : '#fff',
            color: '#111',
            fontFamily: 'monospace',
            letterSpacing: '0.06em',
            transition: 'border-color 0.15s',
            cursor: props.disabled ? 'not-allowed' : 'text',
            boxSizing: 'border-box',
            fontVariantNumeric: 'tabular-nums',
            ...(autoLayout.compact
              ? {
                  width: `min(100%, ${autoLayout.webWidthCh}ch)`,
                  minWidth: `${autoLayout.webWidthCh}ch`,
                  maxWidth: '100%',
                  alignSelf: 'flex-start',
                }
              : {
                  width: '100%',
                }),
          },
          web.inputStyle,
          ui?.styles?.input,
          inputPropsStyle,
        )}
        {...inputPropsRest}
      />

      {props.error
        ? (ui?.renderError?.({ id: errorId, error: props.error }) ?? (
            <span
              id={errorId}
              role="alert"
              className={cx(ui?.classNames?.error, errorPropsClassName)}
              style={mergeStyles(
                { fontSize: 12, color: '#ef4444' },
                ui?.styles?.error,
                errorPropsStyle,
              )}
              {...errorPropsRest}
            >
              {props.error}
            </span>
          ))
        : props.hint
          ? (ui?.renderHint?.({ id: hintId, hint: props.hint }) ?? (
              <span
                id={hintId}
                className={cx(ui?.classNames?.hint, hintPropsClassName)}
                style={mergeStyles(
                  { fontSize: 12, color: '#9ca3af' },
                  ui?.styles?.hint,
                  hintPropsStyle,
                )}
                {...hintPropsRest}
              >
                {props.hint}
              </span>
            ))
          : null}
    </div>
  );
};

import React, {
  type CSSProperties,
  type InputHTMLAttributes,
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
  getMaskCharacterProfile,
  getMaskPlaceholder,
} from '../../core/field-builders/mask/masks';
import type { MaskedDescriptor } from '../../core/field-builders/mask/types';
import type { FocusableFieldHandle } from '../../types';
import type { WebTextFieldUiOverrides } from '../../types/ui-web';
import type { ExtraFieldProps, FieldRenderProps } from '../../types.web';
import { cx, mergeStyles, renderHelperSlot, renderLabelSlot } from './helpers';
import {
  defaultErrorChromeStyle,
  type ResolvedWebFieldUi,
  shouldHighlightOnError,
} from './shared';

const defaultMaskedFieldRootStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 8,
  minWidth: 0,
};

const defaultMaskedInputStyle: CSSProperties = {
  display: 'block',
  boxSizing: 'border-box',
  lineHeight: 1.35,
  fontVariantNumeric: 'tabular-nums',
};

interface Props extends FieldRenderProps<string> {
  descriptor: MaskedDescriptor<string> & {
    _ui?: ResolvedWebFieldUi;
  };
  extra?: ExtraFieldProps<WebTextFieldUiOverrides>;
  registerFocusable?: (target: FocusableFieldHandle | null) => void;
}

function getMaskInputMode(
  pattern: string,
  tokenMap?: MaskedDescriptor<string>['_maskTokens'],
): InputHTMLAttributes<HTMLInputElement>['inputMode'] {
  const { acceptsLetters } = getMaskCharacterProfile(pattern, tokenMap);

  return acceptsLetters ? 'text' : 'numeric';
}

export const MaskedInput: React.FC<Props> = ({
  descriptor: d,
  extra,
  registerFocusable,
  ...props
}) => {
  const reactId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pendingCaretRef = useRef<{ start: number; end: number } | null>(null);

  const web = d._ui ?? {};

  const {
    classNames,
    styles,
    hideLabel,
    rootProps,
    labelProps,
    inputProps,
    hintProps,
    errorProps,
    renderLabel,
    renderHint,
    renderError,
    renderRequiredMark,
  } = extra ?? {};

  const {
    className: rootPropsClassName,
    style: rootPropsStyle,
    ...rootPropsRest
  } = rootProps ?? {};
  const {
    className: inputPropsClassName,
    style: inputPropsStyle,
    ...inputPropsRest
  } = inputProps ?? {};

  const id = extra?.id ?? web.id ?? `${props.name}-${reactId}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = props.error ? errorId : props.hint ? hintId : undefined;
  const hasError = Boolean(props.error);
  const highlightOnError = shouldHighlightOnError(
    extra?.highlightOnError,
    web.highlightOnError,
  );
  const controlErrorStyle = defaultErrorChromeStyle(hasError, highlightOnError);
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

  const inputClassName = cx(classNames?.input, inputPropsClassName);
  const rootClassName = cx(
    extra?.className,
    classNames?.root,
    rootPropsClassName as string,
  );

  const autoLayout = useMemo(
    () => getMaskAutoLayout(d._maskPattern, d._maskTokens),
    [d._maskPattern, d._maskTokens],
  );

  return (
    <div
      data-fb-field="masked"
      data-fb-name={props.name}
      {...(hasError ? { 'data-fb-error': '' } : {})}
      {...(props.disabled ? { 'data-fb-disabled': '' } : {})}
      className={rootClassName}
      style={mergeStyles(
        defaultMaskedFieldRootStyle,
        extra?.style,
        styles?.root,
        rootPropsStyle as CSSProperties,
      )}
      {...rootPropsRest}
    >
      {renderLabelSlot({
        id,
        label: props.label,
        name: props.name,
        required: Boolean(d._required),
        hideLabel,
        classNames: classNames as Record<string, string | undefined>,
        styles: styles as Record<string, CSSProperties | undefined>,
        labelProps: labelProps as Record<string, unknown>,
        renderLabel,
        renderRequiredMark,
      })}

      <input
        ref={(node) => {
          inputRef.current = node;
          registerFocusable?.(node);
        }}
        id={id}
        name={props.name}
        type="text"
        size={autoLayout.webWidthCh}
        maxLength={autoLayout.visualLength}
        value={displayValue}
        placeholder={placeholderText}
        disabled={props.disabled}
        readOnly={web.readOnly}
        autoComplete={web.autoComplete ?? 'off'}
        spellCheck={web.spellCheck}
        inputMode={getMaskInputMode(d._maskPattern, d._maskTokens)}
        aria-invalid={hasError || undefined}
        aria-required={d._required || undefined}
        aria-describedby={describedBy}
        aria-disabled={props.disabled || undefined}
        data-fb-slot="input"
        {...(autoLayout.compact ? { 'data-fb-compact': '' } : {})}
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
            width: `min(100%, ${autoLayout.webWidthCh}ch)`,
            minWidth: 0,
            maxWidth: '100%',
            alignSelf: 'flex-start',
          },
          defaultMaskedInputStyle,
          controlErrorStyle,
          styles?.input,
          inputPropsStyle,
        )}
        {...inputPropsRest}
      />

      {renderHelperSlot({
        error: props.error,
        hint: props.hint,
        name: props.name,
        errorId,
        hintId,
        classNames: classNames as Record<string, string | undefined>,
        styles: styles as Record<string, CSSProperties | undefined>,
        errorProps: errorProps as Record<string, unknown>,
        hintProps: hintProps as Record<string, unknown>,
        renderError,
        renderHint,
      })}
    </div>
  );
};

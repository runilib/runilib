import {
  type CSSProperties,
  type InputHTMLAttributes,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react';

import type {
  ExtraFieldProps,
  FieldDescriptor,
  FieldRenderProps,
  SelectOption,
  SelectPickerRenderContext,
  WebFieldUiOverrides,
} from '../../types';
import { defaultBorderColor, shouldHighlightOnError } from './shared';

type ResolvedWebFieldUi = {
  id?: string;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  enterKeyHint?: InputHTMLAttributes<HTMLInputElement>['enterKeyHint'];
  spellCheck?: boolean;
  rootClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  rootStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
  highlightOnError?: boolean;
};

interface Props extends FieldRenderProps<unknown> {
  descriptor: FieldDescriptor<unknown> & {
    _ui?: ResolvedWebFieldUi;
  };
  extra?: ExtraFieldProps;
}

function cx(...values: Array<string | undefined | false | null>) {
  return values.filter(Boolean).join(' ');
}

function toInputValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

function mergeStyles(
  ...styles: Array<CSSProperties | undefined>
): CSSProperties | undefined {
  return Object.assign({}, ...styles.filter(Boolean));
}

function toHtmlPatternSource(descriptor: Props['descriptor']): string | undefined {
  const patterns = descriptor._patterns?.length
    ? descriptor._patterns
    : descriptor._pattern
      ? [descriptor._pattern]
      : [];

  if (!patterns.length) return undefined;

  // The HTML pattern attribute does not support regex flags, so skip it when they are used.
  if (patterns.some((pattern) => pattern.flags.length > 0)) {
    return undefined;
  }

  if (patterns.length === 1) {
    return patterns[0]?.source;
  }

  return patterns.map((pattern) => `(?:${pattern.source})`).join('|');
}

function normalizeOptionValue(value: unknown): string {
  return value == null ? '' : String(value);
}

function resolveSelectedOption(
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

export const WebField: React.FC<Props> = ({ descriptor, extra, ...restProps }) => {
  const reactId = useId();
  const fieldUi = descriptor._ui ?? {};
  const appearance = extra?.appearance as WebFieldUiOverrides | undefined;
  const { rootProps, labelProps, hintProps, errorProps } = appearance ?? {};
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
    className: hintPropsClassName,
    style: hintPropsStyle,
    ...hintPropsRest
  } = hintProps ?? {};
  const {
    className: errorPropsClassName,
    style: errorPropsStyle,
    ...errorPropsRest
  } = errorProps ?? {};

  const id = appearance?.id ?? fieldUi.id ?? `${restProps.name}-${reactId}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = restProps.error ? errorId : restProps.hint ? hintId : undefined;
  const required = Boolean(descriptor._required);
  const hasError = Boolean(restProps.error);
  const highlightOnError = shouldHighlightOnError(
    appearance?.highlightOnError,
    fieldUi.highlightOnError,
  );

  const rootClassName = cx(
    extra?.className,
    fieldUi.rootClassName,
    appearance?.classNames?.root,
    rootPropsClassName,
  );
  const labelClassName = cx(
    fieldUi.labelClassName,
    appearance?.classNames?.label,
    labelPropsClassName,
  );

  const requiredMark = appearance?.renderRequiredMark?.() ?? (
    <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>
  );

  const labelNode = appearance?.renderLabel ? (
    appearance.renderLabel({
      id,
      label: restProps.label,
      required,
    })
  ) : (
    <label
      htmlFor={id}
      className={labelClassName}
      style={mergeStyles(
        labelStyle,
        fieldUi.labelStyle,
        appearance?.styles?.label,
        labelPropsStyle,
      )}
      {...labelPropsRest}
    >
      {restProps.label}
      {required && requiredMark}
    </label>
  );

  const helperNode = restProps.error
    ? (appearance?.renderError?.({
        id: errorId,
        error: restProps.error,
      }) ?? (
        <span
          id={errorId}
          role="alert"
          className={cx(appearance?.classNames?.error, errorPropsClassName)}
          style={mergeStyles(errorStyle, appearance?.styles?.error, errorPropsStyle)}
          {...errorPropsRest}
        >
          {restProps.error}
        </span>
      ))
    : restProps.hint
      ? (appearance?.renderHint?.({
          id: hintId,
          hint: restProps.hint,
        }) ?? (
          <span
            id={hintId}
            className={cx(appearance?.classNames?.hint, hintPropsClassName)}
            style={mergeStyles(hintStyle, appearance?.styles?.hint, hintPropsStyle)}
            {...hintPropsRest}
          >
            {restProps.hint}
          </span>
        ))
      : null;

  return (
    <div
      className={rootClassName}
      style={mergeStyles(
        {
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        },
        extra?.style as CSSProperties | undefined,
        fieldUi.rootStyle,
        appearance?.styles?.root,
        rootPropsStyle,
      )}
      {...rootPropsRest}
    >
      {!appearance?.hideLabel &&
      descriptor._type !== 'checkbox' &&
      descriptor._type !== 'switch'
        ? labelNode
        : null}

      {renderInput(descriptor, id, restProps, {
        describedBy,
        hasError,
        highlightOnError,
        extra,
      })}

      {helperNode}
    </div>
  );
};

function renderInput(
  d: Props['descriptor'],
  id: string,
  restProps: FieldRenderProps<unknown>,
  ctx: {
    describedBy?: string;
    hasError: boolean;
    highlightOnError: boolean;
    extra?: ExtraFieldProps;
  },
) {
  const ui = ctx.extra?.appearance as WebFieldUiOverrides | undefined;
  const fieldUi = d._ui ?? {};
  const { inputProps, textareaProps, selectProps } = ui ?? {};
  const {
    className: inputPropsClassName,
    style: inputPropsStyle,
    ...inputPropsRest
  } = inputProps ?? {};
  const {
    className: textareaPropsClassName,
    style: textareaPropsStyle,
    ...textareaPropsRest
  } = textareaProps ?? {};
  const {
    className: selectPropsClassName,
    style: selectPropsStyle,
    ...selectPropsRest
  } = selectProps ?? {};

  const commonInputProps = {
    id,
    name: restProps.name,
    disabled: restProps.disabled,
    readOnly: fieldUi.readOnly,
    required: Boolean(d._required),
    autoComplete: fieldUi.autoComplete,
    autoFocus: fieldUi.autoFocus,
    inputMode: fieldUi.inputMode,
    enterKeyHint: fieldUi.enterKeyHint,
    spellCheck: fieldUi.spellCheck,
    'aria-invalid': ctx.hasError || undefined,
    'aria-required': d._required || undefined,
    'aria-describedby': ctx.describedBy,
    'aria-disabled': restProps.disabled || undefined,
    onBlur: restProps.onBlur,
    onFocus: restProps.onFocus,
  };

  const baseInput: CSSProperties = {
    padding: '10px 13px',
    borderRadius: 8,
    border: `1.5px solid ${defaultBorderColor(
      ctx.hasError,
      ctx.highlightOnError,
      '#e5e7eb',
    )}`,
    fontSize: 14,
    outline: 'none',
    background: restProps.disabled ? '#f9fafb' : '#fff',
    color: '#111',
    width: '100%',
    transition: 'border-color 0.15s',
    cursor: restProps.disabled ? 'not-allowed' : 'text',
  };

  const inputClassName = cx(
    fieldUi.inputClassName,
    ui?.classNames?.input,
    inputPropsClassName,
  );
  const renderPicker = ui?.renderPicker ?? fieldUi.renderPicker;

  switch (d._type) {
    case 'textarea':
      return (
        <textarea
          {...commonInputProps}
          value={toInputValue(restProps.value)}
          placeholder={restProps.placeholder}
          rows={4}
          className={cx(ui?.classNames?.textarea, textareaPropsClassName)}
          style={mergeStyles(
            baseInput,
            { resize: 'vertical' },
            fieldUi.inputStyle,
            ui?.styles?.textarea,
            textareaPropsStyle,
          )}
          onChange={(e) => restProps.onChange(e.target.value)}
          {...textareaPropsRest}
        />
      );

    case 'checkbox':
      return (
        <label
          className={ui?.classNames?.checkboxRow}
          style={mergeStyles(
            {
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: restProps.disabled ? 'not-allowed' : 'pointer',
            },
            ui?.styles?.checkboxRow,
          )}
        >
          <input
            {...commonInputProps}
            type="checkbox"
            checked={Boolean(restProps.value)}
            className={ui?.classNames?.checkboxInput}
            style={mergeStyles(
              {
                width: 18,
                height: 18,
                accentColor: '#6366f1',
                cursor: 'inherit',
              },
              ui?.styles?.checkboxInput,
            )}
            onChange={(e) => restProps.onChange(e.target.checked)}
            {...inputPropsRest}
          />
          <span
            className={ui?.classNames?.checkboxLabel}
            style={mergeStyles(
              { fontSize: 14, color: '#374151' },
              ui?.styles?.checkboxLabel,
            )}
          >
            {restProps.label}
          </span>
        </label>
      );

    case 'switch':
      return (
        <div
          className={ui?.classNames?.switchRoot}
          style={mergeStyles(
            {
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: restProps.disabled ? 'not-allowed' : 'pointer',
            },
            ui?.styles?.switchRoot,
          )}
        >
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(restProps.value)}
            aria-disabled={restProps.disabled || undefined}
            onClick={() => !restProps.disabled && restProps.onChange(!restProps.value)}
            onBlur={restProps.onBlur}
            onFocus={restProps.onFocus}
            disabled={restProps.disabled}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              margin: 0,
              cursor: restProps.disabled ? 'not-allowed' : 'pointer',
            }}
          >
            <div
              className={ui?.classNames?.switchTrack}
              style={mergeStyles(
                {
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: restProps.value ? '#6366f1' : '#e5e7eb',
                  position: 'relative',
                  transition: 'background 0.2s',
                  opacity: restProps.disabled ? 0.5 : 1,
                },
                ui?.styles?.switchTrack,
              )}
            >
              <div
                className={ui?.classNames?.switchThumb}
                style={mergeStyles(
                  {
                    position: 'absolute',
                    top: 3,
                    left: restProps.value ? 22 : 3,
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    background: '#fff',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  },
                  ui?.styles?.switchThumb,
                )}
              />
            </div>
          </button>

          <input
            type="hidden"
            name={restProps.name}
            value={String(Boolean(restProps.value))}
          />

          <span style={{ fontSize: 14, color: '#374151' }}>{restProps.label}</span>
        </div>
      );

    case 'select':
      return renderPicker ? (
        <WebPickerSelectField
          descriptor={d}
          id={id}
          fieldProps={restProps}
          web={fieldUi}
          ui={ui}
          baseInput={baseInput}
          inputClassName={inputClassName}
          selectPropsStyle={selectPropsStyle}
          hasError={ctx.hasError}
          highlightOnError={ctx.highlightOnError}
          describedBy={ctx.describedBy}
        />
      ) : (
        <select
          {...commonInputProps}
          value={toInputValue(restProps.value)}
          className={cx(inputClassName, ui?.classNames?.select)}
          style={mergeStyles(
            baseInput,
            fieldUi.inputStyle,
            ui?.styles?.select,
            selectPropsStyle,
          )}
          onChange={(e) => restProps.onChange(e.target.value)}
          {...selectPropsRest}
        >
          <option value="">{restProps.placeholder ?? `Select ${restProps.label}`}</option>
          {d._options?.map((o) => (
            <option
              key={String(o.value)}
              value={String(o.value)}
            >
              {o.label}
            </option>
          ))}
        </select>
      );

    case 'radio':
      return renderPicker ? (
        <WebPickerSelectField
          descriptor={d}
          id={id}
          fieldProps={restProps}
          web={fieldUi}
          ui={ui}
          baseInput={baseInput}
          inputClassName={inputClassName}
          selectPropsStyle={selectPropsStyle}
          hasError={ctx.hasError}
          highlightOnError={ctx.highlightOnError}
          describedBy={ctx.describedBy}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {d._options?.map((o) => (
            <label
              key={String(o.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: restProps.disabled ? 'not-allowed' : 'pointer',
              }}
            >
              <input
                {...commonInputProps}
                type="radio"
                name={restProps.name}
                value={String(o.value)}
                checked={String(restProps.value ?? '') === String(o.value)}
                onChange={() => restProps.onChange(o.value)}
                style={{ accentColor: '#6366f1' }}
                {...inputPropsRest}
              />
              <span style={{ fontSize: 14, color: '#374151' }}>{o.label}</span>
            </label>
          ))}
        </div>
      );

    case 'otp': {
      const len = d._otpLength ?? 6;
      const chars = String(restProps.value ?? '').split('');

      return (
        <div
          className={ui?.classNames?.otpContainer}
          style={mergeStyles({ display: 'flex', gap: 8 }, ui?.styles?.otpContainer)}
        >
          {Array.from({ length: len }, (_, index) => ({
            key: `${id}-otp-${index}`,
            index,
          })).map(({ key, index: i }) => (
            <input
              key={key}
              id={i === 0 ? id : undefined}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={chars[i] ?? ''}
              disabled={restProps.disabled}
              aria-label={`${restProps.label} ${i + 1}`}
              aria-invalid={ctx.hasError || undefined}
              aria-describedby={ctx.describedBy}
              className={ui?.classNames?.otpInput}
              onChange={(e) => {
                const next = [...chars];
                next[i] = e.target.value.slice(-1);
                restProps.onChange(next.join(''));

                const sib = e.target.nextElementSibling as HTMLInputElement | null;
                if (sib && e.target.value) sib.focus();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !chars[i]) {
                  const prev = (e.target as HTMLInputElement)
                    .previousElementSibling as HTMLInputElement | null;
                  if (prev) prev.focus();
                }
              }}
              onBlur={restProps.onBlur}
              onFocus={restProps.onFocus}
              style={mergeStyles(
                baseInput,
                {
                  width: 44,
                  height: 52,
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                },
                ui?.styles?.otpInput,
              )}
            />
          ))}
          <input
            type="hidden"
            name={restProps.name}
            value={String(restProps.value ?? '')}
          />
        </div>
      );
    }

    case 'number':
      return (
        <input
          {...commonInputProps}
          type="number"
          name={restProps.name}
          value={restProps.value === null || restProps.value === undefined ? '' : String(restProps.value)}
          placeholder={restProps.placeholder}
          min={typeof d._min === 'number' ? d._min : undefined}
          max={typeof d._max === 'number' ? d._max : undefined}
          step={(d as Props['descriptor'] & { _step?: number })._step}
          className={inputClassName}
          style={mergeStyles(
            baseInput,
            fieldUi.inputStyle,
            ui?.styles?.input,
            inputPropsStyle,
          )}
          onChange={(e) => {
            const raw = e.target.value;
            restProps.onChange(raw === '' ? '' : Number(raw));
          }}
          {...inputPropsRest}
        />
      );

    case 'date':
      return (
        <input
          {...commonInputProps}
          type="date"
          name={restProps.name}
          value={toInputValue(restProps.value)}
          className={inputClassName}
          style={mergeStyles(
            baseInput,
            fieldUi.inputStyle,
            ui?.styles?.input,
            inputPropsStyle,
          )}
          onChange={(e) => restProps.onChange(e.target.value)}
          {...inputPropsRest}
        />
      );

    default:
      return (
        <div style={{ position: 'relative' }}>
          <input
            {...commonInputProps}
            type={d._type}
            name={restProps.name}
            value={toInputValue(restProps.value)}
            placeholder={restProps.placeholder}
            minLength={typeof d._min === 'number' ? d._min : undefined}
            maxLength={typeof d._max === 'number' ? d._max : undefined}
            pattern={toHtmlPatternSource(d)}
            className={inputClassName}
            style={mergeStyles(
              baseInput,
              fieldUi.inputStyle,
              ui?.styles?.input,
              inputPropsStyle,
            )}
            onChange={(e) => restProps.onChange(e.target.value)}
            {...inputPropsRest}
          />

          {restProps.validating && (
            <span
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 12,
                color: '#9ca3af',
              }}
            >
              ⟳
            </span>
          )}
        </div>
      );
  }
}

const WebPickerSelectField = ({
  descriptor,
  id,
  fieldProps,
  web,
  ui,
  baseInput,
  inputClassName,
  selectPropsStyle,
  hasError,
  highlightOnError,
  describedBy,
}: {
  descriptor: Props['descriptor'];
  id: string;
  fieldProps: FieldRenderProps<unknown>;
  web: ResolvedWebFieldUi;
  ui: WebFieldUiOverrides | undefined;
  baseInput: CSSProperties;
  inputClassName?: string;
  selectPropsStyle?: CSSProperties;
  hasError: boolean;
  highlightOnError: boolean;
  describedBy?: string;
}) => {
  const renderPicker = ui?.renderPicker ?? web.renderPicker;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const allOptions = descriptor._options ?? [];
  const selectedOption = useMemo(
    () => resolveSelectedOption(allOptions, fieldProps.value),
    [allOptions, fieldProps.value],
  );
  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return allOptions;
    }

    return allOptions.filter((option) => option.label.toLowerCase().includes(query));
  }, [allOptions, search]);

  const clearSearch = useCallback(() => {
    setSearch('');
  }, []);

  const closePicker = useCallback(() => {
    setOpen(false);
    clearSearch();
  }, [clearSearch]);

  const openPicker = useCallback(() => {
    if (fieldProps.disabled) return;

    setOpen(true);
    fieldProps.onFocus();
  }, [fieldProps]);

  const selectOption = useCallback(
    (next: SelectOption | SelectOption['value']) => {
      const value =
        typeof next === 'object' && next !== null && 'value' in next ? next.value : next;

      fieldProps.onChange(value);
      closePicker();
      fieldProps.onBlur();
    },
    [closePicker, fieldProps],
  );

  const pickerContext = useMemo<SelectPickerRenderContext>(
    () => ({
      platform: 'web',
      fieldType: descriptor._type === 'radio' ? 'radio' : 'select',
      open,
      label: fieldProps.label,
      placeholder: fieldProps.placeholder,
      required: Boolean(descriptor._required),
      disabled: fieldProps.disabled,
      searchable: Boolean(descriptor._searchable),
      loading: false,
      error: null,
      search,
      options: filteredOptions,
      selectedOption,
      selectedValue:
        fieldProps.value === null ||
        fieldProps.value === undefined ||
        fieldProps.value === ''
          ? null
          : (fieldProps.value as SelectOption['value']),
      triggerLabel:
        selectedOption?.label ??
        fieldProps.placeholder ??
        `Select ${String(fieldProps.label)}`,
      openPicker,
      closePicker,
      setSearch,
      clearSearch,
      selectOption,
    }),
    [
      clearSearch,
      descriptor._required,
      descriptor._searchable,
      descriptor._type,
      fieldProps.disabled,
      fieldProps.label,
      fieldProps.placeholder,
      fieldProps.value,
      filteredOptions,
      open,
      openPicker,
      closePicker,
      search,
      selectOption,
      selectedOption,
    ],
  );

  if (!renderPicker) {
    return null;
  }

  return (
    <>
      <button
        id={id}
        type="button"
        disabled={fieldProps.disabled}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-describedby={describedBy}
        className={cx(inputClassName, ui?.classNames?.select)}
        onClick={openPicker}
        style={mergeStyles(
          baseInput,
          {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'left',
            cursor: fieldProps.disabled ? 'not-allowed' : 'pointer',
          },
          web.inputStyle,
          ui?.styles?.select,
          selectPropsStyle,
        )}
      >
        <span
          style={{
            color: selectedOption ? '#111827' : '#9ca3af',
          }}
        >
          {pickerContext.triggerLabel}
        </span>
        <span
          aria-hidden="true"
          style={{
            marginLeft: 12,
            color: defaultBorderColor(hasError, highlightOnError, '#6b7280'),
            fontSize: 12,
          }}
        >
          ▼
        </span>
      </button>

      <input
        type="hidden"
        name={fieldProps.name}
        value={normalizeOptionValue(fieldProps.value)}
      />

      {renderPicker(pickerContext)}
    </>
  );
};

const labelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#374151',
};

const errorStyle: CSSProperties = {
  fontSize: 12,
  color: '#ef4444',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

const hintStyle: CSSProperties = {
  fontSize: 12,
  color: '#9ca3af',
};

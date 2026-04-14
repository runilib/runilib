import {
  type CSSProperties,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';

import type {
  FieldDescriptor,
  FieldRenderProps,
  FocusableFieldHandle,
  SelectOption,
  SelectPickerRenderContext,
  WebFieldPropsOverrides,
} from '../../types';
import type { ExtraFieldProps } from '../../types.web';
import {
  defaultControlStyle,
  defaultFieldRootStyle,
  defaultOtpContainerStyle,
  defaultOtpInputStyle,
  defaultTextareaStyle,
} from './default-styles';
import {
  cx,
  fieldRootAttrs,
  mergeStyles,
  renderHelperSlot,
  renderLabelSlot,
  toInputValue,
} from './helpers';
import {
  defaultErrorChromeStyle,
  type ResolvedWebFieldProps,
  resolveWebInputBehavior,
  shouldHighlightOnError,
} from './shared';
import {
  normalizeOptionValue,
  resolveSelectedOption,
  toHtmlPatternSource,
} from './utils';

interface Props extends FieldRenderProps<unknown> {
  descriptor: FieldDescriptor<unknown> & {
    fieldPropsFromClient: ResolvedWebFieldProps;
  };
  extra?: ExtraFieldProps<WebFieldPropsOverrides>;
  registerFocusable?: (target: FocusableFieldHandle | null) => void;
}

export const Field: React.FC<Props> = ({
  descriptor,
  extra,
  registerFocusable,
  ...restProps
}) => {
  const reactId = useId();
  const fieldProps = descriptor.fieldPropsFromClient ?? {};
  const {
    wrapperProps,
    labelProps,
    hintProps,
    errorProps,
    classNames,
    styles,
    hideLabel,
    renderLabel,
    renderHint,
    renderError,
    renderRequiredMark,
  } = extra ?? {};

  const {
    className: wrapperPropsClassName,
    style: wrapperPropsStyle,
    ...wrapperPropsRest
  } = wrapperProps ?? {};

  const id = extra?.id ?? fieldProps.id ?? `${restProps.name}-${reactId}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = restProps.error ? errorId : restProps.hint ? hintId : undefined;
  const required = Boolean(descriptor._required);
  const hasError = Boolean(restProps.error);
  const highlightOnError = shouldHighlightOnError(
    extra?.highlightOnError,
    fieldProps.highlightOnError,
  );

  const wrapperClassName = cx(
    extra?.className,
    classNames?.wrapper,
    wrapperPropsClassName,
  );

  const EXCLUDED_INPUT_TYPE = ['checkbox', 'switch'];

  return (
    <div
      {...fieldRootAttrs({
        type: descriptor._type,
        name: restProps.name,
        error: hasError,
        touched: restProps.touched,
        dirty: restProps.dirty,
        disabled: restProps.disabled,
        required,
      })}
      className={wrapperClassName}
      style={mergeStyles(
        defaultFieldRootStyle,
        extra?.style,
        styles?.wrapper,
        wrapperPropsStyle,
      )}
      {...wrapperPropsRest}
    >
      {EXCLUDED_INPUT_TYPE.includes(descriptor._type) === false
        ? renderLabelSlot({
            id,
            label: restProps.label,
            name: restProps.name,
            required,
            hideLabel,
            classNames: classNames as Record<string, string | undefined>,
            styles: styles as Record<string, CSSProperties | undefined>,
            labelProps: labelProps as Record<string, unknown>,
            renderLabel,
            renderRequiredMark,
          })
        : null}

      {renderInput(descriptor, id, restProps, {
        describedBy,
        hasError,
        highlightOnError,
        extra,
        registerFocusable,
      })}

      {renderHelperSlot({
        error: restProps.error,
        hint: restProps.hint,
        errorId,
        name: restProps.name,
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

const renderInput = (
  descriptor: Props['descriptor'],
  id: string,
  restProps: FieldRenderProps<unknown>,
  ctx: {
    describedBy?: string;
    hasError: boolean;
    highlightOnError: boolean;
    extra?: ExtraFieldProps<WebFieldPropsOverrides>;
    registerFocusable?: (target: FocusableFieldHandle | null) => void;
  },
) => {
  const { inputProps, textareaProps, selectProps, classNames, styles } = ctx.extra ?? {};
  const fieldProps = descriptor.fieldPropsFromClient ?? {};
  const inputBehavior = resolveWebInputBehavior(ctx.extra, fieldProps);
  const isReadOnly = Boolean(inputBehavior.readOnly);

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
    readOnly: inputBehavior.readOnly,
    required: Boolean(descriptor._required),
    autoComplete: inputBehavior.autoComplete,
    autoFocus: inputBehavior.autoFocus,
    inputMode: inputBehavior.inputMode,
    enterKeyHint: inputBehavior.enterKeyHint,
    spellCheck: inputBehavior.spellCheck,
    'aria-invalid': ctx.hasError || undefined,
    'aria-required': descriptor._required || undefined,
    'aria-readonly': isReadOnly || undefined,
    'aria-describedby': ctx.describedBy,
    'aria-disabled': restProps.disabled || undefined,
    onBlur: restProps.onBlur,
    onFocus: restProps.onFocus,
  };

  const inputClassName = cx(classNames?.input, inputPropsClassName);
  const renderPicker = ctx.extra?.renderPicker ?? fieldProps.renderPicker;
  const controlErrorStyle = defaultErrorChromeStyle(ctx.hasError, ctx.highlightOnError);

  switch (descriptor._type) {
    case 'textarea':
      return (
        <textarea
          {...commonInputProps}
          data-fb-slot="textarea"
          value={toInputValue(restProps.value)}
          placeholder={restProps.placeholder}
          rows={4}
          ref={ctx.registerFocusable}
          className={cx(classNames?.textarea, textareaPropsClassName)}
          style={mergeStyles(
            defaultTextareaStyle,
            controlErrorStyle,
            styles?.textarea,
            textareaPropsStyle,
          )}
          onChange={(e) => restProps.onChange(e.target.value)}
          {...textareaPropsRest}
        />
      );

    case 'checkbox':
      return (
        <label
          data-fb-slot="checkbox-row"
          className={classNames?.checkboxRow}
          style={mergeStyles(styles?.checkboxRow)}
        >
          <input
            {...commonInputProps}
            data-fb-slot="checkbox-input"
            type="checkbox"
            checked={Boolean(restProps.value)}
            className={cx(classNames?.checkboxInput, inputPropsClassName)}
            style={mergeStyles(controlErrorStyle, styles?.checkboxInput, inputPropsStyle)}
            onChange={(e) => {
              if (restProps.disabled || isReadOnly) {
                return;
              }

              restProps.onChange(e.target.checked);
            }}
            {...inputPropsRest}
          />
          <span
            data-fb-slot="checkbox-label"
            className={classNames?.checkboxLabel}
            style={mergeStyles(styles?.checkboxLabel)}
          >
            {restProps.label}
          </span>
        </label>
      );

    case 'switch':
      return (
        <div
          data-fb-slot="switch-wrapper"
          className={classNames?.switchRoot}
          style={mergeStyles(
            {
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              minWidth: 0,
            },
            styles?.switchRoot,
          )}
        >
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(restProps.value)}
            aria-disabled={restProps.disabled || undefined}
            aria-readonly={isReadOnly || undefined}
            onClick={() => {
              if (restProps.disabled || isReadOnly) {
                return;
              }

              restProps.onChange(!restProps.value);
            }}
            onBlur={restProps.onBlur}
            onFocus={restProps.onFocus}
            disabled={restProps.disabled}
            data-fb-slot="switch-button"
            className={classNames?.switchButton}
            style={{
              ...mergeStyles(
                {
                  appearance: 'none',
                  border: 0,
                  background: 'transparent',
                  padding: 0,
                  margin: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: restProps.disabled ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                },
                styles?.switchButton,
              ),
            }}
          >
            <div
              data-fb-slot="switch-track"
              data-fb-checked={restProps.value ? '' : undefined}
              className={classNames?.switchTrack}
              style={mergeStyles(
                {
                  position: 'relative',
                  width: 44,
                  height: 24,
                  borderRadius: 999,
                  background: restProps.value ? '#22c55e' : 'rgba(148, 163, 184, 0.4)',
                  transition: 'background-color 160ms ease',
                  opacity: restProps.disabled ? 0.6 : 1,
                },
                styles?.switchTrack,
                controlErrorStyle,
              )}
            >
              <div
                data-fb-slot="switch-thumb"
                className={classNames?.switchThumb}
                style={mergeStyles(
                  {
                    position: 'absolute',
                    top: 2,
                    left: restProps.value ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#ffffff',
                    boxShadow: '0 1px 4px rgba(15, 23, 42, 0.28)',
                    transition: 'left 160ms ease',
                  },
                  styles?.switchThumb,
                )}
              />
            </div>
          </button>

          <input
            type="hidden"
            id={id}
            name={restProps.name}
            value={String(Boolean(restProps.value))}
            readOnly={isReadOnly}
            {...inputPropsRest}
          />
          <span
            data-fb-slot="switch-label"
            className={classNames?.switchLabel}
            style={mergeStyles(
              {
                color: 'inherit',
                fontSize: 14,
                lineHeight: 1.4,
              },
              styles?.switchLabel,
            )}
          >
            {restProps.label}
          </span>
        </div>
      );

    case 'select': {
      if (renderPicker) {
        return (
          <PickerSelectField
            descriptor={descriptor}
            id={id}
            fieldProps={restProps}
            web={fieldProps}
            extra={ctx.extra}
            describedBy={ctx.describedBy}
            readOnly={isReadOnly}
            registerFocusable={ctx.registerFocusable}
          />
        );
      }

      const selectedOption = resolveSelectedOption(descriptor._options, restProps.value);
      const hasSelectedValue = Boolean(selectedOption);
      const selectValue = hasSelectedValue
        ? normalizeOptionValue(selectedOption?.value)
        : '';
      const placeholderLabel = restProps.placeholder ?? `Select ${restProps.label}`;

      return (
        <select
          {...commonInputProps}
          data-fb-slot="select"
          ref={ctx.registerFocusable}
          value={selectValue}
          className={cx(inputClassName, classNames?.select)}
          style={mergeStyles(
            defaultControlStyle,
            controlErrorStyle,
            styles?.select,
            selectPropsStyle,
          )}
          onChange={(e) => {
            if (isReadOnly) {
              return;
            }

            const matchedOption = resolveSelectedOption(
              descriptor._options,
              e.target.value,
            );
            restProps.onChange(matchedOption?.value ?? e.target.value);
          }}
          {...selectPropsRest}
        >
          {hasSelectedValue === false ? (
            <option value="">{placeholderLabel}</option>
          ) : null}
          {descriptor._options?.map((o) => (
            <option
              key={String(o.value)}
              value={String(o.value)}
            >
              {o.label}
            </option>
          ))}
        </select>
      );
    }

    case 'radio':
      return renderPicker ? (
        <PickerSelectField
          descriptor={descriptor}
          id={id}
          fieldProps={restProps}
          web={fieldProps}
          extra={ctx.extra}
          describedBy={ctx.describedBy}
          readOnly={isReadOnly}
        />
      ) : (
        <div
          data-fb-slot="radio-group"
          className={classNames?.radioGroup ?? classNames?.checkboxRow}
          style={mergeStyles(styles?.radioGroup, styles?.checkboxRow)}
        >
          {descriptor._options?.map((o) => (
            <label
              key={String(o.value)}
              data-fb-slot="radio-option"
              className={classNames?.radioOption ?? classNames?.checkboxRow}
              style={mergeStyles(styles?.radioOption, styles?.checkboxRow)}
            >
              <input
                {...commonInputProps}
                data-fb-slot="radio-input"
                type="radio"
                name={restProps.name}
                value={String(o.value)}
                checked={String(restProps.value ?? '') === String(o.value)}
                className={cx(
                  classNames?.radioInput ?? classNames?.checkboxInput,
                  inputPropsClassName,
                )}
                style={mergeStyles(
                  controlErrorStyle,
                  styles?.radioInput ?? styles?.checkboxInput,
                  inputPropsStyle,
                )}
                onChange={() => {
                  if (restProps.disabled || isReadOnly) {
                    return;
                  }

                  restProps.onChange(o.value);
                }}
                {...inputPropsRest}
              />
              <span
                data-fb-slot="radio-label"
                className={classNames?.radioLabel ?? classNames?.checkboxLabel}
                style={mergeStyles(styles?.radioLabel, styles?.checkboxLabel)}
              >
                {o.label}
              </span>
            </label>
          ))}
        </div>
      );

    case 'otp': {
      const len = descriptor._otpLength ?? 6;
      const chars = String(restProps.value ?? '').split('');

      return (
        <div
          data-fb-slot="otp-container"
          className={classNames?.otpContainer}
          style={mergeStyles(defaultOtpContainerStyle, styles?.otpContainer)}
        >
          {Array.from({ length: len }, (_, index) => ({
            key: `${id}-otp-${index}`,
            index,
          })).map(({ key, index: i }) => (
            <input
              key={key}
              id={i === 0 ? id : undefined}
              ref={i === 0 ? ctx.registerFocusable : undefined}
              type="text"
              autoComplete={inputBehavior.autoComplete}
              // biome-ignore lint/a11y/noAutofocus: form builders expose autofocus intentionally.
              autoFocus={i === 0 ? inputBehavior.autoFocus : undefined}
              spellCheck={inputBehavior.spellCheck}
              inputMode={inputBehavior.inputMode ?? 'numeric'}
              enterKeyHint={inputBehavior.enterKeyHint}
              maxLength={1}
              value={chars[i] ?? ''}
              disabled={restProps.disabled}
              readOnly={isReadOnly}
              aria-label={`${restProps.label} ${i + 1}`}
              aria-invalid={ctx.hasError || undefined}
              aria-describedby={ctx.describedBy}
              aria-readonly={isReadOnly || undefined}
              data-fb-slot="otp-input"
              className={cx(classNames?.otpInput, inputPropsClassName)}
              onChange={(e) => {
                if (isReadOnly) {
                  return;
                }

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
                defaultOtpInputStyle,
                controlErrorStyle,
                styles?.otpInput,
                inputPropsStyle,
              )}
              {...inputPropsRest}
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
          data-fb-slot="input"
          type="number"
          ref={ctx.registerFocusable}
          name={restProps.name}
          value={
            restProps.value === null || restProps.value === undefined
              ? ''
              : String(restProps.value)
          }
          placeholder={restProps.placeholder}
          min={typeof descriptor._min === 'number' ? descriptor._min : undefined}
          max={typeof descriptor._max === 'number' ? descriptor._max : undefined}
          step={(descriptor as Props['descriptor'] & { _step?: number })._step}
          className={inputClassName}
          style={mergeStyles(
            defaultControlStyle,
            controlErrorStyle,
            styles?.input,
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
          data-fb-slot="input"
          type="date"
          ref={ctx.registerFocusable}
          name={restProps.name}
          value={toInputValue(restProps.value)}
          className={inputClassName}
          style={mergeStyles(
            defaultControlStyle,
            controlErrorStyle,
            styles?.input,
            inputPropsStyle,
          )}
          onChange={(e) => restProps.onChange(e.target.value)}
          {...inputPropsRest}
        />
      );

    default:
      return (
        <input
          {...commonInputProps}
          data-fb-slot="input"
          type={descriptor._type}
          ref={ctx.registerFocusable}
          name={restProps.name}
          value={toInputValue(restProps.value)}
          placeholder={restProps.placeholder}
          minLength={typeof descriptor._min === 'number' ? descriptor._min : undefined}
          maxLength={typeof descriptor._max === 'number' ? descriptor._max : undefined}
          pattern={toHtmlPatternSource(descriptor)}
          className={inputClassName}
          style={mergeStyles(
            defaultControlStyle,
            controlErrorStyle,
            styles?.input,
            inputPropsStyle,
          )}
          onChange={(e) => restProps.onChange(e.target.value)}
          {...inputPropsRest}
        />
      );
  }
};

type PickerSelectFieldType = {
  descriptor: Props['descriptor'];
  id: string;
  fieldProps: FieldRenderProps<unknown>;
  web: ResolvedWebFieldProps;
  extra: ExtraFieldProps<WebFieldPropsOverrides> | undefined;
  describedBy?: string;
  readOnly?: boolean;
  registerFocusable?: (target: FocusableFieldHandle | null) => void;
};

const PickerSelectField = ({
  descriptor,
  id,
  fieldProps,
  web,
  extra,
  describedBy,
  readOnly = false,
  registerFocusable,
}: PickerSelectFieldType) => {
  const renderPicker = extra?.renderPicker ?? web.renderPicker;
  const { classNames, styles, selectProps } = extra ?? {};
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const {
    className: selectPropsClassName,
    style: selectPropsStyle,
    ...selectPropsRest
  } = selectProps ?? {};
  const selectTriggerProps = selectPropsRest as Record<string, unknown>;
  const highlightOnError = shouldHighlightOnError(
    extra?.highlightOnError,
    web.highlightOnError,
  );
  const controlErrorStyle = defaultErrorChromeStyle(
    Boolean(fieldProps.error),
    highlightOnError,
  );

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
    if (fieldProps.disabled || readOnly) return;

    setOpen(true);
    fieldProps.onFocus();
  }, [fieldProps, readOnly]);

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

  useEffect(() => {
    if (!registerFocusable) {
      return;
    }

    registerFocusable({
      focus: openPicker,
      blur: closePicker,
    });

    return () => {
      registerFocusable(null);
    };
  }, [closePicker, openPicker, registerFocusable]);

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
        data-fb-slot="select-trigger"
        data-fb-selected={selectedOption ? '' : undefined}
        onClick={openPicker}
        className={cx(classNames?.input, classNames?.select, selectPropsClassName)}
        style={mergeStyles(controlErrorStyle, styles?.select, selectPropsStyle)}
        {...selectTriggerProps}
      >
        <span
          data-fb-slot="select-value"
          className={classNames?.selectValue}
          style={mergeStyles(styles?.selectValue)}
        >
          {pickerContext.triggerLabel}
        </span>
        <span
          aria-hidden="true"
          data-fb-slot="select-arrow"
          className={classNames?.selectArrow}
          style={mergeStyles(styles?.selectArrow)}
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

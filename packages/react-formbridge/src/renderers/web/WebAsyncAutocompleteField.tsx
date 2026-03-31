import React, {
  type CSSProperties,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAsyncOptions } from '../../hooks/shared/useAsyncOptions';
import type {
  ExtraFieldProps,
  FieldDescriptor,
  FieldRenderProps,
  SelectOption,
  SelectPickerRenderContext,
} from '../../types';
import { defaultBorderColor, shouldHighlightOnError } from './shared';

type AsyncAutocompleteSlot =
  | 'root'
  | 'label'
  | 'input'
  | 'select'
  | 'listbox'
  | 'option'
  | 'optionActive'
  | 'optionSelected'
  | 'empty'
  | 'loading'
  | 'error'
  | 'hint'
  | 'requiredMark';

interface AsyncAutocompleteUiOverrides {
  id?: string;
  hideLabel?: boolean;
  highlightOnError?: boolean;
  classNames?: Partial<Record<AsyncAutocompleteSlot, string>>;
  styles?: Partial<Record<AsyncAutocompleteSlot, CSSProperties>>;
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
    | 'role'
    | 'aria-autocomplete'
    | 'aria-controls'
    | 'aria-expanded'
    | 'aria-activedescendant'
  >;
  hintProps?: HTMLAttributes<HTMLSpanElement>;
  errorProps?: HTMLAttributes<HTMLSpanElement>;
  renderLabel?: (ctx: {
    id: string;
    label: React.ReactNode;
    required: boolean;
  }) => React.ReactNode;
  renderRequiredMark?: () => React.ReactNode;
  renderOption?: (
    option: SelectOption,
    state: { active: boolean; selected: boolean },
  ) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

interface Props extends FieldRenderProps<string> {
  descriptor: FieldDescriptor<string> & {
    _asyncOptions: NonNullable<FieldDescriptor<string>['_asyncOptions']>;
    _searchable?: boolean;
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
      renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
    };
  };
  extra?: ExtraFieldProps & {
    appearance?: AsyncAutocompleteUiOverrides;
  };
}

function cx(...values: Array<string | undefined | false | null>) {
  return values.filter(Boolean).join(' ');
}

function mergeStyles(
  ...styles: Array<CSSProperties | Record<string, unknown> | undefined>
): CSSProperties | undefined {
  return Object.assign({}, ...styles.filter(Boolean));
}

function normalize(value: unknown): string {
  return value == null ? '' : String(value);
}

export const WebAsyncAutocompleteField: React.FC<Props> = ({
  descriptor,
  extra,
  ...props
}) => {
  const reactId = useId();
  const ui = extra?.appearance;
  const fieldUi = descriptor._ui ?? {};
  const renderPicker = ui?.renderPicker ?? fieldUi.renderPicker;
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

  const id = ui?.id ?? fieldUi.id ?? `${props.name}-${reactId}`;
  const listboxId = `${id}-listbox`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const highlightOnError = shouldHighlightOnError(
    ui?.highlightOnError,
    fieldUi.highlightOnError,
  );

  const rootRef = useRef<HTMLDivElement>(null);

  const depValues = useMemo(() => {
    const result: Record<string, unknown> = {};
    for (const key of descriptor._asyncOptions.dependsOn ?? []) {
      result[key] = props.allValues[key];
    }
    return result;
  }, [descriptor._asyncOptions.dependsOn, props.allValues]);

  const { options, loading, error, setSearch, clearSearch } = useAsyncOptions(
    descriptor._asyncOptions,
    depValues,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [inputValue, setInputValue] = useState('');

  const currentValue = normalize(props.value);

  const selectedOptionFromOptions = useMemo(
    () => options.find((option) => normalize(option.value) === currentValue) ?? null,
    [options, currentValue],
  );

  useEffect(() => {
    if (selectedOptionFromOptions) {
      setSelectedLabel(selectedOptionFromOptions.label);
    } else if (!currentValue) {
      setSelectedLabel('');
    }
  }, [selectedOptionFromOptions, currentValue]);

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
      if (currentValue) {
        setInputValue(selectedLabel);
      } else {
        setInputValue('');
      }
    }
  }, [currentValue, isOpen, selectedLabel]);

  useEffect(() => {
    if (renderPicker) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!rootRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [renderPicker]);

  const displayedInputValue = isOpen ? inputValue : selectedLabel;

  const describedBy = props.error ? errorId : props.hint ? hintId : undefined;
  const activeOptionId =
    highlightedIndex >= 0 ? `${id}-option-${highlightedIndex}` : undefined;

  const commitSelection = useCallback(
    (option: SelectOption) => {
      setSelectedLabel(option.label);
      setInputValue(option.label);
      props.onChange(normalize(option.value));
      clearSearch();
      setIsOpen(false);
      setHighlightedIndex(-1);
      props.onBlur();
    },
    [clearSearch, props.onChange, props.onBlur],
  );

  const closePicker = useCallback(() => {
    clearSearch();
    setInputValue(selectedLabel);
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [clearSearch, selectedLabel]);

  const handleFocus = useCallback(() => {
    setIsOpen(true);
    setInputValue(selectedLabel);
    props.onFocus();
  }, [props.onFocus, selectedLabel]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value;
      setIsOpen(true);
      setInputValue(next);
      setSearch(next);
      setHighlightedIndex(0);

      if (!next) {
        setSelectedLabel('');
        props.onChange('');
      }
    },
    [props.onChange, setSearch],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
        setIsOpen(true);
        return;
      }

      if (!options.length) {
        if (event.key === 'Escape') {
          closePicker();
        }
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHighlightedIndex((prev) => {
          const next = prev < options.length - 1 ? prev + 1 : 0;
          return next;
        });
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHighlightedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : options.length - 1;
          return next;
        });
        return;
      }

      if (event.key === 'Enter') {
        if (isOpen && highlightedIndex >= 0 && options[highlightedIndex]) {
          event.preventDefault();
          commitSelection(options[highlightedIndex]);
        }
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        closePicker();
      }
    },
    [closePicker, commitSelection, highlightedIndex, isOpen, options],
  );

  const pickerContext = useMemo<SelectPickerRenderContext>(
    () => ({
      platform: 'web',
      fieldType: 'select',
      open: isOpen,
      label: props.label,
      placeholder: props.placeholder,
      required: Boolean(descriptor._required),
      disabled: props.disabled,
      searchable: true,
      loading,
      error: error ?? props.error ?? null,
      search: inputValue,
      options,
      selectedOption: selectedOptionFromOptions,
      selectedValue:
        props.value === '' || props.value == null
          ? null
          : (props.value as SelectOption['value']),
      triggerLabel:
        selectedOptionFromOptions?.label ??
        props.placeholder ??
        `Search ${String(props.label)}`,
      openPicker: handleFocus,
      closePicker,
      setSearch: (next) => {
        setIsOpen(true);
        setInputValue(next);
        setSearch(next);
      },
      clearSearch: () => {
        clearSearch();
        setInputValue('');
      },
      selectOption: (next) => {
        const option =
          typeof next === 'object' && next !== null && 'value' in next
            ? next
            : options.find((item) => normalize(item.value) === normalize(next));

        if (option) {
          commitSelection(option);
          return;
        }

        props.onChange(normalize(next));
        closePicker();
        props.onBlur();
      },
    }),
    [
      closePicker,
      commitSelection,
      descriptor._required,
      error,
      handleFocus,
      inputValue,
      loading,
      options,
      props.disabled,
      props.error,
      props.label,
      props.onBlur,
      props.onChange,
      props.placeholder,
      props.value,
      selectedOptionFromOptions,
      setSearch,
      clearSearch,
      isOpen,
    ],
  );

  const requiredMark = ui?.renderRequiredMark?.() ?? (
    <span
      className={ui?.classNames?.requiredMark}
      style={mergeStyles({ color: '#ef4444', marginLeft: 3 }, ui?.styles?.requiredMark)}
    >
      *
    </span>
  );

  const rootClassName = cx(
    extra?.className,
    fieldUi.rootClassName,
    ui?.classNames?.root,
    rootPropsClassName,
  );
  const labelClassName = cx(
    fieldUi.labelClassName,
    ui?.classNames?.label,
    labelPropsClassName,
  );
  const inputClassName = cx(
    fieldUi.inputClassName,
    ui?.classNames?.input,
    inputPropsClassName,
  );

  return (
    <div
      ref={rootRef}
      className={rootClassName}
      style={mergeStyles(
        { display: 'flex', flexDirection: 'column', gap: 5, position: 'relative' },
        extra?.style as CSSProperties | undefined,
        fieldUi.rootStyle,
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
            required: Boolean(descriptor._required),
          })
        ) : (
          <label
            htmlFor={id}
            className={labelClassName}
            style={mergeStyles(
              { fontSize: 13, fontWeight: 600, color: '#374151' },
              fieldUi.labelStyle,
              ui?.styles?.label,
              labelPropsStyle,
            )}
            {...labelPropsRest}
          >
            {props.label}
            {descriptor._required && requiredMark}
          </label>
        ))}

      {renderPicker ? (
        <>
          <button
            id={id}
            type="button"
            disabled={props.disabled}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            // aria-invalid={Boolean(props.error) || undefined}
            aria-describedby={describedBy}
            className={cx(inputClassName, ui?.classNames?.select)}
            onClick={handleFocus}
            style={mergeStyles(
              {
                padding: '10px 13px',
                borderRadius: 8,
                border: `1.5px solid ${defaultBorderColor(
                  Boolean(props.error),
                  highlightOnError,
                  '#e5e7eb',
                )}`,
                fontSize: 14,
                outline: 'none',
                background: props.disabled ? '#f9fafb' : '#fff',
                color: '#111',
                width: '100%',
                transition: 'border-color 0.15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left',
                cursor: props.disabled ? 'not-allowed' : 'pointer',
              },
              fieldUi.inputStyle,
              ui?.styles?.input,
              inputPropsStyle,
            )}
          >
            <span style={{ color: selectedOptionFromOptions ? '#111827' : '#9ca3af' }}>
              {pickerContext.triggerLabel}
            </span>
            <span
              aria-hidden="true"
              style={{ marginLeft: 12, color: '#6b7280', fontSize: 12 }}
            >
              ▼
            </span>
          </button>

          <input
            type="hidden"
            name={props.name}
            value={currentValue}
          />

          {renderPicker(pickerContext)}
        </>
      ) : (
        <>
          <input
            id={id}
            name={props.name}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
            aria-invalid={Boolean(props.error) || undefined}
            aria-required={descriptor._required || undefined}
            aria-describedby={describedBy}
            disabled={props.disabled}
            readOnly={fieldUi.readOnly}
            autoComplete={fieldUi.autoComplete ?? 'off'}
            spellCheck={fieldUi.spellCheck}
            value={displayedInputValue}
            placeholder={props.placeholder ?? `Search ${props.label}`}
            onFocus={handleFocus}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              // closing managed by click outside / selection
            }}
            className={inputClassName}
            style={mergeStyles(
              {
                padding: '10px 13px',
                borderRadius: 8,
                border: `1.5px solid ${defaultBorderColor(
                  Boolean(props.error),
                  highlightOnError,
                  '#e5e7eb',
                )}`,
                fontSize: 14,
                outline: 'none',
                background: props.disabled ? '#f9fafb' : '#fff',
                color: '#111',
                width: '100%',
                transition: 'border-color 0.15s',
              },
              fieldUi.inputStyle,
              ui?.styles?.input,
              inputPropsStyle,
            )}
            {...inputPropsRest}
          />

          {isOpen && !props.disabled && (
            <div
              id={listboxId}
              role="listbox"
              className={ui?.classNames?.listbox}
              style={mergeStyles(
                {
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 50,
                  marginTop: 6,
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                  maxHeight: 240,
                  overflowY: 'auto',
                },
                ui?.styles?.listbox,
              )}
            >
              {loading ? (
                <div
                  className={ui?.classNames?.loading}
                  style={mergeStyles(
                    { padding: 12, fontSize: 13, color: '#6b7280' },
                    ui?.styles?.loading,
                  )}
                >
                  {ui?.renderLoading?.() ?? 'Loading...'}
                </div>
              ) : options.length === 0 ? (
                <div
                  className={ui?.classNames?.empty}
                  style={mergeStyles(
                    { padding: 12, fontSize: 13, color: '#6b7280' },
                    ui?.styles?.empty,
                  )}
                >
                  {ui?.renderEmpty?.() ?? 'No results'}
                </div>
              ) : (
                options.map((option, index) => {
                  const selected = normalize(option.value) === currentValue;
                  const active = highlightedIndex === index;

                  return (
                    <button
                      key={String(option.value)}
                      type="button"
                      id={`${id}-option-${index}`}
                      role="option"
                      tabIndex={-1}
                      aria-selected={selected}
                      className={cx(
                        ui?.classNames?.option,
                        active && ui?.classNames?.optionActive,
                        selected && ui?.classNames?.optionSelected,
                      )}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        commitSelection(option);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      style={mergeStyles(
                        {
                          padding: '10px 12px',
                          cursor: 'pointer',
                          fontSize: 14,
                          width: '100%',
                          border: 'none',
                          textAlign: 'left',
                          background: active ? '#f8fafc' : selected ? '#eef2ff' : '#fff',
                          color: '#111',
                        },
                        ui?.styles?.option,
                        active ? ui?.styles?.optionActive : undefined,
                        selected ? ui?.styles?.optionSelected : undefined,
                      )}
                    >
                      {ui?.renderOption?.(option, { active, selected }) ?? option.label}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </>
      )}

      {props.error ? (
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
      ) : error ? (
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
          {error}
        </span>
      ) : props.hint ? (
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
      ) : null}
    </div>
  );
};

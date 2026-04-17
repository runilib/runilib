import React, {
  type CSSProperties,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAsyncOptions } from '../../hooks/shared/useAsyncOptions';
import type {
  FieldDescriptor,
  FieldRenderProps,
  FocusableFieldHandle,
  SelectOption,
  SelectPickerRenderContext,
  WebAsyncAutocompleteFieldPropsOverrides,
} from '../../types';
import type { ExtraFieldProps } from '../../types.web';
import { cx, mergeStyles, renderLabelSlot } from './helpers';
import {
  defaultErrorChromeStyle,
  defaultErrorTextStyle,
  type ResolvedWebFieldProps,
  resolveWebInputBehavior,
  shouldHighlightOnError,
} from './shared';

interface Props extends FieldRenderProps<string> {
  descriptor: FieldDescriptor<string> & {
    _asyncOptions: NonNullable<FieldDescriptor<string>['_asyncOptions']>;
    _searchable?: boolean;
    fieldPropsFromClient?: ResolvedWebFieldProps;
  };
  extra?: ExtraFieldProps<WebAsyncAutocompleteFieldPropsOverrides>;
  registerFocusable?: (target: FocusableFieldHandle | null) => void;
}

function normalize(value: unknown): string {
  return value == null ? '' : String(value);
}

const defaultListboxStyle: CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: 1000,
  marginTop: 4,
  maxHeight: 220,
  overflowY: 'auto',
  background: '#fff',
  border: '1px solid #e2e8f0',
  boxShadow: '0 10px 12px rgba(0,0,0,0.08)',
};

const defaultOptionStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px 12px',
  border: 'none',
  background: 'transparent',
  textAlign: 'left',
  fontSize: 'inherit',
  fontFamily: 'inherit',
  cursor: 'pointer',
  zIndex: 50,
};

const defaultOptionActiveStyle: CSSProperties = {
  background: '#f1f5f9',
};

const defaultOptionSelectedStyle: CSSProperties = {
  fontWeight: 600,
  color: '#1e40af',
};

const defaultStatusStyle: CSSProperties = {
  padding: '10px 12px',
  fontSize: '0.875em',
  color: '#94a3b8',
  textAlign: 'center',
};

export const AsyncAutocompleteField: React.FC<Props> = ({
  descriptor,
  extra,
  registerFocusable,
  ...props
}) => {
  const reactId = useId();
  const fieldProps = descriptor.fieldPropsFromClient ?? {};
  const renderPicker = extra?.renderPicker ?? fieldProps.renderPicker;
  const inputBehavior = resolveWebInputBehavior(extra, fieldProps);
  const isReadOnly = Boolean(inputBehavior.readOnly);

  const {
    classNames,
    styles,
    hideLabel,
    wrapperProps,
    labelProps,
    inputProps,
    hintProps,
    errorProps,
    renderLabel,
    renderRequiredMark,
    renderOption,
    renderEmpty,
    renderLoading,
  } = extra ?? {};

  const {
    className: wrapperPropsClassName,
    style: wrapperPropsStyle,
    ...wrapperPropsRest
  } = wrapperProps ?? {};
  const {
    className: inputPropsClassName,
    style: inputPropsStyle,
    ...inputPropsRest
  } = inputProps ?? {};
  const {
    className: errorPropsClassName,
    style: errorPropsStyle,
    ...errorPropsRest
  } = errorProps ?? {};
  const {
    className: hintPropsClassName,
    style: hintPropsStyle,
    ...hintPropsRest
  } = hintProps ?? {};

  const id = extra?.id ?? fieldProps.id ?? `${props.name}-${reactId}`;
  const listboxId = `${id}-listbox`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const wrapperRef = useRef<HTMLDivElement>(null);

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
      if (!wrapperRef.current?.contains(target)) {
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
  const hasError = Boolean(props.error || error);
  const highlightOnError = shouldHighlightOnError(
    extra?.highlightOnError,
    fieldProps.highlightOnError,
  );
  const controlErrorStyle = defaultErrorChromeStyle(hasError, highlightOnError);

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
    if (props.disabled || isReadOnly) {
      return;
    }

    setIsOpen(true);
    setInputValue(selectedLabel);
    props.onFocus();
  }, [isReadOnly, props.disabled, props.onFocus, selectedLabel]);

  useEffect(() => {
    if (!renderPicker || !registerFocusable) {
      return;
    }

    registerFocusable({
      focus: handleFocus,
      blur: closePicker,
    });

    return () => {
      registerFocusable(null);
    };
  }, [closePicker, handleFocus, registerFocusable, renderPicker]);

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

  const wrapperClassName = cx(
    extra?.className,
    classNames?.wrapper,
    wrapperPropsClassName as string,
  );
  const inputClassName = cx(classNames?.autocompleteInput, inputPropsClassName);

  return (
    <div
      ref={wrapperRef}
      data-fb-field="async-autocomplete"
      data-fb-name={props.name}
      {...(isOpen ? { 'data-fb-open': '' } : {})}
      {...(hasError ? { 'data-fb-error': '' } : {})}
      {...(props.disabled ? { 'data-fb-disabled': '' } : {})}
      className={wrapperClassName}
      style={mergeStyles(
        {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          minWidth: 0,
          overflow: 'visible',
          zIndex: isOpen ? 999 : undefined,
        },
        extra?.style,
        styles?.wrapper,
        wrapperPropsStyle as CSSProperties,
      )}
      {...wrapperPropsRest}
    >
      {renderLabelSlot({
        id,
        label: props.label,
        name: props.name,
        required: Boolean(descriptor._required),
        hideLabel,
        classNames: classNames as Record<string, string | undefined>,
        styles: styles as Record<string, CSSProperties | undefined>,
        labelProps: labelProps as Record<string, unknown>,
        renderLabel,
        renderRequiredMark,
      })}

      {renderPicker ? (
        <>
          <button
            id={id}
            type="button"
            disabled={props.disabled}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-describedby={describedBy}
            data-fb-slot="select-trigger"
            data-fb-selected={selectedOptionFromOptions ? '' : undefined}
            onClick={handleFocus}
            className={cx(inputClassName, classNames?.autocompleteSelect)}
            style={mergeStyles(
              controlErrorStyle,
              styles?.autocompleteInput,
              styles?.autocompleteSelect,
              inputPropsStyle,
            )}
          >
            <span
              data-fb-slot="select-value"
              className={classNames?.autocompleteSelectValue}
              style={mergeStyles(styles?.autocompleteSelectValue)}
            >
              {pickerContext.triggerLabel}
            </span>
            <span
              aria-hidden="true"
              data-fb-slot="select-arrow"
              className={classNames?.autocompleteSelectArrow}
              style={mergeStyles(styles?.autocompleteSelectArrow)}
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
            ref={registerFocusable}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
            aria-invalid={hasError || undefined}
            aria-required={descriptor._required || undefined}
            aria-readonly={isReadOnly || undefined}
            aria-describedby={describedBy}
            disabled={props.disabled}
            readOnly={inputBehavior.readOnly}
            autoComplete={inputBehavior.autoComplete ?? 'off'}
            // biome-ignore lint/a11y/noAutofocus: form builders expose autofocus intentionally.
            autoFocus={inputBehavior.autoFocus}
            spellCheck={inputBehavior.spellCheck}
            inputMode={inputBehavior.inputMode}
            enterKeyHint={inputBehavior.enterKeyHint}
            value={displayedInputValue}
            placeholder={props.placeholder ?? `Search ${props.label}`}
            onFocus={handleFocus}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              // closing managed by click outside / selection
            }}
            data-fb-slot="input"
            className={inputClassName}
            style={mergeStyles(
              controlErrorStyle,
              styles?.autocompleteInput,
              inputPropsStyle,
            )}
            {...inputPropsRest}
          />

          {isOpen && !props.disabled && (
            <div
              id={listboxId}
              role="listbox"
              data-fb-slot="listbox"
              className={classNames?.autocompleteListbox}
              style={mergeStyles(defaultListboxStyle, styles?.autocompleteListbox)}
            >
              {loading ? (
                <div
                  data-fb-slot="loading"
                  className={classNames?.autocompleteLoading}
                  style={mergeStyles(defaultStatusStyle, styles?.autocompleteLoading)}
                >
                  {renderLoading?.() ?? 'Loading...'}
                </div>
              ) : options.length === 0 ? (
                <div
                  data-fb-slot="empty"
                  className={classNames?.autocompleteEmpty}
                  style={mergeStyles(defaultStatusStyle, styles?.autocompleteEmpty)}
                >
                  {renderEmpty?.() ?? 'No results'}
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
                      data-fb-slot="option"
                      {...(active ? { 'data-fb-active': '' } : {})}
                      {...(selected ? { 'data-fb-selected': '' } : {})}
                      className={cx(
                        classNames?.autocompleteOption,
                        active && classNames?.autocompleteOptionActive,
                        selected && classNames?.autocompleteOptionSelected,
                      )}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        commitSelection(option);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      style={mergeStyles(
                        defaultOptionStyle,
                        styles?.autocompleteOption,
                        active
                          ? mergeStyles(
                              defaultOptionActiveStyle,
                              styles?.autocompleteOptionActive,
                            )
                          : undefined,
                        selected
                          ? mergeStyles(
                              defaultOptionSelectedStyle,
                              styles?.autocompleteOptionSelected,
                            )
                          : undefined,
                      )}
                    >
                      {renderOption?.(option, { active, selected }) ?? option.label}
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
          data-fb-slot="error"
          className={cx(classNames?.error, errorPropsClassName as string)}
          style={mergeStyles(
            defaultErrorTextStyle(true),
            styles?.error,
            errorPropsStyle as CSSProperties,
          )}
          {...errorPropsRest}
        >
          {props.error}
        </span>
      ) : error ? (
        <span
          id={errorId}
          role="alert"
          data-fb-slot="error"
          className={cx(classNames?.error, errorPropsClassName as string)}
          style={mergeStyles(
            defaultErrorTextStyle(true),
            styles?.error,
            errorPropsStyle as CSSProperties,
          )}
          {...errorPropsRest}
        >
          {error}
        </span>
      ) : props.hint ? (
        <span
          id={hintId}
          data-fb-slot="hint"
          className={cx(classNames?.hint, hintPropsClassName as string)}
          style={mergeStyles(styles?.hint, hintPropsStyle as CSSProperties)}
          {...hintPropsRest}
        >
          {props.hint}
        </span>
      ) : null}
    </div>
  );
};

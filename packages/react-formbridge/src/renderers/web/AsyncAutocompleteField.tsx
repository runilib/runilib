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
  WebAsyncAutocompleteFieldUiOverrides,
} from '../../types';
import type { ExtraFieldProps } from '../../types.web';
import { cx, mergeStyles, renderLabelSlot } from './helpers';
import {
  defaultErrorChromeStyle,
  defaultErrorTextStyle,
  type ResolvedWebFieldUi,
  shouldHighlightOnError,
} from './shared';

interface Props extends FieldRenderProps<string> {
  descriptor: FieldDescriptor<string> & {
    _asyncOptions: NonNullable<FieldDescriptor<string>['_asyncOptions']>;
    _searchable?: boolean;
    _ui?: ResolvedWebFieldUi;
  };
  extra?: ExtraFieldProps<WebAsyncAutocompleteFieldUiOverrides>;
  registerFocusable?: (target: FocusableFieldHandle | null) => void;
}

function normalize(value: unknown): string {
  return value == null ? '' : String(value);
}

export const AsyncAutocompleteField: React.FC<Props> = ({
  descriptor,
  extra,
  registerFocusable,
  ...props
}) => {
  const reactId = useId();
  const fieldUi = descriptor._ui ?? {};
  const renderPicker = extra?.renderPicker ?? fieldUi.renderPicker;

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
    renderRequiredMark,
    renderOption,
    renderEmpty,
    renderLoading,
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

  const id = extra?.id ?? fieldUi.id ?? `${props.name}-${reactId}`;
  const listboxId = `${id}-listbox`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

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
  const hasError = Boolean(props.error || error);
  const highlightOnError = shouldHighlightOnError(
    extra?.highlightOnError,
    fieldUi.highlightOnError,
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
    setIsOpen(true);
    setInputValue(selectedLabel);
    props.onFocus();
  }, [props.onFocus, selectedLabel]);

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

  const rootClassName = cx(
    extra?.className,
    classNames?.root,
    rootPropsClassName as string,
  );
  const inputClassName = cx(classNames?.input, inputPropsClassName);

  return (
    <div
      ref={rootRef}
      data-fb-field="async-autocomplete"
      data-fb-name={props.name}
      {...(hasError ? { 'data-fb-error': '' } : {})}
      {...(props.disabled ? { 'data-fb-disabled': '' } : {})}
      className={rootClassName}
      style={mergeStyles(
        { position: 'relative' },
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
            className={cx(inputClassName, classNames?.select)}
            style={mergeStyles(controlErrorStyle, styles?.input, inputPropsStyle)}
          >
            <span data-fb-slot="select-value">{pickerContext.triggerLabel}</span>
            <span
              aria-hidden="true"
              data-fb-slot="select-arrow"
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
            data-fb-slot="input"
            className={inputClassName}
            style={mergeStyles(controlErrorStyle, styles?.input, inputPropsStyle)}
            {...inputPropsRest}
          />

          {isOpen && !props.disabled && (
            <div
              id={listboxId}
              role="listbox"
              data-fb-slot="listbox"
              className={classNames?.listbox}
              style={mergeStyles(
                { position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50 },
                styles?.listbox,
              )}
            >
              {loading ? (
                <div
                  data-fb-slot="loading"
                  className={classNames?.loading}
                  style={mergeStyles(styles?.loading)}
                >
                  {renderLoading?.() ?? 'Loading...'}
                </div>
              ) : options.length === 0 ? (
                <div
                  data-fb-slot="empty"
                  className={classNames?.empty}
                  style={mergeStyles(styles?.empty)}
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
                        classNames?.option,
                        active && classNames?.optionActive,
                        selected && classNames?.optionSelected,
                      )}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        commitSelection(option);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      style={mergeStyles(
                        styles?.option,
                        active ? styles?.optionActive : undefined,
                        selected ? styles?.optionSelected : undefined,
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

import React, {
  type CSSProperties,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { PhoneValue } from '../../core/field-builders/phone/countries';
import {
  buildPhoneValue,
  COUNTRIES_SORTED,
  getCountry,
  parseStoredPhoneValue,
  searchCountries,
} from '../../core/field-builders/phone/countries';
import type { PhoneDescriptor } from '../../core/field-builders/phone/PhoneFieldBuilder';
import type { CountryInfo } from '../../core/field-builders/phone/types';
import type { ExtraFieldProps, FieldRenderProps } from '../../types.web';
import {
  defaultBorderColor,
  type ResolvedWebFieldUi,
  shouldHighlightOnError,
} from './shared';

type CountryListItem =
  | CountryInfo
  | {
      separator: true;
      key: string;
    };

type PhoneSlot =
  | 'root'
  | 'label'
  | 'row'
  | 'countryButton'
  | 'countrySearchInput'
  | 'countryList'
  | 'countryItem'
  | 'countryName'
  | 'countryDial'
  | 'input'
  | 'error'
  | 'hint'
  | 'e164'
  | 'requiredMark';

interface PhoneUiOverrides {
  id?: string;
  hideLabel?: boolean;
  highlightOnError?: boolean;
  classNames?: Partial<Record<PhoneSlot, string>> & Record<string, string | undefined>;
  styles?: Partial<Record<PhoneSlot, CSSProperties>> &
    Record<string, CSSProperties | undefined>;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'type'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'id'
  >;
  searchInputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange'
  >;
  hintProps?: HTMLAttributes<HTMLSpanElement>;
  errorProps?: HTMLAttributes<HTMLSpanElement>;
  renderLabel?: (ctx: {
    id: string;
    label: React.ReactNode;
    required: boolean;
  }) => React.ReactNode;
  renderHint?: (ctx: { id: string; hint: React.ReactNode }) => React.ReactNode;
  renderError?: (ctx: { id: string; error: React.ReactNode }) => React.ReactNode;
  renderRequiredMark?: () => React.ReactNode;
}

interface Props extends FieldRenderProps<PhoneValue | string | null> {
  descriptor: PhoneDescriptor & {
    _ui?: ResolvedWebFieldUi;
  };
  extra?: ExtraFieldProps<PhoneUiOverrides>;
}

function cx(...values: Array<string | undefined | false | null>) {
  return values.filter(Boolean).join(' ');
}

function mergeStyles(
  ...styles: Array<CSSProperties | Record<string, unknown> | undefined>
): CSSProperties | undefined {
  return Object.assign({}, ...styles.filter(Boolean));
}

function selectorBtnStyle(
  error: boolean,
  disabled: boolean,
  highlightOnError: boolean,
): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 12px',
    borderRadius: '8px 0 0 8px',
    border: `1.5px solid ${defaultBorderColor(error, highlightOnError, '#e5e7eb')}`,
    borderRight: '1px solid #e5e7eb',
    background: disabled ? '#f9fafb' : '#fff',
    cursor: disabled ? 'not-allowed' : 'pointer',
    minWidth: 88,
    whiteSpace: 'nowrap',
    transition: 'border-color 0.15s',
  };
}

function phoneInputStyle(
  error: boolean,
  disabled: boolean,
  highlightOnError: boolean,
): CSSProperties {
  return {
    flex: 1,
    padding: '10px 13px',
    borderRadius: '0 8px 8px 0',
    border: `1.5px solid ${defaultBorderColor(error, highlightOnError, '#e5e7eb')}`,
    borderLeft: 'none',
    fontSize: 14,
    outline: 'none',
    background: disabled ? '#f9fafb' : '#fff',
    color: '#111',
    fontFamily: 'monospace',
    letterSpacing: '0.04em',
  };
}

function countryItemStyle(selected: boolean): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '9px 14px',
    background: selected ? '#eff6ff' : 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.1s',
  };
}

export const PhoneInput = ({ descriptor: d, extra, ...props }: Props) => {
  const defaultCountry = getCountry(d._phoneDefaultCountry) ?? COUNTRIES_SORTED[0];
  const web = d._ui ?? {};
  const ui = extra?.ui;
  const { rootProps, labelProps, inputProps, searchInputProps, hintProps, errorProps } =
    ui ?? {};
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
    className: searchInputPropsClassName,
    style: searchInputPropsStyle,
    ...searchInputPropsRest
  } = searchInputProps ?? {};
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

  const normalizedValue = useMemo(
    () => parseStoredPhoneValue(props.value, defaultCountry.code),
    [defaultCountry.code, props.value],
  );
  const highlightOnError = shouldHighlightOnError(
    ui?.highlightOnError,
    web.highlightOnError,
  );

  const [selectedCountryCode, setSelectedCountryCode] = useState(
    normalizedValue?.country ?? defaultCountry.code,
  );
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const dropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (normalizedValue?.country && normalizedValue.country !== selectedCountryCode) {
      setSelectedCountryCode(normalizedValue.country);
    }
  }, [normalizedValue?.country, selectedCountryCode]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const close = (event: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const currentCountry =
    getCountry(selectedCountryCode) ??
    getCountry(normalizedValue?.country ?? '') ??
    defaultCountry;

  const emitValue = useCallback(
    (phoneValue: PhoneValue | null) => {
      if (!phoneValue) {
        props.onChange(null);
        return;
      }

      if (d._phoneStoreE164) {
        props.onChange(phoneValue.e164 || null);
        return;
      }

      props.onChange(phoneValue);
    },
    [d._phoneStoreE164, props.onChange],
  );

  const filteredCountries = useMemo<CountryListItem[]>(() => {
    const results = searchCountries(search);

    if (search.trim()) {
      return results;
    }

    const preferredSet = new Set(d._phonePreferred.map((code) => code.toUpperCase()));
    const preferred = results.filter((country) => preferredSet.has(country.code));
    const rest = results.filter((country) => !preferredSet.has(country.code));

    if (preferred.length === 0 || rest.length === 0) {
      return results;
    }

    return [...preferred, { separator: true, key: 'preferred-separator' }, ...rest];
  }, [d._phonePreferred, search]);

  const handleNationalChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextInput = event.target.value;

      if (!nextInput.trim()) {
        emitValue(null);
        return;
      }

      const nextValue = buildPhoneValue(currentCountry, nextInput);
      setSelectedCountryCode(nextValue.country);
      emitValue(nextValue);
    },
    [currentCountry, emitValue],
  );

  const selectCountry = useCallback(
    (country: CountryInfo) => {
      setSelectedCountryCode(country.code);
      setOpen(false);
      setSearch('');
      props.onChange(null);

      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    },
    [props.onChange],
  );

  const id = ui?.id ?? web.id ?? props.name;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = props.error ? errorId : props.hint ? hintId : undefined;
  const displayValue = normalizedValue?.national ?? '';
  const hasError = Boolean(props.error);
  const placeholder =
    currentCountry.exampleNational ||
    props.placeholder ||
    d._placeholder ||
    'Enter phone number';
  const requiredMark = ui?.renderRequiredMark?.() ?? (
    <span
      className={ui?.classNames?.requiredMark}
      style={mergeStyles({ color: '#ef4444', marginLeft: 3 }, ui?.styles?.requiredMark)}
    >
      *
    </span>
  );

  return (
    <div
      className={cx(extra?.className, ui?.classNames?.root, rootPropsClassName)}
      style={mergeStyles(
        { display: 'flex', flexDirection: 'column', gap: 5 },
        extra?.style,
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
            className={cx(ui?.classNames?.label, labelPropsClassName)}
            style={mergeStyles(ui?.styles?.label, labelPropsStyle)}
            {...labelPropsRest}
          >
            {props.label}
            {d._required && requiredMark}
          </label>
        ))}

      <div
        className={ui?.classNames?.row}
        style={mergeStyles(
          { display: 'flex', gap: 0, position: 'relative' },
          ui?.styles?.row,
        )}
      >
        <div
          ref={dropRef}
          style={{ position: 'relative' }}
        >
          <button
            type="button"
            onClick={() => !props.disabled && setOpen((prev) => !prev)}
            disabled={props.disabled}
            className={ui?.classNames?.countryButton}
            style={mergeStyles(
              selectorBtnStyle(hasError, Boolean(props.disabled), highlightOnError),
              ui?.styles?.countryButton,
            )}
            aria-label="Select country"
            aria-expanded={open}
          >
            {d._phoneShowFlag && (
              <span style={{ fontSize: 18, lineHeight: 1 }}>{currentCountry.flag}</span>
            )}

            {d._phoneShowDialCode && (
              <span
                className={ui?.classNames?.countryDial}
                style={mergeStyles(
                  { fontSize: 13, fontWeight: 600, color: '#374151' },
                  ui?.styles?.countryDial,
                )}
              >
                +{currentCountry.dial}
              </span>
            )}

            <span style={{ fontSize: 10, color: '#9ca3af', marginLeft: 2 }}>▾</span>
          </button>

          {open && (
            <div
              className={ui?.classNames?.countryList}
              style={mergeStyles(
                {
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  zIndex: 999,
                  background: '#fff',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 10,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  minWidth: 280,
                  marginTop: 4,
                },
                ui?.styles?.countryList,
              )}
            >
              {d._phoneSearchable && (
                <div style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6' }}>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search country…"
                    className={cx(
                      ui?.classNames?.countrySearchInput,
                      searchInputPropsClassName,
                    )}
                    style={mergeStyles(
                      {
                        width: '100%',
                        padding: '7px 10px',
                        border: '1.5px solid #e5e7eb',
                        borderRadius: 7,
                        fontSize: 13,
                        outline: 'none',
                        boxSizing: 'border-box',
                      },
                      ui?.styles?.countrySearchInput,
                      searchInputPropsStyle,
                    )}
                    {...searchInputPropsRest}
                  />
                </div>
              )}

              <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                {filteredCountries.map((item) => {
                  if ('separator' in item) {
                    return (
                      <div
                        key={item.key}
                        style={{ height: 1, background: '#f3f4f6', margin: '4px 0' }}
                      />
                    );
                  }

                  const isSelected = item.code === currentCountry.code;

                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => selectCountry(item)}
                      className={ui?.classNames?.countryItem}
                      style={mergeStyles(
                        countryItemStyle(isSelected),
                        ui?.styles?.countryItem,
                      )}
                    >
                      {d._phoneShowFlag && (
                        <span style={{ fontSize: 16 }}>{item.flag}</span>
                      )}

                      <span
                        className={ui?.classNames?.countryName}
                        style={mergeStyles(
                          {
                            flex: 1,
                            fontSize: 13,
                            color: '#374151',
                            textAlign: 'left',
                          },
                          ui?.styles?.countryName,
                        )}
                      >
                        {item.name}
                      </span>

                      <span
                        className={ui?.classNames?.countryDial}
                        style={mergeStyles(
                          {
                            fontSize: 12,
                            color: '#9ca3af',
                            fontFamily: 'monospace',
                          },
                          ui?.styles?.countryDial,
                        )}
                      >
                        +{item.dial}
                      </span>
                    </button>
                  );
                })}

                {filteredCountries.length === 0 && (
                  <p style={{ padding: '12px 14px', fontSize: 13, color: '#9ca3af' }}>
                    No results for "{search}"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          id={id}
          name={props.name}
          type="tel"
          value={displayValue}
          placeholder={placeholder}
          disabled={props.disabled}
          readOnly={web.readOnly}
          autoComplete={web.autoComplete ?? 'tel-national'}
          // biome-ignore lint/a11y/noAutofocus: form builders expose autofocus intentionally.
          autoFocus={web.autoFocus}
          spellCheck={web.spellCheck}
          onChange={handleNationalChange}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={cx(ui?.classNames?.input, inputPropsClassName)}
          style={mergeStyles(
            phoneInputStyle(hasError, Boolean(props.disabled), highlightOnError),
            ui?.styles?.input,
            inputPropsStyle,
          )}
          inputMode="tel"
          {...inputPropsRest}
        />
      </div>

      {props.error
        ? (ui?.renderError?.({ id: errorId, error: props.error }) ?? (
            <span
              id={errorId}
              role="alert"
              className={cx(ui?.classNames?.error, errorPropsClassName)}
              style={mergeStyles(
                { color: '#ef4444' },
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
                  { color: '#9ca3af' },
                  ui?.styles?.hint,
                  hintPropsStyle,
                )}
                {...hintPropsRest}
              >
                {props.hint}
              </span>
            ))
          : null}

      {normalizedValue?.e164 && (
        <span
          className={ui?.classNames?.e164}
          style={mergeStyles(
            { fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' },
            ui?.styles?.e164,
          )}
        >
          {normalizedValue.e164}
        </span>
      )}
    </div>
  );
};

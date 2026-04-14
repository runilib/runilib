import React, {
  type CSSProperties,
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
import type { FocusableFieldHandle } from '../../types';
import type { WebPhoneFieldPropsOverrides } from '../../types/ui-web';
import type { ExtraFieldProps, FieldRenderProps } from '../../types.web';
import { cx, mergeStyles, renderHelperSlot, renderLabelSlot } from './helpers';
import {
  defaultBorderColor,
  defaultErrorChromeStyle,
  type ResolvedWebFieldProps,
  resolveWebInputBehavior,
  shouldHighlightOnError,
} from './shared';

type CountryListItem =
  | CountryInfo
  | {
      separator: true;
      key: string;
    };

function resolveText<TContext>(
  override: string | ((ctx: TContext) => string) | undefined,
  fallback: string,
  context: TContext,
): string {
  if (typeof override === 'function') {
    return override(context);
  }

  return override ?? fallback;
}

interface Props extends FieldRenderProps<PhoneValue | string | null> {
  descriptor: PhoneDescriptor & {
    fieldPropsFromClient?: ResolvedWebFieldProps;
  };
  extra?: ExtraFieldProps<WebPhoneFieldPropsOverrides>;
  registerFocusable?: (target: FocusableFieldHandle | null) => void;
}

const defaultDetachedRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  gap: 12,
  alignItems: 'stretch',
};

const defaultIntegratedRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  alignItems: 'stretch',
  minHeight: 52,
  boxSizing: 'border-box',
  border: '1px solid #d1d5db',
  // borderRadius: 14,
  background: '#ffffff',
};

const defaultCountryButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  minHeight: 52,
  minWidth: 88,
  padding: '0 12px',
  boxSizing: 'border-box',
  border: '1px solid #d1d5db',
  // borderRadius: 14,
  background: '#ffffff',
  color: '#111827',
  fontSize: 14,
  fontWeight: 600,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
};

const defaultIntegratedCountryButtonStyle: CSSProperties = {
  minHeight: '100%',
  minWidth: 92,
  padding: '0 14px',
  border: 'none',
  // borderRadius: 0,
  background: 'transparent',
  color: 'inherit',
};

const defaultCountryDividerStyle: CSSProperties = {
  position: 'absolute',
  top: 8,
  bottom: 8,
  right: 0,
  width: 1,
  background: '#e5e7eb',
  pointerEvents: 'none',
};

const defaultCountryListStyle: CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  zIndex: 50,
  marginTop: 8,
  minWidth: 280,
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  // borderRadius: 14,
  boxShadow: '0 18px 50px rgba(15, 23, 42, 0.14)',
  overflow: 'hidden',
};

const defaultCountrySearchWrapperStyle: CSSProperties = {
  padding: '12px 12px 0',
};

const defaultCountrySearchInputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  border: '1px solid #e5e7eb',
  // borderRadius: 10,
  background: '#f8fafc',
  color: '#111827',
  fontSize: 13,
  outline: 'none',
};

const defaultCountryScrollStyle: CSSProperties = {
  maxHeight: 260,
  overflowY: 'auto',
  display: 'grid',
  padding: '8px 0',
};

const defaultCountryItemStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '24px minmax(0, 1fr) auto',
  gap: 10,
  alignItems: 'center',
  padding: '10px 14px',
  border: 'none',
  background: 'transparent',
  color: '#111827',
  fontSize: 13,
  textAlign: 'left',
  cursor: 'pointer',
  width: '100%',
};

const defaultCountrySeparatorStyle: CSSProperties = {
  height: 1,
  margin: '4px 12px',
  background: '#e5e7eb',
};

const defaultIntegratedInputStyle: CSSProperties = {
  minWidth: 0,
  width: '100%',
  minHeight: '100%',
  padding: '0 14px',
  boxSizing: 'border-box',
  border: 'none',
  // borderRadius: 0,
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  outline: 'none',
  background: 'transparent',
  boxShadow: 'none',
  color: 'inherit',
  font: 'inherit',
  lineHeight: 1.35,
};

export const PhoneInput = ({ descriptor, extra, registerFocusable, ...props }: Props) => {
  const defaultCountry =
    getCountry(descriptor._phoneDefaultCountry) ?? COUNTRIES_SORTED[0];
  const web = descriptor.fieldPropsFromClient ?? {};
  const inputBehavior = resolveWebInputBehavior(extra, web);
  const isReadOnly = Boolean(inputBehavior.readOnly);

  const {
    classNames,
    styles,
    hideLabel,
    wrapperProps,
    labelProps,
    inputProps,
    searchInputProps,
    hintProps,
    errorProps,
    countryButtonAriaLabel,
    searchPlaceholderText,
    emptySearchText,
    e164Text,
    renderLabel,
    renderHint,
    renderError,
    renderRequiredMark,
    renderCountryButtonContent,
    renderCountryItemContent,
    renderEmptySearchContent,
    renderE164,
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
    className: searchInputPropsClassName,
    style: searchInputPropsStyle,
    ...searchInputPropsRest
  } = searchInputProps ?? {};

  const normalizedValue = useMemo(
    () => parseStoredPhoneValue(props.value, defaultCountry.code),
    [defaultCountry.code, props.value],
  );
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    normalizedValue?.country ?? defaultCountry.code,
  );
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const dropRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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

      if (descriptor._phoneStoreE164) {
        props.onChange(phoneValue.e164 || null);
        return;
      }

      props.onChange(phoneValue);
    },
    [descriptor._phoneStoreE164, props.onChange],
  );

  const filteredCountries = useMemo<CountryListItem[]>(() => {
    const results = searchCountries(search);

    if (search.trim()) {
      return results;
    }

    const preferredSet = new Set(
      descriptor._phonePreferred.map((code) => code.toUpperCase()),
    );
    const preferred = results.filter((country) => preferredSet.has(country.code));
    const rest = results.filter((country) => !preferredSet.has(country.code));

    if (preferred.length === 0 || rest.length === 0) {
      return results;
    }

    return [...preferred, { separator: true, key: 'preferred-separator' }, ...rest];
  }, [descriptor._phonePreferred, search]);

  const handleNationalChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isReadOnly) {
        return;
      }

      const nextInput = event.target.value;

      if (!nextInput.trim()) {
        emitValue(null);
        return;
      }

      const nextValue = buildPhoneValue(currentCountry, nextInput);
      setSelectedCountryCode(nextValue.country);
      emitValue(nextValue);
    },
    [currentCountry, emitValue, isReadOnly],
  );

  const selectCountry = useCallback(
    (country: CountryInfo) => {
      if (isReadOnly) {
        return;
      }

      setSelectedCountryCode(country.code);
      setOpen(false);
      setSearch('');
      props.onChange(null);

      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    },
    [isReadOnly, props.onChange],
  );

  const id = extra?.id ?? web.id ?? props.name;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = props.error ? errorId : props.hint ? hintId : undefined;
  const displayValue = normalizedValue?.national ?? '';
  const hasError = Boolean(props.error);
  const countryLayout = extra?.countryLayout ?? descriptor._phoneCountryLayout;
  const integrated = countryLayout === 'integrated';
  const highlightOnError = shouldHighlightOnError(
    extra?.highlightOnError,
    web.highlightOnError,
  );
  const controlErrorStyle = defaultErrorChromeStyle(hasError, highlightOnError);
  const placeholder =
    currentCountry.exampleNational ||
    props.placeholder ||
    descriptor._placeholder ||
    'Enter phone number';
  const renderContext = useMemo(
    () => ({
      currentCountry,
      disabled: props.disabled,
      e164Value: normalizedValue?.e164 ?? null,
      filteredCount: filteredCountries.length,
      hasValue: Boolean(displayValue),
      layout: countryLayout,
      nationalValue: displayValue,
      open,
      preferredCountries: descriptor._phonePreferred,
      search,
      searchable: descriptor._phoneSearchable,
      showDialCode: descriptor._phoneShowDialCode,
      showFlag: descriptor._phoneShowFlag,
      storeE164: descriptor._phoneStoreE164,
      value: props.value,
    }),
    [
      currentCountry,
      descriptor._phonePreferred,
      descriptor._phoneSearchable,
      descriptor._phoneShowDialCode,
      descriptor._phoneShowFlag,
      descriptor._phoneStoreE164,
      countryLayout,
      displayValue,
      filteredCountries.length,
      normalizedValue?.e164,
      open,
      props.disabled,
      props.value,
      search,
    ],
  );
  const resolvedCountryButtonAriaLabel = resolveText(
    countryButtonAriaLabel,
    'Select country',
    renderContext,
  );
  const resolvedSearchPlaceholder = resolveText(
    searchPlaceholderText,
    'Search country…',
    renderContext,
  );
  const resolvedEmptySearchText = resolveText(
    emptySearchText,
    search.trim() ? `No countries match "${search.trim()}".` : 'No countries available.',
    renderContext,
  );
  const defaultCountryButtonContent = (
    <>
      {descriptor._phoneShowFlag && (
        <span
          data-fb-slot="country-flag"
          className={classNames?.countryFlag}
          style={mergeStyles(styles?.countryFlag)}
        >
          {currentCountry.flag}
        </span>
      )}

      {descriptor._phoneShowDialCode && (
        <span
          data-fb-slot="country-dial"
          className={classNames?.countryDial}
          style={mergeStyles(styles?.countryDial)}
        >
          +{currentCountry.dial}
        </span>
      )}

      <span
        data-fb-slot="chevron"
        aria-hidden="true"
        className={classNames?.chevron}
        style={mergeStyles(styles?.chevron)}
      >
        ▾
      </span>
    </>
  );
  const resolvedCountryButtonContent =
    renderCountryButtonContent?.({
      ...renderContext,
      defaultContent: defaultCountryButtonContent,
    }) ?? defaultCountryButtonContent;
  const defaultEmptySearchContent = (
    <p
      data-fb-slot="empty-text"
      className={classNames?.emptyText}
      style={mergeStyles(styles?.emptyText)}
    >
      {resolvedEmptySearchText}
    </p>
  );
  const resolvedEmptySearchContent =
    renderEmptySearchContent?.({
      ...renderContext,
      defaultContent: defaultEmptySearchContent,
    }) ?? defaultEmptySearchContent;

  return (
    <div
      data-fb-field="phone"
      data-fb-name={props.name}
      data-fb-layout={countryLayout}
      {...(hasError ? { 'data-fb-error': '' } : {})}
      {...(props.disabled ? { 'data-fb-disabled': '' } : {})}
      className={cx(extra?.className, classNames?.wrapper, wrapperPropsClassName as string)}
      style={mergeStyles(extra?.style, styles?.wrapper, wrapperPropsStyle as CSSProperties)}
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

      <div
        data-fb-slot="row"
        data-fb-layout={countryLayout}
        className={classNames?.row}
        style={mergeStyles(
          integrated
            ? {
                ...defaultIntegratedRowStyle,
                borderColor: defaultBorderColor(hasError, highlightOnError, '#d1d5db'),
              }
            : {
                ...defaultDetachedRowStyle,
              },
          integrated ? defaultErrorChromeStyle(hasError, highlightOnError) : undefined,
          styles?.row,
        )}
      >
        <div
          ref={dropRef}
          style={{ position: 'relative', display: 'flex', alignItems: 'stretch' }}
        >
          <button
            type="button"
            onClick={() => {
              if (props.disabled || isReadOnly) {
                return;
              }

              setOpen((prev) => !prev);
            }}
            disabled={props.disabled}
            data-fb-slot="country-button"
            {...(open ? { 'data-fb-open': '' } : {})}
            className={classNames?.countryButton}
            style={mergeStyles(
              defaultCountryButtonStyle,
              integrated ? defaultIntegratedCountryButtonStyle : undefined,
              styles?.countryButton,
            )}
            aria-label={resolvedCountryButtonAriaLabel}
            aria-expanded={open}
          >
            {resolvedCountryButtonContent}
          </button>

          {integrated ? (
            <div
              data-fb-slot="country-divider"
              className={classNames?.countryDivider}
              style={mergeStyles(defaultCountryDividerStyle, styles?.countryDivider)}
            />
          ) : null}

          {open && (
            <div
              data-fb-slot="country-list"
              className={classNames?.countryList}
              style={mergeStyles(defaultCountryListStyle, styles?.countryList)}
            >
              {descriptor._phoneSearchable && (
                <div
                  data-fb-slot="country-search-wrapper"
                  className={classNames?.countrySearchWrapper}
                  style={mergeStyles(
                    defaultCountrySearchWrapperStyle,
                    styles?.countrySearchWrapper,
                  )}
                >
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={resolvedSearchPlaceholder}
                    data-fb-slot="country-search-input"
                    className={cx(
                      classNames?.countrySearchInput,
                      searchInputPropsClassName,
                    )}
                    style={mergeStyles(
                      defaultCountrySearchInputStyle,
                      styles?.countrySearchInput,
                      searchInputPropsStyle,
                    )}
                    {...searchInputPropsRest}
                  />
                </div>
              )}

              <div
                data-fb-slot="country-scroll"
                className={classNames?.countryScroll}
                style={mergeStyles(defaultCountryScrollStyle, styles?.countryScroll)}
              >
                {filteredCountries.map((item, index) => {
                  if ('separator' in item) {
                    return (
                      <div
                        key={item.key}
                        data-fb-slot="separator"
                        className={classNames?.separator}
                        style={mergeStyles(defaultCountrySeparatorStyle, styles?.separator)}
                      />
                    );
                  }

                  const isSelected = item.code === currentCountry.code;
                  const defaultCountryItemContent = (
                    <>
                      {descriptor._phoneShowFlag && (
                        <span
                          data-fb-slot="country-flag"
                          className={classNames?.countryFlag}
                          style={mergeStyles(styles?.countryFlag)}
                        >
                          {item.flag}
                        </span>
                      )}

                      <span
                        data-fb-slot="country-name"
                        className={classNames?.countryName}
                        style={mergeStyles(styles?.countryName)}
                      >
                        {item.name}
                      </span>

                      <span
                        data-fb-slot="country-dial"
                        className={classNames?.countryDial}
                        style={mergeStyles(styles?.countryDial)}
                      >
                        +{item.dial}
                      </span>
                    </>
                  );
                  const resolvedCountryItemContent =
                    renderCountryItemContent?.({
                      ...renderContext,
                      country: item,
                      defaultContent: defaultCountryItemContent,
                      index,
                      selected: isSelected,
                    }) ?? defaultCountryItemContent;

                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => selectCountry(item)}
                      data-fb-slot="country-item"
                      {...(isSelected ? { 'data-fb-selected': '' } : {})}
                      className={classNames?.countryItem}
                      style={mergeStyles(defaultCountryItemStyle, styles?.countryItem)}
                    >
                      {resolvedCountryItemContent}
                    </button>
                  );
                })}

                {filteredCountries.length === 0 && resolvedEmptySearchContent}
              </div>
            </div>
          )}
        </div>

        <input
          ref={(node) => {
            inputRef.current = node;
            registerFocusable?.(node);
          }}
          id={id}
          name={props.name}
          type="tel"
          value={displayValue}
          placeholder={placeholder}
          disabled={props.disabled}
          readOnly={inputBehavior.readOnly}
          autoComplete={inputBehavior.autoComplete ?? 'tel-national'}
          // biome-ignore lint/a11y/noAutofocus: form builders expose autofocus intentionally.
          autoFocus={inputBehavior.autoFocus}
          spellCheck={inputBehavior.spellCheck}
          onChange={handleNationalChange}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          aria-invalid={hasError || undefined}
          aria-readonly={isReadOnly || undefined}
          aria-describedby={describedBy}
          data-fb-slot="input"
          className={cx(classNames?.input, inputPropsClassName)}
          style={mergeStyles(
            integrated ? defaultIntegratedInputStyle : undefined,
            integrated ? undefined : controlErrorStyle,
            styles?.input,
            inputPropsStyle,
          )}
          inputMode={inputBehavior.inputMode ?? 'tel'}
          enterKeyHint={inputBehavior.enterKeyHint}
          {...inputPropsRest}
        />
      </div>

      {renderHelperSlot({
        error: props.error,
        hint: props.hint,
        errorId,
        hintId,
        name: props.name,
        classNames: classNames as Record<string, string | undefined>,
        styles: styles as Record<string, CSSProperties | undefined>,
        errorProps: errorProps as Record<string, unknown>,
        hintProps: hintProps as Record<string, unknown>,
        renderError,
        renderHint,
      })}

      {normalizedValue?.e164 &&
        (renderE164?.({
          ...renderContext,
          defaultContent: (
            <span
              data-fb-slot="e164"
              className={classNames?.e164}
              style={mergeStyles(styles?.e164)}
            >
              {resolveText(e164Text, normalizedValue.e164, {
                ...renderContext,
                e164: normalizedValue.e164,
              })}
            </span>
          ),
          e164: normalizedValue.e164,
        }) ?? (
          <span
            data-fb-slot="e164"
            className={classNames?.e164}
            style={mergeStyles(styles?.e164)}
          >
            {resolveText(e164Text, normalizedValue.e164, {
              ...renderContext,
              e164: normalizedValue.e164,
            })}
          </span>
        ))}
    </div>
  );
};

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
import {
  defaultCountryButtonStyle,
  defaultCountryDividerStyle,
  defaultCountryItemStyle,
  defaultCountryListStyle,
  defaultCountryScrollStyle,
  defaultCountrySearchInputStyle,
  defaultCountrySearchWrapperStyle,
  defaultCountrySeparatorStyle,
  defaultDetachedRowStyle,
  defaultIntegratedCountryButtonStyle,
  defaultIntegratedInputStyle,
  defaultIntegratedRowStyle,
} from './default-styles';
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
  const shouldRenderE164 =
    Boolean(normalizedValue?.e164) &&
    (e164Text !== undefined || renderE164 !== undefined);

  const defaultE164Content =
    normalizedValue?.e164 && shouldRenderE164 ? (
      <span
        data-fb-slot="e164"
        className={classNames?.phoneE164}
        style={mergeStyles(styles?.phoneE164)}
      >
        {resolveText(e164Text, normalizedValue.e164, {
          ...renderContext,
          e164: normalizedValue.e164,
        })}
      </span>
    ) : null;
  const resolvedE164Content =
    normalizedValue?.e164 && defaultE164Content
      ? (renderE164?.({
          ...renderContext,
          defaultContent: defaultE164Content,
          e164: normalizedValue.e164,
        }) ?? defaultE164Content)
      : null;
  const defaultCountryButtonContent = (
    <>
      {descriptor._phoneShowFlag && (
        <span
          data-fb-slot="country-flag"
          className={classNames?.phoneCountryFlag}
          style={mergeStyles(styles?.phoneCountryFlag)}
        >
          {currentCountry.flag}
        </span>
      )}

      {descriptor._phoneShowDialCode && (
        <span
          data-fb-slot="country-dial"
          className={classNames?.phoneCountryDial}
          style={mergeStyles(styles?.phoneCountryDial)}
        >
          +{currentCountry.dial}
        </span>
      )}

      <span
        data-fb-slot="chevron"
        aria-hidden="true"
        className={classNames?.phoneChevron}
        style={mergeStyles(styles?.phoneChevron)}
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
      className={classNames?.phoneEmptyText}
      style={mergeStyles(styles?.phoneEmptyText)}
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
      className={cx(
        extra?.className,
        classNames?.wrapper,
        wrapperPropsClassName as string,
      )}
      style={mergeStyles(
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

      <div
        data-fb-slot="row"
        data-fb-layout={countryLayout}
        className={classNames?.phoneRow}
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
          styles?.phoneRow,
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
            className={classNames?.phoneCountryButton}
            style={mergeStyles(
              defaultCountryButtonStyle,
              integrated ? defaultIntegratedCountryButtonStyle : undefined,
              styles?.phoneCountryButton,
            )}
            aria-label={resolvedCountryButtonAriaLabel}
            aria-expanded={open}
          >
            {resolvedCountryButtonContent}
          </button>

          {integrated ? (
            <div
              data-fb-slot="country-divider"
              className={classNames?.phoneCountryDivider}
              style={mergeStyles(defaultCountryDividerStyle, styles?.phoneCountryDivider)}
            />
          ) : null}

          {open && (
            <div
              data-fb-slot="country-list"
              className={classNames?.phoneCountryList}
              style={mergeStyles(defaultCountryListStyle, styles?.phoneCountryList)}
            >
              {descriptor._phoneSearchable && (
                <div
                  data-fb-slot="country-search-wrapper"
                  className={classNames?.phoneSearchWrapper}
                  style={mergeStyles(
                    defaultCountrySearchWrapperStyle,
                    styles?.phoneSearchWrapper,
                  )}
                >
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={resolvedSearchPlaceholder}
                    data-fb-slot="country-search-input"
                    className={cx(
                      classNames?.phoneSearchInput,
                      searchInputPropsClassName,
                    )}
                    style={mergeStyles(
                      defaultCountrySearchInputStyle,
                      styles?.phoneSearchInput,
                      searchInputPropsStyle,
                    )}
                    {...searchInputPropsRest}
                  />
                </div>
              )}

              <div
                data-fb-slot="country-scroll"
                className={classNames?.phoneCountryScroll}
                style={mergeStyles(defaultCountryScrollStyle, styles?.phoneCountryScroll)}
              >
                {filteredCountries.map((item, index) => {
                  if ('separator' in item) {
                    return (
                      <div
                        key={item.key}
                        data-fb-slot="separator"
                        className={classNames?.phoneSeparator}
                        style={mergeStyles(
                          defaultCountrySeparatorStyle,
                          styles?.phoneSeparator,
                        )}
                      />
                    );
                  }

                  const isSelected = item.code === currentCountry.code;
                  const defaultCountryItemContent = (
                    <>
                      {descriptor._phoneShowFlag && (
                        <span
                          data-fb-slot="country-flag"
                          className={classNames?.phoneCountryFlag}
                          style={mergeStyles(styles?.phoneCountryFlag)}
                        >
                          {item.flag}
                        </span>
                      )}

                      <span
                        data-fb-slot="country-name"
                        className={classNames?.phoneCountryName}
                        style={mergeStyles(styles?.phoneCountryName)}
                      >
                        {item.name}
                      </span>

                      <span
                        data-fb-slot="country-dial"
                        className={classNames?.phoneCountryDial}
                        style={mergeStyles(styles?.phoneCountryDial)}
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
                      className={classNames?.phoneCountryItem}
                      style={mergeStyles(
                        defaultCountryItemStyle,
                        styles?.phoneCountryItem,
                      )}
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
          className={cx(classNames?.phoneInput, inputPropsClassName)}
          style={mergeStyles(
            integrated ? defaultIntegratedInputStyle : undefined,
            integrated ? undefined : controlErrorStyle,
            styles?.phoneInput,
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

      {resolvedE164Content}
    </div>
  );
};

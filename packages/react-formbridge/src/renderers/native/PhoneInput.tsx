import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  type StyleProp,
  Text,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

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
import type {
  ExtraFieldProps,
  FieldRenderProps,
  FocusableFieldHandle,
  NativePhoneFieldUiOverrides,
} from '../../types';
import {
  defaultBorderColor,
  defaultErrorChromeStyle,
  defaultErrorTextStyle,
  defaultRequiredMarkStyle,
  type ResolvedNativeFieldUi,
  shouldHighlightOnError,
  sx,
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
    _ui?: ResolvedNativeFieldUi;
  };
  extra?: ExtraFieldProps<NativePhoneFieldUiOverrides, 'native'>;
  registerFocusable?: (target: FocusableFieldHandle | null) => void;
}

const defaultDetachedRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'stretch',
  gap: 12,
};

const defaultIntegratedRowStyle: ViewStyle = {
  minHeight: 52,
  flexDirection: 'row',
  alignItems: 'stretch',
  borderWidth: 1,
  borderColor: '#d1d5db',
  borderRadius: 14,
  backgroundColor: '#ffffff',
};

const defaultCountryButtonStyle: ViewStyle = {
  minHeight: 52,
  minWidth: 88,
  paddingHorizontal: 12,
  borderWidth: 1,
  borderColor: '#d1d5db',
  borderRadius: 14,
  backgroundColor: '#ffffff',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
};

const defaultIntegratedCountryButtonStyle: ViewStyle = {
  minHeight: 52,
  minWidth: 92,
  borderWidth: 0,
  borderRadius: 0,
  backgroundColor: 'transparent',
};

const defaultCountryDividerStyle: ViewStyle = {
  width: 1,
  alignSelf: 'stretch',
  backgroundColor: '#e5e7eb',
};

const defaultIntegratedInputStyle: TextStyle = {
  flex: 1,
  minHeight: 52,
  paddingHorizontal: 14,
  paddingVertical: 12,
  borderWidth: 0,
  borderRadius: 0,
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  backgroundColor: 'transparent',
  color: '#111827',
  fontSize: 15,
};

export const NativePhoneInput: React.FC<Props> = ({
  descriptor: d,
  extra,
  registerFocusable,
  ...props
}) => {
  const {
    styles,
    hideLabel,
    rootProps,
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

  const { style: rootPropsStyle, ...rootPropsRest } = (rootProps ?? {}) as {
    style?: StyleProp<ViewStyle>;
  } & Record<string, unknown>;
  const { style: labelPropsStyle, ...labelPropsRest } = (labelProps ?? {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;
  const { style: inputPropsStyle, ...inputPropsRest } = (inputProps ?? {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;
  const { style: searchInputPropsStyle, ...searchInputPropsRest } = (searchInputProps ??
    {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;
  const { style: hintPropsStyle, ...hintPropsRest } = (hintProps ?? {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;
  const { style: errorPropsStyle, ...errorPropsRest } = (errorProps ?? {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;

  const defaultCountry = getCountry(d._phoneDefaultCountry) ?? COUNTRIES_SORTED[0];

  const normalizedValue = useMemo(
    () => parseStoredPhoneValue(props.value, defaultCountry.code),
    [defaultCountry.code, props.value],
  );

  const [selectedCountryCode, setSelectedCountryCode] = useState(
    normalizedValue?.country ?? defaultCountry.code,
  );
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (normalizedValue?.country && normalizedValue.country !== selectedCountryCode) {
      setSelectedCountryCode(normalizedValue.country);
    }
  }, [normalizedValue?.country, selectedCountryCode]);

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

    if (!preferred.length || !rest.length) {
      return results;
    }

    return [...preferred, { separator: true, key: 'preferred-separator' }, ...rest];
  }, [d._phonePreferred, search]);

  const handleNationalChange = useCallback(
    (input: string) => {
      if (!input.trim()) {
        emitValue(null);
        return;
      }

      const nextValue = buildPhoneValue(currentCountry, input);
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
      emitValue(null);
    },
    [emitValue],
  );

  const id = extra?.id ?? d._ui?.id ?? props.name;
  const displayValue = normalizedValue?.national ?? '';
  const placeholder =
    currentCountry.exampleNational ||
    props.placeholder ||
    d._placeholder ||
    'Enter phone number';
  const hasError = Boolean(props.error);
  const countryLayout = extra?.countryLayout ?? d._phoneCountryLayout;
  const integrated = countryLayout === 'integrated';
  const highlightOnError = shouldHighlightOnError(
    extra?.highlightOnError,
    d._ui?.highlightOnError,
  );
  const controlErrorStyle = defaultErrorChromeStyle(hasError, highlightOnError);
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
      preferredCountries: d._phonePreferred,
      search,
      searchable: d._phoneSearchable,
      showDialCode: d._phoneShowDialCode,
      showFlag: d._phoneShowFlag,
      storeE164: d._phoneStoreE164,
      value: props.value,
    }),
    [
      currentCountry,
      d._phonePreferred,
      d._phoneSearchable,
      d._phoneShowDialCode,
      d._phoneShowFlag,
      d._phoneStoreE164,
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
      {d._phoneShowFlag && (
        <Text style={sx(styles?.countryFlag)}>{currentCountry.flag}</Text>
      )}
      {d._phoneShowDialCode && (
        <Text style={sx(styles?.countryDial)}>+{currentCountry.dial}</Text>
      )}
      <Text style={sx(styles?.chevron)}>▾</Text>
    </>
  );
  const resolvedCountryButtonContent =
    renderCountryButtonContent?.({
      ...renderContext,
      defaultContent: defaultCountryButtonContent,
    }) ?? defaultCountryButtonContent;

  const requiredMark = renderRequiredMark?.() ?? (
    <Text style={sx(defaultRequiredMarkStyle(), styles?.requiredMark)}>*</Text>
  );

  return (
    <View
      style={sx(extra?.style as StyleProp<ViewStyle>, styles?.root, rootPropsStyle)}
      {...rootPropsRest}
    >
      {!hideLabel &&
        (renderLabel?.({
          id,
          label: props.label,
          required: Boolean(d._required),
          name: props.name,
        }) ?? (
          <Text
            style={sx(styles?.label, labelPropsStyle)}
            {...labelPropsRest}
          >
            {props.label}
            {d._required && requiredMark}
          </Text>
        ))}
      <View
        style={sx(
          integrated
            ? {
                ...defaultIntegratedRowStyle,
                borderColor: defaultBorderColor(hasError, highlightOnError, '#d1d5db'),
              }
            : defaultDetachedRowStyle,
          integrated ? controlErrorStyle : undefined,
          styles?.row,
        )}
      >
        <Pressable
          onPress={() => {
            if (!props.disabled) {
              setOpen(true);
              props.onFocus();
            }
          }}
          style={sx(
            defaultCountryButtonStyle,
            integrated ? defaultIntegratedCountryButtonStyle : undefined,
            styles?.countryButton,
          )}
          accessibilityRole="button"
          accessibilityLabel={resolvedCountryButtonAriaLabel}
        >
          {resolvedCountryButtonContent}
        </Pressable>

        {integrated ? (
          <View style={sx(defaultCountryDividerStyle, styles?.countryDivider)} />
        ) : null}

        <TextInput
          nativeID={id}
          ref={registerFocusable}
          testID={d._ui?.testID}
          value={displayValue}
          placeholder={placeholder}
          editable={!props.disabled}
          keyboardType="phone-pad"
          autoComplete="tel"
          onChangeText={handleNationalChange}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          style={sx(
            styles?.input,
            integrated ? defaultIntegratedInputStyle : controlErrorStyle,
            inputPropsStyle,
          )}
          {...(inputPropsRest as Partial<TextInputProps>)}
        />
      </View>

      {normalizedValue?.e164
        ? (renderE164?.({
            ...renderContext,
            defaultContent: (
              <Text style={sx(styles?.e164)}>
                {resolveText(e164Text, normalizedValue.e164, {
                  ...renderContext,
                  e164: normalizedValue.e164,
                })}
              </Text>
            ),
            e164: normalizedValue.e164,
          }) ?? (
            <Text style={sx(styles?.e164)}>
              {resolveText(e164Text, normalizedValue.e164, {
                ...renderContext,
                e164: normalizedValue.e164,
              })}
            </Text>
          ))
        : null}

      {props.error
        ? (renderError?.({ id, name: props.name, error: props.error }) ?? (
            <Text
              style={sx(defaultErrorTextStyle(true), styles?.error, errorPropsStyle)}
              {...errorPropsRest}
            >
              {props.error}
            </Text>
          ))
        : props.hint
          ? (renderHint?.({ id, name: props.name, hint: props.hint }) ?? (
              <Text
                style={sx(styles?.hint, hintPropsStyle)}
                {...hintPropsRest}
              >
                {props.hint}
              </Text>
            ))
          : null}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={sx(styles?.modalBackdrop)}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={sx(styles?.modalCard)}
            onPress={(event) => event.stopPropagation()}
          >
            {d._phoneSearchable && (
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={resolvedSearchPlaceholder}
                style={sx(styles?.searchInput, searchInputPropsStyle)}
                {...searchInputPropsRest}
              />
            )}

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => ('separator' in item ? item.key : item.code)}
              ListEmptyComponent={() => (
                <>
                  {renderEmptySearchContent?.({
                    ...renderContext,
                    defaultContent: (
                      <Text style={sx(styles?.emptyText)}>{resolvedEmptySearchText}</Text>
                    ),
                  }) ?? (
                    <Text style={sx(styles?.emptyText)}>{resolvedEmptySearchText}</Text>
                  )}
                </>
              )}
              renderItem={({ item }) => {
                if ('separator' in item) {
                  return <View style={sx(styles?.separator)} />;
                }

                const index = filteredCountries.findIndex(
                  (country) => !('separator' in country) && country.code === item.code,
                );
                const isSelected = item.code === currentCountry.code;
                const defaultCountryItemContent = (
                  <>
                    {d._phoneShowFlag && (
                      <Text style={sx(styles?.countryFlag)}>{item.flag}</Text>
                    )}
                    <Text style={sx(styles?.countryName)}>{item.name}</Text>
                    <Text style={sx(styles?.countryDial)}>+{item.dial}</Text>
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
                  <Pressable
                    onPress={() => selectCountry(item)}
                    style={sx(styles?.countryRow)}
                  >
                    {resolvedCountryItemContent}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

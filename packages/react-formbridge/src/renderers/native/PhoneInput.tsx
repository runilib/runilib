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
  NativePhoneFieldPropsOverrides,
} from '../../types';
import {
  defaultBorderColor,
  defaultErrorChromeStyle,
  defaultErrorTextStyle,
  defaultRequiredMarkStyle,
  type ResolvedNativeFieldProps,
  resolveNativeInputBehavior,
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
    fieldPropsFromClient?: ResolvedNativeFieldProps;
  };
  extra?: ExtraFieldProps<NativePhoneFieldPropsOverrides, 'native'>;
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
  backgroundColor: '#ffffff',
};

const defaultCountryButtonStyle: ViewStyle = {
  minHeight: 52,
  minWidth: 88,
  paddingHorizontal: 12,
  borderWidth: 1,
  borderColor: '#d1d5db',
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
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  backgroundColor: 'transparent',
  color: '#111827',
  fontSize: 15,
};

const defaultPhoneModalBackdropStyle: ViewStyle = {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  paddingHorizontal: 16,
  paddingVertical: 64,
};

const defaultPhoneModalCardStyle: ViewStyle = {
  backgroundColor: '#ffffff',
  borderRadius: 12,
  maxHeight: '100%',
  overflow: 'hidden',
  padding: 12,
  gap: 8,
};

const defaultPhoneSearchInputStyle: TextStyle = {
  minHeight: 44,
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderWidth: 1,
  borderColor: '#d1d5db',
  borderRadius: 8,
  backgroundColor: '#ffffff',
  color: '#111827',
  fontSize: 15,
};

const defaultPhoneCountryRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  paddingVertical: 12,
  paddingHorizontal: 8,
};

const defaultPhoneCountryFlagStyle: TextStyle = {
  fontSize: 20,
};

const defaultPhoneCountryNameStyle: TextStyle = {
  flex: 1,
  color: '#111827',
  fontSize: 15,
};

const defaultPhoneCountryDialStyle: TextStyle = {
  color: '#6b7280',
  fontSize: 14,
};

const defaultPhoneSeparatorStyle: ViewStyle = {
  height: 1,
  backgroundColor: '#e5e7eb',
  marginVertical: 4,
};

const defaultPhoneEmptyTextStyle: TextStyle = {
  paddingVertical: 16,
  paddingHorizontal: 8,
  color: '#6b7280',
  fontSize: 14,
  textAlign: 'center',
};

export const NativePhoneInput: React.FC<Props> = ({
  descriptor,
  extra,
  registerFocusable,
  ...props
}) => {
  const inputBehavior = resolveNativeInputBehavior(
    extra,
    descriptor.fieldPropsFromClient,
  );
  const isReadOnly = Boolean(inputBehavior.readOnly);
  const {
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

  const { style: wrapperPropsStyle, ...wrapperPropsRest } = (wrapperProps ?? {}) as {
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

  const defaultCountry =
    getCountry(descriptor._phoneDefaultCountry) ?? COUNTRIES_SORTED[0];

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

    if (!preferred.length || !rest.length) {
      return results;
    }

    return [...preferred, { separator: true, key: 'preferred-separator' }, ...rest];
  }, [descriptor._phonePreferred, search]);

  const handleNationalChange = useCallback(
    (input: string) => {
      if (isReadOnly) {
        return;
      }

      if (!input.trim()) {
        emitValue(null);
        return;
      }

      const nextValue = buildPhoneValue(currentCountry, input);
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
      emitValue(null);
    },
    [emitValue, isReadOnly],
  );

  const id = extra?.id ?? descriptor.fieldPropsFromClient?.id ?? props.name;
  const displayValue = normalizedValue?.national ?? '';
  const placeholder =
    currentCountry.exampleNational ||
    props.placeholder ||
    descriptor._placeholder ||
    'Enter phone number';
  const hasError = Boolean(props.error);
  const countryLayout = extra?.countryLayout ?? descriptor._phoneCountryLayout;
  const integrated = countryLayout === 'integrated';
  const highlightOnError = shouldHighlightOnError(
    extra?.highlightOnError,
    descriptor.fieldPropsFromClient?.highlightOnError,
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
      <Text style={sx(styles?.phoneE164)}>
        {resolveText(e164Text, normalizedValue.e164, {
          ...renderContext,
          e164: normalizedValue.e164,
        })}
      </Text>
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
        <Text style={sx(styles?.phoneCountryFlag)}>{currentCountry.flag}</Text>
      )}
      {descriptor._phoneShowDialCode && (
        <Text style={sx(styles?.phoneCountryDial)}>+{currentCountry.dial}</Text>
      )}
      <Text style={sx(styles?.phoneChevron)}>▾</Text>
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
      style={sx(extra?.style as StyleProp<ViewStyle>, styles?.wrapper, wrapperPropsStyle)}
      {...wrapperPropsRest}
    >
      {!hideLabel &&
        (renderLabel?.({
          id,
          label: props.label,
          required: Boolean(descriptor._required),
          name: props.name,
        }) ?? (
          <Text
            style={sx(styles?.label, labelPropsStyle)}
            {...labelPropsRest}
          >
            {props.label}
            {descriptor._required && requiredMark}
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
          styles?.phoneRow,
          integrated ? controlErrorStyle : undefined,
        )}
      >
        <Pressable
          onPress={() => {
            if (!props.disabled) {
              if (isReadOnly) {
                return;
              }

              setOpen(true);
              props.onFocus();
            }
          }}
          style={sx(
            defaultCountryButtonStyle,
            integrated ? defaultIntegratedCountryButtonStyle : undefined,
            styles?.phoneCountryButton,
          )}
          testID={inputBehavior.testID}
          accessibilityRole="button"
          accessibilityLabel={resolvedCountryButtonAriaLabel}
        >
          {resolvedCountryButtonContent}
        </Pressable>

        {integrated ? (
          <View style={sx(defaultCountryDividerStyle, styles?.phoneCountryDivider)} />
        ) : null}

        <TextInput
          nativeID={id}
          ref={registerFocusable}
          testID={inputBehavior.testID}
          value={displayValue}
          placeholder={placeholder}
          editable={!(props.disabled || isReadOnly)}
          keyboardType={
            (inputBehavior.keyboardType as TextInputProps['keyboardType']) ?? 'phone-pad'
          }
          autoComplete={
            (inputBehavior.autoComplete as TextInputProps['autoComplete']) ?? 'tel'
          }
          autoFocus={inputBehavior.autoFocus}
          onChangeText={handleNationalChange}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          style={sx(
            integrated ? defaultIntegratedInputStyle : undefined,
            styles?.phoneInput,
            inputPropsStyle,
            integrated ? undefined : controlErrorStyle,
          )}
          {...(inputPropsRest as Partial<TextInputProps>)}
        />
      </View>

      {resolvedE164Content}

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
          style={sx(defaultPhoneModalBackdropStyle, styles?.phoneModalBackdrop)}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={sx(defaultPhoneModalCardStyle, styles?.phoneModalCard)}
            onPress={(event) => event.stopPropagation()}
          >
            {descriptor._phoneSearchable && (
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={resolvedSearchPlaceholder}
                style={sx(
                  defaultPhoneSearchInputStyle,
                  styles?.phoneSearchInput,
                  searchInputPropsStyle,
                )}
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
                      <Text
                        style={sx(defaultPhoneEmptyTextStyle, styles?.phoneEmptyText)}
                      >
                        {resolvedEmptySearchText}
                      </Text>
                    ),
                  }) ?? (
                    <Text style={sx(defaultPhoneEmptyTextStyle, styles?.phoneEmptyText)}>
                      {resolvedEmptySearchText}
                    </Text>
                  )}
                </>
              )}
              renderItem={({ item }) => {
                if ('separator' in item) {
                  return (
                    <View
                      style={sx(defaultPhoneSeparatorStyle, styles?.phoneSeparator)}
                    />
                  );
                }

                const index = filteredCountries.findIndex(
                  (country) => !('separator' in country) && country.code === item.code,
                );
                const isSelected = item.code === currentCountry.code;
                const defaultCountryItemContent = (
                  <>
                    {descriptor._phoneShowFlag && (
                      <Text
                        style={sx(defaultPhoneCountryFlagStyle, styles?.phoneCountryFlag)}
                      >
                        {item.flag}
                      </Text>
                    )}
                    <Text
                      style={sx(defaultPhoneCountryNameStyle, styles?.phoneCountryName)}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={sx(defaultPhoneCountryDialStyle, styles?.phoneCountryDial)}
                    >
                      +{item.dial}
                    </Text>
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
                    style={sx(defaultPhoneCountryRowStyle, styles?.phoneCountryRow)}
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

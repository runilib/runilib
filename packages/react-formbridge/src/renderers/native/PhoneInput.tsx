import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  type StyleProp,
  StyleSheet,
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
import type { FieldRenderProps } from '../../types';
import {
  defaultBorderColor,
  type NativeBaseUiOverrides,
  type NativeExtraProps,
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

type NativePhoneUiOverrides = NativeBaseUiOverrides & {
  styles?: NativeBaseUiOverrides['styles'] &
    Partial<{
      row: StyleProp<ViewStyle>;
      countryButton: StyleProp<ViewStyle>;
      countryFlag: StyleProp<TextStyle>;
      countryDial: StyleProp<TextStyle>;
      chevron: StyleProp<TextStyle>;
      input: StyleProp<TextStyle>;
      e164: StyleProp<TextStyle>;
      modalBackdrop: StyleProp<ViewStyle>;
      modalCard: StyleProp<ViewStyle>;
      searchInput: StyleProp<TextStyle>;
      separator: StyleProp<ViewStyle>;
      countryRow: StyleProp<ViewStyle>;
      countryName: StyleProp<TextStyle>;
    }>;
};

interface Props extends FieldRenderProps<PhoneValue | string | null> {
  descriptor: PhoneDescriptor & {
    _ui?: ResolvedNativeFieldUi;
  };
  extra?: NativeExtraProps<NativePhoneUiOverrides>;
}

export const NativePhoneInput: React.FC<Props> = ({ descriptor: d, extra, ...props }) => {
  const ui = extra?.appearance;
  const highlightOnError = shouldHighlightOnError(
    ui?.highlightOnError,
    d._ui?.highlightOnError,
  );
  const { rootProps, labelProps, inputProps, hintProps, errorProps } = ui ?? {};
  const { style: rootPropsStyle, ...rootPropsRest } = (rootProps ?? {}) as {
    style?: StyleProp<ViewStyle>;
  } & Record<string, unknown>;
  const { style: labelPropsStyle, ...labelPropsRest } = (labelProps ?? {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;
  const { style: inputPropsStyle, ...inputPropsRest } = (inputProps ?? {}) as {
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

  const id = ui?.id ?? d._ui?.id ?? props.name;
  const displayValue = normalizedValue?.national ?? '';
  const hasError = Boolean(props.error);
  const placeholder =
    currentCountry.exampleNational ||
    props.placeholder ||
    d._placeholder ||
    'Enter phone number';

  return (
    <View
      style={sx(
        styles.root,
        extra?.style as StyleProp<ViewStyle>,
        ui?.styles?.root,
        rootPropsStyle,
      )}
      {...rootPropsRest}
    >
      {!ui?.hideLabel && (
        <Text
          style={sx(styles.label, ui?.styles?.label, labelPropsStyle)}
          {...labelPropsRest}
        >
          {props.label}
          {d._required && <Text style={styles.requiredMark}>*</Text>}
        </Text>
      )}

      <View style={sx(styles.row, ui?.styles?.row)}>
        <Pressable
          onPress={() => {
            if (!props.disabled) {
              setOpen(true);
              props.onFocus();
            }
          }}
          style={sx(
            styles.countryButton,
            {
              borderColor: defaultBorderColor(hasError, highlightOnError),
              opacity: props.disabled ? 0.6 : 1,
            },
            ui?.styles?.countryButton,
          )}
        >
          {d._phoneShowFlag && (
            <Text style={sx(styles.flag, ui?.styles?.countryFlag)}>
              {currentCountry.flag}
            </Text>
          )}
          {d._phoneShowDialCode && (
            <Text style={sx(styles.dial, ui?.styles?.countryDial)}>
              +{currentCountry.dial}
            </Text>
          )}
          <Text style={sx(styles.chevron, ui?.styles?.chevron)}>▾</Text>
        </Pressable>

        <TextInput
          nativeID={id}
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
            styles.input,
            {
              borderColor: defaultBorderColor(hasError, highlightOnError),
              backgroundColor: props.disabled ? '#f9fafb' : '#fff',
            },
            ui?.styles?.input,
            inputPropsStyle,
          )}
          {...(inputPropsRest as Partial<TextInputProps>)}
        />
      </View>

      {props.error ? (
        <Text
          style={sx(styles.error, ui?.styles?.error, errorPropsStyle)}
          {...errorPropsRest}
        >
          {props.error}
        </Text>
      ) : null}
      {!props.error && props.hint ? (
        <Text
          style={sx(styles.hint, ui?.styles?.hint, hintPropsStyle)}
          {...hintPropsRest}
        >
          {props.hint}
        </Text>
      ) : null}
      {normalizedValue?.e164 ? (
        <Text style={sx(styles.e164, ui?.styles?.e164)}>{normalizedValue.e164}</Text>
      ) : null}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={sx(styles.modalBackdrop, ui?.styles?.modalBackdrop)}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={sx(styles.modalCard, ui?.styles?.modalCard)}
            onPress={(event) => event.stopPropagation()}
          >
            {d._phoneSearchable && (
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search country…"
                style={sx(styles.searchInput, ui?.styles?.searchInput)}
              />
            )}

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => ('separator' in item ? item.key : item.code)}
              renderItem={({ item }) => {
                if ('separator' in item) {
                  return <View style={sx(styles.separator, ui?.styles?.separator)} />;
                }

                const selected = item.code === currentCountry.code;

                return (
                  <Pressable
                    onPress={() => selectCountry(item)}
                    style={sx(
                      styles.countryRow,
                      selected && styles.countryRowSelected,
                      ui?.styles?.countryRow,
                    )}
                  >
                    {d._phoneShowFlag && (
                      <Text style={sx(styles.countryFlag, ui?.styles?.countryFlag)}>
                        {item.flag}
                      </Text>
                    )}
                    <Text style={sx(styles.countryName, ui?.styles?.countryName)}>
                      {item.name}
                    </Text>
                    <Text style={sx(styles.countryDial, ui?.styles?.countryDial)}>
                      +{item.dial}
                    </Text>
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

const styles = StyleSheet.create({
  root: {
    gap: 6,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  requiredMark: {
    color: '#ef4444',
  },
  row: {
    flexDirection: 'row',
  },
  countryButton: {
    minWidth: 92,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flag: {
    fontSize: 18,
  },
  dial: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  chevron: {
    fontSize: 10,
    color: '#9ca3af',
  },
  input: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1.5,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
  },
  error: {
    fontSize: 12,
    color: '#ef4444',
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
  },
  e164: {
    fontSize: 11,
    color: '#9ca3af',
    fontVariant: ['tabular-nums'],
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    maxHeight: '70%',
    borderRadius: 14,
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  searchInput: {
    minHeight: 42,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 4,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  countryRowSelected: {
    backgroundColor: '#eff6ff',
  },
  countryFlag: {
    fontSize: 16,
  },
  countryName: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
  },
  countryDial: {
    fontSize: 12,
    color: '#9ca3af',
    fontVariant: ['tabular-nums'],
  },
});

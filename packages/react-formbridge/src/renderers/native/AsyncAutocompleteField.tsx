import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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

import { useAsyncOptions } from '../../hooks/shared/useAsyncOptions';
import type {
  ExtraFieldProps,
  FieldDescriptor,
  FocusableFieldHandle,
  NativeAsyncAutocompleteFieldPropsOverrides,
  SelectOption,
  SelectPickerRenderContext,
} from '../../types';
import {
  defaultErrorChromeStyle,
  defaultErrorTextStyle,
  defaultRequiredMarkStyle,
  type ResolvedNativeFieldProps,
  resolveNativeInputBehavior,
  shouldHighlightOnError,
  sx,
} from './shared';

type AsyncAutocompleteDescriptor = {
  _label: string;
  _placeholder?: string;
  _required: boolean;
  _hint?: string;
  _disabled: boolean;
  _searchable?: boolean;
  _options?: SelectOption[];
  _asyncOptions: NonNullable<FieldDescriptor<string>['_asyncOptions']>;
  fieldPropsFromClient?: ResolvedNativeFieldProps;
};

interface Props {
  descriptor: AsyncAutocompleteDescriptor;
  name: string;
  value: string;
  label: string;
  error: string | null;
  touched: boolean;
  dirty: boolean;
  validating: boolean;
  disabled: boolean;
  hint?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  dependencyValues: Record<string, unknown>;
  extra?: ExtraFieldProps<NativeAsyncAutocompleteFieldPropsOverrides, 'native'>;
  registerFocusable?: (target: FocusableFieldHandle | null) => void;
}

function ensureOptionsArray(value: unknown): SelectOption[] {
  return Array.isArray(value) ? value : [];
}

const defaultTriggerStyle: ViewStyle = {
  minHeight: 52,
  paddingHorizontal: 14,
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '#d1d5db',
  backgroundColor: '#ffffff',
};

const defaultTriggerValueStyle: TextStyle = {
  fontSize: 15,
  lineHeight: 20,
  color: '#0f172a',
  fontWeight: '600',
};

const defaultTriggerPlaceholderStyle: TextStyle = {
  fontSize: 15,
  lineHeight: 20,
  color: '#94a3b8',
};

const defaultModalBackdropStyle: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  padding: 20,
  backgroundColor: 'rgba(15, 23, 42, 0.42)',
};

const defaultModalCardStyle: ViewStyle = {
  width: '100%',
  maxHeight: '72%',
  // borderRadius: 22,
  backgroundColor: '#ffffff',
  paddingHorizontal: 16,
  paddingTop: 16,
  paddingBottom: 12,
  gap: 12,
};

const defaultSearchInputStyle: TextStyle = {
  minHeight: 52,
  // borderRadius: 16,
  paddingHorizontal: 14,
  borderWidth: 1,
  borderColor: '#d1d5db',
  backgroundColor: '#ffffff',
  color: '#0f172a',
  fontSize: 15,
};

const defaultLoadingRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  paddingHorizontal: 2,
};

const defaultLoadingTextStyle: TextStyle = {
  fontSize: 13,
  color: '#64748b',
};

const defaultOptionRowStyle: ViewStyle = {
  paddingHorizontal: 14,
  paddingVertical: 14,
  // borderRadius: 14,
  borderWidth: 1,
  borderColor: '#e2e8f0',
  backgroundColor: '#f8fafc',
};

const defaultOptionLabelStyle: TextStyle = {
  fontSize: 15,
  fontWeight: '600',
  color: '#0f172a',
};

const defaultEmptyTextStyle: TextStyle = {
  fontSize: 13,
  color: '#64748b',
  textAlign: 'center',
  paddingVertical: 10,
};

export const AsyncAutocompleteField: React.FC<Props> = ({
  descriptor,
  name,
  value,
  label,
  error,
  hint,
  onChange,
  onBlur,
  onFocus,
  dependencyValues,
  extra,
  registerFocusable,
}) => {
  const [open, setOpen] = useState(false);
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
    hintProps,
    errorProps,
    renderLabel,
    renderHint,
    renderError,
    renderRequiredMark,
    renderPicker,
  } = extra ?? {};

  const nativeRenderPicker =
    renderPicker ?? descriptor.fieldPropsFromClient?.renderPicker;

  const { style: wrapperPropsStyle, ...wrapperPropsRest } = (wrapperProps ?? {}) as {
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

  const id = extra?.id ?? descriptor.fieldPropsFromClient?.id ?? name;

  const asyncConfig = descriptor._asyncOptions;
  const {
    options: asyncOptions,
    loading,
    error: asyncError,
    search,
    setSearch,
    clearSearch,
  } = useAsyncOptions(asyncConfig, dependencyValues);

  const resolvedOptions = useMemo(
    () =>
      ensureOptionsArray(asyncOptions).length > 0
        ? ensureOptionsArray(asyncOptions)
        : ensureOptionsArray(descriptor._options),
    [asyncOptions, descriptor._options],
  );

  const selectedOption = useMemo(
    () => resolvedOptions.find((option) => option.value === value) ?? null,
    [resolvedOptions, value],
  );

  const closePicker = useCallback(() => {
    clearSearch();
    setOpen(false);
  }, [clearSearch]);

  const openPicker = useCallback(() => {
    if (descriptor._disabled || isReadOnly) {
      return;
    }

    setOpen(true);
    onFocus();
  }, [descriptor._disabled, isReadOnly, onFocus]);

  const selectOption = useCallback(
    (next: SelectOption | SelectOption['value']) => {
      const optionValue =
        typeof next === 'object' && next !== null && 'value' in next ? next.value : next;

      onChange(String(optionValue));
      closePicker();
      onBlur();
    },
    [closePicker, onBlur, onChange],
  );

  const pickerContext: SelectPickerRenderContext = {
    platform: 'native',
    fieldType: 'select',
    open,
    label,
    placeholder: descriptor._placeholder,
    required: Boolean(descriptor._required),
    disabled: Boolean(descriptor._disabled || isReadOnly),
    searchable: true,
    loading,
    error: asyncError ?? error,
    search,
    options: resolvedOptions,
    selectedOption,
    selectedValue: value ? (selectedOption?.value ?? value) : null,
    triggerLabel:
      selectedOption?.label ?? descriptor._placeholder ?? `Select ${String(label)}`,
    openPicker,
    closePicker,
    setSearch,
    clearSearch,
    selectOption,
  };

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

  const hasError = Boolean(error ?? asyncError);
  const highlightOnError = shouldHighlightOnError(
    extra?.highlightOnError,
    descriptor.fieldPropsFromClient?.highlightOnError,
  );
  const controlErrorStyle = defaultErrorChromeStyle(hasError, highlightOnError);
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
          label,
          required: Boolean(descriptor._required),
          name,
        }) ?? (
          <Text
            style={sx(styles?.label, labelPropsStyle)}
            {...labelPropsRest}
          >
            {label}
            {descriptor._required && requiredMark}
          </Text>
        ))}

      <Pressable
        onPress={openPicker}
        disabled={descriptor._disabled || isReadOnly}
        testID={inputBehavior.testID}
        style={sx(defaultTriggerStyle, styles?.autocompleteTrigger, controlErrorStyle)}
      >
        <Text
          style={sx(
            selectedOption ? defaultTriggerValueStyle : defaultTriggerPlaceholderStyle,
            selectedOption
              ? styles?.autocompleteTriggerValue
              : styles?.autocompleteTriggerPlaceholder,
          )}
        >
          {selectedOption?.label || descriptor._placeholder || `Select ${label}`}
        </Text>
      </Pressable>

      {error
        ? (renderError?.({ id, name, error }) ?? (
            <Text
              style={sx(defaultErrorTextStyle(true), styles?.error, errorPropsStyle)}
              {...errorPropsRest}
            >
              {error}
            </Text>
          ))
        : hint
          ? (renderHint?.({ id, name, hint }) ?? (
              <Text
                style={sx(styles?.hint, hintPropsStyle)}
                {...hintPropsRest}
              >
                {hint}
              </Text>
            ))
          : null}

      {nativeRenderPicker ? (
        nativeRenderPicker(pickerContext)
      ) : (
        <Modal
          visible={open}
          transparent
          animationType="fade"
          onRequestClose={closePicker}
        >
          <Pressable
            style={sx(defaultModalBackdropStyle, styles?.autocompleteModalBackdrop)}
            onPress={closePicker}
          >
            <Pressable
              style={sx(defaultModalCardStyle, styles?.autocompleteModalCard)}
              onPress={(event) => event.stopPropagation()}
            >
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={`Search ${label}...`}
                autoFocus
                style={sx(
                  defaultSearchInputStyle,
                  styles?.autocompleteSearchInput,
                  inputPropsStyle,
                )}
                autoComplete={
                  inputBehavior.autoComplete as TextInputProps['autoComplete']
                }
                keyboardType={
                  inputBehavior.keyboardType as TextInputProps['keyboardType']
                }
                secureTextEntry={inputBehavior.secureTextEntry}
                {...(inputPropsRest as Partial<TextInputProps>)}
              />

              {loading ? (
                <View style={sx(defaultLoadingRowStyle, styles?.autocompleteLoadingRow)}>
                  <ActivityIndicator size="small" />
                  <Text
                    style={sx(defaultLoadingTextStyle, styles?.autocompleteLoadingText)}
                  >
                    Loading...
                  </Text>
                </View>
              ) : null}

              {asyncError ? (
                <Text
                  style={sx(defaultErrorTextStyle(true), styles?.error, errorPropsStyle)}
                  {...errorPropsRest}
                >
                  {asyncError}
                </Text>
              ) : null}

              <FlatList
                data={resolvedOptions}
                keyExtractor={(item) => String(item.value)}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <Pressable
                    style={sx(defaultOptionRowStyle, styles?.autocompleteOptionRow)}
                    onPress={() => {
                      onChange(String(item.value));
                      clearSearch();
                      setOpen(false);
                      onBlur();
                    }}
                  >
                    <Text
                      style={sx(defaultOptionLabelStyle, styles?.autocompleteOptionLabel)}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                )}
                ListEmptyComponent={
                  loading === false ? (
                    <Text
                      style={sx(defaultEmptyTextStyle, styles?.autocompleteEmptyText)}
                    >
                      No results.
                    </Text>
                  ) : null
                }
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

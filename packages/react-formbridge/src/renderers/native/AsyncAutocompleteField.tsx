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
  NativeAsyncAutocompleteFieldUiOverrides,
  SelectOption,
  SelectPickerRenderContext,
} from '../../types';
import {
  defaultErrorChromeStyle,
  defaultErrorTextStyle,
  defaultRequiredMarkStyle,
  type ResolvedNativeFieldUi,
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
  _ui?: ResolvedNativeFieldUi;
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
  extra?: ExtraFieldProps<NativeAsyncAutocompleteFieldUiOverrides, 'native'>;
  registerFocusable?: (target: FocusableFieldHandle | null) => void;
}

function ensureOptionsArray(value: unknown): SelectOption[] {
  return Array.isArray(value) ? value : [];
}

export const AsyncAutocompleteField: React.FC<Props> = ({
  descriptor: d,
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

  const {
    styles,
    hideLabel,
    rootProps,
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

  const nativeRenderPicker = renderPicker ?? d._ui?.renderPicker;

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

  const id = extra?.id ?? d._ui?.id ?? name;

  const asyncConfig = d._asyncOptions;
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
        : ensureOptionsArray(d._options),
    [asyncOptions, d._options],
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
    if (d._disabled) {
      return;
    }

    setOpen(true);
    onFocus();
  }, [d._disabled, onFocus]);

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
    placeholder: d._placeholder,
    required: Boolean(d._required),
    disabled: Boolean(d._disabled),
    searchable: true,
    loading,
    error: asyncError ?? error,
    search,
    options: resolvedOptions,
    selectedOption,
    selectedValue: value ? (selectedOption?.value ?? value) : null,
    triggerLabel: selectedOption?.label ?? d._placeholder ?? `Select ${String(label)}`,
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
    d._ui?.highlightOnError,
  );
  const controlErrorStyle = defaultErrorChromeStyle(hasError, highlightOnError);
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
          label,
          required: Boolean(d._required),
          name,
        }) ?? (
          <Text
            style={sx(styles?.label, labelPropsStyle)}
            {...labelPropsRest}
          >
            {label}
            {d._required && requiredMark}
          </Text>
        ))}

      <Pressable
        onPress={openPicker}
        disabled={d._disabled}
        style={sx(controlErrorStyle, styles?.trigger)}
      >
        <Text
          style={sx(selectedOption ? styles?.triggerValue : styles?.triggerPlaceholder)}
        >
          {selectedOption?.label || d._placeholder || `Select ${label}`}
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
            style={sx(styles?.modalBackdrop)}
            onPress={closePicker}
          >
            <Pressable
              style={sx(styles?.modalCard)}
              onPress={(event) => event.stopPropagation()}
            >
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={`Search ${label}...`}
                autoFocus
                style={sx(styles?.searchInput, inputPropsStyle)}
                {...(inputPropsRest as Partial<TextInputProps>)}
              />

              {loading ? (
                <View style={sx(styles?.loadingRow)}>
                  <ActivityIndicator size="small" />
                  <Text style={sx(styles?.loadingText)}>Loading...</Text>
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
                    style={sx(styles?.optionRow)}
                    onPress={() => {
                      onChange(String(item.value));
                      clearSearch();
                      setOpen(false);
                      onBlur();
                    }}
                  >
                    <Text style={sx(styles?.optionLabel)}>{item.label}</Text>
                  </Pressable>
                )}
                ListEmptyComponent={
                  loading === false ? (
                    <Text style={sx(styles?.emptyText)}>No results.</Text>
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

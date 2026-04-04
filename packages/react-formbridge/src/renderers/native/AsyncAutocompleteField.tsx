import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
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

import { useAsyncOptions } from '../../hooks/shared/useAsyncOptions';
import type {
  FieldDescriptor,
  SelectOption,
  SelectPickerRenderContext,
} from '../../types';
import {
  type NativeBaseUiOverrides,
  type NativeExtraProps,
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

type NativeAsyncAutocompleteUiOverrides = NativeBaseUiOverrides & {
  styles?: NativeBaseUiOverrides['styles'] &
    Partial<{
      trigger: StyleProp<ViewStyle>;
      triggerValue: StyleProp<TextStyle>;
      triggerPlaceholder: StyleProp<TextStyle>;
      modalBackdrop: StyleProp<ViewStyle>;
      modalCard: StyleProp<ViewStyle>;
      searchInput: StyleProp<TextStyle>;
      loadingRow: StyleProp<ViewStyle>;
      loadingText: StyleProp<TextStyle>;
      optionRow: StyleProp<ViewStyle>;
      optionLabel: StyleProp<TextStyle>;
      emptyText: StyleProp<TextStyle>;
    }>;
};

interface Props {
  descriptor: AsyncAutocompleteDescriptor;
  name: string;
  value: string;
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
  extra?: NativeExtraProps<NativeAsyncAutocompleteUiOverrides>;
}

function ensureOptionsArray(value: unknown): SelectOption[] {
  return Array.isArray(value) ? value : [];
}

export const NativeAsyncAutocompleteField: React.FC<Props> = ({
  descriptor: d,
  value,
  error,
  onChange,
  onBlur,
  onFocus,
  dependencyValues,
  extra,
}) => {
  const [open, setOpen] = useState(false);
  const ui = extra?.ui;
  const renderPicker = ui?.renderPicker ?? d._ui?.renderPicker;
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

  const closePicker = () => {
    clearSearch();
    setOpen(false);
  };

  const openPicker = () => {
    if (d._disabled) {
      return;
    }

    setOpen(true);
    onFocus();
  };

  const selectOption = (next: SelectOption | SelectOption['value']) => {
    const optionValue =
      typeof next === 'object' && next !== null && 'value' in next ? next.value : next;

    onChange(String(optionValue));
    closePicker();
    onBlur();
  };

  const pickerContext: SelectPickerRenderContext = {
    platform: 'native',
    fieldType: 'select',
    open,
    label: d._label,
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
    triggerLabel: selectedOption?.label ?? d._placeholder ?? `Select ${String(d._label)}`,
    openPicker,
    closePicker,
    setSearch,
    clearSearch,
    selectOption,
  };

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
      <Text
        style={sx(styles.label, ui?.styles?.label, labelPropsStyle)}
        {...labelPropsRest}
      >
        {d._label}
        {d._required && <Text style={styles.required}>*</Text>}
      </Text>

      <Pressable
        onPress={openPicker}
        style={sx(
          styles.trigger,
          error && highlightOnError && styles.triggerError,
          d._disabled && styles.triggerDisabled,
          ui?.styles?.trigger,
        )}
      >
        <Text
          style={sx(
            selectedOption ? styles.triggerValue : styles.triggerPlaceholder,
            selectedOption ? ui?.styles?.triggerValue : ui?.styles?.triggerPlaceholder,
          )}
        >
          {selectedOption?.label || d._placeholder || `Select ${d._label}`}
        </Text>
      </Pressable>

      {error ? (
        <Text
          style={sx(styles.error, ui?.styles?.error, errorPropsStyle)}
          {...errorPropsRest}
        >
          {error}
        </Text>
      ) : null}
      {!error && d._hint ? (
        <Text
          style={sx(styles.hint, ui?.styles?.hint, hintPropsStyle)}
          {...hintPropsRest}
        >
          {d._hint}
        </Text>
      ) : null}

      {renderPicker ? (
        renderPicker(pickerContext)
      ) : (
        <Modal
          visible={open}
          transparent
          animationType="fade"
          onRequestClose={closePicker}
        >
          <Pressable
            style={sx(styles.modalBackdrop, ui?.styles?.modalBackdrop)}
            onPress={closePicker}
          >
            <Pressable
              style={sx(styles.modalCard, ui?.styles?.modalCard)}
              onPress={(event) => event.stopPropagation()}
            >
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={`Search ${d._label}...`}
                autoFocus
                style={sx(styles.searchInput, ui?.styles?.searchInput, inputPropsStyle)}
                {...(inputPropsRest as Partial<TextInputProps>)}
              />

              {loading ? (
                <View style={sx(styles.loadingRow, ui?.styles?.loadingRow)}>
                  <ActivityIndicator size="small" />
                  <Text style={sx(styles.loadingText, ui?.styles?.loadingText)}>
                    Loading…
                  </Text>
                </View>
              ) : null}

              {asyncError ? (
                <Text
                  style={sx(styles.error, ui?.styles?.error, errorPropsStyle)}
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
                    style={sx(
                      styles.optionRow,
                      item.value === value && styles.optionRowSelected,
                      ui?.styles?.optionRow,
                    )}
                    onPress={() => {
                      onChange(String(item.value));
                      clearSearch();
                      setOpen(false);
                      onBlur();
                    }}
                  >
                    <Text style={sx(styles.optionLabel, ui?.styles?.optionLabel)}>
                      {item.label}
                    </Text>
                  </Pressable>
                )}
                ListEmptyComponent={
                  loading === false ? (
                    <Text style={sx(styles.emptyText, ui?.styles?.emptyText)}>
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
  required: {
    color: '#ef4444',
  },
  trigger: {
    minHeight: 44,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  triggerError: {
    borderColor: '#ef4444',
  },
  triggerDisabled: {
    opacity: 0.6,
  },
  triggerValue: {
    fontSize: 14,
    color: '#111827',
  },
  triggerPlaceholder: {
    fontSize: 14,
    color: '#9ca3af',
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
  },
  error: {
    fontSize: 12,
    color: '#ef4444',
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
    padding: 12,
    gap: 8,
  },
  searchInput: {
    minHeight: 44,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  loadingText: {
    color: '#6b7280',
  },
  optionRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  optionRowSelected: {
    backgroundColor: '#eff6ff',
  },
  optionLabel: {
    fontSize: 14,
    color: '#374151',
  },
  emptyText: {
    paddingVertical: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

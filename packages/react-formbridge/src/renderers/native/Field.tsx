import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  type StyleProp,
  Switch,
  Text,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import { getOtpCharsetPattern } from '../../core/field-descriptors/otp/OtpFieldBuilder';
import type {
  ExtraFieldProps,
  FieldDescriptor,
  FieldRenderProps,
  FocusableFieldHandle,
  NativeFieldPropsOverrides,
  SelectOption,
  SelectPickerRenderContext,
} from '../../types';
import {
  defaultCheckboxBoxStyle,
  defaultCheckboxRowStyle,
  defaultInputStyle,
  defaultOptionCheckStyle,
  defaultOptionHeaderStyle,
  defaultOptionLabelStyle,
  defaultOptionListContentStyle,
  defaultOptionModalBackdropStyle,
  defaultOptionModalCardStyle,
  defaultOptionRowStyle,
  defaultOptionTitleStyle,
  defaultOptionTriggerLabelStyle,
  defaultOptionTriggerStyle,
  defaultSwitchRowStyle,
  defaultTextareaStyle,
} from './default-styles';
import {
  defaultErrorChromeStyle,
  defaultErrorTextStyle,
  defaultRequiredMarkStyle,
  type NativeTextFieldDescriptorWebLike,
  resolveNativeInputBehavior,
  shouldHighlightOnError,
  sx,
} from './shared';

interface Props extends FieldRenderProps<unknown> {
  descriptor: FieldDescriptor<unknown> & NativeTextFieldDescriptorWebLike;
  extra?: ExtraFieldProps<NativeFieldPropsOverrides, 'native'>;
  registerFocusable?: (target: FocusableFieldHandle | null) => void;
}

function getStringValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

function getSelectedLabel(options: SelectOption[] | undefined, value: unknown): string {
  if (!options?.length) return '';
  const found = options.find((option) => option.value === value);
  return found?.label ?? '';
}

const defaultOtpContainerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'stretch',
  gap: 8,
};

const defaultOtpInputStyle: TextStyle = {
  width: 56,
  minHeight: 56,
  paddingHorizontal: 0,
  borderWidth: 1,
  borderColor: '#d1d5db',
  // borderRadius: 14,
  backgroundColor: '#ffffff',
  color: '#0f172a',
  textAlign: 'center',
  fontSize: 18,
  fontWeight: '600',
};

const defaultOtpSeparatorStyle: TextStyle = {
  alignSelf: 'center',
  minWidth: 12,
  color: '#94a3b8',
  fontSize: 22,
  fontWeight: '600',
  textAlign: 'center',
};

const OptionPicker = ({
  visible,
  title,
  options,
  selectedValue,
  onClose,
  onSelect,
  fieldPropsOverrides,
}: {
  visible: boolean;
  title: string;
  options: SelectOption[];
  selectedValue: unknown;
  onClose: () => void;
  onSelect: (value: unknown) => void;
  fieldPropsOverrides?: NativeFieldPropsOverrides;
}) => {
  const hasTitle = title.trim().length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={sx(
          defaultOptionModalBackdropStyle,
          fieldPropsOverrides?.styles?.selectModalBackdrop,
        )}
        onPress={onClose}
      >
        <Pressable
          style={sx(
            defaultOptionModalCardStyle,
            fieldPropsOverrides?.styles?.selectModalCard,
          )}
          onPress={(event) => event.stopPropagation()}
        >
          {hasTitle ? (
            <View style={defaultOptionHeaderStyle}>
              <Text style={defaultOptionTitleStyle}>{title}</Text>
            </View>
          ) : null}

          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ flexGrow: 0 }}
            contentContainerStyle={defaultOptionListContentStyle}
            showsVerticalScrollIndicator={false}
          >
            {options.map((option) => {
              const selected = option.value === selectedValue;

              return (
                <Pressable
                  key={String(option.value)}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  style={sx(
                    defaultOptionRowStyle,
                    fieldPropsOverrides?.styles?.selectOptionRow,
                  )}
                >
                  <Text
                    style={sx(
                      defaultOptionLabelStyle,
                      fieldPropsOverrides?.styles?.selectOptionLabel,
                    )}
                  >
                    {option.label}
                  </Text>
                  {selected ? <Text style={defaultOptionCheckStyle}>✓</Text> : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export const NativeField: React.FC<Props> = ({
  descriptor,
  extra,
  registerFocusable,
  ...p
}) => {
  const native = descriptor.fieldPropsFromClient ?? {};
  const inputBehavior = resolveNativeInputBehavior(extra, native);
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

  const id = extra?.id ?? native.id ?? p.name;
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const hasError = Boolean(p.error);
  const highlightOnError = shouldHighlightOnError(
    extra?.highlightOnError,
    native.highlightOnError,
  );
  const controlErrorStyle = defaultErrorChromeStyle(hasError, highlightOnError);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const otpRefs = useRef<Array<TextInput | null>>([]);
  const pickerRenderer = renderPicker ?? native.renderPicker;

  const selectOptions = descriptor._options ?? [];
  const selectedOption = useMemo(
    () =>
      selectOptions.find((option) => String(option.value) === String(p.value)) ?? null,
    [p.value, selectOptions],
  );
  const filteredOptions = useMemo(() => {
    const query = pickerSearch.trim().toLowerCase();

    if (!query) {
      return selectOptions;
    }

    return selectOptions.filter((option) => option.label.toLowerCase().includes(query));
  }, [pickerSearch, selectOptions]);

  const clearPickerSearch = useCallback(() => {
    setPickerSearch('');
  }, []);

  const closePicker = useCallback(() => {
    setPickerOpen(false);
    clearPickerSearch();
  }, [clearPickerSearch]);

  const openPicker = useCallback(() => {
    if (p.disabled || isReadOnly) return;

    setPickerOpen(true);
    p.onFocus();
  }, [isReadOnly, p.disabled, p.onFocus]);

  const selectPickerOption = useCallback(
    (next: SelectOption | SelectOption['value']) => {
      const value =
        typeof next === 'object' && next !== null && 'value' in next ? next.value : next;

      p.onChange(value);
      closePicker();
      p.onBlur();
    },
    [closePicker, p.onBlur, p.onChange],
  );

  const pickerContext: SelectPickerRenderContext = {
    platform: 'native',
    fieldType: descriptor._type === 'radio' ? 'radio' : 'select',
    open: pickerOpen,
    label: p.label,
    placeholder: p.placeholder,
    required: Boolean(descriptor._required),
    disabled: p.disabled || isReadOnly,
    searchable: Boolean(descriptor._searchable),
    loading: false,
    error: null,
    search: pickerSearch,
    options: filteredOptions,
    selectedOption,
    selectedValue:
      p.value === null || p.value === undefined || p.value === ''
        ? null
        : (p.value as SelectOption['value']),
    triggerLabel: selectedOption?.label ?? p.placeholder ?? `Select ${String(p.label)}`,
    openPicker,
    closePicker,
    setSearch: setPickerSearch,
    clearSearch: clearPickerSearch,
    selectOption: selectPickerOption,
  };

  useEffect(() => {
    if (
      (descriptor._type !== 'select' && descriptor._type !== 'radio') ||
      !registerFocusable
    ) {
      return;
    }

    registerFocusable({
      focus: openPicker,
      blur: closePicker,
    });

    return () => {
      registerFocusable(null);
    };
  }, [closePicker, descriptor._type, openPicker, registerFocusable]);

  const requiredMark = renderRequiredMark?.() ?? (
    <Text style={sx(defaultRequiredMarkStyle(), styles?.requiredMark)}>*</Text>
  );
  const labelText = typeof p.label === 'string' ? p.label : undefined;
  const helperText = p.error ?? p.hint ?? undefined;
  const useLinkedLabel = !hideLabel && !renderLabel && descriptor._type !== 'checkbox';

  const commonAccessibilityProps = {
    accessibilityLabel: labelText,
    accessibilityLabelledBy: useLinkedLabel ? labelId : undefined,
    accessibilityHint: helperText,
    accessibilityState: {
      disabled: Boolean(p.disabled),
      ...(hasError ? { invalid: true } : {}),
    },
  } as const;

  const renderLabelNode = () => {
    if (hideLabel) return null;

    if (renderLabel) {
      return renderLabel({
        id,
        label: p.label,
        required: Boolean(descriptor._required),
        name: p.name,
      });
    }

    if (descriptor._type === 'checkbox' || descriptor._type === 'switch') {
      return null;
    }

    return (
      <Text
        nativeID={labelId}
        style={sx(styles?.label, labelPropsStyle)}
        {...labelPropsRest}
      >
        {p.label}
        {!!(descriptor._required && p.label) && requiredMark}
      </Text>
    );
  };

  const renderMeta = () => {
    if (p.error) {
      return (
        renderError?.({ id, name: p.name, error: p.error }) ?? (
          <Text
            nativeID={errorId}
            accessibilityLiveRegion="polite"
            style={sx(defaultErrorTextStyle(true), styles?.error, errorPropsStyle)}
            {...errorPropsRest}
          >
            {p.error}
          </Text>
        )
      );
    }

    if (p.hint) {
      return (
        renderHint?.({ id, name: p.name, hint: p.hint }) ?? (
          <Text
            nativeID={hintId}
            style={sx(styles?.hint, hintPropsStyle)}
            {...hintPropsRest}
          >
            {p.hint}
          </Text>
        )
      );
    }

    return null;
  };

  const commonInputProps: Omit<TextInputProps, 'value' | 'onChangeText'> = {
    editable: !(p.disabled || isReadOnly),
    autoFocus: inputBehavior.autoFocus,
    autoComplete: inputBehavior.autoComplete as TextInputProps['autoComplete'],
    keyboardType: inputBehavior.keyboardType as TextInputProps['keyboardType'],
    secureTextEntry: inputBehavior.secureTextEntry,
    onBlur: p.onBlur,
    onFocus: p.onFocus,
    testID: inputBehavior.testID,
    ...commonAccessibilityProps,
    ...(inputPropsRest as Partial<TextInputProps>),
  };

  const renderInput = () => {
    switch (descriptor._type) {
      case 'textarea':
        return (
          <TextInput
            nativeID={id}
            ref={registerFocusable}
            value={getStringValue(p.value)}
            placeholder={p.placeholder}
            multiline
            textAlignVertical="top"
            style={sx(
              defaultTextareaStyle,
              styles?.textInput,
              inputPropsStyle,
              controlErrorStyle,
            )}
            onChangeText={(value) => p.onChange(value)}
            {...commonInputProps}
          />
        );

      case 'checkbox':
        return (
          <Pressable
            onPress={() => {
              if (!p.disabled && !isReadOnly) p.onChange(!p.value);
            }}
            style={sx(defaultCheckboxRowStyle, styles?.checkboxRow)}
            accessibilityRole="checkbox"
            accessibilityLabel={labelText}
            accessibilityHint={helperText}
            testID={inputBehavior.testID}
            accessibilityState={{
              checked: Boolean(p.value),
              disabled: Boolean(p.disabled || isReadOnly),
              ...(hasError ? { invalid: true } : {}),
            }}
          >
            <View
              style={sx(defaultCheckboxBoxStyle, styles?.checkboxBox, controlErrorStyle)}
            />
            <Text
              nativeID={labelId}
              style={sx(styles?.checkboxLabel)}
            >
              {p.label}
              {descriptor._required && requiredMark}
            </Text>
          </Pressable>
        );

      case 'switch':
        return (
          <View style={sx(defaultSwitchRowStyle, styles?.switchRow)}>
            <Switch
              value={Boolean(p.value)}
              onValueChange={(value) => {
                if (isReadOnly) {
                  return;
                }

                p.onChange(value);
              }}
              disabled={p.disabled || isReadOnly}
              accessibilityLabel={labelText}
              accessibilityHint={helperText}
              accessibilityState={{
                checked: Boolean(p.value),
                disabled: Boolean(p.disabled || isReadOnly),
                ...(hasError ? { invalid: true } : {}),
              }}
            />
            <Text
              nativeID={labelId}
              style={sx(styles?.switchLabel)}
            >
              {p.label}
              {descriptor._required && requiredMark}
            </Text>
          </View>
        );

      case 'select':
      case 'radio':
        return (
          <>
            <Pressable
              onPress={openPicker}
              style={sx(
                defaultOptionTriggerStyle,
                styles?.selectTrigger,
                controlErrorStyle,
              )}
              testID={inputBehavior.testID}
              accessibilityRole={descriptor._type === 'radio' ? 'radiogroup' : 'button'}
              accessibilityLabel={labelText}
              accessibilityLabelledBy={useLinkedLabel ? labelId : undefined}
              accessibilityHint={helperText}
              accessibilityState={{
                disabled: Boolean(p.disabled || isReadOnly),
                expanded: pickerOpen,
                ...(hasError ? { invalid: true } : {}),
              }}
            >
              <Text
                style={sx(defaultOptionTriggerLabelStyle, styles?.selectTriggerLabel)}
              >
                {getSelectedLabel(descriptor._options, p.value) ||
                  p.placeholder ||
                  `Select ${p.label}`}
              </Text>
            </Pressable>

            {pickerRenderer ? (
              pickerRenderer(pickerContext)
            ) : (
              <OptionPicker
                visible={pickerOpen}
                title={String(p.label)}
                options={descriptor._options ?? []}
                selectedValue={p.value}
                onClose={closePicker}
                onSelect={(value) => p.onChange(value)}
                fieldPropsOverrides={extra}
              />
            )}
          </>
        );
      case 'otp': {
        const groups =
          descriptor._otpGroups && descriptor._otpGroups.length > 0
            ? descriptor._otpGroups
            : [descriptor._otpLength ?? 6];
        const separator = descriptor._otpSeparator ?? '-';
        const maskChar = descriptor._otpMaskChar;
        const charsetPattern = descriptor._otpCharset
          ? getOtpCharsetPattern(descriptor._otpCharset).single
          : null;
        const otpKeyboardType =
          (inputBehavior.keyboardType as TextInputProps['keyboardType']) ??
          (descriptor._otpCharset && descriptor._otpCharset !== 'digits'
            ? 'default'
            : 'number-pad');
        const length = groups.reduce((sum, size) => sum + size, 0);
        const chars = getStringValue(p.value).split('');

        const cells: ReactNode[] = [];
        let cellIndex = 0;

        groups.forEach((size, groupIndex) => {
          for (let i = 0; i < size; i++) {
            const index = cellIndex;
            const rawChar = chars[index] ?? '';
            const displayChar = maskChar && rawChar ? maskChar : rawChar;

            cells.push(
              <TextInput
                key={`${id}-otp-${index}`}
                ref={(node) => {
                  otpRefs.current[index] = node;
                  if (index === 0) {
                    registerFocusable?.(node);
                  }
                }}
                value={displayChar}
                maxLength={1}
                keyboardType={otpKeyboardType}
                textAlign="center"
                style={sx(
                  defaultOtpInputStyle,
                  controlErrorStyle,
                  styles?.otpInput,
                  inputPropsStyle,
                )}
                editable={!(p.disabled || isReadOnly)}
                autoComplete={
                  inputBehavior.autoComplete as TextInputProps['autoComplete']
                }
                autoFocus={index === 0 ? inputBehavior.autoFocus : undefined}
                secureTextEntry={inputBehavior.secureTextEntry}
                testID={index === 0 ? inputBehavior.testID : undefined}
                onChangeText={(char) => {
                  if (isReadOnly) {
                    return;
                  }

                  const typed = char.slice(-1);

                  if (
                    typed &&
                    typed !== maskChar &&
                    charsetPattern &&
                    !charsetPattern.test(typed)
                  ) {
                    return;
                  }

                  const next = [...chars];
                  next[index] = typed === maskChar ? (chars[index] ?? '') : typed;
                  p.onChange(next.join(''));

                  if (typed && index < length - 1) {
                    otpRefs.current[index + 1]?.focus();
                  }
                }}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace' && !chars[index] && index > 0) {
                    otpRefs.current[index - 1]?.focus();
                  }
                }}
                onBlur={p.onBlur}
                onFocus={p.onFocus}
              />,
            );
            cellIndex++;
          }

          if (groupIndex < groups.length - 1) {
            cells.push(
              <Text
                key={`${id}-otp-sep-after-${cellIndex}`}
                style={sx(defaultOtpSeparatorStyle, styles?.otpSeparator)}
              >
                {separator}
              </Text>,
            );
          }
        });

        return (
          <View style={sx(defaultOtpContainerStyle, styles?.otpContainer)}>{cells}</View>
        );
      }

      case 'number':
        return (
          <TextInput
            nativeID={id}
            ref={registerFocusable}
            value={getStringValue(p.value)}
            placeholder={p.placeholder}
            style={sx(
              defaultInputStyle,
              styles?.textInput,
              inputPropsStyle,
              controlErrorStyle,
            )}
            keyboardType={
              (inputBehavior.keyboardType as TextInputProps['keyboardType']) ?? 'numeric'
            }
            onChangeText={(value) => {
              p.onChange(value === '' ? '' : Number(value));
            }}
            {...commonInputProps}
          />
        );

      case 'date':
        return (
          <TextInput
            nativeID={id}
            ref={registerFocusable}
            value={getStringValue(p.value)}
            placeholder={p.placeholder ?? 'YYYY-MM-DD'}
            style={sx(
              defaultInputStyle,
              styles?.textInput,
              inputPropsStyle,
              controlErrorStyle,
            )}
            onChangeText={(value) => p.onChange(value)}
            {...commonInputProps}
          />
        );

      default:
        return (
          <TextInput
            nativeID={id}
            ref={registerFocusable}
            value={getStringValue(p.value)}
            placeholder={p.placeholder}
            style={sx(
              defaultInputStyle,
              styles?.textInput,
              inputPropsStyle,
              controlErrorStyle,
            )}
            onChangeText={(value) => p.onChange(value)}
            autoCapitalize={descriptor._type === 'email' ? 'none' : 'sentences'}
            keyboardType={
              descriptor._type === 'email'
                ? 'email-address'
                : descriptor._type === 'tel'
                  ? 'phone-pad'
                  : descriptor._type === 'url'
                    ? 'url'
                    : commonInputProps.keyboardType
            }
            secureTextEntry={
              descriptor._type === 'password'
                ? (inputBehavior.secureTextEntry ?? true)
                : commonInputProps.secureTextEntry
            }
            {...commonInputProps}
          />
        );
    }
  };

  return (
    <View
      style={sx(extra?.style as StyleProp<ViewStyle>, styles?.wrapper, wrapperPropsStyle)}
      {...wrapperPropsRest}
    >
      {renderLabelNode()}
      {renderInput()}
      {renderMeta()}
    </View>
  );
};

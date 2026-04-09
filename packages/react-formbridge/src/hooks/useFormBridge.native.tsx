import React, { useCallback, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  type StyleProp,
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';

import { isFileDescriptor } from '../core/field-builders/file/FileField';
import { isMaskedDescriptor } from '../core/field-builders/mask/MaskedFieldBuilder';
import { isStrengthDescriptor } from '../core/field-builders/password/PasswordWithStrength';
import type { PhoneValue } from '../core/field-builders/phone/countries';
import { isPhoneDescriptor } from '../core/field-builders/phone/PhoneFieldBuilder';
import { AsyncAutocompleteField } from '../renderers/native/AsyncAutocompleteField';
import { NativeField } from '../renderers/native/Field';
import { NativeFileField } from '../renderers/native/FileField';
import { NativeMaskedInput } from '../renderers/native/MaskedInput';
import { NativePasswordStrength } from '../renderers/native/PasswordStrength';
import { NativePhoneInput } from '../renderers/native/PhoneInput';
import type {
  FieldComponents,
  FieldController,
  FieldErrorProps,
  FieldLabelProps,
  FieldRenderProps,
  FieldRenderState,
  FocusableFieldHandle,
  FormComponent,
  FormSchema,
  SchemaValues,
  SubmitButtonProps,
  UseFormBridgeReturn,
  UseFormOptions,
} from '../types';
import {
  mergeFieldStyleProps,
  mergeNativeFormUi,
  mergeNativeSubmitUi,
  resolveNativeFieldConfig,
} from './shared/ui-utils';
import { useFormBridgeCore } from './shared/useFormBridge';

type NativeSubmitExtraProps = {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  indicatorColor?: string;
};

export function useFormBridge<const S extends FormSchema>(
  schema: S,
  options: UseFormOptions<S, 'native'> = {},
): UseFormBridgeReturn<S, 'native'> {
  const core = useFormBridgeCore(schema, options);

  const {
    descriptors,
    stateRef,
    visibility,
    isLoadingDraft,
    hasDraft,
    clearDraft,
    saveDraftNow,
    submitConfigRef,
    handleChange,
    handleBlur,
    handleSubmit,
    rerender,
    setRuntimeState,
    defaultValues,
    validate,
    trackFieldFocus,
  } = core;

  const globalStylesRef = useRef(options.globalStyles);
  globalStylesRef.current = options.globalStyles;

  const descriptorsRef = useRef(descriptors);
  descriptorsRef.current = descriptors;

  const visibilityRef = useRef(visibility);
  visibilityRef.current = visibility;

  const focusableRegistryRef = useRef<Record<string, FocusableFieldHandle | null>>({});

  const registerFocusable = useCallback(
    (name: string, target: FocusableFieldHandle | null) => {
      if (target) {
        focusableRegistryRef.current[name] = target;
        return;
      }

      delete focusableRegistryRef.current[name];
    },
    [],
  );

  const focusField = useCallback(
    (name: string) => {
      const target = focusableRegistryRef.current[name];

      if (target?.focus) {
        target.focus();
        return;
      }

      trackFieldFocus(name);
    },
    [trackFieldFocus],
  );

  const blurField = useCallback(
    (name: string) => {
      const target = focusableRegistryRef.current[name];

      if (target?.blur) {
        target.blur();
        return;
      }

      void handleBlur(name);
    },
    [handleBlur],
  );

  const setValue = useCallback(
    <K extends keyof S>(name: K, value: SchemaValues<S>[K]) => {
      void handleChange(name as string, value);
    },
    [handleChange],
  );

  const getValue = useCallback(
    <K extends keyof S>(name: K): SchemaValues<S>[K] =>
      (stateRef.current.values as Record<string, unknown>)[
        name as string
      ] as SchemaValues<S>[K],
    [stateRef],
  );

  const getValues = useCallback((): SchemaValues<S> => {
    return { ...stateRef.current.values };
  }, [stateRef]);

  const reset = useCallback(
    (values?: Partial<SchemaValues<S>>) => {
      const nextValues = values
        ? ({ ...defaultValues, ...values } as SchemaValues<S>)
        : { ...defaultValues };

      stateRef.current = {
        values: nextValues,
        errors: {},
        touched: {},
        dirty: {},
        status: 'idle',
        isValid: true,
        isDirty: false,
        isSubmitting: false,
        isSuccess: false,
        isError: false,
        submitCount: 0,
        submitError: null,
      };

      rerender();
    },
    [defaultValues, rerender, stateRef],
  );

  const setError = useCallback(
    (name: keyof S, message: string) => {
      setRuntimeState((current) => ({
        ...current,
        errors: {
          ...current.errors,
          [name]: message,
        },
        isValid: false,
      }));
    },
    [setRuntimeState],
  );

  const clearErrors = useCallback(
    (name?: keyof S | Array<keyof S>) => {
      if (!name) {
        setRuntimeState((current) => ({
          ...current,
          errors: {},
          isValid: true,
        }));
        return;
      }

      const nextErrors = {
        ...stateRef.current.errors,
      };

      (Array.isArray(name) ? name : [name]).forEach((fieldName) => {
        delete nextErrors[fieldName];
      });

      setRuntimeState((current) => ({
        ...current,
        errors: nextErrors,
        isValid: Object.keys(nextErrors).length === 0,
      }));
    },
    [setRuntimeState, stateRef],
  );

  const watch = useCallback(
    <K extends keyof S>(name: K): SchemaValues<S>[K] =>
      (stateRef.current.values as Record<string, unknown>)[
        name as string
      ] as SchemaValues<S>[K],
    [stateRef],
  );

  const watchAll = useCallback(() => ({ ...stateRef.current.values }), [stateRef]);

  const submit = useCallback(async () => {
    await handleSubmit();
  }, [handleSubmit]);

  const fieldController = useCallback(
    <K extends keyof S & string>(name: K): FieldController<S, K> => {
      const descriptor = descriptorsRef.current[name];

      if (!descriptor) {
        throw new Error(`Unknown field controller requested for "${name}".`);
      }

      const state = stateRef.current;
      const rawValue = (state.values as Record<string, unknown>)[name];
      const value =
        rawValue ??
        descriptor._defaultValue ??
        (descriptor._type === 'checkbox' || descriptor._type === 'switch' ? false : '');
      const rawError = (state.errors as Record<string, string | undefined>)[name] ?? null;
      const touched = Boolean((state.touched as Record<string, boolean>)[name]);
      const dirty = Boolean((state.dirty as Record<string, boolean>)[name]);
      const runtime = visibilityRef.current[name] ?? {
        visible: true,
        required: false,
        disabled: false,
      };
      const effectiveDescriptor = {
        ...descriptor,
        _required: descriptor._required || runtime.required,
        _disabled: descriptor._disabled || runtime.disabled,
      };
      const showError = Boolean(rawError) && (touched || state.submitCount > 0);

      const onChange = (nextValue: SchemaValues<S>[K]) => {
        void handleChange(name, nextValue);
      };
      const onBlur = () => {
        void handleBlur(name);
      };
      const onFocus = () => {
        trackFieldFocus(name);
      };

      const renderState: FieldRenderState<SchemaValues<S>[K]> = {
        name,
        value: value as SchemaValues<S>[K],
        label: effectiveDescriptor._label ?? '',
        placeholder: effectiveDescriptor._placeholder,
        allValues: state.values as Record<string, unknown>,
        error: showError ? rawError : null,
        touched,
        dirty,
        validating: state.status === 'validating',
        disabled: Boolean(effectiveDescriptor._disabled),
        required: Boolean(effectiveDescriptor._required),
        hint: effectiveDescriptor._hint,
        ...(effectiveDescriptor._type === 'select' ||
        effectiveDescriptor._type === 'radio'
          ? { options: effectiveDescriptor._options }
          : {}),
        ...(effectiveDescriptor._type === 'otp'
          ? { otpLength: effectiveDescriptor._otpLength }
          : {}),
      };

      return {
        ...renderState,
        name,
        visible: runtime.visible && !effectiveDescriptor._hidden,
        setValue: onChange,
        onChange,
        onBlur,
        onFocus,
        focus: () => {
          focusField(name);
        },
        blur: () => {
          blurField(name);
        },
        validate: () => validate(name),
        setError: (message: string) => {
          setError(name, message);
        },
        clearError: () => {
          clearErrors(name);
        },
        registerFocusable: (target: FocusableFieldHandle | null) => {
          registerFocusable(name, target);
        },
      } as FieldController<S, K>;
    },
    [
      blurField,
      clearErrors,
      focusField,
      handleBlur,
      handleChange,
      registerFocusable,
      setError,
      stateRef,
      trackFieldFocus,
      validate,
    ],
  );

  const Form = useMemo((): FormComponent<S, 'native'> => {
    const FormInner = ({
      children,
      onSubmit,
      onError,
      onSubmitError,
      style,
    }: Parameters<FormComponent<S, 'native'>>[0]) => {
      submitConfigRef.current = {
        onSubmit,
        onError,
        onSubmitError,
      };

      const mergedUi = mergeNativeFormUi(
        globalStylesRef.current?.(stateRef.current).form,
        style,
      );

      return React.createElement(
        View,
        {
          ...mergedUi.props,
          style: mergedUi.style as StyleProp<ViewStyle>,
        },
        children,
      );
    };

    FormInner.displayName = 'FormBridgeForm';

    const Submit = ({
      children,
      style,
      loadingText,
      disabled,
      ...rest
    }: SubmitButtonProps<'native'> & NativeSubmitExtraProps) => {
      const { status } = stateRef.current;
      const loading = status === 'submitting' || status === 'validating';
      const mergedUi = mergeNativeSubmitUi(
        globalStylesRef.current?.(stateRef.current)?.submit,
        style,
        loadingText,
      );
      const label = loading
        ? (mergedUi.loadingText ?? 'Please wait…')
        : (children ?? 'Submit');

      return React.createElement(
        TouchableOpacity,
        {
          ...mergedUi.props,
          onPress: () => {
            void submit();
          },
          disabled: loading || disabled,
          style: [
            {
              minHeight: 44,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: loading || disabled ? '#c7d2fe' : '#6366f1',
              opacity: loading || disabled ? 0.8 : 1,
            },
            mergedUi.containerStyle as StyleProp<ViewStyle>,
            rest.containerStyle,
            mergedUi.style as StyleProp<ViewStyle>,
          ],
        },
        React.createElement(
          View,
          {
            style: {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            },
            ...mergedUi.contentProps,
          },
          loading
            ? React.createElement(ActivityIndicator, {
                size: 'small',
                color: mergedUi.indicatorColor ?? rest.indicatorColor ?? '#fff',
              })
            : null,
          React.createElement(
            Text,
            {
              style: [
                {
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: '600',
                },
                mergedUi.textStyle as StyleProp<TextStyle>,
                rest.textStyle,
              ],
            },
            label,
          ),
        ),
      );
    };

    Submit.displayName = 'FormBridgeSubmit';

    (FormInner as unknown as FormComponent<S, 'native'>).Submit =
      Submit as unknown as FormComponent<S, 'native'>['Submit'];

    return FormInner as unknown as FormComponent<S, 'native'>;
  }, [stateRef, submit, submitConfigRef]);

  const fields = useMemo((): FieldComponents<S, 'native'> => {
    const result = {} as FieldComponents<S, 'native'>;

    for (const name of Object.keys(descriptors) as Array<keyof S & string>) {
      type LocalFieldComponent = FieldComponents<S, 'native'>[typeof name];
      type LocalFieldProps = Parameters<LocalFieldComponent>[0];

      const Field: LocalFieldComponent = (props?: LocalFieldProps) => {
        const descriptor = descriptorsRef.current[name];

        if (!descriptor) {
          return null;
        }

        const mergedProps = mergeFieldStyleProps(
          'native',
          globalStylesRef.current?.(stateRef.current)?.field,
          props,
        );
        const state = stateRef.current;
        const rawValue = (state.values as Record<string, unknown>)[name];

        const fallbackValue =
          descriptor._defaultValue ??
          (descriptor._type === 'checkbox' || descriptor._type === 'switch' ? false : '');

        const value = rawValue ?? fallbackValue;

        const error = (state.errors as Record<string, string | undefined>)[name] ?? null;
        const touched = Boolean((state.touched as Record<string, boolean>)[name]);
        const dirty = Boolean((state.dirty as Record<string, boolean>)[name]);

        const runtime = visibilityRef.current[name] ?? {
          visible: true,
          required: false,
          disabled: false,
        };

        const showError = Boolean(error) && (touched || state.submitCount > 0);

        const effectiveDescriptor = {
          ...descriptor,
          _ui: resolveNativeFieldConfig(descriptor._behavior),
          ...(mergedProps && {
            _label: mergedProps.label ?? descriptor._label,
            _placeholder: mergedProps.placeholder ?? descriptor._placeholder,
            _hint: mergedProps.hint ?? descriptor._hint,
          }),
          _required: descriptor._required || runtime.required,
          _disabled: descriptor._disabled || runtime.disabled,
        };

        if (effectiveDescriptor._hidden || !runtime.visible) {
          return null;
        }

        const renderState: FieldRenderState<unknown> = {
          name,
          value,
          label: effectiveDescriptor._label ?? '',
          placeholder: effectiveDescriptor._placeholder,
          allValues: state.values as Record<string, unknown>,
          error: showError ? error : null,
          touched,
          dirty,
          validating: state.status === 'validating',
          disabled: effectiveDescriptor._disabled,
          required: effectiveDescriptor._required,
          hint: effectiveDescriptor._hint,
          ...(effectiveDescriptor._type === 'select' ||
          effectiveDescriptor._type === 'radio'
            ? { options: effectiveDescriptor._options }
            : {}),
          ...(effectiveDescriptor._type === 'otp'
            ? { otpLength: effectiveDescriptor._otpLength }
            : {}),
        };

        const commonProps: FieldRenderProps<unknown> = {
          ...renderState,
          onChange: (nextValue: unknown) => {
            void handleChange(name, nextValue);
          },
          onBlur: () => {
            void handleBlur(name);
          },
          onFocus: () => {
            trackFieldFocus(name);
          },
        };
        const registerFocusableForField = (target: FocusableFieldHandle | null) => {
          registerFocusable(name, target);
        };

        if (effectiveDescriptor._customRender) {
          return effectiveDescriptor._customRender({
            ...commonProps,
            value,
          }) as React.ReactElement;
        }

        if (isMaskedDescriptor(effectiveDescriptor)) {
          return (
            <NativeMaskedInput
              descriptor={effectiveDescriptor}
              {...commonProps}
              value={typeof value === 'string' ? value : ''}
              extra={mergedProps}
              registerFocusable={registerFocusableForField}
            />
          );
        }

        if (isFileDescriptor(effectiveDescriptor)) {
          return (
            <NativeFileField
              descriptor={
                effectiveDescriptor as React.ComponentProps<
                  typeof NativeFileField
                >['descriptor']
              }
              value={value as React.ComponentProps<typeof NativeFileField>['value']}
              error={showError ? error : null}
              label={effectiveDescriptor._label ?? name}
              hint={effectiveDescriptor._hint}
              name={name}
              onChange={(nextValue) => {
                void handleChange(name, nextValue);
              }}
              onBlur={() => {
                void handleBlur(name);
              }}
              extra={mergedProps}
            />
          );
        }

        if (
          effectiveDescriptor._type === 'password' &&
          isStrengthDescriptor(effectiveDescriptor)
        ) {
          return (
            <NativePasswordStrength
              strengthMeta={
                effectiveDescriptor as React.ComponentProps<
                  typeof NativePasswordStrength
                >['strengthMeta']
              }
              {...commonProps}
              value={typeof value === 'string' ? value : ''}
              extra={mergedProps}
              registerFocusable={registerFocusableForField}
            />
          );
        }

        if (isPhoneDescriptor(effectiveDescriptor)) {
          return (
            <NativePhoneInput
              descriptor={effectiveDescriptor}
              {...commonProps}
              value={value as string | PhoneValue | null}
              onChange={(nextValue) => {
                void handleChange(name, nextValue);
              }}
              extra={mergedProps}
              registerFocusable={registerFocusableForField}
            />
          );
        }

        if (
          effectiveDescriptor._type === 'select' &&
          effectiveDescriptor._asyncOptions &&
          effectiveDescriptor._searchable
        ) {
          return (
            <AsyncAutocompleteField
              descriptor={
                {
                  ...effectiveDescriptor,
                  _asyncOptions: effectiveDescriptor._asyncOptions,
                } as React.ComponentProps<typeof AsyncAutocompleteField>['descriptor']
              }
              {...commonProps}
              value={typeof value === 'string' ? value : ''}
              dependencyValues={state.values as Record<string, unknown>}
              extra={mergedProps}
              registerFocusable={registerFocusableForField}
            />
          );
        }

        return (
          <NativeField
            descriptor={effectiveDescriptor}
            {...commonProps}
            value={value}
            extra={mergedProps}
            registerFocusable={registerFocusableForField}
          />
        );
      };

      (Field as React.FC).displayName = `FormBridgeField(${name})`;

      result[name] = Field;
    }

    return result;
  }, [
    descriptors,
    handleBlur,
    handleChange,
    registerFocusable,
    stateRef,
    trackFieldFocus,
  ]);

  const FieldError = useMemo(() => {
    const FieldErrorInner = (props: FieldErrorProps<S, 'native'>) => {
      const { name, render, style } = props;
      const state = stateRef.current;
      const error = (state.errors as Record<string, string | undefined>)[name] ?? null;
      const touched = Boolean((state.touched as Record<string, boolean>)[name]);
      const showError = Boolean(error) && (touched || state.submitCount > 0);

      if (!showError || !error) return null;

      if (render) {
        return render({ name, error }) as React.ReactElement;
      }

      return React.createElement(
        Text,
        {
          style: [
            { color: '#ef4444', fontSize: 12, marginTop: 4 },
            style as StyleProp<TextStyle>,
          ],
        },
        error,
      );
    };

    FieldErrorInner.displayName = 'FormBridgeFieldError';
    return FieldErrorInner;
  }, [stateRef]);

  const FieldLabel = useMemo(() => {
    const FieldLabelInner = (props: FieldLabelProps<S, 'native'>) => {
      const { name, children, render, renderRequiredMark, style } = props;
      const descriptor = descriptorsRef.current[name];
      const label = children ?? descriptor?._label ?? '';
      const required = Boolean(descriptor?._required);

      if (render) {
        return render({
          name,
          label: String(label),
          required,
          htmlFor: name,
        }) as React.ReactElement;
      }

      const requiredMark = required
        ? (renderRequiredMark?.() ??
          React.createElement(Text, { style: { color: '#ef4444' } }, ' *'))
        : null;

      return React.createElement(
        Text,
        {
          style: [
            { fontSize: 14, fontWeight: '500' as const, marginBottom: 4 },
            style as StyleProp<TextStyle>,
          ],
        },
        label,
        requiredMark,
      );
    };

    FieldLabelInner.displayName = 'FormBridgeLabel';
    return FieldLabelInner;
  }, []);

  return {
    Form,
    fields,
    FieldError,
    FieldLabel,
    fieldController,
    state: stateRef.current,
    visibility,
    isLoadingDraft,
    hasDraft,
    clearDraft,
    saveDraftNow,
    setValue,
    getValue,
    getValues,
    validate,
    reset,
    setError,
    clearErrors,
    watch,
    watchAll,
    submit,
  };
}

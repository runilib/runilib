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
import { NativeAsyncAutocompleteField } from '../renderers/native/AsyncAutocompleteField';
import { NativeField } from '../renderers/native/Field';
import { NativeFileField } from '../renderers/native/FileField';
import { NativeMaskedInput } from '../renderers/native/MaskedInput';
import { NativePasswordStrength } from '../renderers/native/PasswordStrength';
import { NativePhoneInput } from '../renderers/native/PhoneInput';
import type {
  ExtraFieldProps,
  FieldComponents,
  FormComponent,
  FormSchema,
  NativeFormUiOverrides,
  NativeSubmitUiOverrides,
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
} from './shared/appearance';
import { useFormBridgeCore } from './shared/useFormBridge.shared';

type NativeSubmitExtraProps = {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  indicatorColor?: string;
};

export function useFormBridge<const S extends FormSchema>(
  schema: S,
  options: UseFormOptions<S> = {},
): UseFormBridgeReturn<S> {
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

  const globalAppearanceRef = useRef(options.globalAppearance);
  globalAppearanceRef.current = options.globalAppearance;

  const descriptorsRef = useRef(descriptors);
  descriptorsRef.current = descriptors;

  const visibilityRef = useRef(visibility);
  visibilityRef.current = visibility;

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

  const Form = useMemo((): FormComponent<S> => {
    const FormInner = ({
      children,
      onSubmit,
      onError,
      onSubmitError,
      style,
    }: Parameters<FormComponent<S>>[0]) => {
      submitConfigRef.current = {
        onSubmit,
        onError,
        onSubmitError,
      };

      const mergedUi = mergeNativeFormUi(
        globalAppearanceRef.current?.form as NativeFormUiOverrides | undefined,
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
    }: SubmitButtonProps & NativeSubmitExtraProps) => {
      const { status } = stateRef.current;
      const loading = status === 'submitting' || status === 'validating';
      const mergedUi = mergeNativeSubmitUi(
        globalAppearanceRef.current?.submit as NativeSubmitUiOverrides | undefined,
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

    (FormInner as unknown as FormComponent<S>).Submit =
      Submit as unknown as FormComponent<S>['Submit'];

    return FormInner as unknown as FormComponent<S>;
  }, [stateRef, submit, submitConfigRef]);

  const fields = useMemo((): FieldComponents<S> => {
    const result = {} as FieldComponents<S>;

    for (const name of Object.keys(descriptors) as Array<keyof S & string>) {
      const FieldComponent = (props?: ExtraFieldProps) => {
        const descriptor = descriptorsRef.current[name];

        if (!descriptor) {
          return null;
        }

        const mergedProps = mergeFieldStyleProps(
          'native',
          globalAppearanceRef.current?.field,
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
          _ui: resolveNativeFieldConfig(descriptor._appearance),
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

        const commonProps = {
          name,
          label: effectiveDescriptor._label,
          placeholder: effectiveDescriptor._placeholder,
          allValues: state.values as Record<string, unknown>,
          error: showError ? error : null,
          touched,
          dirty,
          validating: state.status === 'validating',
          disabled: effectiveDescriptor._disabled,
          required: effectiveDescriptor._required,
          hint: effectiveDescriptor._hint,
          options: effectiveDescriptor._options,
          otpLength: effectiveDescriptor._otpLength,
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

        if (effectiveDescriptor._customRender) {
          return effectiveDescriptor._customRender({
            ...commonProps,
            value,
          }) as React.ReactElement;
        }

        if (isMaskedDescriptor(effectiveDescriptor)) {
          return (
            <NativeMaskedInput
              descriptor={
                effectiveDescriptor as React.ComponentProps<
                  typeof NativeMaskedInput
                >['descriptor']
              }
              {...commonProps}
              value={typeof value === 'string' ? value : ''}
              extra={
                mergedProps as React.ComponentProps<typeof NativeMaskedInput>['extra']
              }
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
              onChange={(nextValue) => {
                void handleChange(name, nextValue);
              }}
              onBlur={() => {
                void handleBlur(name);
              }}
              extra={mergedProps as React.ComponentProps<typeof NativeFileField>['extra']}
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
              extra={
                mergedProps as React.ComponentProps<
                  typeof NativePasswordStrength
                >['extra']
              }
            />
          );
        }

        if (isPhoneDescriptor(effectiveDescriptor)) {
          return (
            <NativePhoneInput
              descriptor={
                effectiveDescriptor as React.ComponentProps<
                  typeof NativePhoneInput
                >['descriptor']
              }
              {...commonProps}
              value={value as string | PhoneValue | null}
              onChange={(nextValue) => {
                void handleChange(name, nextValue);
              }}
              extra={
                mergedProps as React.ComponentProps<typeof NativePhoneInput>['extra']
              }
            />
          );
        }

        if (
          effectiveDescriptor._type === 'select' &&
          effectiveDescriptor._asyncOptions &&
          effectiveDescriptor._searchable
        ) {
          return (
            <NativeAsyncAutocompleteField
              descriptor={
                {
                  ...effectiveDescriptor,
                  _asyncOptions: effectiveDescriptor._asyncOptions,
                } as React.ComponentProps<
                  typeof NativeAsyncAutocompleteField
                >['descriptor']
              }
              {...commonProps}
              value={typeof value === 'string' ? value : ''}
              dependencyValues={state.values as Record<string, unknown>}
              extra={
                mergedProps as React.ComponentProps<
                  typeof NativeAsyncAutocompleteField
                >['extra']
              }
            />
          );
        }

        return (
          <NativeField
            descriptor={effectiveDescriptor}
            {...commonProps}
            value={value}
            extra={mergedProps as React.ComponentProps<typeof NativeField>['extra']}
          />
        );
      };

      FieldComponent.displayName = `FormBridgeField(${name})`;

      result[name] = FieldComponent as FieldComponents<S>[typeof name];
    }

    return result;
  }, [descriptors, handleBlur, handleChange, stateRef, trackFieldFocus]);

  return {
    Form,
    fields,
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

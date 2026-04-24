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

import { isFileDescriptor } from '../core/field-descriptors/file/FileFieldBuilder';
import { isMaskedDescriptor } from '../core/field-descriptors/mask/MaskedFieldBuilder';
import { isStrengthDescriptor } from '../core/field-descriptors/password/PasswordWithStrength';
import type { PhoneValue } from '../core/field-descriptors/phone/countries';
import { isPhoneDescriptor } from '../core/field-descriptors/phone/PhoneFieldBuilder';
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
  UseFormBridgeOptions,
  UseFormBridgeReturn,
} from '../types';
import { FormBridgeProvider } from './shared/form-context';
import { computeTransformedValues } from './shared/helpers';
import {
  mergeFieldStyleProps,
  mergeNativeFieldProps,
  mergeNativeFormProps,
  mergeNativeSubmitProps,
} from './shared/ui-utils';
import { useFormBridgeCore } from './shared/useFormBridgeCore';

type NativeSubmitExtraProps = {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  indicatorColor?: string;
};

function renderNativeSubmitLabel(
  label: React.ReactNode,
  textStyle: StyleProp<TextStyle>,
) {
  if (typeof label === 'string' || typeof label === 'number') {
    return React.createElement(
      Text,
      {
        style: [
          {
            color: '#fff',
            fontSize: 14,
            fontWeight: '600',
          },
          textStyle,
        ],
      },
      label,
    );
  }

  return label;
}

export function useFormBridge<const S extends FormSchema>(
  schema: S,
  options: UseFormBridgeOptions<S, 'native'> = {},
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
    registerFocusable,
    blurField,
    focusField,
  } = core;

  const globalDefaultsRef = useRef(options.globalDefaults);
  globalDefaultsRef.current = options.globalDefaults;

  const descriptorsRef = useRef(descriptors);
  descriptorsRef.current = descriptors;

  const apiRef = useRef<UseFormBridgeReturn<S, 'native'> | null>(null);

  const visibilityRef = useRef(visibility);
  visibilityRef.current = visibility;

  const schemaRef = useRef(schema);
  schemaRef.current = schema;

  const resolveglobalDefaults = useCallback(
    () =>
      globalDefaultsRef.current?.({
        state: stateRef.current,
        schema: schemaRef.current,
        platform: 'native',
      }),
    [stateRef],
  );

  const setValue = useCallback(
    <K extends keyof S>(name: K, value: SchemaValues<S>[K]) => {
      void handleChange(name as string, value);
    },
    [handleChange],
  );

  const getValue = useCallback(
    <K extends keyof S>(name: K): SchemaValues<S>[K] => {
      const raw = (stateRef.current.values as Record<string, unknown>)[name as string];
      const desc = descriptorsRef.current[name as string];
      return (
        desc?._outputTransform
          ? (desc._outputTransform as (v: unknown) => unknown)(raw)
          : raw
      ) as SchemaValues<S>[K];
    },
    [stateRef],
  );

  const getValues = useCallback((): SchemaValues<S> => {
    return computeTransformedValues(
      stateRef.current.values as Record<string, unknown>,
      descriptorsRef.current,
    ) as SchemaValues<S>;
  }, [stateRef]);

  const resetFields = useCallback(
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
        isSubmitSuccess: false,
        isSubmitError: false,
        submitCount: 0,
        formLevelError: null,
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
    <K extends keyof S>(name: K): SchemaValues<S>[K] => {
      const raw = (stateRef.current.values as Record<string, unknown>)[name as string];
      const desc = descriptorsRef.current[name as string];
      return (
        desc?._outputTransform
          ? (desc._outputTransform as (v: unknown) => unknown)(raw)
          : raw
      ) as SchemaValues<S>[K];
    },
    [stateRef],
  );

  const watchAll = useCallback(
    () =>
      computeTransformedValues(
        stateRef.current.values,
        descriptorsRef.current,
      ) as SchemaValues<S>,
    [stateRef],
  );

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
      const rawValue = state.values[name];
      const value =
        rawValue ??
        descriptor._defaultValue ??
        (descriptor._type === 'checkbox' || descriptor._type === 'switch' ? false : '');
      const rawError = state.errors[name] ?? null;
      const touched = Boolean(state.touched[name]);
      const dirty = Boolean(state.dirty[name]);
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
        defaultValue: effectiveDescriptor._defaultValue as string,
        label: effectiveDescriptor._label ?? '',
        placeholder: effectiveDescriptor._placeholder,
        allValues: state.values,
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
      ...nativeProps
    }: Parameters<FormComponent<S, 'native'>>[0]) => {
      submitConfigRef.current = {
        onSubmit,
        onError,
        onSubmitError,
      };

      const mergedProps = mergeNativeFormProps(resolveglobalDefaults()?.form, style);

      return React.createElement(
        FormBridgeProvider,
        {
          value: apiRef.current as UseFormBridgeReturn<S, 'native'>,
        },
        React.createElement(
          View,
          {
            ...mergedProps.props,
            ...nativeProps,
            style: mergedProps.style as StyleProp<ViewStyle>,
          },
          children,
        ),
      );
    };

    FormInner.displayName = 'FormBridgeForm';

    const Submit = ({
      children,
      style,
      loadingText,
      disabled,
      containerStyle,
      textStyle,
      indicatorColor,
      ...nativeProps
    }: SubmitButtonProps<'native'> & NativeSubmitExtraProps) => {
      const rest = { containerStyle, textStyle, indicatorColor };
      const { status } = stateRef.current;
      const loading = status === 'submitting' || status === 'validating';
      const mergedProps = mergeNativeSubmitProps(
        resolveglobalDefaults()?.submit,
        style,
        loadingText,
      );
      const label = loading
        ? (mergedProps.loadingText ?? 'Please wait…')
        : (children ?? 'Submit');

      return React.createElement(
        TouchableOpacity,
        {
          ...mergedProps.props,
          ...nativeProps,
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
            mergedProps.containerStyle as StyleProp<ViewStyle>,
            rest.containerStyle,
            mergedProps.style as StyleProp<ViewStyle>,
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
            ...mergedProps.contentProps,
          },
          loading
            ? React.createElement(ActivityIndicator, {
                size: 'small',
                color: mergedProps.indicatorColor ?? rest.indicatorColor ?? '#fff',
              })
            : null,
          renderNativeSubmitLabel(label, [
            mergedProps.textStyle as StyleProp<TextStyle>,
            rest.textStyle,
          ]),
        ),
      );
    };

    Submit.displayName = 'FormBridgeSubmit';

    (FormInner as unknown as FormComponent<S, 'native'>).Submit =
      Submit as unknown as FormComponent<S, 'native'>['Submit'];

    return FormInner as unknown as FormComponent<S, 'native'>;
  }, [stateRef, submit, submitConfigRef, resolveglobalDefaults]);

  const FormProvider = useMemo(
    () =>
      function FormProviderInner({ children }: { children: React.ReactNode }) {
        return React.createElement(
          FormBridgeProvider,
          {
            value: apiRef.current as UseFormBridgeReturn<S, 'native'>,
          },
          children,
        );
      },
    [],
  );

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

        const mergedFieldProps = mergeFieldStyleProps(
          'native',
          resolveglobalDefaults()?.field,
          props,
        );
        const state = stateRef.current;
        const rawValue = state.values[name];

        const fallbackValue =
          descriptor._defaultValue ??
          (descriptor._type === 'checkbox' || descriptor._type === 'switch' ? false : '');

        const value = rawValue ?? fallbackValue;

        const error = state.errors[name] ?? null;
        const touched = Boolean(state.touched[name]);
        const dirty = Boolean(state.dirty[name]);

        const runtime = visibilityRef.current[name] ?? {
          visible: true,
          required: false,
          disabled: false,
        };

        const showError = Boolean(error) && (touched || state.submitCount > 0);
        const mergedProps = mergeNativeFieldProps(undefined, mergedFieldProps);

        const effectiveDescriptor = {
          ...descriptor,
          fieldPropsFromClient: mergedProps,
          ...(mergedFieldProps && {
            _label: mergedFieldProps.label ?? descriptor._label,
            _placeholder: mergedFieldProps.placeholder ?? descriptor._placeholder,
            _hint: mergedFieldProps.hint ?? descriptor._hint,
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
          defaultValue: effectiveDescriptor._defaultValue as string,
          label: effectiveDescriptor._label ?? '',
          placeholder: effectiveDescriptor._placeholder,
          allValues: state.values,
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
              dependencyValues={state.values}
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
    resolveglobalDefaults,
  ]);

  const FieldError = useMemo(() => {
    const FieldErrorInner = (props: FieldErrorProps<S, 'native'>) => {
      const { name, render, style } = props;
      const state = stateRef.current;
      const error = state.errors[name] ?? null;
      const touched = Boolean(state.touched[name]);
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

  const api = {
    FormProvider,
    Form,
    fields,
    FieldError,
    FieldLabel,
    fieldController,
    state: {
      ...stateRef.current,
      values: computeTransformedValues(
        stateRef.current.values as Record<string, unknown>,
        descriptorsRef.current,
      ) as SchemaValues<S>,
    },
    visibility,
    persistanceHelpers: { isLoadingDraft, hasDraft, clearDraft, saveDraftNow },
    setValue,
    getValue,
    getValues,
    validate,
    resetFields,
    setError,
    clearErrors,
    watch,
    watchAll,
    submit,
  } as unknown as UseFormBridgeReturn<S, 'native'>;

  apiRef.current = api;

  return api;
}

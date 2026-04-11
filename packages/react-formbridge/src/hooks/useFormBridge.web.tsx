import React, { useCallback, useMemo, useRef } from 'react';

import { isFileDescriptor } from '../core/field-builders/file/FileField';
import { isMaskedDescriptor } from '../core/field-builders/mask/MaskedFieldBuilder';
import { isStrengthDescriptor } from '../core/field-builders/password/PasswordWithStrength';
import { isPhoneDescriptor } from '../core/field-builders/phone/PhoneFieldBuilder';
import { WEB_ERROR_COLOR } from '../renderers/web/shared';
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
import { FormBridgeProvider } from './shared/form-context';
import {
  mergeFieldStyleProps,
  mergeWebFieldProps,
  mergeWebFormProps,
  mergeWebSubmitProps,
} from './shared/ui-utils';
import { useFormBridgeCore } from './shared/useFormBridge';

export function useFormBridge<const S extends FormSchema>(
  schema: S,
  options: UseFormOptions<S, 'web'> = {},
): UseFormBridgeReturn<S, 'web'> {
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
    focusField,
    blurField,
  } = core;

  const globalStylesRef = useRef(options.globalStyles);
  globalStylesRef.current = options.globalStyles;

  const descriptorsRef = useRef(descriptors);
  descriptorsRef.current = descriptors;

  const apiRef = useRef<UseFormBridgeReturn<S, 'web'> | null>(null);

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

  const Form = useMemo((): FormComponent<S, 'web'> => {
    const FormInner = ({
      children,
      onSubmit,
      onError,
      onSubmitError,
      className,
      style,
    }: Parameters<FormComponent<S, 'web'>>[0]) => {
      submitConfigRef.current = {
        onSubmit,
        onError,
        onSubmitError,
      };

      const mergedUi = mergeWebFormProps(
        globalStylesRef.current?.(stateRef.current)?.form,
        className,
        style,
      );

      const onPress = (event?: { preventDefault?: () => void }) => {
        event?.preventDefault?.();
        void handleSubmit();
      };

      return React.createElement(
        FormBridgeProvider,
        {
          value: apiRef.current as UseFormBridgeReturn<S, 'web'>,
        },
        React.createElement(
          'form',
          {
            ...mergedUi.props,
            onSubmit: onPress,
            className: mergedUi.className,
            style: mergedUi.style,
            noValidate: true,
          },
          children,
        ),
      );
    };

    FormInner.displayName = 'FormBridgeForm';

    const Submit = ({
      children,
      className,
      style,
      loadingText,
      disabled,
    }: SubmitButtonProps<'web'>) => {
      const { status } = stateRef.current;
      const loading = status === 'submitting' || status === 'validating';
      const mergedUi = mergeWebSubmitProps(
        globalStylesRef.current?.(stateRef.current)?.submit,
        className,
        style,
        loadingText,
      );
      const label = loading
        ? (mergedUi.loadingText ?? 'Please wait…')
        : (children ?? 'Submit');

      return React.createElement(
        'button',
        {
          ...mergedUi.props,
          type: 'submit',
          className: mergedUi.className,
          style: mergedUi.style,
          disabled: loading || disabled,
        },
        label,
      );
    };

    Submit.displayName = 'FormBridgeSubmit';

    (FormInner as unknown as FormComponent<S, 'web'>).Submit = Submit;
    return FormInner as unknown as FormComponent<S, 'web'>;
  }, [handleSubmit, stateRef, submitConfigRef]);

  const FormProvider = useMemo(
    () =>
      function FormProviderInner({ children }: { children: React.ReactNode }) {
        return React.createElement(
          FormBridgeProvider,
          {
            value: apiRef.current as UseFormBridgeReturn<S, 'web'>,
          },
          children,
        );
      },
    [],
  );

  const fields = useMemo((): FieldComponents<S, 'web'> => {
    const result = {} as FieldComponents<S, 'web'>;

    for (const name of Object.keys(descriptors) as Array<keyof S & string>) {
      type LocalFieldComponent = FieldComponents<S, 'web'>[typeof name];
      type LocalFieldProps = Parameters<LocalFieldComponent>[0];

      const Field: LocalFieldComponent = (props?: LocalFieldProps) => {
        const descriptor = descriptorsRef.current[name];

        if (!descriptor) {
          return null;
        }

        const mergedProps = mergeFieldStyleProps(
          'web',
          globalStylesRef.current?.(stateRef.current)?.field,
          props,
        );
        const state = stateRef.current;
        const rawValue = (state.values as Record<string, unknown>)[name];
        const value =
          rawValue ??
          descriptor._defaultValue ??
          (descriptor._type === 'checkbox' || descriptor._type === 'switch' ? false : '');
        const error = (state.errors as Record<string, string | undefined>)[name] ?? null;
        const touched = Boolean((state.touched as Record<string, boolean>)[name]);
        const dirty = Boolean((state.dirty as Record<string, boolean>)[name]);

        const runtime = visibilityRef.current[name] ?? {
          visible: true,
          required: false,
          disabled: false,
        };

        const showError = Boolean(error) && (touched || state.submitCount > 0);
        const mergedClientProps = mergeWebFieldProps(undefined, mergedProps);

        const effectiveDescriptor = {
          ...descriptor,
          fieldPropsFromClient: mergedClientProps,
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

        const renderProps: FieldRenderProps<unknown> = {
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
          return effectiveDescriptor._customRender(renderProps) as React.ReactElement;
        }

        if (isMaskedDescriptor(effectiveDescriptor)) {
          const { MaskedInput } = require('../renderers/web/MaskedInput');
          return React.createElement(MaskedInput, {
            descriptor: effectiveDescriptor,
            ...renderProps,
            extra: mergedProps,
            registerFocusable: registerFocusableForField,
          });
        }

        if (isFileDescriptor(effectiveDescriptor)) {
          const { FileField } = require('../renderers/web/FileField');
          return React.createElement(FileField, {
            descriptor: effectiveDescriptor,
            ...renderProps,
            extra: mergedProps,
          });
        }

        if (
          effectiveDescriptor._type === 'password' &&
          isStrengthDescriptor(effectiveDescriptor)
        ) {
          const { PasswordStrength } = require('../renderers/web/PasswordStrength');
          return React.createElement(PasswordStrength, {
            strengthMeta: effectiveDescriptor,
            ...renderProps,
            extra: mergedProps,
            registerFocusable: registerFocusableForField,
          });
        }

        if (isPhoneDescriptor(effectiveDescriptor)) {
          const { PhoneInput } = require('../renderers/web/PhoneInput');
          return React.createElement(PhoneInput, {
            descriptor: effectiveDescriptor,
            ...renderProps,
            extra: mergedProps,
            registerFocusable: registerFocusableForField,
          });
        }

        if (
          effectiveDescriptor._type === 'select' &&
          effectiveDescriptor._asyncOptions &&
          effectiveDescriptor._searchable
        ) {
          const {
            AsyncAutocompleteField,
          } = require('../renderers/web/AsyncAutocompleteField');

          return React.createElement(AsyncAutocompleteField, {
            descriptor: effectiveDescriptor,
            ...renderProps,
            extra: mergedProps,
            registerFocusable: registerFocusableForField,
          });
        }

        const { Field } = require('../renderers/web/Field');
        return React.createElement(Field, {
          descriptor: effectiveDescriptor,
          ...renderProps,
          extra: mergedProps,
          registerFocusable: registerFocusableForField,
        });
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
    const FieldErrorInner = (props: FieldErrorProps<S, 'web'>) => {
      const { name, render, ...rest } = props;
      const state = stateRef.current;
      const error = (state.errors as Record<string, string | undefined>)[name] ?? null;
      const touched = Boolean((state.touched as Record<string, boolean>)[name]);
      const showError = Boolean(error) && (touched || state.submitCount > 0);

      if (!showError || !error) return null;

      if (render) {
        return render({ name, error }) as React.ReactElement;
      }

      return React.createElement(
        'span',
        {
          role: 'alert',
          'data-fb-slot': 'error',
          'data-fb-name': name,
          className: (rest as { className?: string }).className,
          style: {
            color: WEB_ERROR_COLOR,
            ...(rest as { style?: React.CSSProperties }).style,
          },
        },
        error,
      );
    };

    FieldErrorInner.displayName = 'FormBridgeFieldError';
    return FieldErrorInner;
  }, [stateRef]);

  const FieldLabel = useMemo(() => {
    const FieldLabelInner = (props: FieldLabelProps<S, 'web'>) => {
      const { name, children, render, renderRequiredMark, ...rest } = props;
      const descriptor = descriptorsRef.current[name];
      const label = children ?? descriptor?._label ?? '';
      const required = Boolean(descriptor?._required);
      const htmlFor = (rest as { htmlFor?: string }).htmlFor ?? name;

      if (render) {
        return render({
          name,
          label: String(label),
          required,
          htmlFor,
        }) as React.ReactElement;
      }

      const requiredMark = required
        ? (renderRequiredMark?.() ??
          React.createElement(
            'span',
            {
              'data-fb-slot': 'required-mark',
              style: { color: WEB_ERROR_COLOR },
            },
            '*',
          ))
        : null;

      return React.createElement(
        'label',
        {
          htmlFor,
          'data-fb-slot': 'label',
          'data-fb-name': name,
          className: (rest as { className?: string }).className,
          style: (rest as { style?: React.CSSProperties }).style,
        },
        label,
        requiredMark,
      );
    };

    FieldLabelInner.displayName = 'FormBridgeLabel';
    return FieldLabelInner;
  }, []);

  const api: UseFormBridgeReturn<S, 'web'> = {
    FormProvider,
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
    resetFields,
    setError,
    clearErrors,
    watch,
    watchAll,
    submit,
  };

  apiRef.current = api;

  return api;
}

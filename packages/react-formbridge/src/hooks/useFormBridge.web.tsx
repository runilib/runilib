import React, { useCallback, useMemo, useRef } from 'react';

import { isFileDescriptor } from '../core/field-builders/file/FileField';
import { isMaskedDescriptor } from '../core/field-builders/mask/MaskedFieldBuilder';
import { isStrengthDescriptor } from '../core/field-builders/password/PasswordWithStrength';
import { isPhoneDescriptor } from '../core/field-builders/phone/PhoneFieldBuilder';
import type {
  FieldComponents,
  FormComponent,
  FormSchema,
  SchemaValues,
  SubmitButtonProps,
  UseFormBridgeReturn,
  UseFormOptions,
} from '../types';
import {
  mergeFieldStyleProps,
  mergeWebFormUi,
  mergeWebSubmitUi,
  resolveWebFieldConfig,
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
  } = core;

  const globalUiRef = useRef(options.globalUi);
  globalUiRef.current = options.globalUi;

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

      const mergedUi = mergeWebFormUi(globalUiRef.current?.form, className, style);

      const onPress = (event?: { preventDefault?: () => void }) => {
        event?.preventDefault?.();
        void handleSubmit();
      };

      return React.createElement(
        'form',
        {
          ...mergedUi.props,
          onSubmit: onPress,
          className: mergedUi.className,
          style: mergedUi.style,
          noValidate: true,
        },
        children,
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
      const mergedUi = mergeWebSubmitUi(
        globalUiRef.current?.submit,
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

  const fields = useMemo((): FieldComponents<S, 'web'> => {
    const result = {} as FieldComponents<S, 'web'>;

    for (const name of Object.keys(descriptors) as Array<keyof S & string>) {
      type LocalFieldComponent = FieldComponents<S, 'web'>[typeof name];
      type LocalFieldProps = Parameters<LocalFieldComponent>[0];

      const FieldComponent: LocalFieldComponent = (props?: LocalFieldProps) => {
        const descriptor = descriptorsRef.current[name];

        if (!descriptor) {
          return null;
        }

        const mergedProps = mergeFieldStyleProps(
          'web',
          globalUiRef.current?.field,
          props,
        ) as LocalFieldProps;
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

        const effectiveDescriptor = {
          ...descriptor,
          _ui: resolveWebFieldConfig(descriptor._behavior),
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

        const renderProps = {
          name,
          value,
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
          return effectiveDescriptor._customRender(renderProps) as React.ReactElement;
        }

        if (isMaskedDescriptor(effectiveDescriptor)) {
          const { MaskedInput } = require('../renderers/web/MaskedInput');
          return React.createElement(MaskedInput, {
            descriptor: effectiveDescriptor,
            ...renderProps,
            extra: mergedProps,
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
          });
        }

        if (isPhoneDescriptor(effectiveDescriptor)) {
          const { PhoneInput } = require('../renderers/web/PhoneInput');
          return React.createElement(PhoneInput, {
            descriptor: effectiveDescriptor,
            ...renderProps,
            extra: mergedProps,
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
          });
        }

        const { Field } = require('../renderers/web/Field');
        return React.createElement(Field, {
          descriptor: effectiveDescriptor,
          ...renderProps,
          extra: mergedProps,
        });
      };

      (FieldComponent as React.FC).displayName = `FormBridgeField(${name})`;

      result[name] = FieldComponent;
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

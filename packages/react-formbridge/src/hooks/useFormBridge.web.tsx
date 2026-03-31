import React, { useCallback, useMemo, useRef } from 'react';

import { isFileDescriptor } from '../core/field-builders/file/FileField';
import { isMaskedDescriptor } from '../core/field-builders/mask/MaskedFieldBuilder';
import { isStrengthDescriptor } from '../core/field-builders/password/PasswordWithStrength';
import { isPhoneDescriptor } from '../core/field-builders/phone/PhoneFieldBuilder';
import type {
  ExtraFieldProps,
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
} from './shared/appearance';
import { useFormBridgeCore } from './shared/useFormBridge.shared';

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
      className,
      style,
    }: Parameters<FormComponent<S>>[0]) => {
      submitConfigRef.current = {
        onSubmit,
        onError,
        onSubmitError,
      };

      const mergedUi = mergeWebFormUi(
        globalAppearanceRef.current?.form,
        className,
        style,
      );

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
    }: SubmitButtonProps) => {
      const { status } = stateRef.current;
      const loading = status === 'submitting' || status === 'validating';
      const mergedUi = mergeWebSubmitUi(
        globalAppearanceRef.current?.submit,
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

    (FormInner as unknown as FormComponent<S>).Submit = Submit;
    return FormInner as unknown as FormComponent<S>;
  }, [handleSubmit, stateRef, submitConfigRef]);

  const fields = useMemo((): FieldComponents<S> => {
    const result = {} as FieldComponents<S>;

    for (const name of Object.keys(descriptors) as Array<keyof S & string>) {
      const FieldComponent = (props?: ExtraFieldProps) => {
        const descriptor = descriptorsRef.current[name];

        if (!descriptor) {
          return null;
        }

        const mergedProps = mergeFieldStyleProps(
          'web',
          globalAppearanceRef.current?.field,
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

        const effectiveDescriptor = {
          ...descriptor,
          _ui: resolveWebFieldConfig(descriptor._appearance),
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
          const { WebMaskedInput } = require('../renderers/web/WebMaskedInput');
          return React.createElement(WebMaskedInput, {
            descriptor: effectiveDescriptor,
            ...renderProps,
            extra: mergedProps,
          });
        }

        if (isFileDescriptor(effectiveDescriptor)) {
          const { WebFileField } = require('../renderers/web/WebFileField');
          return React.createElement(WebFileField, {
            descriptor: effectiveDescriptor,
            ...renderProps,
            extra: mergedProps,
          });
        }

        if (
          effectiveDescriptor._type === 'password' &&
          isStrengthDescriptor(effectiveDescriptor)
        ) {
          const { WebPasswordStrength } = require('../renderers/web/WebPasswordStrength');
          return React.createElement(WebPasswordStrength, {
            strengthMeta: effectiveDescriptor,
            ...renderProps,
            extra: mergedProps,
          });
        }

        if (isPhoneDescriptor(effectiveDescriptor)) {
          const { WebPhoneInput } = require('../renderers/web/WebPhoneInput');
          return React.createElement(WebPhoneInput, {
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
            WebAsyncAutocompleteField,
          } = require('../renderers/web/WebAsyncAutocompleteField');

          return React.createElement(WebAsyncAutocompleteField, {
            descriptor: effectiveDescriptor,
            ...renderProps,
            extra: mergedProps,
          });
        }

        const { WebField } = require('../renderers/web/WebField');
        return React.createElement(WebField, {
          descriptor: effectiveDescriptor,
          ...renderProps,
          extra: mergedProps,
        });
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

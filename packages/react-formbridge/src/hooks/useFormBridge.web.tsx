import React, { useCallback, useMemo, useRef } from 'react';

import { isMaskedDescriptor } from '../core/field-descriptors/mask/MaskedFieldBuilder';
import { applyMask, extractRaw } from '../core/field-descriptors/mask/masks';
import type {
  FieldController,
  FieldErrorProps,
  FieldLabelProps,
  FieldRenderState,
  FocusableFieldHandle,
  FormComponent,
  FormSchema,
  SchemaValues,
  UseFormBridgeOptions,
  UseFormBridgeReturn,
} from '../types';
import { FormBridgeProvider } from './shared/form-context';
import { computeTransformedValues } from './shared/helpers';
import { useFormBridgeCore } from './shared/useFormBridgeCore';

export function useFormBridge<const S extends FormSchema>(
  schema: S,
  options: UseFormBridgeOptions<S, 'web'> = {},
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

  const descriptorsRef = useRef(descriptors);
  descriptorsRef.current = descriptors;

  if (options.onSubmit) {
    submitConfigRef.current = {
      onSubmit: options.onSubmit,
      onError: options.onError,
      onSubmitError: options.onSubmitError,
    };
  }

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
        isSubmitError: false,
        isSubmitSuccess: false,
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

  const handleSubmitEvent = useCallback(
    async (event?: { preventDefault?: () => void }) => {
      event?.preventDefault?.();
      await handleSubmit();
    },
    [handleSubmit],
  );

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
        if (isMaskedDescriptor(effectiveDescriptor)) {
          let incoming = String(nextValue ?? '');
          if (effectiveDescriptor._maskUppercase) incoming = incoming.toUpperCase();
          if (effectiveDescriptor._maskLowercase) incoming = incoming.toLowerCase();

          const raw = extractRaw(
            incoming,
            effectiveDescriptor._maskPattern,
            effectiveDescriptor._maskTokens,
          );
          const masked = applyMask(raw, effectiveDescriptor._maskPattern, {
            showPlaceholder: effectiveDescriptor._maskShowPlaceholder,
            placeholder: effectiveDescriptor._maskPlaceholder,
            tokens: effectiveDescriptor._maskTokens,
          });

          void handleChange(
            name,
            (effectiveDescriptor._maskStoreRaw
              ? raw
              : masked.display) as SchemaValues<S>[K],
          );
          return;
        }

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
        defaultValue: effectiveDescriptor._defaultValue as string,
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

      const controllerExtras: Record<string, unknown> = {};

      if (isMaskedDescriptor(effectiveDescriptor)) {
        const normalize = (nextValue: string) => {
          let incoming = nextValue;
          if (effectiveDescriptor._maskUppercase) incoming = incoming.toUpperCase();
          if (effectiveDescriptor._maskLowercase) incoming = incoming.toLowerCase();

          const raw = extractRaw(
            incoming,
            effectiveDescriptor._maskPattern,
            effectiveDescriptor._maskTokens,
          );
          const masked = applyMask(raw, effectiveDescriptor._maskPattern, {
            showPlaceholder: effectiveDescriptor._maskShowPlaceholder,
            placeholder: effectiveDescriptor._maskPlaceholder,
            tokens: effectiveDescriptor._maskTokens,
          });

          return {
            raw,
            display: masked.display,
            complete: masked.complete,
            stored: effectiveDescriptor._maskStoreRaw ? raw : masked.display,
          };
        };
        const maskState = normalize(String(value ?? ''));

        controllerExtras.mask = {
          pattern: effectiveDescriptor._maskPattern,
          placeholder: effectiveDescriptor._maskPlaceholder,
          placeholderText: effectiveDescriptor._maskPlaceholderText,
          showPlaceholder: effectiveDescriptor._maskShowPlaceholder,
          storeRaw: effectiveDescriptor._maskStoreRaw,
        };
        controllerExtras.rawValue = maskState.raw;
        controllerExtras.displayValue = maskState.display;
        controllerExtras.maskComplete = maskState.complete;
        controllerExtras.format = (nextValue: string) => normalize(nextValue).display;
        controllerExtras.unmask = (nextValue: string) =>
          extractRaw(
            nextValue,
            effectiveDescriptor._maskPattern,
            effectiveDescriptor._maskTokens,
          );
      }

      if (effectiveDescriptor._type === 'otp') {
        const otpLength = effectiveDescriptor._otpLength ?? String(value ?? '').length;
        const digits = Array.from(String(value ?? '')).slice(0, otpLength);

        controllerExtras.otpLength = otpLength;
        controllerExtras.otpComplete = otpLength > 0 && digits.length === otpLength;
        controllerExtras.digits = digits;
        controllerExtras.setDigit = (index: number, nextDigit: string) => {
          const nextDigits = [...digits];
          nextDigits[index] = Array.from(nextDigit).at(-1) ?? '';
          void handleChange(name, nextDigits.join('').slice(0, otpLength));
        };
        controllerExtras.clear = () => {
          void handleChange(name, '');
        };
      }

      return {
        ...renderState,
        ...controllerExtras,
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
      } as unknown as FieldController<S, K>;
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
      ...nativeProps
    }: Parameters<FormComponent<S, 'web'>>[0]) => {
      submitConfigRef.current = {
        onSubmit,
        onError,
        onSubmitError,
      };

      return React.createElement(
        FormBridgeProvider,
        {
          value: apiRef.current as UseFormBridgeReturn<S, 'web'>,
        },
        React.createElement(
          'form',
          {
            ...nativeProps,
            onSubmit: handleSubmitEvent,
            className,
            style,
            noValidate: true,
          },
          children,
        ),
      );
    };

    FormInner.displayName = 'FormBridgeForm';
    return FormInner as unknown as FormComponent<S, 'web'>;
  }, [handleSubmitEvent, submitConfigRef]);

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
          style: { color: 'red', ...((rest as { style?: React.CSSProperties }).style) },
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

  const api = {
    FormProvider,
    Form,
    FieldError,
    FieldLabel,
    fieldController,
    // field: fieldController,
    state: {
      ...stateRef.current,
      values: computeTransformedValues(
        stateRef.current.values,
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
    handleSubmit: handleSubmitEvent,
  } as unknown as UseFormBridgeReturn<S, 'web'>;

  apiRef.current = api;

  return api;
}

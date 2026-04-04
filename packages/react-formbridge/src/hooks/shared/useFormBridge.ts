import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  evaluateAllConditions,
  type FieldConditions,
  type VisibilityMap,
} from '../../core/conditions/conditions';
import { usePersist } from '../../core/persist/draft';
import { extractDefaults, validateField } from '../../core/validators/engine';
import type {
  FieldDescriptor,
  FormSchema,
  FormState,
  SchemaValues,
  UseFormOptions,
} from '../../types';
import {
  applyCommittedTransforms,
  applyImmediateTransforms,
  areVisibilityMapsEqual,
  buildSchemaRuntime,
  emitErrorsDiffAnalytics,
  emitFieldErrorAnalytics,
  makeInitialState,
  shallowEqualErrors,
  shouldValidate,
} from './helpers';
import { useFormBridgeAnalytics } from './useFormAnalytics';

export function useFormBridgeCore<const S extends FormSchema>(
  schema: S,
  options: UseFormOptions<S> = {},
) {
  const {
    validateOn = 'onBlur',
    revalidateOn = 'onChange',
    resolver,
    persist: persistOpts,
  } = options;

  /**
   * Important:
   * schema is often passed inline, so its identity changes every render.
   * We build descriptors only once on mount to avoid infinite loops.
   *
   * If later you want dynamic schemas, you can support that explicitly
   * with a dedicated API or a reset/rebuild mechanism.
   */
  const schemaRuntimeRef = useRef<{
    descriptors: Record<string, FieldDescriptor<unknown>>;
    conditionsMap: Record<string, FieldConditions>;
  } | null>(null);

  const prevFormKeyRef = useRef(options.formKey);
  const didFormKeyChangeRef = useRef(false);

  schemaRuntimeRef.current ??= buildSchemaRuntime(schema);

  didFormKeyChangeRef.current = prevFormKeyRef.current !== options.formKey;

  if (didFormKeyChangeRef.current) {
    prevFormKeyRef.current = options.formKey;
    schemaRuntimeRef.current = buildSchemaRuntime(schema);
  }

  const { descriptors, conditionsMap } = schemaRuntimeRef.current;

  const defaultValues = useMemo(
    () => extractDefaults(descriptors) as SchemaValues<S>,
    [descriptors],
  );

  const stateRef = useRef<FormState<S>>(makeInitialState({ ...defaultValues }));
  const submitConfigRef = useRef<{
    onSubmit: (values: SchemaValues<S>) => void | Promise<void>;
    onError?: (errors: Partial<Record<keyof S, string>>) => void;
    onSubmitError?: (error: unknown) => string;
  } | null>(null);

  const debounceRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const hasHydratedDraftRef = useRef(false);

  const [, forceUpdate] = useState(0);

  const rerender = useCallback(() => {
    forceUpdate((count) => count + 1);
  }, []);

  const [visibility, setVisibility] = useState<VisibilityMap>(() =>
    evaluateAllConditions(
      conditionsMap,
      stateRef.current.values as Record<string, unknown>,
    ),
  );

  const prevVisibilityRef = useRef<VisibilityMap>(visibility);

  useEffect(() => {
    if (!didFormKeyChangeRef.current) {
      return;
    }

    const nextValues = {
      ...defaultValues,
      ...options.initialValues,
    };

    stateRef.current = makeInitialState(nextValues);

    const nextVisibility = evaluateAllConditions(
      conditionsMap,
      nextValues as Record<string, unknown>,
    );

    prevVisibilityRef.current = nextVisibility;
    setVisibility(nextVisibility);

    hasHydratedDraftRef.current = false;
    rerender();
  }, [options.initialValues, defaultValues, conditionsMap, rerender]);

  const getCurrentValues = useCallback(
    () => stateRef.current.values as Record<string, unknown>,
    [],
  );

  const analytics = useFormBridgeAnalytics(options.analytics, getCurrentValues);

  const analyticsRef = useRef(analytics);
  analyticsRef.current = analytics;

  const {
    isLoading: isLoadingDraft,
    hasDraft,
    draftValues,
    clearDraft,
    saveDraftNow,
    save: persistSave,
  } = usePersist(persistOpts, getCurrentValues);

  const setRuntimeState = useCallback(
    (updater: (current: FormState<S>) => FormState<S>, shouldRerender = true) => {
      stateRef.current = updater(stateRef.current);

      if (shouldRerender) rerender();
    },
    [rerender],
  );

  const updateVisibility = useCallback(
    (newValues: Record<string, unknown>) => {
      if (Object.keys(conditionsMap).length === 0) return;

      const newVis = evaluateAllConditions(conditionsMap, newValues);
      const prev = prevVisibilityRef.current;

      let changedValues = false;
      const updatedValues = { ...newValues };

      for (const [fieldName, vis] of Object.entries(newVis)) {
        const wasVisible = prev[fieldName]?.visible ?? true;
        const nowVisible = vis.visible;

        if (wasVisible && !nowVisible) {
          const onHide = conditionsMap[fieldName]?.onHide ?? 'reset';

          if (onHide === 'reset') {
            updatedValues[fieldName] = defaultValues[fieldName];
            changedValues = true;
          } else if (onHide === 'clear') {
            const desc = descriptors[fieldName];
            updatedValues[fieldName] = typeof desc._defaultValue === 'string' ? '' : null;
            changedValues = true;
          }
        }
      }

      if (!areVisibilityMapsEqual(prev, newVis)) {
        prevVisibilityRef.current = newVis;
        setVisibility(newVis);
      }

      if (changedValues) {
        stateRef.current = {
          ...stateRef.current,
          values: updatedValues as SchemaValues<S>,
        };
      }
    },
    [conditionsMap, defaultValues, descriptors],
  );

  const getRuntimeFieldState = useCallback(
    (name: string, values: Record<string, unknown>) => {
      const map = evaluateAllConditions(conditionsMap, values);
      return map[name] ?? { visible: true, required: false, disabled: false };
    },
    [conditionsMap],
  );

  const getEffectiveDescriptor = useCallback(
    (name: string, values: Record<string, unknown>) => {
      const runtime = getRuntimeFieldState(name, values);
      const descriptor = descriptors[name];

      return {
        ...descriptor,
        _required: descriptor._required || runtime.required,
        _disabled: descriptor._disabled || runtime.disabled,
      };
    },
    [descriptors, getRuntimeFieldState],
  );

  const runFieldValidation = useCallback(
    async (name: string, value: unknown): Promise<string | null> => {
      const candidateValues = {
        ...(stateRef.current.values as Record<string, unknown>),
        [name]: value,
      };

      const runtime = getRuntimeFieldState(name, candidateValues);

      if (!runtime.visible) {
        return null;
      }

      if (resolver) {
        const result = await resolver(candidateValues);
        return result.errors[name] ?? null;
      }

      const effectiveDescriptor = getEffectiveDescriptor(name, candidateValues);

      return validateField(effectiveDescriptor, value, candidateValues);
    },
    [getEffectiveDescriptor, getRuntimeFieldState, resolver],
  );

  const runAllValidation = useCallback(async (): Promise<{
    errors: Record<string, string>;
    resolvedValues: Record<string, unknown> | null;
  }> => {
    const values = stateRef.current.values as Record<string, unknown>;
    const visibilityMap = evaluateAllConditions(conditionsMap, values);
    const errors: Record<string, string> = {};

    if (resolver) {
      const result = await resolver(values);

      for (const [name, message] of Object.entries(result.errors)) {
        const runtime = visibilityMap[name] ?? {
          visible: true,
          required: false,
          disabled: false,
        };

        if (runtime.visible && message) {
          errors[name] = message;
        }
      }

      return {
        errors,
        resolvedValues: result.values,
      };
    }

    for (const name of Object.keys(descriptors)) {
      const runtime = visibilityMap[name] ?? {
        visible: true,
        required: false,
        disabled: false,
      };

      if (!runtime.visible) {
        continue;
      }

      const effectiveDescriptor = getEffectiveDescriptor(name, values);
      const error = await validateField(effectiveDescriptor, values[name], values);

      if (error) {
        errors[name] = error;
      }
    }

    return {
      errors,
      resolvedValues: null,
    };
  }, [conditionsMap, descriptors, getEffectiveDescriptor, resolver]);

  const validate = useCallback(
    async (names?: keyof S | Array<keyof S>): Promise<boolean> => {
      let nextErrors: Record<string, string>;

      if (names === undefined) {
        nextErrors = (await runAllValidation()).errors;
      } else {
        const fieldNames = (Array.isArray(names) ? names : [names]) as string[];
        nextErrors = { ...(stateRef.current.errors as Record<string, string>) };

        for (const fieldName of fieldNames) {
          const value = (stateRef.current.values as Record<string, unknown>)[fieldName];
          const errorMessage = await runFieldValidation(fieldName, value);

          if (errorMessage) {
            nextErrors[fieldName] = errorMessage;
          } else {
            delete nextErrors[fieldName];
          }
        }
      }

      const previousErrors = stateRef.current.errors as Record<
        string,
        string | undefined
      >;
      const normalizedNextErrors = nextErrors;
      const nextIsValid = Object.keys(nextErrors).length === 0;
      const currentIsValid = stateRef.current.isValid;

      const sameErrors = shallowEqualErrors(previousErrors, normalizedNextErrors);
      const sameIsValid = currentIsValid === nextIsValid;

      emitErrorsDiffAnalytics(analyticsRef.current, previousErrors, normalizedNextErrors);

      if (!sameErrors || !sameIsValid) {
        setRuntimeState((current) => ({
          ...current,
          errors: nextErrors as FormState<S>['errors'],
          isValid: nextIsValid,
        }));
      }

      return nextIsValid;
    },
    [runAllValidation, runFieldValidation, setRuntimeState],
  );

  useEffect(() => {
    if (!draftValues) return;
    if (hasHydratedDraftRef.current) return;

    hasHydratedDraftRef.current = true;

    setRuntimeState((current) => ({
      ...current,
      values: {
        ...defaultValues,
        ...(current.values as object),
        ...draftValues,
      } as SchemaValues<S>,
    }));
  }, [draftValues, defaultValues, setRuntimeState]);

  useEffect(() => {
    return () => {
      Object.values(debounceRefs.current).forEach(clearTimeout);
    };
  }, []);

  const handleChange = useCallback(
    async (name: string, rawValue: unknown) => {
      analyticsRef.current?.onFieldChange(name);
      const descriptor = descriptors[name];
      const nextValue = applyImmediateTransforms(descriptor, rawValue);
      const isDirtyField = nextValue !== defaultValues[name];

      setRuntimeState((current) => {
        const nextDirty = {
          ...current.dirty,
          [name]: isDirtyField,
        };

        const nextState = {
          ...current,
          values: {
            ...(current.values as object),
            [name]: nextValue,
          } as SchemaValues<S>,
          dirty: nextDirty,
          isDirty: Object.values(nextDirty).some(Boolean),
        };

        updateVisibility(nextState.values as Record<string, unknown>);
        persistSave(nextState.values as Record<string, unknown>);

        return nextState;
      }, false);

      const currentState = stateRef.current;
      const isTouched = Boolean(currentState.touched[name as keyof S]);
      const submitted = currentState.submitCount > 0;

      const shoulVal = shouldValidate({
        trigger: validateOn,
        event: 'onChange',
        isTouched,
        submitted,
        revalidate: revalidateOn,
      });

      if (shoulVal) {
        clearTimeout(debounceRefs.current[name]);

        setRuntimeState((current) => ({
          ...current,
          status: 'validating',
        }));

        debounceRefs.current[name] = setTimeout(async () => {
          const errorMessage = await runFieldValidation(name, nextValue);

          const previousErrors = stateRef.current.errors as Record<
            string,
            string | undefined
          >;
          const previousError = previousErrors[name];

          const nextErrors = {
            ...previousErrors,
            [name]: errorMessage ?? undefined,
          } as Record<string, string | undefined>;

          if (!errorMessage) {
            delete nextErrors[name];
          }

          emitFieldErrorAnalytics(
            analyticsRef.current,
            name,
            previousError,
            nextErrors[name],
          );

          const nextIsValid = Object.keys(nextErrors).length === 0;
          const sameErrors = shallowEqualErrors(previousErrors, nextErrors);
          const sameIsValid = stateRef.current.isValid === nextIsValid;
          const sameStatus = stateRef.current.status === 'idle';

          if (!sameErrors || !sameIsValid || !sameStatus) {
            setRuntimeState((current) => ({
              ...current,
              errors: nextErrors as FormState<S>['errors'],
              isValid: nextIsValid,
              status: 'idle',
            }));
          }
        }, descriptor._debounce ?? 0);

        return;
      }

      rerender();
    },
    [
      defaultValues,
      descriptors,
      persistSave,
      revalidateOn,
      rerender,
      runFieldValidation,
      setRuntimeState,
      updateVisibility,
      validateOn,
    ],
  );

  const handleBlur = useCallback(
    async (name: string) => {
      const descriptor = descriptors[name];
      const currentRawValue = (stateRef.current.values as Record<string, unknown>)[name];
      const committedValue = applyCommittedTransforms(descriptor, currentRawValue);
      const isDirtyField = committedValue !== defaultValues[name];

      analyticsRef.current?.onFieldBlur(name, committedValue);

      setRuntimeState((current) => {
        const nextDirty = {
          ...current.dirty,
          [name]: isDirtyField,
        };

        return {
          ...current,
          values: {
            ...(current.values as object),
            [name]: committedValue,
          } as SchemaValues<S>,
          touched: {
            ...current.touched,
            [name]: true,
          },
          dirty: nextDirty,
          isDirty: Object.values(nextDirty).some(Boolean),
        };
      }, false);

      const submitted = stateRef.current.submitCount > 0;

      if (
        shouldValidate({
          trigger: validateOn,
          event: 'onBlur',
          isTouched: true,
          submitted,
          revalidate: revalidateOn,
        })
      ) {
        clearTimeout(debounceRefs.current[name]);

        setRuntimeState((current) => ({
          ...current,
          status: 'validating',
        }));

        const errorMessage = await runFieldValidation(name, committedValue);

        const previousErrors = stateRef.current.errors as Record<
          string,
          string | undefined
        >;
        const previousError = previousErrors[name];

        const nextErrors = {
          ...previousErrors,
          [name]: errorMessage ?? undefined,
        } as Record<string, string | undefined>;

        if (!errorMessage) {
          delete nextErrors[name];
        }

        emitFieldErrorAnalytics(
          analyticsRef.current,
          name,
          previousError,
          nextErrors[name],
        );

        const nextIsValid = Object.keys(nextErrors).length === 0;
        const sameErrors = shallowEqualErrors(previousErrors, nextErrors);
        const sameIsValid = stateRef.current.isValid === nextIsValid;
        const sameStatus = stateRef.current.status === 'idle';

        if (!sameErrors || !sameIsValid || !sameStatus) {
          setRuntimeState((current) => ({
            ...current,
            errors: nextErrors as FormState<S>['errors'],
            isValid: nextIsValid,
            status: 'idle',
          }));
        }

        return;
      }

      rerender();
    },
    [
      defaultValues,
      descriptors,
      revalidateOn,
      rerender,
      runFieldValidation,
      setRuntimeState,
      validateOn,
    ],
  );

  const handleSubmit = useCallback(async () => {
    const config = submitConfigRef.current;
    if (!config) return;

    const { onSubmit, onError, onSubmitError } = config;

    setRuntimeState((current) => ({
      ...current,
      status: 'validating',
      isSubmitting: false,
      isSuccess: false,
      isError: false,
      submitError: null,
      submitCount: current.submitCount + 1,
    }));

    const currentValues = stateRef.current.values as Record<string, unknown>;
    const normalizedValues = Object.fromEntries(
      Object.entries(descriptors).map(([fieldName, descriptor]) => [
        fieldName,
        applyCommittedTransforms(descriptor, currentValues[fieldName]),
      ]),
    ) as SchemaValues<S>;

    setRuntimeState(
      (current) => ({
        ...current,
        values: normalizedValues,
      }),
      false,
    );

    const { errors: rawErrors, resolvedValues } = await runAllValidation();

    const previousErrors = stateRef.current.errors as Record<string, string | undefined>;
    const nextErrorsForAnalytics = rawErrors as Record<string, string | undefined>;

    emitErrorsDiffAnalytics(analyticsRef.current, previousErrors, nextErrorsForAnalytics);

    const allTouched = Object.fromEntries(
      Object.keys(descriptors).map((key) => [key, true]),
    );

    setRuntimeState(
      (current) => ({
        ...current,
        errors: rawErrors as FormState<S>['errors'],
        touched: {
          ...current.touched,
          ...allTouched,
        },
        isValid: Object.keys(rawErrors).length === 0,
      }),
      false,
    );

    if (Object.keys(rawErrors).length > 0) {
      setRuntimeState((current) => ({
        ...current,
        status: 'idle',
      }));

      analyticsRef.current?.onFormSubmitError(rawErrors, stateRef.current.submitCount);

      onError?.(rawErrors as Partial<Record<keyof S, string>>);
      return;
    }

    setRuntimeState((current) => ({
      ...current,
      status: 'submitting',
      isSubmitting: true,
    }));

    const visibleValuesSource =
      resolvedValues ?? (stateRef.current.values as Record<string, unknown>);
    const submittedValues: Record<string, unknown> = {};
    const currentVisibility = evaluateAllConditions(conditionsMap, visibleValuesSource);

    for (const [key, value] of Object.entries(visibleValuesSource)) {
      const vis = currentVisibility[key];
      if (!vis || vis.visible) submittedValues[key] = value;
    }

    try {
      await onSubmit(submittedValues as SchemaValues<S>);

      setRuntimeState((current) => ({
        ...current,
        status: 'success',
        isSubmitting: false,
        isSuccess: true,
        isError: false,
      }));

      analyticsRef.current?.onFormSubmitSuccess(
        stateRef.current.submitCount,
        Object.keys(descriptors).length,
      );
    } catch (error) {
      const message = onSubmitError
        ? onSubmitError(error)
        : 'An error occurred. Please try again.';

      setRuntimeState((current) => ({
        ...current,
        status: 'error',
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        submitError: message,
      }));
    }
  }, [conditionsMap, descriptors, runAllValidation, setRuntimeState]);

  const trackFieldFocus = useCallback((name: string) => {
    analyticsRef.current?.onFieldFocus(name);
  }, []);

  return {
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
  };
}

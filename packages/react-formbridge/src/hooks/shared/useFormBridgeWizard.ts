import { useCallback, useEffect, useMemo, useState } from 'react';

import type { PersistOptions } from '../../core/persist/draft';
import type {
  FormSchema,
  SchemaValues,
  UseFormBridgeReturn,
  UseFormOptions,
} from '../../types';
import { useFormBridge } from '../useFormBridge.web';

export interface WizardStep<S extends FormSchema = FormSchema> {
  id: string;
  label: string;
  schema: S;
  optional?: boolean;
  condition?: (allValues: Record<string, unknown>) => boolean;
  formOptions?: Partial<UseFormOptions<S>>;
}

export interface UseFormWizardOptions {
  onSubmit: (allValues: Record<string, unknown>) => void | Promise<void>;
  onSubmitError?: (error: unknown) => string;
  persist?: Omit<PersistOptions, 'key'> & { key: string };
  validateOn?: UseFormOptions<FormSchema>['validateOn'];
  revalidateOn?: UseFormOptions<FormSchema>['revalidateOn'];
}

export interface UseFormWizardReturn {
  currentStep: UseFormBridgeReturn<FormSchema>;
  step: WizardStep | null;
  currentStepIndex: number;
  totalSteps: number;
  allSteps: WizardStep[];
  visibleSteps: WizardStep[];
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  completedSteps: Set<string>;
  allValues: Record<string, unknown>;
  next: () => Promise<boolean>;
  prev: () => void;
  goTo: (index: number, skipValidation?: boolean) => Promise<boolean>;
  skip: () => boolean;
  submit: () => Promise<void>;
  isSubmitting: boolean;
  isSuccess: boolean;
  submitError: string | null;
}

const EMPTY_SCHEMA: FormSchema = {};

function pickValuesForSchema<S extends FormSchema>(
  schema: S,
  values: Record<string, unknown>,
): Partial<SchemaValues<S>> {
  const result: Partial<SchemaValues<S>> = {};

  for (const key of Object.keys(schema) as Array<keyof S & string>) {
    if (key in values) {
      result[key] = values[key] as SchemaValues<S>[keyof S];
    }
  }

  return result;
}

export function useFormWizardBridge(
  steps: WizardStep[],
  options: UseFormWizardOptions,
): UseFormWizardReturn {
  const {
    onSubmit,
    onSubmitError,
    persist,
    validateOn = 'onTouched',
    revalidateOn = 'onChange',
  } = options;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [accumulatedValues, setAccumulatedValues] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const visibleSteps = useMemo(
    () => steps.filter((step) => !step.condition || step.condition(accumulatedValues)),
    [steps, accumulatedValues],
  );

  useEffect(() => {
    if (visibleSteps.length === 0) {
      if (currentIndex !== 0) {
        setCurrentIndex(0);
      }
      return;
    }

    if (currentIndex > visibleSteps.length - 1) {
      setCurrentIndex(visibleSteps.length - 1);
    }
  }, [currentIndex, visibleSteps.length]);

  const step = visibleSteps[currentIndex] ?? null;

  const isFirstStep = currentIndex === 0;
  const isLastStep = visibleSteps.length > 0 && currentIndex === visibleSteps.length - 1;

  const progress =
    visibleSteps.length > 0
      ? Math.round((completedSteps.size / visibleSteps.length) * 100)
      : 0;

  const stepPersist: PersistOptions | undefined =
    persist && step
      ? {
          ...persist,
          key: `${persist.key}:${step.id}`,
        }
      : undefined;

  const stepInitialValues = useMemo(
    () => (step ? pickValuesForSchema(step.schema, accumulatedValues) : {}),
    [step, accumulatedValues],
  );

  const currentStepForm = useFormBridge(step?.schema ?? EMPTY_SCHEMA, {
    formKey: step?.id ?? '__empty__',
    initialValues: stepInitialValues,
    validateOn: step?.formOptions?.validateOn ?? validateOn,
    revalidateOn: step?.formOptions?.revalidateOn ?? revalidateOn,
    resolver: step?.formOptions?.resolver,
    persist: step?.formOptions?.persist ?? stepPersist,
  });

  const mergeCurrentStepValues = useCallback(() => {
    if (!step) return accumulatedValues;

    const stepValues = currentStepForm.getValues();
    return {
      ...accumulatedValues,
      ...stepValues,
    };
  }, [accumulatedValues, currentStepForm, step]);

  const next = useCallback(async (): Promise<boolean> => {
    if (!step) return false;

    const isValid = await currentStepForm.validate();
    if (!isValid) return false;

    const merged = mergeCurrentStepValues();
    setAccumulatedValues(merged);

    setCompletedSteps((prev) => {
      const nextSet = new Set(prev);
      nextSet.add(step.id);
      return nextSet;
    });

    await currentStepForm.saveDraftNow();

    if (!isLastStep) {
      setCurrentIndex((index) => Math.min(index + 1, visibleSteps.length - 1));
    }

    return true;
  }, [currentStepForm, isLastStep, mergeCurrentStepValues, step, visibleSteps.length]);

  const prev = useCallback(() => {
    if (isFirstStep) return;

    const merged = mergeCurrentStepValues();
    setAccumulatedValues(merged);
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, [isFirstStep, mergeCurrentStepValues]);

  const goTo = useCallback(
    async (index: number, skipValidation = false): Promise<boolean> => {
      if (!step) return false;
      if (index < 0 || index >= visibleSteps.length) return false;
      if (index === currentIndex) return true;

      if (!skipValidation && index > currentIndex) {
        const isValid = await currentStepForm.validate();
        if (!isValid) return false;
      }

      const merged = mergeCurrentStepValues();
      setAccumulatedValues(merged);
      setCurrentIndex(index);

      return true;
    },
    [currentIndex, currentStepForm, mergeCurrentStepValues, step, visibleSteps.length],
  );

  const skip = useCallback((): boolean => {
    if (!step || !step.optional || isLastStep) {
      return false;
    }

    const merged = mergeCurrentStepValues();
    setAccumulatedValues(merged);
    setCurrentIndex((index) => Math.min(index + 1, visibleSteps.length - 1));

    return true;
  }, [isLastStep, mergeCurrentStepValues, step, visibleSteps.length]);

  const submit = useCallback(async () => {
    if (!step) return;

    const isValid = await currentStepForm.validate();
    if (!isValid) return;

    const finalValues = mergeCurrentStepValues();

    setIsSubmitting(true);
    setIsSuccess(false);
    setSubmitError(null);

    try {
      await onSubmit(finalValues);

      setCompletedSteps((prev) => {
        const nextSet = new Set(prev);
        nextSet.add(step.id);
        return nextSet;
      });

      setAccumulatedValues(finalValues);
      setIsSuccess(true);

      await currentStepForm.clearDraft();
    } catch (error) {
      const message = onSubmitError
        ? onSubmitError(error)
        : 'An error occurred. Please try again.';

      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentStepForm, mergeCurrentStepValues, onSubmit, onSubmitError, step]);

  return {
    currentStep: currentStepForm,
    step,
    currentStepIndex: currentIndex,
    totalSteps: visibleSteps.length,
    allSteps: steps,
    visibleSteps,
    isFirstStep,
    isLastStep,
    progress,
    completedSteps,
    allValues: accumulatedValues,
    next,
    prev,
    goTo,
    skip,
    submit,
    isSubmitting,
    isSuccess,
    submitError,
  };
}

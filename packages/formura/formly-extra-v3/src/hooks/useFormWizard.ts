/**
 * formura — useFormWizard
 * ──────────────────────────
 * Multi-step form wizard that:
 * - Validates only the current step before advancing
 * - Persists each step's values independently
 * - Merges all step values for final submission
 * - Supports conditional steps (skip a step based on previous answers)
 */

import { useState, useCallback, useMemo } from 'react';
import { useFormV13 } from './useForm';
import type { UseFormOptionsV13, UseFormReturnV13 } from './useForm';
import type { FormSchema } from '../types';
import type { PersistOptions } from '../persist/draft';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WizardStep<S extends FormSchema = FormSchema> {
  /** Unique step identifier */
  id:       string;
  /** Step label shown in progress indicators */
  label:    string;
  /** The field schema for this step */
  schema:   S;
  /** Step-level validate options */
  validate?: UseFormOptionsV13<S>['validateOn'];
  /** Whether this step can be skipped (default: false) */
  optional?: boolean;
  /**
   * Condition to show this step (based on all accumulated values).
   * Return false to skip the step entirely.
   */
  condition?: (allValues: Record<string, unknown>) => boolean;
}

export interface UseFormWizardOptions {
  /**
   * Called with the merged values from ALL steps on final submit.
   */
  onSubmit: (allValues: Record<string, unknown>) => void | Promise<void>;
  /**
   * Called when the final submission throws an error.
   */
  onSubmitError?: (error: unknown) => string;
  /**
   * Persist options. If provided, applies to all steps.
   * Each step gets its own key: `${key}:${stepId}`
   */
  persist?: Omit<PersistOptions, 'key'> & { key: string };
  /**
   * Validate mode for all steps (default: 'onTouched').
   */
  validateOn?: UseFormOptionsV13<FormSchema>['validateOn'];
}

export interface UseFormWizardReturn {
  /** The current step's form instance */
  currentStep:      UseFormReturnV13<FormSchema>;
  /** The current step definition */
  step:             WizardStep;
  /** Zero-based index of the current step (among visible steps) */
  currentStepIndex: number;
  /** Total number of visible steps */
  totalSteps:       number;
  /** All step definitions (including conditionally hidden ones) */
  allSteps:         WizardStep[];
  /** Visible (non-skipped) steps */
  visibleSteps:     WizardStep[];
  /** Whether this is the first step */
  isFirstStep:      boolean;
  /** Whether this is the last step */
  isLastStep:       boolean;
  /** Completion percentage (0–100) */
  progress:         number;
  /** Set of completed step IDs */
  completedSteps:   Set<string>;
  /** Accumulated values across all completed steps */
  allValues:        Record<string, unknown>;
  /** Validate current step and advance to next */
  next:             () => Promise<boolean>;
  /** Go back to previous step (no validation) */
  prev:             () => void;
  /** Jump to a specific step by index */
  goTo:             (index: number, skipValidation?: boolean) => Promise<boolean>;
  /** Submit the entire form (validates current step + calls onSubmit) */
  submit:           () => Promise<void>;
  /** True while submitting */
  isSubmitting:     boolean;
  /** True if submission succeeded */
  isSuccess:        boolean;
  /** Error message from onSubmitError */
  submitError:      string | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFormWizard(
  steps:   WizardStep[],
  options: UseFormWizardOptions,
): UseFormWizardReturn {
  const { onSubmit, onSubmitError, persist, validateOn = 'onTouched' } = options;

  const [currentIndex,    setCurrentIndex]    = useState(0);
  const [completedSteps,  setCompletedSteps]  = useState<Set<string>>(new Set());
  const [accumulatedValues, setAccumulatedValues] = useState<Record<string, unknown>>({});
  const [isSubmitting,    setIsSubmitting]    = useState(false);
  const [isSuccess,       setIsSuccess]       = useState(false);
  const [submitError,     setSubmitError]     = useState<string | null>(null);

  // Compute visible steps based on conditions + accumulated values
  const visibleSteps = useMemo(() =>
    steps.filter(step =>
      !step.condition || step.condition(accumulatedValues)
    ),
  [steps, accumulatedValues]);

  const step       = visibleSteps[currentIndex] ?? visibleSteps[0];
  const isFirst    = currentIndex === 0;
  const isLast     = currentIndex === visibleSteps.length - 1;
  const progress   = visibleSteps.length > 0
    ? Math.round((completedSteps.size / visibleSteps.length) * 100)
    : 0;

  // Build per-step persist options
  const stepPersist: PersistOptions | undefined = persist && step ? {
    ...persist,
    key: `${persist.key}:${step.id}`,
  } : undefined;

  // One form instance per step
  const currentStepForm = useFormV13(step?.schema ?? {}, {
    validateOn: step?.validate ?? validateOn,
    persist:    stepPersist,
  });

  // ── next ─────────────────────────────────────────────────────────────────

  const next = useCallback(async (): Promise<boolean> => {
    // Validate current step
    const isValid = await currentStepForm.validate();
    if (!isValid) return false;

    // Merge current step values
    const stepValues = currentStepForm.getValues();
    const merged     = { ...accumulatedValues, ...stepValues };
    setAccumulatedValues(merged);

    // Mark step as completed
    setCompletedSteps(prev => new Set([...prev, step.id]));

    // Save draft now (bypass debounce) before navigating
    await currentStepForm.saveDraftNow?.();

    if (!isLast) {
      setCurrentIndex(i => Math.min(i + 1, visibleSteps.length - 1));
    }

    return true;
  }, [currentStepForm, accumulatedValues, step, isLast, visibleSteps.length]);

  // ── prev ─────────────────────────────────────────────────────────────────

  const prev = useCallback(() => {
    // Merge current values even when going back
    const stepValues = currentStepForm.getValues();
    setAccumulatedValues(prev => ({ ...prev, ...stepValues }));
    setCurrentIndex(i => Math.max(i - 1, 0));
  }, [currentStepForm]);

  // ── goTo ──────────────────────────────────────────────────────────────────

  const goTo = useCallback(async (
    index: number,
    skipValidation = false,
  ): Promise<boolean> => {
    if (index < 0 || index >= visibleSteps.length) return false;

    if (!skipValidation && index > currentIndex) {
      const isValid = await currentStepForm.validate();
      if (!isValid) return false;
    }

    const stepValues = currentStepForm.getValues();
    setAccumulatedValues(prev => ({ ...prev, ...stepValues }));
    setCurrentIndex(index);
    return true;
  }, [currentIndex, currentStepForm, visibleSteps.length]);

  // ── submit ────────────────────────────────────────────────────────────────

  const submit = useCallback(async () => {
    // Validate the final step
    const isValid = await currentStepForm.validate();
    if (!isValid) return;

    const finalValues = {
      ...accumulatedValues,
      ...currentStepForm.getValues(),
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(finalValues);
      setIsSuccess(true);

      // Clear all step drafts on success
      await currentStepForm.clearDraft?.();
    } catch (err) {
      const msg = onSubmitError ? onSubmitError(err) : 'An error occurred. Please try again.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentStepForm, accumulatedValues, onSubmit, onSubmitError]);

  return {
    currentStep:      currentStepForm,
    step,
    currentStepIndex: currentIndex,
    totalSteps:       visibleSteps.length,
    allSteps:         steps,
    visibleSteps,
    isFirstStep:      isFirst,
    isLastStep:       isLast,
    progress,
    completedSteps,
    allValues:        accumulatedValues,
    next,
    prev,
    goTo,
    submit,
    isSubmitting,
    isSuccess,
    submitError,
  };
}

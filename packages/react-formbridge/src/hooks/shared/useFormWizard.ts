import { useCallback, useEffect, useMemo, useState } from 'react';

import { DraftManager, type PersistOptions } from '../../core/persist/draft';
import { WizardStateManager, type WizardStateSnapshot } from '../../core/persist/wizard';
import type {
  FormSchema,
  Platform,
  SchemaValues,
  UseFormBridgeReturn,
  UseFormOptions,
} from '../../types';

export interface WizardStep<
  S extends FormSchema = FormSchema,
  TPlatform extends Platform = Platform,
> {
  id: string;
  label: string;
  schema: S;
  optional?: boolean;
  condition?: (allValues: Record<string, unknown>) => boolean;
  formOptions?: Partial<UseFormOptions<S, TPlatform>>;
}

export type WizardStepChangeReason =
  | 'next'
  | 'prev'
  | 'goTo'
  | 'goToStep'
  | 'skip'
  | 'restore'
  | 'fallback';

export interface WizardStepChangeEvent<TPlatform extends Platform = Platform> {
  step: WizardStep<FormSchema, TPlatform>;
  index: number;
  previousStep: WizardStep<FormSchema, TPlatform> | null;
  previousIndex: number;
  reason: WizardStepChangeReason;
}

export interface UseFormWizardOptions<TPlatform extends Platform = Platform> {
  onSubmit: (allValues: Record<string, unknown>) => void | Promise<void>;
  onSubmitError?: (error: unknown) => string;
  persist?: Omit<PersistOptions, 'key'> & { key: string };
  validateOn?: UseFormOptions<FormSchema, TPlatform>['validateOn'];
  revalidateOn?: UseFormOptions<FormSchema, TPlatform>['revalidateOn'];
  stepId?: string;
  initialStepId?: string;
  onStepChange?: (event: WizardStepChangeEvent<TPlatform>) => void;
}

export interface UseFormWizardReturn<TPlatform extends Platform = Platform> {
  currentStep: UseFormBridgeReturn<FormSchema, TPlatform>;
  step: WizardStep<FormSchema, TPlatform> | null;
  currentStepId: string | null;
  currentStepIndex: number;
  totalSteps: number;
  allSteps: WizardStep<FormSchema, TPlatform>[];
  visibleSteps: WizardStep<FormSchema, TPlatform>[];
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  completedSteps: Set<string>;
  allValues: Record<string, unknown>;
  next: () => Promise<boolean>;
  prev: () => void;
  goTo: (index: number, skipValidation?: boolean) => Promise<boolean>;
  goToStep: (stepId: string, skipValidation?: boolean) => Promise<boolean>;
  skip: () => boolean;
  submit: () => Promise<void>;
  isSubmitting: boolean;
  isSuccess: boolean;
  submitError: string | null;
  isHydrating: boolean;
}

const EMPTY_SCHEMA: FormSchema = {};

type UseFormBridgeHook<TPlatform extends Platform> = <S extends FormSchema>(
  schema: S,
  options?: UseFormOptions<S, TPlatform>,
) => UseFormBridgeReturn<S, TPlatform>;

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

function getStepPersistOptions(
  step: WizardStep<FormSchema, Platform>,
  persist: UseFormWizardOptions<Platform>['persist'],
): PersistOptions | undefined {
  const stepOptions = step.formOptions;

  if (stepOptions?.persist) {
    return stepOptions.persist;
  }

  if (!persist) {
    return undefined;
  }

  return {
    ...persist,
    key: `${persist.key}:${step.id}`,
  };
}

async function clearStepDrafts(
  steps: WizardStep<FormSchema, Platform>[],
  persist: UseFormWizardOptions<Platform>['persist'],
): Promise<void> {
  const managers = steps
    .map((step) => getStepPersistOptions(step, persist))
    .filter((value): value is PersistOptions => Boolean(value))
    .map((config) => new DraftManager(config));

  await Promise.all(managers.map((manager) => manager.clear()));
}

function createStepChangeEvent(
  nextStep: WizardStep<FormSchema, Platform>,
  nextIndex: number,
  previousStep: WizardStep<FormSchema, Platform> | null,
  previousIndex: number,
  reason: WizardStepChangeReason,
): WizardStepChangeEvent<Platform> {
  return {
    step: nextStep,
    index: nextIndex,
    previousStep,
    previousIndex,
    reason,
  };
}

export function createUseFormWizardBridge<TPlatform extends Platform>(
  useFormBridge: UseFormBridgeHook<TPlatform>,
) {
  return function useFormWizardBridge(
    steps: WizardStep<FormSchema, TPlatform>[],
    options: UseFormWizardOptions<TPlatform>,
  ): UseFormWizardReturn<TPlatform> {
    const {
      onSubmit,
      onSubmitError,
      persist,
      validateOn = 'onTouched',
      revalidateOn = 'onChange',
      stepId,
      initialStepId,
      onStepChange,
    } = options;

    const [internalStepId, setInternalStepId] = useState<string | null>(
      initialStepId ?? steps[0]?.id ?? null,
    );
    const [restoredStepId, setRestoredStepId] = useState<string | null>(null);
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
    const [accumulatedValues, setAccumulatedValues] = useState<Record<string, unknown>>(
      {},
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const persistKey = persist?.key;
    const persistStorage = persist?.storage;
    const persistTtl = persist?.ttl;
    const persistVersion = persist?.version;

    const wizardStateManager = useMemo(() => {
      if (!persistKey) {
        return null;
      }

      return new WizardStateManager({
        key: persistKey,
        storage: persistStorage,
        ttl: persistTtl,
        version: persistVersion,
      });
    }, [persistKey, persistStorage, persistTtl, persistVersion]);

    const [isHydrating, setIsHydrating] = useState(Boolean(wizardStateManager));

    useEffect(() => {
      let cancelled = false;

      if (!wizardStateManager) {
        setIsHydrating(false);
        return;
      }

      setIsHydrating(true);

      void wizardStateManager.load().then((snapshot) => {
        if (cancelled) {
          return;
        }

        if (snapshot) {
          setAccumulatedValues(snapshot.values);
          setCompletedSteps(new Set(snapshot.completedStepIds));
          setRestoredStepId(snapshot.currentStepId);
        } else {
          setRestoredStepId(null);
        }

        setIsHydrating(false);
      });

      return () => {
        cancelled = true;
      };
    }, [wizardStateManager]);

    const visibleSteps = useMemo(
      () => steps.filter((step) => !step.condition || step.condition(accumulatedValues)),
      [steps, accumulatedValues],
    );

    const requestedStepId =
      stepId ?? restoredStepId ?? internalStepId ?? initialStepId ?? visibleSteps[0]?.id;

    const step = isHydrating
      ? null
      : (visibleSteps.find((candidate) => candidate.id === requestedStepId) ??
        visibleSteps[0] ??
        null);

    const currentStepId = step?.id ?? null;
    const currentStepIndex = step
      ? visibleSteps.findIndex((candidate) => candidate.id === step.id)
      : -1;

    useEffect(() => {
      if (isHydrating) {
        return;
      }

      if (!stepId) {
        setInternalStepId(currentStepId);
      }
    }, [currentStepId, isHydrating, stepId]);

    useEffect(() => {
      if (isHydrating || !step || !requestedStepId || step.id === requestedStepId) {
        return;
      }

      onStepChange?.(
        createStepChangeEvent(
          step,
          currentStepIndex,
          null,
          -1,
          stepId ? 'fallback' : 'restore',
        ),
      );
    }, [currentStepIndex, isHydrating, onStepChange, requestedStepId, step, stepId]);

    const isFirstStep = currentStepIndex <= 0;
    const isLastStep =
      currentStepIndex >= 0 && visibleSteps.length > 0
        ? currentStepIndex === visibleSteps.length - 1
        : false;

    const progress =
      visibleSteps.length > 0
        ? Math.round((completedSteps.size / visibleSteps.length) * 100)
        : 0;

    const stepFormOptions = step?.formOptions;
    const stepPersist = step ? getStepPersistOptions(step, persist) : undefined;

    const stepInitialValues = useMemo(() => {
      if (!step) {
        return {};
      }

      return {
        ...(stepFormOptions?.initialValues as Record<string, unknown> | undefined),
        ...pickValuesForSchema(step.schema, accumulatedValues),
      };
    }, [accumulatedValues, step, stepFormOptions?.initialValues]);

    const currentStepForm = useFormBridge(step?.schema ?? EMPTY_SCHEMA, {
      formKey: step?.id ?? (isHydrating ? '__loading__' : '__empty__'),
      initialValues: stepInitialValues,
      validateOn: stepFormOptions?.validateOn ?? validateOn,
      revalidateOn: stepFormOptions?.revalidateOn ?? revalidateOn,
      resolver: stepFormOptions?.resolver,
      persist: stepPersist,
      analytics: stepFormOptions?.analytics,
      globalUi: stepFormOptions?.globalUi,
      showErrorsOn: stepFormOptions?.showErrorsOn,
    });

    const liveAllValues = step
      ? {
          ...accumulatedValues,
          ...currentStepForm.state.values,
        }
      : accumulatedValues;

    const persistWizardSnapshot = useCallback(
      async (snapshot: WizardStateSnapshot) => {
        await wizardStateManager?.save(snapshot);
      },
      [wizardStateManager],
    );

    useEffect(() => {
      if (isHydrating) {
        return;
      }

      void persistWizardSnapshot({
        currentStepId,
        completedStepIds: Array.from(completedSteps),
        values: liveAllValues,
      });
    }, [
      completedSteps,
      currentStepId,
      isHydrating,
      liveAllValues,
      persistWizardSnapshot,
    ]);

    const mergeCurrentStepValues = useCallback(() => {
      if (!step) {
        return accumulatedValues;
      }

      return {
        ...accumulatedValues,
        ...currentStepForm.getValues(),
      };
    }, [accumulatedValues, currentStepForm, step]);

    const activateStep = useCallback(
      (nextStep: WizardStep, reason: WizardStepChangeReason) => {
        const nextIndex = visibleSteps.findIndex(
          (candidate) => candidate.id === nextStep.id,
        );

        if (nextIndex < 0) {
          return false;
        }

        if (!stepId) {
          setInternalStepId(nextStep.id);
        }

        onStepChange?.(
          createStepChangeEvent(nextStep, nextIndex, step, currentStepIndex, reason),
        );

        return true;
      },
      [currentStepIndex, onStepChange, step, stepId, visibleSteps],
    );

    const goToStep = useCallback(
      async (nextStepId: string, skipValidation = false): Promise<boolean> => {
        if (!step) {
          return false;
        }

        const nextIndex = visibleSteps.findIndex(
          (candidate) => candidate.id === nextStepId,
        );

        if (nextIndex < 0 || nextIndex === currentStepIndex) {
          return nextIndex === currentStepIndex;
        }

        if (!skipValidation && nextIndex > currentStepIndex) {
          const isValid = await currentStepForm.validate();

          if (!isValid) {
            return false;
          }
        }

        const merged = mergeCurrentStepValues();
        setAccumulatedValues(merged);

        await persistWizardSnapshot({
          currentStepId: nextStepId,
          completedStepIds: Array.from(completedSteps),
          values: merged,
        });

        return activateStep(visibleSteps[nextIndex], 'goToStep');
      },
      [
        activateStep,
        completedSteps,
        currentStepForm,
        currentStepIndex,
        mergeCurrentStepValues,
        persistWizardSnapshot,
        step,
        visibleSteps,
      ],
    );

    const next = useCallback(async (): Promise<boolean> => {
      if (!step) {
        return false;
      }

      const isValid = await currentStepForm.validate();

      if (!isValid) {
        return false;
      }

      const merged = mergeCurrentStepValues();
      const nextCompletedSteps = new Set(completedSteps);
      nextCompletedSteps.add(step.id);

      setAccumulatedValues(merged);
      setCompletedSteps(nextCompletedSteps);

      await currentStepForm.saveDraftNow();

      if (isLastStep) {
        await persistWizardSnapshot({
          currentStepId: step.id,
          completedStepIds: Array.from(nextCompletedSteps),
          values: merged,
        });

        return true;
      }

      const nextStep = visibleSteps[currentStepIndex + 1];

      if (!nextStep) {
        return false;
      }

      await persistWizardSnapshot({
        currentStepId: nextStep.id,
        completedStepIds: Array.from(nextCompletedSteps),
        values: merged,
      });

      return activateStep(nextStep, 'next');
    }, [
      activateStep,
      completedSteps,
      currentStepForm,
      currentStepIndex,
      isLastStep,
      mergeCurrentStepValues,
      persistWizardSnapshot,
      step,
      visibleSteps,
    ]);

    const prev = useCallback(() => {
      if (!step || isFirstStep) {
        return;
      }

      const previousStep = visibleSteps[currentStepIndex - 1];

      if (!previousStep) {
        return;
      }

      const merged = mergeCurrentStepValues();
      setAccumulatedValues(merged);

      void persistWizardSnapshot({
        currentStepId: previousStep.id,
        completedStepIds: Array.from(completedSteps),
        values: merged,
      });

      activateStep(previousStep, 'prev');
    }, [
      activateStep,
      completedSteps,
      currentStepIndex,
      isFirstStep,
      mergeCurrentStepValues,
      persistWizardSnapshot,
      step,
      visibleSteps,
    ]);

    const goTo = useCallback(
      async (index: number, skipValidation = false): Promise<boolean> => {
        if (!step || index < 0 || index >= visibleSteps.length) {
          return false;
        }

        if (index === currentStepIndex) {
          return true;
        }

        if (!skipValidation && index > currentStepIndex) {
          const isValid = await currentStepForm.validate();

          if (!isValid) {
            return false;
          }
        }

        const targetStep = visibleSteps[index];
        const merged = mergeCurrentStepValues();
        setAccumulatedValues(merged);

        await persistWizardSnapshot({
          currentStepId: targetStep.id,
          completedStepIds: Array.from(completedSteps),
          values: merged,
        });

        return activateStep(targetStep, 'goTo');
      },
      [
        activateStep,
        completedSteps,
        currentStepForm,
        currentStepIndex,
        mergeCurrentStepValues,
        persistWizardSnapshot,
        step,
        visibleSteps,
      ],
    );

    const skip = useCallback((): boolean => {
      if (!step || !step.optional || isLastStep) {
        return false;
      }

      const nextStep = visibleSteps[currentStepIndex + 1];

      if (!nextStep) {
        return false;
      }

      const merged = mergeCurrentStepValues();
      setAccumulatedValues(merged);

      void persistWizardSnapshot({
        currentStepId: nextStep.id,
        completedStepIds: Array.from(completedSteps),
        values: merged,
      });

      return activateStep(nextStep, 'skip');
    }, [
      activateStep,
      completedSteps,
      currentStepIndex,
      isLastStep,
      mergeCurrentStepValues,
      persistWizardSnapshot,
      step,
      visibleSteps,
    ]);

    const submit = useCallback(async () => {
      if (!step) {
        return;
      }

      const isValid = await currentStepForm.validate();

      if (!isValid) {
        return;
      }

      const finalValues = mergeCurrentStepValues();
      const nextCompletedSteps = new Set(completedSteps);
      nextCompletedSteps.add(step.id);

      setIsSubmitting(true);
      setIsSuccess(false);
      setSubmitError(null);

      try {
        await onSubmit(finalValues);

        setCompletedSteps(nextCompletedSteps);
        setAccumulatedValues(finalValues);
        setIsSuccess(true);

        await clearStepDrafts(steps, persist);
        await wizardStateManager?.clear();
      } catch (error) {
        const message = onSubmitError
          ? onSubmitError(error)
          : 'An error occurred. Please try again.';

        setSubmitError(message);
      } finally {
        setIsSubmitting(false);
      }
    }, [
      completedSteps,
      currentStepForm,
      mergeCurrentStepValues,
      onSubmit,
      onSubmitError,
      persist,
      step,
      steps,
      wizardStateManager,
    ]);

    return {
      currentStep: currentStepForm,
      step,
      currentStepId,
      currentStepIndex,
      totalSteps: visibleSteps.length,
      allSteps: steps,
      visibleSteps,
      isFirstStep,
      isLastStep,
      progress,
      completedSteps,
      allValues: liveAllValues,
      next,
      prev,
      goTo,
      goToStep,
      skip,
      submit,
      isSubmitting,
      isSuccess,
      submitError,
      isHydrating,
    };
  };
}

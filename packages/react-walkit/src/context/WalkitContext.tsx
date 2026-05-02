import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { WalkitStopReason, WalkitTransitionAction } from '../types/analitycs.types';
import type {
  ResolvedWalkitAutoStart,
  TargetRect,
  WalkitConfig,
  WalkitContextValue,
  WalkitFlowStep,
  WalkitStepData,
} from '../types/Walkit.types';
import { hasSeenWalkitAutoStart, rememberWalkitAutoStart } from '../utils/autoStart';
import { resolveWalkitSequence, withWalkitSequence } from '../utils/sequence';
import type { SpotlightPadding } from '../utils/spotlight';

const WalkitContext = createContext<WalkitContextValue | null>(null);

interface TooltipContextProviderProps {
  children: ReactNode;
  config: WalkitConfig;
}

const DEFAULT_STEP_MOUNT_TIMEOUT_MS = 5000;

const sortSteps = (stepMap: Record<string, WalkitStepData>): WalkitStepData[] =>
  Object.values(stepMap).sort(
    (firstStep, secondStep) => firstStep.sequence - secondStep.sequence,
  );

const sortFlowSteps = (steps: WalkitFlowStep[]): WalkitFlowStep[] =>
  [...steps].sort(
    (firstStep, secondStep) =>
      resolveWalkitSequence(firstStep, `flow step "${firstStep.id}"`) -
      resolveWalkitSequence(secondStep, `flow step "${secondStep.id}"`),
  );

function toFlowStep(
  step: Pick<WalkitStepData, 'id' | 'sequence' | 'route'>,
): WalkitFlowStep {
  return withWalkitSequence(
    {
      id: step.id,
      route: step.route,
    },
    step.sequence,
  );
}

function normalizeFlowSteps(steps: WalkitFlowStep[]): WalkitFlowStep[] {
  const stepMap = new Map<string, WalkitFlowStep>();

  for (const step of steps) {
    stepMap.set(
      step.id,
      withWalkitSequence(
        {
          id: step.id,
          route: step.route,
        },
        resolveWalkitSequence(step, `flow step "${step.id}"`),
      ),
    );
  }

  return sortFlowSteps(Array.from(stepMap.values()));
}

function isSameAutoStart(
  a: ResolvedWalkitAutoStart | undefined,
  b: ResolvedWalkitAutoStart | undefined,
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;

  return a.mode === b.mode && a.key === b.key && a.delay === b.delay;
}

function isSameSpotlightPadding(
  a: SpotlightPadding | undefined,
  b: SpotlightPadding | undefined,
): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a == null && b == null;

  if (typeof a === 'number' || typeof b === 'number') {
    return a === b;
  }

  return (
    a.top === b.top && a.right === b.right && a.bottom === b.bottom && a.left === b.left
  );
}

function areStepListsEqual(a: WalkitStepData[], b: WalkitStepData[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i += 1) {
    const left = a[i];
    const right = b[i];

    if (
      left.id !== right.id ||
      left.sequence !== right.sequence ||
      left.title !== right.title ||
      left.content !== right.content ||
      left.route !== right.route ||
      left.placement !== right.placement ||
      left.renderPopover !== right.renderPopover ||
      left.stopOnOutsideClick !== right.stopOnOutsideClick ||
      !isSameSpotlightPadding(
        left.spotlightPaddingOverride,
        right.spotlightPaddingOverride,
      ) ||
      left.spotlightBorderRadiusOverride !== right.spotlightBorderRadiusOverride ||
      !isSameAutoStart(left.autoStart, right.autoStart)
    ) {
      return false;
    }
  }

  return true;
}

function isSameStep(a: WalkitStepData | undefined, b: WalkitStepData): boolean {
  if (!a) return false;

  return (
    a.id === b.id &&
    a.sequence === b.sequence &&
    a.title === b.title &&
    a.content === b.content &&
    a.route === b.route &&
    a.placement === b.placement &&
    a.renderPopover === b.renderPopover &&
    a.stopOnOutsideClick === b.stopOnOutsideClick &&
    a.measure === b.measure &&
    a.ensureVisible === b.ensureVisible &&
    isSameSpotlightPadding(a.spotlightPaddingOverride, b.spotlightPaddingOverride) &&
    a.spotlightBorderRadiusOverride === b.spotlightBorderRadiusOverride &&
    isSameAutoStart(a.autoStart, b.autoStart)
  );
}

function findFlowStepIndex(flowSteps: WalkitFlowStep[], stepId: string): number {
  return flowSteps.findIndex((step) => step.id === stepId);
}

export const WalkitContextProvider = ({
  children,
  config,
}: TooltipContextProviderProps) => {
  const [lastAction, setLastAction] = useState<WalkitTransitionAction | null>(null);
  const [lastStopReason, setLastStopReason] = useState<WalkitStopReason | null>(null);
  const stepsRef = useRef<Record<string, WalkitStepData>>({});
  const configRef = useRef(config);
  const activationIdRef = useRef(0);
  const activeStepIdRef = useRef<string | null>(null);
  const autoStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoStartAttemptedRef = useRef<Set<string>>(new Set());
  const startInFlightRef = useRef(false);
  const transitionInFlightRef = useRef(false);
  const stepWaitersRef = useRef<
    Map<string, Set<(step: WalkitStepData | undefined) => void>>
  >(new Map());

  configRef.current = config;

  const [sortedSteps, setSortedSteps] = useState<WalkitStepData[]>([]);
  const [currentStep, setCurrentStep] = useState<WalkitStepData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentRect, setCurrentRect] = useState<TargetRect | null>(null);
  const visibleRef = useRef(visible);
  const currentIndexRef = useRef(currentIndex);
  const currentStepRef = useRef<WalkitStepData | null>(currentStep);

  visibleRef.current = visible;
  currentIndexRef.current = currentIndex;
  currentStepRef.current = currentStep;

  const syncSortedSteps = useCallback(() => {
    const next = sortSteps(stepsRef.current);

    setSortedSteps((prev) => (areStepListsEqual(prev, next) ? prev : next));
  }, []);

  const getFlowStepsSnapshot = useCallback((): WalkitFlowStep[] => {
    const configuredSteps = configRef.current.steps;

    if (configuredSteps?.length) {
      return normalizeFlowSteps(configuredSteps);
    }

    return normalizeFlowSteps(Object.values(stepsRef.current).map(toFlowStep));
  }, []);

  const resolveStepWaiters = useCallback((step: WalkitStepData): void => {
    const waiters = stepWaitersRef.current.get(step.id);

    if (!waiters?.size) {
      return;
    }

    stepWaitersRef.current.delete(step.id);

    for (const resolve of waiters) {
      resolve(step);
    }
  }, []);

  const waitForStepRegistration = useCallback(
    (stepId: string, timeoutMs: number): Promise<WalkitStepData | undefined> => {
      const existingStep = stepsRef.current[stepId];

      if (existingStep) {
        return Promise.resolve(existingStep);
      }

      return new Promise((resolve) => {
        const waiters = stepWaitersRef.current.get(stepId) ?? new Set();

        const complete = (step: WalkitStepData | undefined): void => {
          clearTimeout(timeout);
          waiters.delete(complete);

          if (waiters.size === 0) {
            stepWaitersRef.current.delete(stepId);
          } else {
            stepWaitersRef.current.set(stepId, waiters);
          }

          resolve(step);
        };

        waiters.add(complete);
        stepWaitersRef.current.set(stepId, waiters);

        const timeout = globalThis.setTimeout(
          () => {
            complete(undefined);
          },
          Math.max(0, timeoutMs),
        );
      });
    },
    [],
  );

  const registerStep = useCallback(
    (step: WalkitStepData): void => {
      const previous = stepsRef.current[step.id];

      if (isSameStep(previous, step)) {
        return;
      }

      stepsRef.current[step.id] = step;

      if (activeStepIdRef.current === step.id) {
        setCurrentStep((prev) => (prev && isSameStep(prev, step) ? prev : step));
      }

      resolveStepWaiters(step);
      syncSortedSteps();
    },
    [resolveStepWaiters, syncSortedSteps],
  );

  const unregisterStep = useCallback(
    (id: string): void => {
      autoStartAttemptedRef.current.delete(id);

      if (!(id in stepsRef.current)) {
        return;
      }

      delete stepsRef.current[id];
      syncSortedSteps();
    },
    [syncSortedSteps],
  );

  const showStep = useCallback(
    async (
      index: number,
      step: WalkitStepData,
      activationId: number,
      providedSteps?: WalkitStepData[],
    ): Promise<boolean> => {
      const steps = providedSteps ?? sortSteps(stepsRef.current);

      if (activationId !== activationIdRef.current) {
        return false;
      }

      if (visibleRef.current) {
        setCurrentRect(null);
      }

      try {
        await step.ensureVisible?.();

        if (activationId !== activationIdRef.current) {
          return false;
        }

        const rect = await step.measure();

        if (activationId !== activationIdRef.current) {
          return false;
        }

        setSortedSteps((prev) => (areStepListsEqual(prev, steps) ? prev : steps));
        activeStepIdRef.current = step.id;
        setCurrentStep((prev) => (prev && isSameStep(prev, step) ? prev : step));
        setCurrentIndex(index);
        setCurrentRect((prev) =>
          prev?.x === rect.x &&
          prev?.y === rect.y &&
          prev?.width === rect.width &&
          prev?.height === rect.height
            ? prev
            : rect,
        );
        setVisible(true);
        return true;
      } catch (error) {
        if (activationId !== activationIdRef.current) {
          return false;
        }

        setSortedSteps((prev) => (areStepListsEqual(prev, steps) ? prev : steps));
        activeStepIdRef.current = null;
        setCurrentStep((prev) => (prev && isSameStep(prev, step) ? prev : step));
        setCurrentIndex(index);
        setCurrentRect(null);
        setVisible(false);

        console.warn(
          `[runilib/react-walkit] Failed to measure step "${step.id}".`,
          error,
        );

        return false;
      }
    },
    [],
  );

  const resolveFlowTargetStep = useCallback(
    async (
      index: number,
      action: Exclude<WalkitTransitionAction, 'stop'>,
      activationId: number,
    ): Promise<WalkitStepData | null> => {
      const flowSteps = getFlowStepsSnapshot();
      const targetStep = flowSteps[index];

      if (!targetStep) {
        return null;
      }

      const registeredStep = stepsRef.current[targetStep.id];

      if (registeredStep) {
        return registeredStep;
      }

      const onFlowStepChange = configRef.current.onFlowStepChange;

      if (!onFlowStepChange) {
        console.warn(
          `[runilib/react-walkit] Step "${targetStep.id}" is not mounted. Add provider "steps" and "onFlowStepChange" to continue the tour across pages/screens.`,
        );
        return null;
      }

      const activeFlowStepId =
        activeStepIdRef.current ?? currentStepRef.current?.id ?? null;

      const fromStep = flowSteps.find((step) => step.id === activeFlowStepId) ?? null;

      activeStepIdRef.current = null;
      if (visibleRef.current) {
        setCurrentRect(null);
      }

      await onFlowStepChange({
        action,
        toStep: targetStep,
        fromStep,
      });

      if (activationId !== activationIdRef.current) {
        return null;
      }

      const awaitedStep = await waitForStepRegistration(
        targetStep.id,
        configRef.current.stepMountTimeoutMs ?? DEFAULT_STEP_MOUNT_TIMEOUT_MS,
      );

      if (activationId !== activationIdRef.current) {
        return null;
      }

      if (!awaitedStep) {
        console.warn(
          `[runilib/react-walkit] Timed out waiting for step "${targetStep.id}" to mount after "onFlowStepChange".`,
        );
        return null;
      }

      return awaitedStep;
    },
    [getFlowStepsSnapshot, waitForStepRegistration],
  );

  const activateStep = useCallback(
    async (
      index: number,
      options: {
        action: Exclude<WalkitTransitionAction, 'stop'>;
        emitStepChange?: boolean;
      },
    ): Promise<boolean> => {
      const flowSteps = getFlowStepsSnapshot();
      const targetFlowStep = flowSteps[index];

      if (!targetFlowStep) {
        return false;
      }

      const activationId = ++activationIdRef.current;
      transitionInFlightRef.current = true;

      try {
        const resolvedStep = await resolveFlowTargetStep(
          index,
          options.action,
          activationId,
        );

        if (!resolvedStep || activationId !== activationIdRef.current) {
          return false;
        }

        const didShow = await showStep(
          index,
          resolvedStep,
          activationId,
          sortSteps(stepsRef.current),
        );

        if (didShow && options.emitStepChange !== false) {
          configRef.current.onStepChange?.(resolvedStep, index);
        }

        return didShow;
      } finally {
        if (activationId === activationIdRef.current) {
          transitionInFlightRef.current = false;
        }
      }
    },
    [getFlowStepsSnapshot, resolveFlowTargetStep, showStep],
  );

  const measureAndShow = useCallback(
    async (index: number, _steps?: WalkitStepData[]): Promise<void> => {
      await activateStep(index, {
        action: 'goTo',
        emitStepChange: false,
      });
    },
    [activateStep],
  );

  const start = useCallback(
    async (stepName?: string): Promise<void> => {
      if (startInFlightRef.current || transitionInFlightRef.current) {
        return;
      }

      startInFlightRef.current = true;

      try {
        const flowSteps = getFlowStepsSnapshot();

        if (!flowSteps.length) {
          return;
        }

        let nextIndex = 0;

        if (stepName) {
          const foundIndex = findFlowStepIndex(flowSteps, stepName);

          if (foundIndex >= 0) {
            nextIndex = foundIndex;
          }
        }

        setLastAction('start');
        setLastStopReason(null);
        configRef.current.onStart?.();
        await activateStep(nextIndex, { action: 'start' });
      } finally {
        startInFlightRef.current = false;
      }
    },
    [activateStep, getFlowStepsSnapshot],
  );

  const stop = useCallback((): void => {
    activationIdRef.current += 1;
    activeStepIdRef.current = null;
    transitionInFlightRef.current = false;
    setVisible(false);
    setCurrentRect(null);
    setCurrentStep(null);
    setCurrentIndex(0);
    setLastAction('stop');
    setLastStopReason((previous) => previous ?? 'abandon');
    configRef.current.onStop?.();
  }, []);

  const next = useCallback(
    async (_steps?: WalkitStepData[]): Promise<void> => {
      if (transitionInFlightRef.current) {
        return;
      }

      const flowSteps = getFlowStepsSnapshot();

      if (!flowSteps.length) {
        return;
      }

      if (currentIndexRef.current >= flowSteps.length - 1) {
        setLastAction('stop');
        setLastStopReason('complete');
        stop();
        return;
      }

      const nextIndex = currentIndexRef.current + 1;
      setLastAction('next');

      const didShow = await activateStep(nextIndex, { action: 'next' });

      if (!didShow) {
        stop();
      }
    },
    [activateStep, getFlowStepsSnapshot, stop],
  );

  const prev = useCallback(
    async (_steps?: WalkitStepData[]): Promise<void> => {
      if (transitionInFlightRef.current) {
        return;
      }

      const flowSteps = getFlowStepsSnapshot();

      if (!flowSteps.length) {
        return;
      }

      if (currentIndexRef.current <= 0) {
        return;
      }

      const previousIndex = currentIndexRef.current - 1;
      setLastAction('prev');

      const didShow = await activateStep(previousIndex, { action: 'prev' });

      if (!didShow) {
        stop();
      }
    },
    [activateStep, getFlowStepsSnapshot, stop],
  );

  const goTo = useCallback(
    async (index: number): Promise<void> => {
      if (transitionInFlightRef.current) {
        return;
      }

      const flowSteps = getFlowStepsSnapshot();

      if (index < 0 || index >= flowSteps.length) {
        return;
      }

      setLastAction('goTo');

      const didShow = await activateStep(index, { action: 'goTo' });

      if (!didShow) {
        stop();
      }
    },
    [activateStep, getFlowStepsSnapshot, stop],
  );

  const flowSteps = useMemo(() => {
    if (config.steps?.length) {
      return normalizeFlowSteps(config.steps);
    }

    return normalizeFlowSteps(sortedSteps.map(toFlowStep));
  }, [config.steps, sortedSteps]);

  const totalSteps = flowSteps.length;

  useEffect(() => {
    return () => {
      if (autoStartTimeoutRef.current) {
        clearTimeout(autoStartTimeoutRef.current);
        autoStartTimeoutRef.current = null;
      }

      for (const waiters of stepWaitersRef.current.values()) {
        for (const resolve of waiters) {
          resolve(undefined);
        }
      }

      stepWaitersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const activeStepId = activeStepIdRef.current;

    if (!activeStepId) {
      return;
    }

    const activeStepStillRegistered = sortedSteps.some(
      (step) => step.id === activeStepId,
    );

    if (!activeStepStillRegistered) {
      stop();
    }
  }, [sortedSteps, stop, visible]);

  useEffect(() => {
    if (autoStartTimeoutRef.current) {
      clearTimeout(autoStartTimeoutRef.current);
      autoStartTimeoutRef.current = null;
    }

    const autoStartStep = sortedSteps.find((step) => {
      if (!step.autoStart) {
        return false;
      }

      if (autoStartAttemptedRef.current.has(step.id)) {
        return false;
      }

      return (
        step.autoStart.mode !== 'once' || !hasSeenWalkitAutoStart(step.autoStart.key)
      );
    });

    if (!autoStartStep) {
      return;
    }

    const autoStartConfig = autoStartStep.autoStart;

    if (!autoStartConfig) {
      return;
    }

    autoStartTimeoutRef.current = globalThis.setTimeout(() => {
      autoStartTimeoutRef.current = null;

      if (
        visibleRef.current ||
        startInFlightRef.current ||
        transitionInFlightRef.current
      ) {
        return;
      }

      const latestSteps = sortSteps(stepsRef.current);
      const latestStep = latestSteps.find((step) => step.id === autoStartStep.id);

      if (!latestStep?.autoStart) {
        return;
      }

      if (autoStartAttemptedRef.current.has(latestStep.id)) {
        return;
      }

      if (
        latestStep.autoStart.mode === 'once' &&
        hasSeenWalkitAutoStart(latestStep.autoStart.key)
      ) {
        autoStartAttemptedRef.current.add(latestStep.id);
        return;
      }

      autoStartAttemptedRef.current.add(latestStep.id);

      if (latestStep.autoStart.mode === 'once') {
        rememberWalkitAutoStart(latestStep.autoStart.key);
      }

      void start(latestStep.id);
    }, autoStartConfig.delay);

    return () => {
      if (autoStartTimeoutRef.current) {
        clearTimeout(autoStartTimeoutRef.current);
        autoStartTimeoutRef.current = null;
      }
    };
  }, [sortedSteps, start]);

  const value: WalkitContextValue = useMemo(
    () => ({
      sortedSteps,
      currentIndex,
      currentStep,
      currentRect,
      totalSteps,
      visible,
      config,
      registerStep,
      unregisterStep,
      start,
      stop,
      next,
      prev,
      goTo,
      measureAndShow,
      lastAction,
      lastStopReason,
    }),
    [
      sortedSteps,
      currentIndex,
      currentStep,
      currentRect,
      totalSteps,
      visible,
      config,
      registerStep,
      unregisterStep,
      start,
      stop,
      next,
      prev,
      goTo,
      measureAndShow,
      lastAction,
      lastStopReason,
    ],
  );

  return <WalkitContext.Provider value={value}>{children}</WalkitContext.Provider>;
};

export function useWalkitContext(): WalkitContextValue {
  const context = useContext(WalkitContext);

  if (!context) {
    throw new Error(
      '[runilib/react-walkit] useWalkitContext must be used inside <WalkitProvider>.',
    );
  }

  return context;
}

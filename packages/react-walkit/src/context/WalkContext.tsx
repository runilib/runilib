import { createContext, type ReactNode, useCallback, useContext, useRef, useState } from "react";

import type { TargetRect, WalkConfig, WalkContextValue, WalkStepData } from "../types/Walk.types";

const WalkContext = createContext<WalkContextValue | null>(null);

interface TooltipContextProviderProps {
  children: ReactNode;
  config: WalkConfig;
}

const sortSteps = (stepMap: Record<string, WalkStepData>): WalkStepData[] =>
  Object.values(stepMap).sort((firstStep, secondStep) => firstStep.order - secondStep.order);

export const WalkContextProvider = ({ children, config }: TooltipContextProviderProps) => {
  const stepsRef = useRef<Record<string, WalkStepData>>({});
  const configRef = useRef(config);
  const activationIdRef = useRef(0);

  configRef.current = config;

  const [sortedSteps, setSortedSteps] = useState<WalkStepData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentRect, setCurrentRect] = useState<TargetRect | null>(null);

  const registerStep = useCallback((step: WalkStepData): void => {
    stepsRef.current[step.id] = step;
    setSortedSteps(sortSteps(stepsRef.current));
  }, []);

  const unregisterStep = useCallback((id: string): void => {
    delete stepsRef.current[id];
    setSortedSteps(sortSteps(stepsRef.current));
  }, []);

  const measureAndShow = useCallback(
    async (index: number, providedSteps?: WalkStepData[]): Promise<void> => {
      const steps = providedSteps ?? sortSteps(stepsRef.current);
      const step = steps[index];

      if (!step) {
        setCurrentRect(null);
        setVisible(false);
        return;
      }

      const activationId = ++activationIdRef.current;

      setVisible(false);

      try {
        await step.ensureVisible?.();

        const rect = await step.measure();

        if (activationId !== activationIdRef.current) {
          return;
        }

        setSortedSteps(steps);
        setCurrentIndex(index);
        setCurrentRect(rect);
        setVisible(true);
      } catch (error) {
        if (activationId !== activationIdRef.current) {
          return;
        }

        setSortedSteps(steps);
        setCurrentIndex(index);
        setCurrentRect(null);
        setVisible(false);

        console.warn(`[runilib/react-walkit] Failed to measure step "${step.id}".`, error);
      }
    },
    []
  );

  const activateStep = useCallback(
    async (
      index: number,
      providedSteps?: WalkStepData[],
      options?: {
        emitStepChange?: boolean;
      }
    ): Promise<void> => {
      const steps = providedSteps ?? sortSteps(stepsRef.current);
      const step = steps[index];

      if (!step) {
        return;
      }

      await measureAndShow(index, steps);

      if (options?.emitStepChange !== false) {
        configRef.current.onStepChange?.(step, index);
      }
    },
    [measureAndShow]
  );

  const start = useCallback(
    async (stepName?: string): Promise<void> => {
      const steps = sortSteps(stepsRef.current);

      if (!steps.length) {
        return;
      }

      let nextIndex = 0;

      if (stepName) {
        const foundIndex = steps.findIndex((step) => step.id === stepName);
        if (foundIndex >= 0) {
          nextIndex = foundIndex;
        }
      }

      configRef.current.onStart?.();
      await activateStep(nextIndex, steps);
    },
    [activateStep]
  );

  const stop = useCallback((): void => {
    activationIdRef.current += 1;
    setVisible(false);
    setCurrentRect(null);
    setCurrentIndex(0);
    configRef.current.onStop?.();
  }, []);

  const next = useCallback(async (): Promise<void> => {
    const steps = sortSteps(stepsRef.current);

    if (!steps.length) {
      return;
    }

    if (currentIndex >= steps.length - 1) {
      stop();
      return;
    }

    const nextIndex = currentIndex + 1;
    await activateStep(nextIndex, steps);
  }, [activateStep, currentIndex, stop]);

  const prev = useCallback(async (): Promise<void> => {
    const steps = sortSteps(stepsRef.current);

    if (!steps.length) {
      return;
    }

    if (currentIndex <= 0) {
      return;
    }

    const previousIndex = currentIndex - 1;
    await activateStep(previousIndex, steps);
  }, [activateStep, currentIndex]);

  const goTo = useCallback(
    async (index: number): Promise<void> => {
      const steps = sortSteps(stepsRef.current);

      if (index < 0 || index >= steps.length) {
        return;
      }

      await activateStep(index, steps);
    },
    [activateStep]
  );

  const currentStep = sortedSteps[currentIndex] ?? null;

  const value: WalkContextValue = {
    sortedSteps,
    currentIndex,
    currentStep,
    currentRect,
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
  };

  return <WalkContext.Provider value={value}>{children}</WalkContext.Provider>;
};

export function useWalkContext(): WalkContextValue {
  const context = useContext(WalkContext);

  if (!context) {
    throw new Error("[runilib/react-walkit] useWalkContext must be used inside <WalkProvider>.");
  }

  return context;
}

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import type { TooltipConfig, TooltipContextValue, TooltipRect, TooltipStepData } from "../types";

// ─── Context ──────────────────────────────────────────────────────────────────

const TooltipContext = createContext<TooltipContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
interface TooltipContextProviderProps {
  children: ReactNode;
  config: TooltipConfig;
}

const sorted = (map: Record<string, TooltipStepData>): TooltipStepData[] =>
  Object.values(map).sort((a, b) => a.order - b.order);

export const TooltipContextProvider = ({ children, config }: TooltipContextProviderProps) => {
  const stepsRef = useRef<Record<string, TooltipStepData>>({});

  const [sortedSteps, setSortedSteps] = useState<TooltipStepData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentRect, setCurrentRect] = useState<TooltipRect | null>(null);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  // ─── Step registration ───────────────────────────────────────────────────────
  const registerStep = useCallback((step: TooltipStepData): void => {
    stepsRef.current[step.name] = step;
    setSortedSteps(sorted(stepsRef.current));
  }, []);

  const unregisterStep = useCallback((name: string): void => {
    delete stepsRef.current[name];
    setSortedSteps(sorted(stepsRef.current));
  }, []);

  // ─── Measure ─────────────────────────────────────────────────────────────────

  const measureAndShow = useCallback(
    async (index: number, steps: TooltipStepData[]): Promise<void> => {
      const step = steps[index];
      if (!step) return;
      try {
        const rect = await step.measure();
        setCurrentRect(rect);
      } catch {
        setCurrentRect(null);
      }
    },
    []
  );

  // ─── Tour control ─────────────────────────────────────────────────────────────

  const start = useCallback(
    async (stepName?: string): Promise<void> => {
      const list = sorted(stepsRef.current);
      setSortedSteps(list);

      let idx = 0;
      if (stepName) {
        const found = list.findIndex((s) => s.name === stepName);
        if (found >= 0) idx = found;
      }

      setCurrentIndex(idx);
      setVisible(true);
      config.onStart?.();
      await measureAndShow(idx, list);
    },
    [config, measureAndShow]
  );

  const stop = useCallback((): void => {
    setVisible(false);
    setCurrentRect(null);
    setCurrentIndex(0);
    config.onStop?.();
  }, [config]);

  const next = useCallback(
    async (steps?: TooltipStepData[]): Promise<void> => {
      const list = steps ?? sortedSteps;
      if (currentIndex >= list.length - 1) {
        stop();
        return;
      }
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      config.onStepChange?.(list[nextIdx], nextIdx);
      await measureAndShow(nextIdx, list);
    },
    [currentIndex, sortedSteps, stop, config, measureAndShow]
  );

  const prev = useCallback(
    async (steps?: TooltipStepData[]): Promise<void> => {
      const list = steps ?? sortedSteps;
      if (currentIndex <= 0) return;
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      config.onStepChange?.(list[prevIdx], prevIdx);
      await measureAndShow(prevIdx, list);
    },
    [currentIndex, sortedSteps, config, measureAndShow]
  );

  const goTo = useCallback(
    async (index: number): Promise<void> => {
      const list = sortedSteps;
      if (index < 0 || index >= list.length) return;
      setCurrentIndex(index);
      config.onStepChange?.(list[index], index);
      await measureAndShow(index, list);
    },
    [sortedSteps, config, measureAndShow]
  );

  const currentStep = sortedSteps[currentIndex] ?? null;

  const value: TooltipContextValue = {
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

  return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTooltipContext(): TooltipContextValue {
  const ctx = useContext(TooltipContext);
  if (!ctx) {
    throw new Error("[universal-copilot] useTooltipContext must be used inside <TooltipProvider>.");
  }
  return ctx;
}

import { useTooltipContext } from "../context/TooltipContext";
import type { UseTooltipReturn } from "../types";

/**
 * `useCopilot` — main hook to control the onboarding tour.
 *
 * Must be used inside a `<CopilotProvider>`.
 *
 * @example
 * const { start, stop, isRunning, currentStep, totalSteps } = useCopilot();
 *
 * // Start the tour from the beginning
 * <button onClick={() => start()}>Start Tour</button>
 *
 * // Start from a specific step
 * <button onClick={() => start('my-step')}>Resume</button>
 */
export function useTooltip(): UseTooltipReturn {
  const {
    sortedSteps,
    currentIndex,
    currentStep,
    currentRect,
    visible,
    start,
    stop,
    next,
    prev,
    goTo,
  } = useTooltipContext();

  return {
    start,
    stop,
    next: () => {
      next();
    },
    prev: () => {
      prev();
    },
    goTo,
    currentStep,
    currentRect,
    isRunning: visible,
    totalSteps: sortedSteps.length,
    currentIndex,
    isFirstStep: currentIndex === 0,
    isLastStep: currentIndex === sortedSteps.length - 1,
  };
}

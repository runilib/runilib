import { useWalkContext } from "../context/WalkContext";
import type { UseWalkReturn } from "../types/Walk.types";

/**
 * `useWalk` — main hook to control the onboarding tour.
 *
 * Must be used inside a `<WalkProvider>`.
 *
 * @example
 * const { start, stop, isRunning, currentStep, totalSteps } = useWalk();
 *
 * // Start the tour from the beginning
 * <button onClick={() => start()}>Start Tour</button>
 *
 * // Start from a specific step
 * <button onClick={() => start('my-step')}>Resume</button>
 */
export function useWalk(): UseWalkReturn {
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
  } = useWalkContext();

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

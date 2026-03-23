import { useWalkitContext } from '../context/WalkitContext';
import type { UseWalkitReturn } from '../types/Walkit.types';

/**
 * `useWalkit` — main hook to control the onboarding tour.
 *
 * Must be used inside a `<WalkitProvider>`.
 *
 * @example
 * const { start, stop, isRunning, currentStep, totalSteps } = useWalkit();
 *
 * // Start the tour from the beginning
 * <button onClick={() => start()}>Start Tour</button>
 *
 * // Start from a specific step
 * <button onClick={() => start('my-step')}>Resume</button>
 */
export function useWalkit(): UseWalkitReturn {
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
  } = useWalkitContext();

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

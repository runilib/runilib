import { useWalkitContext } from '../context/WalkitContext';
import type { UseWalkitReturn } from '../types/Walkit.types';

/**
 * `useWalkit` - main hook to control the onboarding tour.
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
    totalSteps,
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
    totalSteps,
    currentIndex,
    isFirstStep: totalSteps > 0 && currentIndex === 0,
    isLastStep: totalSteps > 0 && currentIndex === totalSteps - 1,
  };
}

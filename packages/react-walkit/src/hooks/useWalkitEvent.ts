import { useEffect, useRef } from 'react';

import { useWalkitContext } from '../context/WalkitContext';
import type { WalkitEventHandlers } from '../types/analitycs.types';
import type { WalkitStepData } from '../types/Walkit.types';

type ActiveStepSnapshot = {
  step: WalkitStepData;
  index: number;
  enteredAtMs: number;
};

export function useWalkitEvent(handlers: WalkitEventHandlers): void {
  const { visible, currentStep, currentIndex, totalSteps, lastAction, lastStopReason } =
    useWalkitContext();

  const activeStepRef = useRef<ActiveStepSnapshot | null>(null);
  const tourStartedAtRef = useRef<number | null>(null);
  const previousVisibleRef = useRef<boolean>(false);

  useEffect(() => {
    const now = Date.now();

    // Tour just started
    if (visible && !previousVisibleRef.current) {
      tourStartedAtRef.current = now;
    }

    // Step changed or entered
    if (visible && currentStep) {
      const previous = activeStepRef.current;

      const isNewStep =
        !previous ||
        previous.step.id !== currentStep.id ||
        previous.index !== currentIndex;

      if (isNewStep) {
        if (previous) {
          handlers.onStepExit?.({
            step: previous.step,
            index: previous.index,
            totalSteps,
            durationMs: now - previous.enteredAtMs,
            skipped: lastAction === 'goTo',
          });
        }

        activeStepRef.current = {
          step: currentStep,
          index: currentIndex,
          enteredAtMs: now,
        };

        handlers.onStepEnter?.({
          step: currentStep,
          index: currentIndex,
          totalSteps,
        });
      }
    }

    // Tour just stopped
    if (!visible && previousVisibleRef.current) {
      const activeStep = activeStepRef.current;
      const tourStartedAt = tourStartedAtRef.current;

      if (activeStep) {
        handlers.onStepExit?.({
          step: activeStep.step,
          index: activeStep.index,
          totalSteps,
          durationMs: now - activeStep.enteredAtMs,
          skipped: false,
        });
      }

      if (tourStartedAt != null) {
        const totalDurationMs = now - tourStartedAt;

        if (lastStopReason === 'complete') {
          handlers.onTourComplete?.({
            totalDurationMs,
            stepCount: totalSteps,
          });
        } else if (activeStep) {
          handlers.onTourAbandon?.({
            lastStep: activeStep.step,
            lastIndex: activeStep.index,
            durationMs: totalDurationMs,
          });
        }
      }

      activeStepRef.current = null;
      tourStartedAtRef.current = null;
    }

    previousVisibleRef.current = visible;
  }, [
    visible,
    currentStep,
    currentIndex,
    totalSteps,
    lastAction,
    lastStopReason,
    handlers,
  ]);
}

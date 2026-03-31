import { useWalkitEvent } from '@runilib/react-walkit';

export function AnalyticsLayer() {
  useWalkitEvent({
    onStepEnter: ({ step, index, totalSteps }) => {
      console.log('tour_step_view', {
        step: step.id,
        index,
        total: totalSteps,
      });
    },

    onStepExit: ({ step, durationMs, skipped }) => {
      console.log('tour_step_exit', {
        step: step.id,
        duration: durationMs,
        skipped,
      });
    },

    onTourComplete: ({ totalDurationMs, stepCount }) => {
      console.log('tour_completed', {
        duration: totalDurationMs,
        steps: stepCount,
      });
    },

    onTourAbandon: ({ lastStep, lastIndex, durationMs }) => {
      console.log('tour_abandoned', {
        lastStep: lastStep.id,
        at: lastIndex,
        after: durationMs,
      });
    },
  });

  return null;
}

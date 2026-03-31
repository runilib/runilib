import type { WalkitStepData } from './Walkit.types';

export type WalkitStopReason = 'complete' | 'abandon' | 'unknown';

export type WalkitTransitionAction = 'start' | 'next' | 'prev' | 'goTo' | 'stop';

export type WalkitStepEnterEvent = {
  step: WalkitStepData;
  index: number;
  totalSteps: number;
};

export type WalkitStepExitEvent = {
  step: WalkitStepData;
  index: number;
  totalSteps: number;
  durationMs: number;
  skipped: boolean;
};

export type WalkitTourCompleteEvent = {
  totalDurationMs: number;
  stepCount: number;
};

export type WalkitTourAbandonEvent = {
  lastStep: WalkitStepData;
  lastIndex: number;
  durationMs: number;
};

export interface WalkitEventHandlers {
  onStepEnter?: (event: WalkitStepEnterEvent) => void;
  onStepExit?: (event: WalkitStepExitEvent) => void;
  onTourComplete?: (event: WalkitTourCompleteEvent) => void;
  onTourAbandon?: (event: WalkitTourAbandonEvent) => void;
}

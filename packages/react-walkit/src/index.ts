/**
 * runilib/react-walkit
 * ──────────────────
 * Cross-platform Tooltip / onboarding / guided tour library.
 * Works identically on React (web) and React Native - same API, no changes needed.
 *
 * @see https://github.com/runilib/react-walkit
 *
 * @example
 * import { WalkitProvider, Tooltip, useWalkit } from '@runilib/react-walkit';
 */

// ─── Public API ───────────────────────────────────────────────────────────────
export { ANIMATION_TYPES } from './animations';
export { Tooltip } from './components/tooltip/tooltip.web';
export { WalkitStep } from './components/walkit/web/WalkitStep.web';
export { useWalkit } from './hooks/useWalkit';
export { useWalkitEvent } from './hooks/useWalkitEvent';
export { WalkitProvider } from './providers/WalkitProvider.web';
export type {
  WalkitEventHandlers,
  WalkitStepEnterEvent,
  WalkitStepExitEvent,
  WalkitStopReason,
  WalkitTourAbandonEvent,
  WalkitTourCompleteEvent,
  WalkitTransitionAction,
} from './types/analitycs.types';
export type {
  TooltipContentApi,
  TooltipPlacement,
  TooltipProps,
} from './types/Tooltip.types';
export type {
  Placement,
  RenderWalkitStepProps,
  TargetRect,
  WalkitAutoStart,
  WalkitAutoStartMode,
  WalkitAutoStartOptions,
  WalkitFlowChangeRequest,
  WalkitFlowStep,
  WalkitProviderProps,
  WalkitStepProps,
} from './types/Walkit.types';

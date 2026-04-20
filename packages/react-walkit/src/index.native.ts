/**
 * runilib/react-walkit
 * ──────────────────
 * Cross-platform onboarding / guided tour library.
 * Works identically on React (web) and React Native - same API, no changes needed.
 *
 * @see https://github.com/your-org/runilib
 *
 * @example
 * import { WalkitProvider, Tooltip, useWalkit } from 'react-walkit';
 */

export { ANIMATION_TYPES } from './animations';
export { Tooltip } from './components/tooltip/Tooltip.native';
export {
  type NativeWalkitStepProps as WalkitStepProps,
  WalkitStep,
} from './components/walkit/native/WalkitStep.native';
export { useWalkit } from './hooks/useWalkit';
export { useWalkitEvent } from './hooks/useWalkitEvent';
export { WalkitProvider } from './providers/WalkitProvider.native';
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
} from './types/Walkit.types';

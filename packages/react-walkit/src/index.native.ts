/**
 * runilib/react-walkit
 * ──────────────────
 * Cross-platform onboarding / guided tour library.
 * Works identically on React (web) and React Native — same API, no changes needed.
 *
 * @see https://github.com/your-org/runilib
 *
 * @example
 * import { WalkitProvider, Tooltip, useWalkit } from 'react-walkit';
 */

export { ANIMATION_TYPES } from './animations';
export { Tooltip } from './components/tooltip/Tooltip.native';
export {
  type NativeTooltipStepProps as WalkitStepProps,
  WalkitStep,
} from './components/walkit/WalkitStep.native';
export { useWalkit } from './hooks/useWalkit';
export { WalkitProvider } from './providers/WalkitProvider.native';
export type {
  TooltipApi,
  TooltipContentApi,
  TooltipPlacement,
  TooltipProps,
} from './types/Tooltip.types';
export type {
  Placement,
  TargetRect,
  WalkitProviderProps,
} from './types/Walkit.types';

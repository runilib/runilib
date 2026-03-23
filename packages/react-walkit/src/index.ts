/**
 * runilib/react-walkit
 * ──────────────────
 * Cross-platform Tooltip / onboarding / guided tour library.
 * Works identically on React (web) and React Native — same API, no changes needed.
 *
 * @see https://github.com/your-org/runilib
 *
 * @example
 * import { WalkitProvider, Tooltip, useWalkit } from 'react-walkit';
 */

// ─── Public API ───────────────────────────────────────────────────────────────
export { ANIMATION_TYPES } from './animations';
export { Tooltip } from './components/tooltip/tooltip.web';
export { WalkitStep } from './components/walkit/WalkitStep.web';
export { useWalkit } from './hooks/useWalkit';
export { WalkitProvider } from './providers/WalkitProvider.web';
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
  WalkitStepProps,
} from './types/Walkit.types';

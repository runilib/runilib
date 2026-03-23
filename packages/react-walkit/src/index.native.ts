/**
 * runilib/react-walkit
 * ──────────────────
 * Cross-platform onboarding / guided tour library.
 * Works identically on React (web) and React Native — same API, no changes needed.
 *
 * @see https://github.com/your-org/runilib
 *
 * @example
 * import { WalkProvider, Tooltip, useWalk } from 'universal-copilot';
 */

export { ANIMATION_TYPES } from "./animations";
export { Tooltip } from "./components/tooltip/Tooltip.native";
export { WalkStep, type NativeTooltipStepProps as WalkStepProps} from "./components/walk/WalkStep.native";
export { useWalk } from "./hooks/useWalk";
export { WalkProvider } from "./providers/WalkProvider.native";
export type {
  TooltipApi,
  TooltipContentApi,
  TooltipPlacement,
  TooltipProps,
} from "./types/Tooltip.types";
export type {
  Placement,
  TargetRect,
  WalkProviderProps,
} from "./types/Walk.types";

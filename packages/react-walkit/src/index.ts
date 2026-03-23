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

// ─── Public API ───────────────────────────────────────────────────────────────
export { ANIMATION_TYPES } from "./animations";
export { Tooltip } from "./components/tooltip/tooltip.web";
export { WalkStep } from "./components/walk/WalkStep.web";
export { useWalk } from "./hooks/useWalk";
export { WalkProvider } from "./providers/WalkProvider.web";
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
  WalkStepProps,
} from "./types/Walk.types";

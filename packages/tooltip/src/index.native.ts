/**
 * runilib/tooltip
 * ──────────────────
 * Cross-platform onboarding / guided tour library.
 * Works identically on React (web) and React Native — same API, no changes needed.
 *
 * @see https://github.com/your-org/runilib
 *
 * @example
 * import { TooltipProvider, Tooltip, useTooltip } from 'universal-copilot';
 */

export { ANIMATION_TYPES } from "./animations";
export { TooltipProvider } from "./components/TooltipProvider.native";
export { TooltipStep } from "./components/tooltip/TooltipStep.native";
export { useTooltip } from "./hooks/useTooltip";

export type {
  TooltipPlacement,
  TooltipProviderProps,
  TooltipRect,
  TooltipStepProps,
} from "./types";

/**
 * universal-copilot
 * ──────────────────
 * Cross-platform onboarding / guided tour library.
 * Works identically on React (web) and React Native — same API, no changes needed.
 *
 * @see https://github.com/your-org/universal-copilot
 *
 * @example
 * import { TooltipProvider, Tooltip, useTooltip } from 'universal-copilot';
 */

// ─── Public API ───────────────────────────────────────────────────────────────
export { ANIMATION_TYPES } from "./animations";
export { TooltipProvider } from "./components/TooltipProvider";
export { TooltipStep } from "./components/tooltip/TooltipStep";
export { useTooltip } from "./hooks/useTooltip";

// ─── Advanced / internal ──────────────────────────────────────────────────────

// export { useTooltipContext } from "./context/TooltipContext";

// ─── Types (re-exported for consumers) ───────────────────────────────────────

export type {
  AnimationType,
  RenderTooltipProps,
  TooltipLabels,
  TooltipPlacement,
  TooltipProviderProps,
  TooltipRect,
  TooltipStepData,
  TooltipStepProps,
  TooltipTheme,
  UseTooltipReturn,
} from "./types";

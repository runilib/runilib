import type { Placement, SpotlightRect } from "../types/Walk.types";

import {
  computeFloatingPosition,
  type FloatingPositionResult,
  type SizeLike,
  WALK_POSITION_DEFAULTS,
} from "./positioning.shared";

export type WalkStepSize = SizeLike;

export type WalkPositionResult = {
  top: number;
  left: number;
  placement: Exclude<Placement, "auto">;
  arrowOffset: number;
};

/**
 * Walkthrough-compatible wrapper around the shared positioning engine.
 *
 * Keeps the existing return shape (`arrowOffset`) to avoid regressions.
 */
export function computeTooltipPosition(
  target: SpotlightRect,
  walkStepSize: WalkStepSize,
  preferredPlacement: Placement,
  screenWidth: number,
  screenHeight: number
): WalkPositionResult {
  const result: FloatingPositionResult = computeFloatingPosition({
    targetRect: target,
    floatingSize: walkStepSize,
    preferredPlacement,
    screenWidth,
    screenHeight,
    options: WALK_POSITION_DEFAULTS,
  });

  return {
    top: result.top,
    left: result.left,
    placement: result.placement,
    arrowOffset: result.offset,
  };
}

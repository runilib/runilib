import type { TooltipPlacement } from '../types/Tooltip.types';
import {
  computeFloatingPosition,
  type FloatingPositionResult,
  type RectLike,
  type SizeLike,
  TOOLTIP_POSITION_DEFAULTS,
} from './positioning.shared';

export type TooltipComputedPosition = {
  top: number;
  left: number;
  placement: Exclude<TooltipPlacement, 'auto'>;
  /**
   * Center position of the anchor inside the tooltip shell.
   * Horizontal for top/bottom, vertical for left/right.
   */
  anchorOffset: number;
};

/**
 * Tooltip-compatible wrapper around the shared positioning engine.
 *
 * Keeps the existing return shape (`anchorOffset`) to avoid regressions.
 */
export function computeSimpleTooltipPosition(
  anchorRect: RectLike,
  tooltipSize: SizeLike,
  preferredPlacement: TooltipPlacement,
  screenWidth: number,
  screenHeight: number,
  offset = 10,
): TooltipComputedPosition {
  const result: FloatingPositionResult = computeFloatingPosition({
    targetRect: anchorRect,
    floatingSize: tooltipSize,
    preferredPlacement,
    screenWidth,
    screenHeight,
    options: {
      ...TOOLTIP_POSITION_DEFAULTS,
      gap: offset,
    },
  });

  return {
    top: result.top,
    left: result.left,
    placement: result.placement,
    anchorOffset: result.offset,
  };
}

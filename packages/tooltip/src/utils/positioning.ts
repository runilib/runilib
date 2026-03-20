import type { SpotlightRect, TooltipPlacement, TooltipPosition, TooltipRect } from "../types";

const TOOLTIP_MARGIN = 14;
const SCREEN_PADDING = 10;

interface Size {
  width: number;
  height: number;
}

interface Candidate {
  top: number;
  left: number;
  placement: TooltipPlacement;
  fits: boolean;
}

/**
 * Compute the best tooltip position given a target rect and viewport dimensions.
 * Works for both web (viewport px) and native (screen dp).
 */
export function computeTooltipPosition(
  targetRect: TooltipRect,
  tooltipSize: Size,
  placement: TooltipPlacement = "auto",
  screenWidth: number = 375,
  screenHeight: number = 812
): TooltipPosition {
  const { x, y, width, height } = targetRect;
  const tw = tooltipSize.width;
  const th = tooltipSize.height;

  const candidates: Record<string, Candidate> = {
    bottom: {
      top: y + height + TOOLTIP_MARGIN,
      left: clamp(x + width / 2 - tw / 2, SCREEN_PADDING, screenWidth - tw - SCREEN_PADDING),
      placement: "bottom",
      fits: y + height + th + TOOLTIP_MARGIN < screenHeight - SCREEN_PADDING,
    },
    top: {
      top: y - th - TOOLTIP_MARGIN,
      left: clamp(x + width / 2 - tw / 2, SCREEN_PADDING, screenWidth - tw - SCREEN_PADDING),
      placement: "top",
      fits: y - th - TOOLTIP_MARGIN > SCREEN_PADDING,
    },
    right: {
      top: clamp(y + height / 2 - th / 2, SCREEN_PADDING, screenHeight - th - SCREEN_PADDING),
      left: x + width + TOOLTIP_MARGIN,
      placement: "right",
      fits: x + width + tw + TOOLTIP_MARGIN < screenWidth - SCREEN_PADDING,
    },
    left: {
      top: clamp(y + height / 2 - th / 2, SCREEN_PADDING, screenHeight - th - SCREEN_PADDING),
      left: x - tw - TOOLTIP_MARGIN,
      placement: "left",
      fits: x - tw - TOOLTIP_MARGIN > SCREEN_PADDING,
    },
  };

  let chosen: Candidate;

  if (placement === "auto") {
    chosen = candidates.bottom.fits
      ? candidates.bottom
      : candidates.top.fits
        ? candidates.top
        : candidates.right.fits
          ? candidates.right
          : candidates.left;
  } else {
    chosen = candidates[placement] ?? candidates.bottom;
  }

  const centerX = x + width / 2;
  const arrowOffset = clamp(centerX - chosen.left - tw / 2, -(tw / 2 - 20), tw / 2 - 20);

  return {
    top: chosen.top,
    left: chosen.left,
    placement: chosen.placement,
    arrowOffset,
  };
}

/** Returns the spotlight bounding rect with padding applied. */
export function getSpotlightRect(
  targetRect: TooltipRect,
  padding: number = 8,
  borderRadius: number = 8
): SpotlightRect {
  return {
    x: targetRect.x - padding,
    y: targetRect.y - padding,
    width: targetRect.width + padding * 2,
    height: targetRect.height + padding * 2,
    borderRadius,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

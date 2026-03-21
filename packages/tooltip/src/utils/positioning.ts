import type { SpotlightRect, TooltipPlacement, TooltipRect } from "../types";

const TOOLTIP_MARGIN = 14;
const SCREEN_PADDING = 10;

export type TooltipSize = {
  width: number;
  height: number;
};

export type TooltipPositionResult = {
  top: number;
  left: number;
  placement: Exclude<TooltipPlacement, "auto">;
  arrowOffset: number;
};

const SCREEN_MARGIN = 16;
const TOOLTIP_GAP = 12;
const ARROW_SIZE = 10;
const ARROW_EDGE_PADDING = 20;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

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

export function computeTooltipPosition(
  target: SpotlightRect,
  tooltipSize: TooltipSize,
  preferredPlacement: TooltipPlacement,
  screenWidth: number,
  screenHeight: number
): TooltipPositionResult {
  const targetCenterX = target.x + target.width / 2;
  const targetCenterY = target.y + target.height / 2;

  const canPlaceBottom =
    target.y + target.height + TOOLTIP_GAP + tooltipSize.height <= screenHeight - SCREEN_MARGIN;

  const canPlaceTop = target.y - TOOLTIP_GAP - tooltipSize.height >= SCREEN_MARGIN;

  const canPlaceRight =
    target.x + target.width + TOOLTIP_GAP + tooltipSize.width <= screenWidth - SCREEN_MARGIN;

  const canPlaceLeft = target.x - TOOLTIP_GAP - tooltipSize.width >= SCREEN_MARGIN;

  const resolvedPlacement: Exclude<TooltipPlacement, "auto"> = (() => {
    if (preferredPlacement !== "auto") {
      if (preferredPlacement === "bottom" && canPlaceBottom) return "bottom";
      if (preferredPlacement === "top" && canPlaceTop) return "top";
      if (preferredPlacement === "right" && canPlaceRight) return "right";
      if (preferredPlacement === "left" && canPlaceLeft) return "left";
    }

    if (canPlaceBottom) return "bottom";
    if (canPlaceTop) return "top";
    if (canPlaceRight) return "right";
    if (canPlaceLeft) return "left";

    return "bottom";
  })();

  if (resolvedPlacement === "bottom" || resolvedPlacement === "top") {
    const left = clamp(
      targetCenterX - tooltipSize.width / 2,
      SCREEN_MARGIN,
      screenWidth - SCREEN_MARGIN - tooltipSize.width
    );

    const top =
      resolvedPlacement === "bottom"
        ? target.y + target.height + TOOLTIP_GAP
        : target.y - tooltipSize.height - TOOLTIP_GAP;

    const arrowOffset = clamp(
      targetCenterX - left,
      ARROW_EDGE_PADDING,
      tooltipSize.width - ARROW_EDGE_PADDING
    );

    return {
      top,
      left,
      placement: resolvedPlacement,
      arrowOffset,
    };
  }

  const top = clamp(
    targetCenterY - tooltipSize.height / 2,
    SCREEN_MARGIN,
    screenHeight - SCREEN_MARGIN - tooltipSize.height
  );

  const left =
    resolvedPlacement === "right"
      ? target.x + target.width + TOOLTIP_GAP
      : target.x - tooltipSize.width - TOOLTIP_GAP;

  const arrowOffset = clamp(
    targetCenterY - top,
    ARROW_EDGE_PADDING,
    tooltipSize.height - ARROW_EDGE_PADDING
  );

  return {
    top,
    left,
    placement: resolvedPlacement,
    arrowOffset,
  };
}

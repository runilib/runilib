import type { SpotlightRect } from '../types/Walkit.types';

export type SpotlightRingRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
};

export type SpotlightPadding =
  | number
  | {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };

export function normalizeSpotlightPadding(padding: SpotlightPadding = 8) {
  if (typeof padding === 'number') {
    return {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding,
    };
  }

  return {
    top: padding.top ?? 8,
    right: padding.right ?? 8,
    bottom: padding.bottom ?? 8,
    left: padding.left ?? 8,
  };
}

export function getInnerSpotlightRingRect(
  spotlightRect: SpotlightRect,
  strokeWidth = 2,
): SpotlightRingRect {
  const inset = strokeWidth / 2;

  return {
    x: spotlightRect.x + inset,
    y: spotlightRect.y + inset,
    width: Math.max(0, spotlightRect.width - strokeWidth),
    height: Math.max(0, spotlightRect.height - strokeWidth),
    borderRadius: Math.max(0, spotlightRect.borderRadius - inset),
  };
}

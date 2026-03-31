import type { TooltipPlacement } from '../types/Tooltip.types';
import type {
  SpotlightRect,
  TargetRect,
  Placement as WalkitPlacement,
} from '../types/Walkit.types';
import { normalizeSpotlightPadding, type SpotlightPadding } from './spotlight';

/**
 * Shared placement union used by both walkthroughs and simple tooltips.
 *
 * Walkit and tooltip placements currently share the same literal values.
 */
export type SharedPlacement = WalkitPlacement | TooltipPlacement;

/**
 * Shared rectangle shape used by positioning utilities.
 */
export type RectLike = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Shared size shape used by positioning utilities.
 */
export type SizeLike = {
  width: number;
  height: number;
};

/**
 * Neutral shared positioning result.
 *
 * `offset` is:
 * - horizontal for top / bottom
 * - vertical for left / right
 */
export type FloatingPositionResult = {
  top: number;
  left: number;
  placement: Exclude<SharedPlacement, 'auto'>;
  offset: number;
};

/**
 * Runtime configuration for floating element positioning.
 */
export type FloatingPositionOptions = {
  screenMargin?: number;
  gap?: number;
  edgePadding?: number;
};

/**
 * Default config used by the walkthrough positioning engine.
 */
export const WALK_POSITION_DEFAULTS: Required<FloatingPositionOptions> = {
  screenMargin: 16,
  gap: 12,
  edgePadding: 20,
};

/**
 * Default config used by the simple tooltip positioning engine.
 */
export const TOOLTIP_POSITION_DEFAULTS: Required<FloatingPositionOptions> = {
  screenMargin: 12,
  gap: 10,
  edgePadding: 18,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Expands a raw target rectangle into a spotlight rectangle.
 *
 * Useful for walkthrough overlays where the highlighted area should include
 * extra padding around the target.
 */

export function getSpotlightRect(
  targetRect: TargetRect,
  padding: SpotlightPadding = 8,
  borderRadius = 8,
): SpotlightRect {
  const normalizedPadding = normalizeSpotlightPadding(padding);

  return {
    x: targetRect.x - normalizedPadding.left,
    y: targetRect.y - normalizedPadding.top,
    width: targetRect.width + normalizedPadding.left + normalizedPadding.right,
    height: targetRect.height + normalizedPadding.top + normalizedPadding.bottom,
    borderRadius,
  };
}
/**
 * Shared floating positioning engine used by both walkthrough popovers
 * and standalone tooltips.
 *
 * The function computes:
 * - final placement
 * - top / left coordinates
 * - inner arrow / anchor offset
 */
export function computeFloatingPosition({
  targetRect,
  floatingSize,
  preferredPlacement,
  screenWidth,
  screenHeight,
  options,
}: {
  targetRect: RectLike;
  floatingSize: SizeLike;
  preferredPlacement: SharedPlacement;
  screenWidth: number;
  screenHeight: number;
  options: FloatingPositionOptions;
}): FloatingPositionResult {
  const { screenMargin = 12, gap = 10, edgePadding = 18 } = options;

  const centerX = targetRect.x + targetRect.width / 2;
  const centerY = targetRect.y + targetRect.height / 2;

  const canPlaceBottom =
    targetRect.y + targetRect.height + gap + floatingSize.height <=
    screenHeight - screenMargin;

  const canPlaceTop = targetRect.y - gap - floatingSize.height >= screenMargin;

  const canPlaceRight =
    targetRect.x + targetRect.width + gap + floatingSize.width <=
    screenWidth - screenMargin;

  const canPlaceLeft = targetRect.x - gap - floatingSize.width >= screenMargin;

  const placement: Exclude<SharedPlacement, 'auto'> = (() => {
    if (preferredPlacement !== 'auto') {
      if (preferredPlacement === 'bottom' && canPlaceBottom) {
        return 'bottom';
      }
      if (preferredPlacement === 'top' && canPlaceTop) {
        return 'top';
      }
      if (preferredPlacement === 'right' && canPlaceRight) {
        return 'right';
      }
      if (preferredPlacement === 'left' && canPlaceLeft) {
        return 'left';
      }
    }

    if (canPlaceBottom) {
      return 'bottom';
    }
    if (canPlaceTop) {
      return 'top';
    }
    if (canPlaceRight) {
      return 'right';
    }
    if (canPlaceLeft) {
      return 'left';
    }

    return 'bottom';
  })();

  if (placement === 'top' || placement === 'bottom') {
    const left = clamp(
      centerX - floatingSize.width / 2,
      screenMargin,
      screenWidth - screenMargin - floatingSize.width,
    );

    const top =
      placement === 'bottom'
        ? targetRect.y + targetRect.height + gap
        : targetRect.y - floatingSize.height - gap;

    const offset = clamp(centerX - left, edgePadding, floatingSize.width - edgePadding);

    return {
      top,
      left,
      placement,
      offset,
    };
  }

  const top = clamp(
    centerY - floatingSize.height / 2,
    screenMargin,
    screenHeight - screenMargin - floatingSize.height,
  );

  const left =
    placement === 'right'
      ? targetRect.x + targetRect.width + gap
      : targetRect.x - floatingSize.width - gap;

  const offset = clamp(centerY - top, edgePadding, floatingSize.height - edgePadding);

  return {
    top,
    left,
    placement,
    offset,
  };
}

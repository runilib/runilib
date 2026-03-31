import type { Placement, SpotlightRect } from '../types/Walkit.types';
import {
  computeFloatingPosition,
  type FloatingPositionResult,
  type SizeLike,
  WALK_POSITION_DEFAULTS,
} from './positioning.shared';

export type WalkitStepSize = SizeLike;

export type WalkitPositionResult = {
  top: number;
  left: number;
  placement: Exclude<Placement, 'auto'>;
  arrowOffset: number;
};

/**
 * Walkitthrough-compatible wrapper around the shared positioning engine.
 *
 * Keeps the existing return shape (`arrowOffset`) to avoid regressions.
 */
export function computeWalkitStepPosition({
  target,
  walkitStepSize,
  preferredPlacement,
  screenWidth,
  screenHeight,
}: {
  target: SpotlightRect;
  walkitStepSize: WalkitStepSize;
  preferredPlacement: Placement;
  screenWidth: number;
  screenHeight: number;
}): WalkitPositionResult {
  const result: FloatingPositionResult = computeFloatingPosition({
    targetRect: target,
    floatingSize: walkitStepSize,
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

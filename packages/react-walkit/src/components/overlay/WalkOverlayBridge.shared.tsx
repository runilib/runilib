import { type ComponentType, useCallback } from "react";

import { useWalkContext } from "../../context/WalkContext";
import type { OverlayProps } from "../../types/Walk.types";

export type BridgeProps = Omit<
  OverlayProps,
  | "visible"
  | "currentRect"
  | "currentWalkStep"
  | "walkStepIndex"
  | "totalWalkSteps"
  | "onNext"
  | "onPrev"
  | "onStop"
>;

type SharedBridgeProps = BridgeProps & {
  OverlayComponent: ComponentType<OverlayProps>;
};

export function WalkOverlayBridgeShared({ OverlayComponent, ...props }: SharedBridgeProps) {
  const { sortedSteps, currentIndex, currentStep, currentRect, visible, next, prev, stop } =
    useWalkContext();

  const handleNext = useCallback(() => {
    next(sortedSteps);
  }, [next, sortedSteps]);

  const handlePrev = useCallback(() => {
    prev(sortedSteps);
  }, [prev, sortedSteps]);

  const overlayProps: OverlayProps = {
    ...props,
    visible,
    currentRect,
    currentWalkStep: currentStep,
    walkStepIndex: currentIndex,
    totalWalkSteps: sortedSteps.length,
    onNext: handleNext,
    onPrev: handlePrev,
    onStop: stop,
  };

  return <OverlayComponent {...overlayProps} />;
}

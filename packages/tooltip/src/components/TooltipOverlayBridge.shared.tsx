import { type ComponentType, useCallback } from "react";

import { useTooltipContext } from "../context/TooltipContext";
import type { OverlayProps } from "../types";

export type BridgeProps = Omit<
  OverlayProps,
  | "visible"
  | "currentRect"
  | "currentStep"
  | "stepIndex"
  | "totalSteps"
  | "onNext"
  | "onPrev"
  | "onStop"
>;

type SharedBridgeProps = BridgeProps & {
  OverlayComponent: ComponentType<OverlayProps>;
};

export function CopilotOverlayBridgeShared({ OverlayComponent, ...props }: SharedBridgeProps) {
  const { sortedSteps, currentIndex, currentStep, currentRect, visible, next, prev, stop } =
    useTooltipContext();

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
    currentStep,
    stepIndex: currentIndex,
    totalSteps: sortedSteps.length,
    onNext: handleNext,
    onPrev: handlePrev,
    onStop: stop,
  };

  return <OverlayComponent {...overlayProps} />;
}

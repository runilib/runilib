import { type ComponentType, useCallback } from 'react';

import { useWalkitContext } from '../../context/WalkitContext';
import type { OverlayProps } from '../../types/Walkit.types';

export type BridgeProps = Omit<
  OverlayProps,
  | 'visible'
  | 'currentRect'
  | 'currentWalkitStep'
  | 'walkitStepIndex'
  | 'totalWalkitSteps'
  | 'onNext'
  | 'onPrev'
  | 'onStop'
>;

type SharedBridgeProps = BridgeProps & {
  OverlayComponent: ComponentType<OverlayProps>;
};

export function SharedWalkitOverlayBridge({
  OverlayComponent,
  ...props
}: SharedBridgeProps) {
  const {
    sortedSteps,
    currentIndex,
    currentStep,
    currentRect,
    visible,
    next,
    prev,
    stop,
  } = useWalkitContext();

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
    currentWalkitStep: currentStep,
    walkitStepIndex: currentIndex,
    totalWalkitSteps: sortedSteps.length,
    onNext: handleNext,
    onPrev: handlePrev,
    onStop: stop,
  };

  return <OverlayComponent {...overlayProps} />;
}

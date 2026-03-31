import { type ComponentType, useCallback } from 'react';

import { useWalkitContext } from '../../../context/WalkitContext';
import type { OverlayProps } from '../../../types/Walkit.types';

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
    totalSteps,
    currentIndex,
    currentStep,
    currentRect,
    visible,
    next,
    prev,
    stop,
  } = useWalkitContext();

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  const handlePrev = useCallback(() => {
    prev();
  }, [prev]);

  const overlayProps: OverlayProps = {
    ...props,
    visible,
    currentRect,
    currentWalkitStep: currentStep,
    walkitStepIndex: currentIndex,
    totalWalkitSteps: totalSteps,
    renderPopover: currentStep?.renderPopover ?? props.renderPopover,
    onNext: handleNext,
    onPrev: handlePrev,
    onStop: stop,
  };

  return <OverlayComponent {...overlayProps} />;
}

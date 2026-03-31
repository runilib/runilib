import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { useDimensions } from '../../../hooks/useDimensions';
import type { OverlayProps, SpotlightRect } from '../../../types/Walkit.types';
import { WALKIT_STEP_HEIGHT, WALKIT_STEP_WIDTH } from '../../../utils/constant';
import { easeOut, getOrCreatePortal, injectStyles, lerp } from '../../../utils/helpers';
import { getSpotlightRect } from '../../../utils/positioning.shared';
import { getInnerSpotlightRingRect } from '../../../utils/spotlight';
import { computeWalkitStepPosition } from '../../../utils/Walkit.positioning';
import { WebWalkit } from './Walkit.web';

export const WebOverlay = ({
  visible,
  currentRect,
  currentWalkitStep,
  walkitStepIndex,
  totalWalkitSteps,
  animationType,
  overlayColor,
  spotlightPadding,
  spotlightBorderRadius,
  theme,
  walkitStyle,
  renderPopover,
  stopOnOutsideClick,
  labels,
  onNext,
  onPrev,
  onStop,
}: OverlayProps) => {
  const [spot, setSpot] = useState<SpotlightRect | null>(null);
  const [walkitStepSize, setWalkitStepSize] = useState({
    width: WALKIT_STEP_WIDTH,
    height: WALKIT_STEP_HEIGHT,
  });

  const effectiveSpotlightPadding =
    currentWalkitStep?.spotlightPaddingOverride ?? spotlightPadding;

  const effectiveSpotlightBorderRadius =
    currentWalkitStep?.spotlightBorderRadiusOverride ?? spotlightBorderRadius;

  const previousRectRef = useRef<SpotlightRect | null>(null);
  const animationFrameRef = useRef<number>(0);
  const dimensions = useDimensions();

  const spotlightTarget = useMemo(() => {
    if (!currentRect) {
      return null;
    }

    return getSpotlightRect(
      currentRect,
      effectiveSpotlightPadding,
      effectiveSpotlightBorderRadius,
    );
  }, [currentRect, effectiveSpotlightPadding, effectiveSpotlightBorderRadius]);

  const walkitStepPosition = useMemo(() => {
    if (!visible || !spotlightTarget || !currentWalkitStep) {
      return null;
    }

    return computeWalkitStepPosition({
      target: spotlightTarget,
      walkitStepSize,
      preferredPlacement: currentWalkitStep.placement ?? 'auto',
      screenWidth: dimensions.w,
      screenHeight: dimensions.h,
    });
  }, [visible, spotlightTarget, currentWalkitStep, walkitStepSize, dimensions]);

  const onMesure = useCallback((layout: { width: number; height: number }) => {
    setWalkitStepSize((previousSize) => {
      if (previousSize.width === layout.width && previousSize.height === layout.height) {
        return previousSize;
      }
      return layout;
    });
  }, []);

  const animateSpotlight = useCallback((from: SpotlightRect, to: SpotlightRect): void => {
    cancelAnimationFrame(animationFrameRef.current);

    const startTime = performance.now();
    const duration = 300;

    const tick = (now: number): void => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = easeOut(t);

      setSpot({
        x: lerp(from.x, to.x, eased),
        y: lerp(from.y, to.y, eased),
        width: lerp(from.width, to.width, eased),
        height: lerp(from.height, to.height, eased),
        borderRadius: to.borderRadius,
      });

      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!visible || !spotlightTarget) {
      setSpot(null);
      return;
    }

    injectStyles();

    if (previousRectRef.current) {
      animateSpotlight(previousRectRef.current, spotlightTarget);
    } else {
      setSpot(spotlightTarget);
    }

    previousRectRef.current = spotlightTarget;

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [visible, spotlightTarget, animateSpotlight]);

  if (!visible) {
    return null;
  }

  const fill = overlayColor ?? 'rgba(15,15,25,0.72)';
  const portal = getOrCreatePortal();

  const SPOTLIGHT_RING_WIDTH = 2;
  const spotlightRingRect = spot
    ? getInnerSpotlightRingRect(spot, SPOTLIGHT_RING_WIDTH)
    : null;

  const content = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999990,
        animation: 'runilib-react-walkit-overlay-in 0.25s ease-out both',
        pointerEvents: 'none',
      }}
    >
      {stopOnOutsideClick && (
        <button
          type="button"
          aria-label="Close tour overlay"
          onClick={onStop}
          style={{
            position: 'absolute',
            inset: 0,
            border: 'none',
            padding: 0,
            margin: 0,
            background: 'transparent',
            appearance: 'none',
            cursor: 'default',
            pointerEvents: 'auto',
          }}
        />
      )}

      <svg
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
        width={dimensions.w}
        height={dimensions.h}
        viewBox={`0 0 ${dimensions.w} ${dimensions.h}`}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <mask id="uc-mask">
            <rect
              x={0}
              y={0}
              width={dimensions.w}
              height={dimensions.h}
              fill="white"
            />
            {spot && (
              <rect
                x={spot.x}
                y={spot.y}
                width={spot.width}
                height={spot.height}
                rx={spot.borderRadius}
                fill="black"
              />
            )}
          </mask>
        </defs>

        <rect
          x={0}
          y={0}
          width={dimensions.w}
          height={dimensions.h}
          fill={fill}
          mask="url(#uc-mask)"
        />

        {spotlightRingRect && (
          <rect
            x={spotlightRingRect.x}
            y={spotlightRingRect.y}
            width={spotlightRingRect.width}
            height={spotlightRingRect.height}
            rx={spotlightRingRect.borderRadius}
            fill="none"
            stroke="rgba(99,102,241,0.6)"
            strokeWidth={SPOTLIGHT_RING_WIDTH}
          />
        )}
      </svg>

      {walkitStepPosition && currentWalkitStep && (
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            pointerEvents: 'auto',
          }}
        >
          <WebWalkit
            walkitStep={currentWalkitStep}
            walkitStepIndex={walkitStepIndex}
            totalWalkitSteps={totalWalkitSteps}
            walkitStepPosition={walkitStepPosition}
            animationType={animationType}
            theme={theme}
            walkitStyle={walkitStyle}
            renderPopover={renderPopover}
            labels={labels}
            onNext={onNext}
            onPrev={onPrev}
            onStop={onStop}
            onMeasure={onMesure}
          />
        </div>
      )}
    </div>
  );

  return ReactDOM.createPortal(content, portal);
};

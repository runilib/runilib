import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { getSpotlightRect } from 'src/utils/positioning.shared';
import { computeTooltipPosition } from 'src/utils/Walkit.positioning';
import { WEB_KEYFRAMES } from '../../../animations';
import type { OverlayProps, SpotlightRect } from '../../../types/Walkit.types';
import { Tooltip } from './Walkit.web';

const TOOLTIP_WIDTH = 300;
const TOOLTIP_HEIGHT = 180;
const INJECT_ID = '__uc_styles__';
const PORTAL_ID = '__uc_portal__';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function injectStyles(): void {
  if (document.getElementById(INJECT_ID)) return;
  const style = document.createElement('style');
  style.id = INJECT_ID;
  style.type = 'text/css';
  style.textContent = WEB_KEYFRAMES;
  document.head.appendChild(style);
}

function getOrCreatePortal(): HTMLElement {
  let element = document.getElementById(PORTAL_ID);
  if (!element) {
    element = document.createElement('div');
    element.id = PORTAL_ID;
    document.body.appendChild(element);
  }
  return element;
}

function useDimensions(): { w: number; h: number } {
  const [dimensions, setDimensions] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeOut(t: number): number {
  return 1 - (1 - t) ** 3;
}

// ─── Component ────────────────────────────────────────────────────────────────

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
  const [tooltipSize, setTooltipSize] = useState({
    width: TOOLTIP_WIDTH,
    height: TOOLTIP_HEIGHT,
  });

  const previousRectRef = useRef<SpotlightRect | null>(null);
  const animationFrameRef = useRef<number>(0);
  const dimensions = useDimensions();

  const spotlightTarget = useMemo(() => {
    if (!currentRect) {
      return null;
    }

    return getSpotlightRect(currentRect, spotlightPadding, spotlightBorderRadius);
  }, [currentRect, spotlightPadding, spotlightBorderRadius]);

  const tooltipPos = useMemo(() => {
    if (!visible || !spotlightTarget || !currentWalkitStep) {
      return null;
    }

    return computeTooltipPosition(
      spotlightTarget,
      tooltipSize,
      currentWalkitStep.placement ?? 'auto',
      dimensions.w,
      dimensions.h,
    );
  }, [visible, spotlightTarget, currentWalkitStep, tooltipSize, dimensions]);

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

        {spot && (
          <rect
            x={spot.x}
            y={spot.y}
            width={spot.width}
            height={spot.height}
            rx={spot.borderRadius + 1}
            fill="none"
            stroke="rgba(99,102,241,0.6)"
            strokeWidth={2}
          />
        )}
      </svg>

      {tooltipPos && currentWalkitStep && (
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            pointerEvents: 'auto',
          }}
        >
          <Tooltip
            walkitStep={currentWalkitStep}
            walkitStepIndex={walkitStepIndex}
            totalWalkitSteps={totalWalkitSteps}
            walkitStepPos={tooltipPos}
            animationType={animationType}
            theme={theme}
            walkitStyle={walkitStyle}
            renderPopover={renderPopover}
            labels={labels}
            onNext={onNext}
            onPrev={onPrev}
            onStop={onStop}
            onMeasure={(nextSize) => {
              setTooltipSize((previousSize) => {
                if (
                  previousSize.width === nextSize.width &&
                  previousSize.height === nextSize.height
                ) {
                  return previousSize;
                }

                return nextSize;
              });
            }}
          />
        </div>
      )}
    </div>
  );

  return ReactDOM.createPortal(content, portal);
};

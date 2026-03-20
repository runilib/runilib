import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import { WEB_KEYFRAMES } from "../../animations";
import type { OverlayProps, SpotlightRect } from "../../types";
import { computeTooltipPosition, getSpotlightRect } from "../../utils/positioning";
import { WebTooltip } from "./Tooltip";

const TOOLTIP_WIDTH = 300;
const TOOLTIP_HEIGHT = 180;
const INJECT_ID = "__uc_styles__";
const PORTAL_ID = "__uc_portal__";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function injectStyles(): void {
  if (document.getElementById(INJECT_ID)) return;
  const style = document.createElement("style");
  style.id = INJECT_ID;
  style.type = "text/css";
  style.textContent = WEB_KEYFRAMES;
  document.head.appendChild(style);
}

function getOrCreatePortal(): HTMLElement {
  let el = document.getElementById(PORTAL_ID);
  if (!el) {
    el = document.createElement("div");
    el.id = PORTAL_ID;
    document.body.appendChild(el);
  }
  return el;
}

function useDimensions(): { w: number; h: number } {
  const [dims, setDims] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });
  useEffect(() => {
    const handler = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return dims;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
function easeOut(t: number): number {
  return 1 - (1 - t) ** 3;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const WebOverlay= ({
  visible,
  currentRect,
  currentStep,
  stepIndex,
  totalSteps,
  animationType,
  overlayColor,
  spotlightPadding,
  spotlightBorderRadius,
  theme,
  tooltipStyle,
  renderTooltip,
  maskClickable,
  labels,
  onNext,
  onPrev,
  onStop,
}:OverlayProps) => {
  const [spot, setSpot] = useState<SpotlightRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<ReturnType<typeof computeTooltipPosition> | null>(
    null
  );
  const prevRectRef = useRef<SpotlightRect | null>(null);
  const rafRef = useRef<number>(0);
  const dims = useDimensions();

  // ─── Animate spotlight ────────────────────────────────────────────────────

  const animateSpotlight = useCallback((from: SpotlightRect, to: SpotlightRect): void => {
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const duration = 300;

    const tick = (now: number): void => {
      const t = Math.min((now - start) / duration, 1);
      const ease = easeOut(t);
      setSpot({
        x: lerp(from.x, to.x, ease),
        y: lerp(from.y, to.y, ease),
        width: lerp(from.width, to.width, ease),
        height: lerp(from.height, to.height, ease),
        borderRadius: to.borderRadius,
      });
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ─── On step change ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!visible || !currentRect) {
      setSpot(null);
      setTooltipPos(null);
      return;
    }

    injectStyles();

    const sr = getSpotlightRect(currentRect, spotlightPadding, spotlightBorderRadius);

    if (prevRectRef.current) animateSpotlight(prevRectRef.current, sr);
    else setSpot(sr);
    prevRectRef.current = sr;

    setTooltipPos(
      computeTooltipPosition(
        sr,
        { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
        currentStep?.placement ?? "auto",
        dims.w,
        dims.h
      )
    );

    return () => cancelAnimationFrame(rafRef.current);
  }, [
    visible,
    currentRect,
    currentStep,
    dims,
    spotlightPadding,
    spotlightBorderRadius,
    animateSpotlight,
  ]);

  if (!visible) return null;

  const fill = overlayColor ?? "rgba(15,15,25,0.72)";
  const portal = getOrCreatePortal();

  const content = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999990,
        animation: "uc-overlay-in 0.25s ease-out both",
        pointerEvents: "none",
      }}
    >
      {/* SVG spotlight overlay */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: maskClickable ? "none" : "all",
        }}
        width={dims.w}
        height={dims.h}
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        role={maskClickable ? "button" : undefined}
        tabIndex={maskClickable ? 0 : undefined}
        aria-label={maskClickable ? "Close tour overlay" : undefined}
        onClick={maskClickable ? onStop : undefined}
        onKeyDown={
          maskClickable
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onStop?.();
                }
              }
            : undefined
        }
      >
        <defs>
          <mask id="uc-mask">
            <rect x={0} y={0} width={dims.w} height={dims.h} fill="white" />
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

        <rect x={0} y={0} width={dims.w} height={dims.h} fill={fill} mask="url(#uc-mask)" />

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

      {/* Tooltip */}
      {tooltipPos && currentStep && (
        <div style={{ pointerEvents: "all" }}>
          <WebTooltip
            step={currentStep}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
            tooltipPos={tooltipPos}
            animationType={animationType}
            theme={theme}
            tooltipStyle={tooltipStyle}
            renderTooltip={renderTooltip}
            labels={labels}
            onNext={onNext}
            onPrev={onPrev}
            onStop={onStop}
          />
        </div>
      )}
    </div>
  );

  return ReactDOM.createPortal(content, portal);
};

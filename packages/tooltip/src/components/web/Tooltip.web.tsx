import { type CSSProperties, useEffect, useRef, useState } from "react";

import { getWebAnimation } from "../../animations";
import type { TooltipPlacement, TooltipProps, TooltipTheme } from "../../types";

// ─── Default theme ────────────────────────────────────────────────────────────

const DEFAULT_THEME: Required<TooltipTheme> = {
  primary: "#6366f1",
  primaryText: "#ffffff",
  background: "#ffffff",
  text: "#1e1e2e",
  subtext: "#6b7280",
  border: "#e5e7eb",
  shadow: "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1)",
  borderRadius: "14px",
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Tooltip = ({
  step,
  stepIndex,
  totalSteps,
  tooltipPos,
  animationType = "slide",
  theme: themeProp,
  tooltipStyle,
  renderTooltip,
  labels = {},
  onNext,
  onPrev,
  onStop,
  onMeasure,
}: TooltipProps & {
  onMeasure?: (size: { width: number; height: number }) => void;
}) => {
  const theme = { ...DEFAULT_THEME, ...themeProp };
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Re-trigger animation on step change
  useEffect(() => {
    setReady(false);
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, [stepIndex, step.name, animationType]);

  // Measure real tooltip size
  useEffect(() => {
    const element = containerRef.current;
    if (!element || !onMeasure) {
      return;
    }

    const reportSize = () => {
      const rect = element.getBoundingClientRect();
      onMeasure({
        width: Math.ceil(rect.width),
        height: Math.ceil(rect.height),
      });
    };

    reportSize();

    const resizeObserver = new ResizeObserver(reportSize);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [onMeasure, stepIndex, step.name, renderTooltip, step.text, step.title]);

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;
  const { placement, arrowOffset = 0 } = tooltipPos;
  const animation = ready ? getWebAnimation(animationType, placement) : "none";
  const arrowStyle = buildArrowStyle(placement, arrowOffset, theme.background);

  const containerStyle: CSSProperties = {
    position: "fixed",
    top: tooltipPos.top,
    left: tooltipPos.left,
    width: 300,
    background: theme.background,
    borderRadius: theme.borderRadius,
    boxShadow: theme.shadow,
    padding: "20px",
    zIndex: 999999,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    animation,
    border: `1px solid ${theme.border}`,
    ...(tooltipStyle as CSSProperties),
  };

  if (renderTooltip) {
    return (
      <div ref={containerRef} style={containerStyle}>
        {renderTooltip({ step, stepIndex, totalSteps, onNext, onPrev, onStop })}
        <div style={arrowStyle} />
      </div>
    );
  }

  return (
    <div ref={containerRef} style={containerStyle}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        {step.title && (
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 15,
              color: theme.text,
              lineHeight: 1.3,
            }}
          >
            {step.title}
          </p>
        )}

        <button
          type="button"
          onClick={onStop}
          style={closeButtonStyle(theme)}
          aria-label={labels.close ?? "Close"}
          title={labels.close ?? "Close"}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      {step.text && (
        <p
          style={{
            margin: "0 0 16px",
            fontSize: 13.5,
            color: theme.subtext,
            lineHeight: 1.6,
          }}
        >
          {step.text}
        </p>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 5 }}>
          {Array.from({ length: totalSteps }).map((item, i) => (
            <div
              key={`${item}-${i.toString()}`}
              style={{
                width: i === stepIndex ? 18 : 6,
                height: 6,
                borderRadius: 3,
                background: i === stepIndex ? theme.primary : theme.border,
                transition: "all 0.25s ease",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {!isFirst && (
            <button type="button" onClick={onPrev} style={secondaryButtonStyle(theme)}>
              {labels.prev ?? "← Back"}
            </button>
          )}

          <button type="button" onClick={onNext} style={primaryButtonStyle(theme)}>
            {isLast ? (labels.finish ?? "Finish 🎉") : (labels.next ?? "Next →")}
          </button>
        </div>
      </div>

      <div style={arrowStyle} />
    </div>
  );
};

// ─── Style helpers ────────────────────────────────────────────────────────────
function closeButtonStyle(t: Required<TooltipTheme>): CSSProperties {
  return {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: t.subtext,
    fontSize: 14,
    lineHeight: 1,
    padding: "2px 4px",
    borderRadius: 4,
    flexShrink: 0,
    marginLeft: 8,
    marginTop: -2,
    opacity: 0.7,
  };
}

function primaryButtonStyle(t: Required<TooltipTheme>): CSSProperties {
  return {
    background: t.primary,
    color: t.primaryText,
    border: "none",
    borderRadius: "8px",
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.01em",
  };
}

function secondaryButtonStyle(t: Required<TooltipTheme>): CSSProperties {
  return {
    background: "transparent",
    color: t.subtext,
    border: `1px solid ${t.border}`,
    borderRadius: "8px",
    padding: "7px 12px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  };
}

function buildArrowStyle(
  placement: TooltipPlacement,
  offset: number,
  color: string
): CSSProperties {
  const size = 10;

  const base: CSSProperties = {
    position: "absolute",
    width: 0,
    height: 0,
    pointerEvents: "none",
  };

  switch (placement) {
    case "bottom":
      return {
        ...base,
        top: -size,
        left: offset,
        transform: "translateX(-50%)",
        borderLeft: `${size}px solid transparent`,
        borderRight: `${size}px solid transparent`,
        borderBottom: `${size}px solid ${color}`,
      };

    case "top":
      return {
        ...base,
        bottom: -size,
        left: offset,
        transform: "translateX(-50%)",
        borderLeft: `${size}px solid transparent`,
        borderRight: `${size}px solid transparent`,
        borderTop: `${size}px solid ${color}`,
      };

    case "right":
      return {
        ...base,
        top: offset,
        left: -size,
        transform: "translateY(-50%)",
        borderTop: `${size}px solid transparent`,
        borderBottom: `${size}px solid transparent`,
        borderRight: `${size}px solid ${color}`,
      };

    case "left":
      return {
        ...base,
        top: offset,
        right: -size,
        transform: "translateY(-50%)",
        borderTop: `${size}px solid transparent`,
        borderBottom: `${size}px solid transparent`,
        borderLeft: `${size}px solid ${color}`,
      };

    default:
      return base;
  }
}
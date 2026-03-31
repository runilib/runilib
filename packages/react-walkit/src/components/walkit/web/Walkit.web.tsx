import { type CSSProperties, useEffect, useRef, useState } from 'react';

import { getWebAnimation } from '../../../animations';
import type {
  Placement,
  WalkitPopoverProps,
  WalkitTheme,
} from '../../../types/Walkit.types';
import { DEFAULT_THEME } from '../../../utils/constant';

export const WebWalkit = ({
  walkitStep,
  walkitStepIndex,
  totalWalkitSteps,
  walkitStepPosition,
  animationType = 'slide',
  theme: themeProp,
  walkitStyle,
  renderPopover,
  labels = {},
  onNext,
  onPrev,
  onStop,
  onMeasure,
}: WalkitPopoverProps) => {
  const theme = { ...DEFAULT_THEME, ...themeProp };
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Re-trigger animation on step change
  const animationResetKey = `${walkitStepIndex}-${walkitStep.id}-${animationType}`;

  useEffect(() => {
    void animationResetKey;

    setReady(false);
    const raf = requestAnimationFrame(() => setReady(true));

    return () => cancelAnimationFrame(raf);
  }, [animationResetKey]);

  const measureKey = `${walkitStepIndex}-${walkitStep.id}`;

  const onMeasureRef = useRef(onMeasure);

  useEffect(() => {
    onMeasureRef.current = onMeasure;
  }, [onMeasure]);

  useEffect(() => {
    void measureKey;
    const element = containerRef.current;
    if (!element || !onMeasureRef.current) {
      return;
    }

    const reportSize = () => {
      const rect = element.getBoundingClientRect();
      onMeasureRef.current?.({
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
  }, [measureKey]);

  const isFirst = walkitStepIndex === 0;
  const isLast = walkitStepIndex === totalWalkitSteps - 1;
  const { placement, arrowOffset = 0 } = walkitStepPosition;
  const animation = ready ? getWebAnimation(animationType, placement) : 'none';
  const arrowStyle = buildArrowStyle(placement, arrowOffset, theme.background);

  const containerStyle: CSSProperties = {
    position: 'fixed',
    top: walkitStepPosition.top,
    left: walkitStepPosition.left,
    width: 300,
    background: theme.background,
    borderRadius: theme.borderRadius,
    boxShadow: theme.shadow,
    padding: '20px',
    zIndex: 999999,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    animation,
    border: `1px solid ${theme.border}`,
    ...(walkitStyle as CSSProperties),
  };

  if (renderPopover) {
    return (
      <div
        ref={containerRef}
        style={containerStyle}
      >
        {renderPopover({
          walkitStep,
          walkitStepIndex,
          totalWalkitSteps,
          onNext,
          onPrev,
          onStop,
        })}
        <div style={arrowStyle} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={containerStyle}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          marginBottom: 12,
        }}
      >
        {walkitStep.title && (
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 15,
              color: theme.titleColor,
              lineHeight: 1.3,
            }}
          >
            {walkitStep.title}
          </p>
        )}

        <button
          type="button"
          onClick={onStop}
          style={closeButtonStyle(theme)}
          aria-label={labels.close ?? 'Close'}
          title={labels.close ?? 'Close'}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      {walkitStep.content && (
        <p
          style={{
            margin: '0 0 16px',
            fontSize: 13.5,
            color: theme.subTitleColor,
            lineHeight: 1.6,
          }}
        >
          {walkitStep.content}
        </p>
      )}

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: 5 }}>
          {Array.from({ length: totalWalkitSteps }).map((item, i) => (
            <div
              key={`${item}-${i.toString()}`}
              style={{
                width: i === walkitStepIndex ? 18 : 6,
                height: 6,
                borderRadius: 3,
                background:
                  i === walkitStepIndex ? theme.primaryButtonColor : theme.border,
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {!isFirst && (
            <button
              type="button"
              onClick={onPrev}
              style={secondaryButtonStyle(theme)}
            >
              {labels.prev ?? '← Back'}
            </button>
          )}

          <button
            type="button"
            onClick={onNext}
            style={primaryButtonStyle(theme)}
          >
            {isLast ? (labels.finish ?? 'Finish 🎉') : (labels.next ?? 'Next →')}
          </button>
        </div>
      </div>

      <div style={arrowStyle} />
    </div>
  );
};

// ─── Style helpers ────────────────────────────────────────────────────────────
function closeButtonStyle(theme: Required<WalkitTheme>): CSSProperties {
  return {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: theme.subTitleColor,
    fontSize: 14,
    lineHeight: 1,
    padding: '2px 4px',
    borderRadius: 4,
    flexShrink: 0,
    marginLeft: 'auto',
    marginTop: -2,
    opacity: 0.7,
  };
}

function primaryButtonStyle(theme: Required<WalkitTheme>): CSSProperties {
  return {
    background: theme.primaryButtonColor,
    color: theme.primaryButtonTextColor,
    border: 'none',
    borderRadius: '8px',
    padding: '7px 14px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.01em',
  };
}

function secondaryButtonStyle(theme: Required<WalkitTheme>): CSSProperties {
  return {
    background: 'transparent',
    color: theme.subTitleColor,
    border: `1px solid ${theme.border}`,
    borderRadius: '8px',
    padding: '7px 12px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  };
}

function buildArrowStyle(
  placement: Placement,
  offset: number,
  color: string,
): CSSProperties {
  const size = 10;

  const base: CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
    pointerEvents: 'none',
  };

  switch (placement) {
    case 'bottom':
      return {
        ...base,
        top: -size,
        left: offset,
        transform: 'translateX(-50%)',
        borderLeft: `${size}px solid transparent`,
        borderRight: `${size}px solid transparent`,
        borderBottom: `${size}px solid ${color}`,
      };

    case 'top':
      return {
        ...base,
        bottom: -size,
        left: offset,
        transform: 'translateX(-50%)',
        borderLeft: `${size}px solid transparent`,
        borderRight: `${size}px solid transparent`,
        borderTop: `${size}px solid ${color}`,
      };

    case 'right':
      return {
        ...base,
        top: offset,
        left: -size,
        transform: 'translateY(-50%)',
        borderTop: `${size}px solid transparent`,
        borderBottom: `${size}px solid transparent`,
        borderRight: `${size}px solid ${color}`,
      };

    case 'left':
      return {
        ...base,
        top: offset,
        right: -size,
        transform: 'translateY(-50%)',
        borderTop: `${size}px solid transparent`,
        borderBottom: `${size}px solid transparent`,
        borderLeft: `${size}px solid ${color}`,
      };

    default:
      return base;
  }
}

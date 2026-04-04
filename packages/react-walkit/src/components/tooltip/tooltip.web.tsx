import React, {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

import type {
  TooltipContentApi,
  TooltipPlacement,
  TooltipProps,
} from '../../types/Tooltip.types';
import { computeSimpleTooltipPosition } from '../../utils/Tooltip.positioning';

const WEB_PORTAL_ID = '__react_walkit_tooltip_portal__';

function getOrCreatePortal(): HTMLElement {
  let element = document.getElementById(WEB_PORTAL_ID);

  if (!element) {
    element = document.createElement('div');
    element.id = WEB_PORTAL_ID;
    document.body.appendChild(element);
  }

  return element;
}

type WebRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  anchor,
  content,
  renderContent,
  placement = 'auto',
  offset = 10,
  disabled = false,
  openOnHover = false,
  openOnPress = false,
  closeOnOutsidePress = true,
  maxWidth = 280,
  zIndex = 1000000,
  tooltipStyle,
  triggerWrapperStyle,
  showAnchor = true,
  anchorSize = 8,
  anchorColor,
}) => {
  const triggerWrapperRef = useRef<HTMLSpanElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);

  const [visible, setVisible] = useState(false);
  const [anchorRect, setAnchorRect] = useState<WebRect | null>(null);
  const [shellSize, setShellSize] = useState({ width: maxWidth, height: 60 });

  const trigger = anchor ?? children;

  const measureAnchor = useCallback(() => {
    const element = triggerWrapperRef.current;

    if (!element) {
      return null;
    }

    const rect = element.getBoundingClientRect();

    const nextRect = {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    };

    setAnchorRect(nextRect);

    return nextRect;
  }, []);

  const show = useCallback(() => {
    if (disabled) {
      return;
    }

    measureAnchor();
    setVisible(true);
  }, [disabled, measureAnchor]);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  const toggle = useCallback(() => {
    if (visible) {
      hide();
      return;
    }

    show();
  }, [show, hide, visible]);

  const api: TooltipContentApi = useMemo(
    () => ({
      toggle,
      visible,
      hide,
      show,
    }),
    [toggle, visible, hide, show],
  );

  useLayoutEffect(() => {
    if (!visible || !shellRef.current) {
      return;
    }

    const element = shellRef.current;
    const rect = element.getBoundingClientRect();

    setShellSize({
      width: Math.ceil(rect.width),
      height: Math.ceil(rect.height),
    });
  }, [visible]);

  useEffect(() => {
    if (!visible || !shellRef.current) {
      return;
    }

    const element = shellRef.current;
    const observer = new ResizeObserver(() => {
      const rect = element.getBoundingClientRect();
      setShellSize({
        width: Math.ceil(rect.width),
        height: Math.ceil(rect.height),
      });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const handleResizeOrScroll = () => {
      measureAnchor();
    };

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true);

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, true);
    };
  }, [visible, measureAnchor]);

  useEffect(() => {
    if (!visible || !closeOnOutsidePress) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const targetNode = event.target as Node | null;

      const clickedInsideTooltip = shellRef.current?.contains(targetNode ?? null);
      const clickedInsideTrigger = triggerWrapperRef.current?.contains(
        targetNode ?? null,
      );

      if (clickedInsideTooltip || clickedInsideTrigger) {
        return;
      }

      hide();
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [visible, closeOnOutsidePress, hide]);

  const computedPosition = useMemo(() => {
    if (!visible || !anchorRect) {
      return null;
    }

    return computeSimpleTooltipPosition(
      anchorRect,
      shellSize,
      placement,
      window.innerWidth,
      window.innerHeight,
      offset,
    );
  }, [visible, anchorRect, shellSize, placement, offset]);

  const renderedTrigger: ReactNode =
    typeof trigger === 'function' ? trigger(api) : trigger;

  const renderedContent = renderContent?.(api) ?? content ?? null;

  const defaultBackground =
    ((tooltipStyle as CSSProperties | undefined)?.backgroundColor as
      | string
      | undefined) ??
    ((tooltipStyle as CSSProperties | undefined)?.background as string | undefined) ??
    '#111827';

  const resolvedAnchorColor = anchorColor ?? defaultBackground;

  const wrapperStyle: CSSProperties = {
    display: 'inline-flex',
    ...(triggerWrapperStyle as CSSProperties),
  };

  const handleTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLSpanElement>) => {
      if (!openOnPress) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
        return;
      }

      if (event.key === 'Escape') {
        hide();
      }
    },
    [hide, openOnPress, toggle],
  );

  const shellStyle: CSSProperties = {
    position: 'fixed',
    top: computedPosition?.top ?? -9999,
    left: computedPosition?.left ?? -9999,
    zIndex,
    visibility: visible ? 'visible' : 'hidden',
  };

  const defaultBubbleStyle: CSSProperties = {
    maxWidth,
    backgroundColor: '#111827',
    color: '#ffffff',
    borderRadius: 5,
    padding: '10px 12px',
    fontSize: 13,
    lineHeight: 1.45,
    boxShadow: '0 10px 30px rgba(0,0,0,0.22)',
    ...(tooltipStyle as CSSProperties),
  };

  const portal = getOrCreatePortal();

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: The wrapper preserves arbitrary inline trigger markup, so we keep a neutral span and add explicit keyboard support when it becomes pressable. */}
      <span
        ref={triggerWrapperRef}
        style={wrapperStyle}
        role={openOnPress ? 'button' : undefined}
        tabIndex={openOnPress ? 0 : undefined}
        onMouseEnter={openOnHover ? show : undefined}
        onMouseLeave={openOnHover ? hide : undefined}
        onClick={openOnPress ? toggle : undefined}
        onKeyDown={openOnPress ? handleTriggerKeyDown : undefined}
      >
        {renderedTrigger}
      </span>

      {visible &&
        renderedContent &&
        ReactDOM.createPortal(
          <div
            ref={shellRef}
            style={shellStyle}
            role="tooltip"
          >
            {renderContent ? (
              renderedContent
            ) : (
              <div style={defaultBubbleStyle}>{renderedContent}</div>
            )}

            {showAnchor && computedPosition && (
              <div
                style={buildWebAnchorStyle({
                  placement: computedPosition.placement,
                  offset: computedPosition.anchorOffset,
                  size: anchorSize,
                  color: resolvedAnchorColor,
                })}
              />
            )}
          </div>,
          portal,
        )}
    </>
  );
};

function buildWebAnchorStyle({
  placement,
  offset,
  size,
  color,
}: {
  placement: TooltipPlacement;
  offset: number;
  size: number;
  color: string;
}): CSSProperties {
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

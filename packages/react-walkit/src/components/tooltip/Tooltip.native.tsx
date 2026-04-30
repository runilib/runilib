import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Dimensions,
  Modal,
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';

import type {
  TooltipContentApi,
  TooltipPlacement,
  TooltipProps,
} from '../../types/Tooltip.types';
import { computeSimpleTooltipPosition } from '../../utils/Tooltip.positioning';

let tooltipIdSeed = 0;

type NativeRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function useStableTooltipId(providedId?: string): string {
  const generatedIdRef = useRef<string | null>(null);

  if (!generatedIdRef.current) {
    tooltipIdSeed += 1;
    generatedIdRef.current = `react-walkit-tooltip-${tooltipIdSeed}`;
  }

  return providedId ?? generatedIdRef.current;
}

function getAccessibleText(node: ReactNode): string | undefined {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  return undefined;
}

export const Tooltip: React.FC<Omit<TooltipProps, 'openOnHover'>> = ({
  children,
  anchor,
  content,
  renderContent,
  placement = 'auto',
  offset = 10,
  disabled = false,
  openOnPress = false,
  closeOnOutsidePress = true,
  id,
  ariaLabel,
  ariaDescribedBy = 'visible',
  closeOnEscape: _closeOnEscape,
  interactive = false,
  maxWidth = 280,
  zIndex = 9999,
  tooltipStyle,
  triggerWrapperStyle,
  showAnchor = true,
  anchorSize = 8,
  anchorColor,
}) => {
  const triggerWrapperRef = useRef<View | null>(null);

  const [visible, setVisible] = useState(false);
  const [anchorRect, setAnchorRect] = useState<NativeRect | null>(null);
  const [shellSize, setShellSize] = useState({ width: maxWidth, height: 60 });
  const [screenSize, setScreenSize] = useState(Dimensions.get('window'));

  const trigger = anchor ?? children;
  const tooltipId = useStableTooltipId(id);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenSize(window);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const measureAnchor = useCallback(async (): Promise<NativeRect | null> => {
    const element = triggerWrapperRef.current;

    if (!element) {
      return null;
    }

    return new Promise((resolve) => {
      if (typeof element.measureInWindow === 'function') {
        element.measureInWindow((x, y, width, height) => {
          const nextRect = { x, y, width, height };
          setAnchorRect(nextRect);
          resolve(nextRect);
        });
        return;
      }

      resolve(null);
    });
  }, []);

  const show = useCallback(async () => {
    if (disabled) {
      return;
    }

    setVisible(true);
    await measureAnchor();
  }, [disabled, measureAnchor]);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  const toggle = useCallback(async () => {
    if (visible) {
      hide();
      return;
    }

    await show();
  }, [show, hide, visible]);

  const tooltipContentApi: TooltipContentApi = useMemo(
    () => ({
      toggle,
      visible,
      hide,
      show,
      tooltipId,
    }),
    [toggle, hide, show, visible, tooltipId],
  );

  const computedPosition = useMemo(() => {
    if (!visible || !anchorRect) {
      return null;
    }

    return computeSimpleTooltipPosition(
      anchorRect,
      shellSize,
      placement,
      screenSize.width,
      screenSize.height,
      offset,
    );
  }, [visible, anchorRect, shellSize, placement, screenSize, offset]);

  const renderedTrigger: ReactNode =
    typeof trigger === 'function' ? trigger(tooltipContentApi) : trigger;

  const renderedContent = renderContent?.(tooltipContentApi) ?? content ?? null;
  const accessibleText = ariaLabel ?? getAccessibleText(renderedContent);
  const shouldDescribeTrigger =
    ariaDescribedBy === 'always' || (ariaDescribedBy === 'visible' && visible);

  useEffect(() => {
    if (!visible || !accessibleText) {
      return;
    }

    AccessibilityInfo.announceForAccessibility(accessibleText);
  }, [accessibleText, visible]);

  const nativeTooltipStyle = tooltipStyle as StyleProp<ViewStyle> | undefined;
  const nativeTriggerWrapperStyle = triggerWrapperStyle as
    | StyleProp<ViewStyle>
    | undefined;

  const defaultBackground = extractBackgroundColor(nativeTooltipStyle) ?? '#111827';

  const resolvedAnchorColor = anchorColor ?? defaultBackground;

  return (
    <>
      <View
        ref={triggerWrapperRef}
        collapsable={false}
        pointerEvents="box-none"
        style={[styles.triggerWrapper, nativeTriggerWrapperStyle]}
      >
        {openOnPress ? (
          <View>
            <Pressable
              onPress={toggle}
              accessibilityRole="button"
              accessibilityHint={shouldDescribeTrigger ? accessibleText : undefined}
              accessibilityState={{ expanded: visible }}
            >
              {renderedTrigger}
            </Pressable>
          </View>
        ) : (
          renderedTrigger
        )}
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={hide}
      >
        <View
          style={styles.modalRoot}
          pointerEvents="box-none"
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeOnOutsidePress ? hide : undefined}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
          />

          {renderedContent && computedPosition && (
            <View
              nativeID={tooltipId}
              accessible={!interactive}
              accessibilityLabel={accessibleText}
              accessibilityLiveRegion="polite"
              accessibilityViewIsModal={interactive}
              importantForAccessibility="yes"
              onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                setShellSize({
                  width: Math.ceil(width),
                  height: Math.ceil(height),
                });
              }}
              style={[
                styles.shell,
                {
                  top: computedPosition.top,
                  left: computedPosition.left,
                  zIndex,
                },
              ]}
              pointerEvents="box-none"
            >
              {renderContent ? (
                renderedContent
              ) : (
                <View style={[styles.defaultBubble, { maxWidth }, nativeTooltipStyle]}>
                  {typeof renderedContent === 'string' ? (
                    <Text style={styles.defaultText}>{renderedContent}</Text>
                  ) : (
                    renderedContent
                  )}
                </View>
              )}

              {showAnchor && (
                <View
                  style={buildNativeAnchorStyle({
                    placement: computedPosition.placement,
                    offset: computedPosition.anchorOffset,
                    size: anchorSize,
                    color: resolvedAnchorColor,
                  })}
                />
              )}
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

function extractBackgroundColor(
  style: StyleProp<ViewStyle> | undefined,
): string | undefined {
  if (!style) {
    return undefined;
  }

  const flattenedStyle = StyleSheet.flatten(style);

  const backgroundColor = flattenedStyle?.backgroundColor;

  return typeof backgroundColor === 'string' ? backgroundColor : undefined;
}

function buildNativeAnchorStyle({
  placement,
  offset,
  size,
  color,
}: {
  placement: TooltipPlacement;
  offset: number;
  size: number;
  color: string;
}): StyleProp<ViewStyle> {
  const base: ViewStyle = {
    position: 'absolute',
    width: 0,
    height: 0,
  };

  switch (placement) {
    case 'bottom':
      return [
        base,
        {
          top: -size,
          left: offset - size,
          borderLeftWidth: size,
          borderLeftColor: 'transparent',
          borderRightWidth: size,
          borderRightColor: 'transparent',
          borderBottomWidth: size,
          borderBottomColor: color,
        },
      ];

    case 'top':
      return [
        base,
        {
          bottom: -size,
          left: offset - size,
          borderLeftWidth: size,
          borderLeftColor: 'transparent',
          borderRightWidth: size,
          borderRightColor: 'transparent',
          borderTopWidth: size,
          borderTopColor: color,
        },
      ];

    case 'right':
      return [
        base,
        {
          top: offset - size,
          left: -size,
          borderTopWidth: size,
          borderTopColor: 'transparent',
          borderBottomWidth: size,
          borderBottomColor: 'transparent',
          borderRightWidth: size,
          borderRightColor: color,
        },
      ];

    case 'left':
      return [
        base,
        {
          top: offset - size,
          right: -size,
          borderTopWidth: size,
          borderTopColor: 'transparent',
          borderBottomWidth: size,
          borderBottomColor: 'transparent',
          borderLeftWidth: size,
          borderLeftColor: color,
        },
      ];

    default:
      return base;
  }
}

const styles = StyleSheet.create({
  triggerWrapper: {
    alignSelf: 'flex-start',
  },
  modalRoot: {
    flex: 1,
  },
  shell: {
    position: 'absolute',
  },
  defaultBubble: {
    backgroundColor: '#111827',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  defaultText: {
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 18,
  },
});

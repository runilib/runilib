import type React from 'react';
import { type PropsWithChildren, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  findNodeHandle,
  InteractionManager,
  PixelRatio,
  Platform,
  type StyleProp,
  UIManager,
  View,
  type ViewStyle,
} from 'react-native';

import { useWalkitContext } from '../../../context/WalkitContext';
import type {
  RenderWalkitStepProps,
  TargetRect,
  WalkitNativeScrollHandle,
  WalkitStepProps,
} from '../../../types/Walkit.types';
import { resolveWalkitAutoStart } from '../../../utils/autoStart';
import { DEFAULT_SCROLL_WAIT_MS, VIEWPORT_MARGIN } from '../../../utils/constant';
import { resolveWalkitSequence, withWalkitSequence } from '../../../utils/sequence';
import { normalizeSpotlightPadding } from '../../../utils/spotlight';
import { getWalkitNativeHost } from './hostRegistry.native';

export type NativeWalkitStepProps = PropsWithChildren<
  WalkitStepProps & {
    wrapperStyle?: StyleProp<ViewStyle>;
  }
>;

const STABLE_MEASURE_EPSILON = 0.5;

function waitForNextFrame(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => resolve());
      return;
    }

    setTimeout(resolve, 16);
  });
}

function waitForInteractions(): Promise<void> {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => resolve());
  });
}

function waitForScrollToSettle(waitMs = DEFAULT_SCROLL_WAIT_MS): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, waitMs);
  });
}

function normalizeRect(rect: TargetRect): TargetRect {
  return {
    x: PixelRatio.roundToNearestPixel(rect.x),
    y: PixelRatio.roundToNearestPixel(rect.y),
    width: Math.max(0, PixelRatio.roundToNearestPixel(rect.width)),
    height: Math.max(0, PixelRatio.roundToNearestPixel(rect.height)),
  };
}

function isStableRect(previousRect: TargetRect, nextRect: TargetRect): boolean {
  return (
    Math.abs(previousRect.x - nextRect.x) <= STABLE_MEASURE_EPSILON &&
    Math.abs(previousRect.y - nextRect.y) <= STABLE_MEASURE_EPSILON &&
    Math.abs(previousRect.width - nextRect.width) <= STABLE_MEASURE_EPSILON &&
    Math.abs(previousRect.height - nextRect.height) <= STABLE_MEASURE_EPSILON
  );
}

function measureElementInWindow(
  element: WalkitNativeScrollHandle | View,
): Promise<TargetRect> {
  return new Promise((resolve, reject) => {
    if (typeof element.measureInWindow === 'function') {
      element.measureInWindow((x: number, y: number, width: number, height: number) => {
        resolve(
          normalizeRect({
            x,
            y,
            width,
            height,
          }),
        );
      });
      return;
    }

    reject(new Error('[@runilib/react-walkit] Unable to measure native node in window.'));
  });
}

function measureLayoutRelativeToNode(
  targetHandle: number,
  ancestorHandle: number,
): Promise<TargetRect> {
  return new Promise((resolve, reject) => {
    UIManager.measureLayout(
      targetHandle,
      ancestorHandle,
      () => {
        reject(
          new Error(
            '[@runilib/react-walkit] Failed to measure native node relative to ancestor.',
          ),
        );
      },
      (x: number, y: number, width: number, height: number) => {
        resolve(
          normalizeRect({
            x,
            y,
            width,
            height,
          }),
        );
      },
    );
  });
}

function resolveNativeNodeHandle(target: unknown): number | null {
  if (typeof target === 'number') {
    return target;
  }

  return findNodeHandle(target as Parameters<typeof findNodeHandle>[0]);
}

export function WalkitStep({
  children,
  id,
  sequence,
  title,
  content,
  route,
  placement = 'auto',
  active = true,
  wrapperStyle,
  onBeforeShow,
  scrollViewRef,
  autoStart,
  renderPopover,
  stopOnOutsideClick,
  spotlightPaddingOverride,
  spotlightBorderRadiusOverride,
}: NativeWalkitStepProps): React.ReactElement {
  const containerRef = useRef<View | null>(null);
  const onBeforeShowRef = useRef(onBeforeShow);
  const renderPopoverRef = useRef(renderPopover);
  const autoStartValue =
    typeof autoStart === 'boolean' || typeof autoStart === 'string'
      ? autoStart
      : undefined;
  const hasCustomRenderPopover = renderPopover != null;
  const hasAutoStartObject = typeof autoStart === 'object' && autoStart !== null;
  const autoStartMode = hasAutoStartObject ? autoStart.mode : undefined;
  const autoStartKey = hasAutoStartObject ? autoStart.key : undefined;
  const autoStartDelay = hasAutoStartObject ? autoStart.delay : undefined;

  const resolvedAutoStart = useMemo(
    () =>
      resolveWalkitAutoStart(
        id,
        autoStartValue ??
          (hasAutoStartObject
            ? {
                mode: autoStartMode,
                key: autoStartKey,
                delay: autoStartDelay,
              }
            : undefined),
      ),
    [id, autoStartValue, hasAutoStartObject, autoStartMode, autoStartKey, autoStartDelay],
  );
  const resolvedSequence = useMemo(
    () => resolveWalkitSequence({ sequence }, `step "${id}"`),
    [id, sequence],
  );

  const resolvedSpotlightPaddingOverride = useMemo(() => {
    if (spotlightPaddingOverride == null) {
      return undefined;
    }

    if (typeof spotlightPaddingOverride === 'number') {
      return normalizeSpotlightPadding(spotlightPaddingOverride);
    }

    const { top, right, bottom, left } = spotlightPaddingOverride;

    if (top == null && right == null && bottom == null && left == null) {
      return undefined;
    }

    return normalizeSpotlightPadding({ top, right, bottom, left });
  }, [spotlightPaddingOverride]);

  const { registerStep, unregisterStep } = useWalkitContext();

  onBeforeShowRef.current = onBeforeShow;
  renderPopoverRef.current = renderPopover;

  const resolvedRenderPopover = useCallback(
    (props: RenderWalkitStepProps) => renderPopoverRef.current?.(props) ?? null,
    [],
  );

  const measure = useCallback((): Promise<TargetRect> => {
    const container = containerRef.current;

    if (!container) {
      return Promise.reject(
        new Error(`[@runilib/react-walkit] ref not attached for step "${id}"`),
      );
    }

    const readRect = (): Promise<TargetRect> =>
      new Promise<TargetRect>((resolve, reject) => {
        const resolveRect = (
          x: number,
          y: number,
          width: number,
          height: number,
        ): void => {
          resolve(
            normalizeRect({
              x,
              y,
              width,
              height,
            }),
          );
        };

        const readWindowRect = (): void => {
          if (typeof container.measureInWindow === 'function') {
            container.measureInWindow(
              (
                measuredX: number,
                measuredY: number,
                measuredWidth: number,
                measuredHeight: number,
              ) => {
                resolveRect(measuredX, measuredY, measuredWidth, measuredHeight);
              },
            );
            return;
          }

          if (typeof container.measure === 'function') {
            container.measure(
              (
                _localX: number,
                _localY: number,
                measuredWidth: number,
                measuredHeight: number,
                pageX: number,
                pageY: number,
              ) => {
                resolveRect(pageX, pageY, measuredWidth, measuredHeight);
              },
            );
            return;
          }

          reject(
            new Error(
              `[@runilib/react-walkit] Cannot measure step "${id}". Make sure the wrapper View has collapsable={false}.`,
            ),
          );
        };

        const host = getWalkitNativeHost();

        if (
          host &&
          typeof host.measureInWindow === 'function' &&
          typeof container.measureInWindow === 'function'
        ) {
          host.measureInWindow((hostX: number, hostY: number) => {
            container.measureInWindow(
              (
                measuredX: number,
                measuredY: number,
                measuredWidth: number,
                measuredHeight: number,
              ) => {
                resolveRect(
                  measuredX - hostX,
                  measuredY - hostY,
                  measuredWidth,
                  measuredHeight,
                );
              },
            );
          });
          return;
        }

        readWindowRect();
      });

    return (async () => {
      await waitForInteractions();

      const attempts = Platform.OS === 'android' ? 4 : 3;
      let previousRect: TargetRect | null = null;
      let latestRect: TargetRect | null = null;

      for (let attempt = 0; attempt < attempts; attempt += 1) {
        await waitForNextFrame();
        const nextRect = await readRect();
        latestRect = nextRect;

        if (nextRect.width <= 0 || nextRect.height <= 0) {
          continue;
        }

        if (previousRect && isStableRect(previousRect, nextRect)) {
          return nextRect;
        }

        previousRect = nextRect;
      }

      if (latestRect && latestRect.width > 0 && latestRect.height > 0) {
        return latestRect;
      }

      throw new Error(
        `[@runilib/react-walkit] Failed to stabilize measurement for step "${id}".`,
      );
    })();
  }, [id]);

  const ensureVisible = useCallback(async (): Promise<void> => {
    await onBeforeShowRef.current?.();

    const container = containerRef.current;
    const scrollView = scrollViewRef?.current;

    if (
      !container ||
      !scrollView ||
      (Platform.OS !== 'android' && Platform.OS !== 'ios')
    ) {
      return;
    }

    try {
      const containerHandle = resolveNativeNodeHandle(container);
      const scrollHandle = resolveNativeNodeHandle(scrollView);

      if (containerHandle == null || scrollHandle == null) {
        return;
      }

      const [scrollRect, targetViewportRect] = await Promise.all([
        measureElementInWindow(scrollView),
        measureLayoutRelativeToNode(containerHandle, scrollHandle),
      ]);

      const isVisibleWithinScrollViewport =
        targetViewportRect.y >= VIEWPORT_MARGIN &&
        targetViewportRect.y + targetViewportRect.height <=
          scrollRect.height - VIEWPORT_MARGIN;

      if (isVisibleWithinScrollViewport) {
        await waitForNextFrame();
        return;
      }

      const innerViewNode = scrollView.getInnerViewNode?.();
      const innerHandle = resolveNativeNodeHandle(innerViewNode);

      if (innerHandle == null || typeof scrollView.scrollTo !== 'function') {
        return;
      }

      const targetContentRect = await measureLayoutRelativeToNode(
        containerHandle,
        innerHandle,
      );
      const availableViewportHeight = Math.max(
        0,
        scrollRect.height - VIEWPORT_MARGIN * 2,
      );
      const centeredOffset =
        targetContentRect.y -
        Math.max(
          VIEWPORT_MARGIN,
          (availableViewportHeight - targetContentRect.height) / 2,
        );

      scrollView.scrollTo({
        y: Math.max(0, centeredOffset),
        animated: true,
      });

      await waitForScrollToSettle();
      await waitForInteractions();
      await waitForNextFrame();
    } catch {
      // Fall back to the consumer-provided onBeforeShow hook only.
    }
  }, [scrollViewRef]);

  useEffect(() => {
    if (!active) {
      unregisterStep(id);
      return;
    }

    registerStep(
      withWalkitSequence(
        {
          id,
          title,
          content,
          route,
          placement,
          measure,
          ensureVisible,
          autoStart: resolvedAutoStart,
          renderPopover: hasCustomRenderPopover ? resolvedRenderPopover : undefined,
          stopOnOutsideClick,
          spotlightPaddingOverride: resolvedSpotlightPaddingOverride,
          spotlightBorderRadiusOverride,
        },
        resolvedSequence,
      ),
    );

    return () => {
      unregisterStep(id);
    };
  }, [
    active,
    measure,
    ensureVisible,
    id,
    route,
    placement,
    registerStep,
    content,
    title,
    resolvedSequence,
    resolvedSpotlightPaddingOverride,
    resolvedAutoStart,
    stopOnOutsideClick,
    hasCustomRenderPopover,
    unregisterStep,
    spotlightBorderRadiusOverride,
    resolvedRenderPopover,
  ]);

  return (
    <View
      ref={containerRef}
      collapsable={false}
      pointerEvents="box-none"
      style={wrapperStyle}
    >
      {children}
    </View>
  );
}

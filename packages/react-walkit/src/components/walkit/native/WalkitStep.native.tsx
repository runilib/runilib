import type React from 'react';
import { type PropsWithChildren, useCallback, useEffect, useMemo, useRef } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { useWalkitContext } from '../../../context/WalkitContext';
import type {
  RenderWalkitStepProps,
  TargetRect,
  WalkitStepProps,
} from '../../../types/Walkit.types';
import { resolveWalkitAutoStart } from '../../../utils/autoStart';
import { resolveWalkitSequence, withWalkitSequence } from '../../../utils/sequence';
import { normalizeSpotlightPadding } from '../../../utils/spotlight';

export type NativeWalkitStepProps = PropsWithChildren<
  WalkitStepProps & {
    wrapperStyle?: StyleProp<ViewStyle>;
  }
>;

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
  autoStart,
  renderPopover,
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

    return new Promise<TargetRect>((resolve, reject) => {
      if (typeof container.measureInWindow === 'function') {
        container.measureInWindow(
          (
            measuredX: number,
            measuredY: number,
            measuredWidth: number,
            measuredHeight: number,
          ) => {
            resolve({
              x: measuredX,
              y: measuredY,
              width: measuredWidth,
              height: measuredHeight,
            });
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
            resolve({
              x: pageX,
              y: pageY,
              width: measuredWidth,
              height: measuredHeight,
            });
          },
        );
        return;
      }

      reject(
        new Error(
          `[@runilib/react-walkit] Cannot measure step "${id}". Make sure the wrapper View has collapsable={false}.`,
        ),
      );
    });
  }, [id]);

  const ensureVisible = useCallback(async (): Promise<void> => {
    await onBeforeShowRef.current?.();
  }, []);

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

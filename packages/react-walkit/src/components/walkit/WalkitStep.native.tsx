import type React from 'react';
import { type PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { useWalkitContext } from '../../context/WalkitContext';
import type { TargetRect, WalkitStepProps } from '../../types/Walkit.types';

export type NativeTooltipStepProps = PropsWithChildren<
  WalkitStepProps & {
    wrapperStyle?: StyleProp<ViewStyle>;
  }
>;

export function WalkitStep({
  children,
  id,
  order,
  title,
  content,
  placement = 'auto',
  active = true,
  wrapperStyle,
}: NativeTooltipStepProps): React.ReactElement {
  const containerRef = useRef<View | null>(null);
  const { registerStep, unregisterStep } = useWalkitContext();

  const measure = useCallback((): Promise<TargetRect> => {
    const container = containerRef.current;

    if (!container) {
      return Promise.reject(
        new Error(`[@runilib/react-walkit] ref not attached for step "${name}"`),
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

  useEffect(() => {
    if (!active) {
      return;
    }

    registerStep({
      id,
      order,
      title,
      content,
      placement,
      measure,
    });

    return () => {
      unregisterStep(id);
    };
  }, [
    active,
    measure,
    id,
    order,
    placement,
    registerStep,
    content,
    title,
    unregisterStep,
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

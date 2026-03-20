import { useCallback, useEffect, useRef } from 'react';
import { View } from "react-native";

import { useTooltipContext } from "../../context/TooltipContext";
import type { TooltipRect, TooltipStepProps } from "../../types";

export const NativeTooltipStep= ({
  children,
  name,
  order,
  title,
  text,
  placement = "auto",
  active = true,
}:TooltipStepProps) => {
  const containerRef = useRef<View | null>(null);
  const { registerStep, unregisterStep } = useTooltipContext();

  const measure = useCallback((): Promise<TooltipRect> => {
    const container = containerRef.current;

    if (!container) {
      return Promise.reject(
        new Error(`[runilib/tooltip] ref not attached for step "${name}"`)
      );
    }

    return new Promise<TooltipRect>((resolve, reject) => {
      if (typeof container.measureInWindow === "function") {
        container.measureInWindow(
          (measuredX: number, measuredY: number, measuredWidth: number, measuredHeight: number) => {
            resolve({
              x: measuredX,
              y: measuredY,
              width: measuredWidth,
              height: measuredHeight,
            });
          }
        );
        return;
      }

      if (typeof container.measure === "function") {
        container.measure(
          (
            _localX: number,
            _localY: number,
            measuredWidth: number,
            measuredHeight: number,
            pageX: number,
            pageY: number
          ) => {
            resolve({
              x: pageX,
              y: pageY,
              width: measuredWidth,
              height: measuredHeight,
            });
          }
        );
        return;
      }

      reject(
        new Error(
          `[react-unikit/tooltip] Cannot measure step "${name}". Make sure the wrapper View has collapsable={false}.`
        )
      );
    });
  }, [name]);

  useEffect(() => {
    if (!active) {
      return;
    }

    registerStep({
      name,
      order,
      title,
      text,
      placement,
      measure,
    });

    return () => {
      unregisterStep(name);
    };
  }, [active, measure, name, order, placement, registerStep, text, title, unregisterStep]);

  return (
    <View ref={containerRef} collapsable={false} pointerEvents="box-none">
      {children}
    </View>
  );
};

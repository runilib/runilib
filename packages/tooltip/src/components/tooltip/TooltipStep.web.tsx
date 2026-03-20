import React, {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { useTooltipContext } from "../../context/TooltipContext";
import type { TooltipRect, TooltipStepProps } from "../../types";

type RefableWebChildProps = {
  ref?: React.Ref<HTMLElement>;
  "runilib-tooltip-step"?: string;
};

type RefableWebChild = ReactElement<RefableWebChildProps>;

export const WebTooltipStep = ({
  children,
  name,
  order,
  title,
  text,
  placement = "auto",
  active = true,
}:TooltipStepProps) => {
  const targetElementRef = useRef<HTMLElement | null>(null);
  const { registerStep, unregisterStep } = useTooltipContext();

  const setTargetElementRef = useCallback((element: HTMLElement | null) => {
    targetElementRef.current = element;
  }, []);

  const measure = useCallback((): Promise<TooltipRect> => {
    const element = targetElementRef.current;

    if (!element) {
      return Promise.reject(
        new Error(`[react-unikit/tooltip] ref not attached for step "${name}"`)
      );
    }

    const rect = element.getBoundingClientRect();

    return Promise.resolve({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
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

  if (!isValidElement(children)) {
    throw new Error(
      `[runilib/tooltip] TooltipStep "${name}" expects a single React element child.`
    );
  }

  const childElement = Children.only(children) as RefableWebChild;

  return cloneElement(childElement, {
    ref: setTargetElementRef,
    "runilib-tooltip-step": name,
  });
};

import React, {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { useTooltipContext } from "../../context/TooltipContext";
import type { TooltipRect } from "../../types";

type WebTooltipStepProps = {
  children: ReactNode;
  name: string;
  order: number;
  title: string;
  text: string;
  placement?: "auto" | "top" | "bottom" | "left" | "right";
  active?: boolean;
  asChild?: boolean;
  wrapperElement?: "div" | "span";
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
};

type RefableChildProps = {
  ref?: React.Ref<HTMLElement>;
  "runilib-tooltip-step"?: string;
};

export const WebTooltipStep = ({
  children,
  name,
  order,
  title,
  text,
  placement = "auto",
  active = true,
  asChild = false,
  wrapperElement = "div",
  wrapperClassName,
  wrapperStyle,
}:WebTooltipStepProps) => {
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
  }, [
    active,
    measure,
    name,
    order,
    placement,
    registerStep,
    text,
    title,
    unregisterStep,
  ]);

  if (asChild) {
    if (!isValidElement(children)) {
      throw new Error(
        `[runilib/tooltip] TooltipStep "${name}" with asChild expects a single valid React element child.`
      );
    }

    const onlyChild = Children.only(children) as ReactElement<RefableChildProps>;

    return cloneElement(onlyChild, {
      ref: setTargetElementRef,
      "runilib-tooltip-step": name,
    });
  }

  const WrapperElement = wrapperElement;

  return (
    <WrapperElement
      ref={setTargetElementRef as React.Ref<HTMLDivElement & HTMLSpanElement>}
      runilib-tooltip-step={name}
      className={wrapperClassName}
      style={wrapperStyle}
    >
      {children}
    </WrapperElement>
  );
};
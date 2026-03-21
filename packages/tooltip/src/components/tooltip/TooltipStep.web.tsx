// import React, {
//   Children,
//   cloneElement,
//   isValidElement,
//   type ReactElement,
//   useCallback,
//   useEffect,
//   useRef,
// } from "react";

// import { useTooltipContext } from "../../context/TooltipContext";
// import type { TooltipRect, TooltipStepProps } from "../../types";

// type RefableChildProps = {
//   ref?: React.Ref<HTMLElement>;
//   "data-runilib-tooltip-step"?: string;
// };

// export function TooltipStep({
//   children,
//   name,
//   order,
//   title,
//   text,
//   placement = "auto",
//   active = true,
//   asChild = false,
//   wrapperElement = "div",
//   wrapperClassName,
//   wrapperStyle,
// }: TooltipStepProps) {
//   const targetElementRef = useRef<HTMLElement | null>(null);
//   const { registerStep, unregisterStep } = useTooltipContext();

//   const setTargetElementRef = useCallback((element: HTMLElement | null) => {
//     targetElementRef.current = element;
//   }, []);

//   const measure = useCallback((): Promise<TooltipRect> => {
//     const element = targetElementRef.current;

//     if (!element) {
//       return Promise.reject(new Error(`[runilib/tooltip] ref not attached for step "${name}"`));
//     }

//     const rect = element.getBoundingClientRect();

//     return Promise.resolve({
//       x: rect.left,
//       y: rect.top,
//       width: rect.width,
//       height: rect.height,
//     });
//   }, [name]);

//   useEffect(() => {
//     if (!active) {
//       return;
//     }

//     registerStep({
//       name,
//       order,
//       title,
//       text,
//       placement,
//       measure,
//     });

//     return () => {
//       unregisterStep(name);
//     };
//   }, [active, measure, name, order, placement, registerStep, text, title, unregisterStep]);

//   if (asChild) {
//     if (!isValidElement(children)) {
//       throw new Error(
//         `[runilib/tooltip] TooltipStep "${name}" with asChild expects a single valid React element child.`
//       );
//     }

//     const onlyChild = Children.only(children) as ReactElement<RefableChildProps>;

//     return cloneElement(onlyChild, {
//       ref: setTargetElementRef,
//       "data-runilib-tooltip-step": name,
//     });
//   }

//   if (wrapperElement === "span") {
//     return (
//       <span
//         ref={setTargetElementRef}
//         data-runilib-tooltip-step={name}
//         className={wrapperClassName}
//         style={wrapperStyle}
//       >
//         {children}
//       </span>
//     );
//   }

//   return (
//     <div
//       ref={setTargetElementRef}
//       data-runilib-tooltip-step={name}
//       className={wrapperClassName}
//       style={wrapperStyle}
//     >
//       {children}
//     </div>
//   );
// }

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

type RefableChildProps = {
  ref?: React.Ref<HTMLElement>;
  "data-runilib-tooltip-step"?: string;
};

const VIEWPORT_MARGIN = 16;
const DEFAULT_SCROLL_WAIT_MS = 300;

function isElementVisibleInViewport(element: HTMLElement, margin = VIEWPORT_MARGIN) {
  const rect = element.getBoundingClientRect();
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  return (
    rect.top >= margin &&
    rect.left >= margin &&
    rect.bottom <= viewportHeight - margin &&
    rect.right <= viewportWidth - margin
  );
}

function waitForNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

function waitForScrollToSettle(waitMs = DEFAULT_SCROLL_WAIT_MS): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, waitMs);
  });
}

export function TooltipStep({
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
  onBeforeShow,
}: TooltipStepProps): React.ReactElement {
  const targetElementRef = useRef<HTMLElement | null>(null);
  const { registerStep, unregisterStep } = useTooltipContext();

  const setTargetElementRef = useCallback((element: HTMLElement | null) => {
    targetElementRef.current = element;
  }, []);

  const measure = useCallback(async (): Promise<TooltipRect> => {
    const element = targetElementRef.current;

    if (!element) {
      throw new Error(`[runilib/tooltip] ref not attached for step "${name}"`);
    }

    const rect = element.getBoundingClientRect();

    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }, [name]);

  const ensureVisible = useCallback(async (): Promise<void> => {
    if (onBeforeShow) {
      await onBeforeShow();
    }

    const element = targetElementRef.current;

    if (!element) {
      return;
    }

    if (isElementVisibleInViewport(element)) {
      await waitForNextPaint();
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

    await waitForScrollToSettle();
    await waitForNextPaint();
  }, [onBeforeShow]);

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
      ensureVisible,
    });

    return () => {
      unregisterStep(name);
    };
  }, [
    active,
    ensureVisible,
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
      "data-runilib-tooltip-step": name,
    });
  }

  if (wrapperElement === "span") {
    return (
      <span
        ref={setTargetElementRef}
        data-runilib-tooltip-step={name}
        className={wrapperClassName}
        style={wrapperStyle}
      >
        {children}
      </span>
    );
  }

  return (
    <div
      ref={setTargetElementRef}
      data-runilib-tooltip-step={name}
      className={wrapperClassName}
      style={wrapperStyle}
    >
      {children}
    </div>
  );
}

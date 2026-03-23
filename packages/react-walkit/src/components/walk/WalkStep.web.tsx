import React, {
  Children,
  cloneElement,
  isValidElement,
  PropsWithChildren,
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { useWalkContext } from "../../context/WalkContext";
import type { TargetRect, WalkStepProps } from "../../types/Walk.types";

type RefableChildProps = {
  ref?: React.Ref<HTMLElement>;
  "data-runilib-react-walkit-step"?: string;
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
    globalThis.setTimeout(resolve, waitMs);
  });
}

export function WalkStep({
  children,
  id,
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
}: Readonly<PropsWithChildren<WalkStepProps>>): React.ReactElement {
  const targetElementRef = useRef<HTMLElement | null>(null);
  const { registerStep, unregisterStep } = useWalkContext();

  const setTargetElementRef = useCallback((element: HTMLElement | null) => {
    targetElementRef.current = element;
  }, []);

  const measure = useCallback(async (): Promise<TargetRect> => {
    const element = targetElementRef.current;

    if (!element) {
      throw new Error(`[@runilib/react-walkit] ref not attached for step "${name}"`);
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
      id,
      order,
      title,
      text,
      placement,
      measure,
      ensureVisible,
    });

    return () => {
      unregisterStep(id);
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
        `[@runilib/react-walkit] WalkStep "${id}" with asChild expects a single valid React element child.`
      );
    }

    const onlyChild = Children.only(children) as ReactElement<RefableChildProps>;

    return cloneElement(onlyChild, {
      ref: setTargetElementRef,
      "data-runilib-react-walkit-step": id,
    });
  }

  if (wrapperElement === "span") {
    return (
      <span
        ref={setTargetElementRef}
        data-runilib-react-walkit-step={id}
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
      data-runilib-react-walkit-step={name}
      className={wrapperClassName}
      style={wrapperStyle}
    >
      {children}
    </div>
  );
}

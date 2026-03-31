import type React from 'react';
import {
  Children,
  cloneElement,
  isValidElement,
  type PropsWithChildren,
  type ReactElement,
  type Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { useWalkitContext } from '../../../context/WalkitContext';
import type {
  RenderWalkitStepProps,
  TargetRect,
  WalkitStepProps,
} from '../../../types/Walkit.types';
import { resolveWalkitAutoStart } from '../../../utils/autoStart';
import {
  isElementVisibleInViewport,
  waitForNextPaint,
  waitForScrollToSettle,
} from '../../../utils/helpers';
import { resolveWalkitSequence, withWalkitSequence } from '../../../utils/sequence';
import { normalizeSpotlightPadding } from '../../../utils/spotlight';

type RefableChildProps = {
  ref?: React.Ref<HTMLElement>;
  'data-runilib-react-walkit-step'?: string;
};

function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (!ref) return;

  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  try {
    (ref as React.MutableRefObject<T | null>).current = value;
  } catch {
    // noop
  }
}

export function WalkitStep({
  children,
  id,
  sequence,
  title,
  content,
  route,
  spotlightPaddingOverride,
  spotlightBorderRadiusOverride,
  placement = 'auto',
  active = true,
  asChild = false,
  wrapperElement = 'div',
  wrapperClassName,
  wrapperStyle,
  onBeforeShow,
  autoStart,
  renderPopover,
}: Readonly<PropsWithChildren<WalkitStepProps>>): React.ReactElement {
  const targetElementRef = useRef<HTMLElement | null>(null);
  const idRef = useRef(id);
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
  const spotlightPaddingValue =
    typeof spotlightPaddingOverride === 'number' ? spotlightPaddingOverride : undefined;
  const spotlightPaddingTop =
    typeof spotlightPaddingOverride === 'object' && spotlightPaddingOverride !== null
      ? spotlightPaddingOverride.top
      : undefined;
  const spotlightPaddingRight =
    typeof spotlightPaddingOverride === 'object' && spotlightPaddingOverride !== null
      ? spotlightPaddingOverride.right
      : undefined;
  const spotlightPaddingBottom =
    typeof spotlightPaddingOverride === 'object' && spotlightPaddingOverride !== null
      ? spotlightPaddingOverride.bottom
      : undefined;
  const spotlightPaddingLeft =
    typeof spotlightPaddingOverride === 'object' && spotlightPaddingOverride !== null
      ? spotlightPaddingOverride.left
      : undefined;
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
    if (
      spotlightPaddingValue == null &&
      spotlightPaddingTop == null &&
      spotlightPaddingRight == null &&
      spotlightPaddingBottom == null &&
      spotlightPaddingLeft == null
    ) {
      return undefined;
    }

    return normalizeSpotlightPadding(
      spotlightPaddingValue ?? {
        top: spotlightPaddingTop,
        right: spotlightPaddingRight,
        bottom: spotlightPaddingBottom,
        left: spotlightPaddingLeft,
      },
    );
  }, [
    spotlightPaddingValue,
    spotlightPaddingTop,
    spotlightPaddingRight,
    spotlightPaddingBottom,
    spotlightPaddingLeft,
  ]);

  const { registerStep, unregisterStep } = useWalkitContext();

  idRef.current = id;
  onBeforeShowRef.current = onBeforeShow;
  renderPopoverRef.current = renderPopover;

  const setTargetElementRef = useCallback((element: HTMLElement | null) => {
    targetElementRef.current = element;
  }, []);

  const resolvedRenderPopover = useCallback(
    (props: RenderWalkitStepProps) => renderPopoverRef.current?.(props) ?? null,
    [],
  );

  /**
   * Stable measure function.
   * It never changes identity, so the registration effect does not rerun
   * just because a callback reference changed.
   */
  const measure = useCallback(async (): Promise<TargetRect> => {
    const element = targetElementRef.current;

    if (!element) {
      throw new Error(
        `[@runilib/react-walkit] ref not attached for step "${idRef.current}"`,
      );
    }

    const rect = element.getBoundingClientRect();

    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }, []);

  /**
   * Stable ensureVisible function.
   * Reads the latest onBeforeShow from a ref.
   */
  const ensureVisible = useCallback(async (): Promise<void> => {
    await onBeforeShowRef.current?.();

    const element = targetElementRef.current;

    if (!element) {
      return;
    }

    if (isElementVisibleInViewport(element)) {
      await waitForNextPaint();
      return;
    }

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });

    await waitForScrollToSettle();
    await waitForNextPaint();
  }, []);

  /**
   * Register/unregister only when real step metadata changes.
   * Do not depend on onBeforeShow, measure, ensureVisible changing on every render.
   */
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
    id,
    title,
    content,
    route,
    placement,
    resolvedSpotlightPaddingOverride,
    spotlightBorderRadiusOverride,
    resolvedSequence,
    resolvedAutoStart,
    hasCustomRenderPopover,
    registerStep,
    unregisterStep,
    measure,
    ensureVisible,
    resolvedRenderPopover,
  ]);

  if (asChild) {
    if (!isValidElement(children)) {
      throw new Error(
        `[@runilib/react-walkit] WalkitStep "${id}" with asChild expects a single valid React element child.`,
      );
    }

    const onlyChild = Children.only(children) as ReactElement<RefableChildProps>;
    const childRef = onlyChild.props.ref;

    return cloneElement(onlyChild, {
      ref: (node: HTMLElement | null) => {
        setTargetElementRef(node);
        assignRef(childRef, node);
      },
      'data-runilib-react-walkit-step': id,
    });
  }

  if (wrapperElement === 'span') {
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
      data-runilib-react-walkit-step={id}
      className={wrapperClassName}
      style={wrapperStyle}
    >
      {children}
    </div>
  );
}

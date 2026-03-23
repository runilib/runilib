import type { CSSProperties, ReactNode } from "react";

// ─── Enums / Unions ───────────────────────────────────────────────────────────

/**
 * Supported animation presets used when showing or transitioning the
 * walkthrough popover between steps.
 *
 * These values are consumed by the internal animation layer on both
 * web and React Native.
 */
export type AnimationType = "fade" | "slide" | "zoom" | "bounce" | "flip" | "glow";

/**
 * Preferred placement of the popover relative to its target element.
 *
 * - `auto` lets the library choose the best available side depending on
 *   available viewport or screen space.
 * - other values express a preferred side.
 */
export type Placement = "auto" | "top" | "bottom" | "left" | "right";

// ─── Theme ────────────────────────────────────────────────────────────────────

/**
 * Visual theme overrides for the default walkthrough popover.
 *
 * This theme only affects the built-in UI rendered by the library.
 * When `renderPopover` is used, consumers are responsible for styling
 * their custom content.
 */
export interface WalkTheme {
  /**
   * Background color of the primary action button.
   */
  primaryButtonColor?: string;

  /**
   * Text color of the primary action button.
   */
  primaryButtonTextColor?: string;

  /**
   * Background color of the default popover container.
   */
  background?: string;

  /**
   * Text color used for the popover title.
   */
  titleColor?: string;

  /**
   * Text color used for the secondary text / description.
   */
  subTitleColor?: string;

  /**
   * Border color of the default popover container.
   */
  border?: string;

  /**
   * Shadow value used by the default web popover.
   *
   * On native, shadow handling depends on platform implementation.
   */
  shadow?: string;

  /**
   * Border radius of the default popover container.
   *
   * Example: `"14px"`.
   */
  borderRadius?: string;
}

// ─── Labels ───────────────────────────────────────────────────────────────────

/**
 * Custom labels used by the default walkthrough popover controls.
 *
 * These labels are ignored when a fully custom popover is rendered
 * through `renderPopover`.
 */
export interface WalkLabels {
  /**
   * Label for the next-step action.
   */
  next?: string;

  /**
   * Label for the previous-step action.
   */
  prev?: string;

  /**
   * Label for the final action shown on the last step.
   */
  finish?: string;

  /**
   * Label for the close action.
   *
   * TODO: widen this type to `string | ReactNode` if richer content
   * is needed in the future.
   */
  close?: string;
}

// ─── Step ─────────────────────────────────────────────────────────────────────

/**
 * Internal normalized representation of a registered walkthrough step.
 *
 * A step is created from `<WalkStep />` and stored in context once mounted.
 * It contains display metadata as well as platform-specific measurement
 * hooks used by the overlay engine.
 */
export interface WalkStepData {
  /**
   * Unique step identifier.
   *
   * This value is also used by `start(stepName)` to start the walkthrough
   * from a specific step.
   */
  id: string;

  /**
   * Sort order of the step in the walkthrough flow.
   *
   * Lower values appear first.
   */
  order: number;

  /**
   * Optional title displayed by the default popover.
   */
  title?: string;

  /**
   * Optional descriptive text displayed by the default popover.
   */
  text?: string;

  /**
   * Preferred popover placement for this step.
   */
  placement?: Placement;

  /**
   * Internal measurement function injected by `<WalkStep />`.
   *
   * It resolves the current on-screen rectangle of the target element.
   * The library uses it to position the spotlight and popover.
   */
  measure: () => Promise<TargetRect>;

  /**
   * Optional visibility preparation hook.
   *
   * This can be used to scroll the target into view, expand a collapsed
   * section, or wait for layout stabilization before measurement.
   */
  ensureVisible?: () => void | Promise<void>;
}

/**
 * A raw target rectangle measured in screen / viewport coordinates.
 */
export interface TargetRect {
  /**
   * Horizontal origin of the target.
   */
  x: number;

  /**
   * Vertical origin of the target.
   */
  y: number;

  /**
   * Measured width of the target.
   */
  width: number;

  /**
   * Measured height of the target.
   */
  height: number;
}

/**
 * Rectangle used by the spotlight overlay.
 *
 * Extends the target rectangle with a computed border radius so the
 * spotlight cutout can visually match the target shape.
 */
export interface SpotlightRect extends TargetRect {
  /**
   * Border radius applied to the spotlight cutout.
   */
  borderRadius: number;
}

// ─── WalkStep position ─────────────────────────────────────────────────────────

/**
 * Final computed position of the popover relative to the active target.
 */
export interface WalkStepPosition {
  /**
   * Popover top offset in viewport / screen coordinates.
   */
  top: number;

  /**
   * Popover left offset in viewport / screen coordinates.
   */
  left: number;

  /**
   * Resolved placement actually used after layout calculation.
   *
   * When the preferred placement cannot fit, the engine may fall back
   * to another side.
   */
  placement: Placement;

  /**
   * Offset of the visual arrow inside the popover shell.
   *
   * For `top` / `bottom`, this represents the horizontal center position
   * of the arrow inside the popover.
   *
   * For `left` / `right`, this represents the vertical center position
   * of the arrow inside the popover.
   */
  arrowOffset: number;
}

// ─── Render WalkStep props ─────────────────────────────────────────────────────

/**
 * Props passed to `renderPopover` when consumers want to fully customize
 * the walkthrough popover UI.
 */
export interface RenderWalkStepProps {
  /**
   * Currently active step metadata.
   */
  walkStep: WalkStepData;

  /**
   * Zero-based index of the active step.
   */
  walkStepIndex: number;

  /**
   * Total number of registered walkthrough steps.
   */
  totalWalkSteps: number;

  /**
   * Moves to the next step or finishes the walkthrough if the current
   * step is the last one.
   */
  onNext: () => void;

  /**
   * Moves to the previous step.
   */
  onPrev: () => void;

  /**
   * Stops the walkthrough immediately.
   */
  onStop: () => void;
}

// ─── Config ───────────────────────────────────────────────────────────────────

/**
 * Runtime callbacks used by the walkthrough engine.
 */
export interface WalkConfig {
  /**
   * Called when the walkthrough starts.
   */
  onStart?: () => void;

  /**
   * Called when the walkthrough stops.
   */
  onStop?: () => void;

  /**
   * Called every time the active step changes.
   *
   * @param step - the newly active step
   * @param index - zero-based index of the newly active step
   */
  onStepChange?: (step: WalkStepData, index: number) => void;
}

// ─── Provider props ───────────────────────────────────────────────────────────

/**
 * Props accepted by `<WalkProvider />`.
 *
 * The provider owns the walkthrough state, renders the overlay layer,
 * and exposes control methods through `useWalk()`.
 */
export interface WalkProviderProps {
  /**
   * Application subtree that can register walkthrough steps.
   */
  children: ReactNode;

  /**
   * Animation preset used by the default popover.
   */
  animationType?: AnimationType;

  /**
   * Theme overrides for the default popover UI.
   */
  theme?: WalkTheme;

  /**
   * Additional style overrides applied to the default popover shell.
   *
   * Prefer a more specific type later if web and native props diverge.
   */
  walkStyle?: object;

  /**
   * Color of the walkthrough overlay mask.
   */
  overlayColor?: string;

  /**
   * Extra spacing around the target when computing the spotlight cutout.
   */
  spotlightPadding?: number;

  /**
   * Border radius applied to the spotlight cutout.
   */
  spotlightBorderRadius?: number;

  /**
   * Whether clicking or pressing outside the active target / popover
   * should stop the walkthrough.
   */
  stopOnOutsideClick?: boolean;

  /**
   * Labels used by the default popover controls.
   */
  labels?: WalkLabels;

  /**
   * Custom popover renderer.
   *
   * When provided, the default popover UI is replaced and the consumer
   * becomes responsible for the content structure and styling.
   */
  renderPopover?: (props: RenderWalkStepProps) => ReactNode;

  /**
   * Called when the walkthrough starts.
   */
  onStart?: () => void;

  /**
   * Called when the walkthrough stops.
   */
  onStop?: () => void;

  /**
   * Called whenever the active step changes.
   */
  onStepChange?: (walkStep: WalkStepData, index: number) => void;
}

// ─── Step props ───────────────────────────────────────────────────────────────

/**
 * Props accepted by `<WalkStep />`.
 *
 * A walk step wraps the target element that should be measured and highlighted.
 */
export interface WalkStepProps {
  /**
   * Unique identifier of the step.
   */
  id: string;

  /**
   * Sort order inside the walkthrough flow.
   */
  order: number;

  /**
   * Optional title displayed in the default popover.
   */
  title?: string;

  /**
   * Optional body text displayed in the default popover.
   */
  text?: string;

  /**
   * Preferred popover placement for this step.
   */
  placement?: Placement;

  /**
   * Controls whether this step should register itself.
   *
   * Useful when rendering repeated lists and only one item should
   * participate in the walkthrough.
   */
  active?: boolean;

  /**
   * Web only.
   *
   * When enabled, the step attempts to attach directly to its child instead
   * of rendering an additional wrapper element.
   *
   * Use this only when the child can safely receive a ref.
   */
  asChild?: boolean;

  /**
   * Web only.
   *
   * Wrapper element used when `asChild` is not enabled.
   */
  wrapperElement?: "div" | "span";

  /**
   * Web only.
   *
   * Class name applied to the wrapper element.
   */
  wrapperClassName?: string;

  /**
   * Web only.
   *
   * Inline styles applied to the wrapper element.
   */
  wrapperStyle?: CSSProperties;

  /**
   * Optional cross-platform pre-display hook.
   *
   * This is particularly useful on React Native when the consumer needs
   * to scroll a `ScrollView` manually before the step is shown.
   */
  onBeforeShow?: () => void | Promise<void>;
}

// ─── useWalk return ───────────────────────────────────────────────────────────

/**
 * Public API returned by `useWalk()`.
 *
 * These methods and values let consumers control and inspect the current
 * walkthrough state.
 */
export interface UseWalkReturn {
  /**
   * Starts the walkthrough.
   *
   * When `stepName` is provided, the walkthrough starts from the matching
   * registered step.
   */
  start: (stepName?: string) => Promise<void>;

  /**
   * Stops the walkthrough immediately.
   */
  stop: () => void;

  /**
   * Moves to the next step.
   */
  next: () => void;

  /**
   * Moves to the previous step.
   */
  prev: () => void;

  /**
   * Navigates to a specific step index.
   */
  goTo: (index: number) => Promise<void>;

  /**
   * Currently active step or `null` when the walkthrough is not running.
   */
  currentStep: WalkStepData | null;

  /**
   * Current measured rectangle of the active target.
   */
  currentRect: TargetRect | null;

  /**
   * Whether the walkthrough is currently active and visible.
   */
  isRunning: boolean;

  /**
   * Total number of registered steps.
   */
  totalSteps: number;

  /**
   * Zero-based index of the current step.
   */
  currentIndex: number;

  /**
   * Whether the current step is the first one.
   */
  isFirstStep: boolean;

  /**
   * Whether the current step is the last one.
   */
  isLastStep: boolean;
}

// ─── Context value ────────────────────────────────────────────────────────────

/**
 * Internal context contract used by the walkthrough provider and hooks.
 */
export interface WalkContextValue {
  /**
   * Registered steps sorted by `order`.
   */
  sortedSteps: WalkStepData[];

  /**
   * Zero-based index of the active step.
   */
  currentIndex: number;

  /**
   * Currently active step.
   */
  currentStep: WalkStepData | null;

  /**
   * Current measured rectangle of the active target.
   */
  currentRect: TargetRect | null;

  /**
   * Whether the walkthrough overlay is visible.
   */
  visible: boolean;

  /**
   * Runtime callbacks and lifecycle configuration.
   */
  config: WalkConfig;

  /**
   * Registers a step in the provider state.
   */
  registerStep: (step: WalkStepData) => void;

  /**
   * Unregisters a step by name.
   */
  unregisterStep: (name: string) => void;

  /**
   * Starts the walkthrough.
   */
  start: (stepName?: string) => Promise<void>;

  /**
   * Stops the walkthrough.
   */
  stop: () => void;

  /**
   * Moves to the next step.
   *
   * The optional `steps` argument is used internally to work with a stable
   * sorted snapshot during transitions.
   */
  next: (steps?: WalkStepData[]) => Promise<void>;

  /**
   * Moves to the previous step.
   *
   * The optional `steps` argument is used internally to work with a stable
   * sorted snapshot during transitions.
   */
  prev: (steps?: WalkStepData[]) => Promise<void>;

  /**
   * Navigates to a specific step index.
   */
  goTo: (index: number) => Promise<void>;

  /**
   * Measures a target and reveals the overlay for the given step index.
   *
   * This is primarily an internal orchestration method.
   */
  measureAndShow: (index: number, steps: WalkStepData[]) => Promise<void>;
}

// ─── Overlay shared props ─────────────────────────────────────────────────────

/**
 * Shared props used by the overlay layer on web and native.
 *
 * The overlay is responsible for rendering the mask, spotlight, and
 * active walkthrough popover.
 */
export interface OverlayProps {
  /**
   * Whether the overlay is visible.
   */
  visible: boolean;

  /**
   * Rectangle of the currently active target.
   */
  currentRect: TargetRect | null;

  /**
   * Currently active step.
   */
  currentWalkStep: WalkStepData | null;

  /**
   * Zero-based index of the active step.
   */
  walkStepIndex: number;

  /**
   * Total number of registered steps.
   */
  totalWalkSteps: number;

  /**
   * Animation preset used by the active popover.
   */
  animationType: AnimationType;

  /**
   * Overlay mask color.
   */
  overlayColor?: string;

  /**
   * Extra padding applied around the spotlight target.
   */
  spotlightPadding: number;

  /**
   * Border radius applied to the spotlight cutout.
   */
  spotlightBorderRadius: number;

  /**
   * Theme overrides for the default popover UI.
   */
  theme?: WalkTheme;

  /**
   * Style overrides for the default popover shell.
   */
  walkStyle?: object;

  /**
   * Custom popover renderer.
   */
  renderPopover?: (props: RenderWalkStepProps) => ReactNode;

  /**
   * Whether clicking or pressing outside should stop the walkthrough.
   */
  stopOnOutsideClick: boolean;

  /**
   * Labels used by the default popover controls.
   */
  labels: WalkLabels;

  /**
   * Advances to the next step.
   */
  onNext: () => void;

  /**
   * Goes back to the previous step.
   */
  onPrev: () => void;

  /**
   * Stops the walkthrough.
   */
  onStop: () => void;
}

// ─── WalkStep shared props ─────────────────────────────────────────────────────

/**
 * Shared props passed to the built-in walkthrough popover component.
 */
export interface WalkPopoverProps {
  /**
   * Currently active step data.
   */
  walkStep: WalkStepData;

  /**
   * Zero-based index of the active step.
   */
  walkStepIndex: number;

  /**
   * Total number of registered steps.
   */
  totalWalkSteps: number;

  /**
   * Final computed popover position.
   */
  walkStepPos: WalkStepPosition;

  /**
   * Animation preset used by the popover.
   */
  animationType: AnimationType;

  /**
   * Theme overrides for the default popover UI.
   */
  theme?: WalkTheme;

  /**
   * Additional style overrides for the default popover shell.
   */
  walkStyle?: object;

  /**
   * Custom popover renderer.
   */
  renderPopover?: (props: RenderWalkStepProps) => ReactNode;

  /**
   * Labels used by the default action controls.
   */
  labels: WalkLabels;

  /**
   * Advances to the next step.
   */
  onNext: () => void;

  /**
   * Goes back to the previous step.
   */
  onPrev: () => void;

  /**
   * Stops the walkthrough.
   */
  onStop: () => void;

  /**
   * Optional measurement callback fired once the popover layout is known.
   *
   * This is useful when the final popover size must be fed back into
   * the positioning engine.
   */
  onMeasure?: (layout: { width: number; height: number }) => void;
}

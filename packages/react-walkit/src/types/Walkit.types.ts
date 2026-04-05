import type { CSSProperties, ReactNode } from 'react';

import type { SpotlightPadding } from '../utils/spotlight';
import type { WalkitStopReason, WalkitTransitionAction } from './analitycs.types';

// ─── Enums / Unions ───────────────────────────────────────────────────────────

/**
 * Supported animation presets used when showing or transitioning the
 * walkthrough popover between steps.
 *
 * These values are consumed by the internal animation layer on both
 * web and React Native.
 */
export type AnimationType = 'fade' | 'slide' | 'zoom' | 'bounce' | 'flip' | 'glow';

/**
 * Preferred placement of the popover relative to its target element.
 *
 * - `auto` lets the library choose the best available side depending on
 *   available viewport or screen space.
 * - other values express a preferred side.
 */
export type Placement = 'auto' | 'top' | 'bottom' | 'left' | 'right';

/**
 * Auto-start strategies supported by `<WalkitStep autoStart />`.
 *
 * - `always`: auto-start every time the step mounts
 * - `once`: auto-start only once per app session
 */
export type WalkitAutoStartMode = 'always' | 'once';

/**
 * Public auto-start configuration accepted by `<WalkitStep />`.
 */
export interface WalkitAutoStartOptions {
  /**
   * Auto-start strategy.
   *
   * Defaults to `always`.
   */
  mode?: WalkitAutoStartMode;

  /**
   * Optional session key used when `mode="once"`.
   *
   * Defaults to the step id.
   */
  key?: string;

  /**
   * Optional delay before the walkthrough starts automatically.
   *
   * Useful when entering a screen with transitions or async layout work.
   */
  delay?: number;
}

/**
 * Shorthand accepted by the public `<WalkitStep autoStart />` prop.
 */
export type WalkitAutoStart = boolean | WalkitAutoStartMode | WalkitAutoStartOptions;

/**
 * Internal normalized auto-start configuration stored in context.
 */
export interface ResolvedWalkitAutoStart {
  mode: WalkitAutoStartMode;
  key: string;
  delay: number;
}

interface WalkitFlowStepBase {
  /**
   * Unique step identifier.
   *
   * This must match the `id` used by the corresponding `<WalkitStep />`.
   */
  id: string;

  /**
   * Optional route or screen metadata for this step.
   *
   * The library does not navigate automatically; this value is passed back
   * to `onFlowStepChange` so the app can decide how to navigate.
   */
  route?: string;
}

/**
 * Minimal flow definition used by `<WalkitProvider steps />` to describe
 * a tour sequence that may span multiple routes or screens.
 */
export interface WalkitFlowStep extends WalkitFlowStepBase {
  /**
   * Sort sequence inside the walkthrough flow.
   */
  sequence: number;
}

/**
 * Request emitted when the next target step in a declared flow is not
 * currently mounted and the app needs to move to another route/screen
 * or reveal the target UI before the tour can continue.
 */
export interface WalkitFlowChangeRequest {
  /**
   * Transition action that triggered this flow change.
   */
  action: Exclude<WalkitTransitionAction, 'stop'>;

  /**
   * Flow step the tour is trying to activate.
   */
  toStep: WalkitFlowStep;

  /**
   * Previously active flow step, if any.
   */
  fromStep: WalkitFlowStep | null;
}

// ─── Theme ────────────────────────────────────────────────────────────────────

/**
 * Visual theme overrides for the default walkthrough popover.
 *
 * This theme only affects the built-in UI rendered by the library.
 * When `renderPopover` is used, consumers are responsible for styling
 * their custom content.
 */
export interface WalkitTheme {
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
export interface WalkitLabels {
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
 * A step is created from `<WalkitStep />` and stored in context once mounted.
 * It contains display metadata as well as platform-specific measurement
 * hooks used by the overlay engine.
 */
export interface WalkitStepData {
  /**
   * Unique step identifier.
   *
   * This value is also used by `start(stepName)` to start the walkthrough
   * from a specific step.
   */
  id: string;

  /**
   * Sort sequence of the step in the walkthrough flow.
   *
   * Lower values appear first.
   */
  sequence: number;

  /**
   * Optional title displayed by the default popover.
   */
  title?: string;

  /**
   * Optional descriptive text displayed by the default popover.
   */
  content?: string;

  /**
   * Optional route or screen metadata associated with this step.
   */
  route?: string;

  /**
   * Preferred popover placement for this step.
   */
  placement?: Placement;

  /**
   * Internal measurement function injected by `<WalkitStep />`.
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

  /**
   * Optional auto-start configuration for this step.
   *
   * When present, the walkthrough starts automatically from this step
   * after registration.
   */
  autoStart?: ResolvedWalkitAutoStart;

  /**
   * Optional step-level popover renderer.
   *
   * When present, it overrides the provider-level `renderPopover`
   * for this step only.
   */
  renderPopover?: (props: RenderWalkitStepProps) => ReactNode;

  spotlightPaddingOverride?: SpotlightPadding;
  spotlightBorderRadiusOverride?: number;
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

// ─── WalkitStep position ─────────────────────────────────────────────────────────

/**
 * Final computed position of the popover relative to the active target.
 */
export interface WalkitStepPosition {
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

// ─── Render WalkitStep props ─────────────────────────────────────────────────────

/**
 * Props passed to `renderPopover` when consumers want to fully customize
 * the walkthrough popover UI.
 */
export interface RenderWalkitStepProps {
  /**
   * Currently active step metadata.
   */
  walkitStep: WalkitStepData;

  /**
   * Zero-based index of the active step.
   */
  walkitStepIndex: number;

  /**
   * Total number of registered walkthrough steps.
   */
  totalWalkitSteps: number;

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
export interface WalkitConfig {
  /**
   * Optional global flow definition.
   *
   * When provided, Walkit uses this list as the source of truth for
   * ordering and can continue a tour across routes/screens.
   */
  steps?: WalkitFlowStep[];

  /**
   * Called when the next target step in the declared flow is not mounted.
   *
   * Use this to navigate to another page/screen or reveal the UI that
   * contains the target step. After this callback resolves, Walkit waits
   * for the requested step to mount.
   */
  onFlowStepChange?: (request: WalkitFlowChangeRequest) => void | Promise<void>;

  /**
   * Maximum time to wait for a requested target step to mount after
   * `onFlowStepChange` runs.
   *
   * Defaults to `5000`.
   */
  stepMountTimeoutMs?: number;

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
  onStepChange?: (step: WalkitStepData, index: number) => void;
}

/**
 * Minimal native scroll container contract used by `<WalkitStep />`
 * when it needs to reveal an off-screen target before measurement.
 *
 * This stays intentionally structural so consumers can pass refs coming
 * from `ScrollView`, `FlatList`, or compatible wrappers without importing
 * React Native types into the shared public API.
 */
export interface WalkitNativeScrollHandle {
  measureInWindow?: (
    callback: (x: number, y: number, width: number, height: number) => void,
  ) => void;
  scrollTo?: (options: { x?: number; y?: number; animated?: boolean }) => void;
  getInnerViewNode?: () => unknown;
}

/**
 * Ref shape accepted by the native auto-scroll support on `<WalkitStep />`.
 */
export interface WalkitNativeScrollRef {
  current: WalkitNativeScrollHandle | null;
}

// ─── Provider props ───────────────────────────────────────────────────────────

/**
 * Props accepted by `<WalkitProvider />`.
 *
 * The provider owns the walkthrough state, renders the overlay layer,
 * and exposes control methods through `useWalkit()`.
 */
export interface WalkitProviderProps {
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
  theme?: WalkitTheme;

  /**
   * Additional style overrides applied to the default popover shell.
   *
   * Prefer a more specific type later if web and native props diverge.
   */
  walkitStyle?: object;

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
   * Optional global tour flow definition.
   *
   * This is especially useful when a tour spans multiple pages/screens
   * and not every target step is mounted at the same time.
   */
  steps?: WalkitFlowStep[];

  /**
   * Whether clicking or pressing outside the active target / popover
   * should stop the walkthrough.
   */
  stopOnOutsideClick?: boolean;

  /**
   * Labels used by the default popover controls.
   */
  labels?: WalkitLabels;

  /**
   * Custom popover renderer.
   *
   * When provided, the default popover UI is replaced and the consumer
   * becomes responsible for the content structure and styling.
   */
  renderPopover?: (props: RenderWalkitStepProps) => ReactNode;

  /**
   * Called when the next target step in the declared flow is not mounted.
   *
   * Use this to navigate to another page/screen or reveal the target UI.
   */
  onFlowStepChange?: (request: WalkitFlowChangeRequest) => void | Promise<void>;

  /**
   * Maximum time to wait for a requested target step to mount after
   * `onFlowStepChange` runs.
   *
   * Defaults to `5000`.
   */
  stepMountTimeoutMs?: number;

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
  onStepChange?: (walkitStep: WalkitStepData, index: number) => void;
}

// ─── Step props ───────────────────────────────────────────────────────────────

/**
 * Props accepted by `<WalkitStep />`.
 *
 * A Walkit step wraps the target element that should be measured and highlighted.
 */
interface WalkitStepPropsBase {
  /**
   * Unique identifier of the step.
   */
  id: string;

  /**
   * Sort sequence of the step in the walkthrough flow.
   *
   * Lower values appear first.
   */
  sequence: number;

  /**
   * Optional title displayed in the default popover.
   */
  title?: string;

  /**
   * Optional body text displayed in the default popover.
   */
  content?: string;

  /**
   * Optional route or screen metadata for this step.
   *
   * This is useful when the same step definition is also passed to the
   * provider-level `steps` flow list.
   */
  route?: string;

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
  wrapperElement?: 'div' | 'span';

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

  /**
   * React Native only.
   *
   * Optional scroll container ref used by the built-in native auto-scroll
   * logic to reveal the target before measuring it.
   */
  scrollViewRef?: WalkitNativeScrollRef;

  /**
   * Optional auto-start behavior for this step.
   *
   * - `true` or `'always'` starts the walkthrough every time the step mounts
   * - `'once'` starts it only once per app session
   * - an object allows custom `mode`, `key`, and `delay`
   *
   * The walkthrough starts from this step's `id`.
   */
  autoStart?: WalkitAutoStart;

  /**
   * Optional custom popover renderer for this step only.
   *
   * When provided, it takes priority over the provider-level
   * `renderPopover` while this step is active.
   */
  renderPopover?: (props: RenderWalkitStepProps) => ReactNode;

  spotlightPaddingOverride?: SpotlightPadding;

  spotlightBorderRadiusOverride?: number;
}

export type WalkitStepProps = WalkitStepPropsBase;

// ─── useWalkit return ───────────────────────────────────────────────────────────

/**
 * Public API returned by `useWalkit()`.
 *
 * These methods and values let consumers control and inspect the current
 * walkthrough state.
 */
export interface UseWalkitReturn {
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
  currentStep: WalkitStepData | null;

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
export interface WalkitContextValue {
  /**
   * Registered steps sorted by `sequence`.
   */
  sortedSteps: WalkitStepData[];

  /**
   * Zero-based index of the active step.
   */
  currentIndex: number;

  /**
   * Currently active step.
   */
  currentStep: WalkitStepData | null;

  /**
   * Current measured rectangle of the active target.
   */
  currentRect: TargetRect | null;

  /**
   * Total number of steps in the active flow.
   */
  totalSteps: number;

  /**
   * Whether the walkthrough overlay is visible.
   */
  visible: boolean;

  /**
   * Runtime callbacks and lifecycle configuration.
   */
  config: WalkitConfig;

  /**
   * Registers a step in the provider state.
   */
  registerStep: (step: WalkitStepData) => void;

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
  next: (steps?: WalkitStepData[]) => Promise<void>;

  /**
   * Moves to the previous step.
   *
   * The optional `steps` argument is used internally to work with a stable
   * sorted snapshot during transitions.
   */
  prev: (steps?: WalkitStepData[]) => Promise<void>;

  /**
   * Navigates to a specific step index.
   */
  goTo: (index: number) => Promise<void>;

  /**
   * Measures a target and reveals the overlay for the given step index.
   *
   * This is primarily an internal orchestration method.
   */
  measureAndShow: (index: number, steps?: WalkitStepData[]) => Promise<void>;

  /**
   * Internal analytics helpers
   */
  lastAction: WalkitTransitionAction | null;
  lastStopReason: WalkitStopReason | null;
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
  currentWalkitStep: WalkitStepData | null;

  /**
   * Zero-based index of the active step.
   */
  walkitStepIndex: number;

  /**
   * Total number of registered steps.
   */
  totalWalkitSteps: number;

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
  theme?: WalkitTheme;

  /**
   * Style overrides for the default popover shell.
   */
  walkitStyle?: object;

  /**
   * Custom popover renderer.
   */
  renderPopover?: (props: RenderWalkitStepProps) => ReactNode;

  /**
   * Whether clicking or pressing outside should stop the walkthrough.
   */
  stopOnOutsideClick: boolean;

  /**
   * Labels used by the default popover controls.
   */
  labels: WalkitLabels;

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

// ─── WalkitStep shared props ─────────────────────────────────────────────────────

/**
 * Shared props passed to the built-in walkthrough popover component.
 */
export interface WalkitPopoverProps {
  /**
   * Currently active step data.
   */
  walkitStep: WalkitStepData;

  /**
   * Zero-based index of the active step.
   */
  walkitStepIndex: number;

  /**
   * Total number of registered steps.
   */
  totalWalkitSteps: number;

  /**
   * Final computed popover position.
   */
  walkitStepPosition: WalkitStepPosition;

  /**
   * Animation preset used by the popover.
   */
  animationType: AnimationType;

  /**
   * Theme overrides for the default popover UI.
   */
  theme?: WalkitTheme;

  /**
   * Additional style overrides for the default popover shell.
   */
  walkitStyle?: object;

  /**
   * Custom popover renderer.
   */
  renderPopover?: (props: RenderWalkitStepProps) => ReactNode;

  /**
   * Labels used by the default action controls.
   */
  labels: WalkitLabels;

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

  /**
   * Internal native-only flag used to keep the popover off-screen while
   * measuring its final size before showing it.
   */
  hidden?: boolean;
}

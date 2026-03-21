import type { CSSProperties, ReactNode } from "react";

// ─── Enums / Unions ───────────────────────────────────────────────────────────

export type AnimationType = "fade" | "slide" | "zoom" | "bounce" | "flip" | "glow";
export type TooltipPlacement = "auto" | "top" | "bottom" | "left" | "right";

// ─── Theme ────────────────────────────────────────────────────────────────────

export interface TooltipTheme {
  primary?: string;
  primaryText?: string;
  background?: string;
  text?: string;
  subtext?: string;
  border?: string;
  shadow?: string;
  borderRadius?: string;
}

// ─── Labels ───────────────────────────────────────────────────────────────────

export interface TooltipLabels {
  next?: string;
  prev?: string;
  finish?: string;
  close?: string; // TODO make it to accept string or ReactNode
}

// ─── Step ─────────────────────────────────────────────────────────────────────
export interface TooltipStepData {
  name: string;
  order: number;
  title?: string;
  text?: string;
  placement?: TooltipPlacement;
  /** Internal: measure function injected by <TooltipStep> */
  measure: () => Promise<TooltipRect>;

  ensureVisible?: () => void | Promise<void>;
}

export interface TooltipRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpotlightRect extends TooltipRect {
  borderRadius: number;
}

// ─── Tooltip position ─────────────────────────────────────────────────────────

export interface TooltipPosition {
  top: number;
  left: number;
  placement: TooltipPlacement;
  arrowOffset: number;
}

// ─── Render tooltip props ─────────────────────────────────────────────────────

export interface RenderTooltipProps {
  step: TooltipStepData;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onStop: () => void;
}

// ─── Config ───────────────────────────────────────────────────────────────────

export interface TooltipConfig {
  onStart?: () => void;
  onStop?: () => void;
  onStepChange?: (step: TooltipStepData, index: number) => void;
}

// ─── Provider props ───────────────────────────────────────────────────────────

export interface TooltipProviderProps {
  children: ReactNode;
  animationType?: AnimationType;
  theme?: TooltipTheme;
  tooltipStyle?: object;
  overlayColor?: string;
  spotlightPadding?: number;
  spotlightBorderRadius?: number;
  stopOnOutsideClick?: boolean;
  labels?: TooltipLabels;
  renderTooltip?: (props: RenderTooltipProps) => ReactNode;
  onStart?: () => void;
  onStop?: () => void;
  onStepChange?: (step: TooltipStepData, index: number) => void;
}

// ─── Step props ───────────────────────────────────────────────────────────────
export interface TooltipStepProps {
  children: ReactNode;
  name: string;
  order: number;
  title?: string;
  text?: string;
  placement?: TooltipPlacement;
  active?: boolean;

  /**
   * Web only
   */
  asChild?: boolean;
  wrapperElement?: "div" | "span";
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;

  /**
   * Optional cross-platform hook.
   * Useful on React Native if the user wants to scroll a ScrollView manually.
   */
  onBeforeShow?: () => void | Promise<void>;
}

// ─── useTooltip return ────────────────────────────────────────────────────────

export interface UseTooltipReturn {
  start: (stepName?: string) => Promise<void>;
  stop: () => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => Promise<void>;
  currentStep: TooltipStepData | null;
  currentRect: TooltipRect | null;
  isRunning: boolean;
  totalSteps: number;
  currentIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
}

// ─── Context value ────────────────────────────────────────────────────────────

export interface TooltipContextValue {
  sortedSteps: TooltipStepData[];
  currentIndex: number;
  currentStep: TooltipStepData | null;
  currentRect: TooltipRect | null;
  visible: boolean;
  config: TooltipConfig;
  registerStep: (step: TooltipStepData) => void;
  unregisterStep: (name: string) => void;
  start: (stepName?: string) => Promise<void>;
  stop: () => void;
  next: (steps?: TooltipStepData[]) => Promise<void>;
  prev: (steps?: TooltipStepData[]) => Promise<void>;
  goTo: (index: number) => Promise<void>;
  measureAndShow: (index: number, steps: TooltipStepData[]) => Promise<void>;
}

// ─── Overlay shared props ─────────────────────────────────────────────────────

export interface OverlayProps {
  visible: boolean;
  currentRect: TooltipRect | null;
  currentStep: TooltipStepData | null;
  stepIndex: number;
  totalSteps: number;
  animationType: AnimationType;
  overlayColor?: string;
  spotlightPadding: number;
  spotlightBorderRadius: number;
  theme?: TooltipTheme;
  tooltipStyle?: object;
  renderTooltip?: (props: RenderTooltipProps) => ReactNode;
  stopOnOutsideClick: boolean;
  labels: TooltipLabels;
  onNext: () => void;
  onPrev: () => void;
  onStop: () => void;
}

// ─── Tooltip shared props ─────────────────────────────────────────────────────

export interface TooltipProps {
  step: TooltipStepData;
  stepIndex: number;
  totalSteps: number;
  tooltipPos: TooltipPosition;
  animationType: AnimationType;
  theme?: TooltipTheme;
  tooltipStyle?: object;
  renderTooltip?: (props: RenderTooltipProps) => ReactNode;
  labels: TooltipLabels;
  onNext: () => void;
  onPrev: () => void;
  onStop: () => void;
}

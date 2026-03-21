import { TooltipContextProvider } from "../context/TooltipContext";
import type { TooltipProviderProps } from "../types";
import { TooltipOverlayBridge } from "./Overlay.native";

/**
 * `TooltipProvider`
 * ─────────────────
 * Wrap your app (or a screen) with this component to enable the onboarding tour.
 * Renders on both React (web) and React Native with the same props.
 *
 * @example
 * <TooltipProvider animationType="bounce" theme={{ primary: "#10b981" }}>
 *   <App />
 * </TooltipProvider>
 */
export const TooltipProvider = ({
  children,
  animationType = "slide",
  theme,
  tooltipStyle,
  overlayColor,
  spotlightPadding = 8,
  spotlightBorderRadius = 8,
  maskClickable = false,
  labels = {},
  renderTooltip,
  onStart,
  onStop,
  onStepChange,
}: TooltipProviderProps) => (
  <TooltipContextProvider config={{ onStart, onStop, onStepChange }}>
    <TooltipOverlayBridge
      animationType={animationType}
      theme={theme}
      tooltipStyle={tooltipStyle}
      overlayColor={overlayColor}
      spotlightPadding={spotlightPadding}
      spotlightBorderRadius={spotlightBorderRadius}
      maskClickable={maskClickable}
      labels={labels}
      renderTooltip={renderTooltip}
    />
    {children}
  </TooltipContextProvider>
);

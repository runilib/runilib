import { WalkOverlayBridge } from "../components/overlay/Overlay.web";
import { WalkContextProvider } from "../context/WalkContext";
import type { WalkProviderProps } from "../types/Walk.types";

/**
 * `WalkProvider`
 * ─────────────────
 * Wrap your app (or a screen) with this component to enable the onboarding tour.
 * Renders on both React (web) and React Native with the same props.
 *
 * @example
 * <WalkProvider animationType="bounce" theme={{ primary: "#10b981" }}>
 *   <App />
 * </WalkProvider>
 */
export const WalkProvider = ({
  children,
  animationType = "slide",
  theme,
  walkStyle,
  overlayColor,
  spotlightPadding = 8,
  spotlightBorderRadius = 8,
  stopOnOutsideClick = false,
  labels = {},
  renderPopover,
  onStart,
  onStop,
  onStepChange,
}: WalkProviderProps) => (
  <WalkContextProvider config={{ onStart, onStop, onStepChange }}>
    <WalkOverlayBridge
      animationType={animationType}
      theme={theme}
      walkStyle={walkStyle}
      overlayColor={overlayColor}
      spotlightPadding={spotlightPadding}
      spotlightBorderRadius={spotlightBorderRadius}
      stopOnOutsideClick={stopOnOutsideClick}
      labels={labels}
      renderPopover={renderPopover}
    />
    {children}
  </WalkContextProvider>
);

import { WalkitOverlayBridge } from '../components/overlay/Overlay.web';
import { WalkitContextProvider } from '../context/WalkitContext';
import type { WalkitProviderProps } from '../types/Walkit.types';

/**
 * `WalkitProvider`
 * ─────────────────
 * Wrap your app (or a screen) with this component to enable the onboarding tour.
 * Renders on both React (web) and React Native with the same props.
 *
 * @example
 * <WalkitProvider animationType="bounce" theme={{ primary: "#10b981" }}>
 *   <App />
 * </WalkitProvider>
 */
export const WalkitProvider = ({
  children,
  animationType = 'slide',
  theme,
  walkitStyle,
  overlayColor,
  spotlightPadding = 8,
  spotlightBorderRadius = 8,
  stopOnOutsideClick = false,
  labels = {},
  renderPopover,
  onStart,
  onStop,
  onStepChange,
}: WalkitProviderProps) => (
  <WalkitContextProvider config={{ onStart, onStop, onStepChange }}>
    <WalkitOverlayBridge
      animationType={animationType}
      theme={theme}
      walkitStyle={walkitStyle}
      overlayColor={overlayColor}
      spotlightPadding={spotlightPadding}
      spotlightBorderRadius={spotlightBorderRadius}
      stopOnOutsideClick={stopOnOutsideClick}
      labels={labels}
      renderPopover={renderPopover}
    />
    {children}
  </WalkitContextProvider>
);

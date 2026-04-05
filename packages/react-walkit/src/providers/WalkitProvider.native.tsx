import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { setWalkitNativeHost } from '../components/walkit/native/hostRegistry.native';
import { WalkitOverlayBridge } from '../components/walkit/overlay-bridge/WalkitOverlayBridge.native';
import { WalkitContextProvider } from '../context/WalkitContext';
import type { WalkitProviderProps } from '../types/Walkit.types';

/**
 * `WalkitProvider`
 * ─────────────────
 * Wrap your app (or a screen) with this component to enable the onboarding tour.
 * Renders on both React (web) and React Native with the same props.
 *
 * @example
 * <WalkitProvider animationType="bounce" theme={{ primaryButtonColor: "#10b981" }}>
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
  steps,
  stopOnOutsideClick = false,
  labels = {},
  renderPopover,
  onFlowStepChange,
  stepMountTimeoutMs,
  onStart,
  onStop,
  onStepChange,
}: WalkitProviderProps) => {
  const handleHostRef = useCallback((node: View | null) => {
    setWalkitNativeHost(node);
  }, []);

  return (
    <WalkitContextProvider
      config={{
        steps,
        onFlowStepChange,
        stepMountTimeoutMs,
        onStart,
        onStop,
        onStepChange,
      }}
    >
      <View
        ref={handleHostRef}
        collapsable={false}
        style={styles.root}
      >
        {children}
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
      </View>
    </WalkitContextProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

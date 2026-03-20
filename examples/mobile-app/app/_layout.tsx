import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CopilotProvider } from 'stepwise';
import { TOUR_THEME, TOUR_LABELS } from '../tourConfig';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#f9f5ee" />
      <CopilotProvider
        animationType="bounce"
        overlayColor="rgba(20,16,10,0.80)"
        spotlightPadding={10}
        spotlightBorderRadius={16}
        theme={TOUR_THEME}
        labels={TOUR_LABELS}
        maskClickable={false}
        onStart={() => console.log('[stepwise] tour started')}
        onStop={() => console.log('[stepwise] tour ended')}
        onStepChange={(step, i) => console.log(`[stepwise] step ${i + 1}: ${step.name}`)}
      >
        <Stack screenOptions={{ headerShown: false }} />
      </CopilotProvider>
    </SafeAreaProvider>
  );
}

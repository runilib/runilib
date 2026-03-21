import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TooltipProvider } from '@runilib/tooltip';
import { TOUR_THEME, TOUR_LABELS } from '../tourConfig';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#f9f5ee" />
      <TooltipProvider
        animationType="bounce"
        overlayColor="rgba(20,16,10,0.80)"
        spotlightPadding={5}
        spotlightBorderRadius={16}
        theme={TOUR_THEME}
        labels={TOUR_LABELS}
        stopOnOutsideClick
        onStart={() => console.log('[@runilib/tooltip] tour started')}
        onStop={() => console.log('[@runilib/tooltip] tour ended')}
        onStepChange={(step, i) => console.log(`[@runilib/tooltip] step ${i + 1}: ${step.name}`)}
      >
        <Stack screenOptions={{ headerShown: false }} />
      </TooltipProvider>
    </SafeAreaProvider>
  );
}

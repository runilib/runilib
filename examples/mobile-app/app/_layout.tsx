import { WalkitProvider } from '@runilib/react-walkit';

import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { APP_TOUR_STEPS, TOUR_LABELS, TOUR_THEME } from '../tourConfig';
import { AnalyticsLayer } from './AnalyticsLayer';

export default function RootLayout() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <StatusBar
        style="dark"
        backgroundColor="#f9f5ee"
      />
      <WalkitProvider
        animationType="bounce"
        overlayColor="rgba(20,16,10,0.80)"
        spotlightPadding={5}
        spotlightBorderRadius={16}
        theme={TOUR_THEME}
        labels={TOUR_LABELS}
        steps={APP_TOUR_STEPS}
        stopOnOutsideClick
        onFlowStepChange={({ toStep }) => {
          if (!toStep.route) {
            return;
          }

          router.replace(toStep.route);
        }}
        onStart={() => console.log('[@runilib/react-walkit] tour started')}
        onStop={() => console.log('[@runilib/react-walkit] tour ended')}
        onStepChange={(step, i) =>
          console.log(`[@runilib/react-walkit] step ${i + 1}: ${step.id}`)
        }
      >
        <AnalyticsLayer />
        <Stack screenOptions={{ headerShown: false }} />
      </WalkitProvider>
    </SafeAreaProvider>
  );
}

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WalkitProvider } from '@runilib/react-walkit';
import { TOUR_THEME, TOUR_LABELS } from '../tourConfig';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#f9f5ee" />
      <WalkitProvider
        animationType="bounce"
        overlayColor="rgba(20,16,10,0.80)"
        spotlightPadding={0}
        spotlightBorderRadius={16}
        theme={TOUR_THEME}
        labels={TOUR_LABELS}
        stopOnOutsideClick
        onStart={() => console.log('[@runilib/react-walkit] tour started')}
        onStop={() => console.log('[@runilib/react-walkit] tour ended')}
        onStepChange={(step, i) => console.log(`[@runilib/react-walkit] step ${i + 1}: ${step.id}`)}
      >
        <Stack screenOptions={{ headerShown: false }} />
      </WalkitProvider>
    </SafeAreaProvider>
  );
}

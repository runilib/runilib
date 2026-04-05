import { Redirect, useLocalSearchParams } from 'expo-router';

export default function LegacyWizardRoute() {
  const params = useLocalSearchParams<{ stepId?: string | string[] }>();
  const stepId =
    typeof params.stepId === 'string' && params.stepId.length > 0
      ? params.stepId
      : 'personal';

  return <Redirect href={`/formbridge/wizard/${stepId}`} />;
}

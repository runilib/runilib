import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import * as Haptics from 'expo-haptics';
import { formExampleStyles as s } from './FormExamples.styles';
import { JoiBridgeExample } from './JoiBridgeExample';
import { ValibotBridgeExample } from './ValibotBridgeExample';
// import { YupBridgeExample } from './YupBridgeExample';
import { ZodBridgeExample } from './ZodBridgeExample';

const BRIDGE_TABS = [
  {
    id: 'zod',
    label: 'Zod',
    note: 'Typed parsing',
    component: ZodBridgeExample,
  },
  // {
  //   id: 'yup',
  //   label: 'Yup',
  //   note: 'Chainable rules',
  //   component: YupBridgeExample,
  // },
  {
    id: 'joi',
    label: 'Joi',
    note: 'Strict business rules',
    component: JoiBridgeExample,
  },
  {
    id: 'valibot',
    label: 'Valibot',
    note: 'Composable pipelines',
    component: ValibotBridgeExample,
  },
] as const;

type BridgeTabId = (typeof BRIDGE_TABS)[number]['id'];

export function BridgeExamplesShowcase() {
  const [activeTab, setActiveTab] = useState<BridgeTabId>('zod');
  const activeEntry = BRIDGE_TABS.find((item) => item.id === activeTab) ?? BRIDGE_TABS[0];
  const ActiveExample = activeEntry.component;

  return (
    <View style={s.resolverShowcaseCard}>
      <View style={s.resolverHeader}>
        <View style={s.resolverEyebrow}>
          <Text style={s.resolverEyebrowText}>bridge demos</Text>
        </View>

        <View>
          <Text style={s.resolverTitle}>Schema adapters in action</Text>
          <Text style={s.resolverSubtitle}>
            Switch between real forms wired to Zod, Yup, Joi, and Valibot. Each example
            lives in its own file so the home screen stays maintainable.
          </Text>
        </View>

        <View style={s.resolverSwitchRow}>
          {BRIDGE_TABS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[s.resolverSwitch, item.id === activeTab && s.resolverSwitchActive]}
              onPress={() => {
                void Haptics.selectionAsync();
                setActiveTab(item.id);
              }}
            >
              <Text style={s.resolverSwitchLabel}>{item.label}</Text>
              <Text style={s.resolverSwitchNote}>{item.note}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ActiveExample />
    </View>
  );
}

import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import * as Haptics from 'expo-haptics';
import { formExampleStyles as s } from './FormExamples.styles';
import { JoiResolverExample } from './JoiResolverExample';
import { ValibotResolverExample } from './ValibotResolverExample';
import { YupResolverExample } from './YupResolverExample';
import { ZodResolverExample } from './ZodResolverExample';

const RESOLVER_TABS = [
  {
    id: 'zod',
    label: 'Zod',
    note: 'Typed parsing',
    component: ZodResolverExample,
  },
  {
    id: 'yup',
    label: 'Yup',
    note: 'Chainable rules',
    component: YupResolverExample,
  },
  {
    id: 'joi',
    label: 'Joi',
    note: 'Strict business rules',
    component: JoiResolverExample,
  },
  {
    id: 'valibot',
    label: 'Valibot',
    note: 'Composable pipelines',
    component: ValibotResolverExample,
  },
] as const;

type ResolverTabId = (typeof RESOLVER_TABS)[number]['id'];

export function ResolverExamplesShowcase() {
  const [activeTab, setActiveTab] = useState<ResolverTabId>('zod');
  const activeEntry =
    RESOLVER_TABS.find((item) => item.id === activeTab) ?? RESOLVER_TABS[0];
  const ActiveExample = activeEntry.component;

  return (
    <View style={s.resolverShowcaseCard}>
      <View style={s.resolverHeader}>
        <View style={s.resolverEyebrow}>
          <Text style={s.resolverEyebrowText}>resolver demos</Text>
        </View>

        <View>
          <Text style={s.resolverTitle}>Schema adapters in action</Text>
          <Text style={s.resolverSubtitle}>
            Switch between real forms wired to Zod, Yup, Joi, and Valibot. Each example
            lives in its own file so the home screen stays maintainable.
          </Text>
        </View>

        <View style={s.resolverSwitchRow}>
          {RESOLVER_TABS.map((item) => (
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

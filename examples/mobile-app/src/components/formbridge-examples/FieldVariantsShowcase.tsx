import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import * as Haptics from 'expo-haptics';
import { CheckboxVariantsExample } from './CheckboxVariantsExample';
import { formExampleStyles as s } from './FormExamples.styles';
import { SelectVariantsExample } from './SelectVariantsExample';
import { SwitchVariantsExample } from './SwitchVariantsExample';

const FIELD_VARIANT_TABS = [
  {
    id: 'select',
    label: 'Select',
    note: 'local, radio, async',
    component: SelectVariantsExample,
  },
  {
    id: 'checkbox',
    label: 'Checkbox',
    note: 'consents + opt-ins',
    component: CheckboxVariantsExample,
  },
  {
    id: 'switch',
    label: 'Switch',
    note: 'product toggles',
    component: SwitchVariantsExample,
  },
] as const;

type FieldVariantTabId = (typeof FIELD_VARIANT_TABS)[number]['id'];

export function FieldVariantsShowcase() {
  const [activeTab, setActiveTab] = useState<FieldVariantTabId>('select');
  const activeEntry =
    FIELD_VARIANT_TABS.find((item) => item.id === activeTab) ?? FIELD_VARIANT_TABS[0];
  const ActiveExample = activeEntry.component;

  return (
    <View style={s.resolverShowcaseCard}>
      <View style={s.resolverHeader}>
        <View style={s.resolverEyebrow}>
          <Text style={s.resolverEyebrowText}>field variants</Text>
        </View>

        <View>
          <Text style={s.resolverTitle}>Select, checkbox, and switch patterns</Text>
          <Text style={s.resolverSubtitle}>
            Compare the main choice-field families in one place. Each tab lives in its own
            file so the home screen stays readable while still showing real use cases.
          </Text>
        </View>

        <View style={s.resolverSwitchRow}>
          {FIELD_VARIANT_TABS.map((item) => (
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

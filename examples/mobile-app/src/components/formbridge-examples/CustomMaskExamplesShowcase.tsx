import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import * as Haptics from 'expo-haptics';
import { EmployeeBadgeMaskExample } from './EmployeeBadgeMaskExample';
import { formExampleStyles as s } from './FormExamples.styles';
import { LicensePlateMaskExample } from './LicensePlateMaskExample';

const MASK_TABS = [
  {
    id: 'plate',
    label: 'License plate',
    note: 'Custom separators',
    component: LicensePlateMaskExample,
  },
  {
    id: 'badge',
    label: 'Employee badge',
    note: 'Fixed prefix format',
    component: EmployeeBadgeMaskExample,
  },
] as const;

type MaskTabId = (typeof MASK_TABS)[number]['id'];

export function CustomMaskExamplesShowcase() {
  const [activeTab, setActiveTab] = useState<MaskTabId>('plate');
  const activeEntry = MASK_TABS.find((item) => item.id === activeTab) ?? MASK_TABS[0];
  const ActiveExample = activeEntry.component;

  return (
    <View style={s.resolverShowcaseCard}>
      <View style={s.resolverHeader}>
        <View style={s.resolverEyebrow}>
          <Text style={s.resolverEyebrowText}>custom masks</Text>
        </View>

        <View>
          <Text style={s.resolverTitle}>Business identifiers in action</Text>
          <Text style={s.resolverSubtitle}>
            Custom masks are useful well beyond payment forms: plates, badges, CRM codes,
            warehouse slots, and other structured IDs all benefit from guided entry. The
            formatted value stays intact by default.
          </Text>
        </View>

        <View style={s.resolverSwitchRow}>
          {MASK_TABS.map((item) => (
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

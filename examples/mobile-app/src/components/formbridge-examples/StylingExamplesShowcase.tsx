import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import * as Haptics from 'expo-haptics';
import { FieldOverridesStylingExample } from './FieldOverridesStylingExample';
import { formExampleStyles as s } from './FormExamples.styles';
import { StyledComponentsStylingExample } from './StyledComponentsStylingExample';
import { StyleSheetStylingExample } from './StyleSheetStylingExample';

const STYLING_TABS = [
  {
    id: 'styled-components',
    label: 'Styled Components',
    note: 'Custom slots + layout',
    component: StyledComponentsStylingExample,
  },
  {
    id: 'stylesheet',
    label: 'StyleSheet',
    note: 'Global ui theme',
    component: StyleSheetStylingExample,
  },
  {
    id: 'field-overrides',
    label: 'Field overrides',
    note: 'No extra library',
    component: FieldOverridesStylingExample,
  },
] as const;

type StylingTabId = (typeof STYLING_TABS)[number]['id'];

export function StylingExamplesShowcase() {
  const [activeTab, setActiveTab] = useState<StylingTabId>('styled-components');
  const activeEntry =
    STYLING_TABS.find((item) => item.id === activeTab) ?? STYLING_TABS[0];
  const ActiveExample = activeEntry.component;

  return (
    <View style={s.resolverShowcaseCard}>
      <View style={s.resolverHeader}>
        <View style={s.resolverEyebrow}>
          <Text style={s.resolverEyebrowText}>styling demos</Text>
        </View>

        <View>
          <Text style={s.resolverTitle}>Style the same form in different ways</Text>
          <Text style={s.resolverSubtitle}>
            Switch between three styling recipes: styled-components/native, a shared
            StyleSheet theme, and plain field overrides.
          </Text>
        </View>

        <View style={s.resolverSwitchRow}>
          {STYLING_TABS.map((item) => (
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

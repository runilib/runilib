import { Pressable, Text, View } from 'react-native';

import { Tooltip } from '@runilib/react-walkit';

export function TooltipCustomContentNative() {
  return (
    <Tooltip
      id="native-accessible-helper"
      ariaLabel="Native accessible helper. Ideal for richer helper cards with multiple actions."
      ariaDescribedBy="always"
      interactive
      placement="top"
      anchorColor="#1d4ed8"
      renderContent={({ hide, visible }) => (
        <View
          style={{
            width: 280,
            borderRadius: 5,
            backgroundColor: '#1d4ed8',
            paddingHorizontal: 16,
            paddingVertical: 16,
            gap: 10,
          }}
        >
          <Text style={{ color: '#93c5fd', fontSize: 12 }}>
            {visible ? 'Tooltip open' : 'Tooltip closed'}
          </Text>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
            Custom content
          </Text>
          <Text style={{ color: '#cbd5e1' }}>
            Ideal for richer native helper cards with multiple actions.
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              onPress={hide}
              accessibilityRole="button"
              accessibilityLabel="Dismiss native helper"
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: '#1e293b',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>Dismiss</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Learn more about native helper cards"
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: '#2563eb',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>Learn more</Text>
            </Pressable>
          </View>
        </View>
      )}
    >
      {({ toggle }) => (
        <Pressable
          onPress={toggle}
          accessibilityRole="button"
          accessibilityLabel="Open accessible custom tooltip"
          style={{
            alignSelf: 'flex-start',
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 12,
            backgroundColor: '#dbeafe',
          }}
        >
          <Text style={{ color: '#1d4ed8', fontWeight: '800' }}>Open custom card</Text>
        </Pressable>
      )}
    </Tooltip>
  );
}

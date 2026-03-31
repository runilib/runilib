import { Pressable, Text, View } from 'react-native';

import { Tooltip } from '@runilib/react-walkit';

export function TooltipAnchorNative() {
  return (
    <View style={{ gap: 16, alignItems: 'flex-start' }}>
      <Tooltip
        openOnPress
        content="This example uses the anchor prop."
        anchor={
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              backgroundColor: '#dbeafe',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#1d4ed8', fontWeight: '800' }}>?</Text>
          </View>
        }
      />

      <Tooltip
        renderContent={({ hide }) => (
          <Pressable
            onPress={hide}
            style={{
              backgroundColor: '#0f172a',
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 16,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Tap to close</Text>
          </Pressable>
        )}
      >
        {({ toggle, visible }) => (
          <Pressable
            onPress={toggle}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: visible ? '#0f172a' : '#e2e8f0',
            }}
          >
            <Text style={{ color: visible ? '#fff' : '#0f172a', fontWeight: '700' }}>
              {visible ? 'Hide details' : 'Open details'}
            </Text>
          </Pressable>
        )}
      </Tooltip>
    </View>
  );
}

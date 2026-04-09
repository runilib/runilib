import { Pressable, Text, View } from 'react-native';

import { Tooltip } from '@runilib/react-walkit';

export function TooltipAnchorNative() {
  return (
    <View style={{ gap: 16, alignItems: 'flex-start' }}>
      <Tooltip
        openOnPress
        content="This example uses the anchor prop."
        anchorColor="#1d4ed8"
        tooltipStyle={{ backgroundColor: '#1d4ed8' }}
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
        anchorColor="#1d4ed8"
        renderContent={({ hide }) => (
          <Pressable
            onPress={hide}
            style={{
              backgroundColor: '#1d4ed8',
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 4,
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
              borderRadius: 4,
              backgroundColor: visible ? '#dbeafe' : '#eff6ff',
            }}
          >
            <Text style={{ color: '#1d4ed8', fontWeight: '700' }}>
              {visible ? 'Hide details' : 'Open details'}
            </Text>
          </Pressable>
        )}
      </Tooltip>
    </View>
  );
}

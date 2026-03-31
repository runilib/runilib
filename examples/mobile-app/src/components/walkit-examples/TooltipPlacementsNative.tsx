import { Pressable, type StyleProp, Text, type TextStyle, View } from 'react-native';

import { Tooltip } from '@runilib/react-walkit';

import { TooltipAnchorNative } from './TooltipAnchorNative';
import { TooltipCustomContentNative } from './TooltipCustomContentNative';

const chipStyle: StyleProp<TextStyle> = {
  minWidth: 82,
  alignItems: 'center',
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 5,
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#cbd5e1',
};

export function TooltipPlacementsNative() {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 68,
        padding: 24,
      }}
    >
      <View>
        <Tooltip
          placement="top"
          openOnPress
          content="Placement: top"
        >
          <Text style={chipStyle}>Top</Text>
        </Tooltip>
      </View>

      <View>
        <Tooltip
          placement="left"
          openOnPress
          content="Placement: left"
        >
          <View>
            <Text style={chipStyle}>Left</Text>
          </View>
        </Tooltip>
      </View>

      <View>
        <Tooltip
          placement="auto"
          content="Placement: auto"
          openOnPress
        >
          <Text style={chipStyle}>Auto</Text>
        </Tooltip>
      </View>
      <View>
        <Tooltip
          placement="right"
          openOnPress
          content="Placement: right"
        >
          <Text style={chipStyle}>Right</Text>
        </Tooltip>
      </View>

      <View>
        <Tooltip
          placement="bottom"
          openOnPress
          content="Placement: bottom"
        >
          <Text style={chipStyle}>Bottom</Text>
        </Tooltip>
      </View>

      <View>
        <Tooltip
          openOnPress
          anchorColor="#111827"
          placement="top"
          renderContent={({ toggle }) => (
            <View
              style={{
                backgroundColor: '#111827',
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', marginBottom: 8 }}>
                Custom native tooltip
              </Text>
              <Pressable onPress={toggle}>
                <Text style={{ color: '#ccfbf1' }}>Close</Text>
              </Pressable>
            </View>
          )}
        >
          <Text style={chipStyle}> With custom renderContent</Text>
        </Tooltip>
      </View>

      <View>
        <Tooltip
          content="Native custom tooltip with function trigger"
          tooltipStyle={{
            backgroundColor: '#1d4ed8',
            borderRadius: 5,
            paddingHorizontal: 16,
            paddingVertical: 12,
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {({ toggle }) => (
            <Pressable
              style={chipStyle}
              onPress={toggle}
            >
              <Text>With Function Trigger</Text>
            </Pressable>
          )}
        </Tooltip>
      </View>

      <TooltipAnchorNative />
      <TooltipCustomContentNative />
    </View>
  );
}

import { type StyleProp, Text, View, type ViewStyle } from 'react-native';

import type {
  FieldReadonlyState,
  ReadonlyFieldProps,
} from '../../hooks/shared/useFormBridgeReadonly';
import { sx } from './shared';

interface Props {
  state: FieldReadonlyState;
  showDiff: boolean;
  props?: ReadonlyFieldProps;
}

export const NativeReadonlyField = ({
  state,
  showDiff,
  props: extraProps,
}: Props): JSX.Element => {
  const { label, display, changed, originalDisplay } = state;

  return (
    <View style={sx(extraProps?.style as StyleProp<ViewStyle>)}>
      <Text>{label}</Text>

      <View>
        <Text>{display}</Text>

        {!!(showDiff && changed && originalDisplay) && <Text>{originalDisplay}</Text>}

        {showDiff && changed && <Text>edited</Text>}
      </View>
    </View>
  );
};

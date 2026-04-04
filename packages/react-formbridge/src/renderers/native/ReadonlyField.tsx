import { StyleSheet, Text, View } from 'react-native';

import type {
  FieldReadonlyState,
  ReadonlyFieldProps,
} from '../../hooks/shared/useReadonlyForm';

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
    <View style={[s.wrap, extraProps?.style]}>
      <Text style={s.label}>{label}</Text>

      <View style={s.valueRow}>
        <Text style={[s.value, showDiff && changed && s.valueChanged]}>{display}</Text>

        {!!(showDiff && changed && originalDisplay) && (
          <Text style={s.original}>{originalDisplay}</Text>
        )}

        {showDiff && changed && (
          <View style={s.badge}>
            <Text style={s.badgeText}>edited</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 },
  value: { fontSize: 15, color: '#111' },
  valueChanged: { color: '#0f172a', fontWeight: '700' },
  original: { fontSize: 13, color: '#9ca3af', textDecorationLine: 'line-through' },
  badge: {
    backgroundColor: 'rgba(234,179,8,0.12)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.25)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ca8a04',
    textTransform: 'uppercase',
  },
});

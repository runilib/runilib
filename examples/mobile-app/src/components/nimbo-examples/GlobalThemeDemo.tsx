import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { type ThemeMode, themeStore } from './themeStore';

const MODES: ThemeMode[] = ['light', 'dark', 'sepia'];

export function GlobalThemeDemo() {
  return (
    <View style={{ gap: 14 }}>
      <ThemeControls />
      <ThemePreview />
      <ThemeReadout />
    </View>
  );
}

function ThemeControls() {
  const mode = themeStore.use((state) => state.mode);
  const { setMode, bigger, smaller, reset } = themeStore.useActions();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {MODES.map((option) => {
        const active = mode === option;

        return (
          <TouchableOpacity
            key={option}
            activeOpacity={0.85}
            onPress={() => setMode(option)}
            style={[s.pill, active && s.pillActive]}
          >
            <Text style={[s.pillText, active && s.pillTextActive]}>{option}</Text>
          </TouchableOpacity>
        );
      })}
      <View style={{ flexDirection: 'row', gap: 6, marginLeft: 'auto' }}>
        <TouchableOpacity
          onPress={smaller}
          style={s.pill}
        >
          <Text style={s.pillText}>A−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={bigger}
          style={s.pill}
        >
          <Text style={s.pillText}>A+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={reset}
          style={s.pill}
        >
          <Text style={[s.pillText, { color: '#b91c1c' }]}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ThemePreview() {
  const accent = themeStore.useSelector('accent');
  const fontScale = themeStore.use((state) => state.fontScale);
  const mode = themeStore.use((state) => state.mode);

  const surface = mode === 'dark' ? '#0f172a' : mode === 'sepia' ? '#fef3c7' : '#ffffff';
  const text = mode === 'dark' ? '#f8fafc' : '#0f172a';

  return (
    <View
      style={{
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: `${accent}33`,
        backgroundColor: surface,
      }}
    >
      <Text
        style={{
          fontSize: 11 * fontScale,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: accent,
          fontWeight: '800',
        }}
      >
        Live preview
      </Text>
      <Text
        style={{
          marginTop: 6 * fontScale,
          fontSize: 20 * fontScale,
          lineHeight: 22 * fontScale,
          fontWeight: '800',
          color: text,
        }}
      >
        Same store. Read from anywhere.
      </Text>
      <Text
        style={{
          marginTop: 8 * fontScale,
          fontSize: 13 * fontScale,
          color: text,
          opacity: 0.78,
        }}
      >
        Both this preview and the readout below subscribe to the same global instance.
      </Text>
    </View>
  );
}

function ThemeReadout() {
  const label = themeStore.useSelector('label');
  const accent = themeStore.useSelector('accent');

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(15,23,42,0.04)',
      }}
    >
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          backgroundColor: accent,
        }}
      />
      <Text style={{ fontFamily: 'Menlo', fontSize: 12 }}>
        themeStore.useView('label') → {label}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.12)',
    backgroundColor: '#fff',
  },
  pillActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  pillText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 13,
  },
  pillTextActive: {
    color: '#fff',
  },
});

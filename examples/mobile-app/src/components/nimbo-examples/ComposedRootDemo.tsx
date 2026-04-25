import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { composeStores } from '@runilib/nimbo';

import { cartStore } from './cartStore';
import { themeStore } from './themeStore';
import { userStore } from './userStore';

const root = composeStores({
  user: userStore,
  theme: themeStore,
  cart: cartStore.scope('nike'),
});

export function ComposedRootDemo() {
  return (
    <View style={{ gap: 12 }}>
      <Text style={s.intro}>
        composeStores reads from userStore, themeStore and cartStore.scope("nike") through
        a single selector. The header below subscribes once and re-renders whenever any of
        the three changes.
      </Text>

      <RootHeader />
      <RootControls />
      <RootRawState />
    </View>
  );
}

function RootHeader() {
  const summary = root.use(
    (state) =>
      `${state.user.loggedIn ? state.user.name : 'Guest'} · ${state.theme.mode} · ${state.cart.items.length} item${state.cart.items.length === 1 ? '' : 's'}`,
  );
  const accent = themeStore.useView('accent');

  return (
    <View
      style={[s.header, { borderColor: `${accent}33`, backgroundColor: `${accent}0d` }]}
    >
      <View
        style={[s.dot, { backgroundColor: accent }]}
        accessibilityElementsHidden
      />
      <Text style={s.headerText}>root.use → {summary}</Text>
    </View>
  );
}

function RootControls() {
  const { setName, toggle } = userStore.useActions();
  const userName = userStore.use((state) => state.name);
  const loggedIn = userStore.use((state) => state.loggedIn);

  return (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
      <TextInput
        value={userName}
        onChangeText={setName}
        style={s.input}
      />
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={toggle}
        style={[s.toggle, loggedIn ? s.toggleActive : null]}
      >
        <Text style={[s.toggleText, loggedIn ? s.toggleTextActive : null]}>
          {loggedIn ? 'Log out' : 'Log in'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function RootRawState() {
  const snapshot = root.use();

  return (
    <View style={s.codeBlock}>
      <Text style={s.codeText}>{JSON.stringify(snapshot, null, 2)}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  intro: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 19,
  },
  header: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  headerText: {
    fontWeight: '700',
    fontSize: 13,
    color: '#0f172a',
    flexShrink: 1,
  },
  input: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.12)',
    fontSize: 13,
    color: '#0f172a',
    backgroundColor: '#fff',
  },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.12)',
    backgroundColor: '#fff',
  },
  toggleActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  toggleText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 13,
  },
  toggleTextActive: {
    color: '#fff',
  },
  codeBlock: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#0f172a',
  },
  codeText: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'Menlo',
  },
});

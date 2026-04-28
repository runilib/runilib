import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ComposedRootDemo } from '@/src/components/nimbo-examples/ComposedRootDemo';
import { EffectsDemo } from '@/src/components/nimbo-examples/EffectsDemo';
import { GlobalThemeDemo } from '@/src/components/nimbo-examples/GlobalThemeDemo';
import { LocalNotepadDemo } from '@/src/components/nimbo-examples/LocalNotepadDemo';
import { ScopedCartsDemo } from '@/src/components/nimbo-examples/ScopedCartsDemo';

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const SECTIONS = [
  {
    id: 'global',
    eyebrow: 'Global state',
    title: 'One store. Read it from anywhere.',
    description:
      'createStore() returns a singleton. Every component that calls themeStore.use() subscribes to the same instance.',
    Demo: GlobalThemeDemo,
  },
  {
    id: 'local',
    eyebrow: 'Local state',
    title: 'Same module. Per-component instance.',
    description:
      'useLocalStore() builds a fresh store for the component that calls it. Two notepads, no cross-talk.',
    Demo: LocalNotepadDemo,
  },
  {
    id: 'scoped',
    eyebrow: 'Scoped state',
    title: 'One definition. Many isolated identities.',
    description:
      'cartStore.scope("nike") and cartStore.scope("apple") share behavior but each owns its own state.',
    Demo: ScopedCartsDemo,
  },
  {
    id: 'composed',
    eyebrow: 'Composed root view',
    title: 'Many modules. One read selector.',
    description:
      'composeStores aggregates several stores into a read-only composite. One subscribe, one selector across the whole tree. Mutations still go through each module.',
    Demo: ComposedRootDemo,
  },
  {
    id: 'effects',
    eyebrow: 'Store effects',
    title: 'React to changes without a component.',
    description:
      'effects run with the store instance. watch(selector, callback) is useful for persistence, analytics, cross-store cleanup, and background work tied to state transitions.',
    Demo: EffectsDemo,
  },
] as const;

export function NimboHomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={s.safe}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <StatusBar
        style="dark"
        backgroundColor="#f4f7fc"
      />
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.hero}>
          <View style={s.topbar}>
            <TouchableOpacity
              onPress={() => router.replace('/')}
              style={s.backBtn}
            >
              <Text style={s.backText}>← Hub</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.eyebrow}>Nimbo examples</Text>
          <Text style={s.title}>Tiny typed state — global, local, scoped.</Text>
          <Text style={s.subtitle}>
            Three live demos, one mental model. Same store definition used as a global
            singleton, as a per-component instance with useLocalStore, or split into
            isolated state instances with store.scope(id). Effects add side effects that
            follow the store rather than a screen.
          </Text>
        </View>

        {SECTIONS.map(({ id, eyebrow, title, description, Demo }) => (
          <View
            key={id}
            style={s.section}
          >
            <View style={{ gap: 6 }}>
              <Text style={s.sectionEyebrow}>{eyebrow}</Text>
              <Text style={s.sectionTitle}>{title}</Text>
              <Text style={s.sectionDescription}>{description}</Text>
            </View>
            <Demo />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f7fc' },
  content: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 40, gap: 18 },
  hero: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    gap: 10,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 22,
    elevation: 3,
  },
  topbar: {
    flexDirection: 'row',
    gap: 10,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.12)',
  },
  backText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  eyebrow: {
    color: '#1d4ed8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 6,
  },
  title: {
    color: '#10203a',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subtitle: {
    color: '#5f6f88',
    fontSize: 13,
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    gap: 14,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 2,
  },
  sectionEyebrow: {
    color: '#1d4ed8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: '#10203a',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  sectionDescription: {
    color: '#5f6f88',
    fontSize: 13,
    lineHeight: 20,
  },
});

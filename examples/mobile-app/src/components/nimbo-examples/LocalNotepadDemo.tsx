import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useLocalStore } from '@runilib/nimbo';

export function LocalNotepadDemo() {
  return (
    <View style={{ gap: 12 }}>
      <Notepad seedTitle="Sprint plan" />
      <Notepad seedTitle="Lunch ideas" />
    </View>
  );
}

function Notepad({ seedTitle }: { seedTitle: string }) {
  const store = useLocalStore('demo:notepad', {
    state: () => ({ title: seedTitle, body: '' }),
    actions: ({ patch }) => ({
      setTitle(title: string) {
        patch({ title });
      },
      setBody(body: string) {
        patch({ body });
      },
      clear() {
        patch({ body: '' });
      },
    }),
    selectors: {
      wordCount: (state) =>
        state.body.trim().length === 0 ? 0 : state.body.trim().split(/\s+/).length,
    },
  });

  const title = store.use((state) => state.title);
  const body = store.use((state) => state.body);
  const wordCount = store.useSelector('wordCount');
  const { setTitle, setBody, clear } = store.useActions();

  return (
    <View style={s.card}>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={s.title}
      />
      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="Type something. The other notepad keeps its own state."
        placeholderTextColor="#94a3b8"
        multiline
        numberOfLines={4}
        style={s.body}
      />
      <View style={s.footer}>
        <Text style={s.footerText}>
          {wordCount} word{wordCount === 1 ? '' : 's'}
        </Text>
        <TouchableOpacity
          onPress={clear}
          activeOpacity={0.85}
          style={s.clearBtn}
        >
          <Text style={s.clearBtnText}>Clear body</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    backgroundColor: '#fff',
    gap: 10,
  },
  title: {
    fontWeight: '800',
    fontSize: 15,
    color: '#0f172a',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(15,23,42,0.08)',
  },
  body: {
    minHeight: 70,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    fontSize: 13,
    color: '#0f172a',
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.12)',
    backgroundColor: '#fff',
  },
  clearBtnText: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '700',
  },
});

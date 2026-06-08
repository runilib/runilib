import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { FormSchema, StorageAdapter } from '@/src/demoFormBridge';
import { field, useFormBridge } from '@/src/demoFormBridge';

type LogEntry = { op: 'get' | 'set' | 'remove'; key: string; at: string };

function createInMemoryAdapter(pushLog: (entry: LogEntry) => void): StorageAdapter {
  const store = new Map<string, string>();
  const now = () => new Date().toLocaleTimeString();

  return {
    async getItem(key) {
      pushLog({ op: 'get', key, at: now() });
      return store.get(key) ?? null;
    },
    async setItem(key, value) {
      store.set(key, value);
      pushLog({ op: 'set', key, at: now() });
    },
    async removeItem(key) {
      store.delete(key);
      pushLog({ op: 'remove', key, at: now() });
    },
  };
}

const schema = {
  fullName: field.text('Full name').required('Required'),
  email: field.email('Email').required('Required').trim().lowercase(),
  code: field.otp('EmCodeail').required('Required'),
  newsletter: field.checkbox('Subscribe to newsletter'),
} satisfies FormSchema;

export function CustomStorageAdapterExample() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const adapter = useMemo<StorageAdapter>(
    () =>
      createInMemoryAdapter((entry) => setLogs((prev) => [entry, ...prev].slice(0, 6))),
    [],
  );

  const { Form, fields } = useFormBridge(schema, {
    persist: {
      key: 'custom-adapter-native',
      storage: adapter,
      debounce: 400,
    },
  });

  return (
    <View style={s.card}>
      <Text style={s.eyebrow}>Custom StorageAdapter</Text>
      <Text style={s.title}>Drafts persisted through your own adapter</Text>
      <Text style={s.subtitle}>
        This form uses an in-memory adapter that implements the `StorageAdapter`
        interface. Every read/write is streamed to the log below. Swap it for
        AsyncStorage, SecureStore, or MMKV without touching the form code.
      </Text>

      <Form
        onSubmit={async (values) => {
          console.log('[@examples/mobile] custom storage submit', values);
        }}
      >
        <fields.fullName />
        <fields.email />
        <fields.code />
        <fields.newsletter />
        <Form.Submit>Save profile</Form.Submit>
      </Form>

      <View style={s.logCard}>
        <Text style={s.logLabel}>Adapter activity</Text>
        {logs.length === 0 ? (
          <Text style={s.logEmpty}>Type in the form to see adapter calls.</Text>
        ) : (
          logs.map((entry, idx) => (
            <View
              key={`${entry.at}-${idx.toString()}`}
              style={s.logRow}
            >
              <Text style={[s.logOp, opColor(entry.op)]}>{entry.op.toUpperCase()}</Text>
              <Text
                style={s.logKey}
                numberOfLines={1}
              >
                {entry.key}
              </Text>
              <Text style={s.logTime}>{entry.at}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

function opColor(op: LogEntry['op']) {
  if (op === 'set') return { color: '#34d399' };
  if (op === 'remove') return { color: '#f87171' };
  return { color: '#60a5fa' };
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    gap: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 22,
    elevation: 3,
  },
  eyebrow: {
    color: '#2563eb',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#10203a',
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#5f6f88',
    fontSize: 13,
    lineHeight: 20,
  },
  logCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    gap: 8,
    marginTop: 6,
  },
  logLabel: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  logEmpty: {
    color: '#94a3b8',
    fontSize: 12,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logOp: {
    fontSize: 11,
    fontWeight: '800',
    width: 60,
    fontFamily: 'Courier',
  },
  logKey: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 11,
    fontFamily: 'Courier',
  },
  logTime: {
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: 'Courier',
  },
});

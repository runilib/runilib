import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';

import type { FormSchema, StorageAdapter } from '@runilib/react-formbridge';
import { field, useFormBridge } from '@runilib/react-formbridge';

type LogEntry = { id: number; op: 'get' | 'set' | 'remove'; key: string; at: string };

let logCounter = 0;

function createLoggingSessionAdapter(pushLog: (entry: LogEntry) => void): StorageAdapter {
  const encode = (raw: string) =>
    globalThis.btoa(
      Array.from(new TextEncoder().encode(raw), (b) => String.fromCodePoint(b)).join(''),
    );
  const decode = (raw: string) =>
    new TextDecoder().decode(
      Uint8Array.from(globalThis.atob(raw), (c) => c.codePointAt(0) ?? 0),
    );
  const log = (op: LogEntry['op'], key: string) => {
    logCounter += 1;
    pushLog({ id: logCounter, op, key, at: new Date().toLocaleTimeString() });
  };

  return {
    async getItem(key) {
      const raw = globalThis.sessionStorage.getItem(key);
      log('get', key);
      return raw ? decode(raw) : null;
    },
    async setItem(key, value) {
      globalThis.sessionStorage.setItem(key, encode(value));
      log('set', key);
    },
    async removeItem(key) {
      globalThis.sessionStorage.removeItem(key);
      log('remove', key);
    },
  };
}

const schema = {
  fullName: field.text('Full name').required(),
  email: field.email('Email').required().trim().lowercase(),
  newsletter: field.checkbox('Subscribe to newsletter'),
} satisfies FormSchema;

export function CustomStorageAdapterExample() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const adapter = useMemo<StorageAdapter>(
    () =>
      createLoggingSessionAdapter((entry) =>
        setLogs((prev) => [entry, ...prev].slice(0, 8)),
      ),
    [],
  );

  const { Form, fields } = useFormBridge(schema, {
    persist: {
      key: 'custom-adapter-web',
      storage: adapter,
      debounce: 400,
    },
  });

  return (
    <section style={cardStyle}>
      <header style={headerStyle}>
        <span style={eyebrowStyle}>Custom StorageAdapter</span>
        <h2 style={titleStyle}>Drafts persisted through a custom adapter</h2>
        <p style={subtitleStyle}>
          Values are base64-encoded, written to <code>sessionStorage</code>, and every
          read/write is streamed to the log on the right. Refresh this tab — the form is
          restored from the adapter.
        </p>
      </header>

      <div style={layoutStyle}>
        <Form
          style={formStyle}
          onSubmit={async (values) => {
            globalThis.alert?.(`Submitted ${values.email}. Draft will be cleared.`);
          }}
        >
          <fields.fullName />
          <fields.email />
          <fields.newsletter />
          <Form.Submit>Save profile</Form.Submit>
        </Form>

        <aside style={logCardStyle}>
          <p style={logLabelStyle}>Adapter activity</p>
          {logs.length === 0 ? (
            <p style={logEmptyStyle}>Type in the form to see adapter calls here.</p>
          ) : (
            <ul style={logListStyle}>
              {logs.map((entry) => (
                <li
                  key={entry.id}
                  style={logItemStyle}
                >
                  <span style={logOpStyle(entry.op)}>{entry.op.toUpperCase()}</span>
                  <span style={logKeyStyle}>{entry.key}</span>
                  <span style={logTimeStyle}>{entry.at}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </section>
  );
}

const cardStyle: CSSProperties = {
  background: '#ffffff',
  borderRadius: 24,
  padding: 24,
  border: '1px solid rgba(15,23,42,0.08)',
  boxShadow: '0 20px 50px rgba(15,23,42,0.06)',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginBottom: 18,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#2563eb',
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.15,
  color: '#0f172a',
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  color: '#475569',
  fontSize: 14,
  lineHeight: 1.6,
};

const layoutStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.2fr) minmax(240px, 0.8fr)',
  gap: 22,
};

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

const logCardStyle: CSSProperties = {
  background: '#0f172a',
  color: '#e2e8f0',
  borderRadius: 18,
  padding: 18,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const logLabelStyle: CSSProperties = {
  margin: 0,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#f59e0b',
};

const logEmptyStyle: CSSProperties = {
  margin: 0,
  color: '#94a3b8',
  fontSize: 13,
};

const logListStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const logItemStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '60px minmax(0, 1fr) auto',
  gap: 8,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 12,
};

const logOpStyle = (op: LogEntry['op']): CSSProperties => ({
  fontWeight: 800,
  color: op === 'set' ? '#34d399' : op === 'remove' ? '#f87171' : '#60a5fa',
});

const logKeyStyle: CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const logTimeStyle: CSSProperties = {
  color: '#94a3b8',
};

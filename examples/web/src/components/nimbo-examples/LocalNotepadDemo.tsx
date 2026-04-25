import { useLocalStore } from '@runilib/nimbo';

export function LocalNotepadDemo() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <Notepad seedTitle="Sprint plan" />
      <Notepad seedTitle="Lunch ideas" />
    </div>
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
    views: {
      wordCount: (state) =>
        state.body.trim().length === 0 ? 0 : state.body.trim().split(/\s+/).length,
    },
  });

  const title = store.use((state) => state.title);
  const body = store.use((state) => state.body);
  const wordCount = store.useView('wordCount');
  const { setTitle, setBody, clear } = store.useActions();

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 16,
        border: '1px solid rgba(15,23,42,0.08)',
        background: '#fff',
        display: 'grid',
        gap: 10,
      }}
    >
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        style={{
          fontWeight: 800,
          fontSize: 16,
          border: 'none',
          outline: 'none',
          padding: '4px 0',
          borderBottom: '1px solid rgba(15,23,42,0.08)',
          background: 'transparent',
        }}
      />
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Type something. The other notepad keeps its own state."
        rows={4}
        style={{
          resize: 'vertical',
          padding: 10,
          borderRadius: 10,
          border: '1px solid rgba(15,23,42,0.08)',
          fontFamily: 'inherit',
          fontSize: 13,
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
          {wordCount} word{wordCount === 1 ? '' : 's'}
        </span>
        <button
          type="button"
          onClick={clear}
          style={{
            padding: '6px 10px',
            borderRadius: 999,
            border: '1px solid rgba(15,23,42,0.12)',
            background: '#fff',
            color: '#b91c1c',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Clear body
        </button>
      </div>
    </div>
  );
}

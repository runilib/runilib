import { createStore } from '@runilib/nimbo';

type User = {
  id: string;
  name: string;
};

type AuditEvent = {
  id: number;
  label: string;
};

const USERS: User[] = [
  { id: 'alice', name: 'Alice' },
  { id: 'miles', name: 'Miles' },
];

let eventId = 0;

const createEvent = (label: string): AuditEvent => {
  eventId += 1;

  return { id: eventId, label };
};

const draftStore = createStore('demo:effects:draft', {
  state: () => ({
    body: 'Private support note: customer asked for a refund follow-up.',
  }),
  actions: ({ patch }) => ({
    setBody(body: string) {
      patch({ body });
    },
    clear() {
      patch({ body: '' });
    },
  }),
});

const sessionStore = createStore('demo:effects:session', {
  state: () => ({
    user: USERS[0] as User | null,
    autosaveText: 'Autosave me, but only after typing pauses.',
    activityCount: 0,
    audit: [createEvent('effects started outside React for sosthene')] as AuditEvent[],
  }),
  actions: ({ patch }) => ({
    bumpActivity() {
      patch((state) => ({ activityCount: state.activityCount + 1 }));
    },
    login(user: User) {
      patch({ user });
    },
    logout() {
      patch({ user: null });
    },
    setAutosaveText(autosaveText: string) {
      patch({ autosaveText });
    },
    record(label: string) {
      patch((state) => ({
        audit: [createEvent(label), ...state.audit].slice(0, 8),
      }));
    },
  }),
  effects: ({ watch, patch }) => ({
    identifyUser() {
      return watch(
        (state) => state.user?.id ?? null,
        (userId, previousUserId) => {
          patch((state) => ({
            audit: [
              createEvent(
                `analytics.identify(${userId ?? 'anonymous'}) after ${
                  previousUserId ?? 'anonymous'
                }`,
              ),
              ...state.audit,
            ].slice(0, 8),
          }));
        },
        { immediate: true },
      );
    },
    clearDraftOnLogout() {
      return watch(
        (state) => state.user === null,
        (loggedOut) => {
          if (loggedOut) {
            draftStore.actions.clear();
          }
        },
      );
    },
    sendWelcomeOnce() {
      return watch(
        (state) => state.user?.id ?? null,
        (userId) => {
          if (!userId) {
            return;
          }

          patch((state) => ({
            audit: [
              createEvent(`once: welcome event for ${userId}`),
              ...state.audit,
            ].slice(0, 8),
          }));
        },
        { once: true },
      );
    },
    persistDraftDebounced() {
      return watch(
        (state) => state.autosaveText,
        (text) => {
          patch((state) => ({
            audit: [
              createEvent(`debounce: persisted ${text.length} draft chars`),
              ...state.audit,
            ].slice(0, 8),
          }));
        },
        { debounce: 500 },
      );
    },
    syncActivityThrottled() {
      return watch(
        (state) => state.activityCount,
        (count) => {
          patch((state) => ({
            audit: [
              createEvent(`throttle: synced activity #${count}`),
              ...state.audit,
            ].slice(0, 8),
          }));
        },
        { throttle: 1000 },
      );
    },
    reportRiskyAnonymousSync() {
      return watch(
        (state) => state.user === null,
        (loggedOut) => {
          if (loggedOut) {
            throw new Error('anonymous analytics endpoint rejected the payload');
          }
        },
        {
          onError(error) {
            patch((state) => ({
              audit: [
                createEvent(`onError: ${(error as Error).message}`),
                ...state.audit,
              ].slice(0, 8),
            }));
          },
        },
      );
    },
  }),
});

export function EffectsDemo() {
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <p style={{ margin: 0, color: '#475569', fontSize: 13 }}>
        The session store watches state globally. It identifies users, clears another
        store on logout, sends a one-time welcome event, debounces draft persistence,
        throttles frequent activity sync, and reports effect errors — no component-level{' '}
        <code>useEffect</code> required.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)',
          gap: 14,
        }}
      >
        <SessionPanel />
        <AuditPanel />
      </div>
    </div>
  );
}

function SessionPanel() {
  const user = sessionStore.use((state) => state.user);
  const autosaveText = sessionStore.use((state) => state.autosaveText);
  const draft = draftStore.use((state) => state.body);
  const { bumpActivity, login, logout, setAutosaveText } = sessionStore.useActions();
  const { setBody } = draftStore.useActions();

  return (
    <div
      style={{
        display: 'grid',
        gap: 12,
        padding: 16,
        borderRadius: 16,
        border: '1px solid rgba(15,23,42,0.1)',
        background: '#fff',
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#1d4ed8',
            textTransform: 'uppercase',
          }}
        >
          Current session
        </p>
        <h4 style={{ margin: '4px 0 0', fontSize: 18 }}>
          {user ? user.name : 'Signed out'}
        </h4>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {USERS.map((nextUser) => (
          <button
            key={nextUser.id}
            type="button"
            onClick={() => login(nextUser)}
            style={buttonStyle(user?.id === nextUser.id)}
          >
            Login {nextUser.name}
          </button>
        ))}
        <button
          type="button"
          onClick={logout}
          style={{ ...buttonStyle(false), color: '#b91c1c' }}
        >
          Logout
        </button>
      </div>

      <label style={{ display: 'grid', gap: 6, color: '#475569', fontSize: 12 }}>
        Support draft
        <textarea
          value={draft}
          onChange={(event) => setBody(event.target.value)}
          rows={4}
          style={{
            resize: 'vertical',
            padding: 10,
            borderRadius: 12,
            border: '1px solid rgba(15,23,42,0.12)',
            font: 'inherit',
            color: '#0f172a',
          }}
        />
      </label>

      <label style={{ display: 'grid', gap: 6, color: '#475569', fontSize: 12 }}>
        Debounced autosave field
        <input
          value={autosaveText}
          onChange={(event) => setAutosaveText(event.target.value)}
          style={{
            padding: 10,
            borderRadius: 12,
            border: '1px solid rgba(15,23,42,0.12)',
            font: 'inherit',
            color: '#0f172a',
          }}
        />
      </label>

      <button
        type="button"
        onClick={bumpActivity}
        style={buttonStyle(false)}
      >
        Fire frequent activity
      </button>
    </div>
  );
}

function AuditPanel() {
  const audit = sessionStore.use((state) => state.audit);
  const { record } = sessionStore.useActions();

  return (
    <div
      style={{
        display: 'grid',
        gap: 12,
        padding: 16,
        borderRadius: 16,
        border: '1px solid rgba(15,23,42,0.1)',
        background: '#f8fafc',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#0f172a',
              textTransform: 'uppercase',
            }}
          >
            Effect output
          </p>
          <h4 style={{ margin: '4px 0 0', fontSize: 18 }}>Audit trail</h4>
        </div>
        <button
          type="button"
          onClick={() => record('manual event from UI')}
          style={buttonStyle(false)}
        >
          Add UI event
        </button>
      </div>

      <ol
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'grid',
          gap: 8,
          fontSize: 13,
          color: '#334155',
        }}
      >
        {audit.map((event) => (
          <li
            key={event.id}
            style={{
              padding: '8px 10px',
              borderRadius: 10,
              background: '#fff',
              border: '1px solid rgba(15,23,42,0.06)',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}
          >
            {event.label}
          </li>
        ))}
      </ol>
    </div>
  );
}

const buttonStyle = (active: boolean) =>
  ({
    padding: '8px 12px',
    borderRadius: 999,
    border: '1px solid rgba(15,23,42,0.12)',
    background: active ? '#0f172a' : '#fff',
    color: active ? '#fff' : '#0f172a',
    fontWeight: 700,
    fontSize: 12,
    cursor: 'pointer',
  }) as const;

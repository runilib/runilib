import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

const draftStore = createStore('demo:effects:draft:native', {
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

const sessionStore = createStore('demo:effects:session:native', {
  state: () => ({
    user: USERS[0] as User | null,
    autosaveText: 'Autosave me, but only after typing pauses.',
    activityCount: 0,
    audit: [createEvent('effects started outside React')] as AuditEvent[],
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
  const user = sessionStore.use((state) => state.user);
  const audit = sessionStore.use((state) => state.audit);
  const autosaveText = sessionStore.use((state) => state.autosaveText);
  const draft = draftStore.use((state) => state.body);
  const { bumpActivity, login, logout, record, setAutosaveText } =
    sessionStore.useActions();
  const { setBody } = draftStore.useActions();

  return (
    <View style={{ gap: 14 }}>
      <Text style={s.intro}>
        The session store watches user.id globally. It records analytics and clears a
        separate draft store on logout. It also demonstrates once, debounce, throttle, and
        onError without any component-level useEffect.
      </Text>

      <View style={s.card}>
        <Text style={s.eyebrow}>Current session</Text>
        <Text style={s.title}>{user ? user.name : 'Signed out'}</Text>

        <View style={s.controls}>
          {USERS.map((nextUser) => {
            const active = user?.id === nextUser.id;

            return (
              <TouchableOpacity
                key={nextUser.id}
                activeOpacity={0.85}
                onPress={() => login(nextUser)}
                style={[s.pill, active && s.pillActive]}
              >
                <Text style={[s.pillText, active && s.pillTextActive]}>
                  Login {nextUser.name}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={logout}
            style={s.pill}
          >
            <Text style={[s.pillText, { color: '#b91c1c' }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.label}>Support draft</Text>
        <TextInput
          value={draft}
          onChangeText={setBody}
          multiline
          style={s.input}
        />

        <Text style={s.label}>Debounced autosave field</Text>
        <TextInput
          value={autosaveText}
          onChangeText={setAutosaveText}
          style={[s.input, { minHeight: 44 }]}
        />

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={bumpActivity}
          style={s.pill}
        >
          <Text style={s.pillText}>Fire frequent activity</Text>
        </TouchableOpacity>
      </View>

      <View style={s.auditCard}>
        <View style={s.auditHeader}>
          <View>
            <Text style={[s.eyebrow, { color: '#0f172a' }]}>Effect output</Text>
            <Text style={s.title}>Audit trail</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => record('manual event from UI')}
            style={s.pill}
          >
            <Text style={s.pillText}>Add event</Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 8 }}>
          {audit.map((event) => (
            <View
              key={event.id}
              style={s.auditRow}
            >
              <Text style={s.auditText}>{event.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  intro: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 19,
  },
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.1)',
    backgroundColor: '#fff',
    gap: 10,
  },
  auditCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.1)',
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  auditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  eyebrow: {
    color: '#1d4ed8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 7,
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
    fontSize: 12,
  },
  pillTextActive: {
    color: '#fff',
  },
  label: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    minHeight: 84,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.12)',
    color: '#0f172a',
    textAlignVertical: 'top',
  },
  auditRow: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
  },
  auditText: {
    color: '#334155',
    fontSize: 12,
    fontFamily: 'Menlo',
  },
});

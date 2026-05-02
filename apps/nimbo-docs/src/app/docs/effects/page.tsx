import { CodeBlock } from '@/components/CodeBlock';
import { Pager } from '@/components/Pager';

export const metadata = { title: 'Effects' };

const HREF = '/docs/effects';

export default function EffectsPage() {
  return (
    <div className="content">
      <h1>Effects</h1>
      <p>
        Effects let a store react to lifecycle and selected state changes without mounting a React
        component or scattering manual subscriptions across an app.
      </p>

      <CodeBlock>{`const sessionStore = createStore('session', {
  state: () => ({ user: null as { id: string } | null }),
  actions: ({ patch }) => ({
    setUser(user: { id: string } | null) {
      patch({ user });
    },
  }),
  effects: ({ watch }) => ({
    syncUser() {
      return watch(
        (state) => state.user?.id,
        (userId) => {
          analytics.identify(userId ?? null);
        },
      );
    },
  }),
});`}</CodeBlock>

      <p>
        Effects start automatically when a store instance is created — global, scoped, or local.{' '}
        <code>watch(selector, callback)</code> only fires when the selected value changes by{' '}
        <code>Object.is</code>.
      </p>

      <h2>Watch options</h2>
      <ul>
        <li>
          <code>{'{ immediate: true }'}</code> — run once at startup
        </li>
        <li>
          <code>{'{ once: true }'}</code> — stop after the first callback
        </li>
        <li>
          <code>{'{ debounce: 300 }'}</code> — wait for changes to settle
        </li>
        <li>
          <code>{'{ throttle: 100 }'}</code> — cap callback frequency
        </li>
        <li>
          <code>{'{ equality }'}</code> — custom comparison function
        </li>
        <li>
          <code>{'{ onError(error) }'}</code> — handle errors thrown from callbacks or cleanup
        </li>
      </ul>

      <CodeBlock>{`effects: ({ watch }) => ({
  persistDraft() {
    return watch(
      (state) => state.draft,
      (draft) => storage.setItem('draft', draft),
      { debounce: 500 },
    );
  },
  syncPresence() {
    return watch(
      (state) => state.cursor,
      (cursor) => presence.send(cursor),
      { throttle: 100 },
    );
  },
});`}</CodeBlock>

      <h2>Cleanup</h2>
      <p>
        Effects and watcher callbacks may return cleanup functions. Call{' '}
        <code>store.stopEffects()</code> to tear down an instance's effects, and{' '}
        <code>store.startEffects()</code> to restart them.
      </p>

      <Pager href={HREF} />
    </div>
  );
}

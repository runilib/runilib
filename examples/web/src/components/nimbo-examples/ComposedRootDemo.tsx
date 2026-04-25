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
    <div style={{ display: 'grid', gap: 14 }}>
      <p style={{ margin: 0, color: '#475569', fontSize: 13 }}>
        <code>composeStores</code> reads from <code>userStore</code>,{' '}
        <code>themeStore</code> and <code>cartStore.scope("nike")</code> through a single
        selector. The header below subscribes once and re-renders whenever <em>any</em> of
        the three changes — flip the user, swap the theme, or add an item to the Nike cart
        in the scoped demo above and watch this update.
      </p>

      <RootHeader />
      <RootControls />
      <RootRawState />
    </div>
  );
}

function RootHeader() {
  const summary = root.use(
    (state) =>
      `${state.user.loggedIn ? state.user.name : 'Guest'} · ${state.theme.mode} · ${state.cart.items.length} item${state.cart.items.length === 1 ? '' : 's'}`,
  );

  const accent = themeStore.useView('accent');

  return (
    <div
      style={{
        padding: 14,
        borderRadius: 14,
        border: `1px solid ${accent}33`,
        background: `${accent}0d`,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontWeight: 700,
        fontSize: 14,
      }}
    >
      <span
        aria-hidden
        style={{ width: 10, height: 10, borderRadius: 999, background: accent }}
      />
      <span>root.use → {summary}</span>
    </div>
  );
}

function RootControls() {
  const { setName, toggle } = userStore.useActions();
  const userName = userStore.use((state) => state.name);
  const loggedIn = userStore.use((state) => state.loggedIn);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <input
        value={userName}
        onChange={(event) => setName(event.target.value)}
        style={{
          padding: '8px 10px',
          borderRadius: 10,
          border: '1px solid rgba(15,23,42,0.12)',
          fontSize: 13,
        }}
      />
      <button
        type="button"
        onClick={toggle}
        style={{
          padding: '8px 12px',
          borderRadius: 999,
          border: '1px solid rgba(15,23,42,0.12)',
          background: loggedIn ? '#0f172a' : '#fff',
          color: loggedIn ? '#fff' : '#0f172a',
          fontWeight: 700,
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        {loggedIn ? 'Log out' : 'Log in'}
      </button>
    </div>
  );
}

function RootRawState() {
  const snapshot = root.use();

  return (
    <pre
      style={{
        margin: 0,
        padding: 12,
        borderRadius: 12,
        background: '#0f172a',
        color: '#cbd5e1',
        fontSize: 12,
        lineHeight: 1.5,
        overflowX: 'auto',
      }}
    >
      <code>{JSON.stringify(snapshot, null, 2)}</code>
    </pre>
  );
}

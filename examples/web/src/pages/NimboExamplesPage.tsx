import { Link } from 'react-router-dom';
import { ComposedRootDemo } from '../components/nimbo-examples/ComposedRootDemo';
import { GlobalThemeDemo } from '../components/nimbo-examples/GlobalThemeDemo';
import { LocalNotepadDemo } from '../components/nimbo-examples/LocalNotepadDemo';
import { ScopedCartsDemo } from '../components/nimbo-examples/ScopedCartsDemo';

const SECTIONS = [
  {
    id: 'global',
    eyebrow: 'Global state',
    title: 'One store. Read it from anywhere.',
    description:
      'createStore() returns a singleton. Every component that calls themeStore.use() subscribes to the same instance.',
    snippet: `import { createStore } from '@runilib/nimbo';

export const themeStore = createStore('theme', {
  state: () => ({ mode: 'light', fontScale: 1 }),
  actions: ({ patch }) => ({
    setMode(mode) { patch({ mode }); },
  }),
  views: { accent: (s) => ACCENTS[s.mode] },
});`,
    Demo: GlobalThemeDemo,
  },
  {
    id: 'local',
    eyebrow: 'Local state',
    title: 'Same module. Per-component instance.',
    description:
      'useLocalStore() builds a fresh store for the component that calls it. Two notepads side by side, no cross-talk.',
    snippet: `import { useLocalStore } from '@runilib/nimbo';

function Notepad({ seedTitle }) {
  const store = useLocalStore('notepad', {
    state: () => ({ title: seedTitle, body: '' }),
    actions: ({ patch }) => ({
      setBody(body) { patch({ body }); },
    }),
  });

  const body = store.use((s) => s.body);
}`,
    Demo: LocalNotepadDemo,
  },
  {
    id: 'scoped',
    eyebrow: 'Scoped state',
    title: 'One definition. Many isolated identities.',
    description:
      'cartStore.scope("nike") and cartStore.scope("apple") share behavior but each owns its own state. The scope id is the identity of the context (shopId, projectId, conversationId, …).',
    snippet: `const nikeCart = cartStore.scope('nike');
const appleCart = cartStore.scope('apple');

nikeCart.actions.add({
  id: 'air-max',
  name: 'Air Max',
  price: 180,
  category: 'shoes',
});

appleCart.actions.add({
  id: 'iphone',
  name: 'iPhone 16',
  price: 999,
  category: 'devices',
});

// Parameterized view
const shoesTotal = nikeCart.view('totalByCategory', 'shoes');

// Memoized computed view
const discountedTotal = nikeCart.view('discountedTotal', 0.1);

// Different state instances, same definition.`,
    Demo: ScopedCartsDemo,
  },
  {
    id: 'composed',
    eyebrow: 'Composed root view',
    title: 'Many modules. One read selector.',
    description:
      'composeStores aggregates several stores into a read-only composite. One subscribe, one selector across the whole tree — useful for headers, layout summaries, or any component that needs to read from several modules at once. Mutations still go through each module.',
    snippet: `import { composeStores } from '@runilib/nimbo';

const root = composeStores({
  user: userStore,
  theme: themeStore,
  cart: cartStore.scope('nike'),
});

function Header() {
  const summary = root.use(
    (state) => \`\${state.user.name} · \${state.cart.items.length} items\`,
  );
  return <span>{summary}</span>;
}`,
    Demo: ComposedRootDemo,
  },
] as const;

export function NimboExamplesPage() {
  return (
    <main className="library-shell">
      <section className="library-page-hero fade-up">
        <div className="library-page-topbar">
          <Link
            to="/"
            className="btn btn-ghost"
          >
            ← Library hub
          </Link>
          <Link
            to="/formbridge"
            className="btn btn-ghost"
          >
            Explore formbridge
          </Link>
          <Link
            to="/walkit"
            className="btn btn-ghost"
          >
            Explore walkit
          </Link>
        </div>

        <span className="library-eyebrow">Nimbo examples</span>
        <h1>Tiny typed state modules — global, local, scoped.</h1>
        <p>
          Three live demos, one mental model. The same store definition can be used as a
          global singleton, instantiated locally per component with{' '}
          <code>useLocalStore</code>, or split into isolated state instances with{' '}
          <code>store.scope(id)</code>.
        </p>
      </section>

      <section className="library-form-layout">
        {SECTIONS.map(({ id, eyebrow, title, description, snippet, Demo }) => (
          <article
            key={id}
            className="library-section-card fade-up"
          >
            <header className="library-section-header">
              <span className="library-highlight-label">{eyebrow}</span>
              <h2>{title}</h2>
              <p>{description}</p>
            </header>

            <pre
              style={{
                margin: 0,
                padding: 16,
                borderRadius: 16,
                background: '#0f172a',
                color: '#e2e8f0',
                fontSize: 12.5,
                lineHeight: 1.55,
                overflowX: 'auto',
              }}
            >
              <code>{snippet}</code>
            </pre>

            <Demo />
          </article>
        ))}
      </section>
    </main>
  );
}

import { CodeBlock } from '@/components/CodeBlock';
import { Pager } from '@/components/Pager';

export const metadata = { title: 'createStore' };

const HREF = '/docs/create-store';

export default function CreateStorePage() {
  return (
    <div className="content">
      <h1>createStore</h1>
      <p>
        <code>createStore(name, definition)</code> is the entry point for every Nimbo store. The
        first argument names the store for debugging and devtools, the second describes its shape.
      </p>

      <h2>Signature</h2>
      <CodeBlock>{`createStore<TState, TActions, TSelectors, TAsync, TEffects>(
  name: string,
  definition: {
    state: () => TState;
    actions?: ({ patch, set, get }) => TActions;
    selectors?: TSelectors;
    asyncActions?: ({ patch, set, get, signal }) => TAsync;
    effects?: ({ watch, get }) => TEffects;
  },
): Store`}</CodeBlock>

      <h2>What you get back</h2>
      <p>The returned store exposes:</p>
      <ul>
        <li>
          <code>store.getState()</code> / <code>store.setState()</code>
        </li>
        <li>
          <code>store.actions</code> — your bound action functions
        </li>
        <li>
          <code>store.select(name, ...args)</code> — call a selector imperatively
        </li>
        <li>
          <code>store.subscribe(listener)</code> — low-level change subscription
        </li>
        <li>
          <code>store.use()</code>, <code>store.useActions()</code>,{' '}
          <code>store.useSelector()</code> — React hooks
        </li>
        <li>
          <code>store.scope(id)</code> — isolated instance
        </li>
        <li>
          <code>store.Provider</code> + <code>useLocalStore</code> — local instance
        </li>
        <li>
          <code>store.startEffects()</code> / <code>store.stopEffects()</code>
        </li>
      </ul>

      <Pager href={HREF} />
    </div>
  );
}

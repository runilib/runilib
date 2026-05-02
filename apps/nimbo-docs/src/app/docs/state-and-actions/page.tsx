import { CodeBlock } from '@/components/CodeBlock';
import { Pager } from '@/components/Pager';

export const metadata = { title: 'State & actions' };

const HREF = '/docs/state-and-actions';

export default function StateAndActionsPage() {
  return (
    <div className="content">
      <h1>State & actions</h1>
      <p>
        State is described by a factory that returns the initial value. Actions are the only public
        way to mutate state — they receive a helpers object with <code>patch</code>,{' '}
        <code>set</code> and <code>get</code>.
      </p>

      <h2>State factory</h2>
      <p>
        Returning state from a function (instead of a literal) ensures fresh instances when a store
        is scoped or instantiated locally.
      </p>
      <CodeBlock>{`createStore('user', {
  state: () => ({ name: '', email: '' }),
});`}</CodeBlock>

      <h2>Patch vs set</h2>
      <ul>
        <li>
          <code>patch(partial)</code> — shallow merge into the current state. Accepts an object or a
          function that returns one.
        </li>
        <li>
          <code>set(next)</code> — replace the entire state.
        </li>
        <li>
          <code>get()</code> — read the latest state inside an action.
        </li>
      </ul>

      <CodeBlock>{`createStore('user', {
  state: () => ({ name: '', email: '' }),
  actions: ({ patch, set, get }) => ({
    rename(name: string) {
      patch({ name });
    },
    reset() {
      set({ name: '', email: '' });
    },
    debug() {
      console.log(get());
    },
  }),
});`}</CodeBlock>

      <h2>React hooks</h2>
      <CodeBlock>{`const name = userStore.use((state) => state.name);
const { rename, reset } = userStore.useActions();`}</CodeBlock>

      <Pager href={HREF} />
    </div>
  );
}

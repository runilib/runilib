import { CodeBlock } from '@/components/CodeBlock';
import { Pager } from '@/components/Pager';

export const metadata = { title: 'Quickstart' };

const HREF = '/docs/quickstart';

export default function QuickstartPage() {
  return (
    <div className="content">
      <h1>Quickstart</h1>
      <p>Build your first Nimbo store in under a minute.</p>

      <h2>1. Define a store</h2>
      <CodeBlock filename="counter.ts">{`import { createStore } from '@runilib/nimbo';

export const counter = createStore('counter', {
  state: () => ({ count: 0 }),
  actions: ({ patch }) => ({
    increment() {
      patch((state) => ({ count: state.count + 1 }));
    },
    decrement() {
      patch((state) => ({ count: state.count - 1 }));
    },
  }),
  selectors: {
    isEmpty: (state) => state.count === 0,
  },
});`}</CodeBlock>

      <h2>2. Use it in a component</h2>
      <CodeBlock filename="Counter.tsx">{`import { counter } from './counter';

export function Counter() {
  const count = counter.use((state) => state.count);
  const isEmpty = counter.useSelector('isEmpty');
  const { increment, decrement } = counter.useActions();

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      {isEmpty ? <small>Empty</small> : null}
    </div>
  );
}`}</CodeBlock>

      <h2>3. Read or update from anywhere</h2>
      <p>
        Stores are not tied to React. You can call them from any module — a helper, a fetcher, a
        worker — and React components will re-render accordingly.
      </p>
      <CodeBlock>{`import { counter } from './counter';

counter.actions.increment();
console.log(counter.getState().count); // 1`}</CodeBlock>

      <Pager href={HREF} />
    </div>
  );
}

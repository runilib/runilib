import { CodeBlock } from '@/components/CodeBlock';
import { Pager } from '@/components/Pager';

export const metadata = { title: 'Local stores' };

const HREF = '/docs/local-stores';

export default function LocalStoresPage() {
  return (
    <div className="content">
      <h1>Local stores</h1>
      <p>
        For component-tree-scoped state, wrap a subtree in <code>store.Provider</code> and read it
        with <code>useLocalStore</code>. The same definition powers both global and local usage.
      </p>

      <CodeBlock>{`import { useLocalStore } from '@runilib/nimbo';
import { counter } from './counter';

function Page() {
  return (
    <counter.Provider>
      <Counter />
    </counter.Provider>
  );
}

function Counter() {
  const local = useLocalStore(counter);
  const count = local.use((state) => state.count);
  const { increment } = local.useActions();

  return <button onClick={increment}>{count}</button>;
}`}</CodeBlock>

      <p>
        Each <code>Provider</code> creates a fresh state instance. Effects run inside the provider
        lifetime and are torn down when it unmounts.
      </p>

      <Pager href={HREF} />
    </div>
  );
}

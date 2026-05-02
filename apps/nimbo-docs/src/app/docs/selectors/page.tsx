import { CodeBlock } from '@/components/CodeBlock';
import { Pager } from '@/components/Pager';

export const metadata = { title: 'Selectors' };

const HREF = '/docs/selectors';

export default function SelectorsPage() {
  return (
    <div className="content">
      <h1>Selectors</h1>
      <p>
        Selectors are derived reads of your state. They are pure functions and can take arbitrary
        arguments alongside the state.
      </p>

      <h2>Basic selectors</h2>
      <CodeBlock>{`const cart = createStore('cart', {
  state: () => ({ items: [] as Array<{ price: number }> }),
  selectors: {
    total: (state) => state.items.reduce((sum, i) => sum + i.price, 0),
  },
});

const total = cart.select('total');
const totalInComponent = cart.useSelector('total');`}</CodeBlock>

      <h2>Parameterized selectors</h2>
      <p>Selectors can accept extra arguments after the state.</p>
      <CodeBlock>{`selectors: {
  totalWithTax: (state, taxRate: number) =>
    state.items.reduce((sum, i) => sum + i.price, 0) * (1 + taxRate),
  itemsByCategory: (state, category: string) =>
    state.items.filter((i) => i.category === category),
}

cart.select('totalWithTax', 0.2);
cart.useSelector('itemsByCategory', 'hardware');`}</CodeBlock>

      <h2>Computed selectors</h2>
      <p>
        Use <code>computed()</code> when a derived read is expensive and should be memoized by state
        reference and selector arguments.
      </p>
      <CodeBlock>{`import { createStore, computed } from '@runilib/nimbo';

const cart = createStore('cart', {
  state: () => ({ items: [] }),
  selectors: {
    totalByCategory: computed(
      (state, category: string) =>
        state.items
          .filter((i) => i.category === category)
          .reduce((sum, i) => sum + i.price, 0),
      { key: (category) => category },
    ),
  },
});`}</CodeBlock>

      <Pager href={HREF} />
    </div>
  );
}

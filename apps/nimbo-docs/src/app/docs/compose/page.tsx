import { CodeBlock } from '@/components/CodeBlock';
import { Pager } from '@/components/Pager';

export const metadata = { title: 'composeStores' };

const HREF = '/docs/compose';

export default function ComposePage() {
  return (
    <div className="content">
      <h1>composeStores</h1>
      <p>
        <code>composeStores</code> aggregates several stores into a read-only composite. Useful when
        you want a Redux- or MobX-style root view without giving up the per-module mental model.
      </p>

      <CodeBlock>{`import { composeStores } from '@runilib/nimbo';
import { userStore } from './user';
import { cartStore } from './cart';

export const root = composeStores({
  user: userStore,
  cart: cartStore,
});`}</CodeBlock>

      <h2>Reading from the composite</h2>
      <CodeBlock>{`function Header() {
  const summary = root.use(
    (state) => \`\${state.user.name} · \${state.cart.items.length}\`,
  );
  return <span>{summary}</span>;
}

const snapshot = root.getState();
// { user: {...}, cart: {...} }`}</CodeBlock>

      <p>
        The composite is read-only. Mutations still happen through each underlying store's actions;{' '}
        <code>composeStores</code> only provides a unified read surface.
      </p>

      <Pager href={HREF} />
    </div>
  );
}

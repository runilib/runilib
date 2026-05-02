import { CodeBlock } from '@/components/CodeBlock';
import { Pager } from '@/components/Pager';

export const metadata = { title: 'Scoped state' };

const HREF = '/docs/scoped-state';

export default function ScopedStatePage() {
  return (
    <div className="content">
      <h1>Scoped state</h1>
      <p>
        Scopes let you reuse one state model for many isolated contexts. Same definition, different
        scope id, different state instance.
      </p>

      <CodeBlock>{`const cartStore = createStore('cart', {
  state: () => ({ items: [] as string[] }),
  actions: ({ patch }) => ({
    add(item: string) {
      patch((state) => ({ items: [...state.items, item] }));
    },
  }),
});

const nikeCart = cartStore.scope('nike');
const appleCart = cartStore.scope('apple');

nikeCart.actions.add('Air Max');
appleCart.actions.add('iPhone');`}</CodeBlock>

      <h2>When to use scopes</h2>
      <p>
        The id passed to <code>scope()</code> is the identity of the context. Typical examples:
      </p>
      <ul>
        <li>
          <code>shopId</code>
        </li>
        <li>
          <code>projectId</code>
        </li>
        <li>
          <code>workspaceId</code>
        </li>
        <li>
          <code>tabId</code>
        </li>
        <li>
          <code>documentId</code>
        </li>
        <li>
          <code>conversationId</code>
        </li>
      </ul>

      <p>
        Each scoped instance has its own state, its own effects, and its own bound actions, but
        shares the definition.
      </p>

      <Pager href={HREF} />
    </div>
  );
}

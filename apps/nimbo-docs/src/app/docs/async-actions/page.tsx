import { CodeBlock } from '@/components/CodeBlock';
import { Pager } from '@/components/Pager';

export const metadata = { title: 'Async actions' };

const HREF = '/docs/async-actions';

export default function AsyncActionsPage() {
  return (
    <div className="content">
      <h1>Async actions</h1>
      <p>
        Async actions run asynchronous work and expose pending, error and result state — no manual
        flag juggling required.
      </p>

      <CodeBlock>{`const userStore = createStore('user', {
  state: () => ({ user: null as User | null }),
  asyncActions: ({ patch, signal }) => ({
    async fetchUser(id: string) {
      const response = await fetch(\`/api/users/\${id}\`, { signal });
      const user = await response.json();
      patch({ user });
      return user;
    },
  }),
});`}</CodeBlock>

      <h2>Hooks</h2>
      <CodeBlock>{`function Profile({ id }: { id: string }) {
  const fetchUser = userStore.useAsyncAction('fetchUser');
  const pending = userStore.usePending('fetchUser');
  const error = userStore.useError('fetchUser');
  const user = userStore.useResult('fetchUser');

  if (pending) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <button onClick={() => fetchUser(id)}>{user?.name}</button>;
}`}</CodeBlock>

      <h2>Strategies</h2>
      <p>
        Wrap an async action with <code>takeLatest</code> to cancel in-flight runs when a new one
        starts. The provided <code>signal</code> is automatically aborted.
      </p>
      <CodeBlock>{`import { takeLatest } from '@runilib/nimbo';

asyncActions: ({ patch, signal }) => ({
  search: takeLatest(async (query: string) => {
    const response = await fetch(\`/search?q=\${query}\`, { signal });
    patch({ results: await response.json() });
  }),
});`}</CodeBlock>

      <Pager href={HREF} />
    </div>
  );
}

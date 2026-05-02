import { Pager } from '@/components/Pager';

export const metadata = { title: 'Introduction' };

const HREF = '/docs/introduction';

export default function IntroductionPage() {
  return (
    <div className="content">
      <h1>Introduction</h1>
      <p>
        Nimbo is a small state management library for React and React Native. It exists for cases
        where you want reusable state logic without reducers, action strings, providers everywhere,
        or a storage-first mental model.
      </p>

      <div className="callout">
        <p>
          <strong>Heads up.</strong> Nimbo is in active development. The API may change before the
          first public release.
        </p>
      </div>

      <h2>Mental model</h2>
      <p>A Nimbo store is a typed module with:</p>
      <ul>
        <li>
          <code>state</code> — the source values
        </li>
        <li>
          <code>actions</code> — the only public way to mutate state
        </li>
        <li>
          <code>selectors</code> — derived reads
        </li>
        <li>
          <code>effects</code> — side effects that react to lifecycle or state changes
        </li>
        <li>
          <code>scope(id)</code> — isolated state instances from the same definition
        </li>
      </ul>

      <h2>The same definition, three lifetimes</h2>
      <p>One store definition can be used:</p>
      <ul>
        <li>as a global singleton (the default),</li>
        <li>
          locally per component with <code>useLocalStore</code>,
        </li>
        <li>
          or split into isolated instances with <code>store.scope(id)</code>.
        </li>
      </ul>

      <Pager href={HREF} />
    </div>
  );
}

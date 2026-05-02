import { HighlightedCode } from '@/components/CodeBlock';

import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: 'T',
    title: 'Typed by default',
    description:
      'State, actions and selectors are inferred end-to-end. TypeScript works for you, not against you.',
  },
  {
    icon: 'P',
    title: 'No providers required',
    description: 'Use global stores instantly without wrapping your app in deep provider trees.',
  },
  {
    icon: 'S',
    title: 'Scoped instances',
    description:
      'Reuse one definition for many isolated contexts. Perfect for tabs, dashboards and editors.',
  },
  {
    icon: 'L',
    title: 'Local stores',
    description:
      'Create component-bound state with the same store definition and a consistent API.',
  },
  {
    icon: 'E',
    title: 'Effects built in',
    description:
      'React to lifecycle and state changes outside components. Keep side effects away from UI.',
  },
  {
    icon: 'A',
    title: 'Async actions',
    description:
      'Handle pending, result, error and cancellation cleanly with zero external dependencies.',
  },
];

const apiSteps = [
  {
    label: '01',
    title: 'Define',
    code: `createStore({
  state: { count: 0 },
  actions: { ... }
})`,
    description: 'Create a robust store with a single, type-safe object definition.',
  },
  {
    label: '02',
    title: 'Consume',
    code: `const count = counter.use(
  (state) => state.count
)`,
    description: 'Use standard hooks with zero boilerplate. Nimbo handles re-render optimization.',
  },
  {
    label: '03',
    title: 'Scale',
    code: `const store = todos.scope(
  projectId
)`,
    description: 'Instantiate scoped stores on the fly. No manual context management needed.',
  },
];

export default function HomePage() {
  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero__copy">
          <span className="home-badge">@runilib/nimbo</span>
          <h1>
            Typed state modules <span>for React.</span>
          </h1>
          <p>
            Build reusable state logic with inferred types, scoped instances, selectors, effects and
            async actions. No reducers, no provider sprawl, no boilerplate.
          </p>
          <div className="home-hero__actions">
            <Link
              className="button button--primary button--large"
              href="/docs/quickstart"
            >
              Get started
            </Link>
            <a
              className="button button--ghost button--large"
              href="https://github.com/runilib/nimbo"
              rel="noreferrer"
              target="_blank"
            >
              View on GitHub
            </a>
          </div>
          <div className="home-trust">
            <div className="home-trust__avatars">
              <span>TS</span>
              <span>RX</span>
              <span>RN</span>
            </div>
            <p>Trusted by developers building typed React apps.</p>
          </div>
        </div>

        <div className="home-hero__visual">
          <div className="home-hero__mascot">
            <Image
              alt="Nimbo octopus"
              height={190}
              src="/brand/nimbo-octopus.svg"
              width={190}
            />
          </div>

          <div
            aria-label="Nimbo counter store example"
            className="home-code-window"
            role="img"
          >
            <div className="home-code-window__bar">
              <span className="home-code-window__dots">
                <i />
                <i />
                <i />
              </span>
              <span>counter.ts</span>
              <span className="home-code-window__copy">copy</span>
            </div>
            <pre>
              <HighlightedCode>
                {`import { createStore } from '@runilib/nimbo';

export const counter = createStore({
  state: () => ({ count: 0 }),
  actions: ({ patch }) => ({
    increment() {
      patch((state) => ({ count: state.count + 1 }));
    },
  }),
  selectors: {
    isEmpty: (state) => state.count === 0,
  },
});`}
              </HighlightedCode>
            </pre>
          </div>
        </div>
      </section>

      <section className="home-section home-section--centered">
        <p className="home-kicker">Built for technical precision.</p>
        <h2>State management that keeps the model small.</h2>
        <p>
          Nimbo solves the friction points of modern state management with a focus on type safety,
          component ergonomics and reusable store definitions.
        </p>
        <div className="home-feature-grid">
          {features.map((feature) => (
            <article
              className="home-feature-card"
              key={feature.title}
            >
              <span>{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-compare">
        <div className="home-section home-section--centered">
          <h2>State logic without the ceremony.</h2>
          <p>Stop writing hundreds of lines of boilerplate just to update a boolean.</p>
          <div className="home-compare-grid">
            <article className="home-compare-card">
              <h3>Reducer-based</h3>
              <p>Action creators, constant strings, reducer switches and manual dispatching.</p>
              <pre>{`case 'INCREMENT':
  return { ...state, count: state.count + 1 }`}</pre>
            </article>
            <article className="home-compare-card">
              <h3>Context-heavy</h3>
              <p>Deep nesting, provider sprawl and unnecessary re-renders across the tree.</p>
              <pre>{`<CounterProvider>
  <ThemeProvider>
    <UserProvider />`}</pre>
            </article>
            <article className="home-compare-card home-compare-card--accent">
              <div>
                <h3>Nimbo way</h3>
                <span>Recommended</span>
              </div>
              <p>Direct mutations with precise, auto-selectors and zero-config context.</p>
              <pre>{`// Just define and use
counter.inc();
// That's it.`}</pre>
            </article>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-api-grid">
          {apiSteps.map((step) => (
            <article
              className="home-api-card"
              key={step.title}
            >
              <div className="home-api-card__label">
                <span>{step.label}</span>
                {step.title}
              </div>
              <pre>{step.code}</pre>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-lifetimes">
        <div className="home-lifetimes__copy">
          <h2>One definition, multiple lifetimes.</h2>
          <p>
            Why rewrite logic for different contexts? With Nimbo, the same store definition works as
            a global singleton, a component-local state, or a scoped instance identified by a string
            or number.
          </p>
          <div className="home-lifetime-pills">
            <span>Global</span>
            <span>Local</span>
            <span>Scoped</span>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="home-lifetimes__orbit"
        >
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="home-final">
        <h2>
          Start with a tiny store.
          <span>Scale when you need it.</span>
        </h2>
        <p>Join the growing community of developers building performant React apps with Nimbo.</p>
        <div className="home-hero__actions">
          <Link
            className="button button--primary button--large"
            href="/docs/introduction"
          >
            Read the docs
          </Link>
          <Link
            className="button button--ghost button--large"
            href="/docs/installation"
          >
            Install package
          </Link>
        </div>
        <code>npm install @runilib/nimbo</code>
      </section>

      <footer className="home-footer">
        <Link
          className="home-footer__brand"
          href="/"
        >
          <span>N</span>
          Nimbo
        </Link>
        <nav>
          <a
            href="https://github.com/runilib/nimbo"
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/@runilib/nimbo"
            rel="noreferrer"
            target="_blank"
          >
            npm
          </a>
          <Link href="/docs/introduction">Docs</Link>
        </nav>
        <p>Built for the modern web.</p>
      </footer>
    </div>
  );
}

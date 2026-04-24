import { Link } from 'react-router-dom';

const LIBRARIES = [
  {
    slug: 'walkit',
    route: '/walkit',
    eyebrow: 'Guided journeys',
    title: '@runilib/react-walkit',
    description:
      'Tooltips, guided tours, route-aware onboarding, custom popovers, and cross-screen flows.',
    accent: 'amber',
    examples: ['Dashboard tour', 'Custom popover', 'Tooltip placements', 'Settings flow'],
  },
  {
    slug: 'formbridge',
    route: '/formbridge',
    eyebrow: 'Form platform',
    title: '@runilib/react-formbridge',
    description:
      'Schema-driven forms, route-based wizard flows, masks, validators, styling overrides, and async field data.',
    accent: 'blue',
    examples: ['Checkout form', 'Route-based wizard', 'Masks', 'Bridges', 'Styling'],
  },
] as const;

export function LibraryHubPage() {
  return (
    <main className="library-shell">
      <section className="library-hero fade-up">
        <span className="library-eyebrow">runilib examples</span>
        <h1>Choose the library you want to explore.</h1>
        <p>
          The example apps now start with a clean split so each library has its own space,
          its own routes, and its own demos.
        </p>
      </section>

      <section className="library-grid">
        {LIBRARIES.map((library) => (
          <article
            key={library.slug}
            className={`library-card library-card-${library.accent} fade-up`}
          >
            <div className="library-card-top">
              <span
                className={`tag ${library.accent === 'amber' ? 'tag-amber' : 'tag-blue'}`}
              >
                {library.eyebrow}
              </span>
              <span className="library-route">{library.route}</span>
            </div>

            <div className="library-card-copy">
              <h2>{library.title}</h2>
              <p>{library.description}</p>
            </div>

            <ul className="library-example-list">
              {library.examples.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>

            <Link
              to={library.route}
              className="library-card-link"
            >
              Open examples
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

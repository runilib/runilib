import { getDocsLandingHref } from '@/lib/docs';

import Link from 'next/link';

export default function NotFound() {
  const docsHref = getDocsLandingHref();

  return (
    <main className="empty-state">
      <div className="shell empty-state__inner">
        <p className="eyebrow">Not found</p>
        <h1>This documentation page does not exist.</h1>
        <p>
          Try the documentation overview or jump back to the dedicated react-formbridge
          home page.
        </p>
        <div className="hero__actions">
          <Link
            className="button button--primary"
            href={docsHref}
          >
            Open docs
          </Link>
          <Link
            className="button button--secondary"
            href="/"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}

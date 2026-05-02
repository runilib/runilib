import { getPager } from '@/lib/nav';

import Link from 'next/link';

export function Pager({ href }: { href: string }) {
  const { prev, next } = getPager(href);

  return (
    <div className="pager">
      {prev ? (
        <Link
          className="pager__link"
          href={prev.href}
        >
          <small>← Previous</small>
          <span>{prev.label}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          className="pager__link pager__link--next"
          href={next.href}
        >
          <small>Next →</small>
          <span>{next.label}</span>
        </Link>
      ) : null}
    </div>
  );
}

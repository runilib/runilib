'use client';

import Image from 'next/image';
import Link from 'next/link';

type HeaderProps = {
  onToggleSidebar?: () => void;
};

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          aria-label="Toggle navigation"
          className="mobile-toggle"
          onClick={onToggleSidebar}
          type="button"
          hidden={!onToggleSidebar}
        >
          ☰
        </button>
        <Link
          className="header__brand"
          href="/"
        >
          <span className="header__brand-mark">
            <Image
              alt=""
              height={32}
              src="/brand/nimbo-octopus.svg"
              width={32}
            />
          </span>
          <span>Nimbo</span>
        </Link>
      </div>
      <nav className="header__nav">
        <Link href="/docs/introduction">Docs</Link>
        <Link href="/docs/create-store">API</Link>
        <Link href="/docs/quickstart">Examples</Link>
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
        <Link
          className="header__cta"
          href="/docs/quickstart"
        >
          Get started
        </Link>
      </nav>
    </header>
  );
}

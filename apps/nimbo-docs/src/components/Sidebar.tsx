'use client';

import { nav } from '@/lib/nav';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarProps = {
  open?: boolean;
  onNavigate?: () => void;
};

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`sidebar${open ? ' is-open' : ''}`}>
      {nav.map((section) => (
        <div
          className="sidebar__section"
          key={section.label}
        >
          <p className="sidebar__label">{section.label}</p>
          <ul className="sidebar__list">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    className={`sidebar__link${isActive ? ' is-active' : ''}`}
                    href={item.href}
                    onClick={onNavigate}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}

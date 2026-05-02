'use client';

import { type ReactNode, useState } from 'react';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <>
      <Header onToggleSidebar={isHome ? undefined : () => setOpen((value) => !value)} />
      <div className={isHome ? 'layout layout--home' : 'layout'}>
        {isHome ? null : (
          <Sidebar
            onNavigate={() => setOpen(false)}
            open={open}
          />
        )}
        <main className={isHome ? 'main main--home' : 'main'}>{children}</main>
      </div>
    </>
  );
}

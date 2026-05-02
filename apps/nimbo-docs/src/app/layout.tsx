import type { ReactNode } from 'react';

import { Shell } from '@/components/Shell';

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Nimbo — typed state for React',
    template: '%s | Nimbo docs',
  },
  description:
    'Tiny typed state modules for React and React Native with global, local, scoped, and async-ready state primitives.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}

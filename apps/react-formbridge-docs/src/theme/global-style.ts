'use client';

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --bg: ${({ theme }) => theme.bg};
    --surface: ${({ theme }) => theme.surface};
    --surface-soft: ${({ theme }) => theme.surfaceSoft};
    --surface-strong: ${({ theme }) => theme.surfaceStrong};
    --border: ${({ theme }) => theme.border};
    --border-strong: ${({ theme }) => theme.borderStrong};
    --text: ${({ theme }) => theme.text};
    --text-soft: ${({ theme }) => theme.textSoft};
    --text-muted: ${({ theme }) => theme.textMuted};
    --accent: ${({ theme }) => theme.accent};
    --accent-strong: ${({ theme }) => theme.accentStrong};
    --accent-soft: ${({ theme }) => theme.accentSoft};
    --success: ${({ theme }) => theme.success};
    --radius: 8px;
    --shadow: ${({ theme }) => theme.shadow};
  }

  html {
    color-scheme: ${({ theme }) => theme.mode};
  }

  body {
    background: ${({ theme }) => theme.pageGradient};
    color: ${({ theme }) => theme.text};
    transition:
      background 180ms ease,
      color 180ms ease;
  }

  ::selection {
    background: ${({ theme }) => theme.accentSoft};
  }
`;

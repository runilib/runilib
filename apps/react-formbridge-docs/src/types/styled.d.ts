import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: 'light' | 'dark';
    bg: string;
    surface: string;
    surfaceSoft: string;
    surfaceStrong: string;
    text: string;
    textSoft: string;
    textMuted: string;
    border: string;
    borderStrong: string;
    accent: string;
    accentStrong: string;
    accentSoft: string;
    success: string;
    shadow: string;
    pageGradient: string;
    headerBg: string;
    heroOverlay: string;
    heroBorder: string;
    heroShadow: string;
    heroText: string;
    snippetBg: string;
    snippetText: string;
    sectionTint: string;
    footerBg: string;
  }
}

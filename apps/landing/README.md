# RUNILIB — Official Website

Official site for RUNILIB (React Universal Libs), built with **React 18 + TypeScript + styled-components**.

## Stack

| Tool | Version | Role |
|---|---|---|
| **React** | 18 | UI framework |
| **TypeScript** | 5.3 | Type safety throughout |
| **styled-components** | 6 | CSS-in-JS + ThemeProvider |
| **React Router** | 6 | SPA routing |
| **Vite** | 5 | Build tool |
| **Sora + DM Mono** | — | Typography (Google Fonts) |

## Quick start

```bash
# 1. Unzip and enter
cd runilib-ts

# 2. Install
npm install

# 3. Dev server
npm run dev
# → http://localhost:5173

# 4. Type check
npm run typecheck

# 5. Build
npm run build
```

## Project structure

```
src/
├── types/index.ts          ← All TypeScript types (AppTheme, Translations, LibraryInfo...)
├── styled.d.ts             ← styled-components DefaultTheme augmentation
├── theme/index.ts          ← darkTheme + lightTheme tokens
├── i18n/
│   ├── en.ts               ← English translations (complete)
│   ├── fr.ts               ← French translations (complete)
│   └── index.ts
├── hooks/
│   ├── useTheme.ts         ← dark/light toggle + localStorage persistence
│   └── useI18n.ts          ← locale toggle + browser detection + persistence
├── context/AppContext.tsx  ← Global context (theme + i18n)
├── data/
│   ├── libraries.ts        ← All library metadata (formbridge, walkit)
│   └── docs/
│       ├── formbridge.ts   ← Complete formbridge documentation
│       ├── react-walkit.ts     ← Complete walkit documentation
│       └── index.ts
├── components/
│   ├── Logo.tsx            ← Animated SVG orbital logo
│   ├── Navbar.tsx          ← Sticky navbar, lang toggle, mobile menu
│   ├── Footer.tsx          ← 4-column footer
│   └── CodeBlock.tsx       ← VS Code One Dark syntax highlighter (no external deps)
└── pages/
    ├── Home.tsx            ← Landing page (hero, features, libs, code demo, CTA)
    ├── Libraries.tsx       ← Library list with live search
    ├── LibraryDetail.tsx   ← Dynamic library page (/libraries/:id)
    ├── Docs.tsx            ← Docs hub with library cards
    └── Ecosystem.tsx       ← Vision, architecture, roadmap + NotFound
```

## Features

### Dark / Light mode
- Auto-detects `prefers-color-scheme`
- Toggled via the sun/moon button in the navbar
- Persisted in `localStorage`

### Multi-language (EN / FR)
- Auto-detects browser language
- Toggle button in navbar (`🇫🇷 FR` / `🇬🇧 EN`)
- Persisted in `localStorage`
- Both languages are 100% complete

### Dynamic library documentation
- `/libraries/formbridge` — formbridge docs with sidebar
- `/libraries/walkit`   — walkit docs with sidebar
- Each doc has prev/next navigation between sections

### VS Code syntax highlighter
- Built from scratch — no external deps
- One Dark color palette
- Supports: tsx, ts, bash
- Line numbers, copy button, filename
- Colorizes: keywords, strings, types, functions, JSX tags, comments, operators...

### All styled with styled-components
- Zero CSS files
- Full TypeScript types via DefaultTheme augmentation
- ThemeProvider at root — all components have full theme access

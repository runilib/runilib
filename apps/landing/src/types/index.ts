// ── Theme ─────────────────────────────────────────────────────
export interface AppTheme {
  mode: 'dark' | 'light';
  bg: string;
  bgSurface: string;
  bgCard: string;
  bgCardHover: string;
  bgCodeBlock: string;
  bgNavbar: string;
  border: string;
  borderHover: string;
  borderCode: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textCode: string;
  teal: string;
  tealDim: string;
  tealGlow: string;
  amber: string;
  amberDim: string;
  blue: string;
  blueDim: string;
  green: string;
  greenDim: string;
  purple: string;
  purpleDim: string;
  red: string;
  redDim: string;
  gradientHero: string;
  gradientCard: string;
  gradientFooter: string;
  shadowCard: string;
  shadowGlow: string;
  shadowNavbar: string;
}

// ── i18n ──────────────────────────────────────────────────────
export type Locale = 'en' | 'fr';

export interface Translations {
  nav: {
    home: string;
    libraries: string;
    docs: string;
    ecosystem: string;
    github: string;
  };
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
    stats: {
      libs: string;
      ts: string;
      platforms: string;
      config: string;
    };
  };
  install: {
    label: string;
  };
  features: {
    label: string;
    title: string;
    subtitle: string;
    items: Array<{ title: string; desc: string }>;
  };
  libs: {
    label: string;
    title: string;
    subtitle: string;
    docs: string;
    github: string;
  };
  code: {
    label: string;
    title: string;
    subtitle: string;
  };
  cta: {
    title: string;
    desc: string;
    primary: string;
    secondary: string;
  };
  footer: {
    desc: string;
    copyright: string;
    cols: {
      libraries: string;
      docs: string;
      community: string;
      project: string;
    };
  };
  libraryPage: {
    install: string;
    version: string;
    features: string;
    quickStart: string;
    apiRef: string;
    examples: string;
    back: string;
    stable: string;
    beta: string;
    readDocs: string;
  };
  docs: {
    title: string;
    searchPlaceholder: string;
  };
  ecosystem: {
    title: string;
    subtitle: string;
    principles: {
      label: string;
      title: string;
    };
    roadmap: {
      label: string;
      title: string;
    };
  };
  notFound: {
    title: string;
    sub: string;
    back: string;
  };
  contributing: {
    nav: string;
    hero: {
      label: string;
      title: string;
      subtitle: string;
    };
    whyContribute: {
      label: string;
      title: string;
      items: Array<{ title: string; desc: string }>;
    };
    steps: {
      label: string;
      title: string;
      items: Array<{
        step: string;
        title: string;
        desc: string;
        note?: string;
      }>;
    };
    codeStyle: {
      label: string;
      title: string;
      rules: Array<{ title: string; desc: string }>;
    };
    prChecklist: {
      label: string;
      title: string;
      items: string[];
    };
    goodFirstIssues: {
      label: string;
      title: string;
      subtitle: string;
      items: Array<{
        tag: string;
        title: string;
        desc: string;
        color: string;
      }>;
    };
    community: {
      label: string;
      title: string;
      subtitle: string;
    };
    recognition: {
      label: string;
      title: string;
      subtitle: string;
    };
    cta: {
      title: string;
      desc: string;
      primary: string;
      secondary: string;
    };
  };
}

// ── Library data ──────────────────────────────────────────────
export type LibColor = 'teal' | 'blue' | 'amber' | 'purple' | 'green';
export type LibStatus = 'stable' | 'beta' | 'planned';

export interface LibraryInfo {
  id: string;
  name: string;
  tagline: string;
  desc: string;
  color: LibColor;
  icon: string;
  version: string;
  tags: string[];
  highlights: string[];
  install: string;
  status: LibStatus;
  npmUrl: string;
  githubUrl: string;
  docsUrl?: string;
}

// ── Docs ──────────────────────────────────────────────────────
export interface CodeSnippet {
  filename: string;
  lang: 'tsx' | 'ts' | 'bash' | 'json';
  code: string;
  label?: string;
  maxHeight?: string;
  preview?: DocPreview;
}

export interface DocPreview {
  src: string;
  alt: string;
  caption?: string;
  maxWidth?: number;
  maxHeight?: number;
  /** When true, `src` is rendered as a <video> instead of an <img>. */
  video?: boolean;
}

/** Replace content/code of a section starting from a given version. */
export interface VersionOverride {
  /** Version from which this override applies (e.g. '1.0.1'). */
  since: string;
  content?: string;
  code?: CodeSnippet;
  codeTabs?: CodeSnippet[];
}

export interface DocSection {
  id: string;
  title: string;
  content: string;
  code?: CodeSnippet;
  codeTabs?: CodeSnippet[];
  subsections?: DocSection[];
  /** Semver from which this section is available (e.g. '1.0.0'). */
  since?: string;
  /**
   * Version-specific overrides for content / code.
   * The resolver picks the override whose `since` is the highest <= selected version.
   * Only the fields present in the override replace the base values.
   */
  versionOverrides?: VersionOverride[];
}

export interface DocGroup {
  group: string;
  color?: LibColor;
  items: Array<{ id: string; label: string }>;
}

export interface LibraryDoc {
  libId: string;
  /** Available documentation versions, newest first (e.g. ['1.0.0','0.9.0']). */
  versions: string[];
  sections: DocSection[];
  sidebar: DocGroup[];
}

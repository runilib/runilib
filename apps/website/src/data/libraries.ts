export interface Library {
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  version: string | null;
  status: "stable" | "beta" | "coming-soon";
  npm: string;
  github: string;
  tags: string[];
  color: string;
}

export const LIBRARIES: Library[] = [
  {
    slug: "tooltip",
    name: "tooltip",
    icon: "🪜",
    tagline: "Guided onboarding tours with animated spotlight.",
    description:
      "Cross-platform onboarding tours with 6 animation types, SVG spotlight, and full TypeScript support. One setup — runs natively on React and React Native.",
    version: "1.0.0",
    status: "stable",
    npm: "tooltip",
    github: "https://github.com/your-org/unikit/tree/main/packages/tooltip",
    tags: ["onboarding", "tour", "spotlight", "typescript"],
    color: "#6d74f7",
  },
  {
    slug: "formura",
    name: "formura",
    icon: "📋",
    tagline: "Cross-platform form state management & validation.",
    description:
      "Unified form state with schema validation. Works on any React environment with the same API and hooks.",
    version: null,
    status: "coming-soon",
    npm: "formura",
    github: "https://github.com/your-org/unikit",
    tags: ["forms", "validation", "state"],
    color: "#34d399",
  },
  {
    slug: "toastly",
    name: "toastly",
    icon: "🔔",
    tagline: "Beautiful toast notifications with rich theming.",
    description:
      "Accessible, animated toast notifications. Identical API on web and native with multiple positions, icons, and actions.",
    version: null,
    status: "coming-soon",
    npm: "toastly",
    github: "https://github.com/your-org/unikit",
    tags: ["notifications", "toast", "alerts"],
    color: "#f59e0b",
  },
  {
    slug: "modalkit",
    name: "modalkit",
    icon: "🪟",
    tagline: "Modals, sheets & drawers for every platform.",
    description:
      "Accessible modals and bottom sheets. Bottom sheet on native, centered dialog on web — same props.",
    version: null,
    status: "coming-soon",
    npm: "modalkit",
    github: "https://github.com/your-org/unikit",
    tags: ["modal", "sheet", "dialog"],
    color: "#a78bfa",
  },
  {
    slug: "datepick",
    name: "datepick",
    icon: "📅",
    tagline: "Date & time pickers, cross-platform.",
    description:
      "Native date picker on mobile, polished calendar on web. One import, zero configuration.",
    version: null,
    status: "coming-soon",
    npm: "datepick",
    github: "https://github.com/your-org/unikit",
    tags: ["date", "picker", "calendar"],
    color: "#f472b6",
  },
  {
    slug: "storex",
    name: "storex",
    icon: "🗃️",
    tagline: "Persistent key-value storage with a universal API.",
    description:
      "AsyncStorage on native, localStorage on web — all behind a single async API with TypeScript generics.",
    version: null,
    status: "coming-soon",
    npm: "storex",
    github: "https://github.com/your-org/unikit",
    tags: ["storage", "persistence", "async"],
    color: "#38bdf8",
  },
];

import type { Translations } from "../types";

export const en: Translations = {
  nav: {
    home: "Home",
    libraries: "Libraries",
    docs: "Documentation",
    ecosystem: "Ecosystem",
    github: "GitHub",
  },
  hero: {
    badge: "React Universal Libs · Open Source · MIT",
    title: "One codebase.",
    titleAccent: "Web & Native.",
    subtitle:
      "RUNILIB is a cross-platform library ecosystem for React and React Native. formbridge, stepwise, tooltip — and more to come.",
    cta: "Get started",
    ctaSecondary: "Browse libraries",
    stats: {
      libs: "Libraries",
      ts: "TypeScript",
      platforms: "Platforms",
      config: "Config needed",
    },
  },
  install: {
    label: "Quick install",
  },
  features: {
    label: "Why RUNILIB",
    title: "The problem we solve",
    subtitle: "Writing the same logic twice — once for web, once for mobile — is over.",
    items: [
      {
        title: "Schema-first",
        desc: "Describe your intent in TypeScript. The library generates components, validation and UI automatically.",
      },
      {
        title: "Cross-platform",
        desc: "One schema works on both React (web) and React Native. No duplicated code, no divergence.",
      },
      {
        title: "100% TypeScript",
        desc: "Types inferred automatically from your schema. Zero casting, zero any, full autocomplete.",
      },
      {
        title: "Accessible by default",
        desc: "WCAG 2.1 AA out of the box. Keyboard nav, ARIA roles, focus management — all handled.",
      },
      {
        title: "Zero config",
        desc: "No mandatory provider, no initial setup. import + use. That's it.",
      },
      {
        title: "Composable",
        desc: "Each library works standalone or together. The ecosystem grows without breaking existing code.",
      },
    ],
  },
  libs: {
    label: "Ecosystem",
    title: "Libraries with only one philosophy",
    subtitle: "Each library solves a different problem with the same unified API.",
    docs: "Documentation",
    github: "GitHub ↗",
  },
  code: {
    label: "See the code",
    title: "Simple. Powerful. Typed.",
    subtitle: "The API is designed to be intuitive from the very first line.",
  },
  cta: {
    title: "Ready to simplify your stack?",
    desc: "Join developers who stopped writing the same code twice.",
    primary: "Start for free",
    secondary: "⭐ Star on GitHub",
  },
  footer: {
    desc: "A cross-platform library ecosystem for React and React Native. Write once, run everywhere.",
    copyright: `© ${new Date().getFullYear()} RUNILIB — React Universal Libs. Built with ♥ by AKS.`,
    cols: {
      libraries: "Libraries",
      docs: "Documentation",
      community: "Community",
      project: "Project",
    },
  },
  libraryPage: {
    install: "Install",
    version: "Version",
    features: "Features",
    quickStart: "Quick start",
    apiRef: "API Reference",
    examples: "Examples",
    back: "← Back to libraries",
    stable: "Stable",
    beta: "Beta",
    readDocs: "Read the docs",
  },
  docs: {
    title: "Documentation",
    searchPlaceholder: "Search documentation...",
  },
  ecosystem: {
    title: "One ecosystem, one philosophy",
    subtitle:
      "RUNILIB is not a library. It's a way to develop — without duplication, without friction, without compromise between web and mobile.",
    principles: {
      label: "Principles",
      title: "What unites all libraries",
    },
    roadmap: {
      label: "Roadmap 2025–2026",
      title: "What's coming next",
    },
  },
  notFound: {
    title: "Page not found",
    sub: "This page does not exist or has been moved.",
    back: "← Back to home",
  },

  contributing: {
    nav: 'Contributing',
    hero: {
      label:    'Open Source',
      title:    'Contribute to RUNILIB',
      subtitle: 'RUNILIB is built by the community, for the community. Whether you fix a typo, improve docs, or ship a new feature — every contribution counts.',
    },
    whyContribute: {
      label: 'Why contribute',
      title: 'What you get from it',
      items: [
        { title: 'Real-world impact',   desc: 'Your code runs in production apps used by real developers every day.' },
        { title: 'Open source cred',    desc: 'Build a visible portfolio with meaningful contributions to a real ecosystem.' },
        { title: 'TypeScript mastery',  desc: 'Dive deep into advanced TS patterns, generics, and cross-platform architecture.' },
        { title: 'Code reviews',        desc: 'Get detailed, constructive feedback from experienced engineers.' },
        { title: 'Community',           desc: 'Join a network of developers passionate about cross-platform DX.' },
        { title: 'Recognition',         desc: 'All contributors are credited in releases, README, and the website.' },
      ],
    },
    steps: {
      label: 'How to contribute',
      title: 'Step-by-step guide',
      items: [
        {
          step:  '01',
          title: 'Pick an issue',
          desc:  'Browse open issues on GitHub. Look for issues tagged good first issue for an easy start, or help wanted for something more involved. If you have an idea, open an issue first to discuss it before coding.',
          note:  'Tip: comment "I\'d like to work on this" on the issue to let maintainers know.',
        },
        {
          step:  '02',
          title: 'Fork & clone',
          desc:  'Fork the repository on GitHub, then clone your fork locally. The project uses pnpm workspaces — make sure you have pnpm installed.',
        },
        {
          step:  '03',
          title: 'Set up the environment',
          desc:  'Install dependencies, then run the dev server. Each package has its own dev script. The root turbo dev command starts everything in parallel.',
        },
        {
          step:  '04',
          title: 'Make your changes',
          desc:  'Work on your feature or fix. Follow the code style guide below. Write or update tests as needed. Make sure nothing is broken by running the test suite.',
          note:  'Keep commits small and focused. One fix per commit.',
        },
        {
          step:  '05',
          title: 'Run quality checks',
          desc:  'Before pushing, run typecheck, lint, and tests. All three must pass. The CI will also run these checks automatically on your PR.',
        },
        {
          step:  '06',
          title: 'Open a Pull Request',
          desc:  'Push to your fork and open a PR against the main branch. Use the PR template — fill in what changed, why, and how to test it. Link the issue you\'re resolving.',
          note:  'Small, focused PRs get reviewed much faster than large ones.',
        },
        {
          step:  '07',
          title: 'Code review',
          desc:  'A maintainer will review your PR and leave comments. Address the feedback, push new commits — do not force-push during review. The conversation is part of the process.',
        },
        {
          step:  '08',
          title: 'Merge & celebrate 🎉',
          desc:  'Once approved, your PR gets merged. You\'ll be credited in the changelog and your GitHub username appears on the contributors list. Welcome to the team!',
        },
      ],
    },
    codeStyle: {
      label: 'Code style',
      title: 'Standards we follow',
      rules: [
        { title: 'TypeScript strict mode',   desc: 'All code must compile with strict: true. No any, no @ts-ignore without a comment explaining why.' },
        { title: 'No CSS files',             desc: 'Styling exclusively via styled-components. No inline style objects except for truly dynamic values (positions, percentages from state).' },
        { title: 'Transient props',          desc: 'Use $prefixed props for styled-components to avoid forwarding to the DOM — e.g. $active, $color, $open.' },
        { title: 'Named exports',            desc: 'Always use named exports. No default exports except for pages and the App root.' },
        { title: 'Cross-platform first',     desc: 'Every field, component, and hook must work on React AND React Native. Test both. Platform-specific code goes in /web or /native sub-folders.' },
        { title: 'Tests required',           desc: 'New features need tests. Bug fixes need a regression test. Run npm test before pushing.' },
        { title: 'Conventional commits',     desc: 'Follow Conventional Commits: feat:, fix:, docs:, refactor:, test:, chore:. This powers the changelog generator.' },
        { title: 'No side effects on import',desc: 'Library entry points must be pure. setLocale() and other configurators are explicit calls — never run automatically on import.' },
      ],
    },
    prChecklist: {
      label: 'Before you submit',
      title: 'PR checklist',
      items: [
        'Types compile — npm run typecheck passes with zero errors',
        'Tests pass — npm test green on both web and native',
        'Lint passes — npm run lint with no warnings',
        'No CSS files added — styling via styled-components only',
        'Cross-platform — tested or considered on React Native',
        'Docs updated — README or docs page updated if API changed',
        'Changelog entry — added to CHANGELOG.md under [Unreleased]',
        'PR description — filled in: what changed, why, how to test',
        'Issue linked — PR description contains "Closes #123"',
        'Single responsibility — PR does one thing only',
      ],
    },
    goodFirstIssues: {
      label:    'Good first issues',
      title:    'Start here',
      subtitle: 'These issues are well-scoped, documented, and a great way to get familiar with the codebase.',
      items: [
        { tag: 'good first issue', title: 'Add Japanese locale to formbridge',          desc: 'Add ja locale pack with all validation messages translated.',                   color: 'teal'   },
        { tag: 'good first issue', title: 'stepwise: add slide-left animation',         desc: 'Implement a slide-from-left variant for CopilotProvider animationType.',       color: 'amber'  },
        { tag: 'good first issue', title: 'tooltip: add data-testid to all components', desc: 'Add data-testid props to Tooltip, TooltipContent for easier testing.',         color: 'teal'   },
        { tag: 'help wanted',      title: 'formbridge: Valibot resolver',                desc: 'Implement a resolver adapter for Valibot schema validation library.',          color: 'blue'   },
        { tag: 'help wanted',      title: 'stepwise: Expo Router adapter',              desc: 'Build a navigation adapter for Expo Router multi-screen tours.',               color: 'amber'  },
        { tag: 'docs',             title: 'Add more formbridge examples to docs site',  desc: 'Add 3 real-world form examples: checkout, profile edit, multi-step survey.',  color: 'purple' },
      ],
    },
    community: {
      label:    'Community',
      title:    'Stay connected',
      subtitle: 'Ask questions, share ideas, and meet other contributors.',
    },
    recognition: {
      label:    'Recognition',
      title:    'Contributors wall',
      subtitle: 'Every merged contribution earns a spot here. Code, docs, design, translations, bug reports — all count.',
    },
    cta: {
      title:     'Ready to make your first contribution?',
      desc:      'The best way to start is to just pick an issue and dive in. The maintainers are here to help.',
      primary:   'Browse open issues',
      secondary: 'Read the full guide',
    },
  },
};

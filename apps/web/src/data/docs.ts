export interface DocSection {
  id: string;
  label: string;
  pages: DocPage[];
}
export interface DocPage {
  id: string;
  title: string;
}

export const STEPWISE_DOCS: DocSection[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    pages: [
      { id: "introduction", title: "Introduction" },
      { id: "installation", title: "Installation" },
      { id: "quick-start", title: "Quick Start" },
    ],
  },
  {
    id: "api",
    label: "API Reference",
    pages: [
      { id: "provider", title: "CopilotProvider" },
      { id: "step", title: "CopilotStep" },
      { id: "use-copilot", title: "useCopilot" },
    ],
  },
  {
    id: "customization",
    label: "Customization",
    pages: [
      { id: "animations", title: "Animations" },
      { id: "theming", title: "Theming" },
      { id: "custom-tooltip", title: "Custom Tooltip" },
    ],
  },
  {
    id: "guides",
    label: "Guides",
    pages: [
      { id: "typescript", title: "TypeScript" },
      { id: "conditional", title: "Conditional Steps" },
      { id: "callbacks", title: "Callbacks" },
    ],
  },
];

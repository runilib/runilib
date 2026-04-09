export interface DocPreview {
  src: string;
  alt: string;
  caption?: string;
  maxWidth?: number;
  maxHeight?: number;
  video?: boolean;
}

export interface CodeSnippet {
  filename: string;
  lang: 'tsx' | 'ts' | 'bash' | 'json';
  code: string;
  label?: string;
  maxHeight?: string;
  preview?: DocPreview;
}

export interface VersionOverride {
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
  since?: string;
  versionOverrides?: VersionOverride[];
}

export interface DocGroup {
  group: string;
  color?: string;
  items: Array<{ id: string; label: string }>;
}

export interface LibraryDoc {
  libId: string;
  versions: string[];
  sections: DocSection[];
  sidebar: DocGroup[];
}

export interface SiteStat {
  label: string;
  value: string;
}

export interface FeatureCard {
  title: string;
  description: string;
}

export interface UseCaseCard {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface DocEntry {
  id: string;
  slug: string;
  href: string;
  group: string;
  label: string;
  title: string;
  summary: string;
  index: number;
  section: DocSection;
}

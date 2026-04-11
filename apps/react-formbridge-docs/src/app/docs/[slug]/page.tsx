/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD is required for breadcrumbs and article metadata */

import { CodeTabs } from '@/components/CodeTabs';
import { DocSidebar } from '@/components/DocSidebar';
import { DocToc } from '@/components/DocToc';
import { RichText } from '@/components/RichText';
import { libraryInfo } from '@/data/site';
import {
  getDocEntryById,
  getDocEntryBySlug,
  getDocsLandingHref,
  getDocsVersion,
  getGroupedEntries,
  getPrevNextEntries,
} from '@/lib/docs';
import { absoluteUrl } from '@/lib/site';
import type { CodeSnippet, DocEntry } from '@/types';

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string }>;
};

type TocItem = {
  id: string;
  label: string;
};

type FeatureOptionRow = {
  description: string;
  property: string;
  type: string;
};

type FeatureReturnCard = {
  description: string;
  href?: string;
  label: string;
  title: string;
};

const USE_FORM_BRIDGE_TOC: TocItem[] = [
  { id: 'usage', label: 'Usage' },
  { id: 'options', label: 'Options' },
  { id: 'returns', label: 'Returns' },
  { id: 'implementation', label: 'Implementation' },
  { id: 'type-safety', label: 'Type Safety' },
];

const USE_FORM_BRIDGE_QUICKSTART: CodeSnippet[] = [
  {
    code: `import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name').required(),
  email: field.email('Email').required().trim().lowercase(),
} satisfies FormSchema

export function ProfileForm() {
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  })

  return (
    <Form onSubmit={async (values) => api.save(values)}>
      <fields.fullName />
      <fields.email />
      <Form.Submit disabled={!state.isValid}>Save changes</Form.Submit>
    </Form>
  )
}`,
    filename: 'QuickStart.tsx',
    label: 'TypeScript',
    lang: 'tsx',
  },
  {
    code: `import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name').required(),
  email: field.email('Email').required().trim().lowercase(),
}

export function ProfileForm() {
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  })

  return (
    <Form onSubmit={async (values) => api.save(values)}>
      <fields.fullName />
      <fields.email />
      <Form.Submit disabled={!state.isValid}>Save changes</Form.Submit>
    </Form>
  )
}`,
    filename: 'QuickStart.jsx',
    label: 'JavaScript',
    lang: 'tsx',
  },
];

const USE_FORM_BRIDGE_OPTIONS: FeatureOptionRow[] = [
  {
    description: 'Initial validation timing for builder rules. Defaults to `onBlur`.',
    property: 'validateOn',
    type: "'onChange' | 'onBlur' | 'onSubmit' | 'onTouched'",
  },
  {
    description:
      'Follow-up validation trigger after a field has already been interacted with.',
    property: 'revalidateOn',
    type: "'onChange' | 'onBlur' | 'onSubmit' | 'onTouched'",
  },
  {
    description: 'Optional schema adapter for Zod, Yup, Joi, or Valibot validation.',
    property: 'resolver',
    type: 'SchemaResolver',
  },
  {
    description:
      'Draft save and restore behavior with storage, TTL, debounce, and exclusions.',
    property: 'persist',
    type: 'PersistOptions',
  },
  {
    description: 'Recreate the runtime when the surrounding business context changes.',
    property: 'formKey',
    type: 'string',
  },
  {
    description: 'Seed the runtime from existing values before the user edits the form.',
    property: 'initialValues',
    type: 'Partial<SchemaValues<typeof schema>>',
  },
];

const TYPE_SAFE_ERROR_SNIPPET = `// Property '"doesNotExist"' is not assignable to the schema keys
const { setValue } = useFormBridge(schema)

setValue('fullName', 'Ava Stone')
setValue('doesNotExist', 'x')`;

export function generateStaticParams() {
  return getGroupedEntries()
    .flatMap((group) => group.entries)
    .map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getDocEntryBySlug(slug);

  if (!entry) {
    return {
      title: 'Section not found',
    };
  }

  const description = `${entry.summary} Full react-formbridge documentation for ${entry.title}.`;

  return {
    title: entry.title,
    description,
    alternates: {
      canonical: absoluteUrl(entry.href),
    },
    keywords: [
      libraryInfo.name,
      libraryInfo.packageName,
      entry.title,
      entry.group,
      'documentation',
      'React',
      'React Native',
      'TypeScript',
      'schema-driven forms',
    ],
    openGraph: {
      title: `${entry.title} | react-formbridge docs`,
      description,
      url: absoluteUrl(entry.href),
    },
  };
}

function buildDefaultToc(entry: DocEntry): TocItem[] {
  return (
    entry.section.subsections?.map((subsection) => ({
      id: subsection.id,
      label: subsection.title,
    })) ?? []
  );
}

function UseFormBridgeFeaturePage({
  docsHref,
  entry,
  version,
}: {
  docsHref: string;
  entry: DocEntry;
  version: string;
}) {
  const formEntry = getDocEntryById('fb-form');
  const fieldsEntry = getDocEntryById('fb-fields');
  const stateEntry = getDocEntryById('fb-state');
  const fieldControllerEntry = getDocEntryById('fb-field-controller');

  const returnCards: FeatureReturnCard[] = [
    {
      description:
        'Generated wrapper component with submit lifecycle and `Form.Submit` helpers.',
      href: formEntry?.href,
      label: 'generated wrapper',
      title: 'Form',
    },
    {
      description: 'Typed generated field components keyed by the schema field names.',
      href: fieldsEntry?.href,
      label: 'typed generated fields',
      title: 'fields',
    },
    {
      description:
        'Reactive values, errors, dirty flags, touched state, and submit status.',
      href: stateEntry?.href,
      label: 'reactive state',
      title: 'state',
    },
    {
      description:
        'Field-scoped runtime for fully custom UI without losing schema behavior.',
      href: fieldControllerEntry?.href,
      label: 'custom renderer bridge',
      title: 'fieldController()',
    },
  ];

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="doc-breadcrumbs"
      >
        <Link href={docsHref}>API Reference</Link>
        <span>•</span>
        <span>{entry.title}</span>
      </nav>

      <header className="doc-feature-hero">
        <span className="doc-feature-badge">Unified Logic Engine</span>
        <h1>{entry.title}</h1>
        <p>
          The primary interface for React FormBridge. A single, type-safe hook that
          orchestrates cross-platform form state, validation, and lifecycle events.
        </p>
      </header>

      <div className="doc-feature-intro">
        <article className="doc-feature-callout">
          <div
            className="doc-feature-callout__icon"
            aria-hidden="true"
          >
            <span />
          </div>
          <div>
            <h2>The &quot;One Hook&quot; Model</h2>
            <p>
              Eliminate environment parity issues. Define your logic once using{' '}
              <code className="inline-code">useFormBridge</code> and deploy to web,
              native, or desktop shells without forking your state machine.
            </p>
          </div>
        </article>

        <aside className="doc-feature-support">
          <p>
            Have questions? Use the GitHub issue tracker for product feedback and API
            help.
          </p>
          <a
            href={libraryInfo.repoIssuesUrl}
            rel="noreferrer"
            target="_blank"
          >
            Open GitHub issues
          </a>
        </aside>
      </div>

      <section
        className="doc-feature-section"
        id="usage"
      >
        <div className="doc-feature-section__head">
          <h2>Quick Start</h2>
          <span>v{version}</span>
        </div>
        <CodeTabs snippets={USE_FORM_BRIDGE_QUICKSTART} />
      </section>

      <section
        className="doc-feature-section"
        id="options"
      >
        <div className="doc-feature-section__head">
          <h2>API Options</h2>
        </div>

        <div className="doc-feature-table-shell">
          <table className="doc-feature-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {USE_FORM_BRIDGE_OPTIONS.map((item) => (
                <tr key={item.property}>
                  <td>
                    <code className="inline-code">{item.property}</code>
                  </td>
                  <td>{item.type}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        className="doc-feature-section"
        id="returns"
      >
        <div className="doc-feature-section__head">
          <h2>Return Value</h2>
        </div>
        <p className="doc-feature-section__lede">
          `useFormBridge()` returns the runtime surface needed to render forms, inspect
          live state, and drop into custom UI where needed.
        </p>

        <div className="doc-return-grid">
          {returnCards.map((card) => {
            const content = (
              <>
                <span className="doc-return-card__eyebrow">{card.label}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </>
            );

            return card.href ? (
              <Link
                className="doc-return-card"
                href={card.href}
                key={card.title}
              >
                {content}
              </Link>
            ) : (
              <article
                className="doc-return-card"
                key={card.title}
              >
                {content}
              </article>
            );
          })}
        </div>
      </section>

      <section
        className="doc-feature-section"
        id="implementation"
      >
        <div className="doc-feature-section__head">
          <h2>Cross-Platform Implementation</h2>
        </div>
        <p className="doc-feature-section__lede">
          See how the same schema-first runtime keeps web and native UI aligned without
          duplicating validation, visibility, or submit logic.
        </p>

        <div className="doc-preview-grid">
          <figure className="doc-preview-card doc-preview-card--browser">
            <div className="doc-preview-card__label">Browser Preview</div>
            <div className="doc-preview-card__frame">
              <Image
                alt="Browser preview of a generated profile settings form."
                height={420}
                src="/docs/formbridge/formbridge-overview-web.svg"
                unoptimized
                width={720}
              />
            </div>
          </figure>

          <figure className="doc-preview-card doc-preview-card--phone">
            <div className="doc-preview-card__label">Native Preview</div>
            <div className="doc-preview-card__device">
              <Image
                alt="Native preview of the same schema rendered as a mobile form."
                height={620}
                src="/docs/formbridge/formbridge-overview-native.svg"
                unoptimized
                width={340}
              />
            </div>
          </figure>
        </div>
      </section>

      <section
        className="doc-feature-section"
        id="type-safety"
      >
        <div className="doc-feature-section__head">
          <h2>Type-Safe Errors</h2>
        </div>

        <div className="doc-type-error">
          <div className="doc-type-error__badge">Runtime Type Error</div>
          <pre>{TYPE_SAFE_ERROR_SNIPPET}</pre>
        </div>
      </section>
    </>
  );
}

function StandardDocPage({
  docsHref,
  entry,
  version,
}: {
  docsHref: string;
  entry: DocEntry;
  version: string;
}) {
  const isTutorialPage = entry.id.startsWith('fb-tutorial');

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="doc-breadcrumbs"
      >
        <Link href={docsHref}>Docs</Link>
        <span>•</span>
        <span>{entry.group}</span>
        <span>•</span>
        <span>{entry.title}</span>
      </nav>

      <header className="doc-standard-hero">
        <div className="doc-standard-hero__meta">
          <span>{entry.group}</span>
          <span>v{version}</span>
        </div>
        <h1>{entry.title}</h1>
        <p>{entry.summary}</p>
      </header>

      <article className="doc-standard-article">
        <RichText
          interactiveCode={isTutorialPage}
          section={entry.section}
        />
      </article>
    </>
  );
}

export default async function DocEntryPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getDocEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  const version = getDocsVersion();
  const docsHref = getDocsLandingHref();
  const { previous, next } = getPrevNextEntries(slug);
  const isUseFormBridgePage = entry.id === 'fb-use-form-bridge';
  const tocItems = isUseFormBridgePage ? USE_FORM_BRIDGE_TOC : buildDefaultToc(entry);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: absoluteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Docs',
        item: absoluteUrl(docsHref),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: entry.title,
        item: absoluteUrl(entry.href),
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${entry.title} | react-formbridge docs`,
    description: entry.summary,
    url: absoluteUrl(entry.href),
    about: libraryInfo.name,
    keywords: [libraryInfo.name, entry.title, entry.group, 'documentation'].join(', '),
    author: {
      '@type': 'Organization',
      name: 'RUNILIB',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RUNILIB',
    },
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        type="application/ld+json"
      />

      <main className="docs-page">
        <div className="shell docs-page__shell">
          <aside className="docs-page__sidebar">
            <DocSidebar currentSlug={slug} />
          </aside>

          <div className="docs-page__main">
            <details className="doc-mobile-nav">
              <summary>Browse documentation</summary>
              <DocSidebar currentSlug={slug} />
            </details>

            {isUseFormBridgePage ? (
              <UseFormBridgeFeaturePage
                docsHref={docsHref}
                entry={entry}
                version={version}
              />
            ) : (
              <StandardDocPage
                docsHref={docsHref}
                entry={entry}
                version={version}
              />
            )}

            <nav className="pagination-nav">
              {previous ? (
                <Link
                  className="pagination-nav__link"
                  href={previous.href}
                >
                  <small>Previous</small>
                  <span>{previous.title}</span>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link
                  className="pagination-nav__link pagination-nav__link--next"
                  href={next.href}
                >
                  <small>Next</small>
                  <span>{next.title}</span>
                </Link>
              ) : null}
            </nav>
          </div>

          <aside className="docs-page__toc">
            <DocToc items={tocItems} />
          </aside>
        </div>
      </main>
    </>
  );
}

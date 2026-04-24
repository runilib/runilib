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
    interactive: true,
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
    filename: 'QuickStartPlayground.web.tsx',
    label: 'Web',
    lang: 'tsx',
  },
  {
    interactive: true,
    code: `import { ScrollView, View } from 'react-native'
import { field, useFormBridge } from '@runilib/react-formbridge'

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
    <ScrollView>
      <Form onSubmit={async (values) => api.save(values)}>
        <View style={{ gap: 12, padding: 16 }}>
          <fields.fullName />
          <fields.email />
          <Form.Submit disabled={!state.isValid}>Save changes</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
    filename: 'QuickStartPlayground.native.tsx',
    label: 'Native',
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
    property: 'validatorBridge',
    type: 'SchemaValidatorBridge',
  },
  {
    description:
      'Draft save and restore behavior with storage, TTL, debounce, and exclusions.',
    property: 'persist',
    type: `{
  key: string;\n
  storage?: "local" | "session" | "async" | StorageAdapter;\n
  ttl?: number;\n
  exclude?: string[];\n
  debounce?: number;\n
  onRestore?: (values: Record<string, unknown>) => void;\n
  onSaveError?: (error: unknown) => void;\n
  version?: string;
  }`,
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
  {
    description: 'Seed the runtime from existing values before the user edits the form.',
    property: 'globalDefaults',
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

const UseFormBridgeFeaturePage = ({
  docsHref,
  entry,
  version,
}: {
  docsHref: string;
  entry: DocEntry;
  version: string;
}) => {
  const formEntry = getDocEntryById('fb-form');
  const fieldsEntry = getDocEntryById('fb-fields');
  const stateEntry = getDocEntryById('fb-state');
  const fieldControllerEntry = getDocEntryById('fb-field-controller');
  const fieldErrorEntry = getDocEntryById('fb-field-error');
  const fieldLabelEntry = getDocEntryById('fb-field-label');
  const formProviderEntry = getDocEntryById('fb-use-form-bridge-context');
  const conditionalEntry = getDocEntryById('fb-conditional');
  const persistenceEntry = getDocEntryById('fb-persistence');
  const actionsEntry = getDocEntryById('fb-actions');

  const returnCards: FeatureReturnCard[] = [
    {
      description:
        'Advanced context wrapper that exposes the form runtime to consumers rendered outside `<Form>`.',
      href: formProviderEntry?.href,
      label: 'context wrapper',
      title: 'FormProvider',
    },
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
        'Standalone error renderer for a single field name, useful in custom layouts.',
      href: fieldErrorEntry?.href,
      label: 'standalone error',
      title: 'FieldError',
    },
    {
      description:
        'Standalone label renderer for a single field name, useful in custom layouts.',
      href: fieldLabelEntry?.href,
      label: 'standalone label',
      title: 'FieldLabel',
    },
    {
      description:
        'Field-scoped runtime for fully custom UI while keeping the schema contract intact.',
      href: fieldControllerEntry?.href,
      label: 'custom renderer bridge',
      title: 'fieldController()',
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
        'Per-field visibility, required, and disabled flags computed from conditional rules.',
      href: conditionalEntry?.href,
      label: 'conditional runtime',
      title: 'visibility',
    },
    {
      description: '`true` while a persisted draft is being restored into the runtime.',
      href: persistenceEntry?.href,
      label: 'draft lifecycle',
      title: 'persistanceHelpers.isLoadingDraft',
    },
    {
      description: '`true` once a previously saved draft was found and hydrated.',
      href: persistenceEntry?.href,
      label: 'draft lifecycle',
      title: 'persistanceHelpers.hasDraft',
    },
    {
      description: 'Delete the saved draft from the configured storage backend.',
      href: persistenceEntry?.href,
      label: 'draft helper',
      title: 'persistanceHelpers.clearDraft()',
    },
    {
      description:
        'Persist the current values immediately without waiting for the debounce window.',
      href: persistenceEntry?.href,
      label: 'draft helper',
      title: 'persistanceHelpers.saveDraftNow()',
    },
    {
      description: 'Set one field value programmatically from outside the form.',
      href: actionsEntry?.href,
      label: 'imperative action',
      title: 'setValue()',
    },
    {
      description: 'Read one field value on demand without subscribing to updates.',
      href: actionsEntry?.href,
      label: 'imperative action',
      title: 'getValue()',
    },
    {
      description: 'Read the full value object on demand without subscribing to updates.',
      href: actionsEntry?.href,
      label: 'imperative action',
      title: 'getValues()',
    },
    {
      description:
        'Validate a single field, a list of fields, or the entire form on demand.',
      href: actionsEntry?.href,
      label: 'imperative action',
      title: 'validate()',
    },
    {
      description:
        'Reset the form back to schema defaults or to a provided partial value object.',
      href: actionsEntry?.href,
      label: 'imperative action',
      title: 'resetFields()',
    },
    {
      description: 'Push a manual field error from imperative code or async handlers.',
      href: actionsEntry?.href,
      label: 'imperative action',
      title: 'setError()',
    },
    {
      description: 'Clear errors for one field, a list of fields, or the entire form.',
      href: actionsEntry?.href,
      label: 'imperative action',
      title: 'clearErrors()',
    },
    {
      description: 'Reactive single-field read that re-renders on every value change.',
      href: actionsEntry?.href,
      label: 'reactive helper',
      title: 'watch()',
    },
    {
      description: 'Reactive full-values read that re-renders on every value change.',
      href: actionsEntry?.href,
      label: 'reactive helper',
      title: 'watchAll()',
    },
    {
      description:
        'Imperatively trigger submission through the same pipeline as `Form.Submit`.',
      href: actionsEntry?.href,
      label: 'imperative action',
      title: 'submit()',
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
};

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
  const supportsInteractiveCode =
    isTutorialPage ||
    entry.id === 'fb-readonly' ||
    entry.id === 'fb-use-form-bridge-context' ||
    entry.id === 'fb-use-async-options';

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
      </header>

      <article className="doc-standard-article">
        <RichText
          interactiveCode={supportsInteractiveCode}
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

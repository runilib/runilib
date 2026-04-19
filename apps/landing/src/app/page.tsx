/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML — standard Next.js pattern */
import HomeClient from './HomeClient';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does RUNILIB work for both React web and React Native applications?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. RUNILIB is built as a cross-platform ecosystem with a shared TypeScript API for web and mobile, so teams can reuse patterns, business logic and UI primitives instead of maintaining two separate implementations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which library should I use for product tours, walkthroughs and user onboarding?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use @runilib/react-walkit. It covers product tours, guided tours, spotlight overlays, feature discovery, contextual onboarding and tooltips for both React and React Native.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which library should I use for schema-driven forms in TypeScript?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use @runilib/react-formbridge. It lets you define one schema and generate fields, validation, state, multi-step flows and reusable form patterns for React web and React Native.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can RUNILIB fit an existing design system or component architecture?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. RUNILIB libraries are composable, tree-shakeable and designed to work inside existing React or React Native codebases with custom UI, theming and strong TypeScript ergonomics.',
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomeClient />
    </>
  );
}

/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: structured data for SEO */
'use client';

import { useState } from 'react';

import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import { CodeBlock } from '../components/CodeBlock';
import { WEBSITE_FEATURES } from '../config/features';
import { useApp } from '../context/AppContext';
import {
  FORM_BRIDGE_DOCS_URL,
  getLibraryHref,
  getNewTabLinkProps,
  LIBRARIES,
} from '../data/libraries';
import type { LibColor } from '../types';

const fadeUp = keyframes`from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}`;

const SNIPPETS: Record<string, { filename: string; lang: 'tsx' | 'ts'; code: string }> = {
  formbridge: {
    filename: 'SignupForm.tsx',
    lang: 'tsx',
    code: `import { useFormBridge, field } from '@runilib/react-formbridge'

const { Form, fields } = useFormBridge({
  name:     field.text('Full name').required().trim(),
  email:    field.email('Email').required(),
  phone:    field.phone('Phone').defaultCountry('FR'),
  password: field.password('Password')
              .required()
              .withStrengthIndicator({ showRules: true }),
  terms:    field.checkbox('Accept terms').mustBeTrue(),
}, { validateOn: 'onTouched' })

return (
  <Form onSubmit={(values) => api.signup(values)}>
    <fields.name />
    <fields.email />
    <fields.phone />
    <fields.password />
    <fields.terms />
    <Form.Submit>Create account</Form.Submit>
  </Form>
)`,
  },
  walkit: {
    filename: 'App.tsx',
    lang: 'tsx',
    code: `import { WalkitProvider, WalkitStep, useWalkit } from '@runilib/react-walkit'

// 1. Wrap your app
<WalkitProvider
  animationType="spring"
>
  <App />
</WalkitProvider>

// 2. Tag any element
<WalkitStep
  id="search"
  sequence={1}
  title="Search anything"
  content="Find tasks, projects and teammates instantly."
  >
  <SearchBar />
</WalkitStep>

// 3. Start programmatically
const { start } = useWalkit()
<button onClick={start}>Take the tour →</button>`,
  },
  tooltip: {
    filename: 'Dashboard.tsx',
    lang: 'tsx',
    code: `import { Tooltip, TooltipContent } from '@runilib/react-walkit'

// Simple string
<Tooltip content="Archive this task" placement="top">
  <ArchiveButton />
</Tooltip>

// Rich content with actions
<Tooltip content={
  <TooltipContent
    title="Export data"
    description="Download your data as CSV or Excel."
    shortcut="⌘E"
    actions={[{ label: 'Learn more', href: '/docs/export' }]}
  />
} trigger={['hover', 'focus']}>
  <ExportButton />
</Tooltip>

// Spotlight mode — dim everything else
<Tooltip spotlight content="New feature!" visible={showAnnounce}>
  <NewFeatureButton />
</Tooltip>`,
  },
};

const FEATURE_ICONS = ['⚡', '🔀', '🔒', '♿', '📦', '🧩'];
const FEATURE_COLORS: LibColor[] = ['teal', 'blue', 'amber', 'purple', 'green', 'teal'];

export default function Home() {
  const { locale, t } = useApp();
  const [activeTab, setActiveTab] = useState<string>('formbridge');
  const snippet = SNIPPETS[activeTab];
  const docsEntryPath = WEBSITE_FEATURES.docs ? FORM_BRIDGE_DOCS_URL : '/libraries';
  const docsEntryLinkProps = getNewTabLinkProps(docsEntryPath);
  const seoUseCases =
    locale === 'fr'
      ? [
          {
            title: 'Form builder React & React Native',
            desc: 'Construis des formulaires schema-driven avec validation, champs typés, formulaires multi-étapes et composants partagés entre web et mobile grâce à react-formbridge.',
            href: FORM_BRIDGE_DOCS_URL,
            cta: 'Explorer react-formbridge',
          },
          {
            title: 'Validation et logique de formulaire TypeScript',
            desc: 'Décris ton formulaire une fois en TypeScript puis réutilise la même logique de validation, de state et de rendu sur React web et React Native.',
            href: FORM_BRIDGE_DOCS_URL,
            cta: 'Voir la doc formbridge',
          },
          {
            title: 'Product tours et onboarding utilisateurs',
            desc: 'Ajoute des guided tours, walkthroughs, spotlight overlays, étapes contextualisées et analytics produit avec react-walkit sur les deux plateformes.',
            href: '/libraries/walkit',
            cta: 'Explorer react-walkit',
          },
          {
            title: 'Tooltips et feature discovery',
            desc: 'Ajoute des tooltips accessibles, annonces de nouvelles fonctionnalités et aides contextuelles avec la même API React et React Native.',
            href: '/libraries/walkit',
            cta: 'Voir la doc walkit',
          },
        ]
      : [
          {
            title: 'React & React Native form builder',
            desc: 'Build schema-driven forms with validation, typed fields, multi-step flows and shared components for web and mobile with react-formbridge.',
            href: FORM_BRIDGE_DOCS_URL,
            cta: 'Explore react-formbridge',
          },
          {
            title: 'TypeScript form validation and shared UI logic',
            desc: 'Describe your form once in TypeScript, then reuse the same validation, state management and UI flow across React web and React Native.',
            href: FORM_BRIDGE_DOCS_URL,
            cta: 'Read the formbridge docs',
          },
          {
            title: 'Product tours and user onboarding',
            desc: 'Ship guided tours, walkthroughs, spotlight overlays, contextual steps and product analytics hooks with react-walkit on both platforms.',
            href: '/libraries/walkit',
            cta: 'Explore react-walkit',
          },
          {
            title: 'Tooltips and feature discovery',
            desc: 'Add accessible tooltips, feature announcements, contextual hints and spotlight callouts with one API for React and React Native.',
            href: '/libraries/walkit',
            cta: 'Read the walkit docs',
          },
        ];
  const faqItems =
    locale === 'fr'
      ? [
          {
            question:
              'Est-ce que RUNILIB fonctionne à la fois pour React web et React Native ?',
            answer:
              'Oui. RUNILIB est conçu comme un écosystème cross-platform avec une API TypeScript cohérente entre le web et le mobile, pour réutiliser patterns, logique métier et primitives UI sans maintenir deux implémentations séparées.',
          },
          {
            question:
              'Quelle librairie utiliser pour des product tours, walkthroughs et parcours onboarding ?',
            answer:
              'Utilise `@runilib/react-walkit`. Elle couvre les product tours, guided tours, spotlight overlays, feature discovery, tooltips et le pilotage programmatique sur React et React Native.',
          },
          {
            question:
              'Quelle librairie utiliser pour créer des formulaires schema-driven en TypeScript ?',
            answer:
              'Utilise `@runilib/react-formbridge`. Elle te permet de définir un schéma unique puis de générer les champs, la validation, le state, les étapes et différents patterns de formulaire pour le web et le mobile.',
          },
          {
            question:
              'RUNILIB est-il adapté à une design system ou à une base de code existante ?',
            answer:
              'Oui. Les librairies RUNILIB sont pensées pour être composables, tree-shakeable et faciles à intégrer dans une app React ou React Native déjà existante, avec des composants customisables et une intégration TypeScript propre.',
          },
        ]
      : [
          {
            question:
              'Does RUNILIB work for both React web and React Native applications?',
            answer:
              'Yes. RUNILIB is built as a cross-platform ecosystem with a shared TypeScript API for web and mobile, so teams can reuse patterns, business logic and UI primitives instead of maintaining two separate implementations.',
          },
          {
            question:
              'Which library should I use for product tours, walkthroughs and user onboarding?',
            answer:
              'Use `@runilib/react-walkit`. It covers product tours, guided tours, spotlight overlays, feature discovery, contextual onboarding and tooltips for both React and React Native.',
          },
          {
            question: 'Which library should I use for schema-driven forms in TypeScript?',
            answer:
              'Use `@runilib/react-formbridge`. It lets you define one schema and generate fields, validation, state, multi-step flows and reusable form patterns for React web and React Native.',
          },
          {
            question:
              'Can RUNILIB fit an existing design system or component architecture?',
            answer:
              'Yes. RUNILIB libraries are composable, tree-shakeable and designed to work inside existing React or React Native codebases with custom UI, theming and strong TypeScript ergonomics.',
          },
        ];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replaceAll('`', ''),
      },
    })),
  };
  const libraryListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'RUNILIB libraries',
    itemListElement: LIBRARIES.map((lib, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: lib.name,
      url: lib.docsUrl ?? `https://runilib.dev/libraries/${lib.id}`,
      description: lib.desc,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(libraryListSchema) }}
      />
      <Wrap>
        {/* ── HERO ── */}
        <HeroSection>
          <HeroBg />
          <HeroLeft>
            <HeroBadge>
              <Dot />
              {t.hero.badge}
            </HeroBadge>
            <HeroH1>
              {t.hero.title}
              <br />
              <TealText>{t.hero.titleAccent}</TealText>
            </HeroH1>
            <HeroSub>{t.hero.subtitle}</HeroSub>
            <HeroCTAs>
              <PrimaryBtn
                href={docsEntryPath}
                {...docsEntryLinkProps}
              >
                {t.hero.cta} <Arrow>→</Arrow>
              </PrimaryBtn>
              <SecondaryBtn href="/libraries">{t.hero.ctaSecondary}</SecondaryBtn>
            </HeroCTAs>
            <StatsRow>
              {[
                { val: '3', key: 'libs' },
                { val: '100%', key: 'ts' },
                { val: '2', key: 'platforms' },
                { val: '0', key: 'config' },
              ].map((s) => (
                <Stat key={s.key}>
                  <StatVal>{s.val}</StatVal>
                  <StatLabel>
                    {t.hero.stats[s.key as keyof typeof t.hero.stats]}
                  </StatLabel>
                </Stat>
              ))}
            </StatsRow>
          </HeroLeft>
        </HeroSection>

        {/* ── INSTALL STRIP ── */}
        {/* <InstallStrip>
        <StripInner>
          <StripLabel>{t.install.label}</StripLabel>
          <StripCmds>
            {(
              [
                'npm install @runilib/react-formbridge @runilib/react-walkit',
                'yarn add @runilib/react-formbridge @runilib/react-walkit',
                'pnpm add @runilib/react-formbridge @runilib/react-walkit',
              ] as const
            ).map((_cmd, i) => (
              <StripCmd key={i === 0 ? 'npm-install' : 'yarn-add'}>
                <Prompt>{i === 0 ? 'npm' : 'yarn'}</Prompt>
                <CmdText>
                  {i === 0 ? 'install' : 'add'} @runilib/react-formbridge
                  @runilib/react-walkit @runilib/tooltip
                </CmdText>
              </StripCmd>
            ))}
          </StripCmds>
        </StripInner>
      </InstallStrip> */}

        {/* ── FEATURES ── */}
        <Section>
          <SLabel>{t.features.label}</SLabel>
          <STitle>{t.features.title}</STitle>
          <SSub>{t.features.subtitle}</SSub>
          <FeatGrid>
            {t.features.items.map((item, i) => (
              <FeatCard
                key={item.title}
                $color={FEATURE_COLORS[i]}
              >
                <FeatIcon $color={FEATURE_COLORS[i]}>{FEATURE_ICONS[i]}</FeatIcon>
                <FeatTitle>{item.title}</FeatTitle>
                <FeatDesc>{item.desc}</FeatDesc>
              </FeatCard>
            ))}
          </FeatGrid>
        </Section>

        {/* ── LIBRARIES ── */}
        <Section>
          <SLabel>{t.libs.label}</SLabel>
          <STitle>{t.libs.title}</STitle>
          <SSub>{t.libs.subtitle}</SSub>
          <LibsGrid>
            {LIBRARIES.map((lib) => (
              <LibCard
                key={lib.id}
                href={getLibraryHref(lib)}
                {...getNewTabLinkProps(getLibraryHref(lib))}
              >
                <LibCardTop>
                  <LibCardIcon $color={lib.color}>{lib.icon}</LibCardIcon>
                  <LibCardMeta>
                    <LibCardName>{lib.name}</LibCardName>
                    <LibCardVersion>{lib.version}</LibCardVersion>
                  </LibCardMeta>
                  <StatusPill $status={lib.status}>
                    {lib.status === 'stable' ? t.libraryPage.stable : t.libraryPage.beta}
                  </StatusPill>
                </LibCardTop>
                <LibCardDesc>{lib.desc}</LibCardDesc>
                <LibCardTags>
                  {lib.tags.map((tag) => (
                    <LibTag key={tag}>{tag}</LibTag>
                  ))}
                </LibCardTags>
                <LibCardFeats>
                  {lib.highlights.slice(0, 4).map((h) => (
                    <LibFeat key={h}>
                      <Arrow2>→</Arrow2>
                      {h}
                    </LibFeat>
                  ))}
                </LibCardFeats>
                <LibCardCTA>{t.libs.docs} →</LibCardCTA>
              </LibCard>
            ))}
          </LibsGrid>
        </Section>

        {/* ── USE CASES ── */}
        <Section>
          <SLabel>{locale === 'fr' ? 'Cas d’usage' : 'Use cases'}</SLabel>
          <STitle>
            {locale === 'fr'
              ? 'Les cas d’usage React et React Native que les équipes livrent vraiment'
              : 'The React and React Native use cases teams actually ship'}
          </STitle>
          <SSub>
            {locale === 'fr'
              ? 'RUNILIB est pensé comme un écosystème cross-platform en expansion, avec des packages cohérents pour aider les équipes à livrer plus vite sur le web et le mobile.'
              : 'RUNILIB is designed as a growing cross-platform ecosystem, with consistent packages that help teams ship faster across web and mobile.'}
          </SSub>
          <UseCaseGrid>
            {seoUseCases.map((item) => (
              <UseCaseCard
                key={item.title}
                href={item.href}
                {...getNewTabLinkProps(item.href)}
              >
                <UseCaseTitle>{item.title}</UseCaseTitle>
                <UseCaseDesc>{item.desc}</UseCaseDesc>
                <UseCaseCTA>{item.cta} →</UseCaseCTA>
              </UseCaseCard>
            ))}
          </UseCaseGrid>
        </Section>

        {/* ── CODE DEMO ── */}
        <Section>
          <SLabel>{t.code.label}</SLabel>
          <STitle>{t.code.title}</STitle>
          <SSub>{t.code.subtitle}</SSub>
          <DemoWrap>
            <DemoTabs>
              {Object.keys(SNIPPETS).map((k) => (
                <DemoTab
                  key={k}
                  $active={activeTab === k}
                  onClick={() => setActiveTab(k)}
                >
                  {k}
                </DemoTab>
              ))}
            </DemoTabs>
            <CodeBlock
              code={snippet.code}
              lang={snippet.lang}
              filename={snippet.filename}
            />
          </DemoWrap>
        </Section>

        {/* ── FAQ ── */}
        <Section>
          <SLabel>FAQ</SLabel>
          <STitle>
            {locale === 'fr'
              ? 'Questions fréquentes sur les librairies React et React Native RUNILIB'
              : 'Common questions about RUNILIB React and React Native libraries'}
          </STitle>
          <SSub>
            {locale === 'fr'
              ? "Quelques réponses rapides aux questions que les équipes se posent avant d'adopter un écosystème cross-platform pour React et React Native."
              : 'Quick answers to the questions teams ask before adopting a cross-platform ecosystem for React and React Native.'}
          </SSub>
          <FaqGrid>
            {faqItems.map((item) => (
              <FaqCard key={item.question}>
                <FaqQuestion>{item.question}</FaqQuestion>
                <FaqAnswer>{item.answer.replaceAll('`', '')}</FaqAnswer>
              </FaqCard>
            ))}
          </FaqGrid>
        </Section>

        {/* ── QUOTE ── */}
        <QuoteSection>
          <QuoteInner>
            <QuoteMark>"</QuoteMark>
            <QuoteText>
              The best code is the code you don't have to write twice.
            </QuoteText>
            <QuoteBy>— RUNILIB founding principle</QuoteBy>
          </QuoteInner>
        </QuoteSection>

        {/* ── CTA ── */}
        <CTASection>
          <CTAGlow />
          <CTAContent>
            <CTATitle>{t.cta.title}</CTATitle>
            <CTADesc>{t.cta.desc}</CTADesc>
            <CTABtns>
              <PrimaryBtn
                href={docsEntryPath}
                {...docsEntryLinkProps}
              >
                {t.cta.primary} <Arrow>→</Arrow>
              </PrimaryBtn>
              <SecondaryAnchor
                href="https://github.com/runilib/runilib"
                target="_blank"
                rel="noopener"
              >
                {t.cta.secondary}
              </SecondaryAnchor>
            </CTABtns>
          </CTAContent>
        </CTASection>
      </Wrap>
    </>
  );
}

// ── Styled ─────────────────────────────────────────────────────
const Wrap = styled.div`padding-top: 64px;`;

const Section = styled.section`
  max-width: 1240px;
  margin: 0 auto;
  padding: 88px 24px;
`;
const SLabel = styled.div`
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.teal};
  margin-bottom: 14px;
`;
const STitle = styled.h2`
  font-family: 'Sora', sans-serif;
  font-size: clamp(26px, 4vw, 38px);
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
  letter-spacing: -0.5px;
  margin-bottom: 10px;
`;
const SSub = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.75;
  max-width: 520px;
  margin-bottom: 52px;
`;
const HeroSection = styled.section`
  min-height: calc(100vh - 64px);
  width: 100%;
  max-width: none;
  margin: 0 auto;
  padding: 72px 24px 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  @media (max-width: 900px) {
    min-height: auto;
    padding: 52px 24px 40px;
  }
`;
const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.gradientHero};
  pointer-events: none;
`;
const HeroLeft = styled.div`
  position: relative;
  z-index: 1;
  width: fit-content;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: ${fadeUp} 0.65s ease both;
`;
const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.teal};
  background: ${({ theme }) => theme.tealDim};
  border: 1px solid ${({ theme }) => theme.teal}33;
  border-radius: 20px;
  padding: 5px 14px;
  margin-bottom: 22px;
`;
const Dot = styled.div`
  width: 6px; height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.teal};
  animation: ${pulse} 2s ease-in-out infinite;
`;
const HeroH1 = styled.h1`
  font-family: 'Sora', sans-serif;
  font-size: clamp(38px, 5.5vw, 64px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -1.5px;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 20px;
`;
const TealText = styled.span`color: ${({ theme }) => theme.teal};`;
const HeroSub = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 17px;
  line-height: 1.78;
  color: ${({ theme }) => theme.textSecondary};
  max-width: 760px;
  margin-bottom: 34px;
`;
const HeroCTAs = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 44px;
`;
const Arrow = styled.span`
  transition: transform 0.2s;
  display: inline-block;
`;
const PrimaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 700;
  padding: 11px 22px;
  border-radius: 10px;
  text-decoration: none;
  background: ${({ theme }) => theme.teal};
  color: #080a0e;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px ${({ theme }) => theme.teal}50;
    ${Arrow} { transform: translateX(4px); }
  }
`;
const SecondaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 11px 22px;
  border-radius: 10px;
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textSecondary};
  background: transparent;
  transition: all 0.2s;
  &:hover {
    border-color: ${({ theme }) => theme.teal};
    color: ${({ theme }) => theme.teal};
    background: ${({ theme }) => theme.tealDim};
  }
`;
const SecondaryAnchor = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 11px 22px;
  border-radius: 10px;
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textSecondary};
  background: transparent;
  transition: all 0.2s;
  &:hover {
    border-color: ${({ theme }) => theme.teal};
    color: ${({ theme }) => theme.teal};
    background: ${({ theme }) => theme.tealDim};
  }
`;
const StatsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
  animation: ${fadeUp} 0.65s 0.15s ease both;
`;
const Stat = styled.div`display: flex; flex-direction: column; gap: 2px;`;
const StatVal = styled.div`
  font-family: 'Sora', sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.teal};
  line-height: 1;
`;
const StatLabel = styled.div`
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`;
// Feature grid
const FeatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  overflow: hidden;
  @media (max-width: 860px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;
const FeatCard = styled.div<{ $color: LibColor }>`
  background: ${({ theme }) => theme.bgCard};
  padding: 30px 26px;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.bgCardHover};
  }
`;
const FeatIcon = styled.div<{ $color: LibColor }>`
  font-size: 26px;
  width: 46px; height: 46px;
  border-radius: 12px;
  background: ${({ theme, $color }) => theme[`${$color}Dim` as keyof typeof theme]};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
`;
const FeatTitle = styled.h3`
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 7px;
`;
const FeatDesc = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  line-height: 1.7;
  color: ${({ theme }) => theme.textSecondary};
`;
// Library cards
const LibsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;
const LibCard = styled(Link)`
  background: ${({ theme }) => theme.bgCard};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-decoration: none;
  transition: all 0.22s;
  background-image: ${({ theme }) => theme.gradientCard};
  &:hover {
    transform: translateY(-3px);
    border-color: ${({ theme }) => theme.borderHover};
    box-shadow: ${({ theme }) => theme.shadowCard};
  }
`;
const LibCardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const LibCardIcon = styled.div<{ $color: LibColor }>`
  font-size: 26px;
  width: 46px; height: 46px;
  border-radius: 12px;
  background: ${({ theme, $color }) => theme[`${$color}Dim` as keyof typeof theme]};
  border: 1px solid ${({ theme, $color }) => `${theme[$color as keyof typeof theme]}33`};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
const LibCardMeta = styled.div`flex: 1; min-width: 0;`;
const LibCardName = styled.div`
  font-family: 'Sora', sans-serif;
  font-size: 17px;
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
`;
const LibCardVersion = styled.div`
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: ${({ theme }) => theme.textMuted};
`;
const StatusPill = styled.div<{ $status: string }>`
  font-family: 'DM Mono', monospace;
  font-size: 9.5px;
  padding: 2px 8px;
  border-radius: 20px;
  ${({ theme, $status }) =>
    $status === 'stable'
      ? `background:${theme.greenDim};color:${theme.green};border:1px solid ${theme.green}33;`
      : `background:${theme.amberDim};color:${theme.amber};border:1px solid ${theme.amber}33;`}
`;
const LibCardDesc = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  line-height: 1.7;
  color: ${({ theme }) => theme.textSecondary};
`;
const LibCardTags = styled.div`display: flex; flex-wrap: wrap; gap: 6px;`;
const LibTag = styled.span`
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.tealDim};
  color: ${({ theme }) => theme.teal};
  border: 1px solid ${({ theme }) => theme.teal}22;
`;
const LibCardFeats = styled.ul`
  list-style: none;
  padding: 0; margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const Arrow2 = styled.span`color: ${({ theme }) => theme.teal}; margin-right: 6px;`;
const LibFeat = styled.li`
  font-family: 'DM Mono', monospace;
  font-size: 11.5px;
  color: ${({ theme }) => theme.textSecondary};
`;
const LibCardCTA = styled.div`
  margin-top: auto;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.teal};
`;
const UseCaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;
const UseCaseCard = styled(Link)`
  background: ${({ theme }) => theme.bgCard};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-decoration: none;
  background-image: ${({ theme }) => theme.gradientCard};
  transition: all 0.2s;
  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.borderHover};
    box-shadow: ${({ theme }) => theme.shadowCard};
  }
`;
const UseCaseTitle = styled.h3`
  font-family: 'Sora', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
`;
const UseCaseDesc = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  line-height: 1.75;
  color: ${({ theme }) => theme.textSecondary};
`;
const UseCaseCTA = styled.span`
  margin-top: auto;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.teal};
`;
// Code demo
const DemoWrap = styled.div`
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.borderCode};
`;
const DemoTabs = styled.div`
  display: flex;
  background: #161b22;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  padding: 0 16px;
  overflow-x: auto;
`;
const DemoTab = styled.button<{ $active: boolean }>`
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  padding: 13px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-bottom: 2px solid ${({ theme, $active }) => ($active ? theme.teal : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.teal : '#8b949e')};
  white-space: nowrap;
  transition: all 0.15s;
  &:hover { color: #cdd9e5; }
`;
const FaqGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;
const FaqCard = styled.div`
  background: ${({ theme }) => theme.bgCard};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 24px;
  background-image: ${({ theme }) => theme.gradientCard};
`;
const FaqQuestion = styled.h3`
  font-family: 'Sora', sans-serif;
  font-size: 17px;
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
  line-height: 1.45;
  margin-bottom: 12px;
`;
const FaqAnswer = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  line-height: 1.8;
  color: ${({ theme }) => theme.textSecondary};
`;
// Quote
const QuoteSection = styled.section`
  background: ${({ theme }) => theme.bgSurface};
  border-top: 1px solid ${({ theme }) => theme.border};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 72px 24px;
  text-align: center;
`;
const QuoteInner = styled.div`
  max-width: 680px;
  margin: 0 auto;
  position: relative;
`;
const QuoteMark = styled.div`
  font-family: Georgia, serif;
  font-size: 100px;
  line-height: 0.5;
  color: ${({ theme }) => theme.teal};
  opacity: 0.15;
  position: absolute;
  top: 0; left: -20px;
`;
const QuoteText = styled.blockquote`
  font-family: 'Sora', sans-serif;
  font-size: clamp(18px, 3vw, 26px);
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
  line-height: 1.4;
  margin-bottom: 14px;
`;
const QuoteBy = styled.cite`
  font-family: 'DM Mono', monospace;
  font-size: 11.5px;
  color: ${({ theme }) => theme.teal};
  letter-spacing: 0.1em;
  display: block;
`;
// CTA
const CTASection = styled.section`
  position: relative;
  text-align: center;
  padding: 100px 24px;
  overflow: hidden;
`;
const CTAGlow = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.gradientHero};
  pointer-events: none;
`;
const CTAContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 560px;
  margin: 0 auto;
`;
const CTATitle = styled.h2`
  font-family: 'Sora', sans-serif;
  font-size: clamp(26px, 4vw, 42px);
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 14px;
  letter-spacing: -0.5px;
`;
const CTADesc = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 17px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.7;
  margin-bottom: 34px;
`;
const CTABtns = styled.div`
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
`;

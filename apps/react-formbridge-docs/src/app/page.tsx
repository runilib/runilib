/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD is required for FAQ and item list metadata */
'use client';

import { useCallback, useState } from 'react';

import { Playground } from '@/components/playground';
import { faqItems, homeFeatures, homeSnippets, libraryInfo, useCases } from '@/data/site';
import { getBuilderEntries, getDocsLandingHref, getFeaturedEntries } from '@/lib/docs';
import { absoluteUrl } from '@/lib/site';

import Link from 'next/link';
import styled, { css, keyframes } from 'styled-components';

const CORE_PRINCIPLES = [
  {
    description:
      'Map your schema directly to UI components so each field stays typed, validated, and consistent.',
    icon: 'schema',
    title: 'Schema-driven rendering',
  },
  {
    description:
      'Pass specialized props to web or native components through a single unified schema entry.',
    icon: 'platform',
    title: 'Platform-specific UI',
  },
  {
    description:
      'Built-in fluent validation covers every common rule. No need to install Zod, Yup, or any external library.',
    icon: 'validation',
    title: 'Batteries-included validation',
  },
  {
    description:
      'No provider is required for the default flow. Start from a schema and ship the form runtime directly.',
    icon: 'provider',
    title: 'Provider-free usage',
  },
];

const ENGINEERED_FOR = [
  {
    title: 'Dynamic Form Flows',
    desc: 'Show, hide, or rearrange fields based on user input with reactive conditional logic.',
  },
  {
    title: 'Complex Nested Objects',
    desc: 'Model deeply nested data structures and keep validation scoped to each level.',
  },
  {
    title: 'Dynamic Field Arrays',
    desc: 'Let users add or remove repeatable groups while the schema stays consistent.',
  },
  {
    title: 'High-perf Async Logic',
    desc: 'Debounced remote validation, async select options, and optimistic state updates.',
  },
];

const DOC_SUMMARY_OVERRIDES: Record<string, string> = {
  'fb-adapters': 'Optional bridge for teams already using Zod, Yup, Joi, or Valibot.',
  'fb-persistence': 'Automatically save and restore form progress across sessions.',
  'fb-quickstart': 'Bootstrap your first schema-driven form in minutes.',
  'fb-select': 'Configure remote dropdowns with async option loading.',
  'fb-use-form-bridge': 'Use the core hook for timing, state, and validation lifecycle.',
  'fb-wizard': 'Orchestrate multi-step flows with branching logic.',
};

function formatBuilderLabel(title: string) {
  return title.replace(/^field\./, '').replace(/\(\)$/, '');
}

function buildPlaygroundFiles(code: string, exportName: string) {
  return {
    '/App.tsx': {
      active: true,
      code: `${code}\n\nexport default ${exportName}\n`,
    },
  };
}

export default function HomePage() {
  const [activeSnippetIndex, setActiveSnippetIndex] = useState(0);
  const [installCopied, setInstallCopied] = useState(false);

  const docsHref = getDocsLandingHref();
  const featuredEntries = getFeaturedEntries();
  const builderEntries = getBuilderEntries();
  const activeSnippet = homeSnippets[activeSnippetIndex] ?? homeSnippets[0];
  const activePlaygroundFiles =
    activeSnippetIndex === 0
      ? buildPlaygroundFiles(activeSnippet.code, 'SignupForm')
      : buildPlaygroundFiles(activeSnippet.code, 'SignupScreen');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'react-formbridge documentation sections',
    itemListElement: featuredEntries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(entry.href),
      name: entry.title,
      description: DOC_SUMMARY_OVERRIDES[entry.id] ?? entry.summary,
    })),
  };

  const handleCopyInstall = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }

    navigator.clipboard.writeText(libraryInfo.installCommand).then(() => {
      setInstallCopied(true);
      globalThis.window.setTimeout(() => setInstallCopied(false), 1800);
    });
  }, []);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        type="application/ld+json"
      />

      <Main>
        <Shell>
          <HeroSection>
            <HeroIntroTitle>
              Build forms you&apos;ll <HeroIntroAccent>love shipping</HeroIntroAccent>
            </HeroIntroTitle>
            <HeroGrid>
              <HeroCopy>
                <HeroBadge>{libraryInfo.packageName}</HeroBadge>

                <HeroTitle>
                  Schema-first form layer for
                  <br />
                  <HeroAccent>React</HeroAccent> and
                  <br />
                  <HeroAccent>React Native.</HeroAccent>
                </HeroTitle>

                <HeroLead>
                  A headless architecture to manage form state, complex validation, and
                  conditional logic with a single source of truth for web and mobile.
                </HeroLead>

                <HeroActions>
                  <PrimaryButton href={docsHref}>Get Started</PrimaryButton>
                  <SecondaryAnchor
                    href={libraryInfo.githubUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ButtonGlyph aria-hidden="true">&lt;/&gt;</ButtonGlyph>
                    View on GitHub
                  </SecondaryAnchor>
                </HeroActions>

                <InstallBar>
                  <InstallCommand>{libraryInfo.installCommand}</InstallCommand>
                  <InstallCopyButton
                    aria-label="Copy install command"
                    onClick={handleCopyInstall}
                    type="button"
                    $copied={installCopied}
                  >
                    <ClipboardIcon aria-hidden="true" />
                  </InstallCopyButton>
                </InstallBar>
              </HeroCopy>

              <HeroVisual>
                <CodeCard>
                  <CodeTabs
                    aria-label="Hero code snippet tabs"
                    role="tablist"
                  >
                    {homeSnippets.map((snippet, index) => (
                      <CodeTab
                        aria-selected={index === activeSnippetIndex}
                        key={snippet.filename}
                        onClick={() => setActiveSnippetIndex(index)}
                        role="tab"
                        type="button"
                        $active={index === activeSnippetIndex}
                      >
                        {snippet.label}
                      </CodeTab>
                    ))}
                  </CodeTabs>
                  <Playground
                    activeFile="/App.tsx"
                    files={activePlaygroundFiles}
                    platform={activeSnippetIndex === 0 ? 'web' : 'native'}
                    snackName={activeSnippet.filename}
                  />
                </CodeCard>

                <SnippetBadge>
                  <SnippetBadgeIcon aria-hidden="true" />
                  <SnippetBadgeText>
                    <strong>{activeSnippet.label}</strong>
                    <span>
                      Same schema-first API, with a web form or a native screen around it.
                    </span>
                  </SnippetBadgeText>
                </SnippetBadge>
              </HeroVisual>
            </HeroGrid>
          </HeroSection>

          <Divider />
        </Shell>

        <Section>
          <Shell>
            <SectionHeading>
              <SectionTitle>Core Principles</SectionTitle>
              <SectionRule />
            </SectionHeading>

            <PrinciplesGrid>
              {CORE_PRINCIPLES.map((item) => (
                <PrincipleCard key={item.title}>
                  <PrincipleIcon $variant={item.icon} />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </PrincipleCard>
              ))}
            </PrinciplesGrid>
          </Shell>
        </Section>

        <Section $tinted>
          <Shell>
            <SectionHeading>
              <SectionTitle>What you get</SectionTitle>
              <SectionRule />
            </SectionHeading>

            <FeaturesGrid>
              {homeFeatures.map((item) => (
                <FeatureCard key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </FeatureCard>
              ))}
            </FeaturesGrid>
          </Shell>
        </Section>

        <Section>
          <Shell>
            <ArchitectureLayout>
              <div>
                <SectionHeading>
                  <SectionTitle>Headless Logic Architecture</SectionTitle>
                  <SectionRule />
                </SectionHeading>

                <SectionText>
                  FormBridge decouples the data model from the UI rendering layer. Write
                  your validation and business logic once, implement the visual layer
                  twice.
                </SectionText>

                <Checklist>
                  <li>
                    <ChecklistIcon aria-hidden="true" />
                    <div>
                      <strong>Total Portability</strong>
                      <span>
                        Move from Web to React Native without rewriting a single rule.
                      </span>
                    </div>
                  </li>
                  <li>
                    <ChecklistIcon aria-hidden="true" />
                    <div>
                      <strong>Deterministic State</strong>
                      <span>
                        Form state management behaves identically across environments.
                      </span>
                    </div>
                  </li>
                </Checklist>
              </div>

              <ArchitectureDiagram>
                <SurfaceNode>
                  <SurfaceGlyph />
                  <strong>WEB UI</strong>
                </SurfaceNode>
                <EngineNode>
                  <EngineCoreIcon aria-hidden="true" />
                  <strong>FORM ENGINE</strong>
                </EngineNode>
                <SurfaceNode>
                  <SurfaceGlyph $mobile />
                  <strong>NATIVE UI</strong>
                </SurfaceNode>
              </ArchitectureDiagram>
            </ArchitectureLayout>
          </Shell>
        </Section>

        <Section $tinted>
          <Shell>
            <SectionHeading>
              <SectionTitle>Get started in 3 steps</SectionTitle>
              <SectionRule />
            </SectionHeading>

            <QuickStartGrid>
              <QuickStartStep>
                <StepNumber>1</StepNumber>
                <div>
                  <h3>Install</h3>
                  <QuickStartCode>{libraryInfo.installCommand}</QuickStartCode>
                </div>
              </QuickStartStep>
              <QuickStartStep>
                <StepNumber>2</StepNumber>
                <div>
                  <h3>Define your schema</h3>
                  <p>
                    Describe every field, its type, validation rules, and default value in
                    a single TypeScript object.
                  </p>
                </div>
              </QuickStartStep>
              <QuickStartStep>
                <StepNumber>3</StepNumber>
                <div>
                  <h3>Render on any platform</h3>
                  <p>
                    Call <code>useFormBridge(schema)</code> and get a typed Form wrapper
                    plus ready-to-render field components for web or native.
                  </p>
                </div>
              </QuickStartStep>
            </QuickStartGrid>
          </Shell>
        </Section>

        <Section>
          <Shell>
            <UtilityGrid>
              <PanelCard>
                <PanelTitle>Primitive Field Builders</PanelTitle>
                <BuilderCloud>
                  {builderEntries.map((entry) => (
                    <BuilderChip
                      href={entry.href}
                      key={entry.id}
                    >
                      {formatBuilderLabel(entry.title)}
                    </BuilderChip>
                  ))}
                </BuilderCloud>
              </PanelCard>

              <PanelCard>
                <PanelTitle>Engineered for...</PanelTitle>
                <EngineeredList>
                  {ENGINEERED_FOR.map((item) => (
                    <EngineeredItem key={item.title}>
                      <UseCaseMarker aria-hidden="true" />
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.desc}</span>
                      </div>
                    </EngineeredItem>
                  ))}
                </EngineeredList>
              </PanelCard>
            </UtilityGrid>
          </Shell>
        </Section>

        <Section $tinted>
          <Shell>
            <SectionHeading>
              <SectionTitle>Built for real-world flows</SectionTitle>
              <SectionRule />
            </SectionHeading>

            <UseCasesGrid>
              {useCases.map((item) => (
                <UseCaseCard key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </UseCaseCard>
              ))}
            </UseCasesGrid>
          </Shell>
        </Section>

        <Section>
          <Shell>
            <SectionHeading>
              <SectionTitle>Popular Documentation Paths</SectionTitle>
              <SectionRule />
            </SectionHeading>

            <DocGrid>
              {featuredEntries.map((entry, index) => (
                <DocCard
                  href={entry.href}
                  key={entry.id}
                >
                  <DocIcon $index={index} />
                  <h3>{entry.title}</h3>
                  <p>{DOC_SUMMARY_OVERRIDES[entry.id] ?? entry.summary}</p>
                </DocCard>
              ))}
            </DocGrid>
          </Shell>
        </Section>

        <Section>
          <Shell>
            <CtaPanel>
              <CtaTitle>Ready to implement schema-driven forms?</CtaTitle>
              <CtaText>
                Stop duplicating validation logic. Build robust, type-safe forms that
                scale with your engineering team.
              </CtaText>

              <HeroActions $centered>
                <PrimaryButton href={docsHref}>Open documentation</PrimaryButton>
                <SecondaryAnchor
                  href={libraryInfo.githubUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  View source on GitHub
                </SecondaryAnchor>
              </HeroActions>

              <FaqGrid>
                {faqItems.map((item) => (
                  <FaqCard key={item.question}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </FaqCard>
                ))}
              </FaqGrid>
            </CtaPanel>
          </Shell>
        </Section>
      </Main>
    </>
  );
}

const Main = styled.main`
  padding: 24px 0 88px;

  @media (max-width: 720px) {
    padding: 16px 0 64px;
  }
`;

const Shell = styled.div.attrs({ className: 'shell' })``;

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
`;

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 800;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const cardBase = css`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
`;

const HeroSection = styled.section`
  width: 100%;
  padding: 28px 0 16px;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;
`;

const HeroIntroTitle = styled.h1`
  width: fit-content;
  max-width: 100%;
  margin: 0;
  justify-self: center;
  text-align: center;
  color: ${({ theme }) => theme.text};
  font-size: clamp(2.3rem, 4vw, 4rem);
  font-weight: 800;
  line-height: 0.96;
  letter-spacing: -0.04em;
  white-space: nowrap;

  @media (max-width: 980px) {
    font-size: clamp(2rem, 5vw, 3rem);
  }

  @media (max-width: 640px) {
    max-width: 9.5ch;
    white-space: normal;
    text-wrap: balance;
    font-size: clamp(1.9rem, 10vw, 2.7rem);
  }
`;

const HeroIntroAccent = styled.span`
  color: ${({ theme }) => theme.accent};
`;

const HeroGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  gap: 40px;
  align-items: center;
  min-height: min(640px, calc(100vh - 170px));
  animation: ${fadeUp} 0.55s ease both;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 28px;
    min-height: auto;
  }
`;

const HeroCopy = styled.div`
  min-width: 0;

  @media (max-width: 980px) {
    text-align: center;
  }
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.borderStrong};
  background: ${({ theme }) => theme.accentSoft};
  color: ${({ theme }) => theme.accent};
  font-size: 11px;
  font-weight: 700;
`;

const HeroTitle = styled.h1`
  margin: 18px 0 0;
  color: ${({ theme }) => theme.text};
  font-size: clamp(3rem, 4vw, 4.85rem);
  font-weight: 800;
  line-height: 0.94;

  @media (max-width: 640px) {
    max-width: 12ch;
    font-size: clamp(2.5rem, 13vw, 3.6rem);
  }
`;

const HeroAccent = styled.span`
  color: ${({ theme }) => theme.accent};
`;

const HeroLead = styled.p`
  max-width: 46ch;
  margin: 18px 0 0;
  color: ${({ theme }) => theme.textSoft};
  font-size: 1rem;
  line-height: 1.75;
`;

const HeroActions = styled.div<{ $centered?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: ${({ $centered }) => ($centered ? 'center' : 'flex-start')};
  margin-top: 28px;

  @media (max-width: 980px) {
    justify-content: center;
  }

  @media (max-width: 640px) {
    gap: 10px;
    margin-top: 24px;
  }
`;

const PrimaryButton = styled(Link)`
  ${buttonBase};
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => (theme.mode === 'light' ? '#ffffff' : '#08111a')};
  box-shadow: 0 12px 24px rgba(15, 111, 220, 0.18);

  &:hover {
    background: ${({ theme }) => theme.accentStrong};
  }
`;

const SecondaryAnchor = styled.a`
  ${buttonBase};
  border: 1px solid ${({ theme }) => theme.borderStrong};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};

  &:hover {
    border-color: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accent};
  }
`;

const ButtonGlyph = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  color: ${({ theme }) => theme.textMuted};
  font-family:
    'SFMono-Regular',
    ui-monospace,
    Menlo,
    Monaco,
    Consolas,
    monospace;
  font-size: 12px;
  font-weight: 700;
`;

const InstallBar = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
  max-width: 100%;
  margin-top: 24px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.borderStrong};
  background: ${({ theme }) => theme.surface};

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const InstallCommand = styled.code`
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
  overflow-wrap: anywhere;
`;

const InstallCopyButton = styled.button<{ $copied: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme, $copied }) => ($copied ? theme.accentSoft : theme.surfaceSoft)};
  color: ${({ theme, $copied }) => ($copied ? theme.accent : theme.textMuted)};
  cursor: pointer;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accent};
  }
`;

const ClipboardIcon = styled.span`
  position: relative;
  width: 12px;
  height: 12px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border: 1.5px solid currentColor;
    border-radius: 3px;
  }

  &::before {
    inset: 2px 0 0 2px;
    background: transparent;
  }

  &::after {
    inset: 0 2px 2px 0;
    background: transparent;
  }
`;

const HeroVisual = styled.div`
  position: relative;
  min-width: 0;
  width: min(100%, 760px);
  justify-self: end;
  padding: 18px 0 32px;

  @media (max-width: 980px) {
    width: 100%;
    justify-self: stretch;
    padding-bottom: 12px;
  }
`;

const CodeCard = styled.div`
  ${cardBase};
  width: 100%;
  overflow: hidden;
`;

const CodeTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 14px 14px 0;
`;

const CodeTab = styled.button<{ $active: boolean }>`
  padding: 0 10px 10px;
  border: 0;
  border-bottom: 2px solid
    ${({ theme, $active }) => ($active ? theme.accent : 'transparent')};
  background: transparent;
  color: ${({ theme, $active }) => ($active ? theme.accent : theme.textMuted)};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

const SnippetBadge = styled.div`
  ${cardBase};
  position: absolute;
  left: 22px;
  bottom: 25;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  animation: ${float} 3s ease-in-out infinite;

  @media (max-width: 980px) {
    position: relative;
    left: 0;
    margin-top: 14px;
  }
`;

const SnippetBadgeIcon = styled.span`
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ theme }) => theme.accent};
  box-shadow: 0 10px 22px rgba(15, 111, 220, 0.24);

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.9);
  }

  &::before {
    inset: 9px 15px;
  }

  &::after {
    inset: 15px 9px;
  }
`;

const SnippetBadgeText = styled.div`
  display: grid;
  gap: 2px;

  strong {
    color: ${({ theme }) => theme.text};
    font-size: 13px;
  }

  span {
    color: ${({ theme }) => theme.textMuted};
    font-size: 12px;
  }
`;

const Divider = styled.div`
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const Section = styled.section<{ $tinted?: boolean }>`
  padding: 64px 0 0;
  background: ${({ theme, $tinted }) => ($tinted ? theme.sectionTint : 'transparent')};

  @media (max-width: 720px) {
    padding-top: 52px;
  }
`;

const SectionHeading = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.text};
  font-size: clamp(1.7rem, 3vw, 2.3rem);
  font-weight: 800;
`;

const SectionRule = styled.div`
  width: 36px;
  height: 3px;
  margin-top: 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.accent};
`;

const SectionText = styled.p`
  max-width: 50ch;
  margin: 0;
  color: ${({ theme }) => theme.textSoft};
  line-height: 1.8;
`;

const PrinciplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1040px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const PrincipleCard = styled.article`
  ${cardBase};
  padding: 24px 22px 22px;

  h3 {
    margin: 18px 0 10px;
    color: ${({ theme }) => theme.text};
    font-size: 1.02rem;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.textSoft};
    line-height: 1.72;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.article`
  ${cardBase};
  padding: 24px 22px 22px;

  h3 {
    margin: 0 0 10px;
    color: ${({ theme }) => theme.text};
    font-size: 1.02rem;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.textSoft};
    line-height: 1.72;
  }
`;

const UseCasesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const UseCaseCard = styled.article`
  ${cardBase};
  padding: 24px 22px 22px;

  h3 {
    margin: 0 0 10px;
    color: ${({ theme }) => theme.text};
    font-size: 1.02rem;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.textSoft};
    line-height: 1.72;
  }
`;

const PrincipleIcon = styled.span<{ $variant: string }>`
  position: relative;
  display: inline-flex;
  width: 26px;
  height: 26px;
  color: ${({ theme }) => theme.accent};

  &::before,
  &::after {
    content: '';
    position: absolute;
  }

  ${({ $variant }) =>
    $variant === 'schema'
      ? css`
          &::before {
            inset: 4px;
            border: 2px solid currentColor;
            border-radius: 6px;
          }

          &::after {
            inset: 11px 4px 11px 4px;
            background: currentColor;
          }
        `
      : null}

  ${({ $variant }) =>
    $variant === 'platform'
      ? css`
          &::before {
            inset: 5px 4px 12px;
            border: 2px solid currentColor;
            border-radius: 4px;
          }

          &::after {
            inset: 15px 7px 5px 7px;
            border: 2px solid currentColor;
            border-radius: 4px;
          }
        `
      : null}

  ${({ $variant }) =>
    $variant === 'validation'
      ? css`
          &::before {
            left: 4px;
            top: 3px;
            width: 18px;
            height: 20px;
            border-radius: 9px 9px 6px 6px;
            background: currentColor;
            clip-path: polygon(50% 0%, 100% 18%, 100% 58%, 50% 100%, 0% 58%, 0% 18%);
          }

          &::after {
            left: 10px;
            top: 9px;
            width: 6px;
            height: 10px;
            border-right: 2px solid #fff;
            border-bottom: 2px solid #fff;
            transform: rotate(40deg);
          }
        `
      : null}

  ${({ $variant }) =>
    $variant === 'provider'
      ? css`
          &::before {
            inset: 11px 3px;
            background: currentColor;
          }

          &::after {
            inset: 3px 11px;
            background: currentColor;
          }
        `
      : null}
`;

const ArchitectureLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 36px;
  align-items: center;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Checklist = styled.ul`
  display: grid;
  gap: 18px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;

  li {
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr);
    gap: 12px;
    align-items: start;
  }

  strong {
    display: block;
    color: ${({ theme }) => theme.text};
    font-size: 0.98rem;
  }

  span {
    display: block;
    margin-top: 4px;
    color: ${({ theme }) => theme.textSoft};
    line-height: 1.68;
  }
`;

const ChecklistIcon = styled.span`
  position: relative;
  width: 22px;
  height: 22px;
  margin-top: 2px;
  border-radius: 50%;
  background: ${({ theme }) => theme.accentSoft};
  border: 1px solid ${({ theme }) => theme.borderStrong};

  &::after {
    content: '';
    position: absolute;
    left: 7px;
    top: 4px;
    width: 5px;
    height: 9px;
    border-right: 2px solid ${({ theme }) => theme.accent};
    border-bottom: 2px solid ${({ theme }) => theme.accent};
    transform: rotate(40deg);
  }
`;

const ArchitectureDiagram = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 22px;
  align-items: center;
  min-height: 220px;

  &::before {
    content: '';
    position: absolute;
    left: 80px;
    right: 80px;
    top: 50%;
    height: 2px;
    background: ${({ theme }) => theme.borderStrong};
    transform: translateY(-50%);
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    justify-items: center;
    min-height: auto;
    padding: 12px 0;

    &::before {
      left: 50%;
      right: auto;
      top: 52px;
      bottom: 52px;
      width: 2px;
      height: auto;
      transform: translateX(-50%);
    }
  }
`;

const SurfaceNode = styled.div`
  ${cardBase};
  position: relative;
  z-index: 1;
  justify-self: center;
  display: grid;
  justify-items: center;
  gap: 12px;
  width: min(150px, 100%);
  padding: 18px 12px;
  box-shadow: 0 18px 34px rgba(20, 42, 72, 0.08);

  strong {
    color: ${({ theme }) => theme.textMuted};
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.14em;
  }
`;

const SurfaceGlyph = styled.span<{ $mobile?: boolean }>`
  position: relative;
  display: block;
  width: ${({ $mobile }) => ($mobile ? '14px' : '24px')};
  height: ${({ $mobile }) => ($mobile ? '22px' : '18px')};
  border: 2px solid ${({ theme }) => theme.text};
  border-radius: 4px;

  &::after {
    content: '';
    position: absolute;
    left: ${({ $mobile }) => ($mobile ? '3px' : '7px')};
    right: ${({ $mobile }) => ($mobile ? '3px' : '7px')};
    bottom: ${({ $mobile }) => ($mobile ? '3px' : '-5px')};
    height: 2px;
    background: ${({ theme }) => theme.text};
  }
`;

const EngineNode = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 10px;
  width: 138px;
  height: 138px;
  padding: 28px 16px;
  border-radius: 50%;
  background: ${({ theme }) => theme.accent};
  color: #ffffff;
  box-shadow: 0 28px 46px rgba(15, 111, 220, 0.26);

  strong {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.12em;
  }
`;

const EngineCoreIcon = styled.span`
  position: relative;
  width: 38px;
  height: 38px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
  }

  &::before {
    background:
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.98) 0 3px, transparent 4px),
      radial-gradient(circle at 50% 4px, rgba(255, 255, 255, 0.92) 0 3px, transparent 4px),
      radial-gradient(circle at calc(100% - 6px) 12px, rgba(255, 255, 255, 0.92) 0 3px, transparent 4px),
      radial-gradient(circle at calc(100% - 6px) calc(100% - 12px), rgba(255, 255, 255, 0.92) 0 3px, transparent 4px),
      radial-gradient(circle at 50% calc(100% - 4px), rgba(255, 255, 255, 0.92) 0 3px, transparent 4px),
      radial-gradient(circle at 6px calc(100% - 12px), rgba(255, 255, 255, 0.92) 0 3px, transparent 4px),
      radial-gradient(circle at 6px 12px, rgba(255, 255, 255, 0.92) 0 3px, transparent 4px);
  }

  &::after {
    inset: 7px;
    border: 1.5px solid rgba(255, 255, 255, 0.7);
    border-radius: 50%;
  }
`;

const UtilityGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 18px;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;

const PanelCard = styled.section`
  ${cardBase};
  padding: 24px;
`;

const PanelTitle = styled.h2`
  margin: 0 0 18px;
  color: ${({ theme }) => theme.text};
  font-size: 1.15rem;
  font-weight: 800;
`;

const BuilderCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const BuilderChip = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.borderStrong};
  background: ${({ theme }) => theme.accentSoft};
  color: ${({ theme }) => theme.accent};
  font-size: 12px;
  font-weight: 700;
  transition:
    border-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.accent};
    transform: translateY(-1px);
  }
`;

const EngineeredList = styled.div`
  display: grid;
  gap: 14px;
`;

const EngineeredItem = styled.div`
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr);
  align-items: start;
  gap: 12px;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceSoft};

  strong {
    display: block;
    color: ${({ theme }) => theme.text};
    font-size: 13px;
  }

  span {
    display: block;
    margin-top: 4px;
    color: ${({ theme }) => theme.textSoft};
    font-size: 12.5px;
    line-height: 1.6;
  }
`;

const QuickStartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;

const QuickStartStep = styled.article`
  ${cardBase};
  display: flex;
  gap: 16px;
  padding: 24px 22px;

  h3 {
    margin: 0 0 8px;
    color: ${({ theme }) => theme.text};
    font-size: 1.02rem;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.textSoft};
    line-height: 1.72;
    font-size: 13.5px;
  }

  code {
    font-size: 12.5px;
    padding: 2px 6px;
    border-radius: 4px;
    background: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.accent};
    font-weight: 700;
  }
`;

const StepNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => (theme.mode === 'light' ? '#ffffff' : '#08111a')};
  font-size: 14px;
  font-weight: 800;
`;

const QuickStartCode = styled.code`
  display: block;
  margin-top: 2px;
  font-size: 12.5px;
  color: ${({ theme }) => theme.textSoft};
  word-break: break-all;
`;

const UseCaseMarker = styled.span`
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: ${({ theme }) => theme.accent};
  box-shadow: 8px 0 0 -4px ${({ theme }) => theme.accentSoft};
`;

const DocGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DocCard = styled(Link)`
  ${cardBase};
  display: grid;
  gap: 12px;
  padding: 22px;
  transition:
    border-color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.accent};
    transform: translateY(-2px);
    box-shadow: 0 20px 36px rgba(20, 42, 72, 0.1);
  }

  h3 {
    color: ${({ theme }) => theme.text};
    font-size: 1rem;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.textSoft};
    line-height: 1.72;
  }
`;

const DocIcon = styled.span<{ $index: number }>`
  position: relative;
  display: inline-flex;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${({ theme }) => theme.accentSoft};
  color: ${({ theme }) => theme.accent};

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: currentColor;
  }

  ${({ $index }) =>
    $index % 3 === 0
      ? css`
          &::before {
            left: 7px;
            right: 7px;
            top: 13px;
            height: 2px;
          }

          &::after {
            left: 13px;
            top: 7px;
            bottom: 7px;
            width: 2px;
          }
        `
      : null}

  ${({ $index }) =>
    $index % 3 === 1
      ? css`
          &::before {
            left: 7px;
            right: 7px;
            top: 8px;
            height: 2px;
            box-shadow: 0 6px 0 0 currentColor;
          }

          &::after {
            left: 7px;
            top: 8px;
            bottom: 8px;
            width: 2px;
            box-shadow: 6px 0 0 0 currentColor;
          }
        `
      : null}

  ${({ $index }) =>
    $index % 3 === 2
      ? css`
          &::before {
            inset: 7px;
            border: 2px solid currentColor;
            border-radius: 50%;
            background: transparent;
          }

          &::after {
            right: 6px;
            bottom: 6px;
            width: 7px;
            height: 2px;
            transform: rotate(45deg);
            transform-origin: right center;
          }
        `
      : null}
`;

const CtaPanel = styled.div`
  ${cardBase};
  padding: 42px 32px 28px;
  text-align: center;

  @media (max-width: 640px) {
    padding: 32px 20px 20px;
  }
`;

const CtaTitle = styled.h2`
  color: ${({ theme }) => theme.text};
  font-size: clamp(2rem, 3vw, 2.8rem);
  font-weight: 800;
`;

const CtaText = styled.p`
  max-width: 56ch;
  margin: 14px auto 0;
  color: ${({ theme }) => theme.textSoft};
  line-height: 1.8;
`;

const FaqGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  max-width: 880px;
  margin: 28px auto 0;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FaqCard = styled.article`
  padding: 18px 20px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceSoft};
  text-align: left;

  h3 {
    margin: 0 0 10px;
    color: ${({ theme }) => theme.text};
    font-size: 0.98rem;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.textSoft};
    line-height: 1.72;
  }
`;

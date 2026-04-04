'use client';

import { useState } from 'react';

import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import { CodeBlock } from '../components/CodeBlock';
import { LogoIcon } from '../components/Logo';
import { WEBSITE_FEATURES } from '../config/features';
import { useApp } from '../context/AppContext';
import { LIBRARIES } from '../data/libraries';
import type { LibColor } from '../types';

const fadeUp = keyframes`from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}`;
const floatY = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}`;
const spinCW = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const spinCCW = keyframes`from{transform:rotate(0deg)}to{transform:rotate(-360deg)}`;

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
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<string>('formbridge');
  const snippet = SNIPPETS[activeTab];
  const docsEntryPath = WEBSITE_FEATURES.docs ? '/docs' : '/libraries';

  return (
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
            <PrimaryBtn href={docsEntryPath}>
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
                <StatLabel>{t.hero.stats[s.key as keyof typeof t.hero.stats]}</StatLabel>
              </Stat>
            ))}
          </StatsRow>
        </HeroLeft>

        <HeroRight>
          <OrbitalScene>
            <Ring
              size={420}
              dur="44s"
            />
            <Ring
              size={310}
              dur="30s"
              rev
            />
            <Ring
              size={210}
              dur="18s"
            />
            <OrbCenter>
              <FloatBox>
                <LogoIcon
                  size={84}
                  animated
                />
              </FloatBox>
            </OrbCenter>
            <LibOrb
              pos={{ top: '0', left: '50%', transform: 'translateX(-50%)' }}
              color="blue"
            >
              @runilib/react-formbridge
            </LibOrb>
            <LibOrb
              pos={{ bottom: '2%', left: '30%' }}
              color="amber"
            >
              @runilib/react-walkit
            </LibOrb>
          </OrbitalScene>
        </HeroRight>
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
              href={`/libraries/${lib.id}`}
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

      {/* ── QUOTE ── */}
      <QuoteSection>
        <QuoteInner>
          <QuoteMark>"</QuoteMark>
          <QuoteText>The best code is the code you don't have to write twice.</QuoteText>
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
            <PrimaryBtn href={docsEntryPath}>
              {t.cta.primary} <Arrow>→</Arrow>
            </PrimaryBtn>
            <SecondaryAnchor
              href="https://github.com/runilib"
              target="_blank"
              rel="noopener"
            >
              {t.cta.secondary}
            </SecondaryAnchor>
          </CTABtns>
        </CTAContent>
      </CTASection>
    </Wrap>
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
  max-width: 1240px;
  margin: 0 auto;
  padding: 72px 24px 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 32px;
  position: relative;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
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
  max-width: 480px;
  margin-bottom: 34px;
`;
const HeroCTAs = styled.div`
  display: flex;
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
// Hero right orbital
const HeroRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  animation: ${fadeUp} 0.65s 0.08s ease both;
  @media (max-width: 900px) { display: none; }
`;
const OrbitalScene = styled.div`
  position: relative;
  width: 440px; height: 440px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Ring = styled.div<{ size: number; dur: string; rev?: boolean }>`
  position: absolute;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  border: 1px dashed ${({ theme }) => theme.teal};
  opacity: 0.12;
  animation: ${({ rev }) => (rev ? spinCCW : spinCW)} ${({ dur }) => dur} linear infinite;
`;
const OrbCenter = styled.div`
  position: relative;
  z-index: 10;
`;
const FloatBox = styled.div`animation: ${floatY} 4s ease-in-out infinite;`;
const LibOrb = styled.div<{ pos: Record<string, string>; color: LibColor }>`
  position: absolute;
  ${({ pos }) =>
    Object.entries(pos)
      .map(([k, v]) => `${k}:${v};`)
      .join('')}
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  padding: 6px 13px;
  border-radius: 20px;
  background: ${({ theme, color }) => theme[`${color}Dim` as keyof typeof theme]};
  border: 1px solid ${({ theme, color }) => `${theme[color as keyof typeof theme]}55`};
  color: ${({ theme, color }) => theme[color as keyof typeof theme]};
  white-space: nowrap;
  letter-spacing: 0.04em;
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

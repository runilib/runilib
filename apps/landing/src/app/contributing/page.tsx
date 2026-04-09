'use client';

import styled, { css, keyframes } from 'styled-components';
import { CodeBlock } from '../../components/CodeBlock';
import { useApp } from '../../context/AppContext';
import { useGitHubIssues } from '../../hooks/useGitHubIssues';

// ── Animations ─────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const pulse = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.1); }
`;
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;
const checkPop = keyframes`
  0%   { transform: scale(0) rotate(-12deg); opacity: 0; }
  60%  { transform: scale(1.2) rotate(4deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg);  opacity: 1; }
`;

// ── Setup code snippets ─────────────────────────────────────────────────────

const SETUP_CODE = `# 1. Install yarn globally if you don't have it
npm install -g yarn

# 2. Fork RUNILIB on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/runilib.git
cd runilib

# 3. Install all workspace dependencies
yarn install

# 4. Start everything in dev mode (Turborepo)
yarn run dev

# Each package individually
cd packages/react-formbridge && yarn run dev
cd packages/react-walkit && yarn run dev
`;

const QUALITY_CODE = `# Type check the entire monorepo
yarn run typecheck

# Run all tests (web + native)
yarn run test

# Lint
yarn run lint or yarn run lint:fix

# Run everything at once before pushing
yarn run typecheck && yarn run lint:fix && yarn run test`;

const COMMIT_CODE = `# ✅ Good commit messages
feat(formbridge): add field.phone() with country selector
fix(walkit): prevent tour from crashing on unmounted steps
docs(tooltip): add spotlight mode example to README
refactor(formbridge): extract validation engine to separate module
test(walkit): add multi-screen tour persistence tests
chore: update dependencies to latest patch versions

# ❌ Bad commit messages
git commit -m "fix"
git commit -m "WIP"
git commit -m "changes"
git commit -m "Update stuff"`;

const BRANCH_CODE = `# Always branch from main
git checkout main
git pull origin main

# Use descriptive branch names
git checkout -b feat/formbridge-valibot-resolver
git checkout -b fix/walkit-ios-scroll-crash
git checkout -b docs/contributing-guide
git checkout -b chore/update-styled-components-v6`;

// ── TAG color mapping ───────────────────────────────────────────────────────

const TAG_COLORS: Record<string, string> = {
  'good first issue': 'green',
  'help wanted': 'blue',
  docs: 'purple',
};

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Contributing() {
  const { t } = useApp();
  const c = t.contributing;

  const fallbackIssues = c.goodFirstIssues.items.map((item) => ({
    ...item,
    url: 'https://github.com/runilib/runilib/issues',
  }));

  const { issues, loading } = useGitHubIssues({
    repo: 'runilib/runilib',
    labels: ['good first issue', 'help wanted', 'docs'],
    perPage: 6,
    fallback: fallbackIssues,
  });

  return (
    <PageWrap>
      {/* ── HERO ── */}
      <HeroSection>
        <HeroGlow />
        <HeroInner>
          <HeroLeft>
            <SectionLabel>{c.hero.label}</SectionLabel>
            <HeroTitle>{c.hero.title}</HeroTitle>
            <HeroSub>{c.hero.subtitle}</HeroSub>
            <HeroCTAs>
              <PrimaryAnchor
                href="https://github.com/runilib/runilib/issues?q=is%3Aopen+label%3A%22good+first+issue%22"
                target="_blank"
                rel="noopener"
              >
                <GithubIcon /> {c.cta.primary}
              </PrimaryAnchor>
              <SecondaryAnchor
                href="https://github.com/runilib/runilib/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener"
              >
                {c.cta.secondary}
              </SecondaryAnchor>
            </HeroCTAs>
          </HeroLeft>
          <HeroRight>
            <HeroStat>
              <StatNum>2</StatNum>
              <StatLbl>Available Libraries</StatLbl>
            </HeroStat>
            <HeroStat>
              <StatNum>MIT</StatNum>
              <StatLbl>License</StatLbl>
            </HeroStat>
            <HeroStat>
              <StatNum>∞</StatNum>
              <StatLbl>PRs welcome</StatLbl>
            </HeroStat>
          </HeroRight>
        </HeroInner>
      </HeroSection>

      {/* ── WHY CONTRIBUTE ── */}
      <Section>
        <SectionLabel>{c.whyContribute.label}</SectionLabel>
        <SectionTitle>{c.whyContribute.title}</SectionTitle>
        <WhyGrid>
          {c.whyContribute.items.map((item, i) => (
            <WhyCard
              key={i.toString()}
              $delay={i * 80}
            >
              <WhyEmoji>{['🚀', '🏆', '🧠', '🔍', '🤝', '⭐'][i]}</WhyEmoji>
              <WhyTitle>{item.title}</WhyTitle>
              <WhyDesc>{item.desc}</WhyDesc>
            </WhyCard>
          ))}
        </WhyGrid>
      </Section>

      {/* ── STEP BY STEP ── */}
      <StepsSection>
        <StepsInner>
          <SectionLabel>{c.steps.label}</SectionLabel>
          <SectionTitle>{c.steps.title}</SectionTitle>

          <StepsList>
            {c.steps.items.map((step, i) => (
              <StepRow key={i.toString()}>
                {/* Step number + connector */}
                <StepLeft>
                  <StepNum>{step.step}</StepNum>
                  {i < c.steps.items.length - 1 && <StepConnector />}
                </StepLeft>

                {/* Content */}
                <StepContent $last={i === c.steps.items.length - 1}>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDesc>{step.desc}</StepDesc>
                  {step.note && (
                    <StepNote>
                      <NoteIcon>💡</NoteIcon>
                      {step.note}
                    </StepNote>
                  )}

                  {/* Inline code for specific steps */}
                  {i === 1 && (
                    <StepCodeWrap>
                      <CodeBlock
                        code={BRANCH_CODE}
                        lang="bash"
                        filename="terminal"
                        showLines={false}
                        maxHeight="280px"
                      />
                    </StepCodeWrap>
                  )}
                  {i === 2 && (
                    <StepCodeWrap>
                      <CodeBlock
                        code={SETUP_CODE}
                        lang="bash"
                        filename="terminal"
                        showLines={false}
                        maxHeight="320px"
                      />
                    </StepCodeWrap>
                  )}
                  {i === 4 && (
                    <StepCodeWrap>
                      <CodeBlock
                        code={QUALITY_CODE}
                        lang="bash"
                        filename="terminal"
                        showLines={false}
                        maxHeight="220px"
                      />
                    </StepCodeWrap>
                  )}
                </StepContent>
              </StepRow>
            ))}
          </StepsList>
        </StepsInner>
      </StepsSection>

      {/* ── CODE STYLE ── */}
      <Section>
        <SectionLabel>{c.codeStyle.label}</SectionLabel>
        <SectionTitle>{c.codeStyle.title}</SectionTitle>
        <StyleGrid>
          {c.codeStyle.rules.map((rule, i) => (
            <StyleCard key={i.toString()}>
              <StyleCardTop>
                <StyleNum>{String(i + 1).padStart(2, '0')}</StyleNum>
                <StyleTitle>{rule.title}</StyleTitle>
              </StyleCardTop>
              <StyleDesc>{rule.desc}</StyleDesc>
            </StyleCard>
          ))}
        </StyleGrid>

        <CommitSection>
          <CommitTitle>Commit message format</CommitTitle>
          <CodeBlock
            code={COMMIT_CODE}
            lang="bash"
            filename="git commits"
            showLines={false}
            maxHeight="360px"
          />
        </CommitSection>
      </Section>

      {/* ── PR CHECKLIST ── */}
      <ChecklistSection>
        <ChecklistInner>
          <SectionLabel>{c.prChecklist.label}</SectionLabel>
          <SectionTitle>{c.prChecklist.title}</SectionTitle>
          <ChecklistNote>
            Run through this list before opening your PR. Every item should be checked.
          </ChecklistNote>
          <ChecklistGrid>
            {c.prChecklist.items.map((item, i) => (
              <ChecklistItem key={i.toString()}>
                <CheckBox>
                  <CheckMark>✓</CheckMark>
                </CheckBox>
                <CheckText>{item}</CheckText>
              </ChecklistItem>
            ))}
          </ChecklistGrid>
        </ChecklistInner>
      </ChecklistSection>

      {/* ── GOOD FIRST ISSUES ── */}
      <Section>
        <SectionLabel>{c.goodFirstIssues.label}</SectionLabel>
        <SectionTitle>{c.goodFirstIssues.title}</SectionTitle>
        <SectionSub>{c.goodFirstIssues.subtitle}</SectionSub>

        <IssuesGrid>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <IssueCardPlaceholder key={i.toString()} />
              ))
            : issues.map((issue, i) => (
                <IssueCard
                  key={i.toString()}
                  href={issue.url}
                  target="_blank"
                  rel="noopener"
                >
                  <IssueTop>
                    <IssueTag $color={TAG_COLORS[issue.tag] || 'teal'}>
                      {issue.tag}
                    </IssueTag>
                    <IssueColor $color={issue.color} />
                  </IssueTop>
                  <IssueTitle>{issue.title}</IssueTitle>
                  <IssueDesc>{issue.desc}</IssueDesc>
                  <IssueArrow>View on GitHub →</IssueArrow>
                </IssueCard>
              ))}
        </IssuesGrid>
      </Section>

      {/* ── COMMUNITY ── */}
      <CommunitySection>
        <CommunityInner>
          <SectionLabel>{c.community.label}</SectionLabel>
          <SectionTitle>{c.community.title}</SectionTitle>
          <CommunitySub>{c.community.subtitle}</CommunitySub>
          <CommunityCards>
            {[
              {
                icon: <GithubIcon />,
                name: 'GitHub',
                desc: 'Issues, PRs, discussions and the source code.',
                href: 'https://github.com/runilib',
                color: 'teal',
                cta: 'Open GitHub',
              },
              {
                icon: <DiscordIcon />,
                name: 'Discord',
                desc: 'Real-time chat, questions, dev logs and #contributing channel.',
                href: '#',
                color: 'purple',
                cta: 'Join Discord',
              },
            ].map((ch) => (
              <CommunityCard
                key={ch.name}
                href={ch.href}
                target="_blank"
                rel="noopener"
              >
                <CommunityCardIcon $color={ch.color as 'teal' | 'purple' | 'blue'}>
                  {ch.icon}
                </CommunityCardIcon>
                <CommunityCardName>{ch.name}</CommunityCardName>
                <CommunityCardDesc>{ch.desc}</CommunityCardDesc>
                <CommunityCardCTA>{ch.cta} →</CommunityCardCTA>
              </CommunityCard>
            ))}
          </CommunityCards>
        </CommunityInner>
      </CommunitySection>

      {/* ── CONTRIBUTORS WALL ── */}
      <Section>
        <SectionLabel>{c.recognition.label}</SectionLabel>
        <SectionTitle>{c.recognition.title}</SectionTitle>
        <RecogSub>{c.recognition.subtitle}</RecogSub>

        {/* Placeholder avatars — in a real app, fetched from GitHub API */}
        <ContributorsWall>
          {[...Array(10)].map((_, i) => (
            <ContribAvatar
              key={i.toString()}
              $seed={i}
              href="https://github.com/akladekouassi"
              target="_blank"
              rel="noopener"
              title={`Contributor #${i + 1}`}
            >
              {String.fromCodePoint(0x1f600 + i)}
            </ContribAvatar>
          ))}
          <ContribYou
            href="https://github.com/runilib/runilib"
            target="_blank"
            rel="noopener"
          >
            <PulsingDot />
            You?
          </ContribYou>
        </ContributorsWall>

        <ContribNote>
          Contributor avatars are pulled from the GitHub API.
          <ContribLink
            href="https://github.com/runilib"
            target="_blank"
            rel="noopener"
          >
            {' '}
            See the full list on GitHub →
          </ContribLink>
        </ContribNote>
      </Section>

      {/* ── FINAL CTA ── */}
      <CTASection>
        <CTAGlow />
        <CTAContent>
          <CTATitle>{c.cta.title}</CTATitle>
          <CTADesc>{c.cta.desc}</CTADesc>
          <CTAButtons>
            <PrimaryAnchor
              href="https://github.com/runilib/runilib/issues?q=is%3Aopen+label%3A%22good+first+issue%22"
              target="_blank"
              rel="noopener"
            >
              <GithubIcon /> {c.cta.primary}
            </PrimaryAnchor>
            <SecondaryAnchor
              href="https://github.com/runilib/runilib/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener"
            >
              {c.cta.secondary}
            </SecondaryAnchor>
          </CTAButtons>
        </CTAContent>
      </CTASection>
    </PageWrap>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────

function GithubIcon() {
  return (
    <svg
      aria-label="image"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
function DiscordIcon() {
  return (
    <svg
      aria-label="image"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.013.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
function _TwitterIcon() {
  return (
    <svg
      aria-label="image"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ── Styled components ──────────────────────────────────────────────────────

const PageWrap = styled.div`
  padding-top: 64px;
  min-height: 100vh;
`;

// Section primitives
const Section = styled.section`
  max-width: 1240px;
  margin: 0 auto;
  padding: 88px 24px;
`;
const SectionLabel = styled.div`
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.teal};
  margin-bottom: 14px;
`;
const SectionTitle = styled.h2`
  font-family: 'Sora', sans-serif;
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
  letter-spacing: -0.5px;
  margin-bottom: 10px;
`;
const SectionSub = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.75;
  max-width: 540px;
  margin-bottom: 44px;
`;

// CTA buttons
const anchorBase = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 700;
  padding: 11px 22px;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
`;
const PrimaryAnchor = styled.a`
  ${anchorBase}
  background: ${({ theme }) => theme.teal};
  color: #fff;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px ${({ theme }) => theme.teal}55;
  }
`;
const SecondaryAnchor = styled.a`
  ${anchorBase}
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textSecondary};
  background: transparent;
  &:hover {
    border-color: ${({ theme }) => theme.teal};
    color: ${({ theme }) => theme.teal};
    background: ${({ theme }) => theme.tealDim};
  }
`;

// ── Hero ────────────────────────────────────────────────────────────────────

const HeroSection = styled.section`
  position: relative;
  background: ${({ theme }) => theme.bgSurface};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
`;
const HeroGlow = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.gradientHero};
  pointer-events: none;
`;
const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1240px;
  margin: 0 auto;
  padding: 72px 24px 60px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 48px;
  flex-wrap: wrap;
  animation: ${fadeUp} 0.6s ease both;
`;
const HeroLeft = styled.div`
  max-width: 600px;
`;
const HeroTitle = styled.h1`
  font-family: 'Sora', sans-serif;
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1px;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 18px;
`;
const HeroSub = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 17px;
  line-height: 1.78;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 32px;
  max-width: 520px;
`;
const HeroCTAs = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;
const HeroRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 8px;
  @media (max-width: 760px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }
`;
const HeroStat = styled.div`
  background: ${({ theme }) => theme.bgCard};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 20px 28px;
  text-align: center;
  min-width: 120px;
  background-image: ${({ theme }) => theme.gradientCard};
`;
const StatNum = styled.div`
  font-family: 'Sora', sans-serif;
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.teal};
  line-height: 1;
  margin-bottom: 4px;
  background: linear-gradient(135deg, ${({ theme }) => theme.teal}, ${({ theme }) => theme.blue});
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 3s linear infinite;
`;
const StatLbl = styled.div`
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`;

// ── Why contribute ──────────────────────────────────────────────────────────

const WhyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  @media (max-width: 860px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 540px) { grid-template-columns: 1fr; }
`;
const WhyCard = styled.div<{ $delay: number }>`
  background: ${({ theme }) => theme.bgCard};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-image: ${({ theme }) => theme.gradientCard};
  transition: all 0.22s;
  animation: ${fadeUp} 0.5s ${({ $delay }) => $delay}ms ease both;
  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.borderHover};
    box-shadow: ${({ theme }) => theme.shadowCard};
  }
`;
const WhyEmoji = styled.div`
  font-size: 28px;
  width: 48px; height: 48px;
  border-radius: 12px;
  background: ${({ theme }) => theme.tealDim};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;
const WhyTitle = styled.h3`
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
`;
const WhyDesc = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 13.5px;
  line-height: 1.7;
  color: ${({ theme }) => theme.textSecondary};
`;

// ── Steps ───────────────────────────────────────────────────────────────────

const StepsSection = styled.section`
  background: ${({ theme }) => theme.bgSurface};
  border-top: 1px solid ${({ theme }) => theme.border};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 88px 24px;
`;
const StepsInner = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;
const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 48px;
`;
const StepRow = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 24px;
  @media (max-width: 600px) {
    grid-template-columns: 48px 1fr;
    gap: 16px;
  }
`;
const StepLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
`;
const StepNum = styled.div`
  width: 48px; height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.teal};
  color: "#fff";
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 20px ${({ theme }) => theme.teal}40;
  @media (max-width: 600px) { width: 36px; height: 36px; font-size: 11px; }
`;
const StepConnector = styled.div`
  width: 2px;
  flex: 1;
  min-height: 40px;
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.teal}44,
    ${({ theme }) => theme.teal}10
  );
  margin: 8px 0;
`;
const StepContent = styled.div<{ $last: boolean }>`
  padding-bottom: ${({ $last }) => ($last ? '0' : '48px')};
`;
const StepTitle = styled.h3`
  font-family: 'Sora', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 10px;
  margin-top: 10px;
`;
const StepDesc = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 14.5px;
  line-height: 1.8;
  color: ${({ theme }) => theme.textSecondary};
  max-width: 680px;
`;
const StepNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 14px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.amberDim};
  border: 1px solid ${({ theme }) => theme.amber}33;
  border-radius: 9px;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  line-height: 1.6;
  color: ${({ theme }) => theme.textSecondary};
  max-width: 680px;
`;
const NoteIcon = styled.span`flex-shrink: 0; font-size: 16px;`;
const StepCodeWrap = styled.div`margin-top: 20px; max-width: 700px;`;

// ── Code style ──────────────────────────────────────────────────────────────

const StyleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 48px;
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`;
const StyleCard = styled.div`
  background: ${({ theme }) => theme.bgCard};
  padding: 26px 28px;
  transition: background 0.18s;
  &:hover { background: ${({ theme }) => theme.bgCardHover}; }
`;
const StyleCardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
`;
const StyleNum = styled.div`
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: ${({ theme }) => theme.teal};
  background: ${({ theme }) => theme.tealDim};
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.teal}33;
  flex-shrink: 0;
`;
const StyleTitle = styled.h3`
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
`;
const StyleDesc = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  line-height: 1.7;
  color: ${({ theme }) => theme.textSecondary};
`;
const CommitSection = styled.div``;
const CommitTitle = styled.h3`
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 16px;
`;

// ── Checklist ───────────────────────────────────────────────────────────────

const ChecklistSection = styled.section`
  background: ${({ theme }) => theme.bgSurface};
  border-top: 1px solid ${({ theme }) => theme.border};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 88px 24px;
`;
const ChecklistInner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
`;
const ChecklistNote = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 36px;
`;
const ChecklistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;
const ChecklistItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: ${({ theme }) => theme.bgCard};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  padding: 14px 18px;
  transition: all 0.2s;
  &:hover {
    border-color: ${({ theme }) => theme.teal}44;
    background: ${({ theme }) => theme.bgCardHover};
  }
`;
const CheckBox = styled.div`
  width: 22px; height: 22px;
  border-radius: 6px;
  background: ${({ theme }) => theme.teal};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
`;
const CheckMark = styled.span`
  font-size: 12px;
  font-weight: 800;
  color: #080a0e;
  animation: ${checkPop} 0.35s ease both;
`;
const CheckText = styled.span`
  font-family: 'Sora', sans-serif;
  font-size: 13.5px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.5;
`;

// ── Good first issues ───────────────────────────────────────────────────────

const IssuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;
const IssueCard = styled.a`
  background: ${({ theme }) => theme.bgCard};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-decoration: none;
  background-image: ${({ theme }) => theme.gradientCard};
  transition: all 0.22s;
  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.borderHover};
    box-shadow: ${({ theme }) => theme.shadowCard};
  }
`;
const IssueCardPlaceholder = styled.div`
  background: ${({ theme }) => theme.bgCard};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 22px;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  background-image: linear-gradient(
    90deg,
    ${({ theme }) => theme.bgCard} 0%,
    ${({ theme }) => theme.border} 50%,
    ${({ theme }) => theme.bgCard} 100%
  );
  background-size: 200% 100%;
`;
const IssueTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const IssueTag = styled.div<{ $color: string }>`
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  padding: 2px 9px;
  border-radius: 20px;
  ${({ theme, $color }) => {
    const colorMap: Record<string, string> = {
      green: theme.green,
      blue: theme.blue,
      purple: theme.purple,
      teal: theme.teal,
      amber: theme.amber,
    };
    const c = colorMap[$color] || theme.teal;
    const dimMap: Record<string, string> = {
      green: theme.greenDim,
      blue: theme.blueDim,
      purple: theme.purpleDim,
      teal: theme.tealDim,
      amber: theme.amberDim,
    };
    const d = dimMap[$color] || theme.tealDim;
    return `color: ${c}; background: ${d}; border: 1px solid ${c}33;`;
  }}
`;
const IssueColor = styled.div<{ $color: string }>`
  width: 10px; height: 10px;
  border-radius: 50%;
  background: ${({ theme, $color }) => {
    const map: Record<string, string> = {
      teal: theme.teal,
      blue: theme.blue,
      amber: theme.amber,
      purple: theme.purple,
      green: theme.green,
    };
    return map[$color] || theme.teal;
  }};
  opacity: 0.7;
`;
const IssueTitle = styled.h3`
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
  line-height: 1.4;
`;
const IssueDesc = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 12.5px;
  line-height: 1.65;
  color: ${({ theme }) => theme.textSecondary};
  flex: 1;
`;
const IssueArrow = styled.div`
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: ${({ theme }) => theme.teal};
  margin-top: auto;
`;

// ── Community ───────────────────────────────────────────────────────────────

const CommunitySection = styled.section`
  background: ${({ theme }) => theme.bgSurface};
  border-top: 1px solid ${({ theme }) => theme.border};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 88px 24px;
`;
const CommunityInner = styled.div`max-width: 1240px; margin: 0 auto;`;
const CommunitySub = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.7;
  max-width: 460px;
  margin-bottom: 40px;
`;
const CommunityCards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`;
const CommunityCard = styled.a`
  background: ${({ theme }) => theme.bgCard};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-decoration: none;
  transition: all 0.22s;
  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.borderHover};
    box-shadow: ${({ theme }) => theme.shadowCard};
  }
`;
const CommunityCardIcon = styled.div<{ $color: 'teal' | 'purple' | 'blue' }>`
  width: 46px; height: 46px;
  border-radius: 12px;
  background: ${({ theme, $color }) => theme[`${$color}Dim`]};
  border: 1px solid ${({ theme, $color }) => `${theme[$color]}33`};
  color: ${({ theme, $color }) => theme[$color]};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CommunityCardName = styled.div`
  font-family: 'Sora', sans-serif;
  font-size: 17px;
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
`;
const CommunityCardDesc = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 13.5px;
  line-height: 1.7;
  color: ${({ theme }) => theme.textSecondary};
  flex: 1;
`;
const CommunityCardCTA = styled.div`
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: ${({ theme }) => theme.teal};
  margin-top: auto;
`;

// ── Contributors wall ───────────────────────────────────────────────────────

const RecogSub = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.7;
  max-width: 520px;
  margin-bottom: 36px;
`;
const ContributorsWall = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
`;
const ContribAvatar = styled.a<{ $seed: number }>`
  width: 52px; height: 52px;
  border-radius: 50%;
  background: ${({ theme }) => theme.bgCard};
  border: 2px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  &:hover {
    transform: scale(1.1) translateY(-2px);
    border-color: ${({ theme }) => theme.teal};
    box-shadow: 0 4px 16px ${({ theme }) => theme.teal}33;
  }
`;
const PulsingDot = styled.div`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.teal};
  animation: ${pulse} 1.8s ease-in-out infinite;
  flex-shrink: 0;
`;
const ContribYou = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: ${({ theme }) => theme.teal};
  background: ${({ theme }) => theme.tealDim};
  border: 1px dashed ${({ theme }) => theme.teal}55;
  border-radius: 24px;
  padding: 6px 16px;
  text-decoration: none;
  transition: all 0.2s;
  &:hover {
    background: ${({ theme }) => theme.tealDim};
    border-color: ${({ theme }) => theme.teal};
  }
`;
const ContribNote = styled.p`
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: ${({ theme }) => theme.textMuted};
  letter-spacing: 0.03em;
`;
const ContribLink = styled.a`
  color: ${({ theme }) => theme.teal};
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

// ── Final CTA ───────────────────────────────────────────────────────────────

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
  font-size: clamp(24px, 4vw, 38px);
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 14px;
  letter-spacing: -0.5px;
`;
const CTADesc = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.7;
  margin-bottom: 32px;
`;
const CTAButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

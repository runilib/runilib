import React from 'react'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useApp } from '../context/AppContext'
import { LogoIcon } from '../components/Logo'
import type { LibColor } from '../types'

const fadeUp = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`

// ══════════════════════════════════════════════════════════════
// ECOSYSTEM PAGE
// ══════════════════════════════════════════════════════════════

export function Ecosystem() {
  const { t } = useApp()

  const principles = [
    { icon: '🏗️', title: 'Schema-first',        desc: 'Describe intent in TypeScript, not implementation. The lib generates everything.' },
    { icon: '🔄', title: 'Consistent API',       desc: 'Learn one library and you understand all others. Same conventions across the ecosystem.' },
    { icon: '🧪', title: 'Native TypeScript',    desc: 'Zero casting, types inferred automatically from your schema — full autocomplete.' },
    { icon: '♿', title: 'Accessible',            desc: 'WCAG 2.1 AA by default on all libraries, without any configuration needed.' },
    { icon: '📦', title: 'Tree-shakeable',       desc: 'Import only what you use. The rest is excluded from your bundle automatically.' },
    { icon: '🌍', title: 'i18n everywhere',      desc: 'setLocale("fr") works on all RUNILIB libs. One call for your entire app.' },
  ]

  const timeline = [
    {
      quarter: 'Q1 2026', status: 'current' as const,
      items: [
        { name: 'formbridge v1.1', desc: 'Nested fields, wizard, persistence, conditional fields' },
        { name: 'stepwise v1.1',   desc: 'Multi-screen tours, scroll-to-element, accessibility' },
        { name: 'tooltip v1.0',    desc: 'Smart positioning, rich content, WCAG 2.1' },
      ],
    },
    {
      quarter: 'Q2 2026', status: 'planned' as const,
      items: [
        { name: 'formbridge v1.2', desc: 'File upload, masks, password strength, DevTools' },
        { name: 'stepwise v1.2',   desc: 'AI-generated steps, video steps, A/B testing' },
        { name: 'storex v1.0',     desc: 'Unified AsyncStorage / localStorage' },
      ],
    },
    {
      quarter: 'Q3 2026', status: 'planned' as const,
      items: [
        { name: 'formbridge v1.3', desc: 'field.infer(), JSON-driven forms, readonly/diff' },
        { name: 'toastly v1.0',    desc: 'Cross-platform toast notifications' },
        { name: 'modalkit v1.0',   desc: 'Unified modals and bottom sheets' },
      ],
    },
    {
      quarter: 'Q4 2026', status: 'vision' as const,
      items: [
        { name: 'motionkit v1.0',  desc: 'Framer Motion + Reanimated unified' },
        { name: 'RUNILIB v2.0',    desc: 'Monorepo, CLI, global DevTools' },
        { name: '@runilib/ui',      desc: 'Cross-platform design system' },
      ],
    },
  ]

  return (
    <Wrap>
      {/* Hero */}
      <EcoHero>
        <EcoHeroContent>
          <ELabel>Vision</ELabel>
          <ETitle>{t.ecosystem.title}</ETitle>
          <ESub>{t.ecosystem.subtitle}</ESub>
        </EcoHeroContent>
        <EcoHeroVis><LogoIcon size={96} animated /></EcoHeroVis>
      </EcoHero>

      {/* Architecture graph */}
      <EcoSection>
        <ELabel>Architecture</ELabel>
        <ETitle2>How it fits together</ETitle2>
        <GraphWrap>
          <GraphCenter>
            <GraphCenterText>Your App</GraphCenterText>
            <GraphCenterSub>React · React Native</GraphCenterSub>
          </GraphCenter>
          {([
            { name: 'formbridge', color: 'blue'  as LibColor, icon: '📋', angle: 0 },
            { name: 'stepwise',   color: 'amber' as LibColor, icon: '🎯', angle: 120 },
            { name: 'tooltip',    color: 'teal'  as LibColor, icon: '💬', angle: 240 },
          ]).map(lib => {
            const rad = (lib.angle - 90) * Math.PI / 180
            const x = 50 + 42 * Math.cos(rad)
            const y = 50 + 42 * Math.sin(rad)
            return (
              <GraphNode key={lib.name} style={{ left: `${x}%`, top: `${y}%` }}>
                <GraphNodeIcon $color={lib.color}>{lib.icon}</GraphNodeIcon>
                <GraphNodeName>{lib.name}</GraphNodeName>
              </GraphNode>
            )
          })}
        </GraphWrap>
      </EcoSection>

      {/* Principles */}
      <PrinciplesSection>
        <PrinInner>
          <ELabel>{t.ecosystem.principles.label}</ELabel>
          <ETitle2>{t.ecosystem.principles.title}</ETitle2>
          <PrinGrid>
            {principles.map(p => (
              <PrinCard key={p.title}>
                <PrinIcon>{p.icon}</PrinIcon>
                <PrinTitle>{p.title}</PrinTitle>
                <PrinDesc>{p.desc}</PrinDesc>
              </PrinCard>
            ))}
          </PrinGrid>
        </PrinInner>
      </PrinciplesSection>

      {/* Roadmap */}
      <RoadmapSection>
        <ELabel>{t.ecosystem.roadmap.label}</ELabel>
        <ETitle2>{t.ecosystem.roadmap.title}</ETitle2>
        <Timeline>
          {timeline.map(q => (
            <TimeBlock key={q.quarter} $status={q.status}>
              <TimeQuarter $status={q.status}>{q.quarter}</TimeQuarter>
              <TimeItems>
                {q.items.map(item => (
                  <TimeItem key={item.name} $status={q.status}>
                    <TimeItemName>{item.name}</TimeItemName>
                    <TimeItemDesc>{item.desc}</TimeItemDesc>
                  </TimeItem>
                ))}
              </TimeItems>
            </TimeBlock>
          ))}
        </Timeline>
      </RoadmapSection>

      {/* CTA */}
      <EcoCTA>
        <ECTATitle>Join the ecosystem</ECTATitle>
        <ECTADesc>RUNILIB is open source. Contributions welcome.</ECTADesc>
        <ECTABtns>
          <PrimaryBtn to="/docs">Get started</PrimaryBtn>
          <SecBtn href="https://github.com/runilib" target="_blank" rel="noopener">⭐ GitHub</SecBtn>
        </ECTABtns>
      </EcoCTA>
    </Wrap>
  )
}

// ── Styled Ecosystem ──────────────────────────────────────────

const Wrap = styled.div`padding-top: 64px; min-height: 100vh;`
const ELabel = styled.div`
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.teal};
  margin-bottom: 14px;
`
const EcoHero = styled.section`
  max-width: 1240px;
  margin: 0 auto;
  padding: 72px 24px 52px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 48px;
  animation: ${fadeUp} 0.6s ease both;
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`
const EcoHeroContent = styled.div``
const EcoHeroVis = styled.div`
  opacity: 0.55;
  @media (max-width: 760px) { display: none; }
`
const ETitle = styled.h1`
  font-family: 'Sora', sans-serif;
  font-size: clamp(24px, 4vw, 40px);
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 14px;
  letter-spacing: -0.5px;
  line-height: 1.15;
`
const ETitle2 = styled.h2`
  font-family: 'Sora', sans-serif;
  font-size: clamp(20px, 3vw, 30px);
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 36px;
  letter-spacing: -0.3px;
`
const ESub = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 17px;
  line-height: 1.75;
  color: ${({ theme }) => theme.textSecondary};
  max-width: 560px;
`
const EcoSection = styled.section`
  max-width: 1240px;
  margin: 0 auto;
  padding: 48px 24px 72px;
`
const GraphWrap = styled.div`
  position: relative;
  width: 340px;
  height: 340px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`
const GraphCenter = styled.div`
  position: relative;
  z-index: 10;
  background: ${({ theme }) => theme.bgCard};
  border: 2px solid ${({ theme }) => theme.teal};
  border-radius: 14px;
  padding: 16px 22px;
  text-align: center;
  box-shadow: 0 0 28px ${({ theme }) => theme.teal}22;
`
const GraphCenterText = styled.div`
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
`
const GraphCenterSub = styled.div`
  font-family: 'DM Mono', monospace;
  font-size: 9.5px;
  color: ${({ theme }) => theme.textMuted};
  margin-top: 2px;
`
const GraphNode = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`
const GraphNodeIcon = styled.div<{ $color: LibColor }>`
  font-size: 20px;
  width: 44px; height: 44px;
  border-radius: 12px;
  background: ${({ theme, $color }) => theme[`${$color}Dim` as keyof typeof theme] as string};
  border: 1px solid ${({ theme, $color }) => `${theme[$color as keyof typeof theme]}44`};
  display: flex;
  align-items: center;
  justify-content: center;
`
const GraphNodeName = styled.div`
  font-family: 'Sora', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
`
const PrinciplesSection = styled.section`
  background: ${({ theme }) => theme.bgSurface};
  border-top: 1px solid ${({ theme }) => theme.border};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 72px 24px;
`
const PrinInner = styled.div`max-width: 1240px; margin: 0 auto;`
const PrinGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  @media (max-width: 860px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`
const PrinCard = styled.div`
  background: ${({ theme }) => theme.bgCard};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 9px;
`
const PrinIcon = styled.div`font-size: 26px;`
const PrinTitle = styled.h3`
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
`
const PrinDesc = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  line-height: 1.7;
  color: ${({ theme }) => theme.textSecondary};
`
const RoadmapSection = styled.section`
  max-width: 1240px;
  margin: 0 auto;
  padding: 72px 24px;
`
const Timeline = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  @media (max-width: 860px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`
const TimeBlock = styled.div<{ $status: 'current'|'planned'|'vision' }>`
  border-radius: 14px;
  background: ${({ theme }) => theme.bgCard};
  border: ${({ theme, $status }) =>
    $status === 'current' ? `2px solid ${theme.teal}55` : `1px solid ${theme.border}`};
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 13px;
  opacity: ${({ $status }) => $status === 'vision' ? 0.6 : 1};
`
const TimeQuarter = styled.div<{ $status: 'current'|'planned'|'vision' }>`
  font-family: 'DM Mono', monospace;
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.15em;
  padding: 3px 9px;
  border-radius: 20px;
  width: fit-content;
  ${({ theme, $status }) => {
    if ($status === 'current') return `background:${theme.tealDim};color:${theme.teal};border:1px solid ${theme.teal}44;`
    if ($status === 'planned') return `background:${theme.blueDim};color:${theme.blue};border:1px solid ${theme.blue}44;`
    return `background:${theme.border};color:${theme.textMuted};`
  }}
`
const TimeItems = styled.div`display: flex; flex-direction: column; gap: 9px;`
const TimeItem = styled.div<{ $status: 'current'|'planned'|'vision' }>`
  padding-left: 11px;
  border-left: 2px solid ${({ theme, $status }) =>
    $status === 'current' ? theme.teal :
    $status === 'planned' ? theme.blue : theme.border};
`
const TimeItemName = styled.div`
  font-family: 'Sora', sans-serif;
  font-size: 12.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 2px;
`
const TimeItemDesc = styled.div`
  font-family: 'Sora', sans-serif;
  font-size: 11.5px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.5;
`
const EcoCTA = styled.section`
  text-align: center;
  padding: 72px 24px;
  background: ${({ theme }) => theme.bgSurface};
  border-top: 1px solid ${({ theme }) => theme.border};
`
const ECTATitle = styled.h2`
  font-family: 'Sora', sans-serif;
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 12px;
`
const ECTADesc = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 26px;
`
const ECTABtns = styled.div`display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;`
const PrimaryBtn = styled(Link)`
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700;
  padding: 11px 22px; border-radius: 10px; text-decoration: none;
  background: ${({ theme }) => theme.teal}; color: #080a0e;
  transition: all 0.2s;
  &:hover { opacity: 0.9; transform: translateY(-1px); }
`
const SecBtn = styled.a`
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600;
  padding: 11px 22px; border-radius: 10px; text-decoration: none;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textSecondary}; background: transparent;
  transition: all 0.2s;
  &:hover { border-color: ${({ theme }) => theme.teal}; color: ${({ theme }) => theme.teal}; }
`

// ══════════════════════════════════════════════════════════════
// NOT FOUND PAGE
// ══════════════════════════════════════════════════════════════

export function NotFound() {
  const { t } = useApp()
  return (
    <NotFoundWrap>
      <NFCode>404</NFCode>
      <NFTitle>{t.notFound.title}</NFTitle>
      <NFSub>{t.notFound.sub}</NFSub>
      <NFBtn to="/">{t.notFound.back}</NFBtn>
    </NotFoundWrap>
  )
}

const NotFoundWrap = styled.div`
  padding-top: 64px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 24px;
`
const NFCode = styled.div`
  font-family: 'DM Mono', monospace;
  font-size: 120px;
  font-weight: 500;
  color: ${({ theme }) => theme.teal};
  opacity: 0.12;
  line-height: 1;
  margin-bottom: 24px;
`
const NFTitle = styled.h1`
  font-family: 'Sora', sans-serif;
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 12px;
`
const NFSub = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 32px;
`
const NFBtn = styled(Link)`
  font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700;
  padding: 12px 24px; border-radius: 10px; text-decoration: none;
  background: ${({ theme }) => theme.teal}; color: #080a0e;
  &:hover { opacity: 0.9; }
`

'use client';

import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import { useApp } from '../../context/AppContext';
import { getLibraryHref, getNewTabLinkProps, LIBRARIES } from '../../data/libraries';
import type { LibColor } from '../../types';

const fadeUp = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;

export default function Docs() {
  const { t } = useApp();

  return (
    <Wrap>
      <Hero>
        <HeroInner>
          <Label>{t.docs.title}</Label>
          <Title>Documentation for the RUNILIB ecosystem</Title>
          <Sub>
            Explore installation guides, API reference and TypeScript examples for RUNILIB
            packages across web and mobile.
          </Sub>
        </HeroInner>
      </Hero>

      <Body>
        <CardsGrid>
          {LIBRARIES.map((lib, i) => (
            <DocCard
              key={lib.id}
              href={getLibraryHref(lib)}
              {...getNewTabLinkProps(getLibraryHref(lib))}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <CardIcon $color={lib.color}>{lib.icon}</CardIcon>
              <CardName>{lib.name}</CardName>
              <CardTagline>{lib.tagline}</CardTagline>
              <CardMeta>
                <CardVer>{lib.version}</CardVer>
                <CardStatus $status={lib.status}>
                  {lib.status === 'stable' ? t.libraryPage.stable : t.libraryPage.beta}
                </CardStatus>
              </CardMeta>
              <CardFeatures>
                {lib.highlights.slice(0, 3).map((h) => (
                  <CardFeature key={h}>
                    <Arrow>→</Arrow>
                    {h}
                  </CardFeature>
                ))}
              </CardFeatures>
              <CardCTA>{t.libraryPage.readDocs} →</CardCTA>
            </DocCard>
          ))}
        </CardsGrid>

        <QuickRef>
          <QuickTitle>Global settings</QuickTitle>
          <QuickGrid>
            <QuickCard>
              <QuickName>Scoped package</QuickName>
              <QuickDesc>
                Import the published package name directly. No provider or bootstrapping
                is required for the standard form flow.
              </QuickDesc>
              <QuickCode>{`import { useFormBridge, field }\n  from '@runilib/react-formbridge'`}</QuickCode>
            </QuickCard>
            <QuickCard>
              <QuickName>TypeScript</QuickName>
              <QuickDesc>
                Every schema is fully typed. Types are inferred — no manual annotations
                needed.
              </QuickDesc>
              <QuickCode>{`const form = useFormBridge({\n  email: field.email('Email').required(),\n})\n// form.fields.email is typed ✓`}</QuickCode>
            </QuickCard>
            <QuickCard>
              <QuickName>Zero config</QuickName>
              <QuickDesc>
                No mandatory provider, no setup file. Import and use directly.
              </QuickDesc>
              <QuickCode>{`import { useFormBridge, field }\n  from '@runilib/react-formbridge'\n\nconst { Form, fields } = useFormBridge({ ... })`}</QuickCode>
            </QuickCard>
          </QuickGrid>
        </QuickRef>
      </Body>
    </Wrap>
  );
}

const Wrap = styled.div`padding-top: 64px; min-height: 100vh;`;
const Hero = styled.div`background: ${({ theme }) => theme.bgSurface}; border-bottom: 1px solid ${({ theme }) => theme.border}; padding: 60px 24px 44px;`;
const HeroInner = styled.div`max-width: 1240px; margin: 0 auto;`;
const Label = styled.div`font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: ${({ theme }) => theme.teal}; margin-bottom: 14px;`;
const Title = styled.h1`font-family: 'Sora', sans-serif; font-size: clamp(26px, 4vw, 42px); font-weight: 800; color: ${({ theme }) => theme.textPrimary}; margin-bottom: 10px; letter-spacing: -0.5px;`;
const Sub = styled.p`font-family: 'Sora', sans-serif; font-size: 16px; color: ${({ theme }) => theme.textSecondary}; line-height: 1.7; max-width: 500px;`;
const Body = styled.div`max-width: 1240px; margin: 0 auto; padding: 52px 24px 80px;`;
const CardsGrid = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 64px; @media (max-width: 900px) { grid-template-columns: 1fr; }`;
const DocCard = styled(
  Link,
)`background: ${({ theme }) => theme.bgCard}; border: 1px solid ${({ theme }) => theme.border}; border-radius: 16px; padding: 30px; display: flex; flex-direction: column; gap: 13px; text-decoration: none; background-image: ${({ theme }) => theme.gradientCard}; transition: all 0.22s; animation: ${fadeUp} 0.5s ease both; &:hover { transform: translateY(-3px); border-color: ${({ theme }) => theme.borderHover}; box-shadow: ${({ theme }) => theme.shadowCard}; }`;
const CardIcon = styled.div<{
  $color: LibColor;
}>`font-size: 30px; width: 52px; height: 52px; border-radius: 14px; background: ${({ theme, $color }) => theme[`${$color}Dim` as keyof typeof theme] as string}; border: 1px solid ${({ theme, $color }) => `${theme[$color as keyof typeof theme]}33`}; display: flex; align-items: center; justify-content: center;`;
const CardName = styled.div`font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 800; color: ${({ theme }) => theme.textPrimary};`;
const CardTagline = styled.div`font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: ${({ theme }) => theme.teal};`;
const CardMeta = styled.div`display: flex; gap: 8px; align-items: center;`;
const CardVer = styled.div`font-family: 'DM Mono', monospace; font-size: 9.5px; color: ${({ theme }) => theme.textMuted}; padding: 2px 6px; background: ${({ theme }) => theme.border}; border-radius: 3px;`;
const CardStatus = styled.div<{
  $status: string;
}>`font-family: 'DM Mono', monospace; font-size: 9.5px; padding: 2px 7px; border-radius: 10px; ${({ theme, $status }) => ($status === 'stable' ? `background:${theme.greenDim};color:${theme.green};border:1px solid ${theme.green}33;` : `background:${theme.amberDim};color:${theme.amber};border:1px solid ${theme.amber}33;`)}`;
const CardFeatures = styled.ul`list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px;`;
const Arrow = styled.span`color: ${({ theme }) => theme.teal}; margin-right: 6px;`;
const CardFeature = styled.li`font-family: 'DM Mono', monospace; font-size: 11.5px; color: ${({ theme }) => theme.textSecondary};`;
const CardCTA = styled.div`margin-top: auto; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700; color: ${({ theme }) => theme.teal};`;
const QuickRef = styled.div``;
const QuickTitle = styled.h2`font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 800; color: ${({ theme }) => theme.textPrimary}; margin-bottom: 20px;`;
const QuickGrid = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; @media (max-width: 780px) { grid-template-columns: 1fr; }`;
const QuickCard = styled.div`background: ${({ theme }) => theme.bgCard}; border: 1px solid ${({ theme }) => theme.border}; border-radius: 12px; padding: 22px; display: flex; flex-direction: column; gap: 10px;`;
const QuickName = styled.div`font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: ${({ theme }) => theme.textPrimary};`;
const QuickDesc = styled.p`font-family: 'Sora', sans-serif; font-size: 12.5px; line-height: 1.7; color: ${({ theme }) => theme.textSecondary};`;
const QuickCode = styled.pre`font-family: 'DM Mono', monospace; font-size: 11.5px; line-height: 1.65; color: #cdd9e5; background: ${({ theme }) => theme.bgCodeBlock}; border: 1px solid ${({ theme }) => theme.borderCode}; border-radius: 7px; padding: 10px 12px; white-space: pre-wrap; overflow-x: auto;`;

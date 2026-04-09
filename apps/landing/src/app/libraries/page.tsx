'use client';

import { useState } from 'react';

import Link from 'next/link';
import styled from 'styled-components';
import { useApp } from '../../context/AppContext';
import {
  getLibraryHref,
  getNewTabLinkProps,
  LIBRARIES,
  ROADMAP_LIBS,
} from '../../data/libraries';
import type { LibColor } from '../../types';

export default function Libraries() {
  const { locale, t } = useApp();
  const [search, setSearch] = useState('');
  const filtered = LIBRARIES.filter(
    (l) =>
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.tagline.toLowerCase().includes(search.toLowerCase()) ||
      l.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
  );
  const searchHints =
    locale === 'fr'
      ? 'Astuce : recherche par nom de package, plateforme, API ou mot-clé.'
      : 'Tip: search by package name, platform, API or keyword.';
  const searchPlaceholder =
    locale === 'fr'
      ? 'Rechercher des packages, APIs ou mots-clés...'
      : 'Search packages, APIs, or keywords...';
  const emptySubcopy =
    locale === 'fr'
      ? 'Essaie un nom de package, une plateforme ou un mot-clé.'
      : 'Try a package name, platform, or keyword.';

  return (
    <Wrap>
      <PageHeader>
        <HeaderInner>
          <Label>{t.libs.label}</Label>
          <Title>{t.libs.title}</Title>
          <Sub>{t.libs.subtitle}</Sub>
          <SearchRow>
            <SearchBox>
              <SearchIco>
                <svg
                  aria-label="image"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                  />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </SearchIco>
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
              />
            </SearchBox>
          </SearchRow>
          <SearchHints>{searchHints}</SearchHints>
        </HeaderInner>
      </PageHeader>
      <Body>
        <SectionLabel>
          Available · {filtered.length} {filtered.length === 1 ? 'library' : 'libraries'}
        </SectionLabel>
        <LibList>
          {filtered.map((lib) => (
            <LibRow key={lib.id}>
              <RowLeft>
                <RowIcon $color={lib.color}>{lib.icon}</RowIcon>
                <RowInfo>
                  <RowNameRow>
                    <RowName>{lib.name}</RowName>
                    <RowVer>{lib.version}</RowVer>
                    <RowStatus $status={lib.status}>
                      {lib.status === 'stable'
                        ? t.libraryPage.stable
                        : t.libraryPage.beta}
                    </RowStatus>
                  </RowNameRow>
                  <RowTagline>{lib.tagline}</RowTagline>
                  <RowDesc>{lib.desc}</RowDesc>
                  <RowTags>
                    {lib.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </RowTags>
                </RowInfo>
              </RowLeft>
              <RowRight>
                <HighlightList>
                  {lib.highlights.slice(0, 5).map((h) => (
                    <HighlightItem key={h}>
                      <Arrow>→</Arrow>
                      {h}
                    </HighlightItem>
                  ))}
                  {lib.highlights.length > 5 && (
                    <HighlightMore>
                      +{lib.highlights.length - 5} more features
                    </HighlightMore>
                  )}
                </HighlightList>
                <InstallRow>
                  <InstallCode>{lib.install}</InstallCode>
                </InstallRow>
                <RowActions>
                  <DocBtn
                    href={getLibraryHref(lib)}
                    {...getNewTabLinkProps(getLibraryHref(lib))}
                  >
                    {t.libs.docs}
                  </DocBtn>
                  <GhBtn
                    href={lib.githubUrl}
                    target="_blank"
                    rel="noopener"
                  >
                    {t.libs.github}
                  </GhBtn>
                </RowActions>
              </RowRight>
            </LibRow>
          ))}
          {filtered.length === 0 && (
            <Empty>
              <EmptyEmoji>🔍</EmptyEmoji>
              <EmptyText>No library found for "{search}"</EmptyText>
              <EmptySub>{emptySubcopy}</EmptySub>
            </Empty>
          )}
        </LibList>
        <RoadmapBlock>
          <SectionLabel>Roadmap — Coming next</SectionLabel>
          <RoadTitle>Expanding the ecosystem</RoadTitle>
          <RoadGrid>
            {ROADMAP_LIBS.map((lib) => (
              <RoadCard key={lib.name}>
                <RoadIcon $color={lib.color as LibColor}>{lib.icon}</RoadIcon>
                <RoadName>{lib.name}</RoadName>
                <RoadDesc>{lib.tagline}</RoadDesc>
                <PlannedTag>Planned</PlannedTag>
              </RoadCard>
            ))}
          </RoadGrid>
        </RoadmapBlock>
      </Body>
    </Wrap>
  );
}

const Wrap = styled.div`padding-top: 64px; min-height: 100vh;`;
const PageHeader = styled.div`background: ${({ theme }) => theme.bgSurface}; border-bottom: 1px solid ${({ theme }) => theme.border}; padding: 60px 24px 40px;`;
const HeaderInner = styled.div`max-width: 1240px; margin: 0 auto;`;
const Label = styled.div`font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: ${({ theme }) => theme.teal}; margin-bottom: 14px;`;
const Title = styled.h1`font-family: 'Sora', sans-serif; font-size: clamp(26px, 4vw, 42px); font-weight: 800; color: ${({ theme }) => theme.textPrimary}; margin-bottom: 10px; letter-spacing: -0.5px;`;
const Sub = styled.p`font-family: 'Sora', sans-serif; font-size: 16px; color: ${({ theme }) => theme.textSecondary}; line-height: 1.7; max-width: 480px; margin-bottom: 24px;`;
const SearchRow = styled.div`align-items: center; justify-content: center; margin: 0px 50px;`;
const SearchBox = styled.div`display: flex; align-items: center; gap: 10px; background: ${({ theme }) => theme.bgCard}; border: 1px solid ${({ theme }) => theme.border}; border-radius: 10px; padding: 10px 16px; transition: border-color 0.2s; &:focus-within { border-color: ${({ theme }) => theme.teal}; }`;
const SearchIco = styled.div`color: ${({ theme }) => theme.textMuted}; flex-shrink: 0;`;
const SearchInput = styled.input`flex: 1; font-family: 'Sora', sans-serif; font-size: 14px; color: ${({ theme }) => theme.textPrimary}; background: transparent; border: none; outline: none; &::placeholder { color: ${({ theme }) => theme.textMuted}; }`;
const SearchHints = styled.p`font-family: 'DM Mono', monospace; font-size: 10.5px; line-height: 1.7; color: ${({ theme }) => theme.textMuted}; margin-top: 12px;`;
const Body = styled.div`max-width: 1240px; margin: 0 auto; padding: 44px 24px 80px;`;
const SectionLabel = styled.div`font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: ${({ theme }) => theme.textMuted}; margin-bottom: 20px;`;
const LibList = styled.div`display: flex; flex-direction: column; gap: 14px; margin-bottom: 72px;`;
const LibRow = styled.div`background: ${({ theme }) => theme.bgCard}; border: 1px solid ${({ theme }) => theme.border}; border-radius: 16px; padding: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 28px; background-image: ${({ theme }) => theme.gradientCard}; transition: all 0.2s; &:hover { border-color: ${({ theme }) => theme.borderHover}; transform: translateY(-2px); box-shadow: ${({ theme }) => theme.shadowCard}; } @media (max-width: 860px) { grid-template-columns: 1fr; }`;
const RowLeft = styled.div`display: flex; gap: 18px;`;
const RowIcon = styled.div<{
  $color: LibColor;
}>`font-size: 28px; width: 52px; height: 52px; border-radius: 13px; background: ${({ theme, $color }) => theme[`${$color}Dim` as keyof typeof theme] as string}; border: 1px solid ${({ theme, $color }) => `${theme[$color as keyof typeof theme]}33`}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;`;
const RowInfo = styled.div`flex: 1; min-width: 0;`;
const RowNameRow = styled.div`display: flex; align-items: center; gap: 9px; flex-wrap: wrap; margin-bottom: 5px;`;
const RowName = styled.div`font-family: 'Sora', sans-serif; font-size: 19px; font-weight: 800; color: ${({ theme }) => theme.textPrimary};`;
const RowVer = styled.div`font-family: 'DM Mono', monospace; font-size: 10px; color: ${({ theme }) => theme.textMuted}; padding: 2px 6px; background: ${({ theme }) => theme.border}; border-radius: 3px;`;
const RowStatus = styled.div<{
  $status: string;
}>`font-family: 'DM Mono', monospace; font-size: 9.5px; padding: 2px 7px; border-radius: 10px; ${({ theme, $status }) => ($status === 'stable' ? `background:${theme.greenDim};color:${theme.green};border:1px solid ${theme.green}33;` : `background:${theme.amberDim};color:${theme.amber};border:1px solid ${theme.amber}33;`)}`;
const RowTagline = styled.div`font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: ${({ theme }) => theme.teal}; margin-bottom: 7px;`;
const RowDesc = styled.p`font-family: 'Sora', sans-serif; font-size: 13px; line-height: 1.7; color: ${({ theme }) => theme.textSecondary}; margin-bottom: 10px;`;
const RowTags = styled.div`display: flex; flex-wrap: wrap; gap: 6px;`;
const Tag = styled.span`font-family: 'DM Mono', monospace; font-size: 10px; padding: 2px 8px; border-radius: 4px; background: ${({ theme }) => theme.tealDim}; color: ${({ theme }) => theme.teal}; border: 1px solid ${({ theme }) => theme.teal}22;`;
const RowRight = styled.div`display: flex; flex-direction: column; gap: 14px;`;
const HighlightList = styled.ul`list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px;`;
const Arrow = styled.span`color: ${({ theme }) => theme.teal}; margin-right: 7px;`;
const HighlightItem = styled.li`font-family: 'DM Mono', monospace; font-size: 12px; color: ${({ theme }) => theme.textSecondary};`;
const HighlightMore = styled.div`font-family: 'DM Mono', monospace; font-size: 11px; color: ${({ theme }) => theme.textMuted}; font-style: italic;`;
const InstallRow = styled.div`background: ${({ theme }) => theme.bgCodeBlock}; border: 1px solid ${({ theme }) => theme.borderCode}; border-radius: 8px; padding: 9px 13px;`;
const InstallCode = styled.code`font-family: 'DM Mono', monospace; font-size: 12.5px; color: #cdd9e5;`;
const RowActions = styled.div`display: flex; gap: 9px; margin-top: auto;`;
const DocBtn = styled(
  Link,
)`flex: 1; text-align: center; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700; padding: 9px 16px; border-radius: 8px; text-decoration: none; background: ${({ theme }) => theme.teal}; color: #080a0e; transition: all 0.2s; &:hover { opacity: 0.9; transform: translateY(-1px); }`;
const GhBtn = styled.a`font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; padding: 9px 16px; border-radius: 8px; text-decoration: none; border: 1px solid ${({ theme }) => theme.border}; color: ${({ theme }) => theme.textSecondary}; transition: all 0.2s; &:hover { border-color: ${({ theme }) => theme.teal}; color: ${({ theme }) => theme.teal}; }`;
const Empty = styled.div`text-align: center; padding: 72px 24px;`;
const EmptyEmoji = styled.div`font-size: 48px; margin-bottom: 16px;`;
const EmptyText = styled.div`font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 600; color: ${({ theme }) => theme.textPrimary}; margin-bottom: 8px;`;
const EmptySub = styled.div`font-family: 'DM Mono', monospace; font-size: 12px; color: ${({ theme }) => theme.textMuted};`;
const RoadmapBlock = styled.div``;
const RoadTitle = styled.h2`font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 800; color: ${({ theme }) => theme.textPrimary}; margin-bottom: 20px;`;
const RoadGrid = styled.div`display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; @media (max-width: 860px) { grid-template-columns: repeat(2, 1fr); } @media (max-width: 500px) { grid-template-columns: 1fr; }`;
const RoadCard = styled.div`background: ${({ theme }) => theme.bgCard}; border: 1px dashed ${({ theme }) => theme.border}; border-radius: 14px; padding: 22px; display: flex; flex-direction: column; gap: 8px; opacity: 0.65;`;
const RoadIcon = styled.div<{
  $color: LibColor;
}>`font-size: 22px; width: 42px; height: 42px; border-radius: 10px; background: ${({ theme, $color }) => theme[`${$color}Dim` as keyof typeof theme] as string}; display: flex; align-items: center; justify-content: center; margin-bottom: 4px;`;
const RoadName = styled.div`font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; color: ${({ theme }) => theme.textPrimary};`;
const RoadDesc = styled.div`font-family: 'Sora', sans-serif; font-size: 12px; color: ${({ theme }) => theme.textSecondary}; line-height: 1.5;`;
const PlannedTag = styled.div`font-family: 'DM Mono', monospace; font-size: 9.5px; color: ${({ theme }) => theme.textMuted}; border: 1px dashed ${({ theme }) => theme.border}; padding: 2px 7px; border-radius: 10px; width: fit-content; margin-top: 4px;`;

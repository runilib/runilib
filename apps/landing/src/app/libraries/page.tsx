'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { useApp } from '../../context/AppContext';
import { getLibraryHref, getNewTabLinkProps, LIBRARIES } from '../../data/libraries';
import { formatDownloadsCompact, useNpmDownloads } from '../../hooks/useNpmDownloads';
import type { LibColor } from '../../types';

export default function Libraries() {
  const { t } = useApp();
  const { downloads, loading: downloadsLoading } = useNpmDownloads({
    packages: LIBRARIES.map((lib) => lib.packageName),
    period: 'last-week',
  });

  return (
    <Wrap>
      <PageHeader>
        <HeaderInner>
          <Label>{t.libs.label}</Label>
          <Title>{t.libs.title}</Title>
          <Sub>{t.libs.subtitle}</Sub>
        </HeaderInner>
      </PageHeader>
      <Body>
        <SectionLabel>Available · {LIBRARIES.length} libraries</SectionLabel>
        <LibList>
          {LIBRARIES.map((lib) => (
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
                    <DownloadsBadge
                      href={`${lib.npmUrl}?activeTab=versions`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Weekly downloads on npm for ${lib.packageName}`}
                    >
                      <DownloadsArrow aria-hidden>↓</DownloadsArrow>
                      <DownloadsValue>
                        {downloadsLoading && downloads[lib.packageName] === undefined
                          ? '…'
                          : downloads[lib.packageName] !== undefined
                            ? formatDownloadsCompact(downloads[lib.packageName])
                            : '—'}
                      </DownloadsValue>
                      <DownloadsUnit>/wk</DownloadsUnit>
                    </DownloadsBadge>
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
        </LibList>
      </Body>
    </Wrap>
  );
}

const Wrap = styled.div`
padding-top: 64px;
min-height: 100vh;
`;

const PageHeader = styled.div`background: ${({ theme }) => theme.bgSurface}; border-bottom: 1px solid ${({ theme }) => theme.border}; padding: 60px 24px 40px;`;
const HeaderInner = styled.div`max-width: 1240px; margin: 0 auto;`;
const Label = styled.div`font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: ${({ theme }) => theme.teal}; margin-bottom: 14px;`;
const Title = styled.h1`font-family: 'Sora', sans-serif; font-size: clamp(26px, 4vw, 42px); font-weight: 800; color: ${({ theme }) => theme.textPrimary}; margin-bottom: 10px; letter-spacing: -0.5px;`;
const Sub = styled.p`font-family: 'Sora', sans-serif; font-size: 16px; color: ${({ theme }) => theme.textSecondary}; line-height: 1.7; max-width: 480px; margin-bottom: 24px;`;
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
const DownloadsBadge = styled.a`display: inline-flex; align-items: baseline; gap: 4px; font-family: 'DM Mono', monospace; font-size: 10px; padding: 2px 7px; border-radius: 10px; background: ${({ theme }) => theme.tealDim}; color: ${({ theme }) => theme.teal}; border: 1px solid ${({ theme }) => theme.teal}33; text-decoration: none; transition: opacity 0.2s; &:hover { opacity: 0.85; }`;
const DownloadsArrow = styled.span`font-size: 9px; line-height: 1;`;
const DownloadsValue = styled.span`font-weight: 700; font-size: 10.5px;`;
const DownloadsUnit = styled.span`font-size: 9px; opacity: 0.75;`;
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

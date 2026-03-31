'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { WEBSITE_FEATURES } from '../config/features';
import { useApp } from '../context/AppContext';
import { LogoFull } from './Logo';

export function Footer() {
  const { t } = useApp();
  const docsIndexPath = WEBSITE_FEATURES.docs ? '/docs' : '/libraries';
  const formbridgeDocsPath = WEBSITE_FEATURES.docs
    ? '/docs/formbridge'
    : '/libraries/formbridge';
  const walkitDocsPath = WEBSITE_FEATURES.docs ? '/docs/walkit' : '/libraries/walkit';

  const cols = [
    {
      title: t.footer.cols.libraries,
      links: [
        { label: 'formbridge', href: '/libraries/formbridge' },
        { label: 'walkit', href: '/libraries/walkit' },
        { label: '→ All libs', href: '/libraries' },
      ],
    },
    {
      title: t.footer.cols.docs,
      links: [
        { label: 'Quick start', href: docsIndexPath },
        { label: 'formbridge API', href: formbridgeDocsPath },
        { label: 'walkit API', href: walkitDocsPath },
      ],
    },
    {
      title: t.footer.cols.community,
      links: [
        { label: 'GitHub', ext: 'https://github.com/runilib' },
        { label: 'npm', ext: 'https://npmjs.com/~runilib' },
        { label: 'Twitter', ext: 'https://twitter.com/runilib' },
        { label: 'Discord', ext: '#' },
      ],
    },
    {
      title: t.footer.cols.project,
      links: [
        { label: 'Ecosystem', href: '/ecosystem' },
        { label: 'Roadmap', href: '/ecosystem' },
        { label: 'Changelog', ext: 'https://github.com/runilib/releases' },
        { label: 'MIT License', ext: 'https://opensource.org/licenses/MIT' },
      ],
    },
  ];

  return (
    <Wrap>
      <Inner>
        <Top>
          <Brand>
            <LogoFull />
            <Desc>{t.footer.desc}</Desc>
            <Badges>
              {(['MIT License', 'TypeScript', 'React 18+'] as const).map((b, i) => (
                <Badge
                  key={b}
                  $color={(['teal', 'blue', 'amber'] as const)[i]}
                >
                  {b}
                </Badge>
              ))}
            </Badges>
          </Brand>
          <Cols>
            {cols.map((col) => (
              <Col key={col.title}>
                <ColTitle>{col.title}</ColTitle>
                {col.links.map((l) =>
                  'ext' in l ? (
                    <ColExt
                      key={l.label}
                      href={l.ext!}
                      target="_blank"
                      rel="noopener"
                    >
                      {l.label}
                    </ColExt>
                  ) : (
                    <ColInt
                      key={l.label}
                      href={l.href!}
                    >
                      {l.label}
                    </ColInt>
                  ),
                )}
              </Col>
            ))}
          </Cols>
        </Top>
        <Bottom>
          <Copyright>{t.footer.copyright}</Copyright>
          <BottomLinks>
            <BottomLink href="#">Privacy</BottomLink>
            <BottomLink href="#">Terms</BottomLink>
          </BottomLinks>
        </Bottom>
      </Inner>
    </Wrap>
  );
}

const Wrap = styled.footer`
  background: ${({ theme }) => theme.bgSurface};
  border-top: 1px solid ${({ theme }) => theme.border};
  background-image: ${({ theme }) => theme.gradientFooter};
`;
const Inner = styled.div`max-width: 1240px; margin: 0 auto; padding: 64px 24px 32px;`;
const Top = styled.div`
  display: grid; grid-template-columns: 270px 1fr; gap: 64px; margin-bottom: 48px;
  @media (max-width: 880px) { grid-template-columns: 1fr; gap: 40px; }
`;
const Brand = styled.div`display: flex; flex-direction: column; gap: 16px;`;
const Desc = styled.p`
  font-family: 'Sora', sans-serif; font-size: 13px; line-height: 1.75;
  color: ${({ theme }) => theme.textSecondary}; max-width: 230px;
`;
const Badges = styled.div`display: flex; flex-wrap: wrap; gap: 7px;`;
const Badge = styled.span<{ $color: 'teal' | 'blue' | 'amber' }>`
  font-family: 'DM Mono', monospace; font-size: 10px; padding: 3px 9px; border-radius: 20px;
  border: 1px solid ${({ theme, $color }) => theme[$color]};
  color: ${({ theme, $color }) => theme[$color]};
  background: ${({ theme, $color }) => theme[`${$color}Dim` as keyof typeof theme] as string};
`;
const Cols = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;
  @media (max-width: 680px) { grid-template-columns: repeat(2, 1fr); }
`;
const Col = styled.div`display: flex; flex-direction: column; gap: 9px;`;
const ColTitle = styled.div`
  font-family: 'Sora', sans-serif; font-size: 11.5px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted}; margin-bottom: 4px;
`;
const linkCss = `
  font-family: 'Sora', sans-serif; font-size: 13px; text-decoration: none;
  width: fit-content; transition: color 0.15s;
`;
const ColInt = styled(Link)`
  ${linkCss}
  color: ${({ theme }) => theme.textSecondary};
  &:hover { color: ${({ theme }) => theme.teal}; }
`;
const ColExt = styled.a`
  ${linkCss}
  color: ${({ theme }) => theme.textSecondary};
  &:hover { color: ${({ theme }) => theme.teal}; }
`;
const Bottom = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 24px; border-top: 1px solid ${({ theme }) => theme.border};
  flex-wrap: wrap; gap: 12px;
`;
const Copyright = styled.p`
  font-family: 'DM Mono', monospace; font-size: 11px;
  color: ${({ theme }) => theme.textMuted};
`;
const BottomLinks = styled.div`display: flex; gap: 20px;`;
const BottomLink = styled.a`
  font-family: 'DM Mono', monospace; font-size: 11px;
  color: ${({ theme }) => theme.textMuted}; text-decoration: none;
  &:hover { color: ${({ theme }) => theme.teal}; }
`;

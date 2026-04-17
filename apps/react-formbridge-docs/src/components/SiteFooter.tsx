'use client';

import { libraryInfo } from '@/data/site';
import { getDocsLandingHref } from '@/lib/docs';

import Link from 'next/link';
import styled from 'styled-components';

const changelogUrl = `${libraryInfo.monorepoUrl.replace('/tree/main/', '/blob/main/')}/CHANGELOG.md`;

export function SiteFooter() {
  const docsHref = getDocsLandingHref();

  return (
    <Footer>
      <FooterInner className="shell">
        <FooterGrid>
          <FooterBrand>
            <FooterLabel>react-formbridge</FooterLabel>
            <p>
              Schema-first form architecture for React and React Native engineering teams.
            </p>
          </FooterBrand>

          <FooterColumn>
            <FooterHeading>Source</FooterHeading>
            <FooterList>
              <li>
                <a
                  href={libraryInfo.githubUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub repository
                </a>
              </li>
              <li>
                <a
                  href={libraryInfo.npmUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  npm package
                </a>
              </li>
            </FooterList>
          </FooterColumn>

          <FooterColumn>
            <FooterHeading>Developer</FooterHeading>
            <FooterList>
              <li>
                <Link href={docsHref}>Documentation</Link>
              </li>
              <li>
                <Link href="/feedback">Feedback</Link>
              </li>
              <li>
                <a
                  href={changelogUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Changelog
                </a>
              </li>
              <li>
                <a
                  href={libraryInfo.repoIssuesUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Issues
                </a>
              </li>
            </FooterList>
          </FooterColumn>

          <FooterColumn>
            <FooterHeading>License</FooterHeading>
            <FooterMeta>MIT License</FooterMeta>
            <FooterMeta>© 2026 React FormBridge Engineering</FooterMeta>
          </FooterColumn>
        </FooterGrid>
      </FooterInner>
    </Footer>
  );
}

const Footer = styled.footer`
  margin-top: 80px;
  border-top: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.footerBg};

  @media (max-width: 720px) {
    margin-top: 64px;
  }
`;

const FooterInner = styled.div`
  padding: 30px 0 36px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) repeat(3, minmax(0, 1fr));
  gap: 24px 32px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 18px;
  }
`;

const FooterBrand = styled.div`
  p {
    margin: 10px 0 0;
    max-width: 28ch;
    color: ${({ theme }) => theme.textSoft};
    line-height: 1.72;
  }
`;

const FooterLabel = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textMuted};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const FooterColumn = styled.div`
  display: grid;
  align-content: start;
  gap: 10px;
`;

const FooterHeading = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.textMuted};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const FooterList = styled.ul`
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;

  a {
    color: ${({ theme }) => theme.textSoft};
    font-size: 14px;
    font-weight: 600;
    transition: color 160ms ease;

    &:hover {
      color: ${({ theme }) => theme.accent};
    }
  }
`;

const FooterMeta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textSoft};
  font-size: 14px;
  line-height: 1.68;
`;

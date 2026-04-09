/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: structured data for SEO */
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { redirect, useParams } from 'next/navigation';
import styled from 'styled-components';
import { CodeBlock } from '../../../components/CodeBlock';
import { VersionSelector } from '../../../components/VersionSelector';
import { useApp } from '../../../context/AppContext';
import { DOCS } from '../../../data/docs';
import { LIBRARIES } from '../../../data/libraries';
import type {
  CodeSnippet,
  DocPreview,
  DocSection,
  LibColor,
  VersionOverride,
} from '../../../types';

/** Compare two semver strings. Returns true if `a` <= `b`. */
function semverLte(a: string, b: string): boolean {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) < (pb[i] ?? 0)) return true;
    if ((pa[i] ?? 0) > (pb[i] ?? 0)) return false;
  }
  return true;
}

/**
 * Pick the best override whose `since` is the highest <= `version`.
 * Returns undefined when no override matches.
 */
function pickOverride(
  overrides: VersionOverride[],
  version: string,
): VersionOverride | undefined {
  return overrides
    .filter((o) => semverLte(o.since, version))
    .sort((a, b) => (semverLte(a.since, b.since) ? 1 : -1))[0];
}

/**
 * Return a resolved copy of a section for a given version:
 *  - applies the best-matching versionOverride (content / code / codeTabs)
 *  - filters out subsections not yet available in that version
 *  - recurses into surviving subsections
 */
function resolveSection(section: DocSection, version: string): DocSection {
  const override = section.versionOverrides?.length
    ? pickOverride(section.versionOverrides, version)
    : undefined;

  const resolved: DocSection = {
    ...section,
    content: override?.content ?? section.content,
    code: override?.code !== undefined ? override.code : section.code,
    codeTabs: override?.codeTabs !== undefined ? override.codeTabs : section.codeTabs,
  };

  if (section.subsections) {
    resolved.subsections = section.subsections
      .filter((sub) => !sub.since || semverLte(sub.since, version))
      .map((sub) => resolveSection(sub, version));
  }

  return resolved;
}

export default function LibraryDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { t } = useApp();

  const lib = LIBRARIES.find((l) => l.id === id);
  const doc = id ? DOCS[id] : undefined;

  if (lib?.docsUrl) {
    redirect(lib.docsUrl);
  }

  const [activeSection, setActiveSection] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');

  useEffect(() => {
    if (doc?.versions[0]) setSelectedVersion(doc.versions[0]);
  }, [doc]);

  useEffect(() => {
    if (doc?.sections[0]) setActiveSection(doc.sections[0].id);
  }, [doc]);

  if (!lib || !doc) {
    redirect('/libraries');
  }

  const isSectionVisible = useCallback(
    (section: DocSection) => !section.since || semverLte(section.since, selectedVersion),
    [selectedVersion],
  );

  const visibleSections = useMemo(
    () => doc.sections.filter(isSectionVisible),
    [doc.sections, isSectionVisible],
  );

  const visibleSectionIds = useMemo(
    () => new Set(visibleSections.map((s) => s.id)),
    [visibleSections],
  );

  const handleVersionChange = useCallback(
    (version: string) => {
      setSelectedVersion(version);
      const firstVisible = doc.sections.find(
        (s) => !s.since || semverLte(s.since, version),
      );
      if (firstVisible) setActiveSection(firstVisible.id);
    },
    [doc.sections],
  );

  const rawSection =
    visibleSections.find((s) => s.id === activeSection) || visibleSections[0];
  const currentSection = rawSection
    ? resolveSection(rawSection, selectedVersion)
    : undefined;
  const isOverviewSection = currentSection?.id === doc.sections[0]?.id;
  const librarySummary =
    lib.id === 'walkit'
      ? 'Use react-walkit to build React and React Native product tours, onboarding walkthroughs, spotlight overlays, contextual tooltips and feature discovery flows from one shared API.'
      : 'Use react-formbridge to build schema-driven React and React Native forms with shared validation, typed fields, multi-step flows and reusable form UI from one TypeScript schema.';
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://runilib.dev',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Libraries',
        item: 'https://runilib.dev/libraries',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: lib.name,
        item: `https://runilib.dev/libraries/${lib.id}`,
      },
    ],
  };
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: lib.name,
    description: `${lib.desc} ${librarySummary}`,
    url: `https://runilib.dev/libraries/${lib.id}`,
    codeRepository: lib.githubUrl,
    downloadUrl: lib.npmUrl,
    license: 'https://opensource.org/licenses/MIT',
    programmingLanguage: ['TypeScript', 'React', 'React Native'],
    runtimePlatform: ['Browser', 'React Native'],
    keywords: lib.tags.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Wrap>
        <Sidebar>
          <SidebarTop>
            <BackLink href="/libraries">
              ← {t.libraryPage.back.replace('← ', '')}
            </BackLink>
            <LibHeader>
              <LibIconBig $color={lib.color}>{lib.icon}</LibIconBig>
              <LibNameBig>{lib.name}</LibNameBig>
              <LibVer>{lib.version}</LibVer>
              <StatusChip $status={lib.status}>
                {lib.status === 'stable' ? t.libraryPage.stable : t.libraryPage.beta}
              </StatusChip>
            </LibHeader>
            <InstallBox>
              <InstallLabel>{t.libraryPage.install}</InstallLabel>
              <InstallCode>{lib.install}</InstallCode>
            </InstallBox>
            <LibLinks>
              <LibLink
                href={lib.npmUrl}
                target="_blank"
                rel="noopener"
              >
                <NpmIcon /> npm
              </LibLink>
              <LibLink
                href={lib.githubUrl}
                target="_blank"
                rel="noopener"
              >
                <GhIcon /> GitHub
              </LibLink>
            </LibLinks>
            {doc.versions.length > 1 && (
              <VersionWrap>
                <VersionSelector
                  key={doc.libId}
                  versions={doc.versions}
                  defaultVersion={doc.versions[0]}
                  onChange={handleVersionChange}
                />
              </VersionWrap>
            )}
          </SidebarTop>
          <SidebarNav>
            {doc.sidebar.map((group) => {
              const items = group.items.filter((item) => visibleSectionIds.has(item.id));
              if (items.length === 0) return null;
              return (
                <NavGroup key={group.group}>
                  <NavGroupLabel $color={group.color}>{group.group}</NavGroupLabel>
                  {items.map((item) => (
                    <NavItem
                      key={item.id}
                      $active={activeSection === item.id}
                      onClick={() => setActiveSection(item.id)}
                    >
                      {item.label}
                    </NavItem>
                  ))}
                </NavGroup>
              );
            })}
          </SidebarNav>
        </Sidebar>
        <Main>
          <Content>
            {isOverviewSection ? (
              <LibraryIntro>
                <Breadcrumbs>
                  <BreadcrumbLink href="/">RUNILIB</BreadcrumbLink>
                  <BreadcrumbDivider>/</BreadcrumbDivider>
                  <BreadcrumbLink href="/libraries">Libraries</BreadcrumbLink>
                  <BreadcrumbDivider>/</BreadcrumbDivider>
                  <BreadcrumbCurrent>{lib.name}</BreadcrumbCurrent>
                </Breadcrumbs>
                <IntroEyebrow>{lib.tagline}</IntroEyebrow>
                <PageTitle>{lib.name}</PageTitle>
                <IntroText>{lib.desc}</IntroText>
                <IntroText>{librarySummary}</IntroText>
                <IntroTags>
                  {lib.tags.map((tag) => (
                    <IntroTag key={tag}>{tag}</IntroTag>
                  ))}
                </IntroTags>
                <IntroActions>
                  <IntroInstall>{lib.install}</IntroInstall>
                  <IntroActionGroup>
                    <PrimaryAction
                      href={lib.npmUrl}
                      target="_blank"
                      rel="noopener"
                    >
                      <NpmIcon /> npm
                    </PrimaryAction>
                    <SecondaryAction
                      href={lib.githubUrl}
                      target="_blank"
                      rel="noopener"
                    >
                      <GhIcon /> GitHub
                    </SecondaryAction>
                  </IntroActionGroup>
                </IntroActions>
              </LibraryIntro>
            ) : null}
            {currentSection && <SectionView section={currentSection} />}
            <BottomNav>
              {(() => {
                const allIds = visibleSections.map((s) => s.id);
                const idx = allIds.indexOf(activeSection);
                const prev = idx > 0 ? visibleSections[idx - 1] : null;
                const next =
                  idx < visibleSections.length - 1 ? visibleSections[idx + 1] : null;
                return (
                  <>
                    {prev ? (
                      <NavChevBtn onClick={() => setActiveSection(prev.id)}>
                        ← {prev.title}
                      </NavChevBtn>
                    ) : (
                      <div />
                    )}
                    {next ? (
                      <NavChevBtn
                        onClick={() => setActiveSection(next.id)}
                        $right
                      >
                        {next.title} →
                      </NavChevBtn>
                    ) : (
                      <div />
                    )}
                  </>
                );
              })()}
            </BottomNav>
          </Content>
        </Main>
      </Wrap>
    </>
  );
}

function SectionView({ section }: { section: DocSection }) {
  return (
    <SectionWrap>
      <SectionEyebrow>Guide section</SectionEyebrow>
      <SectionTitle>{section.title}</SectionTitle>
      {section.content && <ContentBody>{renderRichText(section.content)}</ContentBody>}
      <CodeArea
        code={section.code}
        codeTabs={section.codeTabs}
      />
      {section.subsections?.map((sub) => (
        <SubSection key={sub.id}>
          <SubTitle>{sub.title}</SubTitle>
          {sub.content && <SubContent>{renderRichText(sub.content)}</SubContent>}
          <CodeArea
            code={sub.code}
            codeTabs={sub.codeTabs}
          />
        </SubSection>
      ))}
    </SectionWrap>
  );
}

function CodeArea({ code, codeTabs }: { code?: CodeSnippet; codeTabs?: CodeSnippet[] }) {
  if (codeTabs?.length) return <TabbedCode snippets={codeTabs} />;
  if (code) {
    return (
      <>
        <CodeWrap>
          <CodeBlock
            code={code.code}
            lang={code.lang}
            filename={code.filename}
            maxHeight={code.maxHeight}
          />
        </CodeWrap>
        <PreviewArea preview={code.preview} />
      </>
    );
  }
  return null;
}

function TabbedCode({ snippets }: { snippets: CodeSnippet[] }) {
  const [active, setActive] = React.useState(0);
  const current = snippets[active];
  return (
    <TabWrap>
      <TabBar>
        {snippets.map((snip, idx) => (
          <TabButton
            key={snip.filename}
            $active={idx === active}
            onClick={() => setActive(idx)}
          >
            {snip.label ?? snip.filename}
          </TabButton>
        ))}
      </TabBar>
      <CodeWrap>
        <CodeBlock
          code={current.code}
          lang={current.lang}
          filename={current.filename}
          maxHeight={current.maxHeight}
        />
      </CodeWrap>
      <PreviewArea preview={current.preview} />
    </TabWrap>
  );
}

function PreviewArea({ preview }: { preview?: DocPreview }) {
  if (!preview) return null;
  return (
    <PreviewWrap>
      <PreviewEyebrow>Example preview</PreviewEyebrow>
      <PreviewFrame>
        {preview.video ? (
          <PreviewVideo
            src={preview.src}
            autoPlay
            loop
            muted
            playsInline
            $maxWidth={preview.maxWidth}
            $maxHeight={preview.maxHeight}
          />
        ) : (
          <PreviewImage
            src={preview.src}
            alt={preview.alt}
            loading="lazy"
            $maxWidth={preview.maxWidth}
            $maxHeight={preview.maxHeight}
          />
        )}
      </PreviewFrame>
      {preview.caption ? <PreviewCaption>{preview.caption}</PreviewCaption> : null}
    </PreviewWrap>
  );
}

function renderInlineText(text: string): React.ReactNode[] {
  return text
    .split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**'))
        return <strong key={`${part}-${index.toString()}`}>{part.slice(2, -2)}</strong>;
      if (part.startsWith('`') && part.endsWith('`'))
        return (
          <InlineCode key={`${part}-${index.toString()}`}>{part.slice(1, -1)}</InlineCode>
        );
      return <React.Fragment key={`${part}-${index.toString()}`}>{part}</React.Fragment>;
    });
}

type RichTextBlock =
  | { type: 'code'; lang?: string; code: string }
  | { type: 'text'; lines: string[] };

type TextSegment =
  | { type: 'bullet'; items: string[] }
  | { type: 'ordered'; items: string[] }
  | { type: 'paragraph'; lines: string[] };

function parseRichTextBlocks(content: string): RichTextBlock[] {
  const lines = content.trim().split('\n');
  const blocks: RichTextBlock[] = [];
  let textBuffer: string[] = [];
  let codeBuffer: string[] = [];
  let codeLang: string | undefined;
  let inCodeBlock = false;
  const flushText = () => {
    const normalized = textBuffer.map((line) => line.trim()).filter(Boolean);
    if (normalized.length > 0) blocks.push({ type: 'text', lines: normalized });
    textBuffer = [];
  };
  const flushCode = () => {
    blocks.push({ type: 'code', lang: codeLang, code: codeBuffer.join('\n').trimEnd() });
    codeBuffer = [];
    codeLang = undefined;
  };
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        flushCode();
        inCodeBlock = false;
      } else {
        flushText();
        codeLang = trimmed.slice(3).trim() || undefined;
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }
    if (trimmed === '') {
      flushText();
      continue;
    }
    textBuffer.push(line);
  }
  if (inCodeBlock) flushCode();
  else flushText();
  return blocks;
}

function splitTextSegments(lines: string[]): TextSegment[] {
  const segments: TextSegment[] = [];
  let paragraphBuffer: string[] = [];
  let bulletBuffer: string[] = [];
  let orderedBuffer: string[] = [];

  const flushParagraph = () => {
    const normalized = paragraphBuffer.map((line) => line.trim()).filter(Boolean);
    if (normalized.length > 0) segments.push({ type: 'paragraph', lines: normalized });
    paragraphBuffer = [];
  };
  const flushBullets = () => {
    const normalized = bulletBuffer.map((line) => line.trim()).filter(Boolean);
    if (normalized.length > 0) segments.push({ type: 'bullet', items: normalized });
    bulletBuffer = [];
  };
  const flushOrdered = () => {
    const normalized = orderedBuffer.map((line) => line.trim()).filter(Boolean);
    if (normalized.length > 0) segments.push({ type: 'ordered', items: normalized });
    orderedBuffer = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ')) {
      flushParagraph();
      flushOrdered();
      bulletBuffer.push(trimmed.slice(2));
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph();
      flushBullets();
      orderedBuffer.push(trimmed.replace(/^\d+\.\s/, ''));
      continue;
    }

    flushBullets();
    flushOrdered();
    paragraphBuffer.push(trimmed);
  }

  flushParagraph();
  flushBullets();
  flushOrdered();

  return segments;
}

function parseRecipeItem(text: string): { label: string; example: string } | null {
  const [label, ...rest] = text.split('→');
  if (!label || rest.length === 0) return null;

  const exampleRaw = rest.join('→').trim();
  if (!(exampleRaw.startsWith('`') && exampleRaw.endsWith('`'))) return null;

  return {
    label: label.trim(),
    example: exampleRaw.slice(1, -1),
  };
}

function renderRichText(content: string): React.ReactNode {
  return parseRichTextBlocks(content).map((block, index) => {
    if (block.type === 'code')
      return (
        <CodeWrap key={`code-${index.toString()}`}>
          <CodeBlock
            code={block.code}
            lang={block.lang ?? 'tsx'}
          />
        </CodeWrap>
      );
    return splitTextSegments(block.lines).map((segment, segmentIndex) => {
      if (segment.type === 'bullet') {
        const recipes = segment.items.map(parseRecipeItem);
        const recipeItems = recipes.filter(
          (recipe): recipe is { label: string; example: string } => Boolean(recipe),
        );

        if (recipeItems.length === segment.items.length)
          return (
            <RecipeList key={`recipe-${index.toString()}-${segmentIndex.toString()}`}>
              {recipeItems.map((recipe, recipeIndex) => (
                <RecipeCard key={`recipe-item-${recipeIndex.toString()}`}>
                  <RecipeLabel>{renderInlineText(recipe.label)}</RecipeLabel>
                  <RecipeExample>{recipe.example}</RecipeExample>
                </RecipeCard>
              ))}
            </RecipeList>
          );

        return (
          <BulletList key={`list-${index.toString()}-${segmentIndex.toString()}`}>
            {segment.items.map((item, itemIndex) => (
              <li key={`item-${itemIndex.toString()}`}>{renderInlineText(item)}</li>
            ))}
          </BulletList>
        );
      }

      if (segment.type === 'ordered')
        return (
          <OrderedList key={`ordered-${index.toString()}-${segmentIndex.toString()}`}>
            {segment.items.map((item, itemIndex) => (
              <li key={`item-${itemIndex.toString()}`}>{renderInlineText(item)}</li>
            ))}
          </OrderedList>
        );

      return (
        <p key={`para-${index.toString()}-${segmentIndex.toString()}`}>
          {segment.lines.map((line, lineIndex) => (
            <React.Fragment key={`line-${lineIndex.toString()}`}>
              {lineIndex > 0 ? <br /> : null}
              {renderInlineText(line)}
            </React.Fragment>
          ))}
        </p>
      );
    });
  });
}

function NpmIcon() {
  return (
    <svg
      aria-label="image"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456l-.01 10.382H5.13z" />
    </svg>
  );
}
function GhIcon() {
  return (
    <svg
      aria-label="image"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const Wrap = styled.div`padding-top: 64px; min-height: 100vh; display: grid; grid-template-columns: 280px 1fr; @media (max-width: 900px) { grid-template-columns: 1fr; }`;
const Sidebar = styled.aside`background: ${({ theme }) => theme.bgSurface}; border-right: 1px solid ${({ theme }) => theme.border}; position: sticky; top: 64px; height: calc(100vh - 64px); overflow: hidden; display: flex; flex-direction: column; @media (max-width: 900px) { display: none; }`;
const SidebarTop = styled.div`padding: 24px 20px 16px; border-bottom: 1px solid ${({ theme }) => theme.border};`;
const BackLink = styled(
  Link,
)`font-family: 'DM Mono', monospace; font-size: 11px; color: ${({ theme }) => theme.textMuted}; text-decoration: none; display: block; margin-bottom: 16px; letter-spacing: 0.05em; &:hover { color: ${({ theme }) => theme.teal}; }`;
const LibHeader = styled.div`display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;`;
const LibIconBig = styled.div<{
  $color: LibColor;
}>`font-size: 22px; width: 38px; height: 38px; border-radius: 10px; background: ${({ theme, $color }) => theme[`${$color}Dim` as keyof typeof theme] as string}; display: flex; align-items: center; justify-content: center;`;
const LibNameBig = styled.div`font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 800; color: ${({ theme }) => theme.textPrimary};`;
const LibVer = styled.div`font-family: 'DM Mono', monospace; font-size: 9.5px; color: ${({ theme }) => theme.textMuted}; padding: 2px 6px; background: ${({ theme }) => theme.border}; border-radius: 3px;`;
const StatusChip = styled.div<{
  $status: string;
}>`font-family: 'DM Mono', monospace; font-size: 9.5px; padding: 2px 7px; border-radius: 10px; ${({ theme, $status }) => ($status === 'stable' ? `background:${theme.greenDim};color:${theme.green};border:1px solid ${theme.green}33;` : `background:${theme.amberDim};color:${theme.amber};border:1px solid ${theme.amber}33;`)}`;
const InstallBox = styled.div`background: ${({ theme }) => theme.bgCodeBlock}; border: 1px solid ${({ theme }) => theme.borderCode}; border-radius: 8px; padding: 10px 12px; margin-bottom: 12px;`;
const InstallLabel = styled.div`font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: ${({ theme }) => theme.textMuted}; margin-bottom: 4px;`;
const InstallCode = styled.code`font-family: 'DM Mono', monospace; font-size: 12px; color: #cdd9e5;`;
const LibLinks = styled.div`display: flex; gap: 8px;`;
const LibLink = styled.a`display: inline-flex; align-items: center; gap: 5px; font-family: 'DM Mono', monospace; font-size: 11px; padding: 5px 10px; border-radius: 6px; border: 1px solid ${({ theme }) => theme.border}; color: ${({ theme }) => theme.textSecondary}; text-decoration: none; transition: all 0.15s; &:hover { border-color: ${({ theme }) => theme.teal}; color: ${({ theme }) => theme.teal}; }`;
const VersionWrap = styled.div`margin-top: 14px; padding-top: 12px; border-top: 1px solid ${({ theme }) => theme.border};`;
const SidebarNav = styled.nav`padding: 16px 16px 24px; flex: 1; overflow-y: auto; scrollbar-width: thin;`;
const NavGroup = styled.div`margin-bottom: 20px;`;
const NavGroupLabel = styled.div<{
  $color?: LibColor;
}>`font-family: 'DM Mono', monospace; font-size: 9.5px; letter-spacing: 0.22em; text-transform: uppercase; padding: 0 10px 6px; color: ${({ theme, $color }) => ($color ? (theme[$color as keyof typeof theme] as string) : theme.textMuted)};`;
const NavItem = styled.button<{
  $active: boolean;
}>`display: block; width: 100%; text-align: left; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: ${({ $active }) => ($active ? '600' : '400')}; padding: 7px 10px; border-radius: 7px; border: none; cursor: pointer; background: ${({ theme, $active }) => ($active ? theme.tealDim : 'transparent')}; color: ${({ theme, $active }) => ($active ? theme.teal : theme.textSecondary)}; transition: all 0.15s; &:hover { background: ${({ theme }) => theme.tealDim}; color: ${({ theme }) => theme.textPrimary}; }`;
const Main = styled.main`min-width: 0;`;
const Content = styled.div`max-width: 800px; margin: 0 auto; padding: 48px 32px 80px; @media (max-width: 640px) { padding: 32px 20px 64px; }`;
const LibraryIntro = styled.section`margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid ${({ theme }) => theme.border};`;
const Breadcrumbs = styled.nav`display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;`;
const BreadcrumbLink = styled(
  Link,
)`font-family: 'DM Mono', monospace; font-size: 11px; color: ${({ theme }) => theme.textMuted}; text-decoration: none; &:hover { color: ${({ theme }) => theme.teal}; }`;
const BreadcrumbDivider = styled.span`font-family: 'DM Mono', monospace; font-size: 11px; color: ${({ theme }) => theme.textMuted};`;
const BreadcrumbCurrent = styled.span`font-family: 'DM Mono', monospace; font-size: 11px; color: ${({ theme }) => theme.teal};`;
const IntroEyebrow = styled.div`font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: ${({ theme }) => theme.teal}; margin-bottom: 12px;`;
const PageTitle = styled.h1`font-family: 'Sora', sans-serif; font-size: clamp(32px, 5vw, 46px); font-weight: 800; line-height: 1.1; letter-spacing: -0.6px; color: ${({ theme }) => theme.textPrimary}; margin-bottom: 14px;`;
const IntroText = styled.p`font-family: 'Sora', sans-serif; font-size: 15.5px; line-height: 1.8; color: ${({ theme }) => theme.textSecondary}; margin-bottom: 12px;`;
const IntroTags = styled.div`display: flex; flex-wrap: wrap; gap: 8px; margin: 20px 0 24px;`;
const IntroTag = styled.span`font-family: 'DM Mono', monospace; font-size: 10.5px; padding: 4px 9px; border-radius: 999px; color: ${({ theme }) => theme.teal}; background: ${({ theme }) => theme.tealDim}; border: 1px solid ${({ theme }) => theme.teal}22;`;
const IntroActions = styled.div`display: flex; flex-direction: column; gap: 14px;`;
const IntroInstall = styled.code`display: inline-flex; width: fit-content; max-width: 100%; font-family: 'DM Mono', monospace; font-size: 12px; color: #cdd9e5; padding: 10px 12px; border-radius: 10px; border: 1px solid ${({ theme }) => theme.borderCode}; background: ${({ theme }) => theme.bgCodeBlock}; overflow-x: auto;`;
const IntroActionGroup = styled.div`display: flex; gap: 10px; flex-wrap: wrap;`;
const PrimaryAction = styled.a`display: inline-flex; align-items: center; gap: 7px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700; padding: 10px 16px; border-radius: 10px; text-decoration: none; background: ${({ theme }) => theme.teal}; color: #080a0e; transition: all 0.18s; &:hover { opacity: 0.92; transform: translateY(-1px); }`;
const SecondaryAction = styled.a`display: inline-flex; align-items: center; gap: 7px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; padding: 10px 16px; border-radius: 10px; text-decoration: none; border: 1px solid ${({ theme }) => theme.border}; color: ${({ theme }) => theme.textSecondary}; transition: all 0.18s; &:hover { border-color: ${({ theme }) => theme.teal}; color: ${({ theme }) => theme.teal}; }`;
const SectionWrap = styled.section``;
const SectionEyebrow = styled.div`font-family: 'DM Mono', monospace; font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; color: ${({ theme }) => theme.textMuted}; margin-bottom: 10px;`;
const SectionTitle = styled.h2`font-family: 'Sora', sans-serif; font-size: clamp(22px, 3.5vw, 34px); font-weight: 800; color: ${({ theme }) => theme.textPrimary}; margin-bottom: 18px; letter-spacing: -0.3px;`;
const ContentBody = styled.div`font-family: 'Sora', sans-serif; font-size: 15.5px; line-height: 1.8; color: ${({ theme }) => theme.textSecondary}; margin-bottom: 24px; p { margin-bottom: 10px; } strong { color: ${({ theme }) => theme.textPrimary}; font-weight: 600; }`;
const InlineCode = styled.code`font-family: 'DM Mono', monospace; font-size: 0.92em; padding: 2px 6px; border-radius: 6px; color: ${({ theme }) => theme.textCode}; background: ${({ theme }) => theme.bgCodeBlock}; border: 1px solid ${({ theme }) => theme.borderCode};`;
const BulletList = styled.ul`margin: 0 0 14px 18px; padding: 0; display: flex; flex-direction: column; gap: 8px;`;
const OrderedList = styled.ol`margin: 0 0 14px 18px; padding: 0; display: flex; flex-direction: column; gap: 8px;`;
const RecipeList = styled.div`display: grid; gap: 12px; margin: 12px 0 18px;`;
const RecipeCard = styled.div`padding: 14px 16px; border-radius: 14px; border: 1px solid ${({ theme }) => theme.border}; background: linear-gradient(180deg, ${({ theme }) => theme.bgCard}, ${({ theme }) => theme.bgSurface}); box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);`;
const RecipeLabel = styled.div`font-family: 'Sora', sans-serif; font-size: 13px; line-height: 1.7; color: ${({ theme }) => theme.textSecondary}; margin-bottom: 10px; strong { color: ${({ theme }) => theme.textPrimary}; }`;
const RecipeExample = styled.pre`margin: 0; padding: 12px 14px; border-radius: 10px; border: 1px solid ${({ theme }) => theme.borderCode}; background: ${({ theme }) => theme.bgCodeBlock}; color: ${({ theme }) => theme.textCode}; font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; overflow-x: auto;`;
const CodeWrap = styled.div`margin-bottom: 28px;`;
const TabWrap = styled.div`margin-bottom: 28px;`;
const PreviewWrap = styled.div`margin: -10px 0 28px;`;
const PreviewEyebrow = styled.div`font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: ${({ theme }) => theme.textMuted}; margin-bottom: 10px;`;
const PreviewFrame = styled.figure`margin: 0; padding: 12px; border-radius: 16px; border: 1px solid ${({ theme }) => theme.border}; background: radial-gradient(circle at top left, rgba(74, 222, 192, 0.08), transparent 42%), ${({ theme }) => theme.bgCard}; box-shadow: 0 20px 48px rgba(0, 0, 0, 0.16); display: flex; justify-content: center;`;
const PreviewImage = styled.img<{
  $maxWidth?: number;
  $maxHeight?: number;
}>`width: 100%; max-width: ${({ $maxWidth }) => ($maxWidth ? `${$maxWidth}px` : '820px')}; max-height: ${({ $maxHeight }) => ($maxHeight ? `${$maxHeight}px` : '480px')}; height: auto; display: block; border-radius: 12px; border: 1px solid ${({ theme }) => theme.borderCode}; background: ${({ theme }) => theme.bgCodeBlock}; object-fit: contain; margin: 0 auto;`;
const PreviewVideo = styled.video<{
  $maxWidth?: number;
  $maxHeight?: number;
}>`width: 100%; max-width: ${({ $maxWidth }) => ($maxWidth ? `${$maxWidth}px` : '820px')}; max-height: ${({ $maxHeight }) => ($maxHeight ? `${$maxHeight}px` : '480px')}; height: auto; display: block; border-radius: 12px; border: 1px solid ${({ theme }) => theme.borderCode}; background: ${({ theme }) => theme.bgCodeBlock}; object-fit: contain; margin: 0 auto;`;
const PreviewCaption = styled.figcaption`margin-top: 10px; font-family: 'Sora', sans-serif; font-size: 12.5px; line-height: 1.6; color: ${({ theme }) => theme.textMuted};`;
const TabBar = styled.div`display: inline-flex; gap: 8px; margin-bottom: 10px; border: 1px solid ${({ theme }) => theme.border}; border-radius: 10px; padding: 6px; background: ${({ theme }) => theme.bgCard};`;
const TabButton = styled.button<{
  $active: boolean;
}>`font-family: 'DM Mono', monospace; font-size: 11.5px; padding: 8px 12px; border-radius: 8px; border: 1px solid ${({ theme, $active }) => ($active ? theme.teal : theme.border)}; background: ${({ theme, $active }) => ($active ? theme.tealDim : 'transparent')}; color: ${({ theme, $active }) => ($active ? theme.teal : theme.textSecondary)}; cursor: pointer; transition: all 0.15s; &:hover { border-color: ${({ theme }) => theme.teal}; color: ${({ theme }) => theme.teal}; }`;
const SubSection = styled.div`margin-top: 32px; padding-top: 28px; border-top: 1px solid ${({ theme }) => theme.border};`;
const SubTitle = styled.h3`font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700; color: ${({ theme }) => theme.textPrimary}; margin-bottom: 12px;`;
const SubContent = styled.div`font-family: 'Sora', sans-serif; font-size: 14.5px; line-height: 1.78; color: ${({ theme }) => theme.textSecondary}; margin-bottom: 16px; p { margin-bottom: 10px; } strong { color: ${({ theme }) => theme.textPrimary}; font-weight: 600; }`;
const BottomNav = styled.div`display: flex; justify-content: space-between; margin-top: 56px; padding-top: 24px; border-top: 1px solid ${({ theme }) => theme.border};`;
const NavChevBtn = styled.button<{
  $right?: boolean;
}>`font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: 9px; border: 1px solid ${({ theme }) => theme.border}; background: transparent; color: ${({ theme }) => theme.textSecondary}; cursor: pointer; transition: all 0.18s; margin-left: ${({ $right }) => ($right ? 'auto' : '0')}; &:hover { border-color: ${({ theme }) => theme.teal}; color: ${({ theme }) => theme.teal}; background: ${({ theme }) => theme.tealDim}; }`;

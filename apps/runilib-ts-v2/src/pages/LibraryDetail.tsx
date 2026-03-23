import React, { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import { CodeBlock } from '../components/CodeBlock'
import { useApp } from '../context/AppContext'
import { LIBRARIES } from '../data/libraries'
import { DOCS } from '../data/docs'
import type { LibColor, DocSection } from '../types'

export function LibraryDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useApp()

  const lib = LIBRARIES.find(l => l.id === id)
  const doc = id ? DOCS[id] : undefined

  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    if (doc?.sections[0]) setActiveSection(doc.sections[0].id)
  }, [id, doc])

  if (!lib || !doc) return <Navigate to="/libraries" replace />

  const currentSection = doc.sections.find(s => s.id === activeSection) || doc.sections[0]

  return (
    <Wrap>
      {/* Sidebar */}
      <Sidebar>
        <SidebarTop>
          <BackLink to="/libraries">
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
            <LibLink href={lib.npmUrl} target="_blank" rel="noopener">
              <NpmIcon /> npm
            </LibLink>
            <LibLink href={lib.githubUrl} target="_blank" rel="noopener">
              <GhIcon /> GitHub
            </LibLink>
          </LibLinks>
        </SidebarTop>

        <SidebarNav>
          {doc.sidebar.map(group => (
            <NavGroup key={group.group}>
              <NavGroupLabel $color={group.color}>{group.group}</NavGroupLabel>
              {group.items.map(item => (
                <NavItem
                  key={item.id}
                  $active={activeSection === item.id}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.label}
                </NavItem>
              ))}
            </NavGroup>
          ))}
        </SidebarNav>
      </Sidebar>

      {/* Main content */}
      <Main>
        <Content>
          {currentSection && <SectionView section={currentSection} libColor={lib.color} />}

          {/* Bottom nav */}
          <BottomNav>
            {(() => {
              const allIds = doc.sections.map(s => s.id)
              const idx    = allIds.indexOf(activeSection)
              const prev   = idx > 0 ? doc.sections[idx - 1] : null
              const next   = idx < doc.sections.length - 1 ? doc.sections[idx + 1] : null
              return (
                <>
                  {prev
                    ? <NavChevBtn onClick={() => setActiveSection(prev.id)}>
                        ← {prev.title}
                      </NavChevBtn>
                    : <div />}
                  {next
                    ? <NavChevBtn onClick={() => setActiveSection(next.id)} $right>
                        {next.title} →
                      </NavChevBtn>
                    : <div />}
                </>
              )
            })()}
          </BottomNav>
        </Content>
      </Main>
    </Wrap>
  )
}

// ── Section renderer ──────────────────────────────────────────

function SectionView({ section, libColor }: { section: DocSection; libColor: LibColor }) {
  return (
    <SectionWrap>
      <SectionTitle>{section.title}</SectionTitle>
      {section.content && (
        <ContentBody>
          {section.content.split('\n\n').map((para, i) => {
            if (para.startsWith('**') && para.endsWith('**')) {
              return <p key={i}><strong>{para.slice(2, -2)}</strong></p>
            }
            // Bold inline
            const parts = para.split(/(\*\*[^*]+\*\*)/)
            return (
              <p key={i} style={{ marginBottom: 10 }}>
                {parts.map((part, j) =>
                  part.startsWith('**') && part.endsWith('**')
                    ? <strong key={j}>{part.slice(2, -2)}</strong>
                    : part
                )}
              </p>
            )
          })}
        </ContentBody>
      )}
      {section.code && (
        <CodeWrap>
          <CodeBlock
            code={section.code.code}
            lang={section.code.lang}
            filename={section.code.filename}
            maxHeight="600px"
          />
        </CodeWrap>
      )}
      {section.subsections?.map(sub => (
        <SubSection key={sub.id}>
          <SubTitle>{sub.title}</SubTitle>
          {sub.content && <SubContent>{sub.content}</SubContent>}
          {sub.code && (
            <CodeWrap>
              <CodeBlock
                code={sub.code.code}
                lang={sub.code.lang}
                filename={sub.code.filename}
              />
            </CodeWrap>
          )}
        </SubSection>
      ))}
    </SectionWrap>
  )
}

// ── Icons ─────────────────────────────────────────────────────

function NpmIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456l-.01 10.382H5.13z"/></svg>
}
function GhIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
}

// ── Styled ─────────────────────────────────────────────────────

const Wrap = styled.div`
  padding-top: 64px;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px 1fr;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`
const Sidebar = styled.aside`
  background: ${({ theme }) => theme.bgSurface};
  border-right: 1px solid ${({ theme }) => theme.border};
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  @media (max-width: 900px) { display: none; }
  scrollbar-width: thin;
`
const SidebarTop = styled.div`
  padding: 24px 20px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`
const BackLink = styled(Link)`
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: ${({ theme }) => theme.textMuted};
  text-decoration: none;
  display: block;
  margin-bottom: 16px;
  letter-spacing: 0.05em;
  &:hover { color: ${({ theme }) => theme.teal}; }
`
const LibHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
`
const LibIconBig = styled.div<{ $color: LibColor }>`
  font-size: 22px;
  width: 38px; height: 38px;
  border-radius: 10px;
  background: ${({ theme, $color }) => theme[`${$color}Dim` as keyof typeof theme] as string};
  display: flex;
  align-items: center;
  justify-content: center;
`
const LibNameBig = styled.div`
  font-family: 'Sora', sans-serif;
  font-size: 17px;
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
`
const LibVer = styled.div`
  font-family: 'DM Mono', monospace;
  font-size: 9.5px;
  color: ${({ theme }) => theme.textMuted};
  padding: 2px 6px;
  background: ${({ theme }) => theme.border};
  border-radius: 3px;
`
const StatusChip = styled.div<{ $status: string }>`
  font-family: 'DM Mono', monospace;
  font-size: 9.5px;
  padding: 2px 7px;
  border-radius: 10px;
  ${({ theme, $status }) => $status === 'stable'
    ? `background:${theme.greenDim};color:${theme.green};border:1px solid ${theme.green}33;`
    : `background:${theme.amberDim};color:${theme.amber};border:1px solid ${theme.amber}33;`}
`
const InstallBox = styled.div`
  background: ${({ theme }) => theme.bgCodeBlock};
  border: 1px solid ${({ theme }) => theme.borderCode};
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 12px;
`
const InstallLabel = styled.div`
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 4px;
`
const InstallCode = styled.code`
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: #cdd9e5;
`
const LibLinks = styled.div`display: flex; gap: 8px;`
const LibLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textSecondary};
  text-decoration: none;
  transition: all 0.15s;
  &:hover { border-color: ${({ theme }) => theme.teal}; color: ${({ theme }) => theme.teal}; }
`
const SidebarNav = styled.nav`
  padding: 16px 16px 24px;
  flex: 1;
  overflow-y: auto;
`
const NavGroup = styled.div`margin-bottom: 20px;`
const NavGroupLabel = styled.div<{ $color?: LibColor }>`
  font-family: 'DM Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 0 10px 6px;
  color: ${({ theme, $color }) =>
    $color ? theme[$color as keyof typeof theme] as string : theme.textMuted};
`
const NavItem = styled.button<{ $active: boolean }>`
  display: block;
  width: 100%;
  text-align: left;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  padding: 7px 10px;
  border-radius: 7px;
  border: none;
  cursor: pointer;
  background: ${({ theme, $active }) => $active ? theme.tealDim : 'transparent'};
  color: ${({ theme, $active }) => $active ? theme.teal : theme.textSecondary};
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.tealDim};
    color: ${({ theme }) => theme.textPrimary};
  }
`
const Main = styled.main`min-width: 0;`
const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 32px 80px;
  @media (max-width: 640px) { padding: 32px 20px 64px; }
`
const SectionWrap = styled.div``
const SectionTitle = styled.h1`
  font-family: 'Sora', sans-serif;
  font-size: clamp(22px, 3.5vw, 34px);
  font-weight: 800;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 18px;
  letter-spacing: -0.3px;
`
const ContentBody = styled.div`
  font-family: 'Sora', sans-serif;
  font-size: 15.5px;
  line-height: 1.8;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 24px;
  p { margin-bottom: 10px; }
  strong { color: ${({ theme }) => theme.textPrimary}; font-weight: 600; }
`
const CodeWrap = styled.div`margin-bottom: 28px;`
const SubSection = styled.div`
  margin-top: 32px;
  padding-top: 28px;
  border-top: 1px solid ${({ theme }) => theme.border};
`
const SubTitle = styled.h2`
  font-family: 'Sora', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 12px;
`
const SubContent = styled.p`
  font-family: 'Sora', sans-serif;
  font-size: 14.5px;
  line-height: 1.78;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 16px;
  white-space: pre-line;
`
const BottomNav = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid ${({ theme }) => theme.border};
`
const NavChevBtn = styled.button<{ $right?: boolean }>`
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 9px;
  border: 1px solid ${({ theme }) => theme.border};
  background: transparent;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  transition: all 0.18s;
  margin-left: ${({ $right }) => $right ? 'auto' : '0'};
  &:hover {
    border-color: ${({ theme }) => theme.teal};
    color: ${({ theme }) => theme.teal};
    background: ${({ theme }) => theme.tealDim};
  }
`

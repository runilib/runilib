import { formbridgeDocs } from '@/data/docs';
import { formbridgePackageVersion } from '@/data/packageVersion';
import { groupDescriptions } from '@/data/site';
import type {
  DocEntry,
  DocGroup,
  DocSection,
  LibraryDoc,
  VersionOverride,
} from '@/types';

const docs: LibraryDoc = formbridgeDocs;
const currentVersion = docs.versions[0] ?? formbridgePackageVersion;

function semverLte(a: string, b: string): boolean {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);

  for (let index = 0; index < 3; index += 1) {
    if ((pa[index] ?? 0) < (pb[index] ?? 0)) return true;
    if ((pa[index] ?? 0) > (pb[index] ?? 0)) return false;
  }

  return true;
}

function pickOverride(
  overrides: VersionOverride[],
  version: string,
): VersionOverride | undefined {
  return overrides
    .filter((override) => semverLte(override.since, version))
    .sort((left, right) => (semverLte(left.since, right.since) ? 1 : -1))[0];
}

export function resolveSection(
  section: DocSection,
  version = currentVersion,
): DocSection {
  const override = section.versionOverrides?.length
    ? pickOverride(section.versionOverrides, version)
    : undefined;

  return {
    ...section,
    content: override?.content ?? section.content,
    code: override?.code !== undefined ? override.code : section.code,
    codeTabs: override?.codeTabs !== undefined ? override.codeTabs : section.codeTabs,
    subsections: section.subsections
      ?.filter((subsection) => !subsection.since || semverLte(subsection.since, version))
      .map((subsection) => resolveSection(subsection, version)),
  };
}

function stripFormatting(value: string) {
  return value
    .replaceAll('`', '')
    .replaceAll('**', '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^- /gm, '')
    .replace(/^\d+\.\s/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function summarize(content: string) {
  const [firstBlock = ''] = content.trim().split('\n\n');
  return stripFormatting(firstBlock).slice(0, 200);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function buildEntries() {
  const usedSlugs = new Set<string>();
  const groupById = new Map<string, { group: string; label: string }>();
  const sectionsById = new Map(docs.sections.map((section) => [section.id, section]));
  const orderedSections: DocSection[] = [];
  const seenSectionIds = new Set<string>();

  for (const group of docs.sidebar) {
    for (const item of group.items) {
      groupById.set(item.id, { group: group.group, label: item.label });

      const section = sectionsById.get(item.id);

      if (section && !seenSectionIds.has(section.id)) {
        orderedSections.push(section);
        seenSectionIds.add(section.id);
      }
    }
  }

  for (const section of docs.sections) {
    if (!seenSectionIds.has(section.id)) {
      orderedSections.push(section);
    }
  }

  return orderedSections.map((section, index) => {
    const resolvedSection = resolveSection(section);
    const preferredSlug = slugify(section.title);
    let slug = preferredSlug;

    if (usedSlugs.has(slug)) {
      slug = `${preferredSlug}-${section.id.replace(/^fb-/, '')}`;
    }

    usedSlugs.add(slug);

    const groupMeta = groupById.get(section.id);

    return {
      id: section.id,
      slug,
      href: `/docs/${slug}`,
      group: groupMeta?.group ?? 'Documentation',
      label: groupMeta?.label ?? section.title,
      title: section.title,
      summary: summarize(resolvedSection.content),
      index,
      section: resolvedSection,
    } satisfies DocEntry;
  });
}

const entries = buildEntries();
const entryBySlug = new Map(entries.map((entry) => [entry.slug, entry]));
const entryById = new Map(entries.map((entry) => [entry.id, entry]));

export function getDocsVersion() {
  return currentVersion;
}

export function getAllDocEntries() {
  return entries;
}

export function getFeaturedEntries() {
  return entries.filter((entry) =>
    [
      'fb-quickstart',
      'fb-use-form-bridge',
      'fb-select',
      'fb-adapters',
      'fb-persistence',
      'fb-wizard',
    ].includes(entry.id),
  );
}

export function getBuilderEntries() {
  const buildersGroup = docs.sidebar.find(
    (group) =>
      group.group === 'Available Field builders' || group.group === 'Field builders',
  );

  return (
    buildersGroup?.items
      .map((item) => entryById.get(item.id))
      .filter((entry): entry is DocEntry => Boolean(entry)) ?? []
  );
}

export function getDocEntryBySlug(slug: string) {
  return entryBySlug.get(slug);
}

export function getDocEntryById(id: string) {
  return entryById.get(id);
}

export function getDocsLandingEntry() {
  return getDocEntryById('fb-overview') ?? entries[0];
}

export function getDocsLandingHref() {
  return getDocsLandingEntry()?.href ?? '/';
}

export function getGroupedEntries() {
  return docs.sidebar.map((group) => ({
    ...group,
    description: groupDescriptions[group.group] ?? '',
    entries: group.items
      .map((item) => entryById.get(item.id))
      .filter((entry): entry is DocEntry => Boolean(entry)),
  }));
}

export function getPrevNextEntries(slug: string) {
  const current = getDocEntryBySlug(slug);

  if (!current) {
    return { previous: undefined, next: undefined };
  }

  return {
    previous: entries[current.index - 1],
    next: entries[current.index + 1],
  };
}

export function getSidebarGroups(): DocGroup[] {
  return docs.sidebar;
}

export function getDocSectionCount() {
  return entries.length;
}

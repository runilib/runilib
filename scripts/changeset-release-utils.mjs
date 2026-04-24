#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const PACKAGE_ROOT = 'packages';
const CHANGESET_ROOT = '.changeset';
const MIRROR_CONFIG_PATH = path.join('.github', 'mirror-packages.json');

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function listPackageManifests(rootDir = process.cwd()) {
  const packagesDir = path.join(rootDir, PACKAGE_ROOT);

  if (!fs.existsSync(packagesDir)) {
    return [];
  }

  return fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const packagePath = path.join(PACKAGE_ROOT, entry.name);
      const packageJsonPath = path.join(rootDir, packagePath, 'package.json');

      if (!fs.existsSync(packageJsonPath)) {
        return null;
      }

      const manifest = readJson(packageJsonPath);

      return {
        workspace: manifest.name,
        version: manifest.version,
        private: Boolean(manifest.private),
        packagePath,
        packageJsonPath,
        manifest,
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.workspace.localeCompare(right.workspace));
}

export function loadMirrorConfig(rootDir = process.cwd()) {
  const configPath = path.join(rootDir, MIRROR_CONFIG_PATH);

  if (!fs.existsSync(configPath)) {
    return new Map();
  }

  const config = readJson(configPath);

  return new Map(
    (config.packages ?? []).map((item) => [
      item.workspace,
      {
        targetRepo: item.target_repo,
        targetBranch: item.target_branch ?? 'main',
      },
    ]),
  );
}

export function sanitizeWorkspaceForBranch(workspace) {
  return workspace
    .replace(/^@/, '')
    .replace(/[\/\s]+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function parseChangesetContent(content) {
  const normalized = content.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    return {
      entries: [],
      summary: normalized.trim(),
    };
  }

  const [, rawFrontmatter, rawSummary] = match;
  const entries = rawFrontmatter
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const entryMatch = line.match(/^['"]?(.+?)['"]?:\s*(major|minor|patch)\s*$/);

      if (!entryMatch) {
        throw new Error(`Unsupported changeset frontmatter line: ${line}`);
      }

      return {
        workspace: entryMatch[1],
        bump: entryMatch[2],
      };
    });

  return {
    entries,
    summary: rawSummary.trim(),
  };
}

export function serializeChangeset(entries, summary) {
  const frontmatter =
    entries.length > 0
      ? `${entries.map((entry) => `'${entry.workspace}': ${entry.bump}`).join('\n')}\n`
      : '';
  const header = `---\n${frontmatter}---`;
  const trimmedSummary = summary.trim();

  if (!trimmedSummary) {
    return `${header}\n`;
  }

  return `${header}\n\n${trimmedSummary}\n`;
}

export function readChangesetFiles(rootDir = process.cwd()) {
  const changesetDir = path.join(rootDir, CHANGESET_ROOT);

  if (!fs.existsSync(changesetDir)) {
    return [];
  }

  return fs
    .readdirSync(changesetDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith('.md') &&
        entry.name.toLowerCase() !== 'readme.md',
    )
    .map((entry) => {
      const filePath = path.join(changesetDir, entry.name);
      const originalContent = fs.readFileSync(filePath, 'utf8');
      const { entries, summary } = parseChangesetContent(originalContent);

      return {
        fileName: entry.name,
        filePath,
        originalContent,
        entries,
        summary,
      };
    })
    .sort((left, right) => left.fileName.localeCompare(right.fileName));
}

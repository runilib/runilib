#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import path from 'node:path';

import {
  listPackageManifests,
  loadMirrorConfig,
} from './changeset-release-utils.mjs';

function parseArgs(argv) {
  const args = new Map();

  for (let index = 2; index < argv.length; index += 1) {
    const current = argv[index];

    if (!current.startsWith('--')) {
      continue;
    }

    const next = argv[index + 1];
    args.set(current, next);
    index += 1;
  }

  return {
    before: args.get('--before') ?? process.env.BEFORE_SHA ?? '',
  };
}

function readPreviousManifest(beforeSha, repoRelativeManifestPath) {
  if (!beforeSha || /^0+$/.test(beforeSha)) {
    return null;
  }

  try {
    const content = execFileSync(
      'git',
      ['show', `${beforeSha}:${repoRelativeManifestPath}`],
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      },
    );

    return JSON.parse(content);
  } catch {
    return null;
  }
}

function packageExistedAtBeforeSha(beforeSha, repoRelativeManifestPath) {
  if (!beforeSha || /^0+$/.test(beforeSha)) {
    return false;
  }

  const result = spawnSync(
    'git',
    ['cat-file', '-e', `${beforeSha}:${repoRelativeManifestPath}`],
    {
      cwd: process.cwd(),
      stdio: 'ignore',
    },
  );

  return result.status === 0;
}

const { before } = parseArgs(process.argv);
const mirrorMap = loadMirrorConfig();
const changed = [];

for (const pkg of listPackageManifests()) {
  if (pkg.private) {
    continue;
  }

  // git show / cat-file want repo-relative paths, not the absolute one stored
  // on `pkg.packageJsonPath`. Recompute it cleanly off `pkg.packagePath`.
  const repoRelativeManifestPath = path
    .join(pkg.packagePath, 'package.json')
    .split(path.sep)
    .join('/');

  const previousManifest = readPreviousManifest(before, repoRelativeManifestPath);
  const previousVersion = previousManifest?.version ?? null;
  const currentVersion = pkg.version;

  if (previousVersion === null) {
    // Distinguish "package did not exist at BEFORE_SHA" from "manifest lookup
    // failed for another reason" (e.g. shallow clone, malformed JSON).
    // Only the truly-new case warrants skipping — otherwise we still need to
    // publish a real version bump.
    const existedBefore = packageExistedAtBeforeSha(before, repoRelativeManifestPath);

    if (!existedBefore) {
      // New package landing on main. Don't auto-publish the seed version
      // (typically 0.0.0); the first real release should come from a changeset.
      continue;
    }
  } else if (previousVersion === currentVersion) {
    continue;
  }

  const mirror = mirrorMap.get(pkg.workspace);

  changed.push({
    workspace: pkg.workspace,
    package_path: pkg.packagePath,
    version: currentVersion,
    target_repo: mirror?.targetRepo ?? null,
    target_branch: mirror?.targetBranch ?? null,
  });
}

process.stdout.write(
  JSON.stringify({
    include: changed.sort((left, right) => left.workspace.localeCompare(right.workspace)),
  }),
);

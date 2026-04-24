#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

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

function readPreviousManifest(beforeSha, packageJsonPath) {
  if (!beforeSha || /^0+$/.test(beforeSha)) {
    return null;
  }

  try {
    const content = execFileSync('git', ['show', `${beforeSha}:${packageJsonPath}`], {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    return JSON.parse(content);
  } catch {
    return null;
  }
}

const { before } = parseArgs(process.argv);
const mirrorMap = loadMirrorConfig();
const changed = [];

for (const pkg of listPackageManifests()) {
  if (pkg.private) {
    continue;
  }

  const previousManifest = readPreviousManifest(before, pkg.packageJsonPath);
  const previousVersion = previousManifest?.version ?? null;
  const currentVersion = pkg.version;

  if (previousVersion === currentVersion) {
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

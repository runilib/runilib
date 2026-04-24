#!/usr/bin/env node

import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

import {
  listPackageManifests,
  readChangesetFiles,
  readJson,
  serializeChangeset,
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
    workspace: args.get('--workspace'),
  };
}

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${commandArgs.join(' ')} failed.`);
  }
}

const { workspace } = parseArgs(process.argv);

if (!workspace) {
  throw new Error('Missing required argument: --workspace <name>');
}

const packageMap = new Map(listPackageManifests().map((pkg) => [pkg.workspace, pkg]));
const targetPackage = packageMap.get(workspace);

if (!targetPackage) {
  throw new Error(`Unknown workspace: ${workspace}`);
}

const changesets = readChangesetFiles();
const relevantChangesets = changesets.filter((changeset) =>
  changeset.entries.some((entry) => entry.workspace === workspace),
);

if (relevantChangesets.length === 0) {
  process.stdout.write(`No pending changesets found for ${workspace}.\n`);
  process.exit(0);
}

const restoreQueue = new Map();
const originalVersion = readJson(targetPackage.packageJsonPath).version;

try {
  for (const changeset of changesets) {
    const targetEntries = changeset.entries.filter((entry) => entry.workspace === workspace);
    const remainingEntries = changeset.entries.filter(
      (entry) => entry.workspace !== workspace,
    );

    if (targetEntries.length > 0) {
      if (remainingEntries.length > 0) {
        restoreQueue.set(
          changeset.filePath,
          serializeChangeset(remainingEntries, changeset.summary),
        );
      }

      fs.writeFileSync(
        changeset.filePath,
        serializeChangeset(targetEntries, changeset.summary),
      );
      continue;
    }

    restoreQueue.set(changeset.filePath, changeset.originalContent);
    fs.rmSync(changeset.filePath);
  }

  run('yarn', ['version-packages']);
} finally {
  for (const [filePath, content] of restoreQueue.entries()) {
    fs.writeFileSync(filePath, content);
  }
}

const nextVersion = readJson(targetPackage.packageJsonPath).version;

if (nextVersion === originalVersion) {
  throw new Error(`No version bump was generated for ${workspace}.`);
}

process.stdout.write(
  JSON.stringify({
    workspace,
    previousVersion: originalVersion,
    nextVersion,
  }),
);

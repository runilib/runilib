#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import path from 'node:path';

import { readJson } from './changeset-release-utils.mjs';

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
    packagePath: args.get('--package-path'),
  };
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: options.cwd ?? process.cwd(),
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    env: {
      ...process.env,
      RUNILIB_PUBLISH_SOURCEMAPS: process.env.RUNILIB_PUBLISH_SOURCEMAPS ?? 'false',
    },
    encoding: options.capture ? 'utf8' : undefined,
  });

  return result;
}

const { packagePath } = parseArgs(process.argv);

if (!packagePath) {
  throw new Error('Missing required argument: --package-path <path>');
}

const manifest = readJson(path.join(packagePath, 'package.json'));

if (manifest.private) {
  process.stdout.write(
    JSON.stringify({
      published: false,
      skipped: true,
      reason: 'private-package',
      workspace: manifest.name,
      version: manifest.version,
    }),
  );
  process.exit(0);
}

const lookup = run('npm', ['view', `${manifest.name}@${manifest.version}`, 'version', '--json'], {
  capture: true,
});

if (lookup.status === 0) {
  process.stdout.write(
    JSON.stringify({
      published: false,
      skipped: true,
      reason: 'already-published',
      workspace: manifest.name,
      version: manifest.version,
    }),
  );
  process.exit(0);
}

const publish = run('npm', ['publish', '--access', 'public'], { cwd: packagePath });

if (publish.status !== 0) {
  process.exit(publish.status ?? 1);
}

process.stdout.write(
  JSON.stringify({
    published: true,
    skipped: false,
    workspace: manifest.name,
    version: manifest.version,
  }),
);

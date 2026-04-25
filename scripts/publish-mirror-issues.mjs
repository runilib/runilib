#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DRAFTS_ROOT = path.join('.github', 'mirror-issue-drafts');
const MIRROR_CONFIG_PATH = path.join('.github', 'mirror-packages.json');
const IGNORED_FILE_NAMES = new Set([
  'README.md',
  'ROADMAP_ISSUES.md',
  'CONDITIONAL_LOGI_FUTURE.md',
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadMirrorTargets() {
  if (!fs.existsSync(MIRROR_CONFIG_PATH)) {
    return [];
  }

  return (readJson(MIRROR_CONFIG_PATH).packages ?? [])
    .map((item) => {
      const repoFolder = item.target_repo?.split('/').at(-1) ?? null;

      if (!repoFolder || !item.workspace || !item.target_repo) {
        return null;
      }

      const packageName = item.workspace.split('/').at(-1);

      return {
        workspace: item.workspace,
        packageName,
        packagePath: item.package_path,
        targetRepo: item.target_repo,
        repoFolder,
        identifiers: new Set(
          [item.workspace, packageName, item.target_repo, repoFolder, item.package_path]
            .filter(Boolean)
            .map((value) => value.toLowerCase()),
        ),
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.workspace.localeCompare(right.workspace));
}

const MIRROR_TARGETS = loadMirrorTargets();

function printHelp() {
  const knownRepos =
    MIRROR_TARGETS.length > 0
      ? MIRROR_TARGETS.map((target) => `  - ${target.workspace} -> ${target.targetRepo}`).join('\n')
      : '  (none found in .github/mirror-packages.json)';

  process.stdout.write(
    [
      'Usage:',
      '  yarn issues:publish --file <draft.md> [--file <draft.md> ...] [--dry-run]',
      '  yarn issues:publish --repo <workspace|package-name|target-repo> [--all] [--dry-run]',
      '  yarn issues:publish --all [--dry-run]',
      '  yarn issues:publish --list-repos',
      '',
      'Options:',
      '  --file <path>           Publish a specific draft file. Can be repeated.',
      '  --repo <name>           Publish drafts for one mirrored package.',
      '  --all                   Publish all drafts under the selected scope.',
      '  --dry-run               Print what would be created without calling GitHub.',
      '  --allow-duplicates      Create issues even if one with the same title already exists.',
      '  --no-labels             Ignore suggested labels from the draft files.',
      '  --list-repos            Print mirrored packages known from mirror-packages.json.',
      '  --help                  Show this help message.',
      '',
      'Examples:',
      '  yarn issues:publish --file .github/mirror-issue-drafts/react-formbridge/07-add-clearable-select.md --dry-run',
      '  yarn issues:publish --repo react-formbridge --dry-run',
      '  yarn issues:publish --repo @runilib/react-walkit',
      '  yarn issues:publish --repo runilib/react-walkit',
      '',
      'Known mirrored packages:',
      knownRepos,
    ].join('\n'),
  );
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const options = {
    files: [],
    repo: null,
    all: false,
    dryRun: false,
    allowDuplicates: false,
    includeLabels: true,
    listRepos: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }

    if (arg === '--file') {
      const filePath = argv[index + 1];

      if (!filePath) {
        fail('Missing value for --file');
      }

      options.files.push(filePath);
      index += 1;
      continue;
    }

    if (arg === '--repo') {
      const repo = argv[index + 1];

      if (!repo) {
        fail('Missing value for --repo');
      }

      options.repo = repo;
      index += 1;
      continue;
    }

    if (arg === '--all') {
      options.all = true;
      continue;
    }

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '--allow-duplicates') {
      options.allowDuplicates = true;
      continue;
    }

    if (arg === '--no-labels') {
      options.includeLabels = false;
      continue;
    }

    if (arg === '--list-repos') {
      options.listRepos = true;
      continue;
    }

    fail(`Unknown argument: ${arg}`);
  }

  if (options.listRepos) {
    return options;
  }

  if (options.files.length === 0 && !options.all && !options.repo) {
    fail('Provide at least one --file, or use --repo/--all.');
  }

  if (options.files.length > 0 && options.repo) {
    fail('Use either --file or --repo, not both in the same command.');
  }

  return options;
}

function printKnownRepos() {
  if (MIRROR_TARGETS.length === 0) {
    process.stdout.write('No mirrored packages found in .github/mirror-packages.json.\n');
    return;
  }

  for (const target of MIRROR_TARGETS) {
    process.stdout.write(
      `${target.workspace} | ${target.packageName} | ${target.targetRepo} | ${target.packagePath}\n`,
    );
  }
}

function resolveMirrorTarget(repo) {
  if (!repo?.trim()) {
    return null;
  }

  const normalized = repo.trim().toLowerCase();
  const exactMatch = MIRROR_TARGETS.find((target) => target.identifiers.has(normalized));

  if (exactMatch) {
    return exactMatch;
  }

  const partialMatches = MIRROR_TARGETS.filter(
    (target) =>
      target.workspace.toLowerCase().includes(normalized) ||
      target.packageName.toLowerCase().includes(normalized) ||
      target.targetRepo.toLowerCase().includes(normalized),
  );

  if (partialMatches.length === 1) {
    return partialMatches[0];
  }

  if (partialMatches.length > 1) {
    fail(
      `Ambiguous --repo value "${repo}". Matches: ${partialMatches
        .map((target) => target.workspace)
        .join(', ')}`,
    );
  }

  return null;
}

function listDraftFiles(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  return fs
    .readdirSync(rootDir, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(rootDir, entry.name);

      if (entry.isDirectory()) {
        return listDraftFiles(entryPath);
      }

      if (!entry.isFile() || !entry.name.endsWith('.md')) {
        return [];
      }

      if (IGNORED_FILE_NAMES.has(entry.name)) {
        return [];
      }

      return [entryPath];
    })
    .sort((left, right) => left.localeCompare(right));
}

function resolveDraftFiles(options) {
  if (options.files.length > 0) {
    return options.files.map((filePath) => {
      const normalized = path.normalize(filePath);

      if (!fs.existsSync(normalized)) {
        fail(`Draft file not found: ${filePath}`);
      }

      return normalized;
    });
  }

  if (options.repo) {
    const target = resolveMirrorTarget(options.repo);

    if (!target) {
      fail(
        `Unknown mirrored package "${options.repo}". Run \`yarn issues:publish --list-repos\` to see valid values.`,
      );
    }

    const repoDir = path.join(DRAFTS_ROOT, target.repoFolder);
    const files = listDraftFiles(repoDir);

    if (files.length === 0) {
      fail(`No draft files found for mirrored package ${target.workspace}`);
    }

    return files;
  }

  const files = listDraftFiles(DRAFTS_ROOT);

  if (files.length === 0) {
    fail(`No draft files found under ${DRAFTS_ROOT}`);
  }

  return files;
}

function parseLabels(line) {
  const labelMatches = [...line.matchAll(/`([^`]+)`/g)].map((match) => match[1].trim());

  if (labelMatches.length > 0) {
    return labelMatches.filter(Boolean);
  }

  return line
    .split(',')
    .map((label) => label.trim())
    .filter(Boolean);
}

function parseDraft(filePath) {
  const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  const titleMatch = content.match(/^#\s+(.+?)\s*$/m);
  const repoMatch = content.match(/^Repository:\s*`([^`]+)`\s*$/m);
  const labelsMatch = content.match(/^Suggested labels:\s*(.+?)\s*$/m);
  const bodyMatch = content.match(/^## Issue Body\s*\n([\s\S]+)$/m);

  if (!titleMatch) {
    fail(`Could not find issue title in ${filePath}`);
  }

  if (!repoMatch) {
    fail(`Could not find repository in ${filePath}`);
  }

  if (!bodyMatch) {
    fail(`Could not find "## Issue Body" section in ${filePath}`);
  }

  return {
    filePath,
    title: titleMatch[1].trim(),
    repository: repoMatch[1].trim(),
    labels: labelsMatch ? parseLabels(labelsMatch[1]) : [],
    body: bodyMatch[1].trim(),
  };
}

function runGh(args) {
  const result = spawnSync('gh', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
  });

  if (result.error) {
    if (result.error.code === 'ENOENT') {
      fail('GitHub CLI (`gh`) is not installed or not available in PATH.');
    }

    throw result.error;
  }

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr]
      .map((chunk) => chunk?.trim())
      .filter(Boolean)
      .join('\n');

    throw new Error(output || `gh ${args.join(' ')} failed with exit code ${result.status}`);
  }

  return result.stdout.trim();
}

function ensureGhAuth() {
  const result = spawnSync('gh', ['auth', 'status'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });

  if (result.error) {
    if (result.error.code === 'ENOENT') {
      fail('GitHub CLI (`gh`) is not installed or not available in PATH.');
    }

    throw result.error;
  }

  if (result.status !== 0) {
    fail(
      [
        'GitHub CLI is not authenticated.',
        'Run `gh auth login -h github.com` locally, then retry.',
      ].join(' '),
    );
  }
}

const labelCache = new Map();

function getAvailableLabels(repository) {
  if (labelCache.has(repository)) {
    return labelCache.get(repository);
  }

  const output = runGh(['label', 'list', '-R', repository, '--limit', '200', '--json', 'name']);
  const labels = new Set(JSON.parse(output || '[]').map((label) => label.name));

  labelCache.set(repository, labels);

  return labels;
}

function findExistingIssue(repository, title) {
  const output = runGh([
    'issue',
    'list',
    '-R',
    repository,
    '--state',
    'all',
    '--search',
    `"${title}" in:title`,
    '--limit',
    '20',
    '--json',
    'number,title,url',
  ]);
  const issues = JSON.parse(output || '[]');

  return issues.find((issue) => issue.title === title) ?? null;
}

function createIssue(draft, options) {
  let existingIssue = null;

  if (!options.allowDuplicates) {
    existingIssue = findExistingIssue(draft.repository, draft.title);

    if (existingIssue) {
      return {
        status: 'skipped',
        draft,
        existingIssue,
        appliedLabels: [],
        missingLabels: [],
      };
    }
  }

  const availableLabels = options.includeLabels
    ? getAvailableLabels(draft.repository)
    : new Set();
  const appliedLabels = options.includeLabels
    ? draft.labels.filter((label) => availableLabels.has(label))
    : [];
  const missingLabels = options.includeLabels
    ? draft.labels.filter((label) => !availableLabels.has(label))
    : [];

  const output = runGh([
    'issue',
    'create',
    '-R',
    draft.repository,
    '--title',
    draft.title,
    '--body',
    draft.body,
    ...appliedLabels.flatMap((label) => ['--label', label]),
  ]);
  const url = output.split('\n').map((line) => line.trim()).filter(Boolean).at(-1) ?? output;

  return {
    status: 'created',
    draft,
    url,
    appliedLabels,
    missingLabels,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.listRepos) {
    printKnownRepos();
    return;
  }

  const draftFiles = resolveDraftFiles(options);
  const drafts = draftFiles.map(parseDraft);

  if (options.repo) {
    const target = resolveMirrorTarget(options.repo);
    const expectedRepo = target?.targetRepo ?? null;

    if (!expectedRepo) {
      fail(
        `Unknown mirrored package "${options.repo}". Run \`yarn issues:publish --list-repos\` to see valid values.`,
      );
    }

    const mismatchedDraft = drafts.find((draft) => draft.repository !== expectedRepo);

    if (mismatchedDraft) {
      fail(
        `Draft ${mismatchedDraft.filePath} targets ${mismatchedDraft.repository}, expected ${expectedRepo}.`,
      );
    }
  }

  if (!options.dryRun) {
    ensureGhAuth();
  }

  const results = [];
  let hadError = false;

  for (const draft of drafts) {
    if (options.dryRun) {
      results.push({
        status: 'dry-run',
        draft,
      });
      continue;
    }

    try {
      results.push(createIssue(draft, options));
    } catch (error) {
      hadError = true;
      results.push({
        status: 'error',
        draft,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  for (const result of results) {
    if (result.status === 'dry-run') {
      process.stdout.write(
        [
          `DRY RUN  ${result.draft.repository}`,
          `  file:   ${result.draft.filePath}`,
          `  title:  ${result.draft.title}`,
          `  labels: ${
            options.includeLabels && result.draft.labels.length > 0
              ? result.draft.labels.join(', ')
              : '(none)'
          }`,
          '',
        ].join('\n'),
      );
      continue;
    }

    if (result.status === 'skipped') {
      process.stdout.write(
        [
          `SKIPPED  ${result.draft.repository}`,
          `  file:   ${result.draft.filePath}`,
          `  title:  ${result.draft.title}`,
          `  issue:  ${result.existingIssue.url}`,
          '',
        ].join('\n'),
      );
      continue;
    }

    if (result.status === 'created') {
      const lines = [
        `CREATED  ${result.draft.repository}`,
        `  file:   ${result.draft.filePath}`,
        `  title:  ${result.draft.title}`,
        `  issue:  ${result.url}`,
      ];

      if (result.appliedLabels.length > 0) {
        lines.push(`  labels: ${result.appliedLabels.join(', ')}`);
      }

      if (result.missingLabels.length > 0) {
        lines.push(`  missing labels: ${result.missingLabels.join(', ')}`);
      }

      process.stdout.write(`${lines.join('\n')}\n\n`);
      continue;
    }

    process.stderr.write(
      [
        `ERROR    ${result.draft.repository}`,
        `  file:   ${result.draft.filePath}`,
        `  title:  ${result.draft.title}`,
        `  reason: ${result.error}`,
        '',
      ].join('\n'),
    );
  }

  const createdCount = results.filter((result) => result.status === 'created').length;
  const skippedCount = results.filter((result) => result.status === 'skipped').length;
  const dryRunCount = results.filter((result) => result.status === 'dry-run').length;
  const errorCount = results.filter((result) => result.status === 'error').length;

  process.stdout.write(
    `Summary: ${createdCount} created, ${skippedCount} skipped, ${dryRunCount} dry-run, ${errorCount} errors.\n`,
  );

  if (hadError) {
    process.exitCode = 1;
  }
}

main();

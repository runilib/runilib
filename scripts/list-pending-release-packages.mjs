#!/usr/bin/env node

import {
  listPackageManifests,
  loadMirrorConfig,
  readChangesetFiles,
  sanitizeWorkspaceForBranch,
} from './changeset-release-utils.mjs';

const packageMap = new Map(
  listPackageManifests()
    .filter((pkg) => !pkg.private)
    .map((pkg) => [pkg.workspace, pkg]),
);
const mirrorMap = loadMirrorConfig();
const pending = new Map();

for (const changeset of readChangesetFiles()) {
  for (const entry of changeset.entries) {
    const pkg = packageMap.get(entry.workspace);

    if (!pkg) {
      continue;
    }

    if (!pending.has(pkg.workspace)) {
      const mirror = mirrorMap.get(pkg.workspace);
      const branchKey = sanitizeWorkspaceForBranch(pkg.workspace);

      pending.set(pkg.workspace, {
        workspace: pkg.workspace,
        package_path: pkg.packagePath,
        branch_name: `changeset-release/${branchKey}/main`,
        commit_message: `Version ${pkg.workspace}`,
        pr_title: `Version ${pkg.workspace}`,
        pr_body: [
          'This PR was generated automatically from pending changesets.',
          '',
          `It only prepares the next release for \`${pkg.workspace}\`.`,
          'Merge it when you want to publish this package independently of the others.',
        ].join('\n'),
        target_repo: mirror?.targetRepo ?? null,
        target_branch: mirror?.targetBranch ?? null,
      });
    }
  }
}

const matrix = {
  include: Array.from(pending.values()).sort((left, right) =>
    left.workspace.localeCompare(right.workspace),
  ),
};

process.stdout.write(JSON.stringify(matrix));

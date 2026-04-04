# Mirror Repositories Setup Guide

## Purpose

This guide explains how to enable and test the mirror repository workflows end to end.

Use it for:
- the initial setup
- rotating tokens later
- validating that mirror pull requests and mirror issue sync work as expected

This guide complements:
- [MIRROR_REPOS.md](./MIRROR_REPOS.md) for the behavior and architecture
- [README.md](./README.md) for the GitHub automation overview

## What You Are Enabling

After setup:
- pushes to `main` in the monorepo can keep standalone package repositories up to date
- open monorepo pull requests can appear as automated draft pull requests in the standalone package repositories
- issues opened in standalone package repositories can be mirrored into the monorepo
- closing or reopening a mirrored issue in the monorepo can update the standalone issue state

Current mirror targets are defined in:
- [.github/mirror-packages.json](./mirror-packages.json)

## Required Secrets

### In the monorepo repository

Store these in:
- `runilib/runilib`
- `Settings -> Secrets and variables -> Actions`

Required:
- `MIRROR_PUSH_TOKEN`

Optional:
- `MIRROR_GIT_USER_NAME`
- `MIRROR_GIT_USER_EMAIL`

### In the standalone mirror repositories

Store this in each standalone mirror repository, or as an organization secret shared to those repositories:
- `MONOREPO_SYNC_TOKEN`

You can set it in:
- each mirror repo under `Settings -> Secrets and variables -> Actions`
- or at the organization level under `Organization Settings -> Secrets and variables -> Actions`

If you use an organization secret, restrict it to the mirrored package repositories only.

## Token 1: `MIRROR_PUSH_TOKEN`

### What it is used for

This token is used by the monorepo workflows to:
- push subtree updates into standalone repositories
- create and update draft mirror pull requests in standalone repositories
- close or reopen mirrored issues in standalone repositories

### How to create it

1. Open GitHub with an account that has write access to the standalone repositories.
2. Go to:
   - `Profile photo -> Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens`
3. Click `Generate new token`.
4. Set:
   - token name: something like `runilib-mirror-push`
   - resource owner: the organization that owns the mirror repositories
   - repository access: `Only select repositories`
5. Select the standalone package repositories:
   - `runilib/react-formbridge`
   - `runilib/react-walkit`
6. Grant repository permissions:
   - `Contents: Read and write`
   - `Pull requests: Read and write`
   - `Issues: Read and write`
7. Create the token and copy it immediately.

### Where to store it

In the monorepo:
1. Open `runilib/runilib`
2. Go to `Settings -> Secrets and variables -> Actions`
3. Click `New repository secret`
4. Name: `MIRROR_PUSH_TOKEN`
5. Paste the token value
6. Save

## Token 2: `MONOREPO_SYNC_TOKEN`

### What it is used for

This token is used by the standalone repositories to:
- create mirrored issues in the monorepo
- update mirrored issue title and body in the monorepo
- close or reopen mirrored issues in the monorepo

### How to create it

1. Open GitHub with an account that can edit issues in `runilib/runilib`.
2. Go to:
   - `Profile photo -> Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens`
3. Click `Generate new token`.
4. Set:
   - token name: something like `runilib-monorepo-issue-sync`
   - resource owner: the organization that owns the monorepo
   - repository access: `Only select repositories`
5. Select:
   - `runilib/runilib`
6. Grant repository permissions:
   - `Issues: Read and write`
7. Create the token and copy it immediately.

### Where to store it

Recommended option:
- create it once as an organization secret and share it only with the standalone mirror repositories

Steps:
1. Open the GitHub organization
2. Go to `Settings -> Secrets and variables -> Actions`
3. Click `New organization secret`
4. Name: `MONOREPO_SYNC_TOKEN`
5. Paste the token value
6. Set repository access to `Selected repositories`
7. Select:
   - `runilib/react-formbridge`
   - `runilib/react-walkit`
8. Save

Repository-by-repository option:
1. Open each standalone mirror repository
2. Go to `Settings -> Secrets and variables -> Actions`
3. Click `New repository secret`
4. Name: `MONOREPO_SYNC_TOKEN`
5. Paste the token value
6. Save

## Optional Secrets

### `MIRROR_GIT_USER_NAME`

Recommended value:
- `runilib-bot`

Where to store it:
- monorepo repository secret in `runilib/runilib`

### `MIRROR_GIT_USER_EMAIL`

Recommended value:
- `bot@runilib.dev`

Where to store it:
- monorepo repository secret in `runilib/runilib`

If you skip these optional secrets, the workflows fall back to defaults.

## Merge Order

Before testing, make sure the following files are merged to `main` in the monorepo:
- [.github/workflows/mirror-packages.yml](./workflows/mirror-packages.yml)
- [.github/workflows/mirror-package.yml](./workflows/mirror-package.yml)
- [.github/workflows/mirror-package-prs.yml](./workflows/mirror-package-prs.yml)
- [.github/workflows/sync-mirrored-issues-back.yml](./workflows/sync-mirrored-issues-back.yml)
- `packages/<lib>/.github/workflows/sync-issues-to-monorepo.yml` for each mirrored package

Important:
- the issue-sync workflows that live under each package only appear in the standalone repositories after a normal mirror sync has pushed them there

## First-Time Sync After Merge

After the mirror-related changes are on monorepo `main`, force one clean sync so the standalone repositories receive the latest package content and package-level workflows.

From GitHub:
1. Open `runilib/runilib`
2. Go to `Actions`
3. Select `Mirror Packages`
4. Click `Run workflow`
5. Choose branch `main`
6. Keep `package` as `all`
7. Run the workflow

What to verify:
- the workflow succeeds for each mirrored package
- the standalone repositories receive the latest package README updates
- the standalone repositories now contain their package-level `.github/workflows/sync-issues-to-monorepo.yml`

## End-to-End Test Plan

Run the checks in this order.

### Test 1: Mirror pull request visibility

1. Create a branch in the monorepo.
2. Change a file under one mirrored package, for example:
   - `packages/react-formbridge/README.md`
3. Open a pull request to monorepo `main`.
4. Open `runilib/runilib -> Actions`.
5. Verify the `Mirror Package PRs` workflow runs.
6. Open the corresponding standalone repository.
7. Verify there is a new draft PR:
   - based on branch `mirror/pr-<monorepo-pr-number>`
   - with a link back to the monorepo PR

Then update the source PR:
1. Push another commit to the same monorepo PR branch.
2. Verify the mirrored draft PR updates instead of creating a second one.

Then close the source PR:
1. Close the monorepo PR without merging, or merge it if you are ready.
2. Verify the mirrored draft PR is closed automatically.

### Test 2: Mirror sync after merge to `main`

1. Merge a monorepo PR that changes one mirrored package.
2. Open `runilib/runilib -> Actions`.
3. Verify `Mirror Packages` runs on the push to `main`.
4. Open the standalone repository.
5. Verify the target branch, usually `main`, now contains the merged package changes.

### Test 3: Issue sync from standalone repo to monorepo

1. Open a new issue in a standalone repository, for example `runilib/react-walkit`.
2. Open the standalone repository `Actions` tab.
3. Verify `Sync Issues to Monorepo` runs.
4. Open `runilib/runilib`.
5. Verify a mirrored issue was created in the monorepo.
6. Open the original standalone issue.
7. Verify there is a bot comment linking to the monorepo issue.

Then edit the standalone issue:
1. Change the title or body in the standalone repository issue.
2. Verify the mirrored monorepo issue is updated.

Then close and reopen the standalone issue:
1. Close the standalone issue.
2. Verify the monorepo issue closes.
3. Reopen the standalone issue.
4. Verify the monorepo issue reopens.

### Test 4: Issue state sync from monorepo back to standalone repo

1. Open a mirrored issue in the monorepo.
2. Close it.
3. Open `runilib/runilib -> Actions`.
4. Verify `Sync Mirrored Issue Status Back` runs successfully.
5. Open the standalone repository issue.
6. Verify it is now closed.

Then reopen it:
1. Reopen the monorepo issue.
2. Verify the standalone issue reopens too.

## Troubleshooting

### The mirror draft PR is not created

Check:
- the monorepo PR targets `main`
- the PR changed a path under `packages/<mirrored-package>`
- `MIRROR_PUSH_TOKEN` exists in the monorepo secrets
- `MIRROR_PUSH_TOKEN` has `Contents`, `Pull requests`, and `Issues` write access on the standalone repositories
- the target repository in [.github/mirror-packages.json](./mirror-packages.json) is correct

### The standalone repo does not have the issue-sync workflow

Check:
- the package-level workflow file exists in the monorepo package folder
- those changes were merged to monorepo `main`
- `Mirror Packages` ran after the merge

### A standalone issue does not create a monorepo issue

Check:
- `MONOREPO_SYNC_TOKEN` exists in the standalone repository or as an allowed organization secret
- the token has `Issues: Read and write` on `runilib/runilib`
- the issue was opened in the standalone repository, not in the monorepo
- the standalone repo `Actions` tab shows the `Sync Issues to Monorepo` workflow

### Closing the monorepo issue does not close the standalone issue

Check:
- the monorepo issue body contains the `<!-- mirror-source: owner/repo#number -->` marker
- `MIRROR_PUSH_TOKEN` has `Issues: Read and write` on the standalone repositories
- the event happened in `runilib/runilib`

## Current Limits

This setup intentionally does not yet sync:
- pull request reviews
- issue comments between monorepo and standalone repos
- issue labels
- assignees
- milestones
- GitHub Project state
- direct edits to mirrored code made in standalone repositories

## Recommended Maintenance Routine

When you add a new mirrored package:
1. register it in [.github/mirror-packages.json](./mirror-packages.json)
2. make sure the package README states that the monorepo is the source of truth
3. add a package-level `sync-issues-to-monorepo.yml` workflow inside that package if you want issue sync too
4. rerun `Mirror Packages` once after merge to propagate the new package automation into the standalone repository

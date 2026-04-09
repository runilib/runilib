# GitHub Automation

## Purpose

This folder contains the GitHub Actions setup for the monorepo.

The goal is to keep CI, releases, landing deployments, and mirror repositories consistent as the repository grows and new packages are added.

This document explains:
- what each workflow does
- which secrets are required
- how to obtain the values for those secrets
- how to extend the automation for future packages

## Folder structure

- `actions/setup-monorepo/action.yml`
  - shared setup step used by workflows to enable Corepack, install Node, restore Turbo cache, and install dependencies
- `mirror-packages.json`
  - source of truth for packages that should be mirrored to standalone repositories
- `workflows/ci.yml`
  - repository-wide validation
- `workflows/release.yml`
  - Changesets-based release flow
- `workflows/deploy-landing-vercel.yml`
  - preview and production deployments for the landing app
- `workflows/deploy-react-formbridge-docs-vercel.yml`
  - preview and production deployments for the docs app
- `workflows/mirror-package.yml`
  - reusable workflow that pushes one package subtree to one standalone repository
- `workflows/mirror-packages.yml`
  - orchestrator workflow that reads `mirror-packages.json` and syncs all matching packages
- `workflows/mirror-package-prs.yml`
  - creates and updates draft PRs in standalone package repositories so users can see in-progress work before monorepo changes land on `main`
- `workflows/sync-mirrored-issues-back.yml`
  - syncs open or closed state from mirrored monorepo issues back to standalone package repository issues
- `BRANCH_PROTECTION.md`
  - recommended GitHub branch protection and merge-control setup for `main`
- `MIRROR_REPOS.md`
  - documents existing mirror sync behavior and the PR-visibility workflow for standalone repositories
- `MIRROR_SETUP.md`
  - step-by-step setup and test guide for mirror repository secrets, permissions, pull request visibility, and issue synchronization
- `REACT_FORMBRIDGE_DOCS_DEPLOYMENT.md`
  - step-by-step setup guide for the docs Vercel project, GitHub secrets, and SMTP env vars

## Workflow overview

### `CI`

File:
- `.github/workflows/ci.yml`

What it does:
- runs on `pull_request`, `push` to `main`, and `workflow_dispatch`
- installs the monorepo once through the shared setup action
- runs:
  - `yarn check`
  - `yarn typecheck`
  - `yarn test`
  - `yarn build`
- validates pending changesets on pull requests with `yarn changeset:status`

Use this workflow to ensure the branch is healthy before release or deployment.

### `Release Packages`

File:
- `.github/workflows/release.yml`

What it does:
- runs on `push` to `main` when package or changeset files change
- can also be started manually with `workflow_dispatch`
- uses Changesets from the monorepo root
- creates or updates a release PR when there are pending changesets
- publishes packages when versions are ready

Important notes:
- this workflow only runs for the main repository
- it expects `NPM_TOKEN`
- it uses the default `GITHUB_TOKEN` automatically provided by GitHub Actions

### `Deploy Landing to Vercel`

File:
- `.github/workflows/deploy-landing-vercel.yml`

What it does:
- deploys preview builds for pull requests from branches inside the same repository
- comments the preview URL back on the pull request
- deploys production on pushes to `main`
- supports manual deployment through `workflow_dispatch`
- builds workspace packages first with `yarn build:packages`

Important notes:
- preview deployments do not run for forks
- the workflow expects `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`
- the production job uses the GitHub environment `landing-production`

### `Deploy React FormBridge Docs to Vercel`

File:
- `.github/workflows/deploy-react-formbridge-docs-vercel.yml`

What it does:
- deploys preview builds for pull requests from branches inside the same repository
- comments the preview URL back on the pull request
- deploys production on pushes to `main`
- supports manual deployment through `workflow_dispatch`
- builds workspace packages first with `yarn build:packages`

Important notes:
- preview deployments do not run for forks
- the workflow expects `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID_REACT_FORMBRIDGE_DOCS`
- the production job uses the GitHub environment `react-formbridge-docs-production`
- the full setup guide lives in `.github/REACT_FORMBRIDGE_DOCS_DEPLOYMENT.md`

### `Mirror Packages`

Files:
- `.github/workflows/mirror-packages.yml`
- `.github/workflows/mirror-package.yml`
- `.github/mirror-packages.json`

What it does:
- detects which package paths changed on `main`
- reads the package mirror registry from `mirror-packages.json`
- syncs only the relevant package folders to their standalone repositories using `git subtree split`
- can also be run manually for one package or for all packages

Important notes:
- the workflow expects `MIRROR_PUSH_TOKEN`
- `MIRROR_GIT_USER_NAME` and `MIRROR_GIT_USER_EMAIL` are optional
- the token owner must have push access to the target repositories
- the token should also be able to create and edit pull requests in the target repositories

### `Mirror Package PRs`

File:
- `.github/workflows/mirror-package-prs.yml`

What it does:
- runs on pull requests targeting `main`
- detects which mirrored package paths are touched
- creates or updates draft pull requests in the standalone package repositories
- closes those mirrored draft PRs when the monorepo PR is closed

Important notes:
- this workflow exists for visibility, not as the authoritative review flow
- the monorepo remains the source of truth
- the workflow expects `MIRROR_PUSH_TOKEN`
- `MIRROR_GIT_USER_NAME` and `MIRROR_GIT_USER_EMAIL` are optional
- it is documented in `MIRROR_REPOS.md`
- setup steps and validation order are documented in `MIRROR_SETUP.md`

### `Sync Mirrored Issue Status Back`

File:
- `.github/workflows/sync-mirrored-issues-back.yml`

What it does:
- runs in the monorepo when a mirrored issue is reopened or closed
- reads the mirror source marker from the monorepo issue body
- updates the corresponding standalone repository issue state

Important notes:
- this is only the monorepo side of issue synchronization
- the mirror repositories still need their own mirrored issue workflows and a `MONOREPO_SYNC_TOKEN` secret
- the workflow uses `MIRROR_PUSH_TOKEN` to update issues in the standalone repositories
- the full setup flow is documented in `MIRROR_SETUP.md`

## Where to store secrets

Open the GitHub repository settings, then go to:

`Settings -> Secrets and variables -> Actions`

Add the required values as repository secrets unless noted otherwise.

Recommended repository-level secrets:
- `NPM_TOKEN`
- `MIRROR_PUSH_TOKEN`
- `MIRROR_GIT_USER_NAME`
- `MIRROR_GIT_USER_EMAIL`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VERCEL_PROJECT_ID_REACT_FORMBRIDGE_DOCS`

Why repository-level:
- `Release Packages` and mirror workflows run at repository scope
- the preview Vercel deployment also needs the Vercel secrets, so environment-only secrets would not be enough

You can still use GitHub environments such as `landing-production` and `react-formbridge-docs-production` for required reviewers, wait timers, or other production protections.

## Secret reference

### `NPM_TOKEN`

Used by:
- `Release Packages`

Purpose:
- authenticate `changeset publish` against npm

How to obtain it:
1. Sign in to your npm account.
2. Open your account settings.
3. Go to access tokens.
4. Create a new token for publishing.
5. Copy the token value once and store it as `NPM_TOKEN` in GitHub.

Recommendations:
- use the smallest scope that still allows publishing
- prefer an automation-oriented token rather than a personal day-to-day token
- rotate it if the maintainer changes or the token leaks

### `MIRROR_PUSH_TOKEN`

Used by:
- `Mirror Packages`
- `Mirror Package PRs`

Purpose:
- push package subtrees to standalone GitHub repositories
- create, update, and close mirrored pull requests in standalone GitHub repositories
- reopen and close mirrored issues in standalone package repositories

Recommended option:
- create a fine-grained GitHub personal access token

How to obtain it:
1. Sign in to GitHub with an account that has write access to the target mirror repositories.
2. Open:
   - `Settings -> Developer settings -> Personal access tokens`
3. Create a fine-grained token.
4. Limit repository access to the mirror repositories that should receive pushes.
5. Grant repository permissions for:
   - contents: write
   - issues: write
   - pull requests: write
6. Copy the token and store it as `MIRROR_PUSH_TOKEN`.

If your organization still relies on classic tokens, use the minimum repository scope that allows pushing. Fine-grained tokens are preferred.

### `MIRROR_GIT_USER_NAME`

Used by:
- `Mirror Packages`
- `Mirror Package PRs`

Purpose:
- optional override for the git author name used in mirror sync jobs

How to set it:
- use a simple bot-style name such as `runilib-bot`

This secret is optional. If omitted, the workflow falls back to a default value.

### `MIRROR_GIT_USER_EMAIL`

Used by:
- `Mirror Packages`
- `Mirror Package PRs`

Purpose:
- optional override for the git author email used in mirror sync jobs

How to set it:
- use a bot or automation email address such as `bot@example.com`

This secret is optional. If omitted, the workflow falls back to a default value.

### `VERCEL_TOKEN`

Used by:
- `Deploy Landing to Vercel`
- `Deploy React FormBridge Docs to Vercel`

Purpose:
- authenticate the Vercel CLI in GitHub Actions

How to obtain it:
1. Sign in to Vercel.
2. Open your account settings.
3. Go to tokens.
4. Create a token for CI usage.
5. Copy it and store it as `VERCEL_TOKEN`.

Recommendations:
- use a dedicated CI token when possible
- rotate it if the deployment owner changes

### `VERCEL_ORG_ID`

Used by:
- `Deploy Landing to Vercel`
- `Deploy React FormBridge Docs to Vercel`

Purpose:
- tells the Vercel CLI which Vercel team or personal scope owns the project

How to obtain it:

Option A:
1. Link the project locally with Vercel from the landing app directory.
2. Read the generated `.vercel/project.json` file.
3. Copy the `orgId` value into the GitHub secret `VERCEL_ORG_ID`.

Example:

```bash
cd apps/landing
vercel login
vercel link
cat .vercel/project.json
```

Option B:
- check the project and team metadata in the Vercel dashboard if your setup exposes the ID there

Do not commit the `.vercel/` folder if it contains local environment metadata that should stay local.

### `VERCEL_PROJECT_ID`

Used by:
- `Deploy Landing to Vercel`

Purpose:
- tells the Vercel CLI which exact project to build and deploy

How to obtain it:
- use the same `apps/landing/.vercel/project.json` file after `vercel link`
- copy the `projectId` value into the GitHub secret `VERCEL_PROJECT_ID`

Example:

```bash
cd apps/landing
vercel login
vercel link
cat .vercel/project.json
```

### `VERCEL_PROJECT_ID_REACT_FORMBRIDGE_DOCS`

Used by:
- `Deploy React FormBridge Docs to Vercel`

Purpose:
- tells the Vercel CLI which exact docs project to build and deploy

How to obtain it:
- use the same `apps/react-formbridge-docs/.vercel/project.json` file after `vercel link`
- copy the `projectId` value into the GitHub secret `VERCEL_PROJECT_ID_REACT_FORMBRIDGE_DOCS`

Example:

```bash
cd apps/react-formbridge-docs
vercel login
vercel link
cat .vercel/project.json
```

## GitHub environment

The production landing deployment targets:
- `landing-production`

The production docs deployment targets:
- `react-formbridge-docs-production`

Recommended environment settings:
- required reviewers before production deployment
- optional deployment wait timer
- branch restrictions if needed

The workflow does not require environment secrets specifically, because preview deployments also need the same Vercel credentials.

## Adding a new mirrored package

To sync a new package to its own repository:

1. Create the target repository on GitHub.
2. Make sure the account behind `MIRROR_PUSH_TOKEN` has write access to it.
3. Add a new object to `.github/mirror-packages.json`.

Example:

```json
{
  "workspace": "@runilib/my-lib",
  "package_path": "packages/my-lib",
  "target_repo": "runilib/my-lib",
  "target_branch": "main"
}
```

4. Merge the change to `main`.
5. Let the `Mirror Packages` workflow run automatically or launch it manually.

## Manual workflow runs

### Run the landing deployment manually

Open the GitHub Actions tab and start:
- `Deploy Landing to Vercel`

Available inputs:
- `environment=preview`
- `environment=production`

### Run mirror sync manually

Open the GitHub Actions tab and start:
- `Mirror Packages`

Available input:
- `package`

Accepted values:
- `all`
- a workspace name such as `@runilib/my-lib`
- a package path such as `packages/my-lib`
- a target repository such as `runilib/my-lib`

## Suggested setup checklist for a fresh repository

1. Enable GitHub Actions.
2. Add repository secrets.
3. Create the `landing-production` environment if the landing app is deployed from this repo.
4. Make sure npm package metadata is correct for each publishable workspace.
5. Make sure mirror target repositories already exist before enabling package mirroring.
6. Run `CI` on a branch or pull request.
7. Run `Deploy Landing to Vercel` manually once to validate Vercel credentials.
8. Run `Mirror Packages` manually once to validate repository access.
9. Merge to `main` and let automation take over.

## Troubleshooting

### Release fails with npm authentication errors

Check:
- `NPM_TOKEN` exists
- the token still has publishing rights
- the package name and access level are correct

### Mirror sync fails with GitHub push errors

Check:
- `MIRROR_PUSH_TOKEN` exists
- the token owner has write access to the target repository
- the target repository already exists
- the repository name in `mirror-packages.json` is correct

### Vercel deployment fails before build

Check:
- `VERCEL_TOKEN` exists
- `VERCEL_ORG_ID` exists
- `VERCEL_PROJECT_ID` exists
- the linked Vercel project really corresponds to `apps/landing`

### Vercel preview does not appear on a pull request

Check:
- the pull request comes from a branch inside the main repository and not from a fork
- the changed files match the workflow path filters
- the Vercel secrets are available at repository level

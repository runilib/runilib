# Releasing

## Purpose

This repository is a monorepo managed with Yarn workspaces, Turbo, and Changesets.

This document explains:
- when to work from the monorepo root
- when to work from a package directory
- how to publish a package for the first time
- how to publish one package or multiple packages later
- how Changesets, changelogs, and package publish hooks fit together

It is intentionally generic so it can be reused for any future library in the repo.

## Terminology

- `package`
  - a publishable workspace, usually under `packages/<name>`
- `package path`
  - the folder of the package, for example `packages/my-lib`
- `workspace name`
  - the npm package name, for example `@runilib/my-lib`
- `changeset`
  - a markdown file in `.changeset/` describing the next version bump and release note summary

## Where to run commands

### Run from the monorepo root

Use the monorepo root when the command:
- reads `.changeset/`
- works across multiple workspaces
- validates repo-wide quality gates
- depends on the workspace graph

Typical root commands:

```bash
yarn check
yarn typecheck
yarn test
yarn changeset
yarn changeset:status
yarn version-packages
yarn release
```

### Run from a package directory

Use the package directory when the command:
- is about one package only
- is a normal npm package command such as `npm publish`
- should execute that package's own scripts in isolation

Typical package-level commands:

```bash
cd packages/<name>
npm run prepublishOnly
npm publish --access public
```

### Run from the root with `--prefix`

If you want to stay at the root but target one package, use `--prefix`.

Example:

```bash
npm run --prefix packages/<name> prepublishOnly
npm publish --prefix packages/<name> --access public
```

This is equivalent to entering the package folder first.

## Standard monorepo release flow with Changesets

This is the normal flow after a package has already been published at least once.

### 1. Make changes

Change the package code, docs, tests, examples, or metadata.

### 2. Create a changeset

From the monorepo root:

```bash
yarn changeset
```

This creates a file in `.changeset/` with:
- the package or packages to bump
- the bump level: `patch`, `minor`, or `major`
- the human-written summary used for release notes

### 3. Validate the repo

From the monorepo root:

```bash
yarn check
yarn typecheck
yarn test
```

Optional package-only validation:

```bash
npm run --prefix packages/<name> prepublishOnly
```

### 4. Inspect pending releases

From the monorepo root:

```bash
yarn changeset:status
```

Use this to confirm which packages will be bumped.

### 5. Merge the feature PR

Merge the PR with the pending changeset files into `main`.

### 6. Let GitHub create package-scoped release PRs

After the merge, the `Release Packages` workflow:
- scans `.changeset/*.md`
- groups pending changes by package
- creates or updates one release PR per package

Examples:
- `changeset-release/runilib-react-walkit/main`
- `changeset-release/runilib-react-formbridge/main`

Each automated release PR:
- runs `yarn version-packages` only for its target package
- updates that package `package.json` and `CHANGELOG.md`
- leaves the other pending package changesets in place

### 7. Review and merge only the package release PR you want

This is the key difference from the old aggregated flow:
- you do **not** have to publish every changed package together
- you can merge the `react-walkit` release PR now
- and keep the `react-formbridge` release PR for later

### 8. Publish

When a package release PR is merged into `main`, GitHub Actions:
- detects which package version changed on that push
- publishes only that package to npm
- creates or updates the GitHub release in the monorepo
- creates or updates the corresponding GitHub release in the mirror repository

## Manual versioning and publishing commands

These remain useful for exceptional local workflows, backfills, or debugging:

```bash
yarn version-packages
yarn release
yarn release:with-maps
```

By default, `yarn release` publishes packages **without** sourcemaps in the npm tarball.
The build still produces sourcemaps locally in `dist/`; they are just removed during `pack` / `publish`.

## First publication of a package

The very first publication of a package is slightly different from later releases.

### Case A: the package version is already the exact version you want to publish

Example:
- `packages/my-lib/package.json` already says `1.0.0`
- the package has never been published before
- you want the first npm release to be exactly `1.0.0`

In that case:
- validate the repo
- validate the package
- publish the package
- do **not** run `yarn version-packages` first

Recommended flow:

```bash
yarn check
yarn typecheck
yarn test
npm run --prefix packages/<name> prepublishOnly
npm publish --prefix packages/<name> --access public
```

If you want the manual package publication to also exclude sourcemaps:

```bash
RUNILIB_PUBLISH_SOURCEMAPS=false npm publish --prefix packages/<name> --access public
```

Why:
- `yarn version-packages` consumes changesets and bumps versions
- if a pending changeset says `patch`, `1.0.0` becomes `1.0.1`
- that is not what you want for an exact first `1.0.0` publication

### Case B: the package is unpublished and you want Changesets to determine the first version

If the package has not been published yet and its version still needs to be prepared through the normal release process, use the standard automated flow from the root:

```bash
yarn changeset
yarn changeset:status
# merge the feature PR into main
# let GitHub create the package-specific release PR
# merge that release PR when you are ready to publish
```

Use this only if you intentionally want Changesets to produce the publishable version through the automated release PR.

## Publish only one package manually

If you want to publish one package without using Changesets for that release, both of these approaches are valid.

### Option A: stay at the root

```bash
npm run --prefix packages/<name> prepublishOnly
npm publish --prefix packages/<name> --access public
```

### Option B: move into the package directory

```bash
cd packages/<name>
npm run prepublishOnly
npm publish --access public
```

If you want the manual package publication to also exclude sourcemaps:

```bash
RUNILIB_PUBLISH_SOURCEMAPS=false npm publish --access public
```

### Recommendation

If you want maximum safety:

```bash
yarn check
yarn typecheck
yarn test
npm run --prefix packages/<name> prepublishOnly
npm publish --prefix packages/<name> --access public
```

## Publish only one package from GitHub Actions

Use this when the automatic `Release Packages` workflow skipped a publish you expected (CI bug, matrix glitch, etc.) and you do not want to bump the version a second time just to retrigger CI.

The workflow is `Release Publish Manually` (`.github/workflows/release-publish-manual.yml`).

To run it:

1. Go to the **Actions** tab on the monorepo on GitHub.
2. Pick **Release Publish Manually** in the left sidebar.
3. Click **Run workflow** and fill in:
   - `workspace` — for example `@runilib/react-walkit`
   - `package_path` — for example `packages/react-walkit`
   - `version` — must match the workspace `package.json` (safety check)
   - `run_prepublish_checks` — leave `true` unless you have a reason to skip
4. Click **Run workflow**.

The workflow:
- verifies the input version matches `package.json` (refuses otherwise)
- runs `prepublishOnly` (typecheck, lint, test, build)
- publishes to npm using the `NPM_TOKEN` org secret
- creates or updates the matching GitHub release (`<workspace>@<version>`) on the monorepo

It does **not** push to the standalone mirror repository. To update the mirror after publishing, trigger `Release Mirror Manually` (`.github/workflows/release-mirror-manual.yml`) with the same workspace, version, target repo, and target branch.

The publish itself is idempotent — `scripts/publish-package.mjs` checks `npm view <name>@<version>` first and exits early if the version already exists, so it is safe to re-run.

## Publish only one package with Changesets

If you want to use Changesets and only one package should be released:
- stay at the monorepo root
- create a changeset that mentions only that package
- verify with `yarn changeset:status`
- merge the feature PR into `main`
- merge only that package's automated release PR

Flow:

```bash
yarn changeset
yarn changeset:status
# merge the feature PR into main
# merge the generated release PR for the package you want
```

For this mode, do not switch into the package directory for the versioning steps.

## Changelogs in this repo

This repo uses a hybrid model:

- the release note source is written manually in `.changeset/*.md`
- the package `CHANGELOG.md` files are normally updated automatically by `changeset version`

That means:
- you do not usually edit `CHANGELOG.md` manually for ordinary releases
- you do write the release summary manually in the changeset file
- manual edits to `CHANGELOG.md` are mostly for initial setup, cleanup, or exceptional corrections

## What `prepublishOnly` does

Each package may define a `prepublishOnly` script.

This is a package-level hook triggered by npm publish.

Typical responsibilities:
- typecheck
- lint or check
- test
- build

You can also run it manually before publishing:

```bash
npm run --prefix packages/<name> prepublishOnly
```

or:

```bash
cd packages/<name>
npm run prepublishOnly
```

## Root scripts in this repo

From the monorepo root:

- `yarn check`
  - runs repo-wide checks through Turbo
- `yarn typecheck`
  - runs repo-wide TypeScript validation
- `yarn test`
  - runs repo-wide tests
- `yarn prepush:verify`
  - shorthand for `yarn check && yarn typecheck && yarn test`
- `yarn changeset`
  - creates a new pending release note file
- `yarn changeset:status`
  - shows which packages will be bumped
- `yarn version-packages`
  - runs `changeset version`
- `yarn release`
  - runs `changeset publish`

## Package-level publish checklist

For any package under `packages/<name>`:

1. Confirm package metadata is ready.
   - version
   - name
   - exports
   - files
   - license
   - README
   - changelog
2. Run validation.
3. Run `prepublishOnly`.
4. Log in to npm if needed.
5. Publish either manually or through Changesets.

## Examples

### Manual single-package publish from the root

```bash
yarn check
yarn typecheck
yarn test
npm run --prefix packages/my-lib prepublishOnly
npm publish --prefix packages/my-lib --access public
```

### Manual single-package publish from the package folder

```bash
cd packages/my-lib
npm run prepublishOnly
npm publish --access public
```

### Normal Changesets release

```bash
yarn changeset
yarn check
yarn typecheck
yarn test
yarn changeset:status
# merge the feature PR into main
# let GitHub create one release PR per package
# merge only the package release PR you want to publish
```

## Note about non-publishable workspaces

If this monorepo contains apps, demos, examples, or other workspaces that should not participate in the release flow, you may want to configure `.changeset/config.json` accordingly.

Typical options:
- keep them out of changesets
- ignore them explicitly in the Changesets config
- publish only `packages/*` and treat `apps/*` and `examples/*` as internal workspaces

## CI and deployment automation

This repository is set up so release and deployment automation stays generic as new libraries are added.

### GitHub Actions workflows

- `CI`
  - runs repo-wide checks, typecheck, tests, builds, and changeset validation on pull requests
- `Release Packages`
  - runs from the monorepo root and creates package-specific release PRs, then publishes only the package versions that changed on `main`
- `Deploy Landing to Vercel`
  - deploys the landing app previews for pull requests and production on `main`
- `Mirror Packages`
  - syncs selected package folders from the monorepo to standalone mirror repositories using subtree splits

### GitHub secrets required by automation

- `NPM_TOKEN`
  - required for npm publication through `changeset publish`
- `MIRROR_PUSH_TOKEN`
  - required to push to standalone mirror repositories
- `MIRROR_GIT_USER_NAME`
  - optional override for the git author name used by mirror sync jobs
- `MIRROR_GIT_USER_EMAIL`
  - optional override for the git author email used by mirror sync jobs
- `VERCEL_TOKEN`
  - required for Vercel CLI authentication
- `VERCEL_ORG_ID`
  - required by the landing deployment workflow
- `VERCEL_PROJECT_ID`
  - required by the landing deployment workflow

### Registering a new mirrored package

To mirror a new package repository:

1. Create the standalone target repository.
2. Add an entry to `.github/mirror-packages.json` with:
   - the workspace name
   - the package path
   - the target repository
   - the target branch
3. Merge the change to `main`.

After that, the `Mirror Packages` workflow can sync the package automatically on `main` or manually through `workflow_dispatch`.

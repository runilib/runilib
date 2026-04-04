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

### 5. Prepare the versioned release

From the monorepo root:

```bash
yarn version-packages
```

This runs:

```bash
changeset version
```

It will:
- bump versions in `package.json`
- update package `CHANGELOG.md`
- consume the pending `.changeset/*.md` entries

### 6. Commit the version changes

Commit the version and changelog updates created by Changesets.

### 7. Publish

From the monorepo root:

```bash
yarn release
```

This runs:

```bash
node ./scripts/changeset-publish.mjs
```

It publishes the versions currently present in the package manifests.

By default, `yarn release` publishes packages **without** sourcemaps in the npm tarball.
The build still produces sourcemaps locally in `dist/`; they are just removed during `pack` / `publish`.

If you explicitly want to publish sourcemaps too, use:

```bash
yarn release:with-maps
```

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

If the package has not been published yet and its version still needs to be prepared through the normal release process, use the standard Changesets flow from the root:

```bash
yarn changeset
yarn changeset:status
yarn version-packages
yarn release
```

Use this only if you intentionally want Changesets to produce the publishable version.

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

## Publish only one package with Changesets

If you want to use Changesets and only one package should be released:
- stay at the monorepo root
- create a changeset that mentions only that package
- verify with `yarn changeset:status`

Flow:

```bash
yarn changeset
yarn changeset:status
yarn version-packages
yarn release
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
yarn version-packages
git commit -am "chore: version packages"
yarn release
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
  - runs from the monorepo root and uses Changesets to create release PRs or publish versioned packages
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

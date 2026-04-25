# runilib monorepo

Yarn Workspaces monorepo for building React / React Native libraries with the same API, testing them locally without publishing to npm, and publishing them when they are ready.

## Structure

```txt
runilib-monorepo/
├─ apps/
│  ├─ landing/                  # marketing site (runilib.dev)
│  └─ react-formbridge-docs/    # docs site for @runilib/react-formbridge
├─ examples/
│  ├─ web/                      # web sandbox for the libraries
│  └─ mobile-app/               # Expo sandbox for the libraries
├─ packages/
│  ├─ nimbo/                    # tiny typed state modules (React / RN)
│  ├─ react-formbridge/         # schema-first forms (React / RN)
│  └─ react-walkit/             # onboarding tours (React / RN)
├─ package.json
├─ turbo.jsonc
└─ tsconfig.base.json
```

## Why this structure

- `packages/*` contains the reusable libraries published to npm.
- `apps/*` hosts the public-facing sites (landing page and library docs).
- `examples/*` acts as a sandbox to validate libraries locally on web and native.
- Apps and examples consume monorepo packages through `workspace:*`, so no npm publish is needed for local testing.
- When a library is ready, `changesets` handles versioning and publishing.

## Getting started

### 1. Initialize Yarn 4 with Corepack

```bash
corepack enable
yarn install
```

### 2. Start everything in watch mode

```bash
yarn run dev
```

Or target a specific workspace:

```bash
yarn run dev:landing              # landing site
yarn run dev:docs:formbridge      # react-formbridge docs
yarn run dev:ex:web               # web example app
yarn run dev:ex:mobile            # mobile example app (Expo)
```

## Useful commands

```bash
yarn build
yarn typecheck
yarn lint
yarn test
yarn size
yarn size:no-maps
yarn size:check
yarn size:markdown

# Target a single package
yarn workspace @runilib/react-formbridge build
yarn workspace @runilib/react-walkit build
yarn size @runilib/react-walkit
```

## Size tracking

- `yarn size` shows the current published and local bundle footprint.
- `yarn size:no-maps` simulates npm publication without sourcemaps.
- `yarn size:check` enforces the budgets defined in [size-budgets.json](size-budgets.json).
- `yarn size:markdown` regenerates [SIZE_REPORT.md](SIZE_REPORT.md).

## Add a new library

See [ADD_LIBRARY.md](ADD_LIBRARY.md) for the full step-by-step guide to create a new package, wire it into apps/examples, and validate it end to end.

## Before Opening a PR

If your branch changes code under `packages/*`, use this checklist before opening a pull request:

If your PR only touches `apps/*`, docs, workflows, or internal tooling, you normally do not need a changeset.

1. Add or update the package code, docs, examples, and tests.
2. Create a changeset from the monorepo root:

```bash
yarn changeset
```

3. Pick the bump level for each changed package:
   - `patch` for fixes and backward-compatible polish
   - `minor` for new backward-compatible features
   - `major` for breaking changes
4. If the package changed but should not create a release, create an empty changeset instead:

```bash
yarn changeset --empty
```

5. Run the repo-wide checks:

```bash
yarn check
yarn typecheck
yarn test
```

6. Optionally run the package publish hook when you touched a published package:

```bash
npm run --prefix packages/<name> prepublishOnly
```

7. Open the PR against `main`.

## How Releases Work

Releases are automated from GitHub Actions.

1. Merge a PR with one or more changesets into `main`.
2. The `Release Packages` workflow creates or updates one automated release PR per changed package.
3. Each package release PR runs `yarn version-packages` for that package only and keeps the other pending changesets untouched.
4. Review and merge only the package release PRs you want to publish now.
5. GitHub Actions publishes only the packages whose versions changed on `main`.
6. The same workflow then creates the matching GitHub release in the monorepo and on the affected mirror repository.

For first-time publication, manual publish flows, and mirror backfills, see [RELEASING.md](RELEASING.md).

## Useful Release Commands

These are useful mostly for local inspection or exceptional manual release work:

```bash
yarn changeset
yarn changeset:status
yarn version-packages
yarn release
```

For ordinary package work, contributors usually only need:

```bash
yarn changeset
yarn check
yarn typecheck
yarn test
```

## Mirror repositories

Each published package has a read-only mirror repository for discoverability and issue tracking:

- [runilib/nimbo](https://github.com/runilib/nimbo)
- [runilib/react-formbridge](https://github.com/runilib/react-formbridge)
- [runilib/react-walkit](https://github.com/runilib/react-walkit)

Issues opened on a mirror are automatically synced to this monorepo. Pull requests must be opened here - the mirrors do not accept code changes.

## Contributing

Contributions are welcome. Start with the per-package guides:

- [packages/react-formbridge/CONTRIBUTING.md](packages/react-formbridge/CONTRIBUTING.md)
- [packages/react-walkit/CONTRIBUTING.md](packages/react-walkit/CONTRIBUTING.md)

Looking for something approachable? Browse good first issues:

- [react-formbridge good first issues](https://github.com/runilib/react-formbridge/labels/good%20first%20issue)
- [react-walkit good first issues](https://github.com/runilib/react-walkit/labels/good%20first%20issue)

## Important notes

- The repo uses `nodeLinker: node-modules` to avoid the usual friction between Plug'n'Play and the React Native ecosystem.
- `enableTransparentWorkspaces: false` forces explicit `workspace:*` usage, which avoids misleading implicit resolutions.
- The web apps use `react-native-web` to render components coming from React Native packages.

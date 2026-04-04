# runilib monorepo

Yarn Workspaces monorepo for building React / React Native libraries with the same API, testing them locally without publishing to npm, and publishing them when they are ready.

## Structure

```txt
runilib-monorepo/
├─ apps/
│  └─ web/                # marketing site / docs / playground
├─ examples/
│  ├─ web/                # web app for testing the libraries
│  └─ mobile/             # Expo mobile app for testing the libraries
├─ packages/
│  ├─ primitives/         # cross-platform components
│  └─ theme/              # shared design tokens
├─ package.json
├─ turbo.json
└─ tsconfig.base.json
```

## Why this structure

- `packages/*` contains the reusable libraries.
- `apps/web` is the main project website.
- `examples/*` acts as a sandbox to validate libraries locally.
- The apps consume monorepo packages through `workspace:*`, so no npm publish is needed for local testing.
- When a library is ready, `changesets` helps version and publish it cleanly.

## Getting started

### 1. Initialize Yarn 4 with Corepack

```bash
corepack enable
yarn install
```

### 2. Start the whole repo

```bash
yarn dev
```

This will:

1. build the packages once,
2. start the libraries in watch mode,
3. launch the web and mobile apps.

## Useful commands

```bash
yarn build
yarn typecheck
yarn lint
yarn size
yarn size:no-maps
yarn size:check
yarn size:markdown
yarn size @runilib/react-walkit
yarn workspace @runilib/primitives build
yarn workspace @runilib/example-web dev
yarn workspace @runilib/example-mobile dev
```

## Size Tracking

- `yarn size` shows the current published and local bundle footprint.
- `yarn size:no-maps` simulates npm publication without sourcemaps.
- `yarn size:check` enforces the budgets defined in [size-budgets.json](/Users/m989281/Documents/PROJECTS/runilib-monorepo/size-budgets.json).
- `yarn size:markdown` regenerates [SIZE_REPORT.md](/Users/m989281/Documents/PROJECTS/runilib-monorepo/SIZE_REPORT.md).

## Add a new library

See [ADD_LIBRARY.md](/Users/m989281/Documents/PROJECTS/runilib-monorepo/ADD_LIBRARY.md) for the full step-by-step guide to create a new package, wire it into apps/examples, and validate it end to end.

## Publish later to npm

### Add a changeset

```bash
yarn changeset
```

### Bump versions

```bash
yarn version-packages
```

### Publish

```bash
yarn release
```

## Important notes

- The repo uses `nodeLinker: node-modules` to avoid the usual friction between Plug'n'Play and the React Native ecosystem.
- `enableTransparentWorkspaces: false` forces explicit `workspace:*` usage, which avoids misleading implicit resolutions.
- The web apps use `react-native-web` to render components coming from React Native packages.

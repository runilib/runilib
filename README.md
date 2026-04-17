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
yarn dev
```

Or target a specific workspace:

```bash
yarn dev:landing              # landing site
yarn dev:docs:formbridge      # react-formbridge docs
yarn dev:ex:web               # web example app
yarn dev:ex:mobile            # mobile example app (Expo)
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

## Publish to npm

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

## Mirror repositories

Each published package has a read-only mirror repository for discoverability and issue tracking:

- [runilib/react-formbridge](https://github.com/runilib/react-formbridge)
- [runilib/react-walkit](https://github.com/runilib/react-walkit)

Issues opened on a mirror are automatically synced to this monorepo. Pull requests must be opened here — the mirrors do not accept code changes.

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

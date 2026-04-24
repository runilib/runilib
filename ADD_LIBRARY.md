# Add a New Library

This guide explains the exact steps to add a new publishable library under `packages/` and make it operational in this monorepo.

It is based on the current repo setup:
- Yarn 4 workspaces
- Turbo
- TypeScript
- tsup
- Vitest
- Biome

## What Is Already Automatic

If you create a package under `packages/<name>`, the monorepo already picks it up automatically because:
- the root `package.json` includes `packages/*` in `workspaces`
- `turbo.jsonc` runs tasks across all workspaces
- `vitest.workspace.ts` already includes `packages/*/vitest.config.ts`

That means you do **not** need to update the root workspace list, Turbo config, or Vitest workspace config for a normal new library.

## Recommended Approach

The fastest and safest path is:

1. copy the closest existing package, usually `packages/react-walkit` or `packages/react-formbridge`
2. remove generated files such as `dist`, `coverage`, `.turbo`, `node_modules`, and `*.tsbuildinfo`
3. rename the package metadata and replace the source code with your new library

If you prefer starting from scratch, the next sections describe the minimum required files.

If you duplicate an existing package, update these fields immediately:
- `package.json`: `name`, `version`, `description`, `homepage`, `repository`, `bugs`, `funding`, `author`
- `vitest.config.ts`: `test.name`
- `README.md`: title, install instructions, usage examples
- `src/index.ts` and `src/index.native.ts`: exported API

## Minimum Package Structure

```txt
packages/my-lib/
├─ CHANGELOG.md
├─ LICENSE
├─ README.md
├─ biome.jsonc
├─ package.json
├─ tsconfig.json
├─ tsconfig-build.json
├─ tsup.config.ts
├─ vitest.config.ts
└─ src/
   ├─ index.ts
   ├─ index.native.ts
   └─ __tests__/
```

Notes:
- keep `index.native.ts` if the library is meant to work in React Native
- if the library is web-only, you can omit the native entry and simplify the exports
- `babel.config.js`, `jest.config.js`, and `CONTRIBUTING.md` are optional, not required by the current monorepo workflow

## 1. Create the Package Folder

Create the new workspace:

```bash
mkdir -p packages/my-lib/src/__tests__
```

Use the future npm name as the folder name when possible.

Recommended naming:
- folder: `packages/my-lib`
- workspace name: `@runilib/my-lib`

## 2. Create `package.json`

Use one of the existing libraries as the source of truth for versions and script naming.

Minimal cross-platform example:

```json
{
  "name": "@runilib/my-lib",
  "version": "1.0.0",
  "description": "Short description of the library.",
  "license": "MIT",
  "sideEffects": false,
  "publishConfig": {
    "access": "public"
  },
  "main": "./dist/index.mjs",
  "types": "./dist/index.d.mts",
  "react-native": "./dist/index.native.mjs",
  "exports": {
    ".": {
      "react-native": {
        "types": "./dist/index.native.d.mts",
        "default": "./dist/index.native.mjs"
      },
      "types": "./dist/index.d.mts",
      "import": "./dist/index.mjs",
      "default": "./dist/index.mjs"
    }
  },
  "files": [
    "dist",
    "README.md",
    "CHANGELOG.md",
    "LICENSE"
  ],
  "scripts": {
    "clean": "rimraf dist coverage",
    "dev": "tsup --watch --config tsup.config.ts",
    "build": "rimraf dist && tsup --config tsup.config.ts",
    "lint": "biome lint src .",
    "lint:fix": "biome lint --write src .",
    "check": "biome check src .",
    "check:fix": "biome check --write src .",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "prepack": "node ../../scripts/package-pack-sourcemaps.mjs hide",
    "postpack": "node ../../scripts/package-pack-sourcemaps.mjs restore",
    "prepublishOnly": "npm run typecheck && npm run lint && npm run test && npm run build"
  },
  "peerDependencies": {
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0",
    "react-native": ">=0.73.0"
  },
  "peerDependenciesMeta": {
    "react-dom": {
      "optional": true
    },
    "react-native": {
      "optional": true
    }
  }
}
```

Add only the dependencies the library truly needs:
- runtime deps in `dependencies`
- ecosystem deps such as `react`, `react-dom`, and `react-native` in `peerDependencies`
- build, test, and typing tools in `devDependencies`

Important:
- because `enableTransparentWorkspaces: false` is enabled in `.yarnrc.yml`, consumers must reference the package explicitly with `workspace:*`
- `prepack` and `postpack` hook into the repo's optional "publish without sourcemaps" mode used by the root release flow

## 3. Create TypeScript Config

`packages/my-lib/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "customConditions": ["react-native"],
    "resolvePackageJsonImports": false,
    "types": ["node", "react"],
    "noEmit": true
  },
  "include": ["src"]
}
```

`packages/my-lib/tsconfig-build.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "customConditions": ["react-native"],
    "resolvePackageJsonImports": false,
    "rootDir": "./src",
    "outDir": "./dist",
    "types": ["node", "react"],
    "declaration": true,
    "noEmit": false
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules", "**/*.test.*", "**/*.spec.*", "**/__tests__/**"]
}
```

If the package is not cross-platform, you can simplify these options.

## 4. Create the Build Config

`packages/my-lib/tsup.config.ts`

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "index.native": "src/index.native.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  target: "es2019",
  outDir: "dist",
  external: ["react", "react-dom", "react-native", "react-native-web"],
  tsconfig: "./tsconfig-build.json",
});
```

For a web-only package:
- remove `index.native`
- remove the `react-native` export field from `package.json`

## 5. Create the Test Config

`packages/my-lib/vitest.config.ts`

```ts
import { mergeConfig } from "vitest/config";
import { sharedVitestConfig } from "../../vitest.shared";

export default mergeConfig(sharedVitestConfig, {
  test: {
    name: "my-lib",
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
```

## 6. Create the Biome Config

`packages/my-lib/biome.jsonc`

```json
{
  "root": false,
  "extends": "//",
  "files": {
    "includes": ["src/**"]
  },
  "javascript": {
    "formatter": {
      "lineWidth": 90
    }
  }
}
```

## 7. Add the Source Entry Points

Minimal example:

`packages/my-lib/src/index.ts`

```ts
export function helloMyLib() {
  return "hello from my-lib";
}
```

`packages/my-lib/src/index.native.ts`

```ts
export { helloMyLib } from "./index";
```

Add at least one test:

`packages/my-lib/src/__tests__/hello.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { helloMyLib } from "../index";

describe("helloMyLib", () => {
  it("returns the expected message", () => {
    expect(helloMyLib()).toBe("hello from my-lib");
  });
});
```

## 8. Add Basic Package Docs

At minimum, add:
- `README.md`
- `CHANGELOG.md`
- `LICENSE`

Recommended:
- explain what the library does
- show a minimal usage example
- document installation and peer dependencies

## 9. Install or Refresh Dependencies

From the monorepo root:

```bash
yarn install
```

If you copied an existing package, check that you did not keep stale generated folders:
- `dist`
- `coverage`
- `.turbo`
- `node_modules`
- `*.tsbuildinfo`

## 10. Verify the Package in Isolation

From the monorepo root:

```bash
yarn workspace @runilib/my-lib check
yarn workspace @runilib/my-lib typecheck
yarn workspace @runilib/my-lib test
yarn workspace @runilib/my-lib build
```

The package is not ready until all four commands pass.

## 11. Wire the Package Into a Consumer App

To validate the package locally without publishing to npm, add it to one or more apps:

`examples/web/package.json`

```json
{
  "dependencies": {
    "@runilib/my-lib": "workspace:*"
  }
}
```

You can do the same in:
- `examples/mobile-app/package.json`
- `apps/landing/package.json`

Instead of editing `package.json` manually, you can also add the dependency with Yarn:

```bash
yarn workspace @examples/web add @runilib/my-lib@workspace:*
```

Pick at least one real consumer. For a cross-platform library, testing both web and mobile is strongly recommended.

If the consumer app displays the package version in the UI:
- do **not** hardcode the version string
- read it from the library `package.json` instead so the landing pages and docs stay aligned automatically after each release
- follow the existing pattern used in `apps/landing/src/data/packageVersions.ts` and `apps/react-formbridge-docs/src/data/packageVersion.ts`

Then run:

```bash
yarn workspace @examples/web dev
```

or:

```bash
yarn workspace @examples/mobile dev
```

## 12. Run the Repo-Level Validation

The CI currently validates the monorepo with:

```bash
yarn check
yarn typecheck
yarn test
yarn build
```

Before considering the library operational, run the same commands from the repo root.

## Definition of Done

The new library is operational when:

1. the workspace exists under `packages/<name>`
2. `yarn workspace @runilib/<name> check` passes
3. `yarn workspace @runilib/<name> typecheck` passes
4. `yarn workspace @runilib/<name> test` passes
5. `yarn workspace @runilib/<name> build` passes
6. at least one consumer app imports it through `workspace:*`
7. the consumer app runs successfully
8. root validation passes with `yarn check`, `yarn typecheck`, `yarn test`, and `yarn build`

## 13. Add Size Tracking

This repo now tracks package size in CI.

After adding a new package:

1. add a budget entry in [size-budgets.json](/Users/m989281/Documents/PROJECTS/runilib-monorepo/size-budgets.json)
2. run `yarn size:no-maps @runilib/my-lib` to inspect the real publish footprint
3. run `yarn size:markdown` to refresh [SIZE_REPORT.md](/Users/m989281/Documents/PROJECTS/runilib-monorepo/SIZE_REPORT.md)
4. run `yarn size:check` to confirm the new package passes the CI thresholds

## Optional Release Readiness

If the package will eventually be published:

1. make sure `README.md`, `CHANGELOG.md`, and `LICENSE` are present
2. keep the `files` array in `package.json` accurate
3. confirm `prepublishOnly` passes
4. follow [RELEASING.md](/Users/m989281/Documents/PROJECTS/runilib-monorepo/RELEASING.md)

If the package must also be mirrored to its own GitHub repository:

1. add it to [.github/mirror-packages.json](/Users/m989281/Documents/PROJECTS/runilib-monorepo/.github/mirror-packages.json)
2. create a matching folder under [.github/mirror-issue-drafts](/Users/m989281/Documents/PROJECTS/runilib-monorepo/.github/mirror-issue-drafts) using the mirror repo folder name
3. add a package-specific `README.md` plus any issue drafts you want to publish later

The issue publishing CLI discovers mirrored packages from `mirror-packages.json`, so new mirrored packages become supported automatically by `yarn issues:publish`.

## Copy Checklist

If you want the shortest possible checklist for contributors, use this:

1. create `packages/my-lib`
2. copy the config files from the closest existing library
3. rename the workspace to `@runilib/my-lib`
4. add `src/index.ts` and `src/index.native.ts` if needed
5. add at least one test under `src/__tests__`
6. run `yarn install`
7. run `yarn workspace @runilib/my-lib check`
8. run `yarn workspace @runilib/my-lib typecheck`
9. run `yarn workspace @runilib/my-lib test`
10. run `yarn workspace @runilib/my-lib build`
11. add `@runilib/my-lib: workspace:*` in at least one example or app
12. run the example app and verify the import works
13. run `yarn check`, `yarn typecheck`, `yarn test`, and `yarn build` from the root
14. add a budget entry in `size-budgets.json`
15. run `yarn size:markdown`
16. run `yarn size:check`

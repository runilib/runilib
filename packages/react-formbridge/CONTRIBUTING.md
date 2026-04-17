# Contributing to `@runilib/react-formbridge`

Thanks for your interest in improving `@runilib/react-formbridge`.

> **This repository is a read-only mirror.** All source code lives in the [runilib monorepo](https://github.com/runilib/runilib). Code changes pushed here will be overwritten by the next sync.

## Where to do what

| Task | Where |
| --- | --- |
| Report a bug | [Open an issue here](https://github.com/runilib/react-formbridge/issues/new/choose) |
| Request a feature | [Open an issue here](https://github.com/runilib/react-formbridge/issues/new/choose) |
| Ask a question | [Open an issue here](https://github.com/runilib/react-formbridge/issues/new/choose) |
| Submit a code change | [Open a PR on the monorepo](https://github.com/runilib/runilib) |

Issues opened here are automatically mirrored to the monorepo and tracked there.

## Good first issues

Looking to make your first contribution? Check the [`good first issue`](https://github.com/runilib/react-formbridge/labels/good%20first%20issue) label.

## Submitting code changes

All code changes happen in the monorepo. Here is the full flow.

### 1. Clone the monorepo

```bash
git clone https://github.com/runilib/runilib.git
cd runilib
corepack enable
yarn install
```

### 2. Work on the package

Source lives in `packages/react-formbridge/`.

```bash
cd packages/react-formbridge
yarn build
yarn typecheck
yarn lint
yarn test
```

### 3. Try your change against the examples

```bash
# From the monorepo root
yarn dev:ex:web     # web example
yarn dev:ex:mobile  # Expo mobile example
```

### 4. Add a changeset

If your change affects what users see (public API, behavior, types, deps), add a changeset:

```bash
yarn changeset
```

Pick the impacted packages and the right bump type (`patch` for fixes, `minor` for additions, `major` for breaking changes).

### 5. Open a PR on the monorepo

- Base: `main`
- Convention: use a branch name like `fix/formbridge-…`, `feat/formbridge-…`, `docs/formbridge-…`
- Commit messages follow conventional commits (`feat(react-formbridge): …`, `fix(react-formbridge): …`)

## PR checklist

Before requesting review:

- [ ] Build passes (`yarn build`)
- [ ] Typecheck passes (`yarn typecheck`)
- [ ] Lint passes (`yarn lint`)
- [ ] Tests pass (`yarn test`)
- [ ] Examples still work if behavior changed
- [ ] README updated if the public API changed
- [ ] Changeset added if release behavior changed

## What happens after merge

When your PR is merged into the monorepo's `main`:

1. The `Mirror Packages` workflow runs
2. `packages/react-formbridge/` is force-pushed to this mirror repository
3. Any open PRs on this mirror are overwritten

This is why direct PRs here are not accepted — they would be lost at the next sync.

## Getting in touch

For questions that don't fit an issue, [open a discussion on the monorepo](https://github.com/runilib/runilib/discussions) or contact the maintainers through the issue tracker.

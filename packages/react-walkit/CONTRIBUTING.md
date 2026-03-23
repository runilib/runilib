# Contributing to @runilib/react-walkit

Thank you for your interest in contributing to `@runilib/react-walkit`.

Before you start, please read this carefully:

> **This repository is a read-only mirror of the package maintained in the main Runilib monorepo.**
> All source code changes must be made in the main monorepo, not directly in this mirror repository.

---

## Table of Contents

- [Contributing to @runilib/react-walkit](#contributing-to-runilibreact-walkit)
  - [Table of Contents](#table-of-contents)
  - [Source of truth](#source-of-truth)
    - [Main repositories](#main-repositories)
  - [How contributions work](#how-contributions-work)
    - [Contribution flow](#contribution-flow)
    - [Important](#important)
  - [Who should be added as a contributor](#who-should-be-added-as-a-contributor)
    - [Why](#why)
    - [Recommended model](#recommended-model)
  - [How to request contributor access](#how-to-request-contributor-access)
    - [Contact channel](#contact-channel)
    - [What to send](#what-to-send)
    - [Access flow](#access-flow)
    - [Important notes](#important-notes)
  - [What maintainers do to grant access](#what-maintainers-do-to-grant-access)
    - [Recommended GitHub access model](#recommended-github-access-model)
    - [Typical maintainer steps](#typical-maintainer-steps)
    - [Recommended team structure](#recommended-team-structure)
    - [Access recommendations](#access-recommendations)
  - [Local development](#local-development)
    - [Clone the monorepo](#clone-the-monorepo)
    - [Work on the react-walkit package](#work-on-the-react-walkit-package)
    - [Run from the monorepo root](#run-from-the-monorepo-root)
    - [Run example applications](#run-example-applications)
    - [Use local workspaces during development](#use-local-workspaces-during-development)
    - [Repository structure](#repository-structure)
    - [Where to work](#where-to-work)
    - [Do not develop in the mirror repository](#do-not-develop-in-the-mirror-repository)
    - [Branching strategy](#branching-strategy)
    - [Recommended branch naming](#recommended-branch-naming)
    - [Pull request process](#pull-request-process)
    - [Before opening a PR](#before-opening-a-pr)
    - [PR checklist](#pr-checklist)
    - [PR description](#pr-description)
    - [Commit message conventions](#commit-message-conventions)
    - [Recommended format](#recommended-format)

---

## Source of truth

The official source code for `@runilib/react-walkit` lives in the **main Runilib monorepo**.

### Main repositories

- **Main repository (source of truth):** `runilib`
- **This repository:** read-only mirror of `@runilib/react-walkit`

That means:

- all development happens in the main monorepo
- all pull requests must be opened against the monorepo
- this mirror repository is updated automatically from the monorepo
- direct code changes made here may be overwritten by the sync process

---

## How contributions work

If you want to contribute code to `@runilib/react-walkit`, you must contribute through the main Runilib monorepo.

### Contribution flow

1. Request access to the main Runilib monorepo
2. Clone the monorepo locally
3. Create a branch
4. Work inside `packages/react-walkit`
5. Run build, lint, typecheck, and tests
6. Open a Pull Request against the monorepo
7. After merge, the mirror repository is updated automatically

### Important

Please do **not**:

- push directly to this mirror repository
- open feature pull requests here
- edit source files here expecting them to remain
- manually publish from this mirror repository

---

## Who should be added as a contributor

Anyone who needs to contribute to `@runilib/react-walkit` should normally be added to the **main Runilib monorepo**, not to this mirror repository.

### Why

Because the monorepo contains:

- the real source code
- shared tooling
- shared CI
- examples and playground apps
- internal package dependencies
- release tooling
- monorepo-wide linting, testing, and typechecking

### Recommended model

- contributors are added to the **main Runilib monorepo**
- contributors work in the monorepo
- this mirror repository remains read-only for normal development
- sync from monorepo to mirror is automated

---

## How to request contributor access

If you want to contribute code, do **not** request access in this mirror repository.

All contributor access is managed through the **main Runilib monorepo**.

### Contact channel

To request access, contact the maintainers privately at:

**[PUT_CONTRIBUTOR_CONTACT_HERE]**

Examples:
- `contributors@runilib.dev`
- `opensource@runilib.dev`

Please do **not** open a public issue just to request repository access.

### What to send

When requesting access, include:

- your **GitHub username**
- the package you want to contribute to  
  Example: `@runilib/react-walkit`
- a short description of the contribution you want to make
- optionally, your **GitHub account email** if maintainers invite by email

### Access flow

1. A maintainer reviews the request
2. If approved, the maintainer invites you to the GitHub organization
3. You accept the organization invitation
4. You are added to the appropriate team
5. The team grants you access to the main `runilib` monorepo
6. You contribute in the monorepo, not in the mirror repository

### Important notes

- the main source of truth is the **Runilib monorepo**
- mirror repositories are **read-only**
- code contributions must go through the monorepo
- if you are invited by **email**, it must match a **verified GitHub email**
- GitHub invitations expire if not accepted in time

---

## What maintainers do to grant access

This section is mainly for maintainers.

### Recommended GitHub access model

The recommended access model is:

- contributors are invited to the **GitHub organization**
- contributors are added to the relevant **team**
- the team is granted access to the **main monorepo**
- mirror repositories stay restricted or bot-managed

### Typical maintainer steps

1. Receive the contributor request
2. Review whether access is appropriate
3. Invite the contributor to the GitHub organization
4. Wait for the contributor to accept the invitation
5. Add the contributor to the correct team
6. Verify the team has the correct access level on the monorepo
7. Ask the contributor to work only in the monorepo

### Recommended team structure

Examples:

- `runilib-contributors`
- `runilib-maintainers`
- `runilib-react-walkit`

### Access recommendations

- `runilib-contributors` → `Write` access to the monorepo
- `runilib-maintainers` → elevated access if needed
- mirror repositories → restricted, bot-driven synchronization

---

## Local development

All local development should be done from the main Runilib monorepo.

### Clone the monorepo

```bash
git clone <MONOREPO_URL>
cd runilib
yarn install
```

### Work on the react-walkit package

```bash
cd packages/react-walkit
yarn build
yarn typecheck
yarn lint
```

### Run from the monorepo root

Recommended commands from the monorepo root:

```bash
yarn install
yarn build
yarn lint
yarn typecheck
```

### Run example applications

Web example:


```bash
yarn workspace @runilib/react-walkit dev
yarn workspace @examples/web dev
```

Mobile example:

```bash
yarn workspace @runilib/react-walkit dev
yarn workspace @examples/mobile expo start --clear 
```

### Use local workspaces during development

The monorepo uses local workspace linking so packages can be tested before publishing to npm.
Example:

```bash
"@runilib/react-walkit": "workspace:*"
```

This allows local development without publishing first.




### Repository structure

A typical structure looks like this:

```bash
runilib/
  package.json
  apps/
    web/
  examples/
    web/
    mobile-app/
  packages/
    react-walkit/
      src/
      dist/
      package.json
      README.md
      CHANGELOG.md
      LICENSE
```

### Where to work

If you are contributing to this package, your changes should usually happen in:

```bash
packages/react-walkit
```

### Do not develop in the mirror repository

This mirror repository exists for package visibility and package-level discovery only.

### Branching strategy

Create branches in the main monorepo, not here.

### Recommended branch naming

Use clear branch names such as:

```bash
feat/react-walkit-...
fix/react-walkit-...
refactor/react-walkit-...
docs/react-walkit-...
test/react-walkit-...
chore/react-walkit-...
```

Examples:

```bash
feat/react-walkit-add-anchor-offset-support
fix/react-walkit-web-mask-click-outside
refactor/react-walkit-native-overlay-positioning
docs/react-walkit-update-readme
```

### Pull request process

All pull requests must be opened against the main Runilib monorepo.

### Before opening a PR

Make sure that:

- your changes are in the correct package directory
- the package builds successfully
- lint passes
- typecheck passes
- tests pass
- examples still work if relevant
- public API changes are documented
- README is updated if needed
- A changeset is added if release behavior changed

### PR checklist

Before requesting review, verify:

- the change is made in packages/react-walkit
- the package builds successfully
- typecheck passes
- lint passes
- tests pass
- examples still work if affected
- documentation was updated if needed
- changelog/release note entry was added if needed

### PR description

A good PR description should include:

- what changed
- why it changed
- what platforms are affected
- how it was tested
- screenshots or recordings if UI behavior changed

### Commit message conventions

Use clear, focused commit messages.

### Recommended format

```bash
type(scope): summary
```

Examples:

```bash
feat(react-walkit): add ensureVisible before step measurement
fix(react-walkit): correct arrow alignment on mobile
refactor(react-walkit): split web and native overlay logic
docs(react-walkit): add contributor guide
test(react-walkit): cover spotlight transition logic
```

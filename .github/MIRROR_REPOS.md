# Mirror Repositories

## Purpose

This document explains how standalone package repositories are kept in sync with the monorepo.

It covers:
- the current direct mirror-to-`main` behavior
- the new mirror pull request visibility behavior
- mirrored issue synchronization behavior
- what users should expect when they visit a standalone package repository

For the operational setup, secrets, GitHub click paths, and end-to-end test flow, see:
- [MIRROR_SETUP.md](./MIRROR_SETUP.md)

## Source of Truth

The monorepo is the source of truth.

That means:
- all real development happens in the main monorepo
- standalone package repositories are synchronized views of selected package folders
- direct edits made in a mirror repository can be overwritten by the next sync

## Which Packages Are Mirrored

The source of truth for mirrored packages is:

[.github/mirror-packages.json](/Users/m989281/Documents/PROJECTS/runilib-monorepo/.github/mirror-packages.json)

At the moment, these packages are mirrored:
- `@runilib/react-formbridge` -> `runilib/react-formbridge`
- `@runilib/react-walkit` -> `runilib/react-walkit`

## Existing Behavior: Sync After Merge to `main`

Current workflow:
- file: [.github/workflows/mirror-packages.yml](/Users/m989281/Documents/PROJECTS/runilib-monorepo/.github/workflows/mirror-packages.yml)
- reusable workflow: [.github/workflows/mirror-package.yml](/Users/m989281/Documents/PROJECTS/runilib-monorepo/.github/workflows/mirror-package.yml)

What happens:
- on every `push` to `main` in the monorepo
- GitHub Actions detects which mirrored packages changed
- it creates a subtree split for each changed package
- it force-pushes that subtree to the target branch of the standalone repository

Important consequence:
- before the work is merged to `main`, the standalone repository did **not** previously show anything
- users visiting the standalone package repository could think nothing was being worked on yet

## New Behavior: Mirror Pull Requests for Visibility

New workflow:
- file: [.github/workflows/mirror-package-prs.yml](/Users/m989281/Documents/PROJECTS/runilib-monorepo/.github/workflows/mirror-package-prs.yml)

What it does:
- on pull requests targeting `main` in the monorepo
- checks which mirrored package paths are touched
- creates or updates a **draft pull request** in the matching standalone repository
- the mirror PR points back to the source monorepo PR
- when the monorepo PR is closed, the mirror PR is automatically closed too

Why this exists:
- if someone reports an issue against a standalone package repository
- and a fix is already being developed in the monorepo
- visitors to the standalone repository can now see an in-progress PR without needing to search the monorepo manually

## What Users Will Now See in a Standalone Package Repo

### If work is only in progress

They will see:
- a draft PR in the standalone repository
- a link to the monorepo PR
- a note explaining that the monorepo is the source of truth

### If the work is merged

They will then see:
- the normal subtree mirror sync update the package repository `main`

## What Is Not Mirrored

This setup mirrors code visibility, not full project management state.

It does **not** currently mirror:
- labels
- comments from the source PR
- review decisions from the source PR
- GitHub Projects state

So the new behavior solves:
- "is someone already working on this package?"
- "if someone opens an issue on the standalone package repository, can it be linked back into the monorepo?"

But it still does **not** fully synchronize all issue metadata between the monorepo and the standalone repositories.

## Issue Synchronization

There is now a lightweight mirrored issue flow.

### What happens when an issue is opened in a standalone package repo

- the issue can be mirrored into the monorepo
- the mirrored monorepo issue contains metadata linking back to the standalone repository issue
- the standalone repository issue gets a comment linking to the monorepo issue

### What happens when the standalone repository issue changes

- title and body updates are synced to the mirrored monorepo issue
- reopening the standalone repository issue reopens the mirrored monorepo issue
- closing the standalone repository issue closes the mirrored monorepo issue

### What happens when the monorepo issue is closed or reopened

- the issue state is synced back to the standalone repository issue

### What is intentionally not synchronized yet

- issue comments
- issue labels
- assignees
- milestones
- project status
- issue body edits made directly in the monorepo back to the mirror issue

This keeps the sync model simpler and avoids edit loops.

## Important Practical Rules

### Do not treat mirror PRs as the authoritative review workflow

Mirror PRs are informational.

They exist so package users can see:
- there is active work
- which monorepo PR is responsible

The real review and merge decision should stay in the monorepo.

### Do not make manual code edits in the mirror repo expecting them to persist

Why:
- the next subtree sync from the monorepo can overwrite them

### Keep mirror repository branch protection aligned with this model

If possible:
- do not use the standalone repository as the primary development entry point
- keep README/docs clear that the monorepo is the source of truth

## Trigger Summary

### On monorepo pull request open/update

Result:
- create or update draft PR in the standalone repository

### On monorepo pull request close

Result:
- close the draft PR in the standalone repository
- delete the temporary mirror branch

### On monorepo merge to `main`

Result:
- existing mirror sync workflow force-pushes the package subtree to the standalone repo target branch

## Secrets and Permissions

This mirror system uses:
- `MIRROR_PUSH_TOKEN`
- optional `MIRROR_GIT_USER_NAME`
- optional `MIRROR_GIT_USER_EMAIL`

Issue mirroring from standalone repos to the monorepo also requires:
- `MONOREPO_SYNC_TOKEN`

The token must be able to:
- push branches to the standalone repositories
- create and edit pull requests in the standalone repositories

In practice, that means the token should have at least:
- repository contents: write
- pull requests: write

For `MONOREPO_SYNC_TOKEN`, use a token that can:
- create and edit issues in `runilib/runilib`
- ideally be shared as an organization secret with the standalone mirror repositories

## How To Enable Issue Sync

To make mirrored issue synchronization work in practice:

1. create a token that can edit issues in the monorepo `runilib/runilib`
2. add it as `MONOREPO_SYNC_TOKEN`
3. make that secret available to the standalone mirror repositories
4. ensure `MIRROR_PUSH_TOKEN` also has `issues: write` on the standalone repositories
5. merge these workflow files to `main` in the monorepo
6. let the normal mirror sync propagate the package `.github/workflows/*` files into each standalone repository

After that:
- issues opened in the standalone package repo can be mirrored into the monorepo
- monorepo issue open/closed state can flow back to the standalone package issue

## Recommended Communication in Standalone Repos

If you want to reduce confusion even more, add a short note to each mirror repository README:

```md
This repository is mirrored from the runilib monorepo.
Active development happens in the monorepo.
Open or in-progress work may appear here as automated draft PRs for visibility.
```

This note is now intended to live directly in each package README so it is carried into the mirrored repository root.

## Suggested Next Step

After enabling this workflow, test the full path once:

1. open a PR in the monorepo that changes one mirrored package
2. verify a draft PR appears in the standalone repository
3. verify it updates on subsequent pushes to the monorepo PR
4. open an issue in the standalone repository and verify a linked monorepo issue is created
5. close or reopen the monorepo issue and verify the mirror issue state follows
6. merge or close the monorepo PR
7. verify the standalone mirror PR closes and the normal mirror sync updates `main`

If you want the exact screens to open in GitHub and the exact secrets to create, use:
- [MIRROR_SETUP.md](./MIRROR_SETUP.md)

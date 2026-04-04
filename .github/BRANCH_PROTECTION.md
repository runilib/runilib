# Branch Protection and Merge Control

## Purpose

This guide explains how to protect `main`, block direct pushes, and limit who can merge pull requests on GitHub.

It is written for this repository and assumes an organization-owned GitHub repository.

As of April 4, 2026:
- GitHub Free for organizations supports protected branches on **public** repositories
- for **private** repositories, branch protection features require a paid plan

Official GitHub docs:
- protected branches: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- managing branch protection: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches
- CODEOWNERS: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners

## Short Answer

Yes, you can:
- block direct pushes to `main`
- require pull requests before changes land on `main`
- require CI to pass
- require review before merge

But there is one important GitHub limitation:
- anyone with `write` or `admin` access can usually merge a PR once the rules are satisfied

That means:
- if you want **exactly one person** to be able to merge PRs, the simplest reliable setup is to give `write` or `admin` access to **that one person only**
- everyone else should use `read` or `triage` access and contribute through forks + pull requests

## Recommended Setup for This Repo

If your goal is:
- no direct pushes to `main`
- only one authorized person can merge

use this model:

1. one maintainer has `admin` or `write`
2. everyone else has `read` or `triage`
3. `main` is protected
4. pull requests are required
5. CI is required before merge
6. bypass is disabled

This is the cleanest setup on GitHub Free for a public org repository.

## Important Limitation About Reviews

If only one person has `write` access, be careful with:
- `Require approvals`
- `Require review from Code Owners`

Why:
- if the only maintainer opens a PR, a required approval can create a deadlock
- on GitHub, an author cannot meaningfully use review rules to self-approve in the way you want for strict branch protection

So you have two workable modes.

### Mode A: Single Maintainer Merge Control

Use this if:
- one person must be the only merger

Recommended settings:
- require pull request before merging: `on`
- required approvals: `0`
- require status checks: `on`
- require conversation resolution: `on`
- restrict who can push to matching branches: maintainer only
- do not allow bypassing the above settings: `on`

Result:
- nobody pushes directly to `main` except the allowed maintainer
- all changes still go through PRs
- only that maintainer can merge
- no approval deadlock

### Mode B: Reviewed Team Workflow

Use this if:
- you want at least one approval before merge
- you are okay with more than one trusted maintainer having merge power

Recommended settings:
- require pull request before merging: `on`
- required approvals: `1`
- dismiss stale approvals: `on`
- require approval of the most recent reviewable push: `on`
- require review from Code Owners: `on`
- require status checks: `on`
- require conversation resolution: `on`
- restrict who can push to matching branches: maintainers only
- do not allow bypassing the above settings: `on`

Result:
- safer review workflow
- but anyone with `write` can generally merge once rules pass

## Recommended CI Checks for This Repo

If you enable required status checks on `main`, select these checks from this repo:
- `Validate Monorepo`
- `Validate Changesets`

Why:
- `Validate Monorepo` runs the repository validation in `.github/workflows/ci.yml`
- `Validate Changesets` ensures release metadata exists on pull requests

You can keep deployment workflows out of required checks if you want merges to depend only on correctness, not deployment.

## Optional CODEOWNERS Setup

If you want GitHub to request review automatically, create a file:

`/.github/CODEOWNERS`

Example:

```txt
* @your-github-handle
```

Or with package-specific ownership:

```txt
/packages/react-formbridge/ @your-github-handle
/packages/react-walkit/ @your-github-handle
/apps/landing/ @your-github-handle
```

Important:
- CODEOWNERS helps route reviews
- it does **not** by itself guarantee that only one person can merge
- merge control still depends mainly on repository permissions plus branch protection

## How To Configure It in GitHub

### 1. Set Repository Access First

Before protecting `main`, fix who has write access.

From GitHub:

1. open the repository
2. click `Settings`
3. open the repository access section
4. depending on the UI, go to:
   - `Collaborators and teams`, or
   - `Manage access`, or
   - the equivalent repository access page
5. make sure only the authorized maintainer keeps `Write` or `Admin`
6. downgrade everyone else to `Read` or `Triage`

If your repository belongs to an organization, team permissions can also grant write access indirectly, so check both:
- direct collaborators
- teams with repository access

### 2. Create or Update `CODEOWNERS` If You Want Review Routing

If you want automatic review requests:

1. add `.github/CODEOWNERS`
2. commit it to the default branch

You do not need CODEOWNERS for direct-push blocking, but it is helpful for review workflows.

### 3. Add Branch Protection on `main`

From GitHub:

1. open the repository
2. click `Settings`
3. click `Branches`
4. under branch protection, click `Add rule`
5. set the branch name pattern to:

```txt
main
```

### 4. Enable the Core Protection Options

For the recommended single-maintainer setup, enable:

- `Require a pull request before merging`
- `Require status checks to pass before merging`
- `Require conversation resolution before merging`
- `Restrict who can push to matching branches`
- `Do not allow bypassing the above settings`

And keep these disabled unless you explicitly need them:
- `Allow force pushes`
- `Allow deletions`

### 5. Configure Pull Request Rules

For **Mode A: single maintainer only**

Set:
- required approvals: `0`

Why:
- this still forces PRs
- but avoids blocking the only maintainer from merging their own PR after CI passes

For **Mode B: reviewed team**

Set:
- required approvals: `1`
- dismiss stale approvals: `on`
- require approval of the most recent reviewable push: `on`
- require review from Code Owners: `on` if you use CODEOWNERS

### 6. Configure Required Status Checks

In the status checks section:

1. turn on `Require status checks to pass before merging`
2. select:
   - `Validate Monorepo`
   - `Validate Changesets`

If those checks are not listed yet:
- merge a PR that runs the workflows once
- then return to the branch protection rule and select them

### 7. Configure Push Restrictions

In `Restrict who can push to matching branches`:

1. add only the authorized maintainer, or the maintainer team
2. do not add general contributor teams

This blocks direct pushes from everyone else.

### 8. Disable Bypass

Enable:
- `Do not allow bypassing the above settings`

This is important if you want admins and maintainers to follow the same merge process.

Depending on the GitHub UI version, this may appear with wording similar to:
- `Include administrators`
- or `Do not allow bypassing the above settings`

### 9. Save the Rule and Test It

Test the setup with a non-maintainer account if possible:

1. try to push directly to `main`
2. confirm the push is rejected
3. open a pull request
4. confirm CI runs
5. confirm only the maintainer can merge

## Recommended Configuration Summary

For this repository, if you want one authorized merger only:

- repository visibility: public
- GitHub plan: GitHub Free for organizations is enough for protected branches on public repos
- `main` protected: yes
- direct pushes to `main`: blocked
- required PR: yes
- required approvals: `0`
- required CI checks:
  - `Validate Monorepo`
  - `Validate Changesets`
- conversation resolution: yes
- bypass: disabled
- write/admin access: one maintainer only

## If the Repository Is Private

If the repository is private and the organization is on GitHub Free:
- you may not get the branch protection features you want

In that case, the practical options are:
- make the repository public, if appropriate
- upgrade the organization plan

## Suggested Next Step

If you want, the next practical step is:

1. decide whether you want `Mode A` or `Mode B`
2. tell me the GitHub handle or team that should be allowed to merge
3. I can then generate a ready-to-commit `.github/CODEOWNERS` file for this repo

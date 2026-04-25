# Move mirror automation to a dedicated `runilib-bot` account

This guide explains how to move the runilib mirror automation away from a personal GitHub account and onto a dedicated bot account, without breaking the existing workflows.

The immediate goal is:

- mirror repositories can protect `main`
- automated mirror pushes are clearly attributed to `runilib-bot`
- personal tokens are removed from repository secrets
- existing workflows continue to work with minimal YAML changes

## Current automation model

The monorepo currently uses a few different credentials:

| Secret / token | Used for | Keep? |
| --- | --- | --- |
| `GITHUB_TOKEN` | Normal GitHub Actions token for the current repo. Used for monorepo release PRs and monorepo GitHub releases. | Yes |
| `MIRROR_PUSH_TOKEN` | Pushes package subtrees to mirror repos, creates mirror PRs, closes mirror PRs, creates mirror releases, syncs mirrored issue state. | Replace with bot token |
| `MIRROR_GIT_USER_NAME` | Git author name used for mirror commits/tags. | Update to bot name |
| `MIRROR_GIT_USER_EMAIL` | Git author email used for mirror commits/tags. | Update to bot email |
| `NPM_TOKEN` | Publishes npm packages. | Separate concern |
| `VERCEL_TOKEN` | Deploys docs / landing to Vercel. | Separate concern |

Relevant workflows:

- `.github/workflows/mirror-package.yml`
- `.github/workflows/mirror-package-prs.yml`
- `.github/workflows/mirror-packages.yml`
- `.github/workflows/release-mirrored-package.yml`
- `.github/workflows/release-mirror-manual.yml`
- `.github/workflows/sync-mirrored-issues-back.yml`
- `.github/workflows/release.yml`

The key secret to migrate is `MIRROR_PUSH_TOKEN`.

## Recommended path

Use a dedicated GitHub machine user first:

- username: `runilib-bot`
- token type: fine-grained personal access token
- token owner: `runilib-bot`
- selected repositories: only the mirror repositories

This is the smallest safe change because the current workflows already expect a token that can be used by `gh` and by `git push`.

Longer term, a GitHub App installation token is cleaner than a bot PAT, but it requires more setup and likely a workflow step to mint installation tokens. Do the machine-user migration first, then consider GitHub App later.

## Step 1: Create the bot GitHub account

1. Create a new GitHub account, for example `runilib-bot`.
2. Use a shared runilib-owned email address, not a personal email.
3. Enable 2FA on the account.
4. Store recovery codes in the runilib password manager.
5. Add a profile note like:

   ```text
   Automation account for runilib mirror repositories.
   ```

6. Do not use this account for human commits or reviews.

## Step 2: Add the bot to the GitHub organization

Invite `runilib-bot` to the `runilib` organization.

Recommended permissions:

- Do not make it owner unless absolutely necessary.
- Give it access only to the mirror repositories:
  - `runilib/react-formbridge`
  - `runilib/react-walkit`
- Give it write or maintain access on those mirror repositories.

If you plan to configure branch protection bypass by actor, the repository must belong to an organization. GitHub branch protection supports adding bypass actors for organization repositories.

## Step 3: Create a fine-grained PAT for the bot

Log in as `runilib-bot`, then create a fine-grained token.

Path:

```text
GitHub -> Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens -> Generate new token
```

Recommended token name:

```text
runilib mirror automation
```

Repository access:

```text
Only selected repositories
```

Select:

- `runilib/react-formbridge`
- `runilib/react-walkit`

Required repository permissions:

| Permission | Access | Why |
| --- | --- | --- |
| Contents | Read and write | Push mirror branches, force-push mirror `main`, push release tags |
| Pull requests | Read and write | Create, update, and close mirrored PRs |
| Issues | Read and write | Sync mirrored issue state back |
| Metadata | Read | Included automatically by GitHub |

Usually not needed:

- Actions
- Administration
- Secrets
- Workflows

Set an expiration date. Prefer something like 90 or 180 days and rotate it intentionally.

Copy the token once. GitHub will not show it again.

## Step 4: Replace the monorepo secrets

In the monorepo `runilib/runilib`, update the Actions secrets.

Path:

```text
runilib/runilib -> Settings -> Secrets and variables -> Actions -> Repository secrets
```

Set:

```text
MIRROR_PUSH_TOKEN=<new runilib-bot fine-grained PAT>
MIRROR_GIT_USER_NAME=runilib-bot
MIRROR_GIT_USER_EMAIL=<bot email>
```

For the email, use one of these:

```text
<bot-account-id>+runilib-bot@users.noreply.github.com
```

or a runilib-owned email:

```text
bot@runilib.dev
```

The noreply address is better if you want GitHub to attribute commits directly to `runilib-bot`.

You can find the account ID with:

```bash
gh api users/runilib-bot --jq '.id'
```

Then use:

```text
<id>+runilib-bot@users.noreply.github.com
```

## Step 5: Test the token before changing branch protection

Run a low-risk permission check from the monorepo Actions context.

Option A: manually run an existing workflow in dry/simple mode if available.

Option B: locally test with the token in a temporary shell:

```bash
export GH_TOKEN='<new token>'
gh repo view runilib/react-formbridge --json viewerPermission --jq '.viewerPermission'
gh repo view runilib/react-walkit --json viewerPermission --jq '.viewerPermission'
```

Expected result:

```text
WRITE
```

or:

```text
MAINTAIN
```

Then test API capabilities:

```bash
GH_TOKEN='<new token>' gh pr list --repo runilib/react-formbridge --limit 1
GH_TOKEN='<new token>' gh release list --repo runilib/react-formbridge --limit 1
```

Do not test force-push manually unless you use a temporary branch.

Safe temporary branch test:

```bash
git clone https://github.com/runilib/react-formbridge.git /tmp/react-formbridge-token-test
cd /tmp/react-formbridge-token-test
git checkout -b bot-token-test
git commit --allow-empty -m "test: verify bot token"
git push "https://x-access-token:${GH_TOKEN}@github.com/runilib/react-formbridge.git" bot-token-test
git push "https://x-access-token:${GH_TOKEN}@github.com/runilib/react-formbridge.git" :bot-token-test
```

Repeat for `runilib/react-walkit`.

## Step 6: Run the existing workflows once before protecting `main`

Before branch protection changes, verify the bot token works with the real workflows.

Recommended order:

1. Run mirror sync manually for one package.
2. Check that the pushed commit author is `runilib-bot`.
3. Run mirror PR sync with a test PR if needed.
4. Run issue publishing or issue sync only if needed.

Useful workflows:

```text
Actions -> Mirror Packages
Actions -> Release mirror manually
Actions -> Mirror Package PRs
```

If a workflow fails with:

```text
MIRROR_PUSH_TOKEN cannot write
```

then the bot either does not have repository access or the token does not include the right repository permissions.

## Step 7: Protect `main` on mirror repositories

Do this only after the bot token works.

For each mirror repository:

- `runilib/react-formbridge`
- `runilib/react-walkit`

Go to:

```text
Repository -> Settings -> Branches -> Add branch protection rule
```

Branch name pattern:

```text
main
```

Suggested settings:

- Require a pull request before merging.
- Require approvals if you want human review.
- Require status checks if the mirror repo has useful CI checks.
- Require conversation resolution if useful.
- Do not allow deletions.
- Do not enable "Do not allow bypassing the above settings" if the bot must bypass.

Important for the current workflow:

The mirror workflow force-pushes the subtree to `main`:

```bash
git push mirror mirror-branch:${TARGET_BRANCH} --force
```

So one of these must be true:

1. `runilib-bot` is allowed to bypass required pull requests and force-push to `main`.
2. You rewrite the mirror workflow to open PRs into mirror `main` instead of force-pushing.

For the current workflow, use option 1.

Recommended branch protection exceptions:

- Allow specified actors to bypass required pull requests: add `runilib-bot`.
- Allow force pushes, and if GitHub offers actor scoping for force pushes, allow only `runilib-bot`.
- If using "Restrict who can push to matching branches", add `runilib-bot`.

Avoid:

- allowing everyone to force-push
- giving broad admin bypass to all maintainers
- enabling "Do not allow bypassing the above settings" while expecting the bot to push

### Exact branch protection setup for bot-only bypass

Use this setup if you want `main` protected for humans, while only `runilib-bot` can keep the current mirror force-push workflow working.

Repeat these steps in each mirror repository:

- `runilib/react-formbridge`
- `runilib/react-walkit`

Go to:

```text
Repository -> Settings -> Branches -> Branch protection rules
```

Create or edit the rule for:

```text
main
```

Enable the normal human protections:

1. Enable `Require a pull request before merging`.
2. Enable `Require approvals` if you want reviews before human changes land.
3. Enable `Require status checks to pass before merging` only if the mirror repository has stable checks.
4. Enable `Require conversation resolution before merging` if you want that workflow.
5. Disable `Allow deletions`.

Then configure the bot exception:

1. Under the pull request requirement, enable:

   ```text
   Allow specified actors to bypass required pull requests
   ```

2. Add only:

   ```text
   runilib-bot
   ```

3. Do not add your personal account unless you intentionally want your personal account to bypass review.

Then configure push restrictions:

1. If you enable:

   ```text
   Restrict who can push to matching branches
   ```

   add:

   ```text
   runilib-bot
   ```

   and any human maintainer/team that should still be able to push non-bypass maintenance commits.

2. If your goal is strict protection, add only `runilib-bot` for direct pushes and make humans use PRs.

Then configure force push behavior:

1. Enable:

   ```text
   Allow force pushes
   ```

2. If GitHub shows a choice between everyone and specific actors, choose:

   ```text
   Specify who can force push
   ```

3. Add only:

   ```text
   runilib-bot
   ```

4. Never choose "Everyone" unless GitHub does not offer actor scoping on your plan/repo type and you have accepted that tradeoff.

Finally, make sure this setting is **not** enabled:

```text
Do not allow bypassing the above settings
```

If that option is enabled, the bypass list will not help and the mirror workflow will fail when it tries to push `main`.

### Safer alternative using repository rulesets

If GitHub shows `Rulesets` for your repository, you can use a ruleset instead of classic branch protection.

Path:

```text
Repository -> Settings -> Rules -> Rulesets -> New ruleset -> New branch ruleset
```

Suggested ruleset:

```text
Name: Protect mirror main
Enforcement status: Active
Target branches: Include default branch or include main
```

Rules:

- Require a pull request before merging.
- Require status checks if useful.
- Block deletions.
- Restrict updates if you want direct pushes limited.
- Allow force pushes only if the UI allows limiting bypass to `runilib-bot`.

Bypass list:

```text
runilib-bot: Always allow
```

Do not add broad teams or administrators to the bypass list unless you intentionally want them to skip the mirror protection.

The ruleset version is often clearer because the bypass list is explicit and centralized.

### Validate that only the bot can bypass

After saving the rule, run the real mirror workflow once:

```text
runilib/runilib -> Actions -> Mirror Packages -> Run workflow
```

Expected:

- the workflow succeeds
- mirror `main` updates
- the actor shown in the mirror commit/push is `runilib-bot`

Then test human protection with your own account:

1. Go to the mirror repo locally.
2. Try to push directly to `main` from your personal account.
3. It should be rejected, unless your personal account is still an admin bypass actor.

Do not use a real code change for this test. Use an empty commit only if you are ready to immediately reset it through the mirror workflow.

Safer human test:

```bash
git clone https://github.com/runilib/react-formbridge.git /tmp/react-formbridge-human-protection-test
cd /tmp/react-formbridge-human-protection-test
git checkout main
git commit --allow-empty -m "test: branch protection should reject this"
git push origin main
```

Expected result:

```text
remote: error: GH006: Protected branch update failed
```

If the push succeeds from your personal account, check:

- whether your personal account is in the bypass list
- whether admins are allowed to bypass
- whether "Restrict who can push" is disabled
- whether you configured the rule on the correct repository and branch

If you accidentally push the empty commit, run the mirror sync workflow again. The mirror workflow should restore `main` from the monorepo subtree.

## Step 8: Re-run mirror sync after protection

After protection is enabled, run the mirror workflow again.

Expected result:

- workflow succeeds
- `main` on the mirror repo updates
- pushed commit / tag is attributed to `runilib-bot`

If it fails after branch protection:

- check whether `runilib-bot` is in the bypass list
- check whether force pushes are allowed for the bot
- check whether branch restrictions include the bot
- check whether the token belongs to `runilib-bot`
- check whether the token is selected for the right repo

## Step 9: Remove old personal access

After the bot works:

1. Revoke the old personal PAT from your GitHub account.
2. Remove your personal account from mirror bypass lists.
3. If your personal account was only there for automation, reduce its mirror repo permission.
4. Keep yourself as org owner/admin through normal human access, not automation secrets.

## Step 10: Rotation process

Create a recurring reminder before the token expires.

Rotation checklist:

1. Log in as `runilib-bot`.
2. Create a new fine-grained PAT with the same permissions.
3. Replace `MIRROR_PUSH_TOKEN` in `runilib/runilib`.
4. Run:

   ```bash
   gh repo view runilib/react-formbridge --json viewerPermission --jq '.viewerPermission'
   gh repo view runilib/react-walkit --json viewerPermission --jq '.viewerPermission'
   ```

5. Run the mirror workflow manually.
6. Revoke the previous token.

Do not keep two long-lived mirror tokens active.

## Optional: move from PAT to GitHub App later

A GitHub App is cleaner because:

- permissions are explicit
- installation is scoped to selected repositories
- tokens are short-lived
- no machine-user login needs to be shared

But it requires extra setup:

1. Create a GitHub App owned by the `runilib` organization.
2. Give it repository permissions:
   - Contents: read/write
   - Pull requests: read/write
   - Issues: read/write
   - Metadata: read
3. Install it only on mirror repositories.
4. Store the App ID and private key as Actions secrets.
5. Add a workflow step that mints an installation token.
6. Replace `MIRROR_PUSH_TOKEN` usage with the minted token.

For now, the bot PAT migration is the safest incremental step.

## Optional: make release PRs appear as bot too

The monorepo release workflow currently uses `GITHUB_TOKEN` for release PR creation and monorepo releases.

That is fine and safer than using a broad PAT.

Only change this if you specifically want release PRs in the monorepo to be authored by `runilib-bot`.

If you do, create a separate secret such as:

```text
RUNILIB_BOT_TOKEN
```

and update only the release PR creation steps. Do not reuse `MIRROR_PUSH_TOKEN` for unrelated monorepo automation unless the token is intentionally allowed to access `runilib/runilib`.

## Workflow-specific checklist

### `mirror-package.yml`

Uses:

- `secrets.mirror_push_token`
- `secrets.mirror_git_user_name_secret`
- `secrets.mirror_git_user_email_secret`

Required bot access:

- write to mirror repo contents
- allowed to push / force-push to mirror `main`

### `mirror-package-prs.yml`

Uses:

- `secrets.MIRROR_PUSH_TOKEN`
- `secrets.MIRROR_GIT_USER_NAME`
- `secrets.MIRROR_GIT_USER_EMAIL`

Required bot access:

- push mirror PR branches
- create / edit / close pull requests
- delete temporary mirror branches

### `release-mirrored-package.yml`

Uses:

- `secrets.mirror_push_token`
- `secrets.mirror_git_user_name_secret`
- `secrets.mirror_git_user_email_secret`

Required bot access:

- force-push mirror `main`
- push tags
- create / edit releases

### `sync-mirrored-issues-back.yml`

Uses:

- `secrets.MIRROR_PUSH_TOKEN`

Required bot access:

- edit issues on mirror repositories

## Common failure modes

### `viewerPermission=READ`

The bot has repository access, but not enough write permission.

Fix:

- grant write/maintain access to the bot on the mirror repo
- confirm the fine-grained token includes that repository

### `Resource not accessible by personal access token`

The token is missing one of the required fine-grained permissions.

Fix:

- add Contents read/write
- add Pull requests read/write
- add Issues read/write

### Push rejected by branch protection

The token works, but branch protection blocks the bot.

Fix:

- add `runilib-bot` to the bypass list
- allow force pushes for `runilib-bot`
- do not enable "Do not allow bypassing the above settings"

### Release tag push fails

The bot can push branches but not tags.

Fix:

- confirm Contents read/write
- check tag protection rules if any exist

## Security notes

- Prefer fine-grained PATs over classic PATs.
- Scope the token to mirror repositories only.
- Do not give the bot org owner access.
- Rotate the token on a schedule.
- Keep `NPM_TOKEN` and `VERCEL_TOKEN` separate.
- Do not put bot credentials in local `.env` files committed to the repo.
- If the token leaks, revoke it immediately and rotate `MIRROR_PUSH_TOKEN`.

## References

- GitHub Docs: Managing branch protection rules  
  https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule
- GitHub Docs: About protected branches  
  https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- GitHub Docs: Using secrets in GitHub Actions  
  https://docs.github.com/actions/security-guides/using-secrets-in-github-actions
- GitHub Docs: Fine-grained PAT permissions  
  https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens

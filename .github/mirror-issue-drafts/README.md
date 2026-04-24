# Mirror Issue Drafts

This folder contains GitHub issue drafts split into one file per issue.

The CLI publisher discovers mirrored packages from [.github/mirror-packages.json](../mirror-packages.json), so it works for `react-formbridge`, `react-walkit`, and any future mirrored package added there.

## Repositories

- [react-formbridge](./react-formbridge/README.md)
- [react-walkit](./react-walkit/README.md)

## Usage

1. Open the draft file you want.
2. Copy the title from the first line.
3. Copy the body from the `Issue Body` section into GitHub.
4. Apply the suggested labels if useful.

## CLI

You can also publish these drafts directly from the monorepo with:

```bash
yarn issues:publish --file .github/mirror-issue-drafts/react-formbridge/07-add-clearable-select.md --dry-run
```

Useful commands:

```bash
# Preview one draft
yarn issues:publish --file .github/mirror-issue-drafts/react-formbridge/07-add-clearable-select.md --dry-run

# Publish all drafts for one mirror repo
yarn issues:publish --repo react-formbridge

# Preview all drafts for one mirror repo
yarn issues:publish --repo react-walkit --dry-run

# Use the workspace name instead of the repo folder
yarn issues:publish --repo @runilib/react-walkit --dry-run

# List every mirrored package known by the CLI
yarn issues:publish --list-repos

# Publish every draft in this folder tree
yarn issues:publish --all
```

Behavior:

- reads the title from the first heading
- reads the target repo from the `Repository:` line
- reads labels from `Suggested labels:`
- uses the `Issue Body` section as the GitHub issue body
- skips duplicates by exact title match unless you pass `--allow-duplicates`
- ignores missing labels instead of failing the whole issue creation

Prerequisite:

```bash
gh auth login -h github.com
```

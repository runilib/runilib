# Installation guide

## 1. Clone

```bash
git clone <your-repo-url>
cd runilib
```

## 2. Enable Corepack and install

```bash
corepack enable
yarn install
```

## 3. Set up your IDE for Biome

If you use VS Code, Cursor, or VSCodium, install the Biome extension:

- extension name: `Biome`
- extension id: `biomejs.biome`

This repo already includes a workspace config in [.vscode/settings.json](/Users/m989281/Documents/PROJECTS/runilib/.vscode/settings.json), so in most cases you only need to:

1. open the repo in your editor
2. install the Biome extension
3. allow workspace settings if your editor asks

If you do not have the workspace settings locally, create `.vscode/settings.json` and paste:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports.biome": "explicit",
    "quickfix.biome": "explicit"
  },
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "files.exclude": {
    "**/.turbo": true,
    "**/dist": true,
    "**/coverage": true,
    "**/.expo": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/.turbo": true,
    "**/dist": true,
    "**/coverage": true
  }
}
```

The repo also includes an [.editorconfig](/Users/m989281/Documents/PROJECTS/runilib/.editorconfig) so indentation, line endings, and trailing whitespace stay consistent across editors.

To verify that Biome is working correctly, you can run:

```bash
yarn biome:check
```

## 4. Start development

```bash
yarn dev
```

## 5. Run a single workspace

```bash
yarn workspace @runilib/web-app dev
yarn workspace @runilib/example-web dev
yarn workspace @runilib/example-mobile dev
yarn workspace @runilib/primitives dev
```

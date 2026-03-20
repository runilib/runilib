# Installation guide

## 1. Clone

```bash
git clone <your-repo-url>
cd runilib-monorepo
```

## 2. Enable Corepack and install

```bash
corepack enable
yarn install
```

## 3. Start development

```bash
yarn dev
```

## 4. Run a single workspace

```bash
yarn workspace @runilib/web-app dev
yarn workspace @runilib/example-web dev
yarn workspace @runilib/example-mobile dev
yarn workspace @runilib/primitives dev
```

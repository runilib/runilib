# runilib monorepo

Monorepo Yarn Workspaces pour développer des librairies React / React Native avec la même API, les tester localement sans publication NPM, puis les publier quand elles sont prêtes.

## Structure

```txt
runilib-monorepo/
├─ apps/
│  └─ web/                # site vitrine / doc / playground
├─ examples/
│  ├─ web/                # app web de test des libs
│  └─ mobile/             # app mobile Expo de test des libs
├─ packages/
│  ├─ primitives/         # composants cross-platform
│  └─ theme/              # design tokens partagés
├─ package.json
├─ turbo.json
└─ tsconfig.base.json
```

## Pourquoi cette structure

- `packages/*` contient les libs partageables.
- `apps/web` sert de site principal du projet.
- `examples/*` sert de sandbox pour valider les libs en local.
- Les apps consomment les packages du monorepo avec `workspace:*`, donc aucun publish NPM n'est nécessaire pour tester localement.
- Quand une lib est prête, `changesets` permet de versionner et publier proprement.

## Démarrage

### 1. Initialiser Yarn 4 avec Corepack

```bash
corepack enable
yarn install
```

### 2. Lancer tout le repo

```bash
yarn dev
```

Cela va :

1. builder une première fois les packages,
2. lancer les builds en watch sur les libs,
3. lancer les apps web et mobile.

## Commandes utiles

```bash
yarn build
yarn typecheck
yarn lint
yarn workspace @runilib/primitives build
yarn workspace @runilib/example-web dev
yarn workspace @runilib/example-mobile dev
```

## Ajouter une nouvelle lib

1. créer `packages/ma-lib`
2. ajouter un `package.json`
3. ajouter `build`, `dev`, `typecheck`
4. consommer la lib depuis une app avec :

```json
{
  "dependencies": {
    "@runilib/ma-lib": "workspace:*"
  }
}
```

## Publier plus tard sur npm

### Ajouter un changeset

```bash
yarn changeset
```

### Bumper les versions

```bash
yarn version-packages
```

### Publier

```bash
yarn release
```

## Notes importantes

- Le repo est configuré avec `nodeLinker: node-modules` pour éviter les frictions classiques entre PnP et l'écosystème React Native.
- `enableTransparentWorkspaces: false` force l'utilisation explicite de `workspace:*`, ce qui évite les résolutions implicites trompeuses.
- Les apps web utilisent `react-native-web` pour rendre les composants issus des packages React Native.

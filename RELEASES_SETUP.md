# GitHub Releases Like `react-hook-form`

## Objectif

Obtenir, pour nos libs, une page GitHub **Releases** propre comme `react-hook-form` :

- un tag lisible par version, par exemple `v1.2.3`
- une vraie GitHub Release liée à ce tag
- un titre du style `Version 1.2.3`
- un body de release avec les fixes / features importants
- les assets GitHub automatiques (`Source code (zip)` / `Source code (tar.gz)`)
- idéalement la release visible dans le **repo de la lib** (`runilib/react-formbridge`), pas seulement dans le monorepo

---

## État actuel dans ce repo

L’automatisation a maintenant été branchée dans le monorepo :

- le workflow principal de release expose les packages réellement publiés dans [.github/workflows/release.yml](/Users/m989281/Documents/PROJECTS/runilib-monorepo/.github/workflows/release.yml)
- un workflow réutilisable crée ou met à jour la release dans chaque repo miroir via [.github/workflows/release-mirrored-package.yml](/Users/m989281/Documents/PROJECTS/runilib-monorepo/.github/workflows/release-mirrored-package.yml)
- les notes de release sont extraites depuis le `CHANGELOG.md` du package avec [scripts/extract-package-release-notes.mjs](/Users/m989281/Documents/PROJECTS/runilib-monorepo/scripts/extract-package-release-notes.mjs)

En pratique, après un publish réussi via Changesets :

- le subtree du package est poussé sur le repo miroir
- le tag `vX.Y.Z` est créé dans ce repo miroir
- la GitHub Release `Version X.Y.Z` est créée ou mise à jour dans ce même repo

---

## Ce qu’on a déjà

Le repo est déjà bien avancé pour la partie versioning / publish :

- `Changesets` est configuré dans [.changeset/config.json](/Users/m989281/Documents/PROJECTS/runilib-monorepo/.changeset/config.json)
- le workflow de release existe dans [.github/workflows/release.yml](/Users/m989281/Documents/PROJECTS/runilib-monorepo/.github/workflows/release.yml)
- la publication npm passe par [scripts/changeset-publish.mjs](/Users/m989281/Documents/PROJECTS/runilib-monorepo/scripts/changeset-publish.mjs)
- les repos miroirs existent déjà via [.github/mirror-packages.json](/Users/m989281/Documents/PROJECTS/runilib-monorepo/.github/mirror-packages.json)

En clair : on sait déjà **versionner**, **générer les changelogs** et **publier**.

---

## Pourquoi on n’a pas encore le rendu `react-hook-form`

Le rendu GitHub Releases comme sur ton screenshot ne vient pas juste du publish npm.

Il faut en plus :

1. créer un **tag Git** dans le repo qui doit afficher la release
2. créer un objet **GitHub Release** dans ce même repo
3. fournir un **body de release** propre

Le point clé : une release GitHub est **attachée à un repository**.

Donc si on veut que :

- `runilib/runilib` affiche les releases, il faut créer les releases dans le monorepo
- `runilib/react-formbridge` affiche les releases, il faut créer les releases dans **le repo miroir de la lib**

Aujourd’hui, le mirroring pousse bien le code vers les repos standalone, mais ne crée pas encore les **tags** et les **GitHub Releases** dans ces repos.

---

## Recommandation

Pour avoir un résultat vraiment comparable à `react-hook-form`, je recommande :

### Option recommandée

Créer les releases dans **chaque repo de lib** :

- `runilib/react-formbridge`
- `runilib/react-walkit`

Pourquoi :

- l’utilisateur voit directement les releases dans le repo de la lib
- le tag `v1.0.1` appartient au bon projet
- la page Releases est propre et compréhensible
- ça colle mieux à l’usage “repo package public”

### Option minimale

Créer les releases uniquement dans `runilib/runilib`.

Ça marche, mais ce sera moins clean pour les libs mirrorées, car la release sera “perdue” dans le monorepo.

---

## Le flow cible

### 1. Développer normalement

- on merge une PR sur `main`
- on ajoute un changeset pour la ou les libs impactées

### 2. Changesets ouvre / met à jour la Release PR

Le workflow actuel le fait déjà :

- bump de version
- mise à jour de `CHANGELOG.md`

### 3. On merge la Release PR

À ce moment-là :

- les packages sont publiés sur npm
- on connaît la version finale de chaque lib publiée

### 4. Après publish, on crée la GitHub Release dans le bon repo

Pour chaque package publié :

- push d’un tag `vX.Y.Z` dans le repo cible
- création d’une GitHub Release `Version X.Y.Z`
- body alimenté à partir du changelog ou d’un template généré

---

## Ce qu’il faut ajouter concrètement

## Étape 1. Rendre explicite la création de GitHub Releases côté monorepo

Dans [.github/workflows/release.yml](/Users/m989281/Documents/PROJECTS/runilib-monorepo/.github/workflows/release.yml), garder `changesets/action`, mais rendre explicite l’intention :

- `createGithubReleases: true`

Même si le comportement peut déjà être géré par l’action, le mettre explicitement évite toute ambiguïté.

Important :

- cela crée des releases dans le **repo courant**
- donc utile pour le monorepo, mais pas suffisant pour les repos standalone

---

## Étape 2. Décider du format de tag

Pour les repos standalone, utiliser :

```txt
vX.Y.Z
```

Exemples :

- `v1.0.1`
- `v2.3.0`

Pourquoi :

- c’est le format le plus lisible côté GitHub
- c’est celui qu’on retrouve souvent sur les repos de libs
- ça donne exactement le rendu “Version x.y.z” attendu

À éviter dans les repos standalone :

- `@runilib/react-formbridge@1.0.1`

Ce format est utile en monorepo, mais moins joli pour un repo de package unique.

---

## Étape 3. Générer le contenu de release depuis le changelog package

Le plus simple est d’utiliser la dernière entrée de :

- [packages/react-formbridge/CHANGELOG.md](/Users/m989281/Documents/PROJECTS/runilib-monorepo/packages/react-formbridge/CHANGELOG.md)
- et équivalent pour chaque lib

Idée :

- après publication, lire la dernière section du changelog package
- transformer cette section en body GitHub Release

Avantages :

- une seule source de vérité
- pas de duplication entre npm / changelog / GitHub Release
- le contenu reste propre et relisible

---

## Étape 4. Ajouter un script qui extrait la dernière note de release d’un package

Ajouter un script du style :

- `scripts/extract-package-release-notes.mjs`

Responsabilité du script :

- prendre en entrée un chemin de package
- lire son `CHANGELOG.md`
- extraire la dernière version
- écrire un fichier markdown temporaire avec les notes

Exemple d’inputs :

- `packages/react-formbridge`
- version attendue : `1.0.1`

Exemple d’output :

- titre : `Version 1.0.1`
- notes markdown prêtes pour `gh release create`

---

## Étape 5. Ajouter un workflow ou script pour créer les releases dans les repos miroirs

Il faut un nouveau workflow, par exemple :

- `.github/workflows/release-mirrored-packages.yml`

Ce workflow doit :

1. récupérer la liste des packages publiés
2. mapper chaque package vers son repo cible via [.github/mirror-packages.json](/Users/m989281/Documents/PROJECTS/runilib-monorepo/.github/mirror-packages.json)
3. pousser le tag dans le repo miroir
4. créer la GitHub Release dans ce repo

Commande typique :

```bash
gh release create "v1.0.1" \
  --repo runilib/react-formbridge \
  --title "Version 1.0.1" \
  --notes-file /tmp/react-formbridge-release-notes.md
```

Important :

- le tag doit exister dans le repo cible
- ou bien `gh release create` doit pouvoir le créer à partir du commit poussé

---

## Étape 6. Pousser le bon commit dans le repo miroir avant de tagger

Comme les repos standalone sont alimentés par subtree mirror, il faut s’assurer que :

- le commit correspondant à la version publiée est bien poussé sur le repo miroir
- puis seulement après on crée le tag et la release

En pratique :

1. le code est mirroré sur `main` du repo standalone
2. on crée le tag `vX.Y.Z` sur ce commit
3. on crée la GitHub Release

Sinon on risque :

- une release qui pointe vers un commit absent du repo miroir
- ou un tag incohérent

---

## Étape 7. Ajouter les bons secrets GitHub

Pour créer une release dans un autre repo, il faut un token qui a accès à ce repo.

Il faudra au minimum :

- un token avec `contents: write`

Si on veut opérer sur les repos mirrorés depuis le monorepo :

- réutiliser ou étendre le token de mirroring s’il a déjà les bons scopes
- sinon créer un token dédié release/mirror

Secrets probablement nécessaires :

- `MIRROR_PUSH_TOKEN` si on l’utilise déjà pour pousser dans les repos mirrors
- ou un nouveau secret du style `MIRROR_RELEASE_TOKEN`

---

## Étape 8. Soigner le texte des changesets

Le rendu à la `react-hook-form` dépend beaucoup de la qualité du texte source.

Si les changesets sont vagues, la release sera vague.

Bon format :

```md
Improve field prop forwarding on web and native renderers.

- remove deprecated behavior API
- pass direct field props through specialized renderers
- align web and native typing surfaces
```

Moins bon :

```md
fix stuff
```

---

## Étape 9. Facultatif mais utile : ajouter des assets custom

GitHub ajoute déjà :

- `Source code (zip)`
- `Source code (tar.gz)`

Si on veut aller plus loin, on peut aussi uploader :

- un `.tgz` npm pack
- un zip de build
- des release artifacts

Mais pour ressembler à `react-hook-form`, ce n’est pas obligatoire.

---

## Ce que je ferais dans ce repo

Ordre recommandé :

1. garder l’existant `Changesets + publish`
2. rendre explicite `createGithubReleases: true` dans le workflow de release monorepo
3. ajouter un script qui extrait les notes depuis le `CHANGELOG.md` du package
4. ajouter un workflow post-publish qui :
   - détecte les packages publiés
   - résout leur repo miroir
   - crée le tag `vX.Y.Z`
   - crée la GitHub Release dans le repo miroir
5. standardiser le contenu des changesets pour obtenir des notes de release propres

---

## Résumé simple

Pour avoir une page comme `react-hook-form`, il ne suffit pas de publier sur npm.

Il faut automatiser trois choses :

1. **versionner**
2. **tagger**
3. **créer la GitHub Release dans le bon repo**

Dans votre cas, le vrai manque n’est pas le versioning.
Le vrai manque, c’est la création de **releases GitHub dans les repos standalone mirrorés**.

---

## Si on veut le faire après ce guide

La suite logique serait :

1. ajouter le script d’extraction des notes
2. ajouter le workflow `release-mirrored-packages.yml`
3. brancher ça sur la fin du workflow de release actuel

Si tu veux, je peux faire la prochaine étape directement :

- soit je te fais le **workflow complet**
- soit je te fais d’abord le **script + le workflow minimal**

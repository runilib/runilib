# Analyse Future API: Conditional Logic

## Périmètre

Cette note analyse la surface actuelle autour de:

- la visibilité
- le `required`
- le `disabled`
- le comportement des valeurs quand un champ devient caché

L’objectif est de répondre à cette question:

> Quelles méthodes manquent encore si on veut, à terme, une API de conditional logic vraiment complète, capable de couvrir presque tous les cas sans obliger les utilisateurs à tomber trop vite sur des predicates custom ?

## Sources relues

- `apps/react-formbridge-docs/src/data/docs/sections/conditional.ts`
- `apps/react-formbridge-docs/src/data/docs/constants.ts`
- `packages/react-formbridge/src/core/field-builders/base/BaseFieldBuilder.ts`
- `packages/react-formbridge/src/core/field-builders/file/FileFieldBuilder.ts`
- `packages/react-formbridge/src/core/conditions/conditions.ts`
- `packages/react-formbridge/src/hooks/shared/useFormBridgeCore.ts`

## Surface publique actuelle

### Visibility

Méthodes actuellement exposées:

- `visibleWhen(field, value?)`
- `visibleWhen(predicate)`
- `visibleWhenNot(field, value)`
- `visibleWhenTruthy(field)`
- `visibleWhenFalsy(field)`
- `visibleWhenAny(pairs)`
- `visibleAndRequiredWhen(fieldOrPredicate, value?)`

### Required

Méthodes actuellement exposées:

- `requiredWhen(field, value?)`
- `requiredWhen(predicate)`
- `requiredWhenAny(pairs)`

### Disabled

Méthodes actuellement exposées:

- `disabledWhen(field, value?)`
- `disabledWhen(predicate)`

### Hidden value behavior

Méthodes actuellement exposées:

- `resetOnHide()`
- `clearOnHide()`
- `keepOnHide()`

## Ce qui est déjà bien couvert

La surface actuelle est déjà bonne pour:

- les gates booléens simples
- les branches basées sur une égalité
- les petits OR sur une courte liste de couples `[field, value]`
- les comportements simples quand un champ devient caché
- les cas plus avancés via predicate custom

Pour beaucoup de formulaires réels, c’est déjà suffisant.

## Observations importantes avant d’ajouter de nouvelles méthodes

### 1. Le moteur supporte déjà plus d’opérateurs que l’API builder n’en expose

Dans `packages/react-formbridge/src/core/conditions/conditions.ts`, le runtime sait déjà évaluer:

- `gt`
- `gte`
- `lt`
- `lte`
- `in`
- `notIn`

Mais ces opérateurs ne sont pas encore exposés proprement via le fluent builder.

Conséquence:

- il y a des ajouts futurs qui sont probablement peu coûteux
- le moteur est déjà plus riche que la surface publique

### 2. Le `required` dynamique est uniquement additif

Aujourd’hui, on peut dire:

- "ce champ devient required quand X"

Mais on ne peut pas dire proprement:

- "ce champ est required par défaut, sauf quand X"
- "ce champ est optional dans telle branche"

En pratique, il manque une vraie notion d’`optionalWhen(...)` ou d’équivalent.

### 3. La politique `onHide` mélange conservation d’état et politique de submit

Aujourd’hui, `resetOnHide`, `clearOnHide` et `keepOnHide` décident quoi faire de la valeur stockée quand le champ devient caché.

En revanche, elles ne permettent pas d’exprimer séparément:

- garder la valeur en mémoire pour restaurer l’UI plus tard
- mais ne pas la soumettre tant que le champ est caché

C’est un des plus gros trous actuels si on veut une API vraiment complète.

### 4. Le meta-state n’est pas configurable à la disparition d’un champ

Quand un champ devient caché, on contrôle la valeur.

Mais on ne contrôle pas:

- `touched`
- `dirty`
- les erreurs du champ
- une éventuelle revalidation au moment où le champ réapparaît

Pour des flows un peu sophistiqués, ça manque.

### 5. La sémantique `disabled` doit être clarifiée avant d’étendre l’API

Le résumé de doc laisse entendre que plusieurs helpers se composent de manière homogène, mais le runtime dans `packages/react-formbridge/src/core/conditions/conditions.ts` évalue aujourd’hui `disabled` en **OR**:

- `visible`: AND
- `required`: AND
- `disabled`: OR

Ce comportement n’est pas forcément mauvais, mais il faut le figer clairement avant d’ajouter plus de méthodes autour de `disabled`.

### 6. Les predicates doc et runtime ne sont pas totalement alignés

Le wording de certaines docs laisse penser à une signature du type:

`(values, ctx) => boolean`

Alors que le type runtime actuel est plutôt:

`(values) => boolean`

Si on veut aller vers une surface hyper complète, le `ctx` sera utile tôt ou tard.

## Les méthodes manquantes les plus importantes

## P0: Les ajouts les plus utiles à court terme

Ce sont les méthodes qui bouchent de vrais trous produit et qui apporteraient le plus de valeur immédiatement.

### 1. `optionalWhen(...)`

Ajouts recommandés:

- `optionalWhen(field, value?)`
- `optionalWhen(predicate)`
- `optionalWhenAny(pairs)`

Pourquoi c’est important:

- aujourd’hui il n’existe pas de manière claire d’exprimer "required par défaut, sauf si X"
- c’est un besoin très fréquent en vrai produit
- devoir passer par un predicate custom trop tôt nuit à la lisibilité du schema

Cas concrets:

- un tax ID requis sauf pour un compte individuel
- un téléphone requis sauf si le contact préféré est email
- un code postal requis sauf si livraison digitale

### 2. `requiredWhenNot(...)`, `requiredWhenTruthy(...)`, `requiredWhenFalsy(...)`

Ajouts recommandés:

- `requiredWhenNot(field, value)`
- `requiredWhenTruthy(field)`
- `requiredWhenFalsy(field)`

Pourquoi c’est important:

- `visibility` a déjà cette symétrie
- `required` ne l’a pas
- ce sont des cas trop fréquents pour être repoussés systématiquement vers un predicate

### 3. `disabledWhenAny(...)`

Ajout recommandé:

- `disabledWhenAny(pairs)`

Pourquoi c’est important:

- même si le runtime actuel se comporte déjà comme un OR, l’API ne le rend pas explicite
- ça améliore la lisibilité et la discoverability
- ça met `disabled` au même niveau de confort que `visibleWhenAny` et `requiredWhenAny`

### 4. `disabledWhenNot(...)`, `disabledWhenTruthy(...)`, `disabledWhenFalsy(...)`

Ajouts recommandés:

- `disabledWhenNot(field, value)`
- `disabledWhenTruthy(field)`
- `disabledWhenFalsy(field)`

Pourquoi c’est important:

- même logique que pour `required`
- une fois qu’un utilisateur apprend `visibleWhenNot`, il s’attend naturellement à la même famille sur `disabled`

### 5. `readOnlyWhen(...)`

Ajouts recommandés:

- `readOnlyWhen(field, value?)`
- `readOnlyWhen(predicate)`
- éventuellement `readOnlyWhenAny(pairs)`

Pourquoi c’est important:

- `disabled` et `readOnly` ne sont pas la même intention UX
- un champ disabled est souvent "non disponible"
- un champ read-only est souvent "visible, important, mais non éditable"

Cas concrets:

- numéro de commande visible mais verrouillé après submit
- nom légal visible mais non éditable après KYC
- prix affiché mais non modifiable selon le plan

### 6. `omitWhenHidden()` et `omitWhenDisabled()`

Ajouts recommandés:

- `omitWhenHidden()`
- `submitWhenHidden()`
- `omitWhenDisabled()`
- `submitWhenDisabled()`

Pourquoi c’est important:

- conserver une valeur en state et la soumettre sont deux sujets différents
- `keepOnHide()` est utile pour restaurer une branche, mais pas toujours acceptable pour le payload
- certains champs disabled doivent rester visibles mais être exclus du submit

C’est probablement l’un des plus gros gaps actuels.

### 7. `setOnHide(...)` ou `transformOnHide(...)`

Ajouts recommandés:

- `setOnHide(value)`
- `transformOnHide(fn)`

Pourquoi c’est important:

Aujourd’hui, on n’a que trois stratégies:

- reset
- clear
- keep

Ce n’est pas suffisant pour tous les workflows.

Cas concrets:

- remplacer un objet complexe par une shape minimale sûre
- injecter une valeur sentinelle du type `"not_applicable"`
- conserver seulement une version raw

### 8. `stashOnHide()` / `restoreOnShow()`

Ajout recommandé:

- une méthode de plus haut niveau du type `stashOnHide()`

Comportement attendu:

- le champ caché n’est pas soumis
- la valeur n’est plus active dans la branche courante
- si la branche réapparaît, la saisie utilisateur revient

Pourquoi c’est important:

Aujourd’hui:

- `keepOnHide()` garde trop
- `clearOnHide()` perd la saisie
- `resetOnHide()` perd la saisie

Il manque une vraie stratégie "stash temporaire".

## P1: Les ajouts de complétude forte

Ils sont un peu moins urgents, mais ils élargissent beaucoup la couverture sans forcer les predicates.

### 9. Exposer publiquement les comparateurs déjà supportés par le moteur

Ajouts recommandés:

- `visibleWhenIn(field, values)`
- `visibleWhenNotIn(field, values)`
- `visibleWhenGt(field, value)`
- `visibleWhenGte(field, value)`
- `visibleWhenLt(field, value)`
- `visibleWhenLte(field, value)`

Et la même famille pour:

- `requiredWhen...`
- `disabledWhen...`

Pourquoi c’est important:

- le moteur sait déjà faire
- le builder ne l’expose pas
- ces opérateurs couvrent énormément de cas sans predicate

Cas concrets:

- visible si âge >= 18
- required si pays dans `['FR', 'DE', 'ES']`
- disabled si quota <= 0

### 10. Helpers de présence / emptiness

Ajouts recommandés:

- `visibleWhenPresent(field)`
- `visibleWhenEmpty(field)`
- `requiredWhenPresent(field)`
- `requiredWhenEmpty(field)`
- `disabledWhenPresent(field)`
- `disabledWhenEmpty(field)`

Pourquoi c’est important:

- `truthy` / `falsy` est parfois trop large
- `0`, `false`, `[]`, `''` et `null` ne veulent pas toujours dire la même chose métier
- `present` / `empty` est souvent beaucoup plus lisible dans les schemas

### 11. Helpers orientés arrays / multi-select

Ajouts recommandés:

- `visibleWhenContains(field, value)`
- `visibleWhenIntersects(field, values)`
- idem pour `requiredWhen...` et `disabledWhen...`

Pourquoi c’est important:

- les checkbox groups, multiselects et tags sont courants
- l’égalité simple ne suffit pas dès qu’un champ stocke une collection

### 12. Aliases de lisibilité

Ajouts recommandés:

- `hiddenWhen(...)`
- `enabledWhen(...)`
- `requiredUnless(...)`

Pourquoi c’est important:

- certains business rules se lisent naturellement en négatif
- ce n’est pas un gain de capacité pure, mais c’est un vrai gain de lisibilité

### 13. Helpers sur le meta-state au hide

Ajouts recommandés:

- `clearErrorsOnHide()`
- `clearTouchedOnHide()`
- `clearDirtyOnHide()`
- éventuellement `resetMetaOnHide()`

Pourquoi c’est important:

- la gestion de valeur seule ne suffit pas toujours
- une branche cachée doit parfois aussi nettoyer son état UX

Cas concrets:

- cacher un champ et faire disparaître proprement son ancienne erreur
- garder la valeur quelque part, mais arrêter de traîner un `touched/error` historique

## P2: La vraie couche “escape hatch propre”

Ces ajouts rendraient l’API très expressive sans multiplier les helpers à l’infini.

### 14. Méthodes génériques de matching

Au lieu d’ajouter 40 helpers explicites, on peut prévoir un point d’entrée générique par stack:

- `visibleWhenMatch(...)`
- `requiredWhenMatch(...)`
- `disabledWhenMatch(...)`

Exemple de direction:

```ts
field.text('VAT').visibleWhenMatch({
  field: 'country',
  op: 'in',
  values: ['FR', 'DE', 'ES'],
})
```

Pourquoi c’est important:

- ça évite l’explosion d’API
- ça s’aligne naturellement avec le modèle de conditions du runtime
- ça offre un escape hatch structuré sans forcer un predicate brut

### 15. Méthodes de groupes conditionnels imbriqués

Ajouts recommandés:

- `visibleWhenGroup(group)`
- `requiredWhenGroup(group)`
- `disabledWhenGroup(group)`

Avec un DSL plus riche du type:

```ts
field.text('Company ID').visibleWhenGroup({
  op: 'OR',
  conditions: [
    {
      op: 'AND',
      conditions: [
        { field: 'country', op: 'eq', value: 'FR' },
        { field: 'companyType', op: 'eq', value: 'sarl' },
      ],
    },
    {
      op: 'AND',
      conditions: [
        { field: 'country', op: 'eq', value: 'DE' },
        { field: 'companyType', op: 'eq', value: 'gmbh' },
      ],
    },
  ],
})
```

Pourquoi c’est important:

- l’API actuelle couvre beaucoup de cas simples
- elle ne couvre pas élégamment toutes les formes booléennes complexes
- les predicates règlent le problème techniquement, mais pas aussi bien en termes de lisibilité, tooling, docs, sérialisation ou future visual builder

### 16. Ajouter un vrai `ctx` aux predicates

Amélioration recommandée:

- faire évoluer les predicates vers une signature `(values, ctx) => boolean`

Le `ctx` pourrait contenir:

- les valeurs précédentes
- le nom du champ courant
- la `visibility` map actuelle
- éventuellement des métadonnées de form

Pourquoi c’est important:

- ça augmente la puissance sans forcer du glue code côté app
- ça aligne mieux la doc et le runtime

## Roadmap recommandée

Si le but est "hyper complet" sans transformer l’API en mur de méthodes, la meilleure stratégie me semble être:

### Phase 1

Ajouter les helpers symétriques les plus utiles:

- `optionalWhen`
- `requiredWhenNot`
- `requiredWhenTruthy`
- `requiredWhenFalsy`
- `disabledWhenAny`
- `disabledWhenNot`
- `disabledWhenTruthy`
- `disabledWhenFalsy`
- `readOnlyWhen`
- `omitWhenHidden`
- `omitWhenDisabled`

### Phase 2

Exposer les opérateurs déjà supportés par le moteur:

- `...WhenIn`
- `...WhenNotIn`
- `...WhenGt`
- `...WhenGte`
- `...WhenLt`
- `...WhenLte`

Puis ajouter:

- `...WhenPresent`
- `...WhenEmpty`
- les helpers collections

### Phase 3

Ajouter une vraie API générique de matching / group logic:

- `visibleWhenMatch`
- `requiredWhenMatch`
- `disabledWhenMatch`
- puis plus tard des groupes imbriqués

### Phase 4

Étendre le lifecycle des champs cachés:

- `setOnHide`
- `transformOnHide`
- `stashOnHide`
- `clearErrorsOnHide`
- `clearTouchedOnHide`
- `clearDirtyOnHide`

## Recommandation forte

Si on veut que la surface reste élégante, il ne faut pas continuer à empiler des helpers explicites indéfiniment.

La meilleure forme produit est probablement:

1. ajouter maintenant les helpers symétriques à très forte valeur
2. exposer les comparateurs déjà disponibles dans le moteur
3. introduire ensuite un matcher / DSL générique avant que la surface devienne trop volumineuse

Cette combinaison donne:

- une excellente discoverability pour les cas courants
- une vraie symétrie entre visibility / required / disabled
- une couverture très large sans predicate trop précoce
- une base plus propre pour les docs, la sérialisation, les builders visuels et les futures APIs JSON

## Les 10 méthodes que je prioriserais en premier

Si on veut un batch minimal mais très utile, je commencerais par:

- `optionalWhen`
- `disabledWhenAny`
- `readOnlyWhen`
- `omitWhenHidden`
- `omitWhenDisabled`
- `requiredWhenNot`
- `visibleWhenIn`
- `requiredWhenIn`
- `disabledWhenIn`
- `setOnHide`

À elles seules, ces méthodes combleraient déjà une grosse partie des trous actuels sans surdesigner l’API.

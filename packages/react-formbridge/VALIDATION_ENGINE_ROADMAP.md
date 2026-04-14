# React FormBridge Validation Engine Roadmap

## Objectif

Faire de `react-formbridge` un moteur de validation suffisamment complet pour que, dans la grande majorité des projets produit, les équipes n'aient plus besoin d'installer `Yup`, `Zod`, `Joi`, `Valibot` ou autre.

Le vrai seuil à atteindre n'est pas seulement "avoir plus de validateurs", mais couvrir en natif :

- les règles simples de champ
- les règles croisées entre champs
- les erreurs form-level
- l'async / serveur
- l'i18n des messages
- les structures imbriquées
- une API composable et réutilisable

## Must-have absolu (P0)

Si on veut être brutalement honnête, il y a un noyau minimum sans lequel `react-formbridge` ne remplacera jamais sérieusement un validateur externe.

Ce noyau P0 est le plus urgent.

### 1. Un vrai résultat de validation standardisé

- [x] `ValidationIssue`
  - `path`
  - `code`
  - `message`
  - `params`
- [x] `ValidationResult`
  - `success`
  - `data`
  - `issues`
  - `errorsByField`
  - `formErrors`
- [x] `schema.safeParse(values)`
- [x] `schema.safeParseAsync(values)`

Pourquoi c'est non négociable :
- sans structure d'issue stable, l'i18n, les erreurs form-level, les warnings, et le debug deviennent bancals
- sans `safeParse`, on n'a pas de vraie API moteur comparable à Zod/Yup

### 2. Un vrai niveau schema-level

- [x] `schema.refine(fn, message?)`
- [x] `schema.refineAsync(fn, message?)`
- [x] `schema.superRefine((values, ctx) => void)`
- [x] `schema.validate(values)`
- [x] `schema.validateAsync(values)`
- [x] `ctx.addIssue(issue)`

Pourquoi c'est non négociable :
- les gros formulaires réels cassent très vite le modèle "une règle = un champ"
- c'est la base de toute validation métier sérieuse

### 3. Les validateurs manquants les plus critiques

#### String

- [x] `nonEmpty(message?)`
- [x] `length(exact, message?)`
- [x] `between(min, max, message?)`
- [x] `oneOf(values, message?)`
- [x] `notOneOf(values, message?)`

#### Number

- [x] `gt(value, message?)`
- [x] `gte(value, message?)`
- [x] `lt(value, message?)`
- [x] `lte(value, message?)`
- [x] `between(min, max, message?)`
- [x] `multipleOf(value, message?)`

#### Date

- [x] `before(date, message?)`
- [x] `after(date, message?)`
- [x] `between(start, end, message?)`
- [x] `past(message?)`
- [x] `future(message?)`
- [x] `minAge(age, message?)`
- [x] `maxAge(age, message?)`

#### Select / radio

- [x] `oneOf(options, message?)`
- [x] `notOneOf(options, message?)`
- [x] `disallowPlaceholder(message?)`

Pourquoi c'est non négociable :
- ce sont les méthodes qui manquent immédiatement dès qu'on sort d'un formulaire simple
- sans elles, les gens retomberont vite sur Zod/Yup pour la moitié de leurs règles business

### 4. Les références et règles cross-field minimales

- [x] `ref('fieldName')`
- [ ] `ref('nested.path')`
- [x] `sameAs(ref)`
- [x] `greaterThan(ref)`
- [x] `lowerThan(ref)`
- [x] `schema.atLeastOne([...fields], message?)`
- [x] `schema.exactlyOne([...fields], message?)`
- [x] `schema.allOrNone([...fields], message?)`
- [x] `schema.dateRange({ start, end }, message?)`

Pourquoi c'est non négociable :
- c'est le cœur des validations "produit" réelles
- c'est aussi ce qui force aujourd'hui le plus souvent l'ajout d'un validateur externe

### 5. Les structures imbriquées minimales

- [ ] `field.object(shape)`
- [ ] `field.array(itemSchema)`
- [ ] nested `path`
- [ ] erreurs imbriquées par `path`
- [ ] valeurs par défaut imbriquées

Pourquoi c'est non négociable :
- tant qu'il n'y a pas `object` + `array`, on ne remplace pas un validateur externe sur des formulaires complexes
- c'est probablement le plus gros gap structurel actuel

### 6. L'async standardisé

- [x] `validateAsync(fn)`
- [x] `refineAsync(fn)`
- [ ] annulation via `AbortSignal`
- [ ] protection contre les réponses obsolètes
- [ ] debounce configurable
- [ ] cache TTL minimal

Pourquoi c'est non négociable :
- username uniqueness, promo code, email availability, VAT check, city lookup, etc. sont des cas très fréquents
- sans standard async clair, chaque app recodera son propre moteur

### 7. L'i18n minimale

- [x] `errorMap(issue => message)`
- [x] codes d'erreur stables
- [x] interpolation de paramètres

Pourquoi c'est non négociable :
- dès qu'une lib devient partagée entre plusieurs apps ou plusieurs pays, les messages hardcodés deviennent un mur

## Ce qu'il ne faut pas prioriser avant le P0

Ces éléments sont utiles, mais ne doivent pas passer avant le noyau ci-dessus :

- `field.union(...)`
- `field.discriminatedUnion(...)`
- `validator.pack(...)`
- `schema.use(rulePack)`
- `toJSONSchema()`
- `debugValidation()`
- warnings non bloquants
- validateurs métier très spécialisés (`iban`, `bic`, `creditCard`, etc.)
- DSL conditionnelle avancée exposée publiquement

## Ordre concret recommandé

Si on devait l'implémenter en vrai dans le bon ordre :

1. `ValidationIssue` + `ValidationResult` + `safeParse()`
2. `schema.refine()` + `schema.superRefine()` + `ctx.addIssue()`
3. validateurs primitifs manquants (`nonEmpty`, `length`, `gt/gte/lt/lte`, `before/after`, etc.)
4. `ref()` + cross-field minimum (`atLeastOne`, `exactlyOne`, `dateRange`)
5. `field.object()` + `field.array()` + nested paths
6. async standardisé
7. `errorMap()` + codes d'erreur stables

## État actuel

### Déjà disponible

- Base :
  - `required()`
  - `optional()`
  - `validate(fn)`
  - `defaultValue()`
  - `transform()`
- String :
  - `min()`
  - `max()`
  - `pattern()`
  - `patterns()`
  - `format()`
  - `trim()`
  - `lowercase()`
  - `uppercase()`
  - `matches()`
  - `sameAs()`
- Email :
  - `excludeEmailDomains()`
- Number :
  - `min()`
  - `max()`
  - `positive()`
  - `nonNegative()`
  - `integer()`
  - `step()`
- Date :
  - `minDate()`
  - `maxDate()`
- Boolean :
  - `mustBeTrue()`
- Password :
  - `strong()`
- OTP :
  - `length()`
  - `digitsOnly()`
- File :
  - `accept()`
  - `maxSize()`
  - `multiple()`
- Phone :
  - `validateFormat()`
- Conditions de runtime :
  - `visibleWhen()`
  - `visibleWhenNot()`
  - `visibleWhenTruthy()`
  - `visibleWhenFalsy()`
  - `visibleWhenAny()`
  - `requiredWhen()`
  - `requiredWhenAny()`
  - `disabledWhen()`
  - `visibleAndRequiredWhen()`

### Limites actuelles

- Pas de vrai niveau "schema validation engine" natif.
- Pas de `schema.refine()` ou `schema.superRefine()`.
- Pas de modèle d'erreur riche avec `code`, `path`, `params`, `severity`.
- Pas de structures imbriquées natives type `object`, `array`, `tuple`, `union`.
- Pas de moteur public de composition de règles (`and`, `or`, `not`, `pipe`, `bail`).
- Pas d'i18n native des messages.
- Pas de distinction native entre erreur bloquante et warning.
- Pas de vraie couche async/serveur standardisée pour les validateurs.

## Ce qu'il faut ajouter

## 1. Fondations du moteur de validation

### API schema-level indispensable

- [x] `schema.refine(fn, message?)`
- [x] `schema.refineAsync(fn, message?)`
- [x] `schema.superRefine((values, ctx) => void)`
- [x] `schema.validate(values)`
- [x] `schema.validateAsync(values)`
- [x] `schema.safeParse(values)`
- [x] `schema.safeParseAsync(values)`
- [ ] `schema.partial()`
- [ ] `schema.pick(keys)`
- [ ] `schema.omit(keys)`
- [ ] `schema.extend(shape)`
- [ ] `schema.merge(otherSchema)`

### Modèle d'issue / erreur

- [x] `ValidationIssue`
  - `path`
  - `code`
  - `message`
  - `params`
  - `severity`
- [x] `ValidationResult`
  - `success`
  - `data`
  - `issues`
  - `errorsByField`
  - `formErrors`
- [x] `ctx.addIssue(issue)`
- [ ] `ctx.addWarning(issue)`
- [ ] `ctx.abort()`

### Composition de règles

- [ ] `validator.custom(fn)`
- [ ] `validator.async(fn)`
- [ ] `validator.and(...rules)`
- [ ] `validator.or(...rules)`
- [ ] `validator.not(rule)`
- [ ] `validator.pipe(...rules)`
- [ ] `validator.when(predicate, rule)`
- [ ] `validator.bail()`
- [ ] `validator.optional(rule)`
- [ ] `validator.nullable(rule)`
- [ ] `validator.nullish(rule)`

### Références inter-champs

- [ ] `ref('fieldName')`
- [ ] `ref('nested.path')`
- [ ] `sameAs(ref)`
- [ ] `differentFrom(ref)`
- [ ] `greaterThan(ref)`
- [ ] `lowerThan(ref)`

## 2. Validateurs string à ajouter

### Longueur et contenu

- [ ] `nonEmpty(message?)`
- [ ] `length(exact, message?)`
- [ ] `between(min, max, message?)`
- [ ] `startsWith(prefix, message?)`
- [ ] `endsWith(suffix, message?)`
- [ ] `includes(text, message?)`
- [ ] `notIncludes(text, message?)`
- [ ] `oneOf(values, message?)`
- [ ] `notOneOf(values, message?)`
- [ ] `noWhitespace(message?)`
- [ ] `trimStart()`
- [ ] `trimEnd()`
- [ ] `normalizeWhitespace()`
- [ ] `wordCountMin(count, message?)`
- [ ] `wordCountMax(count, message?)`
- [ ] `lineCountMax(count, message?)`

### Formats génériques

- [ ] `alpha(message?)`
- [ ] `numeric(message?)`
- [ ] `alphanumeric(message?)`
- [ ] `ascii(message?)`
- [ ] `unicode(message?)`
- [ ] `slug(message?)`
- [ ] `uuid(message?)`
- [ ] `cuid(message?)`
- [ ] `ulid(message?)`
- [ ] `hex(message?)`
- [ ] `hexColor(message?)`
- [ ] `base64(message?)`
- [ ] `jsonString(message?)`

### Formats réseau / web

- [ ] `hostname(message?)`
- [ ] `domain(message?)`
- [ ] `fqdn(message?)`
- [ ] `ip(message?)`
- [ ] `ipv4(message?)`
- [ ] `ipv6(message?)`
- [ ] `macAddress(message?)`
- [ ] `url({ protocols?, requireTld?, message? })`
- [ ] `email({ allowPlus?, allowUnicode?, message? })`
- [ ] `emailDomain(allowedOrBlockedDomains, options?)`

### Formats métier fréquents

- [ ] `creditCard(message?)`
- [ ] `iban(message?)`
- [ ] `bic(message?)`
- [ ] `postalCode(country?, message?)`
- [ ] `vatNumber(country?, message?)`
- [ ] `siret(message?)`
- [ ] `siren(message?)`
- [ ] `phone(countryOrOptions?, message?)`
- [ ] `semver(message?)`

### Contraintes de casse

- [ ] `mustBeLowercase(message?)`
- [ ] `mustBeUppercase(message?)`
- [ ] `capitalize()`
- [ ] `titleCase()`

## 3. Validateurs number à ajouter

- [ ] `gt(value, message?)`
- [ ] `gte(value, message?)`
- [ ] `lt(value, message?)`
- [ ] `lte(value, message?)`
- [ ] `between(min, max, message?)`
- [ ] `negative(message?)`
- [ ] `nonPositive(message?)`
- [ ] `finite(message?)`
- [ ] `safe(message?)`
- [ ] `multipleOf(value, message?)`
- [ ] `precision(digits, message?)`
- [ ] `scale(digits, message?)`
- [ ] `coerce()`
- [ ] `port(message?)`
- [ ] `currency(options?)`

## 4. Validateurs date / time à ajouter

- [ ] `before(date, message?)`
- [ ] `beforeOrEqual(date, message?)`
- [ ] `after(date, message?)`
- [ ] `afterOrEqual(date, message?)`
- [ ] `between(start, end, message?)`
- [ ] `past(message?)`
- [ ] `future(message?)`
- [ ] `todayOrBefore(message?)`
- [ ] `todayOrAfter(message?)`
- [ ] `weekdayOnly(message?)`
- [ ] `businessDay(message?)`
- [ ] `minAge(age, message?)`
- [ ] `maxAge(age, message?)`

## 5. Validateurs boolean à ajouter

- [ ] `mustBeFalse(message?)`
- [ ] `isTrue(message?)`
- [ ] `isFalse(message?)`

## 6. Validateurs select / radio / multi-select

- [ ] `oneOf(options, message?)`
- [ ] `notOneOf(options, message?)`
- [ ] `allowEmpty()`
- [ ] `disallowPlaceholder(message?)`
- [ ] `field.multiSelect()`
- [ ] `minSelected(count, message?)`
- [ ] `maxSelected(count, message?)`
- [ ] `exactSelected(count, message?)`

## 7. Validateurs file à ajouter

### Quantité et taille

- [ ] `minFiles(count, message?)`
- [ ] `maxFiles(count, message?)`
- [ ] `exactFiles(count, message?)`
- [ ] `totalSizeMax(bytes, message?)`
- [ ] `totalSizeMin(bytes, message?)`

### Type et extension

- [ ] `mimeTypes(types, message?)`
- [ ] `extensions(exts, message?)`
- [ ] `fileNamePattern(regex, message?)`

### Image / media

- [ ] `imageMinWidth(px, message?)`
- [ ] `imageMaxWidth(px, message?)`
- [ ] `imageMinHeight(px, message?)`
- [ ] `imageMaxHeight(px, message?)`
- [ ] `imageDimensions({ minWidth?, maxWidth?, minHeight?, maxHeight? }, message?)`
- [ ] `aspectRatio(ratio, tolerance?, message?)`
- [ ] `durationMin(seconds, message?)`
- [ ] `durationMax(seconds, message?)`

### Intégrité / business

- [ ] `uniqueFiles(by?, message?)`
- [ ] `forbidEmptyFiles(message?)`
- [ ] `customFile(fn)`
- [ ] `customFileAsync(fn)`

## 8. Validateurs phone, password et OTP avancés

### Phone

- [ ] `allowedCountries(codes, message?)`
- [ ] `blockedCountries(codes, message?)`
- [ ] `mobileOnly(message?)`
- [ ] `landlineOnly(message?)`
- [ ] `e164(message?)`
- [ ] `national(message?)`

### Password

- [ ] `minLowercase(count, message?)`
- [ ] `minUppercase(count, message?)`
- [ ] `minDigits(count, message?)`
- [ ] `minSymbols(count, message?)`
- [ ] `noSpaces(message?)`
- [ ] `entropy(minScore, message?)`
- [ ] `forbidSequentialChars(message?)`
- [ ] `forbidRepeatedChars(message?)`
- [ ] `forbidPersonalInfo(fields, message?)`
- [ ] `notCompromised(asyncOptions?)`

### OTP

- [ ] `lettersOnly(message?)`
- [ ] `alphanumeric(message?)`
- [ ] `exactLength(length, message?)`

## 9. Règles croisées entre champs

Pour rivaliser avec Zod/Yup, il faut sortir du simple champ isolé.

- [ ] `schema.atLeastOne(['email', 'phone'], message?)`
- [ ] `schema.atMostOne(['personalEmail', 'workEmail'], message?)`
- [ ] `schema.exactlyOne([...fields], message?)`
- [ ] `schema.allOrNone([...fields], message?)`
- [ ] `schema.requireTogether([...fields], message?)`
- [ ] `schema.forbidTogether([...fields], message?)`
- [ ] `schema.dateRange({ start, end }, message?)`
- [ ] `schema.sumMax(fields, max, message?)`
- [ ] `schema.sumMin(fields, min, message?)`
- [ ] `schema.compare(left, operator, right, message?)`

## 10. Types structurels indispensables

C'est probablement le plus gros manque si l'objectif est de ne plus dépendre d'un validateur externe.

- [ ] `field.object(shape)`
- [ ] `field.array(itemSchema)`
- [ ] `field.tuple([...items])`
- [ ] `field.literal(value)`
- [ ] `field.enum(values)`
- [ ] `field.union([...schemas])`
- [ ] `field.discriminatedUnion(discriminator, mapping)`
- [ ] `field.record(valueSchema)`
- [ ] `field.map(keySchema, valueSchema)`

### Capacités attendues sur ces types

- [ ] validation imbriquée par `path`
- [ ] erreurs imbriquées par `path`
- [ ] partial validation d'une branche seulement
- [ ] valeurs par défaut imbriquées
- [ ] transforms imbriquées
- [ ] compatibilité complète avec le runtime React / React Native

## 11. Async validation et validation serveur

### API publique

- [ ] `validateAsync(fn)`
- [ ] `refineAsync(fn)`
- [ ] `remote({ key, fetch, debounce, ttl, dependsOn })`
- [ ] `unique(fetcher, options?)`
- [ ] `availability(fetcher, options?)`

### Comportements nécessaires

- [ ] annulation via `AbortSignal`
- [ ] dédoublonnage des requêtes identiques
- [ ] protection contre les réponses obsolètes
- [ ] cache TTL
- [ ] debounce configurable
- [ ] revalidation partielle basée sur dépendances
- [ ] mode `validateFirst` vs `collectAll`

## 12. I18n, messages et ergonomie produit

- [ ] `setLocale(localeMap)`
- [ ] `errorMap(issue => message)`
- [ ] `message(code, params)`
- [ ] messages par défaut centralisés
- [ ] codes d'erreur stables
- [ ] interpolation de paramètres
- [ ] locale globale
- [ ] locale par formulaire
- [ ] locale par champ

### Warnings et qualité UX

- [ ] `warn(fn)` ou `warning(fn)`
- [ ] distinction `error` vs `warning`
- [ ] support des suggestions non bloquantes
- [ ] support des messages d'aide dynamiques

## 13. DSL conditionnelle à exposer publiquement

Le moteur interne supporte déjà plus de types de conditions que l'API builder ne l'expose.

- [ ] `visibleWhenIn(field, values)`
- [ ] `visibleWhenNotIn(field, values)`
- [ ] `visibleWhenGt(field, value)`
- [ ] `visibleWhenGte(field, value)`
- [ ] `visibleWhenLt(field, value)`
- [ ] `visibleWhenLte(field, value)`
- [ ] `requiredWhenIn(field, values)`
- [ ] `disabledWhenIn(field, values)`
- [ ] `when(condition, cb)`

## 14. Outils de composition et réutilisation

- [ ] `validator.pack(name, rules)`
- [ ] `schema.use(rulePack)`
- [ ] `field.use(rulePack)`
- [ ] presets métier réutilisables
- [ ] `createValidator(name, fn)`
- [ ] `createTransform(name, fn)`
- [ ] `createRulePack(name, factory)`

## 15. Outils développeur

- [ ] `describe()` pour introspecter un schéma
- [ ] `toJSON()` pour exporter les règles
- [ ] `toJSONSchema()` si possible
- [ ] `debugValidation()` pour tracer les règles exécutées
- [ ] messages d'erreur dev clairs quand une règle est mal configurée
- [ ] tests de snapshot du graphe de validation

## Priorité recommandée

## Phase 1 - indispensable pour devenir autonome sur 80% des formulaires

- [ ] `schema.refine()`
- [ ] `schema.superRefine()`
- [ ] vrai modèle `ValidationIssue`
- [ ] `safeParse()` / `safeParseAsync()`
- [ ] `nonEmpty()`
- [ ] `length()`
- [ ] `oneOf()` / `notOneOf()`
- [ ] `gt()` / `gte()` / `lt()` / `lte()`
- [ ] `between()` pour string, number, date
- [ ] `multipleOf()`
- [ ] `before()` / `after()` / `past()` / `future()`
- [ ] async validation standardisée
- [ ] i18n basique via `errorMap`

## Phase 2 - indispensable pour remplacer Yup/Zod dans les cas avancés

- [ ] `field.object()`
- [ ] `field.array()`
- [ ] nested paths
- [ ] `atLeastOne()` / `exactlyOne()` / `allOrNone()`
- [ ] `multiSelect()`
- [ ] validateurs file avancés
- [ ] validateurs password avancés
- [ ] validateurs phone avancés
- [ ] warnings non bloquants

## Phase 3 - niveau plateforme mature

- [ ] unions et discriminated unions
- [ ] rule packs réutilisables
- [ ] export / introspection de schéma
- [ ] optimisations fines de compilation et de partial revalidation
- [ ] DSL conditionnelle complète

## Recommandation produit

Si l'objectif long terme est vraiment "plus besoin de Yup/Zod", il faut traiter le sujet comme un produit à part entière et non comme une accumulation de petites méthodes fluentes.

L'ordre le plus rentable est :

1. construire un vrai noyau `issue/result/refine/safeParse`
2. compléter les validateurs simples manquants
3. ajouter le schema-level et le cross-field riche
4. ajouter les types structurels `object/array/union`
5. standardiser l'async, l'i18n et les rule packs

Sans les types structurels et le schema-level, `react-formbridge` restera très fort sur les formulaires simples à intermédiaires, mais ne remplacera pas totalement un validateur externe sur les gros workflows métier.

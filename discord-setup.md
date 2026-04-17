# Discord Server Setup — runilib

Guide complet pour creer et configurer le serveur Discord runilib depuis zero.

---

## 1. Creer le serveur

1. Ouvre Discord (desktop ou web)
2. Clique sur le **+** dans la sidebar gauche
3. Choisis **Create My Own** > **For a club or community**
4. Nom du serveur : **runilib**
5. Upload le logo runilib comme icone du serveur
6. Clique **Create**

### Parametres du serveur (Server Settings)

| Parametre | Ou le trouver | Valeur |
|---|---|---|
| Verification Level | Settings > Moderation | **Medium** (compte email verifie + inscrit depuis 5 min) |
| Default Notification | Settings > Overview | **Only @mentions** |
| System Messages Channel | Settings > Overview | `#welcome` (une fois cree) |
| Community | Settings > Enable Community | **Activer** — ca debloque les forums, le welcome screen, et Server Discovery |
| Rules Channel | Settings > Community | `#welcome` |
| Updates Channel | Settings > Community | `#announcements` |

> Activer **Community** est obligatoire pour avoir les canaux de type **Forum**.

---

## 2. Creer les roles

Aller dans **Server Settings > Roles** et creer chaque role dans cet ordre (le plus haut = le plus prioritaire) :

### @Maintainer

1. Clique **Create Role**
2. Nom : `Maintainer`
3. Couleur : `#3B82F6` (bleu vif)
4. Icone (optionnel) : un shield ou une cle
5. Onglet **Permissions** :
   - **General** : activer `Manage Channels`, `Manage Roles`, `Manage Server`, `View Audit Log`, `Manage Webhooks`
   - **Text** : activer `Manage Messages`, `Manage Threads`, `Mention @everyone`
   - **Voice** : activer `Mute Members`, `Move Members`
6. Onglet **Display** : activer **Display role members separately**
7. **Save**
8. Assigner le role manuellement a toi et aux co-maintainers

### @Contributor

1. Clique **Create Role**
2. Nom : `Contributor`
3. Couleur : `#22C55E` (vert)
4. Onglet **Permissions** : laisser les permissions par defaut (heritees de @everyone)
5. Onglet **Display** : activer **Display role members separately**
6. **Save**
7. Assigner manuellement apres qu'un membre a merge une PR

### @Early Adopter

1. Clique **Create Role**
2. Nom : `Early Adopter`
3. Couleur : `#F59E0B` (dore)
4. Permissions : aucune de speciale (badge cosmetique)
5. **Save**
6. Assigner manuellement aux 100 premiers membres

### @Web

1. Clique **Create Role**
2. Nom : `Web`
3. Couleur : `#06B6D4` (cyan)
4. Permissions : par defaut
5. **Save**
6. Sera assigne automatiquement via auto-role (voir section Bots)

### @Native

1. Clique **Create Role**
2. Nom : `Native`
3. Couleur : `#8B5CF6` (violet)
4. Permissions : par defaut
5. **Save**
6. Sera assigne automatiquement via auto-role (voir section Bots)

### @Community (role par defaut)

Pas besoin de creer un role separe. Utilise le role **@everyone** :

1. Clique sur **@everyone** dans la liste des roles
2. Onglet **Permissions** :
   - **General** : activer `View Channels`, `Create Invite`
   - **Text** : activer `Send Messages`, `Send Messages in Threads`, `Create Public Threads`, `Embed Links`, `Attach Files`, `Add Reactions`, `Use External Emoji`, `Read Message History`
   - **Desactiver** : `Mention @everyone`, `Manage Messages`, `Manage Threads`
3. **Save**

---

## 3. Creer les categories et canaux

Supprimer les canaux par defaut (`#general` et `General` voice) avant de commencer.

### Categorie : INFO

1. Clic droit sur la zone des canaux > **Create Category**
2. Nom : `INFO`
3. Creer les canaux suivants dans cette categorie :

#### #welcome (texte, read-only)

1. Clique le **+** a cote de INFO > **Text Channel**
2. Nom : `welcome`
3. Sujet : `Regles, liens utiles et auto-roles`
4. **Permissions** (icone engrenage du canal) :
   - `@everyone` : **Deny** `Send Messages`, `Add Reactions` = OFF, `Create Public Threads` = OFF
   - `@Maintainer` : **Allow** `Send Messages`
5. Poster le message de bienvenue (voir section 6)

#### #announcements (texte, read-only)

1. **+** > **Announcement Channel** (disponible apres activation Community)
2. Nom : `announcements`
3. Sujet : `Releases, breaking changes, nouvelles features`
4. **Permissions** :
   - `@everyone` : **Deny** `Send Messages`
   - `@Maintainer` : **Allow** `Send Messages`

#### #changelog (texte, read-only)

1. **+** > **Text Channel**
2. Nom : `changelog`
3. Sujet : `Feed automatique des releases GitHub`
4. **Permissions** :
   - `@everyone` : **Deny** `Send Messages`
   - `@Maintainer` : **Allow** `Send Messages`
5. Configurer le webhook GitHub (voir section 5)

#### #roadmap (forum, read-only)

1. **+** > **Forum Channel**
2. Nom : `roadmap`
3. Sujet : `Grandes directions du projet et RFC`
4. Guidelines : `Chaque post = une direction ou RFC. Votez par reaction.`
5. **Permissions** :
   - `@everyone` : **Deny** `Create Posts`
   - `@Maintainer` : **Allow** `Create Posts`
6. Tags suggeres : `RFC`, `Planned`, `In Progress`, `Shipped`, `Declined`

---

### Categorie : COMMUNITY

1. **Create Category** > Nom : `COMMUNITY`

#### #general (texte)

1. **+** > **Text Channel**
2. Nom : `general`
3. Sujet : `Discussion libre autour de runilib`
4. Slowmode : `5 secondes` (Settings > Slowmode — anti-flood leger)

#### #introductions (texte)

1. **+** > **Text Channel**
2. Nom : `introductions`
3. Sujet : `Presentez-vous : stack, projet, cas d'usage`

#### #showcase (forum)

1. **+** > **Forum Channel**
2. Nom : `showcase`
3. Sujet : `Partagez vos forms, UIs et projets qui utilisent runilib`
4. Guidelines : `Incluez un screenshot ou un lien. Decrivez votre stack.`
5. Tags suggeres : `Web`, `Native`, `Expo`, `Next.js`, `Remix`, `Open Source`

#### #ideas-and-feedback (forum)

1. **+** > **Forum Channel**
2. Nom : `ideas-and-feedback`
3. Sujet : `Suggestions de features, retours UX, propositions d'API`
4. Guidelines : `Decrivez le probleme que vous voulez resoudre, pas juste la solution.`
5. Tags suggeres : `Feature Request`, `DX Improvement`, `API Proposal`, `UX Feedback`, `Documentation`

---

### Categorie : REACT-FORMBRIDGE

1. **Create Category** > Nom : `REACT-FORMBRIDGE`

#### #help-web (forum)

1. **+** > **Forum Channel**
2. Nom : `help-web`
3. Sujet : `Questions sur l'usage web — Next.js, Vite, Remix, CRA...`
4. Guidelines :
   ```
   Avant de poster :
   1. Consultez la doc : https://formbridge.runilib.dev
   2. Cherchez si la question a deja ete posee

   Dans votre post, incluez :
   - Version de @runilib/react-formbridge
   - Framework (Next.js, Vite, Remix...)
   - Code minimal reproduisant le probleme
   ```
5. Tags suggeres : `Validation`, `Styling`, `Schema`, `Wizard`, `Persistence`, `TypeScript`, `Resolved`
6. Default sort : **Creation date (newest)**

#### #help-native (forum)

1. **+** > **Forum Channel**
2. Nom : `help-native`
3. Sujet : `Questions React Native — Expo, bare RN, navigation...`
4. Guidelines : meme modele que `#help-web` adapte au native
5. Tags suggeres : `Expo`, `Bare RN`, `Navigation`, `Styling`, `Keyboard`, `Resolved`

#### #validation (texte)

1. **+** > **Text Channel**
2. Nom : `validation`
3. Sujet : `Validation built-in, schema(), resolvers Zod/Yup/Joi/Valibot`

#### #styling (texte)

1. **+** > **Text Channel**
2. Nom : `styling`
3. Sujet : `globalDefaults, styled-components, Tailwind, CSS Modules, host helpers`

#### #advanced (texte)

1. **+** > **Text Channel**
2. Nom : `advanced`
3. Sujet : `Wizards, persistence, dynamic forms, analytics, async options, readonly, fieldController`

#### #bugs (forum)

1. **+** > **Forum Channel**
2. Nom : `bugs`
3. Sujet : `Rapports de bugs avec reproduction`
4. Guidelines :
   ```
   Utilisez ce template :

   **Package** : @runilib/react-formbridge
   **Version** :
   **Plateforme** : web / native (Expo / bare RN)
   **React version** :

   **Description** :

   **Reproduction** :
   (code minimal ou lien StackBlitz / Snack)

   **Comportement attendu** :
   **Comportement observe** :
   ```
5. Tags suggeres : `Confirmed`, `Needs Reproduction`, `Web`, `Native`, `Fixed`, `Won't Fix`

---

### Categorie : DEVELOPMENT

1. **Create Category** > Nom : `DEVELOPMENT`

#### #contributing (texte)

1. **+** > **Text Channel**
2. Nom : `contributing`
3. Sujet : `Guide de contribution, conventions, discussion sur les PRs`

#### #architecture (texte)

1. **+** > **Text Channel**
2. Nom : `architecture`
3. Sujet : `Design du runtime, builder system, type system`
4. **Permissions** :
   - `@everyone` : **Allow** `View Channel` + `Read Message History`, **Deny** `Send Messages`
   - `@Maintainer` : **Allow** `Send Messages`
   - `@Contributor` : **Allow** `Send Messages`

#### #ci-and-releases (texte)

1. **+** > **Text Channel**
2. Nom : `ci-and-releases`
3. Sujet : `Pipelines, builds, deploiements, notifications GitHub Actions`
4. **Permissions** :
   - `@everyone` : **Deny** `Send Messages`
   - `@Maintainer` : **Allow** `Send Messages`
5. Configurer le webhook GitHub Actions (voir section 5)

---

### Categorie : OFF-TOPIC

1. **Create Category** > Nom : `OFF-TOPIC`

#### #random (texte)

1. **+** > **Text Channel**
2. Nom : `random`
3. Sujet : `Tout ce qui ne rentre pas ailleurs`

#### #jobs (texte)

1. **+** > **Text Channel**
2. Nom : `jobs`
3. Sujet : `Offres et demandes liees a React / React Native (modere)`
4. Slowmode : `1 heure`

---

## 4. Configurer les bots

### Carl-bot (auto-roles + moderation)

1. Aller sur https://carl.gg
2. Clique **Login** puis **Add to Discord** > selectionne le serveur runilib
3. Autorise les permissions demandees

#### Configurer les auto-roles par reaction

1. Dans le dashboard Carl-bot (https://carl.gg/dashboard), selectionne ton serveur
2. Va dans **Reaction Roles**
3. Clique **Create new reaction role**
4. **Mode** : `Post embed`
5. **Channel** : `#welcome`
6. Configure les reactions :
   - Emoji : `globe_with_meridians` (ou custom emoji web) > Role : `@Web`
   - Emoji : `iphone` (ou custom emoji mobile) > Role : `@Native`
7. **Type** : `Normal` (les membres peuvent toggle)
8. Clique **Create**

#### Configurer l'anti-spam

1. Dashboard Carl-bot > **Automod**
2. Activer :
   - **Anti-spam** : 5 messages en 5 secondes > mute 10 min
   - **Anti-invite** : supprimer les invites Discord non autorisees (sauf les liens du serveur runilib)
   - **Anti-mass-mention** : 5+ mentions > supprimer + mute

#### Message de bienvenue automatique

1. Dashboard Carl-bot > **Welcome**
2. **Channel** : `#general`
3. **Message** :
   ```
   Bienvenue {user} sur runilib ! Passe par #welcome pour choisir ton role et decouvrir les liens utiles.
   ```
4. Activer **DM on join** :
   ```
   Hey {user} ! Bienvenue sur le serveur runilib.

   Pour commencer :
   - Choisis ton role dans #welcome (Web / Native)
   - Pose tes questions dans #help-web ou #help-native
   - Consulte la doc : https://formbridge.runilib.dev

   Bonne exploration !
   ```

---

## 5. Configurer les webhooks GitHub

### Webhook pour #changelog (releases)

1. Dans Discord, va dans les **settings** du canal `#changelog`
2. Onglet **Integrations** > **Create Webhook**
3. Nom : `GitHub Releases`
4. Copie l'URL du webhook
5. Dans GitHub, va dans le repo **runilib/react-formbridge**
6. **Settings > Webhooks > Add webhook**
7. **Payload URL** : colle l'URL Discord + `/github` a la fin
   ```
   https://discord.com/api/webhooks/XXXXXX/YYYYYY/github
   ```
8. **Content type** : `application/json`
9. **Events** : selectionne **Let me select individual events** puis coche uniquement **Releases**
10. **Save**

### Webhook pour #ci-and-releases (GitHub Actions)

1. Meme procedure, mais dans le canal `#ci-and-releases`
2. Nom du webhook : `GitHub Actions`
3. Dans GitHub, meme repo > **Settings > Webhooks > Add webhook**
4. Payload URL : URL Discord + `/github`
5. Events : cocher **Workflow runs**
6. **Save**

### Alternative : GitHub Action dediee

Si tu veux un message plus joli qu'un embed brut, utilise une GitHub Action dans ton workflow de release :

```yaml
# .github/workflows/discord-notify.yml
name: Discord Release Notification

on:
  release:
    types: [published]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Notify Discord
        uses: sarisia/actions-status-discord@v1
        with:
          webhook: ${{ secrets.DISCORD_CHANGELOG_WEBHOOK }}
          title: "New release: ${{ github.event.release.tag_name }}"
          description: "${{ github.event.release.body }}"
          color: 0x22C55E
          url: "${{ github.event.release.html_url }}"
```

Ajoute le secret `DISCORD_CHANGELOG_WEBHOOK` dans **GitHub > Settings > Secrets > Actions**.

---

## 6. Message de bienvenue (#welcome)

Poste ce message dans `#welcome` (en tant que Maintainer) :

```
**Bienvenue sur runilib !**

runilib est un ecosysteme de librairies React / React Native.
Le premier package, `@runilib/react-formbridge`, est un form builder
schema-driven qui tourne sur web et native avec le meme code.

**Liens utiles**
- Docs : https://formbridge.runilib.dev
- npm : https://www.npmjs.com/package/@runilib/react-formbridge
- GitHub : https://github.com/runilib/react-formbridge
- Bugs : https://github.com/runilib/runilib/issues

**Choisis ton role** — reagis ci-dessous :
:globe_with_meridians:  →  @Web (React web)
:iphone:  →  @Native (React Native)

**Regles**
1. Sois respectueux
2. Pas de spam ni de self-promo non sollicitee
3. Utilise les forums pour les questions techniques (pas #general)
4. Partage un snippet reproductible quand tu demandes de l'aide
5. Pas de DM non sollicite aux maintainers — utilise les canaux publics
```

> Si tu utilises Carl-bot pour les reaction roles, c'est Carl-bot qui postera l'embed avec les reactions. Dans ce cas, poste les regles et liens en message normal au-dessus.

---

## 7. Welcome Screen (Server Discovery)

Apres avoir active Community :

1. **Server Settings > Community > Welcome Screen**
2. Description : `Librairies React / React Native schema-driven. Docs, support et discussions.`
3. Ajoute les canaux recommandes :
   - `#welcome` — `Regles et auto-roles`
   - `#general` — `Discussion libre`
   - `#help-web` — `Support React web`
   - `#help-native` — `Support React Native`
   - `#announcements` — `Releases et news`
4. **Save**

---

## 8. Vanity URL et invite

### Invite permanente

1. Va dans **Server Settings > Invites**
2. Ou clic droit sur `#welcome` > **Create Invite**
3. Configure : **Never expire**, **No max uses**
4. Copie le lien et utilise-le dans la doc, le site, et le README

### Vanity URL (si le serveur est booste niveau 3)

1. **Server Settings > Overview > Vanity URL**
2. Definis `discord.gg/runilib`

> Tant que le serveur n'est pas booste niveau 3, utilise l'invite classique et mets-la a jour dans `apps/react-formbridge-docs/src/data/site.ts` :
> ```ts
> discordUrl: 'https://discord.gg/TON_CODE_INVITE',
> ```

---

## 9. Checklist de lancement

- [ ] Serveur cree avec le logo runilib
- [ ] Community mode active
- [ ] 6 roles crees (Maintainer, Contributor, Early Adopter, Web, Native, @everyone configure)
- [ ] 4 categories creees (INFO, COMMUNITY, REACT-FORMBRIDGE, DEVELOPMENT, OFF-TOPIC)
- [ ] 17 canaux crees avec leurs permissions
- [ ] Carl-bot installe et configure (auto-roles, anti-spam, welcome DM)
- [ ] Message de bienvenue poste dans #welcome
- [ ] Webhook GitHub configure pour #changelog
- [ ] Webhook GitHub Actions configure pour #ci-and-releases
- [ ] Welcome Screen configure
- [ ] Invite permanente creee
- [ ] Lien Discord mis a jour dans site.ts et le README
- [ ] Tester : rejoindre avec un alt, verifier les auto-roles, poster dans un forum

import type { Translations } from '../types';

export const fr: Translations = {
  nav: {
    home: 'Accueil',
    libraries: 'Librairies',
    docs: 'Documentation',
    ecosystem: 'Écosystème',
    github: 'GitHub',
  },
  hero: {
    badge: 'Une collection qui grandit · Open Source · MIT',
    title: 'Une petite bande de librairies React & React Native.',
    titleAccent: 'Un seul code. Web et Native.',
    subtitle:
      'RUNILIB est une collection open source de petites librairies composables pour React et React Native. Des APIs partagées, une vraie DX TypeScript, et zéro travail dupliqué entre web et mobile.',
    cta: 'Démarrer maintenant',
    ctaSecondary: 'Voir les librairies',
    stats: {
      libs: 'Librairies',
      ts: 'TypeScript',
      platforms: 'Plateformes',
      config: 'Configuration',
    },
  },
  install: {
    label: 'Installation rapide',
  },
  features: {
    label: 'Pourquoi RUNILIB',
    title: "Le problème qu'on résout",
    subtitle:
      "Maintenir deux codebases en parallèle - une pour le web, une pour le mobile - c'est fini.",
    items: [
      {
        title: 'Un codebase, deux plateformes',
        desc: 'Construis une fonctionnalité une seule fois en TypeScript et exécute-la à l’identique sur React et React Native - sans forks, sans adapters.',
      },
      {
        title: 'Un modèle mental partagé',
        desc: 'Chaque librairie suit les mêmes conventions d’API. Tu en apprends une, tu les comprends toutes.',
      },
      {
        title: 'TypeScript strict',
        desc: 'Inférence complète, zéro any, aucune surprise au runtime. Ton éditeur sait ce que ton code fait avant toi.',
      },
      {
        title: 'Autosuffisant',
        desc: 'Chaque package embarque tout ce dont il a besoin - pas de peer-deps, pas de conflits de versions, pas d’installs cachés.',
      },
      {
        title: 'Zéro setup',
        desc: 'Pas de provider obligatoire, pas de fichier de config, pas de câblage initial. Import + use.',
      },
      {
        title: 'Composable & tree-shakeable',
        desc: "Prends uniquement ce dont tu as besoin. L'écosystème grandit sans casser ton app.",
      },
    ],
  },
  libs: {
    label: 'Écosystème',
    title: 'Des libs avec une seule philosophie',
    subtitle:
      "Explore l'écosystème open source RUNILIB pour React et React Native. Chaque package inclut installation, référence API et exemples TypeScript concrets pensés pour le web et le mobile.",
    docs: 'Documentation',
    github: 'GitHub ↗',
  },
  code: {
    label: 'Voir le code',
    title: 'Simple. Puissant. Typé.',
    subtitle: "L'API est conçue pour être intuitive dès la première ligne.",
  },
  cta: {
    title: 'Prêt à simplifier ton stack ?',
    desc: "Rejoins les développeurs qui ont arrêté d'écrire le même code deux fois.",
    primary: 'Commencer gratuitement',
    secondary: '⭐ Star on GitHub',
  },
  footer: {
    desc: 'Un écosystème de librairies cross-platform pour React et React Native. Écris une fois, fonctionne partout.',
    copyright: `© ${new Date().getFullYear()} RUNILIB - React Universal Libs. Fait avec ♥ par AKS.`,
    cols: {
      libraries: 'Librairies',
      docs: 'Documentation',
      community: 'Communauté',
      project: 'Projet',
    },
  },
  libraryPage: {
    install: 'Installation',
    version: 'Version',
    features: 'Fonctionnalités',
    quickStart: 'Démarrage rapide',
    apiRef: 'Référence API',
    examples: 'Exemples',
    back: '← Retour aux librairies',
    stable: 'Stable',
    beta: 'Bêta',
    readDocs: 'Lire la doc',
  },
  docs: {
    title: 'Documentation & Guides',
    searchPlaceholder: 'Rechercher...',
  },
  ecosystem: {
    title: 'Un écosystème, une philosophie',
    subtitle:
      "RUNILIB n'est pas une librairie. C'est une façon de développer - sans duplication, sans friction, sans compromis entre web et mobile.",
    principles: {
      label: 'Principes',
      title: 'Ce qui unit toutes les librairies',
    },
    roadmap: {
      label: 'Roadmap 2025–2026',
      title: 'Ce qui arrive ensuite',
    },
  },
  notFound: {
    title: 'Page introuvable',
    sub: "Cette page n'existe pas ou a été déplacée.",
    back: "← Retour à l'accueil",
  },
  contributing: {
    nav: 'Contribuer',
    hero: {
      label: 'Open Source',
      title: 'Contribuer à RUNILIB',
      subtitle:
        'RUNILIB est construit par la communauté, pour la communauté. Que tu corriges une faute, améliores la doc ou livres une nouvelle feature - chaque contribution compte.',
    },
    whyContribute: {
      label: 'Pourquoi contribuer',
      title: 'Ce que tu en retires',
      items: [
        {
          title: 'Impact réel',
          desc: 'Ton code tourne en production dans des apps utilisées par de vrais développeurs chaque jour.',
        },
        {
          title: 'Portfolio open source',
          desc: 'Construis un portfolio visible avec des contributions significatives à un vrai écosystème.',
        },
        {
          title: 'Maîtrise TypeScript',
          desc: "Plonge dans les patterns TS avancés, les génériques et l'architecture cross-platform.",
        },
        {
          title: 'Code reviews',
          desc: "Reçois des retours détaillés et constructifs d'ingénieurs expérimentés.",
        },
        {
          title: 'Communauté',
          desc: 'Rejoins un réseau de développeurs passionnés par la DX cross-platform.',
        },
        {
          title: 'Reconnaissance',
          desc: 'Tous les contributeurs sont crédités dans les releases, le README et le site.',
        },
      ],
    },
    steps: {
      label: 'Comment contribuer',
      title: 'Guide étape par étape',
      items: [
        {
          step: '01',
          title: 'Choisir une issue',
          desc: "Parcours les issues ouvertes sur les repos mirrors (runilib/react-formbridge, runilib/react-walkit). Cherche le tag good first issue pour commencer facilement, ou help wanted pour quelque chose de plus conséquent. Les issues sont automatiquement synchronisées vers le monorepo runilib où se fait le travail. Pour une nouvelle idée, ouvre d'abord une issue pour en discuter avant de coder.",
          note: 'Astuce : commente "Je voudrais travailler sur ça" pour prévenir les mainteneurs.',
        },
        {
          step: '02',
          title: 'Fork & clone',
          desc: 'Fork le monorepo runilib/runilib sur GitHub, puis clone ton fork en local. Les pull requests sont ouvertes sur le monorepo - les repos mirrors sont en lecture seule pour le code. Le projet utilise Yarn 4 workspaces avec Corepack.',
        },
        {
          step: '03',
          title: "Configurer l'environnement",
          desc: 'Installe les dépendances, puis lance le serveur de dev. Chaque package a son propre script dev. La commande turbo dev à la racine démarre tout en parallèle.',
        },
        {
          step: '04',
          title: 'Faire tes modifications',
          desc: "Travaille sur ta feature ou ton correctif. Suis le guide de style ci-dessous. Écris ou mets à jour les tests si nécessaire. Vérifie que rien n'est cassé en lançant la suite de tests.",
          note: 'Garde tes commits petits et ciblés. Un correctif par commit.',
        },
        {
          step: '05',
          title: 'Vérifications qualité',
          desc: 'Avant de pousser, lance typecheck, lint et les tests. Les trois doivent passer. La CI lancera aussi ces vérifications automatiquement sur ta PR.',
        },
        {
          step: '06',
          title: 'Ouvrir une Pull Request',
          desc: "Pousse sur ton fork et ouvre une PR sur la branche main. Utilise le template de PR - indique ce qui a changé, pourquoi, et comment tester. Référence l'issue que tu résous.",
          note: 'Les PRs petites et ciblées sont relues bien plus vite que les grandes.',
        },
        {
          step: '07',
          title: 'Code review',
          desc: 'Un mainteneur relira ta PR et laissera des commentaires. Traite les retours, pousse de nouveaux commits - ne force-push pas pendant la review. La conversation fait partie du processus.',
        },
        {
          step: '08',
          title: 'Merge & célébration 🎉',
          desc: "Une fois approuvée, ta PR est mergée. Tu seras crédité dans le changelog et ton nom GitHub apparaît dans la liste des contributeurs. Bienvenue dans l'équipe !",
        },
      ],
    },
    codeStyle: {
      label: 'Style de code',
      title: "Standards qu'on suit",
      rules: [
        {
          title: 'TypeScript strict mode',
          desc: 'Tout le code doit compiler avec strict: true. Pas de any, pas de @ts-ignore sans commentaire expliquant pourquoi.',
        },
        {
          title: 'Pas de fichiers CSS',
          desc: "Le style passe exclusivement par styled-components. Pas d'objets style inline sauf pour les valeurs vraiment dynamiques (positions, pourcentages issus du state).",
        },
        {
          title: 'Props transientes',
          desc: 'Utilise des props préfixées $ dans styled-components pour éviter leur transmission au DOM - ex: $active, $color, $open.',
        },
        {
          title: 'Exports nommés',
          desc: 'Toujours utiliser des exports nommés. Pas de default export sauf pour les pages et la racine App.',
        },
        {
          title: 'Cross-platform en premier',
          desc: 'Chaque field, composant et hook doit fonctionner sur React ET React Native. Teste les deux. Le code platform-spécifique va dans /web ou /native.',
        },
        {
          title: 'Tests obligatoires',
          desc: 'Les nouvelles features nécessitent des tests. Les correctifs nécessitent un test de régression. Lance yarn test avant de pousser.',
        },
        {
          title: 'Conventional commits',
          desc: 'Suis Conventional Commits : feat:, fix:, docs:, refactor:, test:, chore:. Cela alimente le générateur de changelog.',
        },
        {
          title: "Pas d'effets de bord à l'import",
          desc: "Les entry points de librairie doivent être purs. setLocale() et autres configurateurs sont des appels explicites - jamais automatiques à l'import.",
        },
      ],
    },
    prChecklist: {
      label: 'Avant de soumettre',
      title: 'Checklist de PR',
      items: [
        'Types compilent - yarn typecheck passe sans erreur',
        'Tests passent - yarn test vert sur web et native',
        'Lint passe - yarn lint sans warning',
        'Pas de fichier CSS ajouté - style via styled-components uniquement',
        'Cross-platform - testé ou pris en compte sur React Native',
        "Docs mises à jour - README ou page de doc mis à jour si l'API a changé",
        'Changeset ajouté - yarn changeset pour toute modif visible des packages',
        'Description de PR - remplie : ce qui a changé, pourquoi, comment tester',
        'Issue liée - la description contient "Closes #123"',
        'Responsabilité unique - la PR fait une seule chose',
      ],
    },
    goodFirstIssues: {
      label: 'Bonnes premières issues',
      title: 'Commencer par ici',
      subtitle:
        'Ces issues sont bien délimitées, documentées et idéales pour se familiariser avec le code.',
      items: [
        {
          tag: 'good first issue',
          title: 'Ajouter la locale japonaise à formbridge',
          desc: 'Ajouter le pack de locale ja avec tous les messages de validation traduits.',
          color: 'teal',
        },
        {
          tag: 'good first issue',
          title: "walkit : ajouter l'animation slide-left",
          desc: 'Implémenter une variante slide-depuis-la-gauche pour animationType de WalkitProvider.',
          color: 'amber',
        },
        {
          tag: 'good first issue',
          title: 'tooltip : data-testid sur tous les composants',
          desc: 'Ajouter des props data-testid à Tooltip et TooltipContent pour faciliter les tests.',
          color: 'teal',
        },
        {
          tag: 'help wanted',
          title: 'formbridge : résolveur Valibot',
          desc: 'Implémenter un adaptateur de résolveur pour la librairie de validation Valibot.',
          color: 'blue',
        },
        {
          tag: 'help wanted',
          title: 'walkit : adaptateur Expo Router',
          desc: 'Construire un adaptateur de navigation pour les tours multi-écrans avec Expo Router.',
          color: 'amber',
        },
        {
          tag: 'docs',
          title: 'Ajouter des exemples formbridge dans les docs',
          desc: 'Ajouter 3 exemples de formulaires réels : paiement, édition profil, enquête multi-étapes.',
          color: 'purple',
        },
      ],
    },
    community: {
      label: 'Communauté',
      title: 'Rester connecté',
      subtitle:
        "Pose des questions, partage des idées, rencontre d'autres contributeurs.",
    },
    recognition: {
      label: 'Reconnaissance',
      title: 'Mur des contributeurs',
      subtitle:
        'Chaque contribution mergée mérite une place ici. Code, docs, design, traductions, signalements de bugs - tout compte.',
    },
    cta: {
      title: 'Prêt pour ta première contribution ?',
      desc: 'La meilleure façon de commencer est de choisir une issue et de se lancer. Les mainteneurs sont là pour aider.',
      primary: 'Voir les issues ouvertes',
      secondary: 'Lire le guide complet',
    },
  },
};

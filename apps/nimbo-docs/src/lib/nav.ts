export type NavItem = {
  href: string;
  label: string;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export const nav: NavSection[] = [
  {
    label: 'Getting started',
    items: [
      { href: '/docs/introduction', label: 'Introduction' },
      { href: '/docs/installation', label: 'Installation' },
      { href: '/docs/quickstart', label: 'Quickstart' },
    ],
  },
  {
    label: 'Core API',
    items: [
      { href: '/docs/create-store', label: 'createStore' },
      { href: '/docs/state-and-actions', label: 'State & actions' },
      { href: '/docs/selectors', label: 'Selectors' },
      { href: '/docs/effects', label: 'Effects' },
    ],
  },
  {
    label: 'Advanced',
    items: [
      { href: '/docs/scoped-state', label: 'Scoped state' },
      { href: '/docs/local-stores', label: 'Local stores' },
      { href: '/docs/async-actions', label: 'Async actions' },
      { href: '/docs/compose', label: 'composeStores' },
    ],
  },
];

export const flatNav: NavItem[] = nav.flatMap((section) => section.items);

export function getPager(currentHref: string) {
  const index = flatNav.findIndex((item) => item.href === currentHref);
  return {
    prev: index > 0 ? flatNav[index - 1] : null,
    next: index >= 0 && index < flatNav.length - 1 ? flatNav[index + 1] : null,
  };
}

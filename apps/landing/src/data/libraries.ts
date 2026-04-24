import type { LibraryInfo } from '../types';
import { landingPackageVersions } from './packageVersions';

export const FORM_BRIDGE_DOCS_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://react-formbridge.runilib.dev';

export function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://');
}

export function getNewTabLinkProps(href: string) {
  return isExternalHref(href)
    ? { rel: 'noopener noreferrer' as const, target: '_blank' as const }
    : {};
}

export function getLibraryHref(lib: LibraryInfo) {
  return lib.docsUrl ?? `/libraries/${lib.id}`;
}

export const LIBRARIES: LibraryInfo[] = [
  {
    id: 'walkit',
    name: 'react-walkit',
    tagline: 'Cross-platform product tours, onboarding flows and tooltips',
    desc: 'Build product tours, user onboarding walkthroughs, feature discovery flows and tooltips with the same API on React web and React Native. Includes spotlight overlays, customizable popovers, analytics hooks and programmatic control.',
    color: 'amber',
    icon: '💬',
    version: landingPackageVersions.walkit,
    tags: [
      'Product tours',
      'User onboarding',
      'Tooltips',
      'Feature discovery',
      'Spotlight',
    ],
    highlights: [
      'WalkitProvider + WalkitStep for React web and React Native',
      'SVG / react-native-svg spotlight with padding, radius and overlay overrides',
      'Popover presets for onboarding tours, product walkthroughs and guided steps',
      'Custom popover via renderPopover or themed defaults',
      'Programmatic control with useWalkit (start/stop/next/goTo)',
      'Analytics hooks with useWalkitEvent (enter/exit/complete/abandon)',
      'Backdrop + overlay controls (overlayColor, stopOnOutsideClick)',
      'Auto placement with per-step placement override',
      'Web helpers: asChild wrappers, wrapperElement and onBeforeShow auto-scroll',
      'Bundled Tooltip component for hover, focus, press and feature announcement hints',
    ],
    install: 'npm install @runilib/react-walkit',
    status: 'stable',
    npmUrl: 'https://npmjs.com/package/@runilib/react-walkit',
    githubUrl: 'https://github.com/runilib/react-walkit',
  },
  {
    id: 'formbridge',
    name: 'react-formbridge',
    tagline: 'Schema-driven form builder for React and React Native',
    desc: 'Build schema-driven forms for React and React Native with TypeScript. Define one shared schema, then generate fields, validation, form state, multi-step flows and UI patterns for web and mobile.',
    color: 'blue',
    icon: '📋',
    version: landingPackageVersions.formbridge,
    tags: [
      'Form builder',
      'Schema-driven forms',
      'Validation',
      'React Native forms',
      'TypeScript',
    ],
    highlights: [
      'useFormBridge() returns Form, fields and typed state for web and mobile',
      'Reactive form validation with sync + async validators',
      'Remote select options with useAsyncOptions()',
      'field.phone() with built-in country selector',
      'Masks, OTP, password strength and file upload',
      'Draft persistence with local / session / async storage',
      'Reactive conditional fields and visibility map',
      'useFormBridgeWizard() for multi-step forms and onboarding flows',
      'inferFromObject() and inferFromType() helpers',
      'useFormBridgeReadonly() for readonly and diff views',
    ],
    install: 'npm install @runilib/react-formbridge',
    status: 'stable',
    npmUrl: 'https://npmjs.com/package/@runilib/react-formbridge',
    githubUrl: 'https://github.com/runilib/react-formbridge',
    docsUrl: FORM_BRIDGE_DOCS_URL,
  },
];

export const ROADMAP_LIBS = [
  {
    name: 'storex',
    tagline: 'Unified AsyncStorage / localStorage',
    color: 'purple',
    icon: '🗄️',
  },
  {
    name: 'toastly',
    tagline: 'Cross-platform toast notifications',
    color: 'green',
    icon: '🔔',
  },
  {
    name: 'modalkit',
    tagline: 'Unified modals and bottom sheets',
    color: 'blue',
    icon: '🪟',
  },
  {
    name: 'motionkit',
    tagline: 'Framer Motion + Reanimated unified',
    color: 'amber',
    icon: '✨',
  },
] as const;

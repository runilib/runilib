import type {
  FormBridgeUiOptions,
  OptionsFetcherContext,
  SelectOption,
} from '@runilib/react-formbridge';

import { formExampleStyles as s } from './FormExamples.styles';

export const CUSTOMER_DEPARTMENTS = [
  { label: 'Paris (75)', value: '75' },
  { label: 'Rhone (69)', value: '69' },
  { label: 'Gironde (33)', value: '33' },
  { label: 'Nord (59)', value: '59' },
  { label: 'Loire-Atlantique (44)', value: '44' },
  { label: 'Bouches-du-Rhone (13)', value: '13' },
];

export const DEMO_PLANS = [
  { label: 'Starter', value: 'starter' },
  { label: 'Scale', value: 'scale' },
  { label: 'Enterprise', value: 'enterprise' },
];

export const WORKSPACE_OPTIONS = [
  { label: 'Operations workspace', value: 'ops' },
  { label: 'Revenue cockpit', value: 'revenue' },
  { label: 'Product squad', value: 'product' },
  { label: 'Support command center', value: 'support' },
] satisfies SelectOption[];

export const ACCESS_ROLE_OPTIONS = [
  { label: 'Viewer', value: 'viewer' },
  { label: 'Editor', value: 'editor' },
  { label: 'Admin', value: 'admin' },
] satisfies SelectOption[];

export const ROUTING_MODE_OPTIONS = [
  { label: 'Auto assign', value: 'auto' },
  { label: 'Manual review', value: 'review' },
  { label: 'Priority route', value: 'priority' },
] satisfies SelectOption[];

export const CITY_DIRECTORY_OPTIONS = [
  { label: 'Paris', value: 'paris' },
  { label: 'Lyon', value: 'lyon' },
  { label: 'Bordeaux', value: 'bordeaux' },
  { label: 'Lille', value: 'lille' },
  { label: 'Marseille', value: 'marseille' },
  { label: 'Nantes', value: 'nantes' },
  { label: 'Montpellier', value: 'montpellier' },
  { label: 'Toulouse', value: 'toulouse' },
  { label: 'Nice', value: 'nice' },
  { label: 'Rennes', value: 'rennes' },
] satisfies SelectOption[];

async function waitForAbortableDelay(
  durationMs: number,
  signal?: AbortSignal,
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(resolve, durationMs);

    if (!signal) {
      return;
    }

    const abort = () => {
      clearTimeout(timeoutId);
      reject(new Error('Aborted'));
    };

    if (signal.aborted) {
      abort();
      return;
    }

    signal.addEventListener('abort', abort, { once: true });
  });
}

export async function searchCityDirectory({
  search,
  signal,
}: OptionsFetcherContext): Promise<SelectOption[]> {
  await waitForAbortableDelay(260, signal);

  const query = search.trim().toLowerCase();

  if (!query) {
    return CITY_DIRECTORY_OPTIONS.slice(0, 5);
  }

  return CITY_DIRECTORY_OPTIONS.filter((option) =>
    option.label.toLowerCase().includes(query),
  );
}

export function createNativeFieldProps() {
  return {
    styles: {
      root: s.fieldRoot,
      label: s.fieldLabel,
      input: s.fieldInput,
      error: s.fieldError,
      hint: s.fieldHint,
      checkboxRow: s.checkboxRow,
      checkboxBox: s.checkboxBox,
      checkboxLabel: s.checkboxLabel,
      optionTrigger: s.fieldInput,
      optionRow: s.optionRow,
      optionLabel: s.optionLabel,
      modalBackdrop: s.optionModalBackdrop,
      modalCard: s.optionModalCard,
    },
  };
}

export function createNativeFormUi(): FormBridgeUiOptions {
  return {
    field: {
      styles: {
        root: s.fieldRoot,
        label: s.fieldLabel,
        input: s.fieldInput,
        error: s.fieldError,
        hint: s.fieldHint,
        checkboxRow: s.checkboxRow,
        checkboxBox: s.checkboxBox,
        checkboxLabel: s.checkboxLabel,
        optionTrigger: s.fieldInput,
        optionRow: s.optionRow,
        optionLabel: s.optionLabel,
        modalBackdrop: s.optionModalBackdrop,
        modalCard: s.optionModalCard,
      },
    },
    submit: {
      containerStyle: s.submitButton,
    },
  };
}
export function formatDemoJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export async function simulateSubmitDelay(durationMs = 400): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, durationMs));
}

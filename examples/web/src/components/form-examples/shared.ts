import type {
  FormBridgeUiOptions,
  OptionsFetcherContext,
  SelectOption,
  WebFieldUiOverrides,
} from '@runilib/react-formbridge';

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
      reject(new DOMException('Aborted', 'AbortError'));
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

function createBaseDemoFieldUi(styles: Record<string, string>): WebFieldUiOverrides {
  return {
    classNames: {
      root: styles.formField,
      label: styles.formLabel,
      input: styles.formInput,
    },
    styles: {
      root: {
        gap: 8,
        marginBottom: 0,
      },
      label: {
        color: '#e7dbc5',
        fontSize: 11.5,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
      input: {
        background: 'rgba(12, 10, 7, 0.78)',
        border: '1.5px solid rgba(255, 240, 200, 0.08)',
        borderRadius: 16,
        color: '#f5efe0',
        padding: '14px 16px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
      },
    },
  };
}

export function createDemoFieldUi(styles: Record<string, string>): {
  baseFieldUi: WebFieldUiOverrides;
  compactFieldUi: WebFieldUiOverrides;
} {
  const baseFieldUi = createBaseDemoFieldUi(styles);

  return {
    baseFieldUi,
    compactFieldUi: {
      ...baseFieldUi,
      styles: {
        ...baseFieldUi.styles,
        input: {
          ...baseFieldUi.styles?.input,
          letterSpacing: '0.08em',
        },
      },
    },
  } as const;
}

export function createDemoFormUi(styles: Record<string, string>): FormBridgeUiOptions {
  const baseFieldUi = createBaseDemoFieldUi(styles);

  return {
    field: {
      ui: {
        classNames: {
          ...baseFieldUi.classNames,
          select: styles.formInput,
          textarea: styles.formInput,
          error: styles.errorBox,
          hint: styles.helperText,
        },
        styles: {
          ...baseFieldUi.styles,
          input: {
            ...baseFieldUi.styles?.input,
            borderRadius: 8,
          },
          select: {
            background: 'rgba(12, 10, 7, 0.78)',
            border: '1.5px solid rgba(255, 240, 200, 0.08)',
            borderRadius: 16,
            color: '#f5efe0',
            padding: '14px 16px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
          },
          textarea: {
            background: 'rgba(12, 10, 7, 0.78)',
            border: '1.5px solid rgba(255, 240, 200, 0.08)',
            borderRadius: 16,
            color: '#f5efe0',
            padding: '14px 16px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
          },
          error: {
            marginTop: 6,
          },
          hint: {
            marginTop: 4,
          },
        },
      },
    },
  } as const;
}

export function formatDemoJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export async function simulateSubmitDelay(durationMs = 400): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, durationMs));
}

'use client';

import { useEffect, useMemo, useState } from 'react';

import type { SandpackTheme } from '@codesandbox/sandpack-react';
import { Sandpack } from '@codesandbox/sandpack-react';
import styled from 'styled-components';
import { useThemeMode } from './ThemeProviders';

/* ------------------------------------------------------------------ */
/*  Custom Sandpack themes matching the site design system            */
/* ------------------------------------------------------------------ */

const MONO_STACK = `'DM Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace`;
const BODY_STACK = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
const FORMBRIDGE_PACKAGE_NAME = '@runilib/react-formbridge';
const FORMBRIDGE_PUBLISHED_VERSION = 'latest';
const LOCAL_FORMBRIDGE_ENDPOINT = '/api/sandpack/react-formbridge';

const darkSandpackTheme: SandpackTheme = {
  colors: {
    surface1: '#0f1723',
    surface2: '#142133',
    surface3: '#1a2a3e',
    clickable: '#bfd0e3',
    base: '#eff7ff',
    disabled: '#526275',
    hover: '#7ecff4',
    accent: '#7ecff4',
    error: '#ff5370',
    errorSurface: '#2d1418',
  },
  syntax: {
    plain: '#a6accd',
    comment: { color: '#546e7a', fontStyle: 'italic' },
    keyword: '#c792ea',
    tag: '#f07178',
    punctuation: '#89ddff',
    definition: '#82aaff',
    property: '#82aaff',
    static: '#f78c6c',
    string: '#c3e88d',
  },
  font: {
    body: BODY_STACK,
    mono: MONO_STACK,
    size: '13px',
    lineHeight: '1.6',
  },
};

const lightSandpackTheme: SandpackTheme = {
  colors: {
    surface1: '#ffffff',
    surface2: '#f6f9fc',
    surface3: '#eef4fb',
    clickable: '#526275',
    base: '#0b1624',
    disabled: '#7e8da0',
    hover: '#0f6fdc',
    accent: '#0f6fdc',
    error: '#e53935',
    errorSurface: '#fce4ec',
  },
  syntax: {
    plain: '#393a34',
    comment: { color: '#999988', fontStyle: 'italic' },
    keyword: '#7c4dff',
    tag: '#e53935',
    punctuation: '#999999',
    definition: '#0550ae',
    property: '#0550ae',
    static: '#c94922',
    string: '#22863a',
  },
  font: {
    body: BODY_STACK,
    mono: MONO_STACK,
    size: '13px',
    lineHeight: '1.6',
  },
};

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type PlaygroundFile = {
  readonly code: string;
  readonly hidden?: boolean;
  readonly active?: boolean;
  readonly readOnly?: boolean;
};

type PlaygroundProps = {
  /** Single-file shorthand - rendered as /App.tsx (web) or App.js (native) */
  readonly code?: string;

  /** Multi-file map - keys are file paths like '/App.tsx' */
  readonly files?: Record<string, string | PlaygroundFile>;

  /** NPM dependencies added to the sandbox */
  readonly dependencies?: Record<string, string>;

  /** Sandpack starter template - only used for web (default: 'react-ts') */
  readonly template?: 'react-ts' | 'react' | 'vanilla-ts' | 'vanilla';

  /** Editor / iframe height in pixels (default: 550) */
  readonly height?: number;

  /** Show the browser preview pane (default: true) - web only */
  readonly showPreview?: boolean;

  /** Show URL navigator bar in preview (default: false) - web only */
  readonly showNavigator?: boolean;

  /** Show file tabs (default: true) */
  readonly showTabs?: boolean;

  /** Show line numbers (default: true) */
  readonly showLineNumbers?: boolean;

  /** Show the console panel (default: false) - web only */
  readonly showConsole?: boolean;

  /** Make all files read-only (default: false) */
  readonly readOnly?: boolean;

  /** Which file to open by default (e.g. '/App.tsx') */
  readonly activeFile?: string;

  /** Override the theme - by default follows the site's dark/light mode */
  readonly theme?: 'dark' | 'light';

  /** Target platform (default: 'web') */
  readonly platform?: 'web' | 'native';

  /** Device preview for native - which simulator to show (default: 'ios') */
  readonly nativePreview?: 'ios' | 'android' | 'web';

  /** Snack name shown in the Expo Snack header (default: 'Example') */
  readonly snackName?: string;

  /** Snack description */
  readonly snackDescription?: string;
};

type LocalFormBridgePackage = {
  readonly packageName: string;
  readonly version: string;
  readonly dependencies: Record<string, string>;
  readonly distFiles: Record<string, string>;
  readonly exports?: Record<string, unknown>;
  readonly main?: string;
  readonly module?: string;
  readonly reactNative?: string;
  readonly typeEntry?: string;
};

/* ------------------------------------------------------------------ */
/*  Expo Snack embed (React Native)                                   */
/* ------------------------------------------------------------------ */

const SNACK_EMBED_BASE = 'https://snack.expo.dev/embedded';

function buildSnackUrl(params: {
  code?: string;
  files?: Record<string, string | PlaygroundFile>;
  dependencies?: Record<string, string>;
  theme: 'dark' | 'light';
  nativePreview: 'ios' | 'android' | 'web';
  name: string;
  description?: string;
}): string {
  const url = new URL(SNACK_EMBED_BASE);

  url.searchParams.set('platform', params.nativePreview);
  url.searchParams.set('theme', params.theme);
  url.searchParams.set('name', params.name);
  url.searchParams.set('preview', 'true');

  if (params.description) {
    url.searchParams.set('description', params.description);
  }

  if (params.files) {
    const snackFiles: Record<string, { type: string; contents: string }> = {};

    for (const [path, file] of Object.entries(params.files)) {
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      const contents = typeof file === 'string' ? file : file.code;
      snackFiles[cleanPath] = { type: 'CODE', contents };
    }

    url.searchParams.set('files', JSON.stringify(snackFiles));
  } else if (params.code) {
    url.searchParams.set('code', params.code);
  }

  if (params.dependencies && Object.keys(params.dependencies).length > 0) {
    url.searchParams.set('dependencies', JSON.stringify(params.dependencies));
  }

  return url.toString();
}

function SnackEmbed({
  code,
  files,
  dependencies,
  height,
  theme,
  nativePreview,
  name,
  description,
}: {
  readonly code?: string;
  readonly files?: Record<string, string | PlaygroundFile>;
  readonly dependencies?: Record<string, string>;
  readonly height: number;
  readonly theme: 'dark' | 'light';
  readonly nativePreview: 'ios' | 'android' | 'web';
  readonly name: string;
  readonly description?: string;
}) {
  const src = useMemo(
    () =>
      buildSnackUrl({
        code,
        files,
        dependencies,
        theme,
        nativePreview,
        name,
        description,
      }),
    [code, files, dependencies, theme, nativePreview, name, description],
  );

  return (
    <SnackFrame
      src={src}
      title={name}
      $height={height}
      $theme={theme}
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    />
  );
}

function getPlaygroundFileCode(file: string | PlaygroundFile): string {
  return typeof file === 'string' ? file : file.code;
}

function playgroundUsesDependency(params: {
  code?: string;
  files?: Record<string, string | PlaygroundFile>;
  dependencyName: string;
  dependencies?: Record<string, string>;
}): boolean {
  if (params.dependencies?.[params.dependencyName]) {
    return true;
  }

  if (params.code?.includes(params.dependencyName)) {
    return true;
  }

  return Object.values(params.files ?? {}).some((file) =>
    getPlaygroundFileCode(file).includes(params.dependencyName),
  );
}

function buildLocalPackageFiles(
  pkg: LocalFormBridgePackage,
): Record<string, PlaygroundFile> {
  const packageRoot = `/node_modules/${pkg.packageName}`;
  const injectedDistFiles = Object.fromEntries(
    Object.entries(pkg.distFiles).map(([relativePath, code]) => [
      `${packageRoot}/${relativePath}`,
      {
        code,
        hidden: true,
        readOnly: true,
      } satisfies PlaygroundFile,
    ]),
  );

  return {
    ...injectedDistFiles,
    [`${packageRoot}/package.json`]: {
      code: JSON.stringify(
        {
          name: pkg.packageName,
          version: pkg.version,
          main: pkg.main ?? './dist/index.mjs',
          module: pkg.module ?? pkg.main ?? './dist/index.mjs',
          types: pkg.typeEntry ?? './dist/index.d.mts',
          'react-native': pkg.reactNative ?? './dist/index.native.mjs',
          exports: pkg.exports ?? {
            '.': {
              import: './dist/index.mjs',
              default: './dist/index.mjs',
              types: './dist/index.d.mts',
            },
            './schema': {
              import: './dist/schema.mjs',
              default: './dist/schema.mjs',
              types: './dist/schema.d.mts',
            },
          },
        },
        null,
        2,
      ),
      hidden: true,
      readOnly: true,
    },
    // Keep root proxies so the package still resolves even if the sandbox falls back
    // to classic main-file resolution instead of package exports.
    [`${packageRoot}/index.d.ts`]: {
      code: `export * from './dist/index.d.mts';\n`,
      hidden: true,
      readOnly: true,
    },
    [`${packageRoot}/index.mjs`]: {
      code: `export * from './dist/index.mjs';\n`,
      hidden: true,
      readOnly: true,
    },
    [`${packageRoot}/schema.d.ts`]: {
      code: `export * from './dist/schema.d.mts';\n`,
      hidden: true,
      readOnly: true,
    },
    [`${packageRoot}/schema.mjs`]: {
      code: `export * from './dist/schema.mjs';\n`,
      hidden: true,
      readOnly: true,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function Playground({
  code,
  files,
  dependencies,
  template = 'react-ts',
  height = 550,
  showPreview = true,
  showNavigator = false,
  showTabs = true,
  showLineNumbers = true,
  showConsole = false,
  readOnly = false,
  activeFile,
  theme: themeOverride,
  platform = 'web',
  nativePreview = 'web',
  snackName = 'Example',
  snackDescription,
}: PlaygroundProps) {
  const { mode } = useThemeMode();
  const resolvedTheme = themeOverride ?? mode;
  const usesFormBridgePackage = useMemo(
    () =>
      playgroundUsesDependency({
        code,
        files,
        dependencyName: FORMBRIDGE_PACKAGE_NAME,
        dependencies,
      }),
    [code, files, dependencies],
  );
  const shouldUseLocalFormBridge =
    process.env.NODE_ENV !== 'production' && platform === 'web' && usesFormBridgePackage;
  const [localFormBridgePackage, setLocalFormBridgePackage] =
    useState<LocalFormBridgePackage | null>(null);
  const [localFormBridgeError, setLocalFormBridgeError] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldUseLocalFormBridge) {
      setLocalFormBridgePackage(null);
      setLocalFormBridgeError(null);
      return;
    }

    const controller = new AbortController();

    async function loadLocalFormBridgePackage() {
      setLocalFormBridgeError(null);

      try {
        const response = await fetch(LOCAL_FORMBRIDGE_ENDPOINT, {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(
            message || 'Failed to load local @runilib/react-formbridge bundle.',
          );
        }

        const payload = (await response.json()) as LocalFormBridgePackage;

        if (!controller.signal.aborted) {
          setLocalFormBridgePackage(payload);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLocalFormBridgePackage(null);
        setLocalFormBridgeError(
          error instanceof Error
            ? error.message
            : 'Unable to load the local package bundle.',
        );
      }
    }

    void loadLocalFormBridgePackage();

    return () => controller.abort();
  }, [shouldUseLocalFormBridge]);

  const resolvedDependencies = useMemo(() => {
    const requestedDependencies = { ...(dependencies ?? {}) };

    if (!usesFormBridgePackage) {
      return requestedDependencies;
    }

    if (shouldUseLocalFormBridge && localFormBridgePackage) {
      delete requestedDependencies[FORMBRIDGE_PACKAGE_NAME];
      return {
        ...localFormBridgePackage.dependencies,
        ...requestedDependencies,
      };
    }

    return {
      ...requestedDependencies,
      [FORMBRIDGE_PACKAGE_NAME]:
        requestedDependencies[FORMBRIDGE_PACKAGE_NAME] ?? FORMBRIDGE_PUBLISHED_VERSION,
    };
  }, [
    dependencies,
    localFormBridgePackage,
    shouldUseLocalFormBridge,
    usesFormBridgePackage,
  ]);

  if (platform === 'native') {
    return (
      <SnackEmbed
        code={code}
        files={files}
        dependencies={resolvedDependencies}
        height={height}
        theme={resolvedTheme}
        nativePreview={nativePreview}
        name={snackName}
        description={snackDescription}
      />
    );
  }

  const resolvedFiles = files ?? {
    '/App.tsx':
      code ?? 'export default function App() {\n  return <div>Hello World</div>;\n}',
  };
  const sandpackFiles =
    shouldUseLocalFormBridge && localFormBridgePackage
      ? { ...resolvedFiles, ...buildLocalPackageFiles(localFormBridgePackage) }
      : resolvedFiles;
  const sandpackCustomSetup =
    Object.keys(resolvedDependencies).length > 0
      ? { dependencies: resolvedDependencies }
      : undefined;

  if (shouldUseLocalFormBridge && localFormBridgeError) {
    return (
      <PlaygroundState
        $height={height}
        $theme={resolvedTheme}
      >
        Impossible de charger le bundle local de <code>{FORMBRIDGE_PACKAGE_NAME}</code>.
        Lance <code>yarn workspace @runilib/react-formbridge dev</code> ou{' '}
        <code>build</code>, puis recharge la page.
      </PlaygroundState>
    );
  }

  if (shouldUseLocalFormBridge && !localFormBridgePackage) {
    return (
      <PlaygroundState
        $height={height}
        $theme={resolvedTheme}
      >
        Chargement du package local <code>{FORMBRIDGE_PACKAGE_NAME}</code> pour
        Sandpack...
      </PlaygroundState>
    );
  }

  return (
    <Sandpack
      template={template}
      theme={resolvedTheme === 'dark' ? darkSandpackTheme : lightSandpackTheme}
      files={sandpackFiles}
      customSetup={sandpackCustomSetup}
      options={{
        showNavigator,
        showTabs,
        showLineNumbers,
        showConsole,
        editorHeight: height,
        readOnly,
        activeFile,
        ...(showPreview ? {} : { layout: 'tests' as const }),
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Styled                                                            */
/* ------------------------------------------------------------------ */

const SnackFrame = styled.iframe<{
  readonly $height: number;
  readonly $theme: 'dark' | 'light';
}>`
  width: 100%;
  height: ${({ $height }) => $height}px;
  border: 1px solid
    ${({ $theme }) =>
      $theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 12px;
  overflow: hidden;
  background: ${({ $theme }) => ($theme === 'dark' ? '#0f1723' : '#f6f9fc')};
`;

const PlaygroundState = styled.div<{
  readonly $height: number;
  readonly $theme: 'dark' | 'light';
}>`
  display: grid;
  place-items: center;
  width: 100%;
  height: ${({ $height }) => $height}px;
  padding: 20px;
  border: 1px solid
    ${({ $theme }) =>
      $theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 12px;
  background: ${({ $theme }) => ($theme === 'dark' ? '#0f1723' : '#f6f9fc')};
  color: ${({ $theme }) => ($theme === 'dark' ? '#eff7ff' : '#0b1624')};
  font-family: ${BODY_STACK};
  font-size: 14px;
  line-height: 1.6;
  text-align: center;

  code {
    font-family: ${MONO_STACK};
    font-size: 0.95em;
  }
`;

'use client';

import type { CodeSnippet, DocPreview } from '@/types';

import Image from 'next/image';
import { CodeBlock } from './CodeBlock';
import { Playground } from './playground';

const FORMBRIDGE_PACKAGE_NAME = '@runilib/react-formbridge';
const IGNORED_DEPENDENCIES = new Set([
  FORMBRIDGE_PACKAGE_NAME,
  'react',
  'react-dom',
  'react-native',
]);
const BARE_IMPORT_RE = /(?:import|export)\s+(?:[^'"]+from\s*)?['"]([^'"]+)['"]/g;
const API_SHIM = `const api = new Proxy({}, {
  get: (_target, methodName) => async (values) => {
    console.log('[doc-playground]', String(methodName), values)
    return { methodName, values }
  },
})`;
const APP_FIELD_SHIM = `function AppField({ form, name }) {
  const controller = form.fieldController(name)

  if (!controller.visible) return null

  if (controller.options?.length) {
    return (
      <label>
        {controller.label}
        <select
          value={String(controller.value ?? '')}
          disabled={controller.disabled}
          onChange={(event) => controller.onChange(event.target.value)}
          onBlur={controller.onBlur}
        >
          {controller.options.map((option) => (
            <option key={String(option.value)} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {controller.error ? <span role="alert">{controller.error}</span> : null}
      </label>
    )
  }

  if (typeof controller.value === 'boolean') {
    return (
      <label>
        <input
          type="checkbox"
          checked={controller.value}
          disabled={controller.disabled}
          onChange={(event) => controller.onChange(event.target.checked)}
          onBlur={controller.onBlur}
        />
        {controller.label}
      </label>
    )
  }

  return (
    <label>
      {controller.label}
      <input
        value={controller.displayValue ?? String(controller.value ?? '')}
        placeholder={controller.placeholder}
        disabled={controller.disabled}
        onChange={(event) => controller.onChange(event.target.value)}
        onBlur={controller.onBlur}
      />
      {controller.error ? <span role="alert">{controller.error}</span> : null}
    </label>
  )
}`;
const APP_FIELD_NATIVE_SHIM = `import {
  Switch as AppSwitch,
  Text as AppText,
  TextInput as AppTextInput,
  View as AppView,
} from 'react-native'

function AppField({ form, name }) {
  const controller = form.fieldController(name)

  if (!controller.visible) return null

  return (
    <AppView>
      <AppText>{controller.label}</AppText>
      {typeof controller.value === 'boolean' ? (
        <AppSwitch
          value={controller.value}
          disabled={controller.disabled}
          onValueChange={controller.onChange}
        />
      ) : (
        <AppTextInput
          value={controller.displayValue ?? String(controller.value ?? '')}
          placeholder={controller.placeholder}
          editable={!controller.disabled}
          onChangeText={controller.onChange}
          onBlur={controller.onBlur}
        />
      )}
      {controller.error ? <AppText>{controller.error}</AppText> : null}
    </AppView>
  )
}`;

type DocSnippetRendererProps = {
  interactive?: boolean;
  snippet: CodeSnippet;
};

const normalizeDependencyName = (specifier: string): string | null => {
  if (
    specifier.startsWith('.') ||
    specifier.startsWith('/') ||
    specifier.startsWith('@/') ||
    specifier.startsWith('node:')
  ) {
    return null;
  }

  if (specifier.startsWith('@')) {
    const [scope, name] = specifier.split('/');
    return scope && name ? `${scope}/${name}` : null;
  }

  const [name] = specifier.split('/');
  return name ?? null;
};

const inferSnippetDependencies = (snippet: CodeSnippet): Record<string, string> => {
  const dependencies: Record<string, string> = {};
  const matches = snippet.code.matchAll(BARE_IMPORT_RE);

  for (const match of matches) {
    const specifier = match[1];

    if (!specifier) {
      continue;
    }

    const packageName = normalizeDependencyName(specifier);

    if (!packageName || IGNORED_DEPENDENCIES.has(packageName)) {
      continue;
    }

    dependencies[packageName] ??= 'latest';
  }

  return dependencies;
};

const inferSnippetPlatform = (snippet: CodeSnippet): 'web' | 'native' => {
  if (
    snippet.filename.includes('.native.') ||
    snippet.code.includes(`from 'react-native'`) ||
    snippet.code.includes(`from "react-native"`)
  ) {
    return 'native';
  }

  return 'web';
};

const extractComponentExportName = (code: string): string | null => {
  const patterns = [
    /export function ([A-Z]\w*)\s*\(/,
    /export const ([A-Z]\w*)\s*=/,
    /function ([A-Z]\w*)\s*\(/,
    /const ([A-Z]\w*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/,
  ];

  for (const pattern of patterns) {
    const match = code.match(pattern);

    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
};

const isRunnableSnippet = (snippet: CodeSnippet): boolean => {
  if (!(snippet.lang === 'tsx' || snippet.lang === 'ts')) {
    return false;
  }

  const hasRenderableComponent =
    snippet.code.includes('export default') ||
    Boolean(extractComponentExportName(snippet.code));

  if (!hasRenderableComponent) {
    return false;
  }

  return snippet.code.includes('return (') || snippet.code.includes('return <');
};

const buildSnippetPlaygroundCode = (snippet: CodeSnippet): string | null => {
  if (!isRunnableSnippet(snippet)) {
    return null;
  }

  const codeParts = [snippet.code.trimEnd()];

  if (snippet.code.includes('<AppField')) {
    codeParts.push(
      inferSnippetPlatform(snippet) === 'native' ? APP_FIELD_NATIVE_SHIM : APP_FIELD_SHIM,
    );
  }

  if (
    snippet.code.includes('api.') &&
    !/\b(?:const|let|var)\s+api\s*=/.test(snippet.code)
  ) {
    codeParts.push(API_SHIM);
  }

  if (!snippet.code.includes('export default')) {
    const exportName = extractComponentExportName(snippet.code);

    if (!exportName) {
      return null;
    }

    codeParts.push(`export default ${exportName}`);
  }

  return codeParts.join('\n\n');
};

const PreviewPanel = ({ preview }: { preview?: DocPreview }) => {
  if (!preview) {
    return null;
  }

  return (
    <figure className="preview-panel">
      <div className="preview-panel__frame">
        {preview.video ? (
          <video
            className="preview-panel__media"
            src={preview.src}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <Image
            className="preview-panel__media"
            src={preview.src}
            alt={preview.alt}
            width={preview.maxWidth ?? 960}
            height={preview.maxHeight ?? 540}
            unoptimized
          />
        )}
      </div>
      {preview.caption ? (
        <figcaption className="preview-panel__caption">{preview.caption}</figcaption>
      ) : null}
    </figure>
  );
};

export const DocSnippetRenderer = ({
  interactive = false,
  snippet,
}: DocSnippetRendererProps) => {
  const shouldRenderInteractive = interactive || Boolean(snippet.interactive);
  const runnableCode = shouldRenderInteractive
    ? buildSnippetPlaygroundCode(snippet)
    : null;

  if (shouldRenderInteractive && runnableCode) {
    return (
      <Playground
        activeFile="/App.tsx"
        dependencies={inferSnippetDependencies(snippet)}
        files={{
          '/App.tsx': {
            active: true,
            code: runnableCode,
          },
        }}
        height={inferSnippetPlatform(snippet) === 'native' ? 680 : 640}
        platform={inferSnippetPlatform(snippet)}
        showTabs={false}
        snackName={snippet.filename}
      />
    );
  }

  return (
    <>
      <CodeBlock
        code={snippet.code}
        lang={snippet.lang}
        filename={snippet.filename}
        maxHeight={snippet.maxHeight}
      />
      <PreviewPanel preview={snippet.preview} />
    </>
  );
};

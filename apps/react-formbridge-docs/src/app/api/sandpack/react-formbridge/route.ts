import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const PACKAGE_ROOT = path.resolve(
  process.cwd(),
  '..',
  '..',
  'packages',
  'react-formbridge',
);
const DIST_ROOT = path.join(PACKAGE_ROOT, 'dist');
const PACKAGE_JSON = path.join(PACKAGE_ROOT, 'package.json');

function isWebBundleFile(name: string): boolean {
  if (name.includes('.native.')) return false;
  if (name.endsWith('.map')) return false;
  return name.endsWith('.mjs') || name.endsWith('.d.mts') || name.endsWith('.d.ts');
}

async function readLocalDistFiles() {
  const entries = await readdir(DIST_ROOT, { withFileTypes: true });
  const distFiles = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && isWebBundleFile(entry.name))
      .map(async (entry) => {
        const relativePath = `dist/${entry.name}`;
        const contents = await readFile(path.join(DIST_ROOT, entry.name), 'utf8');
        return [relativePath, contents] as const;
      }),
  );

  return Object.fromEntries(distFiles);
}

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'The local Sandpack package endpoint is only available in development.' },
      {
        status: 404,
        headers: { 'cache-control': 'no-store' },
      },
    );
  }

  try {
    const [distFiles, rawPackageJson] = await Promise.all([
      readLocalDistFiles(),
      readFile(PACKAGE_JSON, 'utf8'),
    ]);
    const packageJson = JSON.parse(rawPackageJson) as {
      exports?: Record<string, unknown>;
      main?: string;
      module?: string;
      name?: string;
      'react-native'?: string;
      dependencies?: Record<string, string>;
      types?: string;
      version?: string;
    };

    return NextResponse.json(
      {
        dependencies: packageJson.dependencies ?? {},
        distFiles,
        exports: packageJson.exports ?? {},
        main: packageJson.main ?? './dist/index.mjs',
        module: packageJson.module ?? './dist/index.mjs',
        packageName: packageJson.name ?? '@runilib/react-formbridge',
        reactNative: packageJson['react-native'] ?? './dist/index.native.mjs',
        typeEntry: packageJson.types ?? './dist/index.d.mts',
        version: packageJson.version ?? '0.0.0-local',
      },
      {
        headers: { 'cache-control': 'no-store' },
      },
    );
  } catch (error) {
    const details =
      error instanceof Error
        ? error.message
        : 'Missing local dist files for @runilib/react-formbridge.';

    return NextResponse.json(
      {
        error:
          'Unable to load the local @runilib/react-formbridge bundle. Run `yarn workspace @runilib/react-formbridge dev` or `build` first.',
        details,
      },
      {
        status: 500,
        headers: { 'cache-control': 'no-store' },
      },
    );
  }
}

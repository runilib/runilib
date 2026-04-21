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
const DIST_DIR = path.join(PACKAGE_ROOT, 'dist');
const PACKAGE_JSON = path.join(PACKAGE_ROOT, 'package.json');

function isWebBundleFile(name: string): boolean {
  if (name.includes('.native.')) return false;
  if (name.endsWith('.map')) return false;
  return name.endsWith('.mjs') || name.endsWith('.d.mts') || name.endsWith('.d.ts');
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
    const rawPackageJson = await readFile(PACKAGE_JSON, 'utf8');
    const packageJson = JSON.parse(rawPackageJson) as {
      name?: string;
      version?: string;
      dependencies?: Record<string, string>;
    };

    const entries = await readdir(DIST_DIR);
    const bundleEntries = entries.filter(isWebBundleFile);

    const files: Record<string, string> = {};
    await Promise.all(
      bundleEntries.map(async (name) => {
        files[name] = await readFile(path.join(DIST_DIR, name), 'utf8');
      }),
    );

    return NextResponse.json(
      {
        dependencies: packageJson.dependencies ?? {},
        files,
        packageName: packageJson.name ?? '@runilib/react-formbridge',
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

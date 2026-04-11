import { readFile } from 'node:fs/promises';
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
const DIST_ENTRY = path.join(PACKAGE_ROOT, 'dist', 'index.mjs');
const DIST_TYPES = path.join(PACKAGE_ROOT, 'dist', 'index.d.mts');
const PACKAGE_JSON = path.join(PACKAGE_ROOT, 'package.json');

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
    const [bundle, types, rawPackageJson] = await Promise.all([
      readFile(DIST_ENTRY, 'utf8'),
      readFile(DIST_TYPES, 'utf8'),
      readFile(PACKAGE_JSON, 'utf8'),
    ]);

    const packageJson = JSON.parse(rawPackageJson) as {
      name?: string;
      version?: string;
      dependencies?: Record<string, string>;
    };

    return NextResponse.json(
      {
        bundle,
        dependencies: packageJson.dependencies ?? {},
        packageName: packageJson.name ?? '@runilib/react-formbridge',
        types,
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

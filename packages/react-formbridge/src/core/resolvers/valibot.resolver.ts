import type { ResolverResult, SchemaResolver } from '../../types/options';
import type {
  ResolverAdapterOptions,
  ResolverMode,
  ResolverPathSegment,
  ResolverValues,
} from './types';
import { collectErrors, failure, success } from './utils';

export interface ValibotResolverIssue {
  path?: Array<
    | ResolverPathSegment
    | {
        key?: ResolverPathSegment;
      }
  >;
  message?: string;
}

interface ValibotResult {
  success: boolean;
  output?: unknown;
  issues?: ValibotResolverIssue[];
}

interface ValibotModuleLike {
  safeParse?: (schema: unknown, input: unknown, options?: unknown) => ValibotResult;
  safeParseAsync?: (
    schema: unknown,
    input: unknown,
    options?: unknown,
  ) => Promise<ValibotResult>;
}

export interface ValibotResolverOptions
  extends ResolverAdapterOptions<ValibotResolverIssue> {
  mode?: ResolverMode;
  module?: ValibotModuleLike | { default?: ValibotModuleLike };
  parseOptions?: unknown;
}

function unwrapValibotModule(
  candidate: ValibotResolverOptions['module'],
): ValibotModuleLike | null {
  if (!candidate) {
    return null;
  }

  const candidateWithDefault = candidate as { default?: ValibotModuleLike };

  if (candidateWithDefault.default) {
    return candidateWithDefault.default;
  }

  return candidate as ValibotModuleLike;
}

function loadValibotModule(options: ValibotResolverOptions): ValibotModuleLike {
  const providedModule = unwrapValibotModule(options.module);

  if (providedModule) {
    return providedModule;
  }

  if (typeof require === 'function') {
    try {
      return require('valibot') as ValibotModuleLike;
    } catch {
      // Fall through to the explicit error below.
    }
  }

  throw new Error(
    '[@runilib/react-formbridge] valibotResolver requires `valibot`. Install it or pass `{ module: v }` in the resolver options.',
  );
}

function getValibotPath(issue: ValibotResolverIssue): ResolverPathSegment[] {
  return (issue.path ?? []).flatMap((segment) => {
    if (typeof segment === 'string' || typeof segment === 'number') {
      return [segment];
    }

    if (typeof segment === 'object' && segment !== null && 'key' in segment) {
      const key = segment.key;
      return typeof key === 'string' || typeof key === 'number' ? [key] : [];
    }

    return [];
  });
}

async function executeValibotParse(
  schema: unknown,
  values: ResolverValues,
  options: ValibotResolverOptions,
): Promise<ValibotResult> {
  const module = loadValibotModule(options);

  if (
    (options.mode === 'async' || options.mode === 'auto' || options.mode == null) &&
    typeof module.safeParseAsync === 'function'
  ) {
    return module.safeParseAsync(schema, values, options.parseOptions);
  }

  if (typeof module.safeParse === 'function') {
    return module.safeParse(schema, values, options.parseOptions);
  }

  if (typeof module.safeParseAsync === 'function') {
    return module.safeParseAsync(schema, values, options.parseOptions);
  }

  throw new Error(
    '[@runilib/react-formbridge] valibotResolver expected a module exposing safeParse or safeParseAsync.',
  );
}

export function valibotResolver(
  schema: unknown,
  options: ValibotResolverOptions = {},
): SchemaResolver {
  return async (values): Promise<ResolverResult> => {
    const result = await executeValibotParse(schema, values, options);

    if (result.success) {
      return success(result.output, values);
    }

    return failure(
      values,
      collectErrors(
        result.issues ?? [],
        values,
        options,
        getValibotPath,
        (issue) => issue.message,
      ),
    );
  };
}

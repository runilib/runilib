import type { BridgeResult, SchemaValidatorBridge } from '../../types/options';
import type {
  BridgeAdapterOptions,
  BridgeMode,
  BridgePathSegment,
  BridgeValues,
} from './types';
import { collectErrors, failure, success } from './utils';

export interface ValibotBridgeIssue {
  path?: Array<
    | BridgePathSegment
    | {
        key?: BridgePathSegment;
      }
  >;
  message?: string;
}

interface ValibotResult {
  success: boolean;
  output?: unknown;
  issues?: ValibotBridgeIssue[];
}

interface ValibotModuleLike {
  safeParse?: (schema: unknown, input: unknown, options?: unknown) => ValibotResult;
  safeParseAsync?: (
    schema: unknown,
    input: unknown,
    options?: unknown,
  ) => Promise<ValibotResult>;
}

export interface ValibotBridgeOptions extends BridgeAdapterOptions<ValibotBridgeIssue> {
  mode?: BridgeMode;
  module?: ValibotModuleLike | { default?: ValibotModuleLike };
  parseOptions?: unknown;
}

function unwrapValibotModule(
  candidate: ValibotBridgeOptions['module'],
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

function loadValibotModule(options: ValibotBridgeOptions): ValibotModuleLike {
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
    '[@runilib/react-formbridge] valibotBridge requires `valibot`. Install it or pass `{ module: v }` in the bridge options.',
  );
}

function getValibotPath(issue: ValibotBridgeIssue): BridgePathSegment[] {
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
  values: BridgeValues,
  options: ValibotBridgeOptions,
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
    '[@runilib/react-formbridge] valibotBridge expected a module exposing safeParse or safeParseAsync.',
  );
}

export function valibotBridge(
  schema: unknown,
  options: ValibotBridgeOptions = {},
): SchemaValidatorBridge {
  return async (values): Promise<BridgeResult> => {
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

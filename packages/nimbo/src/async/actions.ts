import type {
  NimboActionContext,
  NimboAsyncActionDefinition,
  NimboAsyncActionMap,
  NimboBoundAsyncActions,
  NimboScopeId,
} from '../types';
import type { NimboAsyncStatusRegistry } from './status';

type AsyncActionRuntime = {
  controller: AbortController | null;
  pendingPromise: Promise<unknown> | null;
};

export function bindAsyncActions<
  TState,
  TAsyncActions extends NimboAsyncActionMap<TState>,
>(
  definitions: TAsyncActions | undefined,
  context: NimboActionContext<TState>,
  statuses: NimboAsyncStatusRegistry,
  scopeId: NimboScopeId | null,
): NimboBoundAsyncActions<TAsyncActions> {
  const runtimes = new Map<string, AsyncActionRuntime>();
  const boundActions: Record<string, (...args: unknown[]) => Promise<unknown>> = {};

  for (const [name, definition] of Object.entries(definitions ?? {})) {
    const actionDefinition = definition as NimboAsyncActionDefinition<
      TState,
      unknown[],
      unknown
    >;
    const run =
      typeof actionDefinition === 'function' ? actionDefinition : actionDefinition.run;
    const policy =
      typeof actionDefinition === 'function'
        ? 'parallel'
        : (actionDefinition.policy ?? 'parallel');

    boundActions[name] = async (...args: unknown[]) => {
      const runtime = runtimes.get(name) ?? {
        controller: null,
        pendingPromise: null,
      };

      if (policy === 'takeFirst' && runtime.pendingPromise) {
        return runtime.pendingPromise;
      }

      if (policy === 'takeLatest') {
        runtime.controller?.abort();
      }

      const controller = new AbortController();
      runtime.controller = controller;
      runtimes.set(name, runtime);
      statuses.setPending(name, true);
      statuses.setError(name, null);

      const promise = run(
        {
          ...context,
          signal: controller.signal,
          scope: scopeId,
          action: name,
        },
        ...args,
      )
        .then((result) => {
          statuses.setResult(name, result);
          return result;
        })
        .catch((error) => {
          statuses.setError(name, error);
          throw error;
        })
        .finally(() => {
          if (runtime.controller === controller) {
            runtime.controller = null;
            runtime.pendingPromise = null;
            statuses.setPending(name, false);
          }
        });

      runtime.pendingPromise = promise;

      return promise;
    };
  }

  return boundActions as NimboBoundAsyncActions<TAsyncActions>;
}

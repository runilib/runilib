import type {
  ActionContext,
  AsyncActionDefinition,
  AsyncActionMap,
  BoundAsyncActions,
  ListenerTypeAlias,
} from '../types';
import type { AsyncStatusRegistry } from './status';

/**
 * Per-action runtime bookkeeping shared across consecutive invocations of
 * the same async action.
 *
 * - `controller` is the in-flight `AbortController`, kept so a subsequent
 *   `takeLatest` call can `controller.abort()` it before starting the new
 *   run.
 * - `pendingPromise` is the promise of the currently-running invocation,
 *   reused by the `takeFirst` policy to deduplicate concurrent calls.
 */
type AsyncActionRuntime = {
  controller: AbortController | null;
  pendingPromise: Promise<unknown> | null;
};

/**
 * Wraps every async-action definition into a callable that drives the
 * policy / abort / status pipeline.
 *
 * For each action name in `definitions`, the returned object exposes a
 * function with the same call signature as the original `run`. Calling it:
 *
 * 1. Resolves (or creates) a {@link AsyncActionRuntime} for that name.
 * 2. Applies the {@link import('../types').AsyncPolicy}:
 *    - `takeFirst` returns the in-flight promise without re-running.
 *    - `takeLatest` aborts the previous controller before starting.
 *    - `parallel` (default) runs concurrently with no interaction.
 * 3. Marks the action as pending and clears any previous error in
 *    `statuses`.
 * 4. Invokes `run` with an extended context containing the new
 *    `AbortSignal`, the current scope id (or `null` for the global
 *    instance), and the action name.
 * 5. Mirrors the resolved value or thrown error into `statuses`, then
 *    clears `pending` once this exact controller is no longer the active
 *    one (this guards against `takeLatest` flipping `pending` to false
 *    before the new run finishes).
 *
 * The same async action can be invoked imperatively
 * (`store.asyncActions.foo(...)`) or read via the React hooks
 * (`store.usePending('foo')`, `store.useError('foo')`,
 * `store.useResult('foo')`); both go through this single pipeline.
 */
export function bindAsyncActions<TState, TAsyncActions extends AsyncActionMap<TState>>(
  definitions: TAsyncActions | undefined,
  context: ActionContext<TState>,
  statuses: AsyncStatusRegistry,
  Listener: ListenerTypeAlias | null,
): BoundAsyncActions<TAsyncActions> {
  const runtimes = new Map<string, AsyncActionRuntime>();
  const boundActions: Record<string, (...args: unknown[]) => Promise<unknown>> = {};

  for (const [name, definition] of Object.entries(definitions ?? {})) {
    const actionDefinition = definition as AsyncActionDefinition<
      TState,
      unknown[],
      unknown
    >;
    // Accept both the bare-function and `{ policy, run }` object forms.
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

      // Deduplicate: with `takeFirst`, every concurrent caller awaits the
      // same promise instead of triggering a new run.
      if (policy === 'takeFirst' && runtime.pendingPromise) {
        return runtime.pendingPromise;
      }

      // Cancel the previous in-flight call before starting a new one. The
      // user-defined `run` is responsible for honoring `signal`.
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
          scope: Listener,
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
          // Only the still-active controller flips `pending` back to false.
          // This avoids a stale aborted run from clearing the pending flag
          // of a newer in-flight call (relevant under `takeLatest`).
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

  return boundActions as BoundAsyncActions<TAsyncActions>;
}

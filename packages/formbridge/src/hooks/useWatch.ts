import { useState, useEffect, useRef } from 'react';
import type { FormValues } from '../types';

/**
 * `useWatch` — subscribes to form values outside of the form itself.
 * Useful when you need to watch values in a sibling component.
 *
 * @example
 * // Inside a child component, watch a field from a parent form
 * const email = useWatch({ name: 'email', defaultValue: '', control });
 */
export function useWatch<T extends FormValues, K extends keyof T>({
  name,
  defaultValue,
  control,
}: {
  name:          K;
  defaultValue?: T[K];
  control:       { _getValues: () => T; _subscribe: (cb: () => void) => () => void };
}): T[K] {
  const [value, setValue] = useState<T[K]>(
    () => control._getValues()[name] ?? defaultValue ?? ('' as T[K])
  );

  useEffect(() => {
    const unsub = control._subscribe(() => {
      const next = control._getValues()[name];
      setValue(next);
    });
    return unsub;
  }, [control, name]);

  return value;
}

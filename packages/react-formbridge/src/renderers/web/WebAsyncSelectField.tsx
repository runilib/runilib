import React from 'react';

import { useAsyncOptions } from '../../hooks/shared/useAsyncOptions';
import type { FieldDescriptor, FieldRenderProps } from '../../types';

interface Props extends FieldRenderProps<string> {
  descriptor: FieldDescriptor<string>;
}

export const WebAsyncSelectField: React.FC<Props> = ({ descriptor, ...restProps }) => {
  const asyncConfig = descriptor._asyncOptions;
  const staticOptions = descriptor._options ?? [];

  const depValues = React.useMemo(() => {
    const result: Record<string, unknown> = {};

    for (const key of asyncConfig?.dependsOn ?? []) {
      result[key] = restProps.allValues[key];
    }

    return result;
  }, [asyncConfig?.dependsOn, restProps.allValues]);

  const {
    options: asyncOptions,
    loading,
    error,
    search,
    setSearch,
    refresh,
  } = useAsyncOptions(asyncConfig!, depValues);

  const options = asyncConfig ? asyncOptions : staticOptions;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {descriptor._searchable && asyncConfig ? (
        <input
          type="text"
          value={search}
          placeholder={`Search ${restProps.label}`}
          onChange={(e) => setSearch(e.target.value)}
        />
      ) : null}

      <select
        name={restProps.name}
        value={String(restProps.value ?? '')}
        disabled={restProps.disabled || loading}
        onChange={(e) => restProps.onChange(e.target.value)}
        onBlur={restProps.onBlur}
      >
        <option value="">{restProps.placeholder ?? `Select ${restProps.label}`}</option>

        {options.map((option) => (
          <option
            key={String(option.value)}
            value={String(option.value)}
          >
            {option.label}
          </option>
        ))}
      </select>

      {loading ? <span>Loading...</span> : null}
      {error ? <span role="alert">{error}</span> : null}
      {!loading && !error && descriptor._searchable && asyncConfig ? (
        <button
          type="button"
          onClick={refresh}
        >
          Refresh
        </button>
      ) : null}
    </div>
  );
};

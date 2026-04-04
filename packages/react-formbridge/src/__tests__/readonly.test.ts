import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { field } from '../core/field-builders/field';
import { useReadonlyFormBridge } from '../hooks/shared/useReadonlyForm';

const SCHEMA = {
  name: field.text('Full name'),
  email: field.email('Email'),
  age: field.number('Age'),
  active: field.switch('Active'),
  country: field.select('Country').options([
    { label: 'France', value: 'FR' },
    { label: 'US', value: 'US' },
  ]),
  password: field.password('Password'),
};

const VALUES = {
  name: 'AKS',
  email: 'aks@unikit.dev',
  age: 30,
  active: true,
  country: 'FR',
  password: 'secret123',
};

describe('useReadonlyFormBridgeBridge — readonly mode', () => {
  it('returns all non-hidden fields', () => {
    const { result } = renderHook(() =>
      useReadonlyFormBridge(SCHEMA, { mode: 'readonly', values: VALUES as any }),
    );
    expect(result.current.fieldNames).toContain('name');
    expect(result.current.fieldNames).toContain('email');
  });

  it('formats string values as-is', () => {
    const { result } = renderHook(() =>
      useReadonlyFormBridge(SCHEMA, { mode: 'readonly', values: VALUES as any }),
    );
    expect(result.current.fields.name.display).toBe('AKS');
    expect(result.current.fields.email.display).toBe('aks@unikit.dev');
  });

  it('formats boolean → Yes/No', () => {
    const { result } = renderHook(() =>
      useReadonlyFormBridge(SCHEMA, { mode: 'readonly', values: VALUES as any }),
    );
    expect(result.current.fields.active.display).toBe('✓ Yes');
  });

  it('formats select options by label', () => {
    const { result } = renderHook(() =>
      useReadonlyFormBridge(SCHEMA, { mode: 'readonly', values: VALUES as any }),
    );
    expect(result.current.fields.country.display).toBe('France');
  });

  it('masks password fields', () => {
    const { result } = renderHook(() =>
      useReadonlyFormBridge(SCHEMA, { mode: 'readonly', values: VALUES as any }),
    );
    expect(result.current.fields.password.display).toBe('••••••••');
  });

  it('formats empty/null values as —', () => {
    const { result } = renderHook(() =>
      useReadonlyFormBridge(SCHEMA, {
        mode: 'readonly',
        values: { ...VALUES, name: '' } as any,
      }),
    );
    expect(result.current.fields.name.display).toBe('—');
  });

  it('hasChanges is false in readonly mode', () => {
    const { result } = renderHook(() =>
      useReadonlyFormBridge(SCHEMA, { mode: 'readonly', values: VALUES as any }),
    );
    expect(result.current.hasChanges).toBe(false);
  });
});

describe('useReadonlyFormBridge — diff mode', () => {
  const ORIGINAL = {
    name: 'Old Name',
    email: 'old@email.com',
    age: 25,
    active: false,
    country: 'US',
    password: 'oldpass',
  };

  it('detects changed fields', () => {
    const { result } = renderHook(() =>
      useReadonlyFormBridge(SCHEMA, {
        mode: 'diff',
        values: VALUES as any,
        originalValues: ORIGINAL as any,
      }),
    );
    expect(result.current.changedFields).toContain('name');
    expect(result.current.changedFields).toContain('email');
    expect(result.current.changedFields).toContain('age');
    expect(result.current.changedFields).toContain('active');
    expect(result.current.changedFields).toContain('country');
  });

  it('marks changed as true for changed fields', () => {
    const { result } = renderHook(() =>
      useReadonlyFormBridge(SCHEMA, {
        mode: 'diff',
        values: VALUES as any,
        originalValues: ORIGINAL as any,
      }),
    );
    expect(result.current.fields.name.changed).toBe(true);
    expect(result.current.fields.email.changed).toBe(true);
  });

  it('marks changed as false for unchanged fields', () => {
    const { result } = renderHook(() =>
      useReadonlyFormBridge(SCHEMA, {
        mode: 'diff',
        values: VALUES as any,
        originalValues: { ...ORIGINAL, name: VALUES.name } as any,
      }),
    );
    expect(result.current.fields.name.changed).toBe(false);
  });

  it('provides originalDisplay for changed fields', () => {
    const { result } = renderHook(() =>
      useReadonlyFormBridge(SCHEMA, {
        mode: 'diff',
        values: VALUES as any,
        originalValues: ORIGINAL as any,
      }),
    );
    expect(result.current.fields.name.originalDisplay).toBe('Old Name');
    expect(result.current.fields.country.originalDisplay).toBe('US'); // no option match → raw value
  });

  it('hasChanges is true when fields differ', () => {
    const { result } = renderHook(() =>
      useReadonlyFormBridge(SCHEMA, {
        mode: 'diff',
        values: VALUES as any,
        originalValues: ORIGINAL as any,
      }),
    );
    expect(result.current.hasChanges).toBe(true);
  });

  it('hasChanges is false when nothing changed', () => {
    const { result } = renderHook(() =>
      useReadonlyFormBridge(SCHEMA, {
        mode: 'diff',
        values: VALUES as any,
        originalValues: VALUES as any,
      }),
    );
    expect(result.current.hasChanges).toBe(false);
    expect(result.current.changedFields).toHaveLength(0);
  });

  it('applies custom formatter', () => {
    const { result } = renderHook(() =>
      useReadonlyFormBridge(SCHEMA, {
        mode: 'diff',
        values: VALUES,
        formatters: { age: (v) => `${v} years old` },
      }),
    );
    expect(result.current.fields.age.display).toBe('30 years old');
  });
});

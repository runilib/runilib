import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useField } from '../src/hooks/useField';

describe('useField', () => {
  it('initialises with default value', () => {
    const { result } = renderHook(() => useField({ defaultValue: 'hello' }));
    expect(result.current.value).toBe('hello');
    expect(result.current.error).toBeNull();
    expect(result.current.touched).toBe(false);
    expect(result.current.dirty).toBe(false);
  });

  it('updates value via setValue', async () => {
    const { result } = renderHook(() => useField<string>({ defaultValue: '' }));
    await act(async () => { result.current.setValue('world'); });
    expect(result.current.value).toBe('world');
    expect(result.current.dirty).toBe(true);
  });

  it('marks as not dirty when reverted to default', async () => {
    const { result } = renderHook(() => useField<string>({ defaultValue: 'abc' }));
    await act(async () => { result.current.setValue('xyz'); });
    expect(result.current.dirty).toBe(true);
    await act(async () => { result.current.setValue('abc'); });
    expect(result.current.dirty).toBe(false);
  });

  it('validates on blur', async () => {
    const { result } = renderHook(() =>
      useField<string>({ defaultValue: '', rules: { required: true } })
    );
    await act(async () => { result.current.inputProps.onBlur(); });
    expect(result.current.error).not.toBeNull();
    expect(result.current.touched).toBe(true);
  });

  it('validates via validate() manually', async () => {
    const { result } = renderHook(() =>
      useField<string>({ defaultValue: '', rules: { required: 'Requis.' } })
    );
    let err: string | null = null;
    await act(async () => { err = await result.current.validate(); });
    expect(err).toBe('Requis.');
  });

  it('clears error after setting a valid value + blur', async () => {
    const { result } = renderHook(() =>
      useField<string>({ defaultValue: '', rules: { required: true } })
    );
    // Trigger error
    await act(async () => { result.current.inputProps.onBlur(); });
    expect(result.current.error).not.toBeNull();
    // Fix the value
    await act(async () => { result.current.setValue('valid'); });
    await act(async () => { result.current.inputProps.onBlur(); });
    expect(result.current.error).toBeNull();
  });

  it('resets to default', async () => {
    const { result } = renderHook(() => useField<string>({ defaultValue: 'init' }));
    await act(async () => { result.current.setValue('changed'); });
    act(() => { result.current.reset(); });
    expect(result.current.value).toBe('init');
    expect(result.current.dirty).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calls onChange callback', async () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useField<string>({ defaultValue: '', onChange }));
    await act(async () => { result.current.setValue('test'); });
    expect(onChange).toHaveBeenCalledWith('test');
  });

  it('provides correct textInputProps.value as string', () => {
    const { result } = renderHook(() => useField({ defaultValue: 42 }));
    expect(result.current.textInputProps.value).toBe('42');
  });
});

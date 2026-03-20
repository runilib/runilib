import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useForm } from '../src/hooks/useForm';

type LoginForm = { email: string; password: string };

function makeForm(opts = {}) {
  return renderHook(() =>
    useForm<LoginForm>({
      defaultValues: { email: '', password: '' },
      ...opts,
    })
  );
}

describe('useForm — initial state', () => {
  it('starts with default values', () => {
    const { result } = makeForm();
    expect(result.current.formState.values.email).toBe('');
    expect(result.current.formState.values.password).toBe('');
  });

  it('starts with no errors', () => {
    const { result } = makeForm();
    expect(result.current.formState.errors).toEqual({});
  });

  it('starts isValid = true, isDirty = false', () => {
    const { result } = makeForm();
    expect(result.current.formState.isValid).toBe(true);
    expect(result.current.formState.isDirty).toBe(false);
  });

  it('starts isSubmitted = false, submitCount = 0', () => {
    const { result } = makeForm();
    expect(result.current.formState.isSubmitted).toBe(false);
    expect(result.current.formState.submitCount).toBe(0);
  });
});

describe('useForm — setValue', () => {
  it('updates the value', () => {
    const { result } = makeForm();
    act(() => { result.current.setValue('email', 'aks@unikit.dev'); });
    expect(result.current.formState.values.email).toBe('aks@unikit.dev');
  });

  it('marks the field as dirty', () => {
    const { result } = makeForm();
    act(() => { result.current.setValue('email', 'test@test.com'); });
    expect(result.current.formState.dirty.email).toBe(true);
    expect(result.current.formState.isDirty).toBe(true);
  });

  it('shouldValidate triggers validation', async () => {
    const { result } = makeForm();
    result.current.register('email', { required: true });
    await act(async () => {
      result.current.setValue('email', '', { shouldValidate: true });
      await new Promise(r => setTimeout(r, 20));
    });
    expect(result.current.formState.errors.email).toBeTruthy();
  });
});

describe('useForm — getValue / getValues', () => {
  it('getValue returns single field', () => {
    const { result } = makeForm();
    act(() => { result.current.setValue('email', 'hi@test.com'); });
    expect(result.current.getValue('email')).toBe('hi@test.com');
  });

  it('getValues returns all fields', () => {
    const { result } = makeForm();
    act(() => {
      result.current.setValue('email', 'a@b.com');
      result.current.setValue('password', 'secret');
    });
    expect(result.current.getValues()).toEqual({ email: 'a@b.com', password: 'secret' });
  });
});

describe('useForm — setError / clearErrors', () => {
  it('setError adds an error', () => {
    const { result } = makeForm();
    act(() => { result.current.setError('email', { message: 'Already taken.' }); });
    expect(result.current.formState.errors.email).toBe('Already taken.');
    expect(result.current.formState.isValid).toBe(false);
  });

  it('clearErrors removes a specific error', () => {
    const { result } = makeForm();
    act(() => {
      result.current.setError('email', { message: 'Err' });
      result.current.setError('password', { message: 'Err2' });
    });
    act(() => { result.current.clearErrors('email'); });
    expect(result.current.formState.errors.email).toBeUndefined();
    expect(result.current.formState.errors.password).toBe('Err2');
  });

  it('clearErrors with no arg removes all errors', () => {
    const { result } = makeForm();
    act(() => {
      result.current.setError('email', { message: 'E1' });
      result.current.setError('password', { message: 'E2' });
    });
    act(() => { result.current.clearErrors(); });
    expect(result.current.formState.errors).toEqual({});
    expect(result.current.formState.isValid).toBe(true);
  });
});

describe('useForm — reset', () => {
  it('resets to default values', () => {
    const { result } = makeForm();
    act(() => {
      result.current.setValue('email', 'dirty@test.com');
      result.current.setError('email', { message: 'Err' });
    });
    act(() => { result.current.reset(); });
    expect(result.current.formState.values.email).toBe('');
    expect(result.current.formState.errors).toEqual({});
    expect(result.current.formState.isDirty).toBe(false);
  });

  it('reset with custom values overrides defaults', () => {
    const { result } = makeForm();
    act(() => { result.current.reset({ email: 'prefill@test.com' }); });
    expect(result.current.formState.values.email).toBe('prefill@test.com');
    expect(result.current.formState.values.password).toBe('');
  });
});

describe('useForm — handleSubmit', () => {
  it('calls onValid when form is valid', async () => {
    const onValid   = jest.fn();
    const onInvalid = jest.fn();
    const { result } = makeForm();

    // No rules registered → always valid
    act(() => {
      result.current.setValue('email', 'test@test.com');
      result.current.setValue('password', 'secret');
    });

    await act(async () => {
      await result.current.handleSubmit(onValid, onInvalid)();
    });

    expect(onValid).toHaveBeenCalledWith({ email: 'test@test.com', password: 'secret' });
    expect(onInvalid).not.toHaveBeenCalled();
  });

  it('calls onInvalid when required fields are empty', async () => {
    const onValid   = jest.fn();
    const onInvalid = jest.fn();
    const { result } = makeForm();

    result.current.register('email', { required: true });

    await act(async () => {
      await result.current.handleSubmit(onValid, onInvalid)();
    });

    expect(onValid).not.toHaveBeenCalled();
    expect(onInvalid).toHaveBeenCalled();
    expect(result.current.formState.isSubmitted).toBe(true);
    expect(result.current.formState.submitCount).toBe(1);
  });

  it('increments submitCount on each submission', async () => {
    const { result } = makeForm();
    await act(async () => { await result.current.handleSubmit(jest.fn())(); });
    await act(async () => { await result.current.handleSubmit(jest.fn())(); });
    expect(result.current.formState.submitCount).toBe(2);
  });

  it('sets isSubmitting = false after completion', async () => {
    const { result } = makeForm();
    await act(async () => { await result.current.handleSubmit(async () => { await new Promise(r => setTimeout(r, 10)); })(); });
    expect(result.current.formState.isSubmitting).toBe(false);
  });
});

describe('useForm — trigger', () => {
  it('returns false when field is invalid', async () => {
    const { result } = makeForm();
    result.current.register('email', { required: true });
    let valid = true;
    await act(async () => { valid = await result.current.trigger('email'); });
    expect(valid).toBe(false);
  });

  it('returns true when field is valid', async () => {
    const { result } = makeForm();
    result.current.register('email', { required: true });
    act(() => { result.current.setValue('email', 'ok@ok.com'); });
    let valid = false;
    await act(async () => { valid = await result.current.trigger('email'); });
    expect(valid).toBe(true);
  });

  it('validates all fields when called with no arg', async () => {
    const { result } = makeForm();
    result.current.register('email',    { required: true });
    result.current.register('password', { required: true });
    let valid = true;
    await act(async () => { valid = await result.current.trigger(); });
    expect(valid).toBe(false);
    expect(result.current.formState.errors.email).toBeTruthy();
    expect(result.current.formState.errors.password).toBeTruthy();
  });
});

describe('useForm — watch', () => {
  it('watch returns current value', () => {
    const { result } = makeForm();
    act(() => { result.current.setValue('email', 'watch@test.com'); });
    expect(result.current.watch('email')).toBe('watch@test.com');
  });

  it('watchAll returns snapshot of all values', () => {
    const { result } = makeForm();
    act(() => {
      result.current.setValue('email', 'a@b.com');
      result.current.setValue('password', 'pw');
    });
    expect(result.current.watchAll()).toEqual({ email: 'a@b.com', password: 'pw' });
  });
});

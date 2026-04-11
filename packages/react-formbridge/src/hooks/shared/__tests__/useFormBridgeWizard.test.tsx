import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { field } from '../../../core/field-builders/field';
import type { StorageAdapter } from '../../../core/persist/storage';
import type { FormSchema } from '../../../types/schema';
import { useFormBridgeWizard } from '../../useFormBridgeWizard.web';
import type { WizardStep } from '../useFormBridgeWizard';

function createMemoryStorage(): StorageAdapter {
  const store = new Map<string, string>();

  return {
    getItem: async (key) => store.get(key) ?? null,
    setItem: async (key, value) => {
      store.set(key, value);
    },
    removeItem: async (key) => {
      store.delete(key);
    },
  };
}

const steps: WizardStep<FormSchema>[] = [
  {
    id: 'personal',
    label: 'Personal',
    schema: {
      firstName: field.text('First name').required('First name is required'),
    } satisfies FormSchema,
  },
  {
    id: 'company',
    label: 'Company',
    schema: {
      companyName: field.text('Company name').required('Company name is required'),
    } satisfies FormSchema,
  },
  {
    id: 'review',
    label: 'Review',
    schema: {} satisfies FormSchema,
  },
];

describe('useFormBridgeWizard', () => {
  it('supports controlled cross-page navigation with persisted wizard state', async () => {
    const storage = createMemoryStorage();
    const onStepChange = vi.fn();

    const { result, rerender, unmount } = renderHook(
      ({ currentStepId }) =>
        useFormBridgeWizard(steps, {
          stepId: currentStepId,
          onStepChange,
          onSubmit: vi.fn(),
          persist: {
            key: 'cross-page-controlled',
            storage,
            debounce: 0,
          },
        }),
      {
        initialProps: { currentStepId: 'personal' },
      },
    );

    await waitFor(() => expect(result.current.isHydrating).toBe(false));
    expect(result.current.currentStepId).toBe('personal');

    act(() => {
      result.current.currentStep.setValue('firstName', 'Ava');
    });

    await waitFor(() => expect(result.current.allValues.firstName).toBe('Ava'));

    await act(async () => {
      expect(await result.current.next()).toBe(true);
    });

    expect(onStepChange).toHaveBeenCalledWith(
      expect.objectContaining({
        step: expect.objectContaining({ id: 'company' }),
        reason: 'next',
      }),
    );

    rerender({ currentStepId: 'company' });

    await waitFor(() => expect(result.current.currentStepId).toBe('company'));
    expect(result.current.allValues.firstName).toBe('Ava');

    act(() => {
      result.current.currentStep.setValue('companyName', 'Runilib');
    });

    await waitFor(() => expect(result.current.allValues.companyName).toBe('Runilib'));

    unmount();

    const resumed = renderHook(() =>
      useFormBridgeWizard(steps, {
        stepId: 'review',
        onSubmit: vi.fn(),
        persist: {
          key: 'cross-page-controlled',
          storage,
          debounce: 0,
        },
      }),
    );

    await waitFor(() => expect(resumed.result.current.isHydrating).toBe(false));
    expect(resumed.result.current.currentStepId).toBe('review');
    expect(resumed.result.current.allValues).toMatchObject({
      firstName: 'Ava',
      companyName: 'Runilib',
    });
  });

  it('restores the current step when the wizard remounts without route control', async () => {
    const storage = createMemoryStorage();

    const firstMount = renderHook(() =>
      useFormBridgeWizard(steps, {
        onSubmit: vi.fn(),
        persist: {
          key: 'wizard-remount',
          storage,
          debounce: 0,
        },
      }),
    );

    await waitFor(() => expect(firstMount.result.current.isHydrating).toBe(false));
    expect(firstMount.result.current.currentStepId).toBe('personal');

    act(() => {
      firstMount.result.current.currentStep.setValue('firstName', 'Lina');
    });

    await waitFor(() =>
      expect(firstMount.result.current.allValues.firstName).toBe('Lina'),
    );

    await act(async () => {
      expect(await firstMount.result.current.next()).toBe(true);
    });

    expect(firstMount.result.current.currentStepId).toBe('company');
    firstMount.unmount();

    const resumed = renderHook(() =>
      useFormBridgeWizard(steps, {
        onSubmit: vi.fn(),
        persist: {
          key: 'wizard-remount',
          storage,
          debounce: 0,
        },
      }),
    );

    await waitFor(() => expect(resumed.result.current.isHydrating).toBe(false));
    expect(resumed.result.current.currentStepId).toBe('company');
    expect(resumed.result.current.allValues.firstName).toBe('Lina');
  });
});

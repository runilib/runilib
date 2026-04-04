import type { FormSchema } from '../types';
import type {
  UseFormWizardOptions as SharedUseFormWizardOptions,
  UseFormWizardReturn as SharedUseFormWizardReturn,
  WizardStep as SharedWizardStep,
  WizardStepChangeEvent as SharedWizardStepChangeEvent,
} from './shared/useFormWizard';
import { createUseFormWizardBridge } from './shared/useFormWizard';
import { useFormBridge } from './useFormBridge.web';

export type UseFormWizardOptions = SharedUseFormWizardOptions<'web'>;
export type UseFormWizardReturn = SharedUseFormWizardReturn<'web'>;
export type WizardStep<S extends FormSchema = FormSchema> = SharedWizardStep<S, 'web'>;
export type WizardStepChangeEvent = SharedWizardStepChangeEvent<'web'>;

export type { WizardStepChangeReason } from './shared/useFormWizard';

export const useFormWizard = createUseFormWizardBridge(useFormBridge);

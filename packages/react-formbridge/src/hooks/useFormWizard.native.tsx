import type { FormSchema } from '../types';
import type {
  UseFormWizardOptions as SharedUseFormWizardOptions,
  UseFormWizardReturn as SharedUseFormWizardReturn,
  WizardStep as SharedWizardStep,
  WizardStepChangeEvent as SharedWizardStepChangeEvent,
} from './shared/useFormWizard';
import { createUseFormWizardBridge } from './shared/useFormWizard';
import { useFormBridge } from './useFormBridge.native';

export type UseFormWizardOptions = SharedUseFormWizardOptions<'native'>;
export type UseFormWizardReturn = SharedUseFormWizardReturn<'native'>;
export type WizardStep<S extends FormSchema = FormSchema> = SharedWizardStep<S, 'native'>;
export type WizardStepChangeEvent = SharedWizardStepChangeEvent<'native'>;

export type { WizardStepChangeReason } from './shared/useFormWizard';

export const useFormWizard = createUseFormWizardBridge(useFormBridge);

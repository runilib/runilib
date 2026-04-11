import type { FormSchema } from '../types/schema';
import type {
  UseFormWizardOptions as SharedUseFormWizardOptions,
  UseFormWizardReturn as SharedUseFormWizardReturn,
  WizardStep as SharedWizardStep,
  WizardStepChangeEvent as SharedWizardStepChangeEvent,
} from './shared/useFormBridgeWizard';
import { createUseFormWizardBridge } from './shared/useFormBridgeWizard';
import { useFormBridge } from './useFormBridge.web';

export type UseFormWizardOptions = SharedUseFormWizardOptions<'web'>;
export type UseFormWizardReturn = SharedUseFormWizardReturn<'web'>;
export type WizardStep<S extends FormSchema = FormSchema> = SharedWizardStep<S, 'web'>;
export type WizardStepChangeEvent = SharedWizardStepChangeEvent<'web'>;

export type { WizardStepChangeReason } from './shared/useFormBridgeWizard';

export const useFormBridgeWizard = createUseFormWizardBridge(useFormBridge);

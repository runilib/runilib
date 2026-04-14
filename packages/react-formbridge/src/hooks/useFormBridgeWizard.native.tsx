import type { FormSchema } from '../types/schema';
import type {
  UseFormWizardOptions as SharedUseFormWizardOptions,
  UseFormWizardReturn as SharedUseFormWizardReturn,
  WizardStep as SharedWizardStep,
  WizardStepChangeEvent as SharedWizardStepChangeEvent,
} from './shared/useFormBridgeWizard';
import { createUseFormBridgeWizard } from './shared/useFormBridgeWizard';
import { useFormBridge } from './useFormBridge.native';

export type UseFormWizardOptions = SharedUseFormWizardOptions<'native'>;
export type UseFormWizardReturn = SharedUseFormWizardReturn<'native'>;
export type WizardStep<S extends FormSchema = FormSchema> = SharedWizardStep<S, 'native'>;
export type WizardStepChangeEvent = SharedWizardStepChangeEvent<'native'>;

export type { WizardStepChangeReason } from './shared/useFormBridgeWizard';

export const useFormBridgeWizard = createUseFormBridgeWizard(useFormBridge);

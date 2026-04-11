import type { FormSchema } from '../types/schema';
import type {
  UseDynamicFormOptions as SharedUseDynamicFormOptions,
  UseDynamicFormReturn as SharedUseDynamicFormReturn,
} from './shared/useDynamicFormBridge';
import { createUseDynamicFormBridge } from './shared/useDynamicFormBridge';
import { useFormBridge } from './useFormBridge.native';

export type UseDynamicFormOptions<S extends FormSchema> = SharedUseDynamicFormOptions<
  S,
  'native'
>;
export type UseDynamicFormReturn = SharedUseDynamicFormReturn<'native'>;

export const useDynamicFormBridge = createUseDynamicFormBridge(useFormBridge);

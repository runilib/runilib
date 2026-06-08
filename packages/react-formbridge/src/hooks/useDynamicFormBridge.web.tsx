import type { FormSchema } from '../types/schema';
import type {
  UseDynamicFormOptions as SharedUseDynamicFormOptions,
  UseDynamicFormReturn as SharedUseDynamicFormReturn,
} from './shared/useDynamicFormBridge';
import { createUseDynamicFormBridge } from './shared/useDynamicFormBridge';
import { useFormBridge } from './useFormBridge.web';

export type UseDynamicFormOptions<S extends FormSchema> = SharedUseDynamicFormOptions<
  S,
  'web'
>;
export type UseDynamicFormReturn<S extends FormSchema = FormSchema> =
  SharedUseDynamicFormReturn<S, 'web'>;

export const useDynamicFormBridge = createUseDynamicFormBridge(useFormBridge);

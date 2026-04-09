import type { FormSchema } from '../types/schema';
import type {
  UseDynamicFormOptions as SharedUseDynamicFormOptions,
  UseDynamicFormReturn as SharedUseDynamicFormReturn,
} from './shared/useDynamicForm';
import { createUseDynamicFormBridge } from './shared/useDynamicForm';
import { useFormBridge } from './useFormBridge.native';

export type UseDynamicFormOptions<S extends FormSchema> = SharedUseDynamicFormOptions<
  S,
  'native'
>;
export type UseDynamicFormReturn = SharedUseDynamicFormReturn<'native'>;

export const useDynamicForm = createUseDynamicFormBridge(useFormBridge);

import type { FormSchema } from '../types/schema';
import type {
  UseDynamicFormOptions as SharedUseDynamicFormOptions,
  UseDynamicFormReturn as SharedUseDynamicFormReturn,
} from './shared/useDynamicForm';
import { createUseDynamicFormBridge } from './shared/useDynamicForm';
import { useFormBridge } from './useFormBridge.web';

export type UseDynamicFormOptions<S extends FormSchema> = SharedUseDynamicFormOptions<
  S,
  'web'
>;
export type UseDynamicFormReturn = SharedUseDynamicFormReturn<'web'>;

export const useDynamicForm = createUseDynamicFormBridge(useFormBridge);

import type { LibraryDoc } from './../../../types/index';
import {
  USE_FORM_BRIDGE_OPTIONS_SURFACE,
  USE_FORM_BRIDGE_RETURN_SURFACE,
} from '../constants';

export const useFormBridgeSection: LibraryDoc['sections'][number] = {
  id: 'fb-use-form-bridge',
  title: 'useFormBridge()',
  content: `Primary hook that turns a schema into a working form runtime.

- Use it when the schema is known in code and you want the main cross-platform API.
- It returns everything needed to render the form, read live state, run validation, persist drafts, and control the form imperatively.
- This is the foundation that the higher-level helpers build on top of.`,
  codeTabs: [
    {
      filename: 'useFormBridge.tsx',
      lang: 'tsx',
      code: `const {
  FormProvider,
  Form,
  FieldError,
  FieldLabel,
  fieldController,
  state,
  visibility,
  persistanceHelpers,
  setValue,
  getValue,
  getValues,
  validate,
  resetFields,
  setError,
  clearErrors,
  watch,
  watchAll,
  submit,
  handleSubmit,
} = useFormBridge(schema, {
  validateOn: 'onBlur',
  revalidateOn: 'onChange',
  validatorBridge,
  persist,
  formKey: 'checkout-step-1',
  schemaKey: schemaVersion,
  initialValues: { quantity: 2 },
  analytics,
  onSubmit: saveCheckout,
  onError: focusFirstInvalidField,
  onSubmitError: () => 'Unable to save the checkout',
})`,
    },
  ],
  subsections: [
    {
      id: 'fb-use-form-bridge-options',
      title: 'Options',
      content: `${USE_FORM_BRIDGE_OPTIONS_SURFACE}`,
    },
    {
      id: 'fb-use-form-bridge-return',
      title: 'Return value',
      content: `${USE_FORM_BRIDGE_RETURN_SURFACE}`,
    },
  ],
};

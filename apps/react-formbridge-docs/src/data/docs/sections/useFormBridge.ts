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
  fields,
  FieldError,
  FieldLabel,
  fieldController,
  state,
  visibility,
  isLoadingDraft,
  hasDraft,
  clearDraft,
  saveDraftNow,
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
} = useFormBridge(schema, {
  validateOn: 'onBlur',
  revalidateOn: 'onChange',
  resolver,
  persist,
  formKey: 'checkout-step-1',
  initialValues: { quantity: 2 },
  analytics,
  globalDefaults: (state) => ({
    submit: {
      loadingText: state.isSubmitting ? 'Saving...' : 'Save',
    },
  }),
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

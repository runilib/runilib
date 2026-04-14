import type { LibraryDoc } from './../../../types/index';
import { FORM_COMPONENT_PROPS_SURFACE, FORM_SUBMIT_PROPS_SURFACE } from '../constants';

export const submitSection: LibraryDoc['sections'][number] = {
  id: 'fb-submit',
  title: 'Submit component',
  content: `Wrapper component returned by the hook. It connects submit, validation, async loading state, and submit error handling to the generated field runtime.

- On web, it behaves like a smart \`<form>\`
- On native, it behaves like a smart wrapper you can place inside your layout
- \`Form.Submit\` is coupled to the same runtime, so loading and disabled states stay aligned with the form`,
  codeTabs: [
    {
      filename: 'Form.tsx',
      lang: 'tsx',
      code: `<Form
  onSubmit={saveProfile}
  onError={(errors) => console.log(errors)}
  onSubmitError={(error) => console.log(error)}
>
  {/* fields... */}
  <Form.Submit loadingText="Saving...">Save</Form.Submit>
</Form>`,
    },
  ],
  subsections: [
    {
      id: 'fb-form-props',
      title: 'Props',
      content: `${FORM_COMPONENT_PROPS_SURFACE}`,
    },
    {
      id: 'fb-submit-props',
      title: 'Form.Submit',
      content: `${FORM_SUBMIT_PROPS_SURFACE}`,
    },
  ],
};

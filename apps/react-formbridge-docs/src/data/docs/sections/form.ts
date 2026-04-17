import type { LibraryDoc } from './../../../types/index';
import { FORM_COMPONENT_PROPS_SURFACE, FORM_SUBMIT_PROPS_SURFACE } from '../constants';

export const formSection: LibraryDoc['sections'][number] = {
  id: 'fb-form',
  title: 'Form component',
  content: `Wrapper component returned by the hook. It connects submit, validation, async loading state, and submit error handling to the generated field runtime.

- On web, it behaves like a smart \`<form>\`
- On native, it behaves like a smart wrapper you can place inside your layout
- \`Form\` also accepts the native props of that underlying platform element, so things like \`id\`, \`method\`, \`autoComplete\`, \`aria-*\`, \`testID\`, or \`accessibilityLabel\` can be passed directly at the call site
- \`Form.Submit\` is coupled to the same runtime, so loading and disabled states stay aligned with the form, and it likewise extends the native button / pressable props of the platform`,
  codeTabs: [
    {
      filename: 'Form.tsx',
      lang: 'tsx',
      code: `<Form
  id="profile-form"
  name="profile-form"
  method="post"
  aria-label="Profile form"
  onSubmit={saveProfile}
  onError={(errors) => console.log(errors)}
  onSubmitError={(error) => console.log(error)}
>
  {/* fields... */}
  <Form.Submit
    type="submit"
    name="intent"
    value="save-profile"
    loadingText="Saving..."
  >
    Save
  </Form.Submit>
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

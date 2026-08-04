import type { LibraryDoc } from './../../../types/index';
import { FORM_COMPONENT_PROPS_SURFACE } from '../constants';

export const formSection: LibraryDoc['sections'][number] = {
  id: 'fb-form',
  title: 'Form component',
  content: `Minimal wrapper component returned by the hook. It provides context and connects its submit event to FormBridge's validation and submission pipeline. It does not render fields or a submit button.

- On web, it behaves like a smart \`<form>\`
- On native, it behaves like a smart wrapper you can place inside your layout
- \`Form\` accepts the native props of that underlying platform element.
- Render your own controls and submit button. Read \`form.state.isSubmitting\` to expose loading/disabled UI.
- For a completely application-owned wrapper, use \`handleSubmit\` on web or call \`submit()\` on native.`,
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
  <AppField form={form} name="displayName" />
  <button
    type="submit"
    name="intent"
    value="save-profile"
    disabled={form.state.isSubmitting}
  >
    {form.state.isSubmitting ? 'Saving…' : 'Save'}
  </button>
</Form>`,
    },
  ],
  subsections: [
    {
      id: 'fb-form-props',
      title: 'Props',
      content: `${FORM_COMPONENT_PROPS_SURFACE}`,
    },
  ],
};

import type { LibraryDoc } from './../../../types/index';
import { FORM_STATE_SURFACE } from '../constants';

export const stateSection: LibraryDoc['sections'][number] = {
  id: 'fb-state',
  title: 'State',
  content: `Current reactive state returned by \`useFormBridge()\`.

- Read from it to disable buttons, show summaries, build progress UI, or inspect submit lifecycle
- It is already derived from the schema and the current user interactions`,
  code: {
    filename: 'State.ts',
    lang: 'ts',

    code: `form.state.values
form.state.errors
form.state.touched
form.state.dirty
form.state.status // 'idle' | 'validating' | 'submitting' | 'success' | 'error'
form.state.isValid
form.state.isDirty
form.state.isSubmitting
form.state.isSuccess
form.state.isError
form.state.submitCount`,
  },
  subsections: [
    {
      id: 'fb-state-surface',
      title: 'Complete state shape',
      content: `${FORM_STATE_SURFACE}`,
    },
  ],
};

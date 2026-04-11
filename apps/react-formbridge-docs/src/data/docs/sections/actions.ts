import type { LibraryDoc } from './../../../types/index';
import { ACTIONS_HELPERS_SURFACE, FIELD_CONTROLLER_SURFACE } from '../constants';

export const actionsSection: LibraryDoc['sections'][number] = {
  id: 'fb-actions',
  title: 'Actions & helpers',
  content: `Imperative helpers are useful when the form participates in a bigger flow: wizard steps, route changes, modal close guards, inline autosave, custom field chrome, or external events.`,
  code: {
    filename: 'Actions.ts',
    lang: 'ts',

    code: `await form.validate(names?)
form.resetFields(values?)
form.setValue('firstName', 'Ava')
form.getValue('firstName')
form.getValues()
form.setError('email', 'Already used')
form.clearErrors(['email'])
form.watch('email')
form.watchAll()
await form.submit()
const email = form.fieldController('email')
email.onChange('ops@runilib.dev')
email.focus()
await form.saveDraftNow()
await form.clearDraft()
form.visibility.company?.visible`,
  },
  subsections: [
    {
      id: 'fb-actions-surface',
      title: 'Complete helper surface',
      content: `${ACTIONS_HELPERS_SURFACE}`,
    },
    {
      id: 'fb-actions-field-controller',
      title: 'Field-scoped imperative control',
      content: `Use \`form.fieldController(name)\` when the action belongs to one field rather than the whole form.

- Examples: opening a custom picker, focusing a masked input from another button, mapping server validation back to a single custom field, or building your own review shell around one schema key

${FIELD_CONTROLLER_SURFACE}`,
    },
  ],
};

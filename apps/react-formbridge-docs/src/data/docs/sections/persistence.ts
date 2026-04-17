import type { LibraryDoc } from './../../../types/index';
import { PERSIST_OPTIONS_SURFACE } from '../constants';

export const persistenceSection: LibraryDoc['sections'][number] = {
  id: 'fb-persistence',

  title: 'Draft persistence',
  content: `Draft persistence lets a form survive refreshes, tab changes, route changes, or interrupted sessions.

- Great for checkout flows, onboarding, long settings screens, or mobile forms that may be backgrounded
- The runtime restores saved values on mount and exposes helpers to manage that lifecycle`,
  code: {
    filename: 'Persist.tsx',
    lang: 'tsx',

    code: `const form = useFormBridge(schema, {
  persist: {
    key: 'checkout-step-1',
    storage: 'local',
    ttl: 60 * 60,
    debounce: 800,
    exclude: ['password', 'cvv'],
    version: '2',
  },
})

if (form.isLoadingDraft) return <Spinner />

await form.saveDraftNow()
await form.clearDraft()`,
  },
  subsections: [
    {
      id: 'fb-persistence-notes',
      title: 'When to enable it',
      content: `Use persistence for long or interruption-prone flows. Exclude secrets such as passwords, PINs, OTPs, CVV, or any field you would not want stored locally.

${PERSIST_OPTIONS_SURFACE}

Draft helpers exposed through \`useFormBridge()\`:

| Helper | Description |
| --- | --- |
| \`isLoadingDraft\` | \`true\` while the runtime is rehydrating a saved draft on mount |
| \`hasDraft\` | \`true\` once a draft was found and applied for this form key |
| \`saveDraftNow()\` | Force-flush the current values to storage (bypasses debounce) |
| \`clearDraft()\` | Delete the stored draft for this form key |`,
    },
  ],
};

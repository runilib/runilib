import type { LibraryDoc } from './../../../types/index';
import {
  DOC_PREVIEWS,
  READONLY_FIELD_PROPS_SURFACE,
  READONLY_FIELD_STATE_SURFACE,
  READONLY_OPTIONS_SURFACE,
  READONLY_RETURN_SURFACE,
} from '../constants';

export const readonlySection: LibraryDoc['sections'][number] = {
  id: 'fb-readonly',

  title: 'useFormBridgeReadonly()',
  content: `Render schema-driven values as readonly rows or as a diff against original values.

- Useful for review steps before submission, audit views, change approval screens, or before/after comparisons
- It reuses the schema labels and option metadata, so your review UI stays aligned with your editing UI`,
  codeTabs: [
    {
      filename: 'Readonly.tsx',
      lang: 'tsx',
      preview: DOC_PREVIEWS.readonly,
      code: `import { field, useFormBridgeReadonly } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name'),
  email: field.email('Email'),
  country: field.select('Country').options(['FR','US','GB']),
}

export function ReviewCard({ values, original }: { values: any; original?: any }) {
  const readonly = useFormBridgeReadonly(schema, {
    values,
    originalValues: original,
    mode: original ? 'diff' : 'readonly',
  })

  const { ReadonlyFields, changedFields, hasChanges } = readonly

  return (
    <section>
      <ReadonlyFields.fullName />
      <ReadonlyFields.email />
      <ReadonlyFields.country />
      {hasChanges ? <p>{changedFields.length} fields changed.</p> : null}
    </section>
  )
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-readonly-options',
      title: 'Options',
      content: `- First argument: the schema

${READONLY_OPTIONS_SURFACE}`,
    },
    {
      id: 'fb-readonly-return',
      title: 'Return',
      content: `${READONLY_FIELD_STATE_SURFACE}

${READONLY_FIELD_PROPS_SURFACE}

${READONLY_RETURN_SURFACE}`,
    },
    {
      id: 'fb-readonly-notes',
      title: 'Platform note',
      content: `Readonly review flows are currently most battle-tested on web. If you plan to rely on this API in native screens too, validate the exact renderer behavior you need before rolling it out broadly.`,
    },
  ],
};

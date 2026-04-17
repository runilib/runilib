import type { LibraryDoc } from './../../../types/index';
import {
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
      filename: 'ReadonlyPlayground.tsx',
      lang: 'tsx',
      code: `import { useState } from 'react'
import { field, useFormBridgeReadonly } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name'),
  email: field.email('Email'),
  country: field.select('Country').options(['FR', 'US', 'GB']),
}

const originalValues = {
  fullName: 'Ava Martin',
  email: 'ava@runilib.dev',
  country: 'FR',
}

const editedValues = {
  fullName: 'Ava Martin',
  email: 'ava.martin@runilib.dev',
  country: 'GB',
}

const rowStyle = {
  border: '1px solid #d6d9e0',
  borderRadius: 12,
  padding: 12,
  background: '#fff',
}

export function ReadonlyPlayground() {
  const [mode, setMode] = useState<'readonly' | 'diff'>('diff')
  const [values, setValues] = useState(originalValues)

  const readonly = useFormBridgeReadonly(schema, {
    mode,
    values,
    originalValues: originalValues,
  })

  const { ReadonlyFields, changedFields, hasChanges } = readonly

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20, background: '#f5f7fb' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <button type="button" onClick={() => setValues(editedValues)}>
          Load edited values
        </button>
        <button type="button" onClick={() => setValues(originalValues)}>
          Reset values
        </button>
        <button
          type="button"
          onClick={() =>
            setMode((current) => (current === 'diff' ? 'readonly' : 'diff'))
          }
        >
          Toggle mode
        </button>
      </div>

      <p style={{ marginTop: 0, color: '#4b5563' }}>
        Mode: <strong>{mode}</strong>
        {' · '}
        {hasChanges
          ? \`\${changedFields.length} changed field(s): \${changedFields.join(', ')}\`
          : 'No detected changes'}
      </p>

      <div style={{ display: 'grid', gap: 10 }}>
        <ReadonlyFields.fullName style={rowStyle} />
        <ReadonlyFields.email style={rowStyle} />
        <ReadonlyFields.country style={rowStyle} />
      </div>
    </div>
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

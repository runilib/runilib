import type { LibraryDoc } from './../../../types/index';
import {
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
      filename: 'ReadonlyPreview.web.tsx',
      interactive: true,
      lang: 'tsx',
      code: `import { useState } from 'react'
import {
  field,
  useFormBridge,
  useFormBridgeReadonly,
} from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name').required(),
  email: field.email('Email').required(),
  country: field
    .select('Country')
    .options([
      { label: 'France', value: 'FR' },
      { label: 'United States', value: 'US' },
      { label: 'United Kingdom', value: 'GB' },
    ])
    .required(),
  newsletter: field.checkbox('Receive product updates'),
}

const originalValues = {
  fullName: 'Ava Martin',
  email: 'ava@runilib.dev',
  country: 'FR',
  newsletter: true,
}

const editedValues = {
  fullName: 'Ava Martin',
  email: 'ava.martin@runilib.dev',
  country: 'GB',
  newsletter: false,
}

const rowStyle = {
  border: '1px solid #d6d9e0',
  borderRadius: 12,
  padding: 12,
  background: '#fff',
}

export function ReadonlyPlayground() {
  const [mode, setMode] = useState<'readonly' | 'diff'>('diff')
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    initialValues: originalValues,
  })

  const { Form, fieldController, state } = form

  const readonly = useFormBridgeReadonly(schema, {
    mode,
    values: state.values,
    originalValues,
  })

  const { changedFields, fieldNames, fields: previewFields, hasChanges } = readonly

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        padding: 20,
        background: '#f5f7fb',
        display: 'grid',
        gap: 16,
      }}
    >
      <div>
        <h3 style={{ margin: '0 0 8px' }}>Edit profile + readonly preview</h3>
        <p style={{ margin: 0, color: '#4b5563' }}>
          The form stays editable, while the preview reuses the same schema labels,
          select labels, and diff metadata.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => form.resetFields(editedValues)}>
          Load sample edits
        </button>
        <button type="button" onClick={() => form.resetFields(originalValues)}>
          Reset to original
        </button>
        <button
          type="button"
          onClick={() =>
            setMode((current) => (current === 'diff' ? 'readonly' : 'diff'))
          }
        >
          Toggle {mode === 'diff' ? 'readonly' : 'diff'} preview
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 16,
          alignItems: 'start',
        }}
      >
        <Form
          onSubmit={async (values) => {
            setSubmitted(values)
          }}
        >
          <div style={{ display: 'grid', gap: 12 }}>
            <h4 style={{ margin: 0 }}>Editable form</h4>
            <AppField form={form} name="fullName" />
            <AppField form={form} name="email" />
            <AppField form={form} name="country" />
            <AppField form={form} name="newsletter" />
            <button type="submit">Save profile</button>
          </div>
        </Form>

        <aside style={{ display: 'grid', gap: 10 }}>
          <div>
            <h4 style={{ margin: '0 0 4px' }}>Readonly preview</h4>
            <p style={{ margin: 0, color: '#4b5563', fontSize: 13 }}>
              Mode: <strong>{mode}</strong>
              {' · '}
              {hasChanges
                ? \`\${changedFields.length} changed field(s)\`
                : 'No detected changes'}
            </p>
          </div>

          {fieldNames.map((name) => {
            const preview = previewFields[name]

            return (
              <div
                key={preview.name}
                style={{
                  ...rowStyle,
                  borderColor:
                    mode === 'diff' && preview.changed ? '#38bdf8' : '#d6d9e0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <strong>{preview.label}</strong>
                  {mode === 'diff' && preview.changed ? (
                    <span style={{ color: '#0369a1', fontSize: 12 }}>Edited</span>
                  ) : null}
                </div>

                <p style={{ margin: '8px 0 0' }}>{preview.display}</p>

                {mode === 'diff' && preview.changed ? (
                  <p
                    style={{
                      margin: '6px 0 0',
                      color: '#64748b',
                      fontSize: 13,
                    }}
                  >
                    Original: {preview.originalDisplay}
                  </p>
                ) : null}
              </div>
            )
          })}
        </aside>
      </div>

      <div
        style={{
          border: '1px solid #d6d9e0',
          borderRadius: 12,
          padding: 12,
          background: '#fff',
        }}
      >
        <strong>Last submit</strong>
        <pre style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(submitted, null, 2)}
        </pre>
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

${READONLY_RETURN_SURFACE}`,
    },
    {
      id: 'fb-readonly-notes',
      title: 'Rendering note',
      content: `The hook returns formatted state, not components. Iterate over \`fieldNames\` and render \`fields[name]\` with your own web or native review-row component.`,
    },
  ],
};

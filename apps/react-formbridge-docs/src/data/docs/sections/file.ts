import type { LibraryDoc } from './../../../types/index';
import { buildMethodsTable, FENCE } from '../constants';

const FILE_METHODS_TABLE = buildMethodsTable([
  [
    '`label(text)`',
    '`text: string`',
    'Sets the label exposed to your application-owned uploader.',
  ],
  [
    '`required(message?)`',
    '`message?: string`',
    'Marks file selection as mandatory. Default message: `"Please select a file."`.',
  ],
  ['`hint(text)`', '`text: string`', 'Adds helper copy below the uploader.'],
  [
    '`disabled(value = true)`',
    '`value?: boolean`',
    'Disables or re-enables the uploader.',
  ],
  ['`hidden(value = true)`', '`value?: boolean`', 'Hides or shows the uploader.'],
  [
    '`accept(types)`',
    '`types: string[]`',
    'Restricts accepted MIME types. Supports wildcards like `image/*`. Validated client-side against the actual file `type`.',
  ],
  [
    '`maxSize(bytes)`',
    '`bytes: number`',
    'Maximum size **per file** in bytes. Validation runs against every file when `multiple()` is enabled and rejects with a human-readable MB message.',
  ],
  [
    '`multiple(max = 10)`',
    '`max?: number`',
    'Enables multi-file mode, sets the maximum allowed file count, and switches the default value from `null` to `[]`.',
  ],
  [
    '`preview(height = 160)`',
    '`height?: number`',
    'Enables image previews and sets their preview height in px.',
  ],
  [
    '`source(type)`',
    "`'gallery' | 'camera' | 'documents' | 'all'`",
    'Native picker intent. Use the same value when wiring your application-owned picker; web file dialogs ignore it.',
  ],
  [
    '`withBase64()`',
    '`() => this`',
    'Requests base64 encoding alongside the file payload - needed for upload APIs that expect inline payloads instead of multipart streams.',
  ],
  [
    '`resize(maxWidth, maxHeight, quality = 0.9)`',
    '`number, number, number?`',
    'Native-only: auto-resize images before they enter the form value. Useful to keep mobile uploads under the size limit before they hit the network.',
  ],
  [
    '`allowVideo()`',
    '`() => this`',
    'Native-only: includes video files in the gallery/camera picker. Web relies on `accept()` instead.',
  ],
  [
    '`noDragDrop()`',
    '`() => this`',
    'Web-only: disables the drop-zone surface and shows just the browse button.',
  ],
  [
    '`dragLabel(label)`',
    '`label: string`',
    'Web-only: customizes the drop-zone copy. Defaults to `"Drag & drop a file here, or click to browse"`.',
  ],
  [
    '`visibleWhen(field, value?) / visibleWhenNot / visibleWhenTruthy / visibleWhenFalsy / visibleWhenAny`',
    '`field | predicate`',
    'Conditional visibility rules. Same shape as the BaseFieldBuilder helpers - show the uploader only when another field matches a value, is truthy/falsy, or matches any of several pairs.',
  ],
  [
    '`requiredWhen(field, value?) / requiredWhenAny`',
    '`field | predicate`',
    'Conditional `required` rules so the uploader only becomes mandatory when another field hits a given state.',
  ],
  [
    '`disabledWhen(field, value?)`',
    '`field | predicate`',
    'Conditional `disabled` rule so the uploader locks based on another field.',
  ],
  [
    '`resetOnHide() / keepOnHide() / clearOnHide()`',
    '`() => this`',
    'Controls what happens to the selected file(s) when the field becomes hidden by a visibility rule.',
  ],
]);

const FILE_PRESETS_TABLE = buildMethodsTable([
  [
    '`FileFieldBuilder.profilePhoto(label?)`',
    '`label?: string`',
    'Profile photo preset: JPG/PNG/WebP, 5 MB cap, gallery source, preview enabled, image resized to 1024×1024 at 0.85 quality.',
  ],
  [
    '`FileFieldBuilder.document(label?)`',
    '`label?: string`',
    'PDF-only document preset, 10 MB cap, document picker source.',
  ],
  [
    '`FileFieldBuilder.attachments(label?, max = 5)`',
    '`label?: string, max?: number`',
    'Multi-attachment preset accepting images and PDFs, 10 MB cap each, preview enabled, drag zone hint adapts to the max.',
  ],
  [
    '`FileFieldBuilder.spreadsheet(label?)`',
    '`label?: string`',
    'CSV/XLS/XLSX import preset, 20 MB cap, document picker source.',
  ],
]);

export const fileSection: LibraryDoc['sections'][number] = {
  id: 'fb-file',
  title: 'field.file()',
  content: `File upload builder for documents, media, and attachments. This is the only builder that does **not** extend \`BaseFieldBuilder\`.

- Has its own upload-focused fluent API: \`accept()\`, \`maxSize()\`, \`multiple()\`, \`preview()\`, \`source()\`, \`resize()\`
- \`render()\`, \`transform()\`, and the conditional helpers from \`BaseFieldBuilder\` are not available on this builder
- Your application renders the browser input, drop zone, or native picker; the schema keeps the business contract`,
  codeTabs: [
    {
      filename: 'File.web.tsx',
      label: 'Web',
      interactive: true,
      lang: 'tsx',
      code: `import { useState } from 'react'
import { field, useFormBridge, type FileValue } from '@runilib/react-formbridge'

const schema = {
  avatar: field.file('Avatar')
    .accept(['image/jpeg', 'image/png', 'image/webp'])
    .maxSize(5 * 1024 * 1024)
    .preview(140)
    .required('Please upload a photo.'),
  attachments: field.file('Attachments')
    .multiple(3)
    .accept(['image/png', 'image/jpeg', 'application/pdf'])
    .maxSize(2 * 1024 * 1024)
    .dragLabel('Drop up to 3 files here (PNG, JPG, PDF · 2 MB each)'),
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

function summarize(value: FileValue | FileValue[] | null): string {
  if (!value) return 'empty'
  const list = Array.isArray(value) ? value : [value]
  if (list.length === 0) return 'empty'
  return list
    .map((file) => \`\${file.name} · \${file.type} · \${formatSize(file.size)}\`)
    .join('\\n')
}

function toFileValue(file: File): FileValue {
  return {
    uri: URL.createObjectURL(file),
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
  }
}

function FileField({
  form,
  name,
  accept,
  multiple = false,
  preview = false,
}) {
  const file = form.fieldController(name)
  const selected = Array.isArray(file.value)
    ? file.value
    : file.value
      ? [file.value]
      : []

  if (!file.visible) return null

  return (
    <label
      style={{
        display: 'grid',
        gap: 8,
        padding: 16,
        border: \`1px dashed \${file.error ? '#dc2626' : '#9ca3af'}\`,
        borderRadius: 12,
        background: '#fff',
      }}
    >
      <strong>{file.label}{file.required ? ' *' : ''}</strong>
      <span>Drop files here or choose them from your device.</span>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={file.disabled}
        onChange={(event) => {
          const values = Array.from(event.target.files ?? []).map(toFileValue)
          file.onChange(multiple ? values : (values[0] ?? null))
        }}
        onBlur={file.onBlur}
      />
      {preview
        ? selected.map((value) =>
            value.type.startsWith('image/') ? (
              <img
                key={value.uri}
                src={value.uri}
                alt={value.name}
                style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }}
              />
            ) : null,
          )
        : null}
      {selected.map((value) => (
        <span key={value.uri}>{value.name} · {formatSize(value.size)}</span>
      ))}
      {file.error ? <span role="alert" style={{ color: '#dc2626' }}>{file.error}</span> : null}
    </label>
  )
}

export function FilePlaygroundWeb() {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)
  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  })
  const { Form, fieldController, state } = form

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
        <h3 style={{ margin: '0 0 8px' }}>Interactive file uploads</h3>
        <p style={{ margin: 0, color: '#4b5563' }}>
          Pick an avatar and a few attachments, then submit to inspect the
          platform-agnostic <code>FileValue</code> payload FormBridge exposes.
        </p>
      </div>

      <Form onSubmit={async (values) => setSubmitted(values)}>
        <div style={{ display: 'grid', gap: 16 }}>
          <FileField
            form={form}
            name="avatar"
            accept="image/jpeg,image/png,image/webp"
            preview
          />
          <FileField
            form={form}
            name="attachments"
            accept="image/png,image/jpeg,application/pdf"
            multiple
          />
          <button type="submit" disabled={!state.isValid}>Upload</button>
        </div>
      </Form>

      <div style={{ display: 'grid', gap: 12 }}>
        <div
          style={{
            border: '1px solid #d6d9e0',
            borderRadius: 12,
            padding: 12,
            background: '#fff',
          }}
        >
          <strong>Live summary</strong>
          <pre style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
{\`avatar:
\${summarize(state.values.avatar)}

attachments:
\${summarize(state.values.attachments)}\`}
          </pre>
        </div>

        <div
          style={{
            border: '1px solid #d6d9e0',
            borderRadius: 12,
            padding: 12,
            background: '#fff',
          }}
        >
          <strong>Last submit (raw FileValue payload)</strong>
          <pre style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(
              submitted,
              (key, value) =>
                key === 'base64' && typeof value === 'string'
                  ? \`<\${value.length} chars>\`
                  : value,
              2,
            )}
          </pre>
        </div>
      </div>
    </div>
  )
}`,
    },
    {
      filename: 'File.native.tsx',
      label: 'App',
      interactive: true,
      lang: 'tsx',
      code: `import { useState } from 'react'
import { Button, Pressable, ScrollView, Text, View } from 'react-native'
import {
  field,
  useFormBridge,
  type FileValue,
} from '@runilib/react-formbridge'

const schema = {
  identityCard: field.file('Identity card')
    .accept(['image/jpeg', 'image/png', 'application/pdf'])
    .source('documents')
    .withBase64()
    .maxSize(10 * 1024 * 1024)
    .hint('JPG, PNG or PDF up to 10 MB'),
}

// Mock picker so the demo is self-contained.
// In production, wire \`pickFiles\` to expo-document-picker /
// expo-image-picker / react-native-image-picker.
const MOCK_ID_CARD: FileValue = {
  uri: 'file:///mock/identity-card.pdf',
  name: 'identity-card.pdf',
  type: 'application/pdf',
  size: 842_315,
  base64: 'JVBERi0xLjQKJeLjz9MKNCAw…(truncated)',
}

function FileField({ form, name, pickFiles }) {
  const file = form.fieldController(name)

  if (!file.visible) return null

  const selected = file.value

  return (
    <View style={{ gap: 8 }}>
      <Text>{file.label}{file.required ? ' *' : ''}</Text>
      <Pressable
        accessibilityRole="button"
        disabled={file.disabled}
        onPress={async () => {
          const result = await pickFiles()
          if (result) file.onChange(result)
        }}
        style={{
          padding: 18,
          alignItems: 'center',
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: file.error ? '#dc2626' : '#9ca3af',
          borderRadius: 12,
          backgroundColor: '#fff',
        }}
      >
        <Text>{selected ? 'Replace document' : 'Choose a document'}</Text>
      </Pressable>
      {file.hint ? <Text style={{ color: '#4b5563' }}>{file.hint}</Text> : null}
      {selected ? <Text>{selected.name} · {selected.type}</Text> : null}
      {file.error ? <Text style={{ color: '#dc2626' }}>{file.error}</Text> : null}
    </View>
  )
}

export function FilePlaygroundApp() {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)
  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
  })
  const { Form, fieldController, state } = form

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f7fb' }}>
      <View style={{ padding: 16, gap: 16 }}>
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>
            Identity card upload
          </Text>
          <Text style={{ color: '#4b5563' }}>
            Tap the picker to simulate a document selection, then submit to
            inspect the FileValue payload (base64 is truncated for readability).
          </Text>
        </View>

        <Form onSubmit={async (values) => setSubmitted(values)}>
          <View style={{ gap: 12 }}>
            <FileField form={form} name="identityCard"
              pickFiles={async () => MOCK_ID_CARD}
            />
            <Button
              title="Submit"
              disabled={!state.isValid}
              onPress={() => void form.submit()}
            />
          </View>
        </Form>

        <View
          style={{
            borderWidth: 1,
            borderColor: '#d6d9e0',
            borderRadius: 12,
            padding: 12,
            backgroundColor: '#fff',
            gap: 8,
          }}
        >
          <Text style={{ fontWeight: '600' }}>Live values</Text>
          <Text>
            {state.values.identityCard
              ? \`\${state.values.identityCard.name} · \${state.values.identityCard.type}\`
              : 'Nothing picked yet'}
          </Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: '#d6d9e0',
            borderRadius: 12,
            padding: 12,
            backgroundColor: '#fff',
            gap: 8,
          }}
        >
          <Text style={{ fontWeight: '600' }}>Last submit</Text>
          <Text>{JSON.stringify(submitted, null, 2)}</Text>
        </View>
      </View>
    </ScrollView>
  )
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-file-props',
      title: 'Defaults, inheritance & field methods',
      content: `This builder has its own upload-focused fluent API rather than the full \`BaseFieldBuilder\` surface.

Defaults:
- defaultValue is \`null\` for single-file mode, or \`[]\` after calling \`multiple()\`
- accepted types default to any file type
- drag & drop is enabled on web by default
- file previews are off by default

File-builder methods:
${FILE_METHODS_TABLE}

Static presets - shortcuts that pre-configure common upload flows:
${FILE_PRESETS_TABLE}

Base-builder relationship:
- See [Base field builder](/docs/base-field-builder) for the shared surface most other builders inherit
- \`field.file()\` ships its own conditional helpers (\`visibleWhen\`, \`requiredWhen\`, \`disabledWhen\`, \`resetOnHide\`, …) that mirror the BaseFieldBuilder shape, so it integrates with the same conditional logic as every other field
- It does **not** expose \`render()\`, \`transform()\`, or the value-coercion helpers because it does not extend the full \`BaseFieldBuilder\` surface`,
    },
    {
      id: 'fb-file-headless-ui',
      title: 'Render a picker or drop zone',
      content: `FormBridge does not open a picker or render an upload surface. Build that UI in your application and bind it with \`form.fieldController(name)\`.

- Web: map the browser \`FileList\` to \`FileValue\` objects, then call \`controller.onChange()\`
- Native: map the result from Expo Document Picker, Expo Image Picker, or your preferred picker to \`FileValue\`
- Send one \`FileValue | null\` in single mode, or a \`FileValue[]\` after \`multiple()\`
- The application owns previews and temporary object-URL cleanup; FormBridge owns form state and schema validation

The interactive examples above deliberately pass \`accept\`, \`multiple\`, and picker behavior to the application-owned component so the UI visibly matches the schema configuration.`,
    },
    {
      id: 'fb-file-recipes',
      title: 'Recipes',
      content: `Patterns that showcase file-specific strengths.

**Avatar with preview**

${FENCE}tsx Avatar.tsx
const schema = {
  avatar: field.file('Avatar')
    .accept(['image/jpeg', 'image/png'])
    .maxSize(5 * 1024 * 1024)
    .preview(120)
    .required('Please upload a photo.'),
}
${FENCE}

**Mobile document capture**

${FENCE}tsx IdentityCard.tsx
const schema = {
  identityCard: field.file('Identity card')
    .accept(['image/jpeg', 'image/png', 'application/pdf'])
    .source('documents')
    .withBase64()
    .maxSize(10 * 1024 * 1024),
}
${FENCE}

**Multi-attachment with drag zone**

${FENCE}tsx Attachments.tsx
const schema = {
  attachments: field.file('Attachments')
    .multiple(5)
    .accept(['application/pdf', 'image/png'])
    .dragLabel('Drop files here or click to browse'),
}
${FENCE}

**Optimized product media**

${FENCE}tsx ProductMedia.tsx
const schema = {
  productPhotos: field.file('Product photos')
    .accept(['image/jpeg', 'image/png', 'video/mp4'])
    .resize(1600, 1600, 0.85)
    .allowVideo()
    .multiple(10),
}
${FENCE}

**Click-only (no drag)**

${FENCE}tsx DocumentsOnly.tsx
const schema = {
  documents: field.file('Documents')
    .accept(['application/pdf'])
    .noDragDrop(),
}
${FENCE}`,
    },
  ],
};

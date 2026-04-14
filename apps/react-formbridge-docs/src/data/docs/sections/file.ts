import type { LibraryDoc } from './../../../types/index';
import { buildMethodsTable } from '../constants';

const FILE_METHODS_TABLE = buildMethodsTable([
  ['`label(text)`', '`text: string`', 'Sets the field label rendered above the uploader.'],
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
    'Native-only: which picker to open. `all` (default) shows an action sheet so the user can choose. Web ignores this since the browser file dialog handles all sources.',
  ],
  [
    '`withBase64()`',
    '`() => this`',
    'Requests base64 encoding alongside the file payload — needed for upload APIs that expect inline payloads instead of multipart streams.',
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
    'Conditional visibility rules. Same shape as the BaseFieldBuilder helpers — show the uploader only when another field matches a value, is truthy/falsy, or matches any of several pairs.',
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
- Platform differences are handled by the renderer — the schema keeps the business contract`,
  codeTabs: [
    {
      filename: 'File.web.tsx',
      lang: 'tsx',

      code: `const schema = {
  avatar: field.file('Avatar')
    .accept(['image/jpeg','image/png'])
    .maxSize(5 * 1024 * 1024)
    .preview(120)
    .required('Please upload a photo.'),
}`,
    },
    {
      filename: 'File.native.tsx',
      lang: 'tsx',
      code: `const schema = {
  identityCard: field.file('Identity card')
    .accept(['image/jpeg', 'image/png', 'application/pdf'])
    .source('documents')
    .withBase64()
    .maxSize(10 * 1024 * 1024),
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

Static presets — shortcuts that pre-configure common upload flows:
${FILE_PRESETS_TABLE}

Base-builder relationship:
- See [Base field builder](/docs/base-field-builder) for the shared surface most other builders inherit
- \`field.file()\` ships its own conditional helpers (\`visibleWhen\`, \`requiredWhen\`, \`disabledWhen\`, \`resetOnHide\`, …) that mirror the BaseFieldBuilder shape, so it integrates with the same conditional logic as every other field
- It does **not** expose \`render()\`, \`transform()\`, or the value-coercion helpers because it does not extend the full \`BaseFieldBuilder\` surface`,
    },
    {
      id: 'fb-file-recipes',
      title: 'Recipes',
      content: `Patterns that showcase file-specific strengths:
- Avatar with preview → \`field.file('Avatar').accept(['image/jpeg', 'image/png']).maxSize(5 * 1024 * 1024).preview(120).required('Please upload a photo.')\`
- Mobile document capture → \`field.file('Identity card').accept(['image/jpeg', 'image/png', 'application/pdf']).source('documents').withBase64().maxSize(10 * 1024 * 1024)\`
- Multi-attachment with drag zone → \`field.file('Attachments').multiple(5).accept(['application/pdf', 'image/png']).dragLabel('Drop files here or click to browse')\`
- Optimized product media → \`field.file('Product photos').accept(['image/jpeg', 'image/png', 'video/mp4']).resize(1600, 1600, 0.85).allowVideo().multiple(10)\`
- Click-only (no drag) → \`field.file('Documents').accept(['application/pdf']).noDragDrop()\``,
    },
  ],
};

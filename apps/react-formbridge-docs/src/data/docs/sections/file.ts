import type { LibraryDoc } from './../../../types/index';

export const fileSection: LibraryDoc['sections'][number] = {
  id: 'fb-file',
  title: 'field.file()',
  content: `File upload builder for documents, media, and attachments. This is the only builder that does **not** extend \`BaseFieldBuilder\`.

- Has its own upload-focused fluent API: \`accept()\`, \`maxSize()\`, \`multiple()\`, \`preview()\`, \`source()\`, \`resize()\`
- \`behavior()\`, \`render()\`, \`transform()\`, and conditional helpers are not available on this builder
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
      title: 'Props & defaults',
      content: `This builder has its own upload-focused fluent API rather than the full \`BaseFieldBuilder\` surface.

Available methods on the file builder:
- \`required(message?)\` marks file selection as mandatory
- \`hint(text)\` sets helper copy
- \`disabled(value = true)\` disables the uploader
- \`hidden(value = true)\` hides the uploader
- \`accept(types)\` restricts accepted MIME types
- \`maxSize(bytes)\` limits file size
- \`multiple(max = 10)\` enables multi-file mode and sets the maximum file count
- \`preview(height = 160)\` enables image previews and sets preview height
- \`source(type)\` chooses \`'gallery'\`, \`'camera'\`, \`'documents'\`, or \`'all'\`
- \`withBase64()\` requests base64 output
- \`resize(maxWidth, maxHeight, quality = 0.9)\` resizes images before storage
- \`allowVideo()\` allows video files
- \`noDragDrop()\` disables drag and drop on web
- \`dragLabel(label)\` customizes the web dropzone label
- \`_build()\` returns the final upload descriptor; it is public today but normally consumed by the runtime

Defaults:
- defaultValue is \`null\` for single-file mode, or \`[]\` after calling \`multiple()\`
- accepted types default to any file type
- drag & drop is enabled on web by default
- file previews are off by default

Not part of this builder:
- \`behavior()\`, \`render()\`, \`transform()\`, and the conditional helpers are not exposed here because \`field.file()\` does not extend \`BaseFieldBuilder\``,
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

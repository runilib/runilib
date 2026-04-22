import type { LibraryDoc } from './../../../types/index';
import {
  BASE_BUILDER_METHOD_EXAMPLES,
  BASE_BUILDER_METHODS,
  STRING_BUILDER_METHOD_EXAMPLES,
  STRING_BUILDER_METHODS,
} from '../constants';

export const builderBasicsSection: LibraryDoc['sections'][number] = {
  id: 'fb-builder-basics',
  title: 'Builder basics',
  content: `Most builders share the same fluent inheritance tree, so the quickest way to read the API is to start with the common base surface and then add the builder-specific methods.

${BASE_BUILDER_METHODS}

${STRING_BUILDER_METHODS}

Special cases:

| Builder | Extends base with | Notes |
| --- | --- | --- |
| \`field.select()\` / \`field.radio()\` | \`options(...)\`, \`optionsFrom(...)\`, \`searchable(...)\` | Picker-style builders |
| \`field.phone()\` | \`defaultCountry()\`, \`storeE164()\`, country-aware phone helpers | Extends base directly |
| \`field.file()\` | Upload-focused surface | Main exception - does **not** expose \`render()\`, \`transform()\`, or the conditional helpers from \`BaseFieldBuilder\` |`,
  subsections: [
    {
      id: 'fb-builder-basics-behavior',
      title: 'Behavior vs styling',
      content: `FormBridge keeps behavior and styling on separate layers. Pick the layer by the **scope** of the change, not the shape of the API:

| Layer | Scope | Where it lives |
| --- | --- | --- |
| Business rules & reusable field behavior | Travels with the field definition everywhere it's rendered | On the builder - \`required()\`, \`validate()\`, \`transform()\`, \`visibleWhen()\`, \`render()\`, etc. |
| Shared visual theme | Applies to every field / form / submit button at once and can react to live state, schema metadata, and platform | \`useFormBridge(schema, { globalDefaults(ctx) })\` |
| One-off styling exceptions | Overrides for a single render, not worth a builder or theme entry | Props on the rendered \`<form.fields.*>\` component |

Per-render styling props exposed on every generated field component:

- **Wrapper**: \`style\` (cross-platform), \`className\` (web only)
- **Slot maps**: \`styles\` (style slot map), \`classNames\` (web class slot map)
- **Slot props forwarding**: \`wrapperProps\`, \`labelProps\`, \`hintProps\`, \`errorProps\`, \`inputProps\`, \`textareaProps\`, \`selectProps\`, \`searchInputProps\`
- **Render-hook escape hatches**: \`renderLabel\`, \`renderHint\`, \`renderError\`, \`renderRequiredMark\`, \`renderPicker\`, \`renderOption\`, \`renderEmpty\`, \`renderLoading\`, \`renderFileIcon\`

Rule of thumb: if the same visual repeats across fields, move it to \`globalDefaults\`. If the rule describes **what** the field is (validation, normalization, visibility), it belongs on the builder. Local component props win over \`globalDefaults\`, so per-render overrides always take precedence.`,
    },
    {
      id: 'fb-builder-basics-recipes',
      title: 'Shared method examples',
      content: `${BASE_BUILDER_METHOD_EXAMPLES}

${STRING_BUILDER_METHOD_EXAMPLES}`,
    },
  ],
};

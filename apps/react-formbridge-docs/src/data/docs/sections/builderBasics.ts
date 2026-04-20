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
      content: `| Layer | Goes where |
| --- | --- |
| Business rules & reusable field behavior | On the builder itself |
| Shared visual theme | \`useFormBridge(schema, { globalDefaults })\` |
| One-off styling exceptions | Rendered field component - \`className\`, \`style\`, \`ui\` on web; \`style\`, \`ui\` on native |`,
    },
    {
      id: 'fb-builder-basics-recipes',
      title: 'Shared method examples',
      content: `${BASE_BUILDER_METHOD_EXAMPLES}

${STRING_BUILDER_METHOD_EXAMPLES}`,
    },
  ],
};

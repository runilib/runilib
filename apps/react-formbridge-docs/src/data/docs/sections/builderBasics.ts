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
- \`field.select()\` and \`field.radio()\` extend the base builder with \`options(...)\`, \`optionsFrom(...)\`, and \`searchable(...)\`
- \`field.phone()\` extends the base builder directly with country-aware phone helpers such as \`defaultCountry()\` and \`storeE164()\`
- \`field.file()\` is the main exception: it uses its own upload-focused builder surface and does not expose the full \`BaseFieldBuilder\` contract such as \`render()\`, \`transform()\`, or the conditional helpers`,
  subsections: [
    {
      id: 'fb-builder-basics-behavior',
      title: 'Behavior vs styling',
      content: `- Put business rules and reusable field behavior in the builder
- Put shared visual theme in \`useFormBridge(schema, { globalConfigs })\`
- Put one-off styling exceptions on the rendered field component via \`className\`, \`style\`, and \`ui\` on web, or \`style\` and \`ui\` on native`,
    },
    {
      id: 'fb-builder-basics-recipes',
      title: 'Shared method examples',
      content: `${BASE_BUILDER_METHOD_EXAMPLES}

${STRING_BUILDER_METHOD_EXAMPLES}`,
    },
  ],
};

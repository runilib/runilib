import type { LibraryDoc } from './../../../types/index';
import { BASE_BUILDER_METHODS } from '../constants';

export const radioSection: LibraryDoc['sections'][number] = {
  id: 'fb-radio',
  title: 'field.radio()',
  content: `Radio-group builder — all options stay visible at once instead of hiding behind a dropdown.

- Same underlying \`SelectFieldBuilder\` as \`field.select()\`, with identical \`options()\`, \`optionsFrom()\`, and \`defaultSelected()\` methods
- Choose radio when the list is short (2–6 items) and every option should be scannable
- Choose \`field.select()\` when there are too many options for inline display`,
  codeTabs: [
    {
      filename: 'Radio.tsx',
      lang: 'tsx',

      code: `const schema = {
  role: field.radio('Role')
    .options(['Admin','Editor','Viewer'])
    .required(),
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-radio-props',
      title: 'Props & defaults',
      content: `- defaultValue is \`''\`
- type is \`radio\`
- Reuses the same \`SelectFieldBuilder\` as \`field.select()\` — all select-specific methods are available (\`options()\`, \`optionsFrom()\`, \`searchable()\`, \`defaultSelected()\`, \`selected()\`)

${BASE_BUILDER_METHODS}`,
    },
    {
      id: 'fb-radio-recipes',
      title: 'Recipes',
      content: `Patterns that showcase radio-specific use cases:
- Billing cadence toggle → \`field.radio('Billing').options([{ label: 'Monthly — $9/mo', value: 'month' }, { label: 'Yearly — $90/yr', value: 'year' }]).defaultSelected('month')\`
- Role picker → \`field.radio('Role').options(['Admin', 'Editor', 'Viewer']).required()\`
- Yes/No confirmation → \`field.radio('Confirm deletion').options([{ label: 'Yes, delete', value: true }, { label: 'No, keep', value: false }]).required()\``,
    },
  ],
};

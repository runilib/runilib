import type { LibraryDoc } from './../../../types/index';
import {
  BASE_FIELD_BUILDER_REFERENCE,
  buildMethodsTable,
  FENCE,
  SELECT_FIELD_BUILDER_REFERENCE,
} from '../constants';

const RADIO_METHODS_TABLE = buildMethodsTable([
  [
    '`options(list)`',
    '`string[] | { label, value }[]`',
    'Loads local options from plain strings or explicit label/value objects.',
  ],
  [
    '`optionsFrom(fetcher, config)`',
    '`fetcher + async config`',
    'Loads remote options with debounce, cache, dependency tracking, and loading state support.',
  ],
  [
    '`searchable(value = true)`',
    '`value?: boolean`',
    'Enables search-oriented radio-picker behavior when a custom picker is used.',
  ],
  [
    '`defaultSelected(valueOrOption)`',
    '`value | option object`',
    'Pre-selects an option by raw value or option object.',
  ],
  [
    '`selected(valueOrOption)`',
    '`value | option object`',
    'Alias for `defaultSelected()` with more explicit wording.',
  ],
  [
    '`oneOf(values, message?)`',
    '`Array<value | option>`',
    'Additional allow-list check layered on top of `options()` — restricts the runtime-accepted values to a narrower subset.',
  ],
  [
    '`notOneOf(values, message?)`',
    '`Array<value | option>`',
    'Deny-list version of `oneOf()`. Rejects specific values even if they remain selectable in the UI.',
  ],
  [
    '`disallowPlaceholder(message?)`',
    '`message?: string`',
    'Radio-oriented alias for `required()` with the default message `"Please select an option."`.',
  ],
]);

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
      title: 'Defaults, inheritance & field methods',
      content: `- defaultValue is \`''\`
- type is \`radio\`
- Reuses the same \`SelectFieldBuilder\` as \`field.select()\` — all select-specific methods are available (\`options()\`, \`optionsFrom()\`, \`searchable()\`, \`defaultSelected()\`, \`selected()\`)
${BASE_FIELD_BUILDER_REFERENCE}
${SELECT_FIELD_BUILDER_REFERENCE}

Radio-specific methods:
${RADIO_METHODS_TABLE}`,
    },
    {
      id: 'fb-radio-recipes',
      title: 'Recipes',
      content: `Patterns that showcase radio-specific use cases.

**Billing cadence toggle**

${FENCE}tsx Billing.tsx
const schema = {
  billing: field.radio('Billing')
    .options([
      { label: 'Monthly — $9/mo', value: 'month' },
      { label: 'Yearly — $90/yr', value: 'year' },
    ])
    .defaultSelected('month'),
}
${FENCE}

**Role picker**

${FENCE}tsx Role.tsx
const schema = {
  role: field.radio('Role')
    .options(['Admin', 'Editor', 'Viewer'])
    .required(),
}
${FENCE}

**Yes/No confirmation**

${FENCE}tsx Confirmation.tsx
const schema = {
  confirmDeletion: field.radio('Confirm deletion')
    .options([
      { label: 'Yes, delete', value: true },
      { label: 'No, keep', value: false },
    ])
    .required(),
}
${FENCE}`,
    },
  ],
};

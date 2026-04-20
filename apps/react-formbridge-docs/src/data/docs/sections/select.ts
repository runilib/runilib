import type { LibraryDoc } from './../../../types/index';
import { BASE_FIELD_BUILDER_REFERENCE, buildMethodsTable, FENCE } from '../constants';

const SELECT_METHODS_TABLE = buildMethodsTable([
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
    'Enables search-oriented picker behavior.',
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
    'Additional allow-list check on top of `options()`. Useful when the option list is broader than what the current form should actually accept (e.g. gating promo tiers by user role).',
  ],
  [
    '`notOneOf(values, message?)`',
    '`Array<value | option>`',
    'Deny-list version of `oneOf()` - rejects a subset of values even if they exist in `options()`.',
  ],
  [
    '`disallowPlaceholder(message?)`',
    '`message?: string`',
    'Shorthand for `required()` with a select-oriented default message (`"Please select an option."`). Use it when the placeholder row is visible but must not be submitted.',
  ],
]);

export const selectSection: LibraryDoc['sections'][number] = {
  id: 'fb-select',
  title: 'field.select()',
  content: `Single-choice picker for finite option lists.

- Use \`options(list)\` for local options
- Use \`optionsFrom(fetcher, config)\` for remote datasets
- Add \`searchable()\` when a richer lookup experience is needed
- Use \`defaultSelected(...)\` / \`selected(...)\` when the form should open on a meaningful choice instead of an empty placeholder`,
  codeTabs: [
    {
      filename: 'Select.web.tsx',
      lang: 'tsx',

      code: `const schema = {
  workspace: field.select('Workspace')
    .options([
      { label: 'Operations workspace', value: 'ops' },
      { label: 'Revenue cockpit', value: 'revenue' },
      { label: 'Support command center', value: 'support' },
    ])
    .defaultSelected('revenue')
    .required(),
}`,
    },
    {
      filename: 'Select.native.tsx',
      lang: 'tsx',
      code: `const schema = {
  seatPack: field.select('Seat pack')
    .options([
      { label: 'Starter · 5 seats', value: 5 },
      { label: 'Growth · 12 seats', value: 12 },
      { label: 'Scale · 25 seats', value: 25 },
    ])
    .defaultSelected(12),
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-select-async-config',
      title: 'optionsFrom config',
      content: `- \`key\`
- \`cacheTtl\` (default \`60000\`)
- \`debounce\` (default \`300\`)
- \`minChars\` (default \`0\`)
- \`dependsOn\` (default \`[]\`)
- \`initialOptions\` (default \`[]\`)
- \`fetchOnMount\` (default \`true\`)
- \`keepPreviousOptions\` (default \`true\`)
- \`preserveOnError\` (default \`true\`)`,
    },
    {
      id: 'fb-select-custom-picker',
      title: 'Custom picker modal',
      content: `Need a custom modal, bottom sheet, command palette, or searchable dialog instead of the built-in picker? Pass \`renderPicker\`.

- Works for local options and \`optionsFrom(...)\`
- Works per rendered field through \`<fields.city renderPicker={renderPicker} />\`
- If the built-in trigger itself should disappear too, keep the same select schema field and move to \`form.fieldController(name)\`

\`\`\`tsx
const schema = {
  city: field
    .select('City')
    .optionsFrom(fetchCities, {
      key: 'city-search',
      debounce: 250,
      minChars: 2,
    })
    .searchable(),
}

const form = useFormBridge(schema)

<form.Form onSubmit={save}>
  <form.fields.city
    renderPicker={({
        open,
        search,
        setSearch,
        options,
        loading,
        error,
        triggerLabel,
        closePicker,
        selectOption,
      }) =>
        open ? (
          <CityLookupModal
            title={triggerLabel}
            query={search}
            loading={loading}
            error={error}
            items={options}
            onQueryChange={setSearch}
            onClose={closePicker}
            onSelect={(option) => selectOption(option)}
          />
        ) : null}
  />
</form.Form>
\`\`\`

The \`renderPicker\` context gives you: \`open\`, \`search\`, \`setSearch\`, \`clearSearch\`, \`options\`, \`loading\`, \`error\`, \`selectedOption\`, \`triggerLabel\`, \`openPicker\`, \`closePicker\`, and \`selectOption\`. That makes it easy to plug the same field into a design-system modal on web, a native sheet on mobile, or a fully custom async search experience without replacing the rest of the field API.`,
    },
    {
      id: 'fb-select-props',
      title: 'Defaults, inheritance & field methods',
      content: `- defaultValue is \`''\`
- type is \`select\`
- Selected values are stored as the option \`value\`, so both \`string\` and \`number\` are supported
${BASE_FIELD_BUILDER_REFERENCE}
- String-specific helpers are not available on select fields
- Custom picker UIs are wired through per-field \`renderPicker\` or fully custom \`form.fieldController(name)\` flows

Select-specific methods:
${SELECT_METHODS_TABLE}`,
    },
    {
      id: 'fb-select-recipes',
      title: 'Recipes',
      content: `Patterns that showcase select-specific strengths.

**Preselected workspace**

${FENCE}tsx Workspace.tsx
const WORKSPACE_OPTIONS = [
  { label: 'Operations workspace', value: 'ops' },
  { label: 'Revenue cockpit', value: 'revenue' },
  { label: 'Support command center', value: 'support' },
]

const schema = {
  workspace: field.select('Workspace')
    .options(WORKSPACE_OPTIONS)
    .defaultSelected('revenue')
    .required(),
}
${FENCE}

**Numeric option values**

${FENCE}tsx SeatPack.tsx
const schema = {
  seatPack: field.select('Seat pack')
    .options([
      { label: 'Starter · 5 seats', value: 5 },
      { label: 'Growth · 12 seats', value: 12 },
      { label: 'Scale · 25 seats', value: 25 },
    ])
    .defaultSelected(12),
}
${FENCE}

**Async city search with debounce**

${FENCE}tsx CitySearch.tsx
const schema = {
  city: field.select('City')
    .optionsFrom(fetchCities, {
      key: 'city-search',
      debounce: 250,
      minChars: 2,
    })
    .searchable(),
}
${FENCE}

**Dependent cascading selects**

${FENCE}tsx RegionCascade.tsx
const schema = {
  country: field.select('Country').options(COUNTRIES).required(),
  region: field.select('Region')
    .optionsFrom(fetchRegions, {
      key: 'regions',
      dependsOn: ['country'],
    }),
}
${FENCE}

**Fully custom trigger**

${FENCE}tsx CustomTrigger.tsx
const schema = {
  routingMode: field.select('Routing mode')
    .options(ROUTING_MODES),
}

const form = useFormBridge(schema)
const controller = form.fieldController('routingMode')

<form.Form onSubmit={save}>
  <MyTrigger
    label={controller.value ?? 'Select mode'}
    onClick={controller.openPicker}
  />
  <MyModal
    open={controller.isOpen}
    options={controller.options}
    onSelect={controller.setValue}
    onClose={controller.closePicker}
  />
</form.Form>
${FENCE}`,
    },
  ],
};

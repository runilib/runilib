import type { LibraryDoc } from './../../../types/index';
import { BASE_BUILDER_METHODS } from '../constants';

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
- Works globally through \`useFormBridge(schema, { globalStyles })\`
- Works per schema field through \`behavior(...)\`
- Works per rendered field through \`<fields.city ui={{ renderPicker }} />\`
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
    .searchable()
    .behavior({
      renderPicker: ({
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
        ) : null,
    }),
}
\`\`\`

The \`renderPicker\` context gives you: \`open\`, \`search\`, \`setSearch\`, \`clearSearch\`, \`options\`, \`loading\`, \`error\`, \`selectedOption\`, \`triggerLabel\`, \`openPicker\`, \`closePicker\`, and \`selectOption\`. That makes it easy to plug the same field into a design-system modal on web, a native sheet on mobile, or a fully custom async search experience without replacing the rest of the field API.`,
    },
    {
      id: 'fb-select-props',
      title: 'Props & defaults',
      content: `- defaultValue is \`''\`
- type is \`select\`
- Selected values are stored as the option \`value\`, so both \`string\` and \`number\` are supported
- Inherits base builder methods (see Builder basics) — string methods are not available

Select-specific methods:
- \`options(list)\` — local options from \`string[]\` or \`{ label, value }[]\`
- \`optionsFrom(fetcher, config)\` — remote/async options with debounce, cache, and dependency support
- \`searchable(value = true)\` — enables search-oriented picker UX
- \`defaultSelected(valueOrOption)\` — pre-selects an option by value or \`{ label, value }\` object
- \`selected(valueOrOption)\` — alias for \`defaultSelected\`
- Custom picker UIs are wired through \`behavior({ renderPicker })\` or per-field \`ui.renderPicker\`

${BASE_BUILDER_METHODS}`,
    },
    {
      id: 'fb-select-recipes',
      title: 'Recipes',
      content: `Patterns that showcase select-specific strengths:
- Preselected workspace → \`field.select('Workspace').options(WORKSPACE_OPTIONS).defaultSelected('revenue').required()\`
- Numeric option values → \`field.select('Seat pack').options([{ label: 'Growth · 12 seats', value: 12 }, { label: 'Scale · 25 seats', value: 25 }]).defaultSelected(12)\`
- Async city search with debounce → \`field.select('City').optionsFrom(fetchCities, { key: 'city-search', debounce: 250, minChars: 2 }).searchable()\`
- Dependent cascading selects → \`field.select('Region').optionsFrom(fetchRegions, { key: 'regions', dependsOn: ['country'] })\`
- Fully custom trigger → keep \`field.select(...)\` in the schema, then render your own trigger and modal from \`form.fieldController('routingMode')\``,
    },
  ],
};

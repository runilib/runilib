import type { LibraryDoc } from './../../../types/index';
import { BASE_BUILDER_METHODS } from '../constants';

export const phoneSection: LibraryDoc['sections'][number] = {
  id: 'fb-phone',
  title: 'field.phone()',
  content: `Country-aware phone builder with flag selector, dial codes, format validation, and E.164 storage.

- For a basic phone text input without country metadata, use \`field.tel()\` instead
- The renderer shows a country picker with flags, dial codes, and optional search
- \`storeE164()\` normalizes the output to \`+33612345678\` format for API consumption`,
  codeTabs: [
    {
      filename: 'Phone.tsx',
      lang: 'ts',

      code: `const schema = {
  phone: field.phone('Phone')
    .defaultCountry('FR')
    .preferredCountries(['FR','US','GB'])
    .searchable()
    .showFlag(true)
    .showDialCode(true)
    .storeE164()
    .required(),
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-phone-props',
      title: 'Props & defaults',
      content: `- defaultValue is \`null\`
- type is \`phone\`
- placeholder defaults to \`'Enter phone number'\`
- debounce defaults to \`0\` for immediate formatting feedback
- default country is \`'FR'\`, preferred countries default to \`['FR', 'US', 'GB', 'DE', 'ES']\`
- Inherits base builder methods (see Builder basics)

Phone-specific methods:
- \`defaultCountry(code)\` — initial selected country
- \`preferredCountries(codes)\` — shortlist shown at the top of the country picker
- \`searchable(value = true)\` — enables country search in the picker
- \`showFlag(value = true)\` — renders the country flag
- \`showDialCode(value = true)\` — renders the dial code prefix
- \`storeE164()\` — stores normalized E.164 string instead of the richer phone payload
- \`validateFormat(value = true)\` — enables libphonenumber-based format validation

${BASE_BUILDER_METHODS}`,
    },
    {
      id: 'fb-phone-recipes',
      title: 'Recipes',
      content: `Patterns that showcase phone-specific strengths:
- International signup → \`field.phone('Phone').defaultCountry('FR').preferredCountries(['FR', 'US', 'GB']).searchable().showFlag(true).showDialCode(true)\`
- API-ready E.164 output → \`field.phone('Phone').storeE164().required().validateFormat(true)\`
- US-only customer support → \`field.phone('Phone').defaultCountry('US').preferredCountries(['US']).showDialCode(false).validateFormat()\`
- Disabled display field → \`field.phone('Support line').defaultCountry('US').disabled().hint('Managed by your account team')\``,
    },
  ],
};

import type { LibraryDoc } from './../../../types/index';
import { BASE_BUILDER_METHODS, STRING_BUILDER_METHODS } from '../constants';

export const dateSection: LibraryDoc['sections'][number] = {
  id: 'fb-date',
  title: 'field.date()',
  content: `Date builder with semantic min/max bounds. Stored as a string, validated as a date.

- \`minDate()\` and \`maxDate()\` accept a \`Date\` object or an ISO string
- Inherits string builder methods, so \`pattern()\` and \`transform()\` work for edge cases
- The renderer adapts per platform (native date picker on mobile, input on web)`,
  codeTabs: [
    {
      filename: 'Date.web.tsx',
      lang: 'tsx',

      code: `const schema = {
  startDate: field.date('Start date')
    .required()
    .minDate(new Date(), 'Choose a future date.'),
}`,
    },
    {
      filename: 'Date.native.tsx',
      lang: 'tsx',
      code: `const schema = {
  dateOfBirth: field.date('Date of birth')
    .maxDate('2008-01-01', 'You must be at least 18 years old.'),
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-date-props',
      title: 'Props & defaults',
      content: `- defaultValue is \`''\`
- type is \`date\`
- Inherits all base and string builder methods (see Builder basics)

Date-specific methods:
- \`minDate(Date | string, message?)\` — lower bound (e.g. "no past dates")
- \`maxDate(Date | string, message?)\` — upper bound (e.g. "must be at least 18")

${BASE_BUILDER_METHODS}

${STRING_BUILDER_METHODS}`,
    },
    {
      id: 'fb-date-recipes',
      title: 'Recipes',
      content: `Patterns that showcase date-specific strengths:
- Future-only booking → \`field.date('Start date').required().minDate(new Date(), 'Choose a future date.')\`
- Age gate (18+) → \`field.date('Date of birth').maxDate('2008-01-01', 'You must be at least 18 years old.')\`
- Windowed campaign → \`field.date('Campaign end').minDate('2026-04-01').maxDate('2026-12-31')\`
- Cross-field date range → \`field.date('End date').validate((v, all) => v > all.startDate ? null : 'End date must be after start date.')\``,
    },
  ],
};

import type { LibraryDoc } from './../../../types/index';
import {
  BASE_FIELD_BUILDER_REFERENCE,
  buildMethodsTable,
  STRING_FIELD_BUILDER_REFERENCE,
} from '../constants';

const DATE_METHODS_TABLE = buildMethodsTable([
  [
    '`minDate(date, message?)`',
    '`Date | string`',
    'Sets a lower date bound such as "no past dates" (inclusive — same day is allowed).',
  ],
  [
    '`maxDate(date, message?)`',
    '`Date | string`',
    'Sets an upper date bound such as "must be at least 18 years old" (inclusive).',
  ],
  [
    '`before(date, message?)`',
    '`Date | string | FieldReference`',
    'Requires the value to be **strictly before** another date. Accepts a literal date or a `ref()` to another date field — great for `startDate.before(ref(\'endDate\'))` style rules.',
  ],
  [
    '`after(date, message?)`',
    '`Date | string | FieldReference`',
    'Requires the value to be **strictly after** another date. Also accepts a `ref()` so you can express cross-field ordering without `superRefine`.',
  ],
  [
    '`between(start, end, message?)`',
    '`Date | string | number`',
    'Requires the value to fall inside `[start, end]` inclusively. Takes literals only (not refs) — use `before()` + `after()` for cross-field windows.',
  ],
  [
    '`past(message?)`',
    '`message?: string`',
    'Requires the value to be in the past, evaluated at validation time. Empty values are ignored so you can still combine with `required()` for the presence check.',
  ],
  [
    '`future(message?)`',
    '`message?: string`',
    'Requires the value to be in the future, evaluated at validation time. Useful for "start in the future" rules on scheduling forms.',
  ],
  [
    '`minAge(age, message?)`',
    '`age: number`',
    'Age gate: requires the date of birth to correspond to **at least** `age` years, with month/day awareness so people born yesterday are not prematurely aged up.',
  ],
  [
    '`maxAge(age, message?)`',
    '`age: number`',
    'Upper age cap based on date of birth, evaluated the same way as `minAge()`.',
  ],
]);

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
      title: 'Defaults, inheritance & field methods',
      content: `- defaultValue is \`''\`
- type is \`date\`
${BASE_FIELD_BUILDER_REFERENCE}
${STRING_FIELD_BUILDER_REFERENCE}

Date-specific methods:
${DATE_METHODS_TABLE}`,
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

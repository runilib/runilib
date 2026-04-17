import type { LibraryDoc } from './../../../types/index';
import { BASE_FIELD_BUILDER_REFERENCE, buildMethodsTable, FENCE } from '../constants';

const NUMBER_METHODS_TABLE = buildMethodsTable([
  [
    '`min(value, message?)`',
    '`value: number`',
    'Sets the minimum accepted numeric value.',
  ],
  [
    '`max(value, message?)`',
    '`value: number`',
    'Sets the maximum accepted numeric value.',
  ],
  [
    '`positive(message?)`',
    '`message?: string`',
    'Requires a value strictly greater than zero.',
  ],
  [
    '`nonNegative(message?)`',
    '`message?: string`',
    'Requires a value greater than or equal to zero.',
  ],
  [
    '`integer(message?)`',
    '`message?: string`',
    'Restricts the value to whole numbers only.',
  ],
  [
    '`gt(value, message?)`',
    '`value: number`',
    'Strict greater-than check against a static number.',
  ],
  [
    '`gte(value, message?)`',
    '`value: number`',
    'Greater-than-or-equal check against a static number (inclusive lower bound).',
  ],
  [
    '`lt(value, message?)`',
    '`value: number`',
    'Strict less-than check against a static number.',
  ],
  [
    '`lte(value, message?)`',
    '`value: number`',
    'Less-than-or-equal check against a static number (inclusive upper bound).',
  ],
  [
    '`between(min, max, message?)`',
    '`min: number, max: number`',
    'Requires the value to fall inside `[min, max]` (both bounds inclusive).',
  ],
  [
    '`multipleOf(value, message?)`',
    '`value: number`',
    'Requires the value to be an exact multiple of another number. Throws a helper message if called with `value <= 0`.',
  ],
  [
    '`greaterThan(valueOrRef, message?)`',
    '`number | string | FieldReference`',
    'Cross-field version of `gt()`. Accepts another field name or a `ref()` path so you can enforce rules like `maxPrice > minPrice`.',
  ],
  [
    '`lowerThan(valueOrRef, message?)`',
    '`number | string | FieldReference`',
    "Cross-field version of `lt()`. Accepts another field name or a `ref()` path, e.g. `ref('maxQuantity')`.",
  ],
  [
    '`step(stepValue, message?)`',
    '`stepValue: number`',
    'Requires the value to be a clean multiple of the provided step. Thin alias over `multipleOf()` with a step-oriented default message.',
  ],
]);

export const numberSection: LibraryDoc['sections'][number] = {
  id: 'fb-number',
  title: 'field.number()',
  content: `Numeric builder that stores a real number, not a string.

- Numeric helpers live directly on the builder: \`positive()\`, \`nonNegative()\`, \`integer()\`, \`step()\`
- \`min()\` / \`max()\` set numeric bounds (not character length like on string builders)
- Inherits base builder methods but not string builder methods`,
  codeTabs: [
    {
      filename: 'Number.tsx',
      lang: 'tsx',

      code: `const schema = {
  quantity: field.number('Quantity')
    .required()
    .positive()
    .integer()
    .step(5, 'Order in increments of 5'),
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-number-props',
      title: 'Defaults, inheritance & field methods',
      content: `- defaultValue is \`0\`
- type is \`number\`
${BASE_FIELD_BUILDER_REFERENCE}
- String-specific helpers do not apply here; \`min()\` and \`max()\` operate on real numeric values

Number-specific methods:
${NUMBER_METHODS_TABLE}`,
    },
    {
      id: 'fb-number-recipes',
      title: 'Recipes',
      content: `Patterns that showcase number-specific strengths.

**Batch order in increments**

${FENCE}tsx BatchQuantity.tsx
const schema = {
  quantity: field.number('Quantity')
    .required()
    .integer()
    .positive()
    .step(5, 'Order in multiples of 5'),
}
${FENCE}

**Percentage slider**

${FENCE}tsx Discount.tsx
const schema = {
  discount: field.number('Discount %')
    .min(0)
    .max(100)
    .nonNegative()
    .defaultValue(0),
}
${FENCE}

**Seat limit with business rule**

${FENCE}tsx Seats.tsx
const schema = {
  seats: field.number('Seats')
    .integer()
    .positive()
    .validate((value) =>
      value <= 500
        ? null
        : 'Maximum 500 seats per workspace.',
    ),
}
${FENCE}

**Price with two-decimal step**

${FENCE}tsx UnitPrice.tsx
const schema = {
  unitPrice: field.number('Unit price')
    .nonNegative()
    .step(0.01, 'Use two decimal places.'),
}
${FENCE}`,
    },
  ],
};

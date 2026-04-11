import type { LibraryDoc } from './../../../types/index';
import { BASE_BUILDER_METHODS } from '../constants';

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
      title: 'Props & defaults',
      content: `- defaultValue is \`0\`
- type is \`number\`

Number-specific methods:
- \`min(value, message?)\` — minimum accepted numeric value
- \`max(value, message?)\` — maximum accepted numeric value
- \`positive(message?)\` — strictly positive (> 0)
- \`nonNegative(message?)\` — zero or above (>= 0)
- \`integer(message?)\` — whole numbers only
- \`step(stepValue, message?)\` — value must be a clean multiple of the step

${BASE_BUILDER_METHODS}`,
    },
    {
      id: 'fb-number-recipes',
      title: 'Recipes',
      content: `Patterns that showcase number-specific strengths:
- Batch order in increments → \`field.number('Quantity').required().integer().positive().step(5, 'Order in multiples of 5')\`
- Percentage slider → \`field.number('Discount %').min(0).max(100).nonNegative().defaultValue(0)\`
- Seat limit with business rule → \`field.number('Seats').integer().positive().validate((v) => v <= 500 ? null : 'Maximum 500 seats per workspace.')\`
- Price with two-decimal step → \`field.number('Unit price').nonNegative().step(0.01, 'Use two decimal places.')\``,
    },
  ],
};

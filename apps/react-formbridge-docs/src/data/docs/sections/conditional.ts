import type { LibraryDoc } from './../../../types/index';
import { CONDITIONAL_SURFACE } from '../constants';

export const conditionalSection: LibraryDoc['sections'][number] = {
  id: 'fb-conditional',

  title: 'Conditional logic',
  content: `Conditional logic lives on the builders themselves, not in ad-hoc component branches.

- This keeps business rules close to the field contract
- The evaluated result is exposed through \`visibility\`, so the UI can still react outside the field renderer when needed`,
  code: {
    filename: 'Conditional.tsx',
    lang: 'tsx',

    code: `const schema = {
  accountType: field.radio('Account type')
    .options(['personal', 'business'])
    .required(),
  companyName: field.text('Company name')
    .visibleWhen('accountType', 'business')
    .requiredWhen('accountType', 'business')
    .clearOnHide(),
  vatNumber: field.text('VAT number')
    .visibleWhen('accountType', 'business')
    .disabledWhen('accountType', 'personal'),
}`,
  },
  subsections: [
    {
      id: 'fb-conditional-rules',
      title: 'Visibility',
      content: `${CONDITIONAL_SURFACE}`,
    },
    {
      id: 'fb-conditional-required',
      title: 'Required',
      content: `Required-state helpers inside the same surface:
- \`requiredWhen(fieldOrPredicate, value?)\`
- \`requiredWhenAny(pairs)\``,
    },
    {
      id: 'fb-conditional-disabled',
      title: 'Disabled',
      content: `Disabled-state helper inside the same surface:
- \`disabledWhen(fieldOrPredicate, value?)\``,
    },
    {
      id: 'fb-conditional-reset',
      title: 'Reset on hide',
      content: `- \`resetOnHide()\`
- \`clearOnHide()\`
- \`keepOnHide()\`

Default behavior: hidden fields resetFields to their default value unless you opt into \`clearOnHide()\` or \`keepOnHide()\`.`,
    },
  ],
};

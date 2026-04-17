import type { LibraryDoc } from './../../../types/index';
import {
  CONDITIONAL_DISABLED_SURFACE,
  CONDITIONAL_ON_HIDE_SURFACE,
  CONDITIONAL_REQUIRED_SURFACE,
  CONDITIONAL_VISIBILITY_SURFACE,
} from '../constants';

export const conditionalSection: LibraryDoc['sections'][number] = {
  id: 'fb-conditional',

  title: 'Conditional logic',
  content: `Conditional logic lives on the builders themselves, not in ad-hoc component branches.

- Business rules stay attached to the field contract, next to its label, validation and default value
- The evaluated state is re-computed on every form change and exposed through the \`visibility\` map, so the UI can still react outside the field renderer when needed
- All helpers compose: multiple \`visibleWhen*\` / \`requiredWhen*\` / \`disabledWhen\` calls on the same builder combine with **AND** logic
- The \`*Any(pairs)\` variants give you **OR** logic over a short list of field/value pairs; reach for a predicate when the rule spans more than a couple of fields
- When a field becomes hidden, its value follows the on-hide policy (default: reset to the builder default)`,
  code: {
    filename: 'Conditional.tsx',
    lang: 'tsx',

    code: `const schema = {
  accountType: field.radio('Account type')
    .options(['personal', 'business'])
    .required(),
  companyName: field.text('Company name')
    .visibleAndRequiredWhen('accountType', 'business')
    .clearOnHide(),
  vatNumber: field.text('VAT number')
    .visibleWhen('accountType', 'business')
    .disabledWhen((values) => !values.companyName)
    .clearOnHide(),
  referral: field.text('Referral code')
    .visibleWhenAny([
      ['source', 'friend'],
      ['source', 'partner'],
    ])
    .keepOnHide(),
}`,
  },
  subsections: [
    {
      id: 'fb-conditional-rules',
      title: 'Visibility',
      content: CONDITIONAL_VISIBILITY_SURFACE,
    },
    {
      id: 'fb-conditional-required',
      title: 'Required',
      content: CONDITIONAL_REQUIRED_SURFACE,
    },
    {
      id: 'fb-conditional-disabled',
      title: 'Disabled',
      content: CONDITIONAL_DISABLED_SURFACE,
    },
    {
      id: 'fb-conditional-reset',
      title: 'Hidden value behavior',
      content: CONDITIONAL_ON_HIDE_SURFACE,
    },
  ],
};

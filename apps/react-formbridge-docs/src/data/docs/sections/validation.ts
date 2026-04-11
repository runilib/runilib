import type { LibraryDoc } from './../../../types/index';
import {
  RESOLVER_SHARED_OPTIONS_SURFACE,
  VALIDATION_RUNTIME_SURFACE,
} from '../constants';

export const validationSection: LibraryDoc['sections'][number] = {
  id: 'fb-validation',
  title: 'Validation',
  content: `Validation in react-formbridge happens in two layers.

- Field builders cover most everyday rules directly in the schema: \`required\`, \`min\`, \`max\`, \`pattern/patterns\`, cross-field equality with \`matches/sameAs\`, number helpers, \`mustBeTrue\`, \`validate(fn)\`, and more.
- A schema-level \`resolver\` lets an external validator such as Zod or Yup own the final result shape.
- Defaults today: \`validateOn='onBlur'\`, \`revalidateOn='onChange'\`.`,
  subsections: [
    {
      id: 'fb-validation-field-level',
      title: 'Field-level validation',
      content: `Use builder methods when the rule belongs to the field itself: required inputs, length or numeric constraints, agreement toggles, file limits, phone formatting, and cross-field checks such as confirm password.

${VALIDATION_RUNTIME_SURFACE}`,
    },
    {
      id: 'fb-validation-resolver',
      title: 'Resolver validation',
      content: `Use a resolver when you already own a domain schema elsewhere in the app. The resolver returns \`{ values, errors }\` and becomes the validation source of truth for the form runtime.

${RESOLVER_SHARED_OPTIONS_SURFACE}`,
    },
    {
      id: 'fb-validation-triggers',
      title: 'Trigger matrix',
      content: `Accepted validation trigger values:
- \`'onBlur'\` — validate after blur
- \`'onChange'\` — validate on every change
- \`'onSubmit'\` — validate only on submit
- \`'onTouched'\` — validate after blur, then on every subsequent change

Runtime defaults:
- \`validateOn = 'onBlur'\`
- \`revalidateOn = 'onChange'\``,
    },
  ],
};

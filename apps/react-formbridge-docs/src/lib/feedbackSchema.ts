import { createSchema, field, type SchemaValues } from '@runilib/react-formbridge';

import { FEEDBACK_TYPE_OPTIONS } from './feedback';

export const FEEDBACK_SCHEMA = createSchema({
  feedbackType: field
    .select('Feedback type')
    .options(
      FEEDBACK_TYPE_OPTIONS.map((option) => ({
        label: option.label,
        value: option.value,
      })),
    )
    .defaultValue('general')
    .required()
    .hint('Pick the closest lane so the report starts in the right place.'),
  subject: field
    .text('Subject')
    .required()
    .min(4, 'The subject is too short.')
    .max(160)
    .placeholder('Short summary of your feedback')
    .hint('A short title makes triage much faster.'),
  area: field
    .text('Area')
    .max(160)
    .placeholder('Documentation, validation adapters, wizard flows...')
    .hint('Optional, but helpful when the topic is very specific.'),
  relevantPage: field
    .text('Relevant page')
    .max(300)
    .placeholder('/docs/useformbridge or full URL')
    .hint('We prefill this when you open feedback from a docs page.'),
  name: field.text('Name').max(120).placeholder('Optional'),
  email: field
    .email('Contact email')
    .max(160)
    .placeholder('name@company.com')
    .hint('Optional. Leave it if you want a follow-up.'),
  message: field
    .textarea('Details')
    .required()
    .min(20, 'Please add a few more details before sending.')
    .max(3000)
    .placeholder('What did you try, what felt off, and what would make this better?')
    .hint('The more concrete the context, the easier it is to act on.'),
  expectedBehavior: field
    .textarea('Expected behavior')
    .visibleAndRequiredWhen('feedbackType', 'bug')
    .max(3000)
    .clearOnHide()
    .placeholder('What should have happened?')
    .hint('Keep it short and observable.'),
  actualBehavior: field
    .textarea('Actual behavior')
    .visibleAndRequiredWhen('feedbackType', 'bug')
    .max(3000)
    .clearOnHide()
    .placeholder('What actually happened?')
    .hint('Include error copy, odd state, or incorrect result.'),
  reproductionSteps: field
    .textarea('Steps to reproduce')
    .visibleAndRequiredWhen('feedbackType', 'bug')
    .max(3000)
    .clearOnHide()
    .placeholder('1. Go to...\n2. Click...\n3. Observe...')
    .hint('A tiny repro is worth a lot.'),
  contactConsent: field
    .checkbox('You can contact me if follow-up details would help.')
    .hint('Useful if you left a contact email above.'),
});

export type FeedbackFormValues = SchemaValues<typeof FEEDBACK_SCHEMA>;

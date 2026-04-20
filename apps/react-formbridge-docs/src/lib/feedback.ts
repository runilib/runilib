import { siteConfig } from '@/lib/site';

export type FeedbackType = 'general' | 'docs' | 'feature' | 'bug' | 'question';

export interface FeedbackSubmissionValues {
  feedbackType: FeedbackType;
  subject: string;
  area: string;
  relevantPage: string;
  name: string;
  email: string;
  message: string;
  expectedBehavior: string;
  actualBehavior: string;
  reproductionSteps: string;
  contactConsent: boolean;
}

export const FEEDBACK_TO_EMAIL = 'akladekouassi@gmail.com';

export const FEEDBACK_TYPE_OPTIONS: Array<{
  value: FeedbackType;
  label: string;
  description: string;
}> = [
  {
    value: 'general',
    label: 'General feedback',
    description: 'Share what feels good, rough, or missing.',
  },
  {
    value: 'docs',
    label: 'Docs issue',
    description: 'Call out confusing copy, stale examples, or missing guides.',
  },
  {
    value: 'feature',
    label: 'Feature request',
    description: 'Suggest a missing API, field builder, or workflow.',
  },
  {
    value: 'bug',
    label: 'Bug report',
    description: 'Describe incorrect runtime, typing, or validation behavior.',
  },
  {
    value: 'question',
    label: 'Question',
    description: 'Ask for clarification around the API or product direction.',
  },
];

function getFeedbackTypeLabel(feedbackType: FeedbackType) {
  return (
    FEEDBACK_TYPE_OPTIONS.find((option) => option.value === feedbackType)?.label ??
    'Feedback'
  );
}

export function normalizeFeedbackType(value: string | number): FeedbackType {
  return FEEDBACK_TYPE_OPTIONS.some((option) => option.value === value)
    ? (value as FeedbackType)
    : 'general';
}

export function normalizeRelevantPage(value: string | null | undefined) {
  if (!value) return '';

  const trimmedValue = value.trim();

  if (!trimmedValue) return '';

  if (trimmedValue.startsWith('http://') || trimmedValue.startsWith('https://')) {
    return trimmedValue;
  }

  if (trimmedValue.startsWith('/')) {
    return trimmedValue;
  }

  return `/${trimmedValue.replace(/^\/+/, '')}`;
}

export function toAbsolutePageUrl(value: string) {
  if (!value.trim()) return '';

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return new URL(value, siteConfig.url).toString();
}

export function buildFeedbackEmailSubject(values: FeedbackSubmissionValues) {
  return `[${getFeedbackTypeLabel(values.feedbackType)}] ${values.subject.trim()}`;
}

export function buildFeedbackEmailText(values: FeedbackSubmissionValues) {
  const relevantPage = toAbsolutePageUrl(values.relevantPage);

  const sections = [
    `Feedback type: ${getFeedbackTypeLabel(values.feedbackType)}`,
    `Area: ${values.area.trim() || 'Not specified'}`,
    `Relevant page: ${relevantPage || 'Not specified'}`,
    `Name: ${values.name.trim() || 'Not specified'}`,
    `Contact email: ${values.email.trim() || 'Not provided'}`,
    `Contact follow-up allowed: ${values.contactConsent ? 'Yes' : 'No'}`,
    '',
    'Details',
    values.message.trim(),
    values.feedbackType === 'bug' && values.expectedBehavior.trim()
      ? ['', 'Expected behavior', values.expectedBehavior.trim()].join('\n')
      : '',
    values.feedbackType === 'bug' && values.actualBehavior.trim()
      ? ['', 'Actual behavior', values.actualBehavior.trim()].join('\n')
      : '',
    values.feedbackType === 'bug' && values.reproductionSteps.trim()
      ? ['', 'Steps to reproduce', values.reproductionSteps.trim()].join('\n')
      : '',
    '',
    `Submitted from: ${siteConfig.url}`,
  ];

  return sections.filter(Boolean).join('\n');
}

export function getInitialFeedbackValues(relevantPage = ''): FeedbackSubmissionValues {
  return {
    actualBehavior: '',
    area: '',
    contactConsent: false,
    email: '',
    expectedBehavior: '',
    feedbackType: 'general',
    message: '',
    name: '',
    relevantPage: normalizeRelevantPage(relevantPage),
    reproductionSteps: '',
    subject: '',
  };
}

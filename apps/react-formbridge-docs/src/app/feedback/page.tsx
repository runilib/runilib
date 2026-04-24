import { FeedbackPage } from '@/components/FeedbackPage';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedback',
  description:
    'Share documentation feedback, bug reports, feature requests, and API questions for react-formbridge.',
  robots: {
    index: false,
    follow: true,
  },
};

interface FeedbackRouteProps {
  readonly searchParams?: Promise<{
    from?: string | string[];
  }>;
}

export default async function FeedbackRoute({ searchParams }: FeedbackRouteProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const fromParam = Array.isArray(resolvedSearchParams.from)
    ? resolvedSearchParams.from[0]
    : resolvedSearchParams.from;

  return <FeedbackPage initialRelevantPage={fromParam ?? ''} />;
}

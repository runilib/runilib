import { getDocsLandingHref } from '@/lib/docs';

import { permanentRedirect } from 'next/navigation';

export default function DocsPage() {
  permanentRedirect(getDocsLandingHref());
}

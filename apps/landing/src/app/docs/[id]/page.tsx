'use client';

import { redirect, useParams } from 'next/navigation';
import { WEBSITE_FEATURES } from '../../../config/features';

export default function DocsLibraryRedirect() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  if (WEBSITE_FEATURES.docs) {
    redirect(id ? `/libraries/${id}` : '/libraries');
  }

  redirect(id ? `/libraries/${id}` : '/libraries');
}

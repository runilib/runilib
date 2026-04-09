'use client';

import { redirect, useParams } from 'next/navigation';
import { WEBSITE_FEATURES } from '../../../config/features';
import { FORM_BRIDGE_DOCS_URL } from '../../../data/libraries';

export default function DocsLibraryRedirect() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  if (id === 'formbridge') {
    redirect(FORM_BRIDGE_DOCS_URL);
  }

  if (WEBSITE_FEATURES.docs) {
    redirect(id ? `/libraries/${id}` : '/libraries');
  }

  redirect(id ? `/libraries/${id}` : '/libraries');
}

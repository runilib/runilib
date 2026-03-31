import type { ReactNode } from 'react';

import styles from './FormExamples.module.css';
import { formatDemoJson } from './shared';

interface FieldVariantFrameProps {
  familyName: string;
  accent: string;
  title: string;
  description: string;
  highlights: string[];
  preview: ReactNode;
  snapshot: unknown;
  submittedLabel?: string | null;
  footer: string;
  children: ReactNode;
}

export function FieldVariantFrame({
  familyName,
  accent,
  title,
  description,
  highlights,
  preview,
  snapshot,
  submittedLabel,
  footer,
  children,
}: FieldVariantFrameProps) {
  return (
    <div className={styles.resolverFrame}>
      <div className={styles.resolverOverview}>
        <span
          className={styles.resolverBadge}
          style={{
            color: accent,
            background: `${accent}14`,
            borderColor: `${accent}2b`,
          }}
        >
          {familyName} variants
        </span>

        <div>
          <h3 className={styles.resolverSummaryTitle}>{title}</h3>
          <p className={styles.resolverSummaryText}>{description}</p>
        </div>

        {submittedLabel ? (
          <div className={styles.successInline}>{submittedLabel}</div>
        ) : null}

        <div className={styles.resolverChips}>
          {highlights.map((item) => (
            <span
              key={item}
              className={styles.resolverChip}
            >
              {item}
            </span>
          ))}
        </div>

        <div className={styles.resolverPreviewGrid}>
          <div className={styles.resolverPreviewCard}>
            <p className={styles.resolverPreviewHeading}>Live preview</p>
            {preview}
          </div>

          <div className={styles.resolverPreviewCard}>
            <p className={styles.resolverPreviewHeading}>Current values</p>
            <pre className={styles.resolverJson}>{formatDemoJson(snapshot)}</pre>
          </div>
        </div>
      </div>

      <div className={styles.resolverComposer}>
        {children}
        <p className={styles.resolverFooter}>{footer}</p>
      </div>
    </div>
  );
}

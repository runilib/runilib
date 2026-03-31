import type { ReactNode } from 'react';

import styles from './FormExamples.module.css';
import { formatDemoJson } from './shared';

interface StylingExampleFrameProps {
  recipeName: string;
  accent: string;
  title: string;
  description: string;
  highlights: string[];
  preview: ReactNode;
  submittedPayload: unknown;
  submittedLabel?: string | null;
  submitError?: string | null;
  footer: string;
  children: ReactNode;
}

export function StylingExampleFrame({
  recipeName,
  accent,
  title,
  description,
  highlights,
  preview,
  submittedPayload,
  submittedLabel,
  submitError,
  footer,
  children,
}: StylingExampleFrameProps) {
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
          {recipeName} styling
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
            <p className={styles.resolverPreviewHeading}>Submitted payload</p>
            <pre className={styles.resolverJson}>
              {submittedPayload
                ? formatDemoJson(submittedPayload)
                : 'Submit the form to inspect the values after the styling layer is applied.'}
            </pre>
          </div>
        </div>
      </div>

      <div className={styles.resolverComposer}>
        {children}
        {submitError ? <p className={styles.errorBox}>{submitError}</p> : null}
        <p className={styles.resolverFooter}>{footer}</p>
      </div>
    </div>
  );
}

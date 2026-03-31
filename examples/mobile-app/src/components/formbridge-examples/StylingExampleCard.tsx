import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { formExampleStyles as s } from './FormExamples.styles';
import { formatDemoJson } from './shared';

interface StylingExampleCardProps {
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

export function StylingExampleCard({
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
}: StylingExampleCardProps) {
  return (
    <View style={s.resolverCard}>
      <View
        style={[
          s.resolverBadge,
          {
            backgroundColor: `${accent}18`,
            borderColor: `${accent}36`,
          },
        ]}
      >
        <Text
          style={[
            s.resolverBadgeText,
            {
              color: accent,
            },
          ]}
        >
          {recipeName} styling
        </Text>
      </View>

      <View>
        <Text style={s.resolverHeading}>{title}</Text>
        <Text style={s.resolverText}>{description}</Text>
      </View>

      {submittedLabel ? (
        <View style={s.successBox}>
          <Text style={s.successText}>{submittedLabel}</Text>
        </View>
      ) : null}

      <View style={s.chipRow}>
        {highlights.map((item) => (
          <View
            key={item}
            style={s.chip}
          >
            <Text style={s.chipText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={s.previewCard}>
        <Text style={s.previewHeading}>Live preview</Text>
        {preview}
      </View>

      <View style={s.payloadCard}>
        <Text style={s.previewHeading}>Submitted payload</Text>
        <Text style={s.payloadCode}>
          {submittedPayload
            ? formatDemoJson(submittedPayload)
            : 'Submit the form to inspect the values after the styling layer is applied.'}
        </Text>
      </View>

      {children}

      {submitError ? (
        <View style={s.errorBox}>
          <Text style={s.errorText}>{submitError}</Text>
        </View>
      ) : null}

      <Text style={s.footerText}>{footer}</Text>
    </View>
  );
}

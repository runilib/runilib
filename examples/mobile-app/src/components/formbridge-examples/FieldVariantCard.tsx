import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { formExampleStyles as s } from './FormExamples.styles';
import { formatDemoJson } from './shared';

interface FieldVariantCardProps {
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

export function FieldVariantCard({
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
}: FieldVariantCardProps) {
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
          {familyName} variants
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
        <Text style={s.previewHeading}>Current values</Text>
        <Text style={s.payloadCode}>{formatDemoJson(snapshot)}</Text>
      </View>

      {children}

      <Text style={s.footerText}>{footer}</Text>
    </View>
  );
}

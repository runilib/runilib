import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { formExampleStyles as s } from './FormExamples.styles';
import { formatDemoJson } from './shared';

interface BridgeExampleCardProps {
  bridgeName: string;
  accent: string;
  title: string;
  description: string;
  highlights: string[];
  preview: ReactNode;
  parsedSubmission: unknown;
  submittedLabel?: string | null;
  submitError?: string | null;
  footer: string;
  children: ReactNode;
}

export function BridgeExampleCard({
  bridgeName,
  accent,
  title,
  description,
  highlights,
  preview,
  parsedSubmission,
  submittedLabel,
  submitError,
  footer,
  children,
}: BridgeExampleCardProps) {
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
          {bridgeName} bridge
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
        <Text style={s.previewHeading}>Parsed payload</Text>
        <Text style={s.payloadCode}>
          {parsedSubmission
            ? formatDemoJson(parsedSubmission)
            : 'Submit the form to inspect the normalized bridge output.'}
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

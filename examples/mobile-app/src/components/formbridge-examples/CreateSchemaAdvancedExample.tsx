import { useState } from 'react';
import { Text, View } from 'react-native';

import { createSchema, field, useFormBridge } from '@/src/demoFormBridge';

import * as Haptics from 'expo-haptics';
import { formExampleStyles as s } from './FormExamples.styles';
import { createNativeFormUi, formatDemoJson, simulateSubmitDelay } from './shared';

const ENVIRONMENT_OPTIONS = [
  { label: 'Staging', value: 'staging' },
  { label: 'Production', value: 'production' },
];

const RISK_OPTIONS = [
  { label: 'Low risk', value: 'low' },
  { label: 'Medium risk', value: 'medium' },
  { label: 'Critical risk', value: 'critical' },
];

const schema = createSchema({
  releaseName: field
    .text()
    .label('Release name')
    .placeholder('Q2 checkout hardening')
    .required('Required')
    .trim(),
  environment: field
    .select()
    .label('Environment')
    .options(ENVIRONMENT_OPTIONS)
    .disallowPlaceholder()
    .required('Required'),
  riskLevel: field
    .select()
    .label('Risk level')
    .options(RISK_OPTIONS)
    .disallowPlaceholder()
    .required('Required'),
  changeTicket: field
    .text()
    .label('Change ticket')
    .placeholder('CHG-4821')
    .required('Required')
    .trim()
    .hint('Async policy rule: CHG-0000 is rejected to simulate a remote gate.'),
  contactEmail: field
    .email()
    .label('On-call email')
    .placeholder('ops@runilib.dev')
    .trim()
    .lowercase(),
  contactPhone: field
    .tel()
    .label('On-call phone')
    .placeholder('+33 6 12 34 56 78')
    .hint('Production launches also require a direct phone contact.'),
  slackChannel: field.text().label('Slack channel').placeholder('#ops-release').trim(),
  pagerDutyService: field
    .text()
    .label('PagerDuty service')
    .placeholder('checkout-primary')
    .trim(),
  maintenanceStart: field
    .date()
    .label('Maintenance start')
    .placeholder('YYYY-MM-DD')
    .visibleWhen('environment', 'production')
    .clearOnHide(),
  maintenanceEnd: field
    .date()
    .label('Maintenance end')
    .placeholder('YYYY-MM-DD')
    .visibleWhen('environment', 'production')
    .clearOnHide(),
  rollbackPlan: field
    .text()
    .label('Rollback plan')
    .placeholder('Shift traffic back to the previous stable build within 10 minutes.')
    .visibleWhen('riskLevel', 'critical')
    .requiredWhen('riskLevel', 'critical')
    .clearOnHide()
    .trim()
    .hint('Shown only for critical launches.'),
  legalReview: field
    .checkbox()
    .label('Requires legal review')
    .hint('Toggles a conditional approver field.'),
  legalApprover: field
    .email()
    .label('Legal approver')
    .placeholder('legal@runilib.dev')
    .visibleWhen('legalReview', true)
    .requiredWhen('legalReview', true)
    .clearOnHide()
    .trim()
    .lowercase(),
})
  .errorMap((issue) =>
    issue.code === 'required' ? 'This launch gate is required.' : undefined,
  )
  .atLeastOne(
    ['contactEmail', 'contactPhone'],
    'Add at least one on-call contact before submitting the release gate.',
  )
  .exactlyOne(
    ['slackChannel', 'pagerDutyService'],
    'Choose exactly one primary escalation path: Slack or PagerDuty.',
  )
  .allOrNone(
    ['maintenanceStart', 'maintenanceEnd'],
    'Provide both maintenance dates or leave both empty.',
  )
  .superRefine((values, context) => {
    if (
      values.riskLevel === 'critical' &&
      String(values.rollbackPlan ?? '').trim().length < 24
    ) {
      context.addIssue({
        path: 'rollbackPlan',
        code: 'rollback_plan_too_short',
        message:
          'Critical launches need a concrete rollback plan with at least 24 characters.',
      });
    }

    if (
      values.environment === 'production' &&
      String(values.contactPhone ?? '').trim().length === 0
    ) {
      context.addIssue({
        path: 'contactPhone',
        code: 'direct_phone_required',
        message: 'Production launches require a direct on-call phone number.',
      });
    }

    const maintenanceStart = String(values.maintenanceStart ?? '').trim();
    const maintenanceEnd = String(values.maintenanceEnd ?? '').trim();

    if (
      maintenanceStart &&
      maintenanceEnd &&
      maintenanceEnd.localeCompare(maintenanceStart) < 0
    ) {
      context.addIssue({
        path: 'maintenanceEnd',
        code: 'invalid_date_range',
        message: 'Maintenance end must be after the start date.',
      });
    }
  })
  .refineAsync(
    async (values) => {
      await simulateSubmitDelay(180);
      return (
        String(values.changeTicket ?? '')
          .trim()
          .toUpperCase() !== 'CHG-0000'
      );
    },
    {
      path: 'changeTicket',
      code: 'reserved_ticket',
      message: 'CHG-0000 is reserved for drills. Use a real change ticket.',
    },
  );

export function CreateSchemaAdvancedExample() {
  const [lastSubmission, setLastSubmission] = useState<Record<string, unknown> | null>(
    null,
  );

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalDefaults: () => createNativeFormUi(),
    persist: {
      key: 'mobile-create-schema-advanced',
      storage: 'local',
    },
  });

  const { Form, fields, state, watchAll } = form;

  const liveValues = watchAll();
  const releaseName = liveValues.releaseName?.trim() || 'Q2 checkout hardening';
  const environmentLabel =
    ENVIRONMENT_OPTIONS.find((item) => item.value === liveValues.environment)?.label ??
    'Pick an environment';
  const riskLabel =
    RISK_OPTIONS.find((item) => item.value === liveValues.riskLevel)?.label ??
    'Pick a risk level';
  const escalationPath = liveValues.slackChannel
    ? `Slack ${String(liveValues.slackChannel)}`
    : liveValues.pagerDutyService
      ? `PagerDuty ${String(liveValues.pagerDutyService)}`
      : 'No escalation path';
  const contactStatus =
    liveValues.contactEmail || liveValues.contactPhone
      ? 'On-call set'
      : 'Missing on-call';
  const gateSignals = [
    Boolean(liveValues.releaseName?.trim()),
    Boolean(liveValues.environment),
    Boolean(liveValues.riskLevel),
    Boolean(liveValues.contactEmail || liveValues.contactPhone),
    Boolean(liveValues.slackChannel || liveValues.pagerDutyService),
  ].filter(Boolean).length;

  return (
    <View style={s.resolverShowcaseCard}>
      <View style={s.resolverHeader}>
        <View style={s.resolverEyebrow}>
          <Text style={s.resolverEyebrowText}>createSchema advanced</Text>
        </View>
        <View>
          <Text style={s.resolverTitle}>Release gate with schema-native validation</Text>
          <Text style={s.resolverSubtitle}>
            This mobile example keeps advanced rules inside `createSchema`: global
            helpers, targeted field issues, async validation, and conditional fields.
          </Text>
        </View>
      </View>

      {lastSubmission ? (
        <View style={s.successBox}>
          <Text style={s.successText}>Launch gate saved for {releaseName}</Text>
        </View>
      ) : null}

      <View style={s.chipRow}>
        {[
          'errorMap()',
          'atLeastOne()',
          'exactlyOne()',
          'allOrNone()',
          'superRefine()',
          'refineAsync()',
        ].map((item) => (
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
        <Text style={s.previewValue}>{releaseName}</Text>
        <Text style={s.previewText}>
          {environmentLabel} · {riskLabel} · {gateSignals}/5 gate signals ready
        </Text>
        <View style={s.chipRow}>
          <View style={s.chip}>
            <Text style={s.chipText}>{contactStatus}</Text>
          </View>
          <View style={s.chip}>
            <Text style={s.chipText}>{escalationPath}</Text>
          </View>
          {liveValues.maintenanceStart && liveValues.maintenanceEnd ? (
            <View style={s.chip}>
              <Text style={s.chipText}>
                {String(liveValues.maintenanceStart)} →{' '}
                {String(liveValues.maintenanceEnd)}
              </Text>
            </View>
          ) : null}
          {liveValues.legalReview ? (
            <View style={s.chip}>
              <Text style={s.chipText}>Legal review enabled</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={s.payloadCard}>
        <Text style={s.previewHeading}>Latest schema snapshot</Text>
        <Text style={s.payloadCode}>{formatDemoJson(lastSubmission ?? liveValues)}</Text>
      </View>

      <Form
        onSubmit={async (values) => {
          await simulateSubmitDelay(320);
          setLastSubmission(values as Record<string, unknown>);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      >
        <View style={s.sectionBlock}>
          <Text style={s.sectionBlockTitle}>Release setup</Text>

          <fields.releaseName />

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.environment />
            </View>
            <View style={s.halfField}>
              <fields.riskLevel />
            </View>
          </View>

          <fields.changeTicket />
          <fields.legalReview />
          <fields.legalApprover />
        </View>

        <View style={s.sectionBlock}>
          <Text style={s.sectionBlockTitle}>Escalation and contingency</Text>

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.contactEmail />
            </View>
            <View style={s.halfField}>
              <fields.contactPhone />
            </View>
          </View>

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.slackChannel />
            </View>
            <View style={s.halfField}>
              <fields.pagerDutyService />
            </View>
          </View>

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.maintenanceStart />
            </View>
            <View style={s.halfField}>
              <fields.maintenanceEnd />
            </View>
          </View>

          <fields.rollbackPlan />

          <View style={s.tips}>
            <Text style={s.tip}>Draft saved locally</Text>
            <Text style={s.tip}>Conditional fields</Text>
            <Text style={s.tip}>Cross-field guards</Text>
            <Text style={s.tip}>Async ticket policy</Text>
          </View>
        </View>

        {state.formLevelError ? (
          <View style={s.errorBox}>
            <Text style={s.errorText}>{state.formLevelError}</Text>
          </View>
        ) : null}

        {state.submitError ? (
          <View style={s.errorBox}>
            <Text style={s.errorText}>{state.submitError}</Text>
          </View>
        ) : null}

        <Form.Submit
          style={s.submitButton}
          loadingText="Running createSchema checks..."
        >
          Validate release gate
        </Form.Submit>
      </Form>

      <Text style={s.footerText}>
        Reach for `createSchema` when the form contract itself should own cross-field
        rules, async policy checks, conditional fields, and the final parsed payload.
      </Text>
    </View>
  );
}

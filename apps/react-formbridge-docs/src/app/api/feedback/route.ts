import {
  buildFeedbackEmailSubject,
  buildFeedbackEmailText,
  FEEDBACK_TO_EMAIL,
  type FeedbackSubmissionValues,
  normalizeFeedbackType,
  normalizeRelevantPage,
} from '@/lib/feedback';
import { FEEDBACK_SCHEMA } from '@/lib/feedbackSchema';

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

function parseSecureFlag(value: string | undefined, port: number) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return port === 465;
}

function getTransportConfig() {
  const host = process.env.FEEDBACK_SMTP_HOST;
  const user = process.env.FEEDBACK_SMTP_USER;
  const pass = process.env.FEEDBACK_SMTP_PASS;
  const fromEmail =
    process.env.FEEDBACK_FROM_EMAIL ?? process.env.FEEDBACK_SMTP_FROM ?? user ?? '';
  const port = Number(process.env.FEEDBACK_SMTP_PORT ?? '587');
  const secure = parseSecureFlag(process.env.FEEDBACK_SMTP_SECURE, port);

  if (!host || !user || !pass || !fromEmail || Number.isNaN(port)) {
    return null;
  }

  return {
    fromEmail,
    transport: nodemailer.createTransport({
      auth: {
        pass,
        user,
      },
      host,
      port,
      secure,
    }),
  };
}

export async function POST(request: Request) {
  const transportConfig = getTransportConfig();

  if (!transportConfig) {
    return NextResponse.json(
      {
        error:
          'Feedback email is not configured yet. Add FEEDBACK_SMTP_HOST, FEEDBACK_SMTP_PORT, FEEDBACK_SMTP_USER, FEEDBACK_SMTP_PASS, and FEEDBACK_FROM_EMAIL on the server.',
      },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as unknown;

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid feedback payload.' }, { status: 400 });
  }

  const result = FEEDBACK_SCHEMA.safeParse(body as Record<string, unknown>);

  if (!result.success) {
    const firstFieldError = Object.values(result.errorsByField)[0];
    const firstFormError = result.formLevelErrors[0];
    return NextResponse.json(
      {
        error: firstFieldError ?? firstFormError ?? 'Invalid feedback payload.',
        errors: result.errorsByField,
      },
      { status: 400 },
    );
  }

  if (!result.data) {
    return NextResponse.json({ error: 'Invalid feedback payload.' }, { status: 400 });
  }

  const data = result.data;
  const values: FeedbackSubmissionValues = {
    actualBehavior: String(data.actualBehavior ?? ''),
    area: String(data.area ?? ''),
    contactConsent: data.contactConsent === true,
    email: String(data.email ?? ''),
    expectedBehavior: String(data.expectedBehavior ?? ''),
    feedbackType: normalizeFeedbackType(String(data.feedbackType ?? 'general')),
    message: String(data.message ?? ''),
    name: String(data.name ?? ''),
    relevantPage: normalizeRelevantPage(String(data.relevantPage ?? '')),
    reproductionSteps: String(data.reproductionSteps ?? ''),
    subject: String(data.subject ?? ''),
  };

  const replyTo = values.contactConsent && values.email ? values.email : undefined;

  try {
    await transportConfig.transport.sendMail({
      from: transportConfig.fromEmail,
      replyTo,
      subject: buildFeedbackEmailSubject(values),
      text: buildFeedbackEmailText(values),
      to: FEEDBACK_TO_EMAIL,
    });
  } catch {
    return NextResponse.json(
      { error: 'Email sending failed. Please check the SMTP credentials.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

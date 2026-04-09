import {
  buildFeedbackEmailSubject,
  buildFeedbackEmailText,
  FEEDBACK_TO_EMAIL,
  parseFeedbackSubmission,
} from '@/lib/feedback';

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

  const body = await request.json().catch(() => null);
  const parsed = parseFeedbackSubmission(body);

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const replyTo =
    parsed.values.contactConsent && parsed.values.email ? parsed.values.email : undefined;

  try {
    await transportConfig.transport.sendMail({
      from: transportConfig.fromEmail,
      replyTo,
      subject: buildFeedbackEmailSubject(parsed.values),
      text: buildFeedbackEmailText(parsed.values),
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

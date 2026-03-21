import type { SchemaResolver, ResolverResult } from '../types';

// ─── Zod ─────────────────────────────────────────────────────────────────────

interface ZodSchema { safeParseAsync(d: unknown): Promise<{ success: boolean; data?: unknown; error?: { issues: { path: (string|number)[]; message: string }[] } }>; }

export function zodResolver(schema: ZodSchema): SchemaResolver {
  return async (values): Promise<ResolverResult> => {
    const result = await schema.safeParseAsync(values);
    if (result.success) return { values: result.data as Record<string, unknown>, errors: {} };
    const errors: Record<string, string> = {};
    for (const issue of result.error?.issues ?? []) {
      const key = issue.path.join('.');
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { values, errors };
  };
}

// ─── Yup ─────────────────────────────────────────────────────────────────────

interface YupSchema { validate(d: unknown, opts?: object): Promise<unknown>; }
interface YupError  { name: string; message: string; path?: string; inner: { path: string; message: string }[]; }

export function yupResolver(schema: YupSchema): SchemaResolver {
  return async (values): Promise<ResolverResult> => {
    try {
      const data = await schema.validate(values, { abortEarly: false });
      return { values: data as Record<string, unknown>, errors: {} };
    } catch (e: unknown) {
      const err = e as YupError;
      if (err.name !== 'ValidationError') throw e;
      const errors: Record<string, string> = {};
      for (const inner of err.inner ?? []) {
        if (inner.path && !errors[inner.path]) errors[inner.path] = inner.message;
      }
      if (!Object.keys(errors).length && err.path) errors[err.path] = err.message;
      return { values, errors };
    }
  };
}

// ─── Joi ─────────────────────────────────────────────────────────────────────

interface JoiSchema { validate(d: unknown, opts?: object): { error?: { details: { path: (string|number)[]; message: string }[] }; value: unknown }; }

export function joiResolver(schema: JoiSchema): SchemaResolver {
  return async (values): Promise<ResolverResult> => {
    const { error, value } = schema.validate(values, { abortEarly: false, allowUnknown: true });
    if (!error) return { values: value as Record<string, unknown>, errors: {} };
    const errors: Record<string, string> = {};
    for (const d of error.details ?? []) {
      const key = d.path.join('.');
      if (key && !errors[key]) errors[key] = d.message.replace(/"/g, '');
    }
    return { values, errors };
  };
}

// ─── Valibot ─────────────────────────────────────────────────────────────────

export function valibotResolver(schema: unknown): SchemaResolver {
  return async (values): Promise<ResolverResult> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const valibot = require('valibot');
      const result  = await valibot.safeParseAsync(schema, values);
      if (result.success) return { values: result.output as Record<string, unknown>, errors: {} };
      const errors: Record<string, string> = {};
      for (const issue of result.issues ?? []) {
        const key = (issue.path ?? []).map((p: { key: string }) => p.key).join('.');
        if (key && !errors[key]) errors[key] = issue.message;
      }
      return { values, errors };
    } catch {
      throw new Error('[formura] valibotResolver requires valibot: npm install valibot');
    }
  };
}

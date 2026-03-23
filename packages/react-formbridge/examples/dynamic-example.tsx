/**
 * formura — Dynamic / API-driven forms
 * ─────────────────────────────────────────
 * The server controls what fields appear, their types, their validation.
 * The frontend just renders whatever it gets.
 */

import React from 'react';
import { parseDynamicForm, parseJsonSchema, useDynamicForm } from 'formura';
import type { JsonFormDefinition } from 'formura';

// ─── Example 1: Inline JSON definition ───────────────────────────────────────

const CONTACT_FORM: JsonFormDefinition = {
  id:          'contact',
  title:       'Contact us',
  submitLabel: 'Send message',
  fields: [
    { name: 'name',    type: 'text',     label: 'Your name',    required: true,  order: 1 },
    { name: 'email',   type: 'email',    label: 'Email',        required: true,  order: 2 },
    { name: 'topic',   type: 'select',   label: 'Topic',        required: true,  order: 3,
      options: [
        { label: 'Technical support', value: 'support'     },
        { label: 'Sales',             value: 'sales'       },
        { label: 'Partnership',       value: 'partnership' },
        { label: 'Other',             value: 'other'       },
      ],
    },
    { name: 'message', type: 'textarea', label: 'Message',      required: true,  order: 4,
      min: 20, hint: 'Please provide as much detail as possible.' },
    // This field only appears when topic === 'support'
    { name: 'version', type: 'text', label: 'App version',      required: false, order: 5,
      showWhen:   { field: 'topic', value: 'support' },
      hint:       'Which version are you using?',
      placeholder:'e.g. 1.4.2',
    },
    { name: 'urgent', type: 'switch', label: 'Mark as urgent',  order: 6 },
    { name: 'attachLogs', type: 'switch', label: 'Include system logs',
      showWhen: { field: 'urgent', value: true },
      order: 7,
    },
  ],
};

export function InlineJsonForm() {
  const { form, fieldOrder, meta, isVisible } = useDynamicForm(CONTACT_FORM);

  if (!form) return null;

  return (
    <div style={{ maxWidth: 540, padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      {meta.title && <h2 style={{ marginBottom: 20 }}>{meta.title}</h2>}

      <form.Form onSubmit={(v) => console.log('Submitted:', v)}>
        {fieldOrder
          .filter(name => isVisible(name))  // ← showWhen evaluated here
          .map(name => {
            const Field = form.fields[name];
            return Field ? <Field key={name} /> : null;
          })
        }
        <form.Form.Submit>{meta.submitLabel ?? 'Submit'}</form.Form.Submit>
      </form.Form>
    </div>
  );
}

// ─── Example 2: Async form from API ──────────────────────────────────────────

export function ApiDrivenForm({ formId }: { formId: string }) {
  const { form, fieldOrder, meta, isVisible, isLoading, loadError } =
    useDynamicForm(
      () => fetch(`/api/forms/${formId}`).then(r => r.json()),
      {
        validateOn:    'onTouched',
        defaultValues: { newsletter: true }, // prefill some defaults
      }
    );

  if (isLoading) return <div>Loading form…</div>;
  if (loadError) return <div style={{ color: 'red' }}>Error: {loadError}</div>;
  if (!form)     return null;

  return (
    <div>
      {meta.title && <h1>{meta.title}</h1>}

      <form.Form onSubmit={async (values) => {
        await fetch('/api/submissions', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ formId, values }),
        });
      }}>
        {fieldOrder
          .filter(name => isVisible(name))
          .map(name => {
            const Field = form.fields[name];
            return Field ? <Field key={name} /> : null;
          })}
        <form.Form.Submit loadingText="Submitting…">
          {meta.submitLabel ?? 'Submit'}
        </form.Form.Submit>
      </form.Form>
    </div>
  );
}

// ─── Example 3: JSON Schema (draft-07) ───────────────────────────────────────

const JSON_SCHEMA = {
  title: 'Create account',
  required: ['username', 'email', 'password'],
  properties: {
    username: { type: 'string',  title: 'Username',     minLength: 3, maxLength: 20 },
    email:    { type: 'string',  format: 'email',       title: 'Email' },
    password: { type: 'string',  title: 'Password',     minLength: 8 },
    age:      { type: 'integer', title: 'Age',          minimum: 18, maximum: 120 },
    website:  { type: 'string',  format: 'uri',         title: 'Website', description: 'Your personal site' },
    plan:     { type: 'string',  title: 'Plan',
                enum: ['free', 'pro', 'enterprise'],
                default: 'free' },
  },
};

export function JsonSchemaForm() {
  const schema = parseJsonSchema(JSON_SCHEMA as any);
  const { Form, fields } = (require('formura') as any).useForm(schema, { validateOn: 'onTouched' });

  return (
    <Form onSubmit={(v: Record<string, unknown>) => console.log('Account:', v)}>
      <fields.username />
      <fields.email />
      <fields.password />
      <fields.age />
      <fields.website />
      <fields.plan />
      <Form.Submit>Create account</Form.Submit>
    </Form>
  );
}

// ─── Example 4: Multi-tenant SaaS — each client has its own form config ───────

// The form definition is fetched per client / per feature flag.
// Zero frontend code changes when the backend adds a new field.

export function TenantForm({ tenantId }: { tenantId: string }) {
  const { form, fieldOrder, isVisible, isLoading } = useDynamicForm(
    async () => {
      const res = await fetch(`/api/tenants/${tenantId}/onboarding-form`);
      return res.json();
    }
  );

  if (isLoading) return <div>Loading…</div>;
  if (!form)     return null;

  return (
    <form.Form onSubmit={(v) => console.log(v)}>
      {fieldOrder
        .filter(name => isVisible(name))
        .map(name => {
          const Field = form.fields[name];
          return Field ? <Field key={name} /> : null;
        })}
      <form.Form.Submit>Continue</form.Form.Submit>
    </form.Form>
  );
}

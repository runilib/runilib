/**
 * formura — Readonly & Diff mode
 * ───────────────────────────────────
 * Same schema, same field components — but renders values as text instead of inputs.
 * Diff mode highlights what changed vs. the saved version.
 *
 * Use cases:
 * - Profile page (view mode → edit mode toggle)
 * - Review step before submitting
 * - Audit log — what did the user change?
 * - Side-by-side comparison of two records
 */

import React, { useState } from 'react';
import { useForm, field }   from 'formura';
import { useReadonlyForm }  from 'formura';

// ─── Shared schema ────────────────────────────────────────────────────────────

const USER_SCHEMA = {
  firstName:   field.text('First name').required(),
  lastName:    field.text('Last name').required(),
  email:       field.email('Email').required(),
  phone:       field.tel('Phone'),
  bio:         field.textarea('Bio').max(300),
  role:        field.select('Role').options([
    { label: 'Admin',   value: 'admin'   },
    { label: 'Editor',  value: 'editor'  },
    { label: 'Viewer',  value: 'viewer'  },
  ]),
  active:      field.switch('Account active'),
  dateOfBirth: field.date('Date of birth'),
  password:    field.password('Password'),
};

// ─── Example 1: View / Edit toggle ───────────────────────────────────────────

export function UserProfile() {
  const [editing, setEditing] = useState(false);

  const savedUser = {
    firstName:   'AKS',
    lastName:    'Dev',
    email:       'aks@unikit.dev',
    phone:       '+33612345678',
    bio:         'Senior Frontend Engineer. Building react-unikit.',
    role:        'admin',
    active:      true,
    dateOfBirth: '1990-03-15',
    password:    'secret123',
  };

  // Readonly view
  const { ReadonlyFields, fields: readonlyFields } = useReadonlyForm(USER_SCHEMA, {
    mode:   'readonly',
    values: savedUser as any,
    formatters: {
      dateOfBirth: (v) => {
        if (!v) return '—';
        return new Date(v as string).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
      },
    },
  });

  // Edit form
  const { Form, fields, reset } = useForm(USER_SCHEMA);
  React.useEffect(() => { reset(savedUser as any); }, [reset]);

  return (
    <div style={{ maxWidth: 560, padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2>User profile</h2>
        <button
          onClick={() => setEditing(!editing)}
          style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e7eb',
                   background: editing ? '#ef4444' : '#6366f1', color: '#fff',
                   fontWeight: 600, cursor: 'pointer' }}
        >
          {editing ? 'Cancel' : 'Edit profile'}
        </button>
      </div>

      {editing ? (
        // ── Edit mode — inputs ──
        <Form onSubmit={(v) => { console.log('Saved:', v); setEditing(false); }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <fields.firstName />
            <fields.lastName />
          </div>
          <fields.email />
          <fields.phone />
          <fields.bio />
          <fields.role />
          <fields.active />
          <fields.dateOfBirth />
          <Form.Submit>Save changes</Form.Submit>
        </Form>
      ) : (
        // ── View mode — same schema, text display ──
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          <ReadonlyFields.firstName />
          <ReadonlyFields.lastName />
          <ReadonlyFields.email />
          <ReadonlyFields.phone />
          <div style={{ gridColumn: '1 / -1' }}><ReadonlyFields.bio /></div>
          <ReadonlyFields.role />
          <ReadonlyFields.active />
          <ReadonlyFields.dateOfBirth />
          <ReadonlyFields.password />   {/* shows •••••••• */}
        </div>
      )}
    </div>
  );
}

// ─── Example 2: Review step in a wizard ──────────────────────────────────────

export function ReviewStep({ formValues }: { formValues: Record<string, unknown> }) {
  const { ReadonlyFields } = useReadonlyForm(USER_SCHEMA, {
    mode:   'readonly',
    values: formValues as any,
  });

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>Review your information</h3>
      <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14 }}>
        Please review your details before submitting.
      </p>

      <div style={{ background: '#f9fafb', borderRadius: 12, padding: 20, border: '1px solid #e5e7eb' }}>
        <ReadonlyFields.firstName />
        <ReadonlyFields.lastName />
        <ReadonlyFields.email />
        <ReadonlyFields.role />
        <ReadonlyFields.active />
      </div>

      <button style={{ marginTop: 20, padding: '12px 24px', background: '#6366f1',
                       color: '#fff', border: 'none', borderRadius: 9,
                       fontWeight: 700, cursor: 'pointer' }}>
        Confirm and submit
      </button>
    </div>
  );
}

// ─── Example 3: Diff mode — what changed? ────────────────────────────────────

export function ChangeReview() {
  const savedUser = {
    firstName:   'Jean',
    lastName:    'Dupont',
    email:       'jean@old.com',
    phone:       '',
    bio:         '',
    role:        'editor',
    active:      false,
    dateOfBirth: '1985-06-20',
    password:    'oldpassword',
  };

  const pendingChanges = {
    firstName:   'Jean',              // unchanged
    lastName:    'Martin',            // CHANGED
    email:       'jean@new.com',      // CHANGED
    phone:       '+33612345678',      // CHANGED
    bio:         '',
    role:        'admin',             // CHANGED
    active:      true,                // CHANGED
    dateOfBirth: '1985-06-20',        // unchanged
    password:    'newstrongPass1!',   // CHANGED
  };

  const { ReadonlyFields, changedFields, hasChanges } = useReadonlyForm(USER_SCHEMA, {
    mode:           'diff',
    values:         pendingChanges as any,
    originalValues: savedUser as any,
  });

  return (
    <div style={{ maxWidth: 560, padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ marginBottom: 8 }}>Review changes</h2>

      {hasChanges ? (
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
          <strong>{changedFields.length} fields</strong> have been modified.
          Changed fields are highlighted.
        </p>
      ) : (
        <p style={{ color: '#22c55e', marginBottom: 24 }}>No changes.</p>
      )}

      <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e5e7eb' }}>
        <ReadonlyFields.firstName />   {/* no badge — unchanged */}
        <ReadonlyFields.lastName />    {/* "edited" badge + strikethrough original */}
        <ReadonlyFields.email />       {/* "edited" badge */}
        <ReadonlyFields.phone />       {/* "edited" badge */}
        <ReadonlyFields.role />        {/* "edited" badge — shows label */}
        <ReadonlyFields.active />      {/* "edited" badge — shows ✓ Yes */}
        <ReadonlyFields.password />    {/* "edited" badge — shows •••••••• */}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button style={{ flex: 1, padding: 12, background: '#6366f1', color: '#fff',
                         border: 'none', borderRadius: 9, fontWeight: 700, cursor: 'pointer' }}>
          Save changes
        </button>
        <button style={{ flex: 1, padding: 12, background: 'transparent', color: '#6b7280',
                         border: '1px solid #e5e7eb', borderRadius: 9, cursor: 'pointer' }}>
          Discard
        </button>
      </div>
    </div>
  );
}

// ─── Example 4: Side-by-side comparison ──────────────────────────────────────

export function SideBySideComparison() {
  const v1 = { firstName: 'Jean', email: 'jean@old.com', role: 'editor', active: false };
  const v2 = { firstName: 'Jean', email: 'jean@new.com', role: 'admin',  active: true  };

  const schema = {
    firstName: field.text('First name'),
    email:     field.email('Email'),
    role:      field.select('Role').options(['admin','editor','viewer']),
    active:    field.switch('Active'),
  };

  const left  = useReadonlyForm(schema, { mode: 'readonly', values: v1 as any });
  const right = useReadonlyForm(schema, {
    mode: 'diff', values: v2 as any, originalValues: v1 as any,
  });

  const names: (keyof typeof schema)[] = ['firstName','email','role','active'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, fontFamily: 'system-ui, sans-serif', maxWidth: 720, padding: 32 }}>
      <div>
        <h3 style={{ marginBottom: 16, color: '#6b7280' }}>Before</h3>
        {names.map(name => {
          const F = left.ReadonlyFields[name];
          return F ? <F key={name} showDiff={false} /> : null;
        })}
      </div>
      <div>
        <h3 style={{ marginBottom: 16, color: '#6366f1' }}>After</h3>
        {names.map(name => {
          const F = right.ReadonlyFields[name];
          return F ? <F key={name} /> : null;
        })}
      </div>
    </div>
  );
}

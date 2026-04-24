import type { LibraryDoc } from './../../../types/index';

export const tutorialSchemaValidationSection: LibraryDoc['sections'][number] = {
  id: 'fb-tutorial-schema-validation',
  title: 'Tutorial: createSchema() & strong validation',
  content: `This tutorial builds a **real-world booking form** that pushes validation well beyond single-field rules. You will use \`createSchema()\` to express cross-field constraints, async checks, form-level errors, global error mapping, and server-side reuse - all without any external validation library.

By the end you will have a form that:

- Requires at least one contact method (email or phone)
- Ensures the return date is not before departure
- Checks username availability asynchronously
- Validates password confirmation via \`superRefine\`
- Prevents the email handle from appearing in the password
- Rewrites every error message through a global \`errorMap\`
- Reuses the exact same schema for server-side validation via \`safeParse\``,
  codeTabs: [
    {
      filename: 'FinalResult.tsx',
      lang: 'tsx',
      code: `import { createSchema, field, useFormBridge } from '@runilib/react-formbridge'

// ── Schema with full cross-field validation ──────────────────────────
const bookingSchema = createSchema({
  username:     field.text('Username').required().trim().min(3).max(20)
                  .pattern(/^[a-z0-9_]+$/i, 'Letters, numbers, and underscores only.'),
  email:        field.email('Email').trim().lowercase(),
  phone:        field.phone('Phone').defaultCountry('FR').required(),
  departure:    field.date('Departure date').required(),
  returnDate:   field.date('Return date').required(),
  password:     field.password('Password').required().min(8),
  confirmPassword: field.password('Confirm password').required().sameAs('password','Passwords do not match.'),
  terms:        field.checkbox('I accept the terms').mustBeTrue('You must accept the terms.'),
})
  // ① At least one contact method
  .atLeastOne(['email', 'phone'], 'Provide at least an email or a phone number.')

  // ② Multi-issue cross-field check
  .superRefine((values, ctx) => {
    if (values.departure && values.returnDate) {
      const departureTs = new Date(values.departure).getTime()
      const returnTs = new Date(values.returnDate).getTime()

      if (!Number.isNaN(departureTs) && !Number.isNaN(returnTs) && returnTs < departureTs) {
        ctx.addIssue({
          path: 'returnDate',
          code: 'return_before_departure',
          message: 'Return date must be on or after departure.',
        })
      }
    }

    if (values.password !== values.confirmPassword) {
      ctx.addIssue({
        path: 'confirmPassword',
        code: 'password_mismatch',
        message: 'Passwords do not match.',
      })
    }

    const handle = values.email?.split('@')[0]?.toLowerCase()
    if (handle && values.password?.toLowerCase().includes(handle)) {
      ctx.addIssue({
        path: 'password',
        code: 'password_contains_email',
        message: "Don't reuse your email handle inside the password.",
      })
    }
  })

  // ③ Async username check
  .refineAsync(
    async (values) => {
      if (!values.username || values.username.length < 3) return true
      const res = await fetch('/api/check-username?u=' + values.username)
      const { available } = await res.json()
      return available
    },
    { path: 'username', code: 'username_taken', message: 'This username is already taken.' },
  )

  // ④ Global error rewriting
  .errorMap((issue, defaultMessage) => {
    if (issue.code === 'required') return 'This field is required.'
    if (issue.code === 'min') return \`Use at least \${issue.params?.min ?? ''} characters.\`
    return defaultMessage
  })

// ── React component ──────────────────────────────────────────────────
export function BookingForm() {
  const { Form, fields, state } = useFormBridge(bookingSchema, {
    validateOn: 'onTouched',
    revalidateOn: 'onChange',
  })

  const formLevelError = state.formLevelError

  return (
    <Form onSubmit={async (values) => {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error('Booking failed')
    }}>
      <fields.username />
      <fields.email />
      <fields.phone />
      <fields.departure />
      <fields.returnDate />
      <fields.password />
      <fields.confirmPassword />
      <fields.terms />
      {formLevelError ? <p className="form-error">{formLevelError}</p> : null}
      <Form.Submit disabled={!state.isValid}>Book trip</Form.Submit>
    </Form>
  )
}`,
    },
    {
      filename: 'ServerReuse.ts',
      lang: 'ts',
      code: `// bookingSchema.ts
import { createSchema, field, type SchemaValues } from '@runilib/react-formbridge/schema'

export const bookingSchema = createSchema({
  // same schema as in the form module
})

export type BookingValues = SchemaValues<typeof bookingSchema>

// createBooking.ts
'use server'

import { bookingSchema, type BookingValues } from './bookingSchema'

export async function createBooking(raw: unknown) {
  const result = await bookingSchema.safeParseAsync(raw as Partial<BookingValues>)

  if (!result.success) {
    return {
      ok: false as const,
      errors: result.errorsByField,
      formLevelErrors: result.formLevelErrors,
    }
  }

  await db.bookings.insert(result.data)
  return { ok: true as const }
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-tutorial-schema-validation-why',
      title: 'Why createSchema() instead of field rules alone',
      content: `Field-level rules (\`required\`, \`min\`, \`pattern\`, \`sameAs\`, …) validate each field in isolation. That covers 80% of forms. But the moment a rule depends on **more than one field**, you need a higher vantage point.

| Need | Field rules | createSchema() |
| --- | --- | --- |
| "Email is required" | \`field.email().required()\` | Not needed |
| "Provide email **or** phone" | Cannot express | \`.atLeastOne(['email', 'phone'])\` |
| "Return date after departure" | Cannot express cleanly across the whole form | \`.superRefine((v, ctx) => ...)\` |
| "Password must not contain the email handle" | Cannot express | \`.superRefine((v, ctx) => …)\` |
| Async uniqueness check | \`validate(fn)\` (sync only) | \`.refineAsync(fn)\` |
| Rewrite all error messages at once | One field at a time | \`.errorMap(fn)\` |
| Server-side reuse | Mount a React component | \`.safeParse(values)\` - no React needed |

\`createSchema()\` wraps the same shape object you already know. The wrapped value is still passed straight to \`useFormBridge\`, so nothing changes in your component tree.`,
    },
    {
      id: 'fb-tutorial-schema-validation-step1',
      title: 'Step 1 - Start with a plain schema',
      content: `Begin with the field builders. Each field owns its own local rules. No \`createSchema()\` wrapper yet.`,
      code: {
        filename: '01-plain-schema.ts',
        lang: 'ts',
        code: `import { field } from '@runilib/react-formbridge'

const bookingFields = {
  username:        field.text('Username').required().trim().min(3).max(20)
                     .pattern(/^[a-z0-9_]+$/i, 'Letters, numbers, and underscores only.'),
  email:           field.email('Email').trim().lowercase(),
  phone:           field.phone('Phone').defaultCountry('FR'),
  departure:       field.date('Departure date').required(),
  returnDate:      field.date('Return date').required(),
  password:        field.password('Password').required().min(8),
  confirmPassword: field.password('Confirm password').required(),
  terms:           field.checkbox('I accept the terms').mustBeTrue('You must accept the terms.'),
}

// At this point, each field validates itself.
// "email or phone", "return after departure", "passwords match"
// are NOT yet enforced.`,
      },
    },
    {
      id: 'fb-tutorial-schema-validation-step2',
      title: 'Step 2 - Wrap in createSchema() and add atLeastOne',
      content: `Wrap the shape in \`createSchema()\` and chain your first cross-field rule. \`atLeastOne\` ensures the user fills in at least one of the listed fields. The error is form-level (no \`path\`), so it surfaces under \`state.formLevelError\`.`,
      code: {
        filename: '02-at-least-one.ts',
        lang: 'ts',
        code: `import { createSchema, field } from '@runilib/react-formbridge'

const bookingSchema = createSchema({
  email: field.email('Email').trim().lowercase(),
  phone: field.phone('Phone').defaultCountry('FR'),
  // ... other fields ...
})
  .atLeastOne(
    ['email', 'phone'],
    'Provide at least an email or a phone number.',
  )

// If both email and phone are empty → form-level error
// If either one is filled → rule passes`,
      },
    },
    {
      id: 'fb-tutorial-schema-validation-step3',
      title: 'Step 3 - superRefine for temporal constraints',
      content: `When a rule depends on **two date fields at once**, \`superRefine\` is the most direct option. Compare the two values and pin the error to \`returnDate\` so the user sees it exactly where the fix belongs.`,
      code: {
        filename: '03-date-order.ts',
        lang: 'ts',
        code: `import { createSchema, field } from '@runilib/react-formbridge'

const bookingSchema = createSchema({
  departure:  field.date('Departure date').required(),
  returnDate: field.date('Return date').required(),
  // ...
})
  .superRefine((values, ctx) => {
    if (!values.departure || !values.returnDate) return

    const departureTs = new Date(values.departure).getTime()
    const returnTs = new Date(values.returnDate).getTime()

    if (!Number.isNaN(departureTs) && !Number.isNaN(returnTs) && returnTs < departureTs) {
      ctx.addIssue({
        path: 'returnDate',
        code: 'return_before_departure',
        message: 'Return date must be on or after departure.',
      })
    }
  })

// If departure = 2026-04-20 and returnDate = 2026-04-18
//   → error on "returnDate": "Return date must be on or after departure."
// If either field is empty, the rule is skipped (required catches that).`,
      },
    },
    {
      id: 'fb-tutorial-schema-validation-step4',
      title: 'Step 4 - superRefine for richer multi-issue checks',
      content: `\`superRefine\` is the most powerful primitive. You receive the full values object and a \`ctx\` with \`addIssue()\`. You can raise **multiple errors on different fields** in a single pass.

This is where you put rules that are too complex for a single boolean predicate: password confirmation, email-in-password detection, conditional business logic that touches three fields, etc.`,
      code: {
        filename: '04-super-refine.ts',
        lang: 'ts',
        code: `const bookingSchema = createSchema({ /* ... */ })
  .superRefine((values, ctx) => {
    // Rule 1: passwords must match
    if (values.password !== values.confirmPassword) {
      ctx.addIssue({
        path: 'confirmPassword',
        code: 'password_mismatch',
        message: 'Passwords do not match.',
      })
    }

    // Rule 2: password must not contain the email handle
    const handle = values.email?.split('@')[0]?.toLowerCase()
    if (handle && values.password?.toLowerCase().includes(handle)) {
      ctx.addIssue({
        path: 'password',
        code: 'password_contains_email',
        message: "Don't reuse your email handle inside the password.",
      })
    }

    // You can add as many issues as needed.
    // Each one lands on its own field via "path".
    // Omit "path" to create a form-level error (state.formLevelError).
  })`,
      },
    },
    {
      id: 'fb-tutorial-schema-validation-step5',
      title: 'Step 5 - refineAsync for server-side checks',
      content: `\`refineAsync\` runs a promise-returning predicate. It fires during \`safeParseAsync\` and during form validation when the runtime uses the async pipeline.

Pin the error to a specific field with \`path\` so the user sees the feedback exactly where it matters.`,
      code: {
        filename: '05-refine-async.ts',
        lang: 'ts',
        code: `const bookingSchema = createSchema({ /* ... */ })
  .refineAsync(
    async (values) => {
      // Skip the check if username is too short to be valid anyway
      if (!values.username || values.username.length < 3) return true

      const res = await fetch('/api/check-username?u=' + values.username)
      const { available } = await res.json()
      return available
    },
    {
      path: 'username',
      code: 'username_taken',
      message: 'This username is already taken.',
    },
  )

// The runtime debounces async checks automatically.
// If the user types fast, only the last value triggers the fetch.`,
      },
    },
    {
      id: 'fb-tutorial-schema-validation-step6',
      title: 'Step 6 - errorMap for global message rewriting',
      content: `\`errorMap\` receives every issue produced by the schema - field-level and refinement-level alike - and lets you rewrite or translate the message in one place. Return the new string to override, or \`defaultMessage\` to keep the original.

This is the FormBridge-native equivalent of Zod's \`errorMap\`. Use it for i18n, copy standardization, or to strip technical codes from user-facing messages.`,
      code: {
        filename: '06-error-map.ts',
        lang: 'ts',
        code: `const bookingSchema = createSchema({ /* ... */ })
  .errorMap((issue, defaultMessage) => {
    switch (issue.code) {
      case 'required':
        return 'This field is required.'
      case 'min':
        return \`Use at least \${issue.params?.min ?? ''} characters.\`
      case 'invalid_email':
        return 'Enter a valid email address.'
      case 'password_mismatch':
        return 'The two passwords must be identical.'
      case 'username_taken':
        return 'Pick a different username - this one is taken.'
      default:
        return defaultMessage
    }
  })

// Every error now goes through this mapper.
// Great for i18n: swap the switch for a t() lookup.`,
      },
    },
    {
      id: 'fb-tutorial-schema-validation-step7',
      title: 'Step 7 - Render the form',
      content: `The wrapped schema is passed to \`useFormBridge\` exactly like a plain shape. The only new thing in the component is reading \`state.formLevelError\` to show form-level errors produced by \`atLeastOne\`.`,
      code: {
        filename: '07-render.tsx',
        lang: 'tsx',
        code: `import { createSchema, field, useFormBridge } from '@runilib/react-formbridge'

// In a real app this schema lives in its own module (see Step 8).
// We inline a condensed version here so the playground runs standalone.
const bookingSchema = createSchema({
  username: field.text('Username').required().trim().min(3).max(20),
  email: field.email('Email').trim().lowercase(),
  phone: field.phone('Phone').defaultCountry('FR'),
  departure: field.date('Departure date').required(),
  returnDate: field.date('Return date').required(),
  password: field.password('Password').required().min(8),
  confirmPassword: field
    .password('Confirm password')
    .required()
    .sameAs('password', 'Passwords do not match.'),
  terms: field.checkbox('I accept the terms').mustBeTrue('You must accept the terms.'),
}).atLeastOne(['email', 'phone'], 'Provide at least an email or a phone number.')

export default function BookingForm() {
  const { Form, fields, state } = useFormBridge(bookingSchema, {
    validateOn: 'onTouched',
    revalidateOn: 'onChange',
  })

  const formLevelError = state.formLevelError

  return (
    <Form onSubmit={async (values) => console.log('submit', values)}>
      <fields.username />
      <fields.email />
      <fields.phone />
      <fields.departure />
      <fields.returnDate />
      <fields.password />
      <fields.confirmPassword />
      <fields.terms />

      {formLevelError ? <p style={{ color: '#b91c1c' }}>{formLevelError}</p> : null}

      <Form.Submit disabled={!state.isValid}>Book trip</Form.Submit>
    </Form>
  )
}`,
      },
    },
    {
      id: 'fb-tutorial-schema-validation-step8',
      title: 'Step 8 - Reuse the schema on the server',
      content: `Because \`createSchema()\` exposes \`safeParse\` and \`safeParseAsync\`, you can validate the exact same rules server-side - in a server action, a tRPC handler, an API route, or a test - without mounting React.

The returned \`errorsByField\` is drop-in compatible with \`state.errors\`, so you can feed server errors straight back into the form via \`setErrors()\`.

If \`bookingSchema\` lives in a module shared between your client form and the server action, define that module with \`@runilib/react-formbridge/schema\` and keep \`useFormBridge\` imported from the main package only in React files.`,
      code: {
        filename: '08-server-reuse.ts',
        lang: 'ts',
        code: `// bookingSchema.ts
import { createSchema, field, type SchemaValues } from '@runilib/react-formbridge/schema'

export const bookingSchema = createSchema({
  // same schema as above
})

export type BookingValues = SchemaValues<typeof bookingSchema>

// createBooking.ts
'use server'

import { bookingSchema, type BookingValues } from './bookingSchema'

export async function createBooking(raw: unknown) {
  // safeParseAsync runs sync + async refinements
  const result = await bookingSchema.safeParseAsync(raw as Partial<BookingValues>)

  if (!result.success) {
    // result.errorsByField → { username: "..." }
    // result.formLevelErrors    → ["Provide at least an email or a phone."]
    // result.issues        → raw ordered list of every issue
    return {
      ok: false as const,
      errors: result.errorsByField,
      formLevelErrors: result.formLevelErrors,
    }
  }

  // result.data is fully typed from the schema shape
  await db.bookings.insert(result.data)
  return { ok: true as const }
}

// On the client, wire server errors back:
// const res = await createBooking(values)
// if (!res.ok) setErrors(res.errors)`,
      },
    },
    {
      id: 'fb-tutorial-schema-validation-chaining',
      title: 'Chaining order and execution',
      content: `Every \`createSchema()\` method returns the same wrapped schema, so the chain is fully fluent. The execution order matters:

| Order | What runs | Stops on failure? |
| --- | --- | --- |
| 1 | Field-level rules (\`required\`, \`min\`, \`pattern\`, …) | No - all fields are validated |
| 2 | \`refine\` / \`superRefine\` (sync) | No - all sync refinements run |
| 3 | \`refineAsync\` (async) | No - all async refinements run |
| 4 | \`errorMap\` rewrites every collected issue | N/A - post-processing |

All issues are collected into a single \`ValidationResult\`. Nothing short-circuits by default - the user sees every problem at once, not one at a time.

The chain itself is declarative. You can declare refinements in any order; FormBridge sorts them by kind internally.`,
    },
    {
      id: 'fb-tutorial-schema-validation-helpers',
      title: 'Built-in helpers cheat sheet',
      content: `\`createSchema()\` ships with three high-level helpers built on top of \`superRefine\`. Use them before writing a custom refinement - they cover the most common cross-field patterns.

| Helper | What it checks | Error target |
| --- | --- | --- |
| \`atLeastOne(fields, msg?)\` | At least one of the listed fields is filled | Form-level (\`state.formLevelError\`) |
| \`exactlyOne(fields, msg?)\` | Exactly one of the listed fields is filled | Form-level (\`state.formLevelError\`) |
| \`allOrNone(fields, msg?)\` | Either all or none of the listed fields are filled | Form-level (\`state.formLevelError\`) |

For anything more complex, drop to \`refine\` (one boolean, one error) or \`superRefine\` (multiple issues, full control).`,
      code: {
        filename: 'helpers-examples.ts',
        lang: 'ts',
        code: `import { createSchema, field } from '@runilib/react-formbridge'

// ── exactlyOne: pick one delivery method ─────────────────────────────
const deliverySchema = createSchema({
  pickup:    field.text('Pickup address'),
  homeAddr:  field.text('Home delivery address'),
  lockerCode: field.text('Parcel locker code'),
}).exactlyOne(
  ['pickup', 'homeAddr', 'lockerCode'],
  'Pick exactly one delivery method.',
)

// ── allOrNone: optional-but-atomic billing section ───────────────────
const billingSchema = createSchema({
  billingStreet: field.text('Street'),
  billingCity:   field.text('City'),
  billingZip:    field.text('ZIP code'),
}).allOrNone(
  ['billingStreet', 'billingCity', 'billingZip'],
  'Fill in the full billing address or leave it blank.',
)`,
      },
    },
    {
      id: 'fb-tutorial-schema-validation-tests',
      title: 'Bonus - Testing validation without React',
      content: `Because \`safeParse\` / \`safeParseAsync\` run outside React, you can unit-test every validation rule without mounting a component. Assert directly on \`errorsByField\` and \`formLevelErrors\`.`,
      code: {
        filename: 'bookingSchema.test.ts',
        lang: 'ts',
        code: `import { describe, expect, it } from 'vitest'
import { bookingSchema } from './bookingSchema'

describe('bookingSchema', () => {
  it('requires at least one contact method', () => {
    const result = bookingSchema.safeParse({
      username: 'ava_dev',
      departure: '2026-05-01',
      returnDate: '2026-05-10',
      password: 'Str0ngP@ss!',
      confirmPassword: 'Str0ngP@ss!',
      terms: true,
      // email and phone both missing
    })

    expect(result.success).toBe(false)
    expect(result.formLevelErrors).toContain(
      'Provide at least an email or a phone number.',
    )
  })

  it('rejects return date before departure', () => {
    const result = bookingSchema.safeParse({
      username: 'ava_dev',
      email: 'ava@example.com',
      departure: '2026-05-10',
      returnDate: '2026-05-01',
      password: 'Str0ngP@ss!',
      confirmPassword: 'Str0ngP@ss!',
      terms: true,
    })

    expect(result.success).toBe(false)
    expect(result.errorsByField.returnDate).toBe(
      'Return date must be on or after departure.',
    )
  })

  it('catches password mismatch', () => {
    const result = bookingSchema.safeParse({
      username: 'ava_dev',
      email: 'ava@example.com',
      departure: '2026-05-01',
      returnDate: '2026-05-10',
      password: 'Str0ngP@ss!',
      confirmPassword: 'WrongPass!',
      terms: true,
    })

    expect(result.success).toBe(false)
    expect(result.errorsByField.confirmPassword).toBe(
      'The two passwords must be identical.',
    )
  })

  it('catches email handle in password', () => {
    const result = bookingSchema.safeParse({
      username: 'ava_dev',
      email: 'ava@example.com',
      departure: '2026-05-01',
      returnDate: '2026-05-10',
      password: 'ava12345!',
      confirmPassword: 'ava12345!',
      terms: true,
    })

    expect(result.success).toBe(false)
    expect(result.errorsByField.password).toContain('email handle')
  })

  it('passes with valid data', () => {
    const result = bookingSchema.safeParse({
      username: 'ava_dev',
      email: 'ava@example.com',
      departure: '2026-05-01',
      returnDate: '2026-05-10',
      password: 'Str0ngP@ss!',
      confirmPassword: 'Str0ngP@ss!',
      terms: true,
    })

    expect(result.success).toBe(true)
    expect(result.data.username).toBe('ava_dev')
  })
})`,
      },
    },
    {
      id: 'fb-tutorial-schema-validation-next',
      title: 'Where to go next',
      content: `You now have a form with production-grade validation that runs identically on the client and the server.

| Next step | Why |
| --- | --- |
| [createSchema() API reference](/docs/schema-api) | Full signatures, edge cases, and \`ValidationIssue\` shape |
| [Validation overview](/docs/built-in-validation) | How field-level, schema-level, imperative, and bridge validation work together |
| [Conditional logic](/docs/conditional-logic) | \`visibleWhen\`, \`requiredWhen\`, \`disabledWhen\` - rules that change form shape at runtime |
| [Draft persistence](/docs/draft-persistence) | Save the form state across refreshes so strong validation never costs the user their input |
| [Tutorial: advanced flows](/docs/advanced-flows) | Wizards, dynamic forms, readonly review, and analytics |`,
    },
  ],
};

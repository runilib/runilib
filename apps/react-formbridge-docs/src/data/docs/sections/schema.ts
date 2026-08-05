import type { LibraryDoc } from '../../../types/index';

export const schemaApiSection: LibraryDoc['sections'][number] = {
  id: 'fb-schema',
  title: 'createSchema() API',
  content: `\`createSchema(shape)\` wraps a plain field-builder object and layers on a full, zero-dependency validation API cross-field rules, refinements, typed parsing. So you do not need Zod, Yup, Joi, or Valibot to get a production-grade form.

- **The plain schema** describes what fields exist and how they render, default, and self-validate.
- **createSchema(shape)** takes that same object and returns a wrapped value that **additionally** exposes a validation API (\`safeParse\`, \`refine\`, \`atLeastOne\`, etc.). The wrapped value is still accepted by \`useFormBridge\`, so you do not split rendering and validation across two objects.
- **Autocomplete stays clean:** The wrapped value deliberately hides field keys from direct autocomplete on the schema object; typing \`mySchema.\` suggests only schema API methods. Field-level inference still flows through \`SchemaValues<typeof mySchema>\` and \`fieldController(name)\`.
- **Type inference is preserved:** \`const\` inference on the shape keeps every field's builder type, so refinements receive a fully typed \`values\` argument and errors are routed back to the right field.
- **Import surface stays flexible:** use the main \`@runilib/react-formbridge\` entry in client-only files; if the schema module is shared with strict server runtimes, author it from \`@runilib/react-formbridge/schema\` and import React APIs separately from the main package.`,
  subsections: [
    {
      id: 'fb-schema-why',
      title: 'Why createSchema() exists',
      content: `Field-level rules (\`required\`, \`min\`, \`email\`, \`matches\`, etc.) already run through the builder chain on each individual field. That covers most forms until you need a rule that depends on *multiple* fields at once:

- "Provide at least an email **or** a phone number."
- "Return date must be on or after departure date."
- "If you supply a billing address, all billing fields must be filled."
- "Password must match confirmation, and must not contain the email handle."
- "If \`role === 'admin'\`, then \`managerApproval\` is required."
- etc.

Without \`createSchema()\` you would either scatter these checks across ad-hoc \`useEffect\` hooks, duplicate them in \`onSubmit\` handlers, or pull in an external bridge library (Zod, Yup, Joi, Valibot) just to express a handful of rules. \`createSchema()\` gives you a first-class, chainable place for those rules that runs through the same validation pipeline as every other field errors land in \`state.errors\`, touch/dirty tracking still works, and form-level errors surface under \`state.formLevelError\`.

The design goal is stated plainly: **FormBridge should be self-sufficient.** Built-in validation is the complete path, not a stepping stone to an external bridge.`,
    },
    {
      id: 'fb-schema-when-to-use',
      title: 'When to reach for createSchema()',
      content: `Use \`createSchema()\` whenever any of the following apply:

- You need **cross-field validation** (one field's validity depends on another's value).
- You want **form-level errors** that are not attached to a specific field - \`createSchema()\` surfaces these under \`state.formLevelError\`.
- You want to **parse** the submitted values to a fully-typed object via \`safeParse\` / \`validate\` ideal inside server actions, tRPC procedures, or standalone utilities where you do not have a mounted form.
- You want **async refinements** (e.g. username availability, server-side uniqueness checks) wired into the same validation pass as synchronous rules.
- You want to **customise error messages globally** via \`errorMap\` instead of overriding each field.

If your form has only independent field rules, the plain object form with \`satisfies FormSchema\` is enough. Wrap it in \`createSchema()\` the moment you need any of the behaviours above the two forms are interchangeable at the \`useFormBridge\` call site.`,
    },
    {
      id: 'fb-schema-quickstart',
      title: 'Quick start',
      content: `The wrapped schema is used exactly like a plain shape. Hand it to \`useFormBridge\`, render from \`fieldController(name)\`, and chain cross-field rules on the result of \`createSchema()\`. Declare the schema at module scope (outside the component) so its identity stays stable across renders. If that schema module is reused outside React, move the schema authoring imports to \`@runilib/react-formbridge/schema\`.`,
      code: {
        filename: 'TripBookingForm.tsx',
        lang: 'tsx',
        code: `import { createSchema, field, useFormBridge } from '@runilib/react-formbridge'

const tripSchema = createSchema({
  email: field.email().label('Email'),
  phone: field.phone('FR').label('Phone'),
  password: field.password().required().min(8),
  confirmPassword: field.password().required(),
})
  .atLeastOne(
    ['email', 'phone'],
    'Provide at least an email or a phone number.',
  )
  .superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
      ctx.addIssue({
        path: 'confirmPassword',
        code: 'password_mismatch',
        message: 'Passwords do not match.',
      })
    }
  })

export function TripBookingForm() {
  const form = useFormBridge(tripSchema, {
    validateOn: 'onTouched',
    revalidateOn: 'onChange',
  })
  const { Form, fieldController, state } = form

  // Form-level errors (no specific field) land under state.formLevelError
  const formLevelError = state.formLevelError

  return (
    <Form onSubmit={(values) => console.log(values)}>
      <AppField form={form} name="email" />
      <AppField form={form} name="phone" />
      <AppField form={form} name="password" />
      <AppField form={form} name="confirmPassword" />
      {formLevelError ? <p className="error">{formLevelError}</p> : null}
      <button type="submit">Book the trip</button>
    </Form>
  )
}`,
      },
    },
    {
      id: 'fb-schema-shared-modules',
      title: 'Shared client/server schema modules',
      content: `If a schema file is imported by both React code and server-side code, define that file with the server-safe \`@runilib/react-formbridge/schema\` subpath. That keeps schema authoring and parsing available without pulling hooks or UI helpers into the server module graph.

Keep React-only APIs such as \`useFormBridge\` imported from the main \`@runilib/react-formbridge\` entry inside your client component files.`,
      code: {
        filename: 'bookingSchema.ts + BookingForm.tsx + actions.ts',
        lang: 'ts',
        code: `// bookingSchema.ts
import { createSchema, field, type SchemaValues } from '@runilib/react-formbridge/schema'

export const bookingSchema = createSchema({
  email: field.email('Email').trim().lowercase(),
  phone: field.phone('Phone').defaultCountry('FR'),
}).atLeastOne(
  ['email', 'phone'],
  'Provide at least an email or a phone number.',
)

export type BookingValues = SchemaValues<typeof bookingSchema>

// BookingForm.tsx
import { useFormBridge } from '@runilib/react-formbridge'
import { bookingSchema } from './bookingSchema'

export function BookingForm() {
  const form = useFormBridge(bookingSchema)
  const { Form, fieldController } = form

  return (
    <Form onSubmit={(values) => console.log(values)}>
      <AppField form={form} name="email" />
      <AppField form={form} name="phone" />
      <button type="submit">Continue</button>
    </Form>
  )
}

// actions.ts
'use server'

import { bookingSchema, type BookingValues } from './bookingSchema'

export async function submitBooking(raw: unknown) {
  return bookingSchema.safeParseAsync(raw as Partial<BookingValues>)
}`,
      },
    },
    {
      id: 'fb-schema-api-parse',
      title: 'safeParse / safeParseAsync',
      content: `The **parse surface** runs every field-level validator plus every refinement and returns a structured result. It never throws - the caller inspects \`result.success\` to decide what to do.

**Signature**

\`\`\`ts
safeParse(values: Partial<SchemaValues<T>>): ValidationResult<SchemaValues<T>>
safeParseAsync(values: Partial<SchemaValues<T>>): Promise<ValidationResult<SchemaValues<T>>>
\`\`\`

**Returned shape**

\`\`\`ts
type ValidationResult<T> =
  | { success: true;  data: T; issues: []; errorsByField: {}; formLevelErrors: [] }
  | { success: false; data: null; issues: ValidationIssue[]; errorsByField: Record<string, string>; formLevelErrors: string[] }
\`\`\`

| Field | Type | Description |
| --- | --- | --- |
| \`errorsByField\` | \`Record<string, string>\` | Map keyed by field name, first error per field. Drop-in compatible with \`state.errors\` |
| \`formLevelErrors\` | \`string[]\` | Messages that had no field path (form-level) |
| \`issues\` | \`ValidationIssue[]\` | Raw, ordered list of every issue (including duplicates) - useful for analytics or custom grouping |

**When to use which**

- \`safeParse\` is synchronous. Any async refinement in the chain will throw a loud error telling you to use \`safeParseAsync\`.
- \`safeParseAsync\` runs both sync and async refinements in order. Always reach for it on the server side, where you typically have async checks.

**Typical uses**

- Server actions / tRPC handlers that want to reuse the same schema they render with.
- Standalone utility functions that validate persisted drafts before writing to the database.
- Tests you can assert directly on \`errorsByField\` without mounting React.`,
      code: {
        filename: 'server-action.ts',
        lang: 'ts',
        code: `'use server'

import { tripSchema } from './tripSchema'

export async function bookTrip(raw: unknown) {
  const result = await tripSchema.safeParseAsync(raw as Partial<SchemaValues<typeof tripSchema>>)

  if (!result.success) {
    return { ok: false as const, errors: result.errorsByField, formLevelErrors: result.formLevelErrors }
  }

  // result.data is fully typed from the schema shape
  await db.bookings.insert(result.data)
  return { ok: true as const }
}`,
      },
    },
    {
      id: 'fb-schema-api-validate',
      title: 'validate / validateAsync',
      content: `The **strict** variants of \`safeParse\` / \`safeParseAsync\`. They return the typed, parsed data on success and **throw** \`FormBridgeSchemaValidationError\` on failure. The thrown error carries the full \`ValidationResult\` on its \`.result\` property.

**Signature**

\`\`\`ts
validate(values: Partial<SchemaValues<T>>): SchemaValues<T>
validateAsync(values: Partial<SchemaValues<T>>): Promise<SchemaValues<T>>
\`\`\`

Use these when you want to bail early on invalid input for example, inside a \`try / catch\` at a request boundary and do not want to hand-unwrap the \`result.success\` discriminated union on every call site. \`safeParse\` is usually the safer default inside React components.`,
    },
    {
      id: 'fb-schema-api-refine',
      title: 'refine / refineAsync',
      content: `Attach a **boolean predicate** as a cross-field rule. Returns \`true\` if the values are valid, \`false\` to raise an issue. The message argument becomes the issue message; omit it to use the default \`"Invalid form."\`.

**Signature**

\`\`\`ts
refine(
  predicate: (values: SchemaValues<T>) => boolean,
  message?: string | ValidationIssueInput,
): FormBridgeSchema<T>

refineAsync(
  predicate: (values: SchemaValues<T>) => Promise<boolean>,
  message?: string | ValidationIssueInput,
): FormBridgeSchema<T>
\`\`\`

**Notes**

- A bare string message creates a form-level error (no \`path\`), so it surfaces under \`state.formLevelError\`.
- Pass an object to pin the error to a specific field: \`refine(p, { path: 'email', message: 'Taken' })\`.
- \`refineAsync\` only runs inside \`safeParseAsync\` / \`validateAsync\`. Running it through the synchronous path throws.
- Chain as many \`.refine()\` calls as you like each returns the same wrapped schema so the chain is fluent.`,
      code: {
        filename: 'refine-examples.ts',
        lang: 'ts',
        code: `const accountSchema = createSchema({
  password: field.password().required().min(8),
  confirmPassword: field.password().required(),
  username: field.text().required(),
})
  .refine(
    (values) => values.password === values.confirmPassword,
    { path: 'confirmPassword', code: 'mismatch', message: 'Passwords do not match.' },
  )
  .refineAsync(
    async (values) => !(await isUsernameTaken(values.username)),
    { path: 'username', code: 'taken', message: 'That username is already taken.' },
  )`,
      },
    },
    {
      id: 'fb-schema-api-super-refine',
      title: 'superRefine',
      content: `The **most flexible** refinement primitive. Instead of returning a boolean, you receive a \`ctx\` object with an \`addIssue\` method and can raise **multiple** issues each routed to its own field in a single pass.

**Signature**

\`\`\`ts
superRefine(
  refinement: (values: SchemaValues<T>, ctx: ValidationContext) => void | Promise<void>,
): FormBridgeSchema<T>

type ValidationContext = {
  addIssue(issue: string | ValidationIssueInput): void
}

type ValidationIssueInput = {
  path?: string       // omit for form-level error
  code?: string       // identifier for grouping / analytics
  message: string
  params?: Record<string, unknown>
}
\`\`\`

When to pick **superRefine** over **refine**

- You need to raise errors on **several fields** from one cross-check.
- You want to set a custom \`code\` and \`params\` for downstream logging or i18n.
- You want to short-circuit further work inside the refinement based on shape (e.g. skip the check if a value is empty).

\`atLeastOne\`, \`exactlyOne\`, and \`allOrNone\` are all implemented internally as \`superRefine\` calls, so anything they can do, you can write by hand if you need custom behaviour.`,
      code: {
        filename: 'super-refine.ts',
        lang: 'ts',
        code: `createSchema({
  password: field.password().required().min(8),
  confirmPassword: field.password().required(),
  email: field.email().required(),
}).superRefine((values, ctx) => {
  if (values.password !== values.confirmPassword) {
    ctx.addIssue({
      path: 'confirmPassword',
      code: 'password_mismatch',
      message: 'Passwords do not match.',
    })
  }

  const handle = values.email.split('@')[0]?.toLowerCase()
  if (handle && values.password.toLowerCase().includes(handle)) {
    ctx.addIssue({
      path: 'password',
      code: 'password_contains_email',
      message: "Don't reuse your email handle inside your password.",
    })
  }
})`,
      },
    },
    {
      id: 'fb-schema-api-error-map',
      title: 'errorMap',
      content: `Register a **global** transformer for validation messages. The mapper receives the raw issue and can return a new string (or \`null\` to use the default). This is the FormBridge-native equivalent of Zod's \`errorMap\` ideal for i18n or for standardising error copy across a large form.

**Signature**

\`\`\`ts
errorMap(mapper: ValidationErrorMap): FormBridgeSchema<T>

type ValidationErrorMap = (
  issue: ValidationIssue,
  defaultMessage: string,
) => string | null | undefined
\`\`\`

The mapper runs against **every** issue produced by field validators and refinements, so you can centralise message rewriting in one place.`,
      code: {
        filename: 'i18n-error-map.ts',
        lang: 'ts',
        code: `import { t } from './i18n'

const schemaFR = createSchema({
  email: field.email().required(),
  password: field.password().required().min(8),
}).errorMap((issue, defaultMessage) => {
  switch (issue.code) {
    case 'required':      return t('errors.required')
    case 'min':           return t('errors.min', { n: issue.params?.min })
    case 'invalid_email': return t('errors.invalidEmail')
    default:              return defaultMessage
  }
})`,
      },
    },
    {
      id: 'fb-schema-api-at-least-one',
      title: 'atLeastOne',
      content: `Built-in helper: **require that at least one** of the listed fields has a "provided" value. A value is considered provided when it is a non-empty string, a \`true\` boolean, a non-empty array, or any other non-nullish value.

**Signature**

\`\`\`ts
atLeastOne(
  fields: Array<keyof T | string | FieldReference>,
  message?: string,
): FormBridgeSchema<T>
\`\`\`

**Default message**

\`"At least one of <field1>, <field2>, ... is required."\`? You can override it by passing your own string.

**Error routing**

The error has no \`path\`, so it surfaces as a form-level error under \`state.formLevelError\`. Render it below the group of fields it governs.

**Accepted field identifiers**

- \`'email'\` string key on the root schema
- \`ref('profile.phone')\` nested or dynamic path via the \`ref()\` helper`,
      code: {
        filename: 'at-least-one.ts',
        lang: 'ts',
        code: `createSchema({
  email: field.email().label('Email'),
  phone: field.phone('FR').label('Phone'),
}).atLeastOne(
  ['email', 'phone'],
  'Provide at least an email or a phone number so we can reach you.',
)`,
      },
    },
    {
      id: 'fb-schema-api-exactly-one',
      title: 'exactlyOne',
      content: `Built-in helper: require that **exactly one** of the listed fields is provided. Raises an issue if zero or more than one are filled in. Useful for "pick your delivery method" or "choose a contact channel" style forms where the rest of the pipeline assumes a single winner.

**Signature**

\`\`\`ts
exactlyOne(
  fields: Array<keyof T | string | FieldReference>,
  message?: string,
): FormBridgeSchema<T>
\`\`\`

**Default message**

\`"Exactly one of <field1>, <field2>, ... must be provided."\``,
      code: {
        filename: 'exactly-one.ts',
        lang: 'ts',
        code: `createSchema({
  pickupAddress: field.text().label('Pick up in store'),
  homeDelivery: field.text().label('Home delivery address'),
  lockerCode: field.text().label('Parcel locker code'),
}).exactlyOne(
  ['pickupAddress', 'homeDelivery', 'lockerCode'],
  'Pick exactly one delivery method.',
)`,
      },
    },
    {
      id: 'fb-schema-api-all-or-none',
      title: 'allOrNone',
      content: `Built-in helper: either **all** of the listed fields are provided, or **none** of them are. Triggers when the user has filled in some but not all of the group. Perfect for optional-but-atomic sections like "billing address" or "emergency contact".

**Signature**

\`\`\`ts
allOrNone(
  fields: Array<keyof T | string | FieldReference>,
  message?: string,
): FormBridgeSchema<T>
\`\`\`

**Default message**

\`"Provide either all or none of <field1>, <field2>, ..."\``,
      code: {
        filename: 'all-or-none.ts',
        lang: 'ts',
        code: `createSchema({
  billingStreet: field.text().label('Street'),
  billingCity: field.text().label('City'),
  billingZip: field.text().label('ZIP'),
}).allOrNone(
  ['billingStreet', 'billingCity', 'billingZip'],
  'Fill in the full billing address or leave it blank.',
)`,
      },
    },
    {
      id: 'fb-schema-api-ref',
      title: 'ref() - field references',
      content: `\`ref(path)\` produces a typed pointer to a field. It exists for two reasons:

1. **Nested paths.** Plain string keys only work for top-level fields. \`ref('profile.phone')\` walks into a nested object during cross-field checks.
2. **Self-documenting intent.** \`ref('profile.phone')\` inside an \`atLeastOne\` or \`exactlyOne\` call reads unambiguously as "this field path", while a bare string can look like ordinary text.

You can mix \`ref()\` and plain string keys freely inside \`atLeastOne\`, \`exactlyOne\`, \`allOrNone\`, and other custom validation logic. Under the hood the bridge uses \`getValueAtPath\` with dot-notation, so deeply nested schemas work transparently.`,
    },
    {
      id: 'fb-schema-error-routing',
      title: 'How errors reach the UI',
      content: `Every issue produced by \`createSchema()\` whether it comes from a field builder, a manual \`refine\`, a \`superRefine\`, or one of the built-in helpers flows through the same pipeline:

1. **Normalised** into a \`ValidationIssue\` with \`{ path, code, message, params }\`.
2. **Optionally rewritten** by your \`errorMap\` mapper, if one is registered.
3. **Bucketed** into \`errorsByField\` (keyed by path) and \`formLevelErrors\` (no path).
4. **Merged** into the React form state, where \`errorsByField\` lands in \`state.errors\` and the first \`formLevelErrors\` entry lands in \`state.formLevelError\`.

Practical consequences:

- Field-level UI (\`<AppField form={form} name="email" />\`) automatically displays path-keyed issues you do nothing.
- To show form-level errors, read \`state.formLevelError\` and render it wherever makes sense (below the form, in a toast, etc.).
- Duplicate issues on the same field are preserved in \`issues\` but \`errorsByField\` only keeps the **first** one, mirroring the usual "one message per field" convention.`,
    },
    {
      id: 'fb-schema-typing-tip',
      title: 'Typing tip - satisfies vs createSchema()',
      content: `If your form needs only field-level rules, keep the object form and annotate it with \`satisfies FormSchema\` so TypeScript preserves each field's precise type:

\`\`\`tsx
import type { FormSchema } from '@runilib/react-formbridge'

const profileSchema = {
  bio: field.textarea('Bio'),
  country: field.select('Country').options(['FR', 'US']),
} satisfies FormSchema
\`\`\`

The moment you need cross-field rules, a parse surface, or form-level errors, wrap it in \`createSchema()\` nothing else in the call site has to change:

\`\`\`tsx
const profileSchema = createSchema({
  bio: field.textarea('Bio'),
  country: field.select('Country').options(['FR', 'US']),
  altCountry: field.select('Alt country').options(['FR', 'US']),
}).refine(
  (values) => values.country !== values.altCountry,
  { path: 'altCountry', message: 'Alt country must differ from primary.' },
)
\`\`\`

\`useFormBridge(profileSchema)\` accepts either form and \`SchemaValues<typeof profileSchema>\` resolves to the same typed object in both cases.`,
    },
  ],
};

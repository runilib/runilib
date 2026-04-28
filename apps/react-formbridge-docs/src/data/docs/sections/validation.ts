import type { LibraryDoc } from './../../../types/index';
import {
  RESOLVER_SHARED_OPTIONS_SURFACE,
  VALIDATION_RUNTIME_SURFACE,
} from '../constants';

export const validationSection: LibraryDoc['sections'][number] = {
  id: 'fb-validation',
  title: 'Validation',
  content: `react-formbridge ships with a **complete, self-sufficient validation pipeline**. No external library is required to build a production-grade form.

Every approach below flows through the same runtime and lands in the same \`state.errors\` bag. There are **five complementary ways** to validate, and you can combine any of them in the same form:

1. **Field-level builder rules** - \`required\`, \`min\`, \`max\`, \`pattern/patterns\`, \`email\`, \`url\`, \`matches/sameAs\`, \`mustBeTrue\`, \`validate(fn)\`, number helpers, file limits, phone formatting, etc. Declared directly on each builder, they cover most everyday rules.
2. **Schema-level cross-field validation** via \`createSchema()\` - the recommended path the moment you need rules that span multiple fields (\`refine\`, \`superRefine\`, \`atLeastOne\`, \`exactlyOne\`, \`allOrNone\`, \`errorMap\`, async refinements, \`safeParse\` / \`validate\`). Zero external dependency required. See the dedicated [createSchema() API](/docs/schema-api) section.
3. **Imperative validation** from the runtime - \`validate(names?)\`, \`setError()\`, \`clearErrors()\` let you trigger checks on demand and merge server-side errors into the same bag.
4. **Trigger configuration** - \`validateOn\` and \`revalidateOn\` control **when** validation runs (\`'onBlur'\`, \`'onChange'\`, \`'onSubmit'\`, \`'onTouched'\`). Defaults: \`validateOn='onBlur'\`, \`revalidateOn='onChange'\`.
5. **External bridges** (opt-in) - bring your own Zod / Yup / Joi / Valibot schema via \`validatorBridge\` when you already own a domain schema elsewhere in the app.

 FormBridge's design goal: **built-in validation is the complete path**, not a stepping stone to an external bridge. Bridges are provided for teams that already have a domain schema they want to reuse, not because the built-in pipeline is incomplete.`,
  subsections: [
    {
      id: 'fb-validation-field-level',
      title: '1. Field-level validation (builder rules)',
      content: `Use builder methods when the rule belongs to the field itself. Every builder inherits a common base surface. See the [Base field builder](/docs/base-field-builder) section for the full reference table.

**Common rules available on most builders**

| Method | Signature | Description |
| --- | --- | --- |
| \`required\` | \`(message?: string)\` | The value must be provided |
| \`min\` | \`(n: number, message?: string)\` | Length (text) or numeric lower bound |
| \`max\` | \`(n: number, message?: string)\` | Length (text) or numeric upper bound |
| \`pattern\` | \`(regex: RegExp, message?: string)\` | Single regex check |
| \`patterns\` | \`([{ regex, message }, ...])\` | Multiple regex checks in order |
| \`matches\` | \`(otherField: string, message?: string)\` | Cross-field equality check |
| \`sameAs\` | \`(otherField: string, message?: string)\` | Alias of \`matches\` - confirm password style |
| \`validate\` | \`((value, allValues) => string \\| null)\` | Custom sync predicate, return \`null\` when valid |
| \`mustBeTrue\` | \`(message?: string)\` | Agreement toggles (checkbox / switch) |

**Specialised helpers** on typed builders: \`email()\` built into \`field.email()\`, \`url()\` on \`field.url()\`, \`integer()\` / \`positive()\` / \`step()\` on \`field.number()\`, country / format rules on \`field.phone()\`, \`accept\` / \`maxSize\` / \`maxFiles\` on \`field.file()\`, length and character-class options on \`field.password()\`, etc.

Each typed builder has its own dedicated section with the exhaustive list of rules it supports (see the **Fields** sidebar group).

${VALIDATION_RUNTIME_SURFACE}`,
      code: {
        filename: 'field-level-rules.tsx',
        lang: 'tsx',
        code: `import { field, useFormBridge } from '@runilib/react-formbridge'

const signupSchema = {
  displayName: field
    .text('Display name')
    .required('Choose a display name')
    .min(2, 'Use at least 2 characters')
    .max(40),

  email: field.email('Email').required(),

  age: field.number('Age').required().integer().min(13).max(120),

  password: field
    .password('Password')
    .required()
    .min(8)
    .pattern(/[A-Z]/, 'Needs an uppercase letter'),

  confirmPassword: field
    .password('Confirm password')
    .required()
    .sameAs('password', 'Passwords do not match'),

  terms: field.checkbox('I accept the terms').mustBeTrue('You must accept the terms'),
}`,
      },
    },
    {
      id: 'fb-validation-schema',
      title:
        '2. Schema-level validation - createSchema() (recommended for cross-field rules)',
      content: `Wrap your shape with \`createSchema()\` the moment you need rules that depend on **more than one field**, form-level errors, parsing utilities, async refinements, or global error message mapping. The wrapped value is still handed straight to \`useFormBridge\`, so you never split rendering and validation across two objects.

**Cross-field primitives exposed by \`createSchema()\`**

| Method | Signature | Description |
| --- | --- | --- |
| \`refine\` | \`(predicate, message?)\` | Boolean predicate, raises one issue if it fails |
| \`refineAsync\` | \`(predicate, message?)\` | Async boolean predicate (promise-returning) |
| \`superRefine\` | \`((values, ctx) => void)\` | Raise **multiple** issues in a single pass, each routed to its own field |
| \`atLeastOne\` | \`(fields: string[], message?)\` | At least one of the listed fields must be provided |
| \`exactlyOne\` | \`(fields: string[], message?)\` | Exactly one of the listed fields must be provided |
| \`allOrNone\` | \`(fields: string[], message?)\` | Either all or none of the listed fields are provided |
| \`errorMap\` | \`((issue, defaultMessage) => string)\` | Global message transformer (i18n, copy standardisation) |
| \`ref\` | \`('path.to.field')\` | Typed pointer for nested or dynamic field paths |

**Parsing utilities** (usable anywhere, not just inside React)

| Method | Signature | Description |
| --- | --- | --- |
| \`safeParse\` | \`(values) => ValidationResult\` | Never throws - returns \`{ success, data, errorsByField, formLevelErrors, issues }\` |
| \`safeParseAsync\` | \`(values) => Promise<ValidationResult>\` | Async variant, runs sync + async refinements |
| \`validate\` | \`(values) => data\` | Strict - throws \`FormBridgeSchemaValidationError\` on failure |
| \`validateAsync\` | \`(values) => Promise<data>\` | Async strict variant |

Form-level errors (any issue without a \`path\`) surface under \`state.formLevelError\`. Field-level issues land in \`state.errors[fieldName]\` like every other rule.

If the schema object lives in a module that is also imported by server-side code, define that module with \`@runilib/react-formbridge/schema\` and keep \`useFormBridge\` imported from the main package in your client components.

**For the complete API reference, options, signatures and examples, see the dedicated createSchema() API section.**`,
      code: {
        filename: 'schema-validation.ts',
        lang: 'ts',
        code: `import { createSchema, field } from '@runilib/react-formbridge'

export const tripSchema = createSchema({
  email: field.email().label('Email'),
  phone: field.phone('FR').label('Phone'),
  password: field.password().required().min(8),
  confirmPassword: field.password().required(),
})
  .atLeastOne(['email', 'phone'], 'Provide at least an email or a phone.')
  .superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
      ctx.addIssue({
        path: 'confirmPassword',
        code: 'password_mismatch',
        message: 'Passwords do not match.',
      })
    }
  })
  .errorMap((issue, defaultMessage) => {
    if (issue.code === 'required') return 'This field is required.'
    return defaultMessage
  })`,
      },
    },
    {
      id: 'fb-validation-imperative',
      title: '3. Imperative validation & server-side errors',
      content: `The runtime returned by \`useFormBridge\` exposes imperative entry points so you can drive validation from your own code - submit handlers, effects, or server round-trips.

| Method / State | Signature | Description |
| --- | --- | --- |
| \`validate\` | \`(names?: string \\| string[]) => Promise<Errors>\` | Run validation on demand. Pass one field, an array, or nothing for the whole form. Returns the up-to-date error map |
| \`setError\` | \`(name: string, message: string) => void\` | Push a single error into the state - ideal for surfacing one server-side error |
| \`setErrors\` | \`(errorsByField: Record<string, string>) => void\` | Merge a bag of server errors in one call |
| \`clearErrors\` | \`(names?: string \\| string[]) => void\` | Clear one, several, or all errors |
| \`state.errors\` | \`Record<string, string>\` | Current error map (read from React) |
| \`state.touched\` | \`Record<string, boolean>\` | Which fields have been blurred at least once |
| \`state.dirty\` | \`Record<string, boolean>\` | Which fields differ from their initial value |
| \`state.formLevelError\` | \`string \\| null\` | Form-level error produced by \`createSchema()\` refinements |

This is also how you wire **server-side validation** into the same pipeline: call your API inside \`onSubmit\`, then \`setErrors(response.errorsByField)\` to surface any failures under the same field keys your users are already looking at.`,
      code: {
        filename: 'imperative-validation.tsx',
        lang: 'tsx',
        code: `const { Form, fields, state, validate, setError, setErrors, clearErrors } =
  useFormBridge(signupSchema)

async function onSubmit(values) {
  // Re-validate the whole form manually if needed
  const errors = await validate()
  if (Object.keys(errors).length > 0) return

  const res = await api.signup(values)
  if (!res.ok) {
    // Merge server-side errors into the same state.errors bag
    setErrors(res.errorsByField)
    // Or push a single error under one field
    setError('email', 'This email is already registered')
    return
  }
  clearErrors()
}`,
      },
    },
    {
      id: 'fb-validation-triggers',
      title: '4. Trigger matrix - when validation runs',
      content: `Accepted validation trigger values on \`useFormBridge({ validateOn, revalidateOn })\`:

| Trigger | Description |
| --- | --- |
| \`'onBlur'\` | Validate after blur |
| \`'onChange'\` | Validate on every change |
| \`'onSubmit'\` | Validate only on submit |
| \`'onTouched'\` | Validate after first blur, then on every subsequent change |

**Runtime defaults**

| Option | Default | Description |
| --- | --- | --- |
| \`validateOn\` | \`'onBlur'\` | First validation happens when the user leaves the field |
| \`revalidateOn\` | \`'onChange'\` | After first interaction, every keystroke re-runs validation |

Pick \`'onTouched'\` for the smoothest UX: no premature errors while the user is typing for the first time, instant feedback once they've committed. Pick \`'onSubmit'\` for minimal interruptions on long forms.`,
      code: {
        filename: 'triggers.tsx',
        lang: 'tsx',
        code: `const { Form, fields, state } = useFormBridge(signupSchema, {
  validateOn: 'onTouched',
  revalidateOn: 'onChange',
})`,
      },
    },
    {
      id: 'fb-validation-bridge',
      title: '5. External bridges (opt-in)',
      content: `Use a bridge when you already own a domain schema elsewhere in the app (Zod, Yup, Joi, Valibot) and want to reuse it as the validation source of truth. The bridge receives the current values and returns \`{ values, errors }\`, which the runtime merges into \`state.errors\` exactly like built-in validation.

| Bridge | Signature | Description |
| --- | --- | --- |
| \`zodBridge\` | \`(schema, options?)\` | Reuse an existing Zod schema |
| \`yupBridge\` | \`(schema, options?)\` | Reuse an existing Yup schema |
| \`joiBridge\` | \`(schema, options?)\` | Reuse an existing Joi schema |
| \`valibotBridge\` | \`(schema, options?)\` | Reuse an existing Valibot schema |

All bridges share the same options surface documented in the [Schema adapters](/docs/schema-validator-bridge-zod-yup-joi-valibot) section.

${RESOLVER_SHARED_OPTIONS_SURFACE}

You do **not** need a bridge to get cross-field validation, async checks, or i18n - \`createSchema()\` covers all of that natively. Reach for a bridge only when you have an *existing* Zod/Yup/Joi/Valibot schema you want to reuse as-is.`,
      code: {
        filename: 'bridge.tsx',
        lang: 'tsx',
        code: `import { z } from 'zod'
import { field, useFormBridge, zodBridge } from '@runilib/react-formbridge'

const zSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const formSchema = {
  email: field.email(),
  password: field.password(),
}

const { Form, fields, state } = useFormBridge(formSchema, {
  validatorBridge: zodBridge(zSchema),
})`,
      },
    },
    {
      id: 'fb-validation-parse',
      title: 'Bonus - parsing outside the form (server actions, tests, utilities)',
      content: `Because \`createSchema()\` exposes \`safeParse\` / \`safeParseAsync\` / \`validate\` / \`validateAsync\`, you can reuse the **exact same schema** outside of React - in server actions, tRPC procedures, background jobs, or tests - without mounting a form.

| Method | Signature | Description |
| --- | --- | --- |
| \`safeParse\` | \`(values) => ValidationResult\` | Synchronous, never throws |
| \`safeParseAsync\` | \`(values) => Promise<ValidationResult>\` | Runs sync + async refinements - recommended for server-side |
| \`validate\` | \`(values) => data\` | Strict variant - throws \`FormBridgeSchemaValidationError\` on failure |
| \`validateAsync\` | \`(values) => Promise<data>\` | Async strict variant |

The returned \`ValidationResult\` carries \`errorsByField\` (drop-in compatible with \`state.errors\`) and \`formLevelErrors\` (array of form-level messages). See the [createSchema() API](/docs/schema-api) section for the full result shape.

If that schema module is imported by server code, define it with \`@runilib/react-formbridge/schema\` so only the non-React surface is pulled into the server module graph.`,
      code: {
        filename: 'tripSchema.ts + server-action.ts',
        lang: 'ts',
        code: `// tripSchema.ts
import { createSchema, field } from '@runilib/react-formbridge/schema'

export const tripSchema = createSchema({
  email: field.email('Email'),
  phone: field.phone('FR').label('Phone'),
})
  .atLeastOne(['email', 'phone'], 'Provide at least an email or a phone.')

// server-action.ts
'use server'

import { tripSchema } from './tripSchema'

export async function bookTrip(raw: unknown) {
  const result = await tripSchema.safeParseAsync(raw as any)
  if (!result.success) {
    return { ok: false as const, errors: result.errorsByField, formLevelErrors: result.formLevelErrors }
  }
  await db.bookings.insert(result.data)
  return { ok: true as const }
}`,
      },
    },
  ],
};

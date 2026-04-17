# @runilib/react-formbridge

Schema-first forms for React and React Native.

`@runilib/react-formbridge` lets you define a form once and reuse the same API across web and native. It generates fields from a schema and handles validation, conditional logic, persistence, async options, and multi-step flows.

Full documentation: https://runilib.dev/docs/react-formbridge

> This repository is mirrored from the runilib monorepo.
> Active development happens in the monorepo.
> Open or in-progress work may appear here as automated draft PRs for visibility, and issues opened here can be mirrored back to the monorepo.

## What It Solves

- One form schema for React web and React Native
- Generated fields instead of manual wiring
- Built-in validation and conditional visibility
- Persistence, dynamic forms, readonly views, and wizard flows

## Install

```bash
npm install @runilib/react-formbridge
```

## Quick Example

```tsx
import type { FormSchema } from '@runilib/react-formbridge';
import { field, useFormBridge } from '@runilib/react-formbridge';

const schema = {
  email: field.email('Email').required('Email is required'),
  password: field.password('Password').required().strong(),
  terms: field.checkbox('I accept the terms').mustBeTrue(),
} satisfies FormSchema;

export function SignUpForm() {
  const { Form, fields } = useFormBridge(schema, {
    persist: { key: 'signup-form' },
  });

  return (
    <Form onSubmit={async (values) => console.log(values)}>
      <fields.email />
      <fields.password />
      <fields.terms />
      <Form.Submit>Create account</Form.Submit>
    </Form>
  );
}
```

## Type-safe field overrides

Generated fields expose only the override props that make sense for their platform and field type.

```tsx
<fields.email inputProps={{ autoComplete: 'email', inputMode: 'email' }} />
<fields.bio textareaProps={{ rows: 4 }} />
<fields.country selectProps={{ size: 5  }} />
```

- Text-like fields expose `inputProps`
- `textarea` fields expose `textareaProps` on web
- `select` fields expose `selectProps` on web
- Native fields do not expose web-only props such as `className`, `textareaProps`, or `selectProps`

When you need to annotate a schema, prefer `satisfies FormSchema` over `: FormSchema` so TypeScript keeps the exact field types and the right autocomplete for each generated field.

## React Native TypeScript

To make TypeScript and your IDE resolve the native type surface, enable the `react-native` condition in your app `tsconfig.json`:

```json
{
  "compilerOptions": {
    "customConditions": ["react-native"]
  }
}
```

## Documentation

- Docs and guides: https://runilib.dev/docs/react-formbridge
- API reference: https://runilib.dev/docs/react-formbridge

<p align="center">
  <img alt="react-formbridge" src="./assets/logo-blue.svg" width="760" />
</p>

<p align="center">
  <strong>Schema-first forms for React and React Native.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@runilib/react-formbridge"><img alt="npm version" src="https://img.shields.io/npm/v/@runilib/react-formbridge?color=0f6fdc"></a>
  <a href="https://www.npmjs.com/package/@runilib/react-formbridge"><img alt="downloads per week" src="https://img.shields.io/npm/dw/@runilib/react-formbridge?color=22c55e&label=downloads%2Fweek"></a>
  <a href="https://www.npmjs.com/package/@runilib/react-formbridge"><img alt="total downloads" src="https://img.shields.io/npm/dt/@runilib/react-formbridge?color=22c55e&label=downloads"></a>
  <a href="./LICENSE"><img alt="license" src="https://img.shields.io/npm/l/@runilib/react-formbridge?color=10b981"></a>
  <a href="https://react-formbridge.runilib.dev"><img alt="docs" src="https://img.shields.io/badge/docs-react--formbridge.runilib.dev-0f6fdc"></a>
  <a href="https://github.com/runilib/react-formbridge/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22"><img alt="good first issues" src="https://img.shields.io/github/issues-search/runilib/react-formbridge?query=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22&color=7057ff&label=good%20first%20issues"></a>
</p>

> Part of the [**runilib**](https://runilib.dev) ecosystem - React & React Native libraries that share the same API on web and native.

`@runilib/react-formbridge` is the forms package of runilib. It lets you define a form once and reuse the same headless API across web and native. It handles validation, conditional logic, persistence, async options, masked values, OTP helpers, and multi-step flows while you render your own inputs.

Full documentation: https://react-formbridge.runilib.dev

> This repository is mirrored from the runilib monorepo.
> Active development happens in the monorepo.
> Open or in-progress work may appear here as automated draft PRs for visibility, and issues opened here can be mirrored back to the monorepo.

## What It Solves

- One form schema for React web and React Native
- Headless field controllers instead of generated UI
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
  const form = useFormBridge(schema, {
    persist: { key: 'signup-form' },
  });
  const email = form.fieldController('email');
  const password = form.fieldController('password');
  const terms = form.fieldController('terms');

  return (
    <form.Form onSubmit={async (values) => console.log(values)}>
      <form.FieldLabel name="email" />
      <input
        id="email"
        type="email"
        value={email.value}
        placeholder={email.placeholder}
        disabled={email.disabled}
        onChange={(event) => email.onChange(event.target.value)}
        onBlur={email.onBlur}
      />
      <form.FieldError name="email" />

      <form.FieldLabel name="password" />
      <input
        id="password"
        type="password"
        value={password.value}
        disabled={password.disabled}
        onChange={(event) => password.onChange(event.target.value)}
        onBlur={password.onBlur}
      />
      <form.FieldError name="password" />

      <label>
        <input
          type="checkbox"
          checked={terms.value}
          disabled={terms.disabled}
          onChange={(event) => terms.onChange(event.target.checked)}
          onBlur={terms.onBlur}
        />
        I accept the terms
      </label>
      <form.FieldError name="terms" />

      <button type="submit" disabled={form.state.isSubmitting}>
        Create account
      </button>
    </form.Form>
  );
}
```

## Headless Fields

`form.fieldController(name)` returns everything needed to connect your own UI:

```tsx
const phone = form.fieldController('phone');

<input
  value={phone.displayValue}
  onChange={(event) => phone.onChange(event.target.value)}
/>;
```

- `value`, `error`, `touched`, `dirty`, `required`, `disabled`, `visible`
- `onChange`, `onBlur`, `onFocus`, `setValue`, `validate`, `setError`, `clearError`
- `options` for select/radio fields
- `displayValue`, `rawValue`, `format`, `unmask` for masked fields
- `digits`, `setDigit`, `otpComplete` for OTP fields

When you need to annotate a schema, prefer `satisfies FormSchema` over `: FormSchema` so TypeScript keeps the exact field types and controller autocomplete.

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

- Website: https://react-formbridge.runilib.dev
- API reference: https://react-formbridge.runilib.dev/docs
- runilib ecosystem overview: <https://runilib.dev>

## Contributing

Bug reports and feature requests are welcome in [this repo's issues](https://github.com/runilib/react-formbridge/issues). They are mirrored to the monorepo where the work happens.

If you want to change the package itself, work from the monorepo and use this flow before opening a PR:

1. Make the code, docs, and test updates in `packages/react-formbridge`.
2. Run `yarn changeset` from the monorepo root and include `@runilib/react-formbridge`.
3. Run `yarn check:fix`, `yarn typecheck`, and `yarn test`.
4. Optionally run `npm run --prefix packages/react-formbridge prepublishOnly` for an extra publish-safety check.
5. Open the PR against the monorepo `main` branch. After merge, GitHub creates a package-specific release PR so this library can be published independently from the others.

Looking for something to start with? Browse [good first issues](https://github.com/runilib/react-formbridge/labels/good%20first%20issue).

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

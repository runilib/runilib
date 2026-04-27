import type { LibraryDoc } from './../../../types/index';

export const hostHelpersSection: LibraryDoc['sections'][number] = {
  id: 'fb-host-helpers',
  title: 'Host Components Helpers (FieldHost, SubmitHost, FormHost)',
  content: `\`FieldHost\`, \`SubmitHost\`, and \`FormHost\` are **stable wrapper components** exported from \`@runilib/react-formbridge\`. They exist for one specific reason: styling systems like \`styled-components\`, \`styled-components/native\`, \`emotion\`, \`panda\`, \`stitches\`, and any other wrapper-based styling API need a **stable component reference** to attach styles to - and the components returned by \`useFormBridge()\` (\`form.Form\`, \`form.fields.email\`, \`form.Form.Submit\`) are generated at runtime inside the hook, so their identity changes on every render of the owning component.

Host helpers solve that: they are regular, importable, module-level React components that **forward** the actual runtime component through a prop (\`form\`, \`field\`, or \`submit\`). You style the host once at module scope, and the host renders whichever runtime component you pass in.

- \`FieldHost\` - renders any generated field component passed through its \`field\` prop (e.g. \`form.fields.email\`, \`form.fields.phone\`).
- \`SubmitHost\` - renders \`Form.Submit\` through a stable \`submit\` prop.
- \`FormHost\` - renders the generated \`Form\` component through a stable \`form\` prop.

They are **passthrough components** - they do not add behavior, state, or extra markup. Every prop you pass (besides \`field\` / \`submit\` / \`form\`) is forwarded to the underlying runtime component as-is, and every built-in option (\`style\`, \`className\`, \`classNames\`, \`styles\`, \`inputProps\`, \`disabled\`, \`loadingText\`, …) keeps working exactly the way it does on the generated components. That now includes the platform-native attributes exposed by the wrapped component itself: \`FormHost\` inherits the same native form / wrapper props as \`Form\`, and \`SubmitHost\` inherits the same native button / pressable props as \`Form.Submit\`. Types are preserved end-to-end: \`FieldHost\` is generic over the field's extra props, \`FormHost\` over the schema, and \`SubmitHost\` over the platform.`,
  codeTabs: [
    {
      filename: 'WhyHostsExist.tsx',
      lang: 'tsx',
      code: `// ❌ This does NOT work reliably with styled-components / emotion / etc.
//
// form.fields.email is created fresh every time the owning component
// re-renders, so \`styled(form.fields.email)\` would produce a new styled
// component on every render - breaking memoization and sometimes React's
// component identity checks.
const form = useFormBridge(schema)
const StyledEmail = styled(form.fields.email)\`…\` // 🔥 unstable reference

// ✅ Host helpers are module-level components with a fixed identity.
// You style them once, at the top of the file, and hand the runtime
// component in as a prop at render time.
import { FieldHost } from '@runilib/react-formbridge'

const StyledEmail = styled(FieldHost)\`
  & input { border-radius: 16px; }
\`

// Later, inside your component:
<StyledEmail field={form.fields.email} />`,
    },
    {
      filename: 'StyledComponents.web.tsx',
      lang: 'tsx',
      code: `import {
  FieldHost,
  FormHost,
  SubmitHost,
  field,
  useFormBridge,
} from '@runilib/react-formbridge'
import styled from 'styled-components'

// 1. Declare the styled hosts once, at module scope.
const StyledForm = styled(FormHost)\`
  display: flex;
  flex-direction: column;
  gap: 16px;
\`

const EmailField = styled(FieldHost).attrs({
  inputProps: { autoComplete: 'email', inputMode: 'email' },
})\`
  & input {
    border-radius: 16px;
    border: 1px solid rgba(56, 189, 248, 0.28);
    background: rgba(15, 23, 42, 0.74);
    color: #f8fafc;
  }
\`

const SubmitButton = styled(SubmitHost)\`
  min-width: 196px;
  border-radius: 16px;
  background: linear-gradient(135deg, #38bdf8, #22c55e);
  color: #04121c;
  font-weight: 800;
\`

// 2. Hand the real runtime components in at render time.
export function ContactForm() {
  const form = useFormBridge({
    contactEmail: field.email('Contact email').required(),
  })

  return (
    <StyledForm form={form.Form} onSubmit={save}>
      <EmailField field={form.fields.contactEmail} />
      <SubmitButton submit={form.Form.Submit}>Save</SubmitButton>
    </StyledForm>
  )
}`,
    },
    {
      filename: 'StyledComponents.native.tsx',
      lang: 'tsx',
      code: `import {
  FieldHost,
  FormHost,
  SubmitHost,
  field,
  useFormBridge,
} from '@runilib/react-formbridge'
import styled from 'styled-components/native'

const StyledForm = styled(FormHost)\`
  gap: 16px;
\`

const EmailField = styled(FieldHost).attrs({
  inputProps: {
    autoComplete: 'email',
    keyboardType: 'email-address',
  },
})\`
  padding: 12px 14px;
  border-radius: 14px;
  background-color: #0b1220;
  color: #f8fafc;
\`

const SubmitButton = styled(SubmitHost)\`
  min-height: 52px;
  border-radius: 14px;
  background-color: #22c55e;
\`

export function ContactScreen() {
  const form = useFormBridge({
    contactEmail: field.email('Contact email').required(),
  })

  return (
    <StyledForm form={form.Form} onSubmit={save}>
      <EmailField field={form.fields.contactEmail} />
      <SubmitButton submit={form.Form.Submit}>Save</SubmitButton>
    </StyledForm>
  )
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-host-helpers-why',
      title: 'Why they exist',
      content: `\`useFormBridge()\` returns components that are **closed over the current runtime**: \`form.Form\`, \`form.Form.Submit\`, and every \`form.fields.*\` component are functions created *inside* the hook so they can carry the form's state, validation pipeline, and analytics hooks without a context lookup.

That design is great for DX, but it means their component reference is not stable across renders - re-mounting the parent, re-running the hook, or switching to a new schema produces brand new component functions. Styling libraries that use \`styled(Component)\`, \`emotion.styled(Component)\`, \`panda.cva(Component)\`, etc. all assume you pass them a **module-level component** whose identity never changes. If you pass them a freshly-created function on each render, you get:

- A new styled component generated on every render (wasted work, potential memory churn).
- Broken \`React.memo\` / \`useMemo\` optimizations downstream.
- Occasional remounts of the styled element, which resets focus, selection, and uncontrolled state.
- Confusing DevTools entries that change names on every render.

Host helpers are the fix. They are defined once at the module level, their identity is stable forever, and they render the real runtime component via a prop. You get all the benefits of schema-driven fields *and* all the ergonomics of wrapper-based styling libraries at the same time.`,
    },
    {
      id: 'fb-host-helpers-when',
      title: 'When to use them',
      content: `Reach for host helpers when **both** of the following are true:

- You are styling FormBridge with a **wrapper-based** library: \`styled-components\`, \`styled-components/native\`, \`emotion\` (\`styled()\`), \`panda\` (\`cva(Component)\`), \`stitches\`, \`linaria\`, \`goober\`, or anything else that expects a stable component reference.
- You want to keep using the generated components (\`form.Form\`, \`form.fields.*\`, \`form.Form.Submit\`) instead of dropping down to [fieldController()](/docs/fieldcontroller) or [field.custom()](/docs/field-custom).

You do **not** need host helpers when:

- You are styling with CSS classes, Tailwind, CSS Modules, inline \`style\` props, or the built-in \`globalDefaults\` options - those work directly on the generated components.
- You already need to replace the whole field renderer (custom trigger, modal picker, composite widget). In that case, \`fieldController()\` gives you more control.
- You are writing a brand new field type that no builder covers. In that case, \`field.custom()\` is the right tool.

In short: host helpers are the bridge between FormBridge's schema-driven runtime and styling libraries that require module-level components. They add zero behavior; they only fix identity.`,
    },
    {
      id: 'fb-host-helpers-props',
      title: 'Props surface',
      content: `Each host helper accepts **its own special prop** plus every prop of the underlying component. Nothing is filtered - FormBridge just calls \`React.createElement\` with the component you passed in and spreads the rest of the props onto it.

That means the native platform attributes of the wrapped runtime component stay available too. For example, \`<FormHost form={form.Form} method="post" aria-label="Checkout" />\` works on web, and \`<SubmitHost submit={form.Form.Submit} testID="checkout-submit" />\` works on native.

| Host | Shape | Forwarded surface | Typing |
| --- | --- | --- | --- |
| \`FieldHost\` | \`{ field: FieldComponent } & FieldProps\` | \`ui\`, \`style\`, \`className\`, \`inputProps\`, \`disabled\`, platform-specific props, … | Generic over \`TProps extends ExtraFieldProps\` |
| \`SubmitHost\` | \`{ submit: SubmitButtonComponent } & SubmitButtonProps\` | \`children\`, \`loadingText\`, \`disabled\`, \`style\`, \`className\`, native button / pressable attrs, … | Typed per platform (\`'web'\` &#124; \`'native'\`) |
| \`FormHost\` | \`{ form: FormComponent } & FormProps<Schema>\` | \`onSubmit\`, \`onError\`, \`onSubmitError\`, \`children\`, \`style\`, \`className\`, native form / wrapper attrs, … | Generic over the schema |

Because the host just forwards, you can combine \`styled(FieldHost).attrs({ classNames: { … } })\` with inline props at render time - the two are merged the way they would be on the raw field.`,
    },
    {
      id: 'fb-host-helpers-gotchas',
      title: 'Gotchas',
      content: `- **You must pass the runtime component explicitly.** Host helpers do not read from context - \`<FieldHost field={form.fields.email} />\` is mandatory. There is no "current field" fallback.
- **Define the styled host at module scope, never inside a component.** Redefining \`const StyledField = styled(FieldHost)\` on every render brings back the exact identity problem the helpers were designed to solve.
- **Keep the field / submit / form prop reference stable** across renders. \`form.fields.email\` from the same \`useFormBridge()\` call is stable within a single render tree; do not recreate the hook conditionally above it.
- **Host helpers do not work for fully custom UI.** If you need to replace the markup entirely, use [fieldController()](/docs/fieldcontroller). Host helpers only help you *wrap* the generated components.
- **Field override props still apply.** Inline-styling with props like \`classNames\`, \`styles\`, \`inputProps\` (or with \`globalDefaults\`) keeps working inside a host-wrapped component; wrapper styles compose on top of - not in place of - FormBridge's own rendering.`,
    },
  ],
};

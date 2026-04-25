import type { LibraryDoc } from './../../../types/index';
import { FIELD_CONTROLLER_SURFACE } from '../constants';

export const fieldControllerSection: LibraryDoc['sections'][number] = {
  id: 'fb-field-controller',
  title: 'fieldController()',
  content: `\`form.fieldController(name)\` is FormBridge's headless escape hatch for a single field. It returns a fully reactive, type-safe runtime object that carries **everything a renderer needs** - current value, error, touched/dirty/validating flags, label, placeholder, hint, options, visibility, change/blur/focus handlers, imperative actions, and a focus bridge - while the schema keeps owning the contract (type, validation, conditional rules, persistence, analytics).

Reach for \`fieldController\` when the generated \`fields.*\` component is not flexible enough, but you still want the field to behave like a first-class schema field. You get total control over the markup without re-implementing form state, validation timing, or error display.

- Great for: custom masked inputs, bespoke select triggers with bottom sheets or popovers, design-system wrappers, composite widgets (slider + numeric input + presets), inline editors, and any flow that needs imperative focus control.
- Unlike \`field.custom()\`, the field keeps its original builder semantics - masked fields still run mask validation, selects still expose their \`options\`, phones still normalize to E.164, OTP fields still expose \`otpLength\`, and so on.
- Unlike builder-level \`.render(fn)\`, the controller can be consumed anywhere in your component tree and plays nicely with surrounding layout, modals, previews, extra buttons, or custom error UI.
- It is **fully reactive**: reading \`controller.value\`, \`controller.error\`, \`controller.visible\`, etc. subscribes the calling component to that field - no manual \`watch()\` needed.`,
  codeTabs: [
    {
      filename: 'BasicBinding.web.tsx',
      lang: 'tsx',
      code: `import { field, useFormBridge } from '@runilib/react-formbridge'

const form = useFormBridge({
  workspaceName: field.text('Workspace').required(),
  launchAccessCode: field
    .masked('OPS-9999-LL')
    .label('Launch access code')
    .required()
    .validateComplete('Complete the launch access code.'),
})

const accessCode = form.fieldController('launchAccessCode')

return (
  <div className="field">
    <label htmlFor="launch-access-code">
      {accessCode.label}
      {accessCode.required ? <span aria-hidden> *</span> : null}
    </label>

    <input
      id="launch-access-code"
      ref={(node) => accessCode.registerFocusable(node)}
      value={String(accessCode.value ?? '')}
      placeholder={accessCode.placeholder}
      disabled={accessCode.disabled}
      aria-invalid={Boolean(accessCode.error)}
      aria-describedby={accessCode.error ? 'launch-access-code-error' : undefined}
      onChange={(event) => accessCode.onChange(event.target.value)}
      onBlur={accessCode.onBlur}
      onFocus={accessCode.onFocus}
    />

    {accessCode.hint ? <p className="hint">{accessCode.hint}</p> : null}
    {accessCode.error ? (
      <p id="launch-access-code-error" className="error" role="alert">
        {accessCode.error}
      </p>
    ) : null}

    <button type="button" onClick={() => accessCode.focus()}>
      Focus custom field
    </button>
  </div>
)`,
    },
    {
      filename: 'CustomSelectTrigger.native.tsx',
      lang: 'tsx',
      code: `import { useEffect, useState } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import { field, useFormBridge } from '@runilib/react-formbridge'

const form = useFormBridge({
  routingMode: field
    .select('Routing mode')
    .options([
      { label: 'Auto assign', value: 'auto' },
      { label: 'Manual review', value: 'review' },
      { label: 'Priority route', value: 'priority' },
    ])
    .defaultSelected('review')
    .required(),
})

const routingMode = form.fieldController('routingMode')
const [pickerOpen, setPickerOpen] = useState(false)

// Bridge the controller's focus() / blur() to your own picker state,
// so analytics, conditional rules, and parent forms all stay in sync.
useEffect(() => {
  routingMode.registerFocusable({
    focus: () => setPickerOpen(true),
    blur: () => setPickerOpen(false),
  })
  return () => routingMode.registerFocusable(null)
}, [routingMode])

const selectedLabel = routingMode.options?.find(
  (option) => option.value === routingMode.value,
)?.label

return (
  <View>
    <Pressable onPress={() => routingMode.focus()}>
      <Text>{selectedLabel ?? routingMode.placeholder ?? 'Pick a routing mode'}</Text>
    </Pressable>

    {routingMode.error ? <Text style={{ color: 'red' }}>{routingMode.error}</Text> : null}

    <Modal visible={pickerOpen} transparent animationType="slide">
      <View>
        {routingMode.options?.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => {
              routingMode.onChange(option.value)
              routingMode.onBlur()
            }}
          >
            <Text>{option.label}</Text>
          </Pressable>
        ))}
      </View>
    </Modal>
  </View>
)`,
    },
    {
      filename: 'ServerErrorMapping.tsx',
      lang: 'tsx',
      code: `// Map a server response onto individual fields without breaking the
// schema contract. The controller's setError() / clearError() speak the
// same language as built-in validation.

const email = form.fieldController('email')
const username = form.fieldController('username')

async function handleSubmit(values: typeof form.state.values) {
  try {
    await api.signup(values)
  } catch (error) {
    if (error.code === 'EMAIL_TAKEN') {
      email.setError('This email is already registered')
      email.focus()
    }
    if (error.code === 'USERNAME_RESERVED') {
      username.setError('Pick another username - this one is reserved')
    }
  }
}

// Clear the server-side error as soon as the user edits the field:
useEffect(() => {
  if (email.dirty && email.error === 'This email is already registered') {
    email.clearError()
  }
}, [email.value, email.dirty, email.error])`,
    },
    {
      filename: 'CompositeWidget.tsx',
      lang: 'tsx',
      code: `// Slider + numeric input + presets, all backed by a single schema field.
// The controller keeps them in sync without leaking store details.

const budget = form.fieldController('monthlyBudget')

return (
  <fieldset disabled={budget.disabled || !budget.visible}>
    <legend>{budget.label}</legend>

    <input
      type="range"
      min={0}
      max={5000}
      step={50}
      value={Number(budget.value ?? 0)}
      onChange={(event) => budget.onChange(Number(event.target.value))}
      onBlur={budget.onBlur}
    />

    <input
      type="number"
      value={Number(budget.value ?? 0)}
      onChange={(event) => budget.onChange(Number(event.target.value))}
      onBlur={budget.onBlur}
    />

    <div className="presets">
      {[500, 1000, 2500].map((preset) => (
        <button
          key={preset}
          type="button"
          onClick={() => {
            budget.setValue(preset) // imperative, still triggers validation
            budget.focus()
          }}
        >
          $ {preset}
        </button>
      ))}
    </div>

    {budget.error ? <p className="error">{budget.error}</p> : null}
  </fieldset>
)`,
    },
  ],
  subsections: [
    {
      id: 'fb-field-controller-when',
      title: 'When to reach for it',
      content: `Use \`fieldController(name)\` when **all** of the following are true:

- The field should stay typed as one of the built-in builder types (\`text\`, \`email\`, \`select\`, \`radio\`, \`masked\`, \`phone\`, \`otp\`, \`date\`, \`file\`, \`number\`, …) so you inherit its validation, normalization, and conditional semantics.
- The default generated component doesn't fit - you need custom chrome, imperative focus, a modal/sheet trigger, extra buttons, a composite widget, or a shared design-system wrapper.
- You still want the renderer to be driven by reactive state (value, error, touched, validating, visible) so conditional rules, persistence, and analytics keep working.

If you only need to restyle the default renderer, prefer [globalDefaults](/docs/globalDefaults) or per-field props first. If you need a **brand new field type** that no builder covers, jump to [field.custom()](/docs/field-custom) instead.`,
    },
    {
      id: 'fb-field-controller-surface',
      title: 'Surface',
      content: `${FIELD_CONTROLLER_SURFACE}

Every property is type-narrowed against the schema: \`value\` is typed as the exact value type of the field (for example \`string\` for \`field.text\`, \`boolean\` for \`field.checkbox\`, \`SelectOption['value']\` for \`field.select\`), and \`options\` / \`otpLength\` only appear on the field types that actually expose them.`,
    },
    {
      id: 'fb-field-controller-focus-bridge',
      title: 'Focus bridge (registerFocusable)',
      content: `\`controller.focus()\` and \`controller.blur()\` do nothing by default - you have to tell FormBridge *how* to focus your custom element. That is what \`registerFocusable(target)\` is for.

- **Web** - pass a DOM node via a ref callback: \`ref={(node) => controller.registerFocusable(node)}\`. FormBridge will call \`node.focus()\` / \`node.blur()\`.
- **Native** - pass a React Native \`TextInput\` ref the same way. FormBridge uses its imperative \`focus()\` / \`blur()\` methods.
- **Custom widgets** - pass any object of shape \`{ focus?: () => void; blur?: () => void }\`. This is how you wire modals, bottom sheets, rich editors, or third-party components. Call \`registerFocusable(null)\` on unmount to detach.

Once registered, FormBridge can drive focus from anywhere - auto-focus on mount, focus the first invalid field after a failed submit, jump to a field when a server-side error lands, or chain focus through a wizard step.`,
    },
    {
      id: 'fb-field-controller-gotchas',
      title: 'Gotchas & best practices',
      content: `- **Always call \`onBlur()\`** after the user finishes interacting with a custom trigger (closing a modal, leaving a popover). Without it, \`touched\` stays \`false\` and \`validateOn: 'onBlur'\` / \`'onTouched'\` never fires.
- **Respect \`visible\`** - when a conditional rule hides the field, either render nothing or render it \`disabled\`. Hidden fields still hold a value but should not be editable.
- **Respect \`disabled\`** - the runtime sets it from the schema and from conditional rules; forwarding it keeps the form consistent with other fields.
- **Prefer \`onChange\` over \`setValue\`** for user-driven edits: \`onChange\` fires the full update pipeline (change handlers, validation, analytics), while \`setValue\` is meant for imperative updates (presets, paste handlers, resets).
- **Don't read \`state.values[name]\` directly** for rendering - read \`controller.value\`. The controller subscribes the component to that field only, avoiding re-renders on unrelated updates.
- **Use \`controller.descriptor\`** (advanced) when you need to inspect the resolved builder descriptor - for example to read the mask pattern, the min/max of a \`field.number()\`, or the accepted MIME types of a \`field.file()\` - without re-declaring them in the renderer.`,
    },
    {
      id: 'fb-field-controller-notes',
      title: 'How it compares to other escape hatches',
      content: `- Prefer \`fieldController(name)\` over [field.custom()](/docs/field-custom) when you still want a built-in field type such as \`select\`, \`masked\`, \`phone\`, or \`otp\`.
- Prefer \`fieldController(name)\` over builder-level \`.render(fn)\` when the custom UI needs surrounding layout, external buttons, modal state, or imperative focus control from outside the field.
- Prefer \`renderPicker\` (on \`field.select\` / \`field.radio\` / \`field.date\`) over \`fieldController(name)\` when only the picker surface changes and the built-in field trigger is already good enough.
- Prefer [globalDefaults](/docs/globalDefaults) or per-field props over \`fieldController\` when the change is purely visual - styling, spacing, label alignment - and the underlying markup is fine.`,
    },
  ],
};

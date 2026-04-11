import type { LibraryDoc } from './../../../types/index';
import { FIELD_CONTROLLER_SURFACE } from '../constants';

export const fieldControllerSection: LibraryDoc['sections'][number] = {
  id: 'fb-field-controller',
  title: 'fieldController()',
  content: `Use \`form.fieldController(name)\` when the schema field type is still correct, but the rendered UI should be entirely yours.

- Great for custom masked inputs, custom select triggers and sheets, design-system wrappers, composite widgets, or imperative focus flows
- Unlike \`field.custom()\`, the field keeps its original builder semantics: masked fields keep mask validation, selects keep options, phones keep phone metadata, and so on
- Unlike builder-level \`.render(fn)\`, the controller can be consumed anywhere in your component tree and plays nicely with surrounding layout, modals, previews, and extra buttons`,
  codeTabs: [
    {
      filename: 'FieldController.web.tsx',
      lang: 'tsx',
      code: `const form = useFormBridge({
  workspaceName: field.text('Workspace').required(),
  launchAccessCode: field
    .masked('OPS-9999-LL')
    .label('Launch access code')
    .required()
    .validateComplete('Complete the launch access code.'),
})

const accessCode = form.fieldController('launchAccessCode')

<input
  ref={(node) => accessCode.registerFocusable(node)}
  value={String(accessCode.value ?? '')}
  onChange={(event) => accessCode.onChange(event.target.value)}
  onBlur={accessCode.onBlur}
  onFocus={accessCode.onFocus}
/>

<button type="button" onClick={() => accessCode.focus()}>
  Focus custom field
</button>`,
    },
    {
      filename: 'FieldController.native.tsx',
      lang: 'tsx',
      code: `const form = useFormBridge({
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

useEffect(() => {
  routingMode.registerFocusable({
    focus: () => setPickerOpen(true),
    blur: () => setPickerOpen(false),
  })

  return () => routingMode.registerFocusable(null)
}, [routingMode])

<Pressable onPress={() => routingMode.focus()}>
  <Text>
    {routingMode.options?.find((option) => option.value === routingMode.value)?.label}
  </Text>
</Pressable>`,
    },
  ],
  subsections: [
    {
      id: 'fb-field-controller-surface',
      title: 'Surface',
      content: `${FIELD_CONTROLLER_SURFACE}`,
    },
    {
      id: 'fb-field-controller-notes',
      title: 'How it compares to other escape hatches',
      content: `- Prefer \`fieldController(name)\` over \`field.custom()\` when you still want a built-in field type such as \`select\`, \`masked\`, \`phone\`, or \`otp\`
- Prefer \`fieldController(name)\` over \`.render(fn)\` when the custom UI needs surrounding layout, external buttons, modal state, or imperative focus control
- Prefer \`renderPicker\` over \`fieldController(name)\` when only the picker surface changes and the built-in field trigger is already good enough`,
    },
  ],
};

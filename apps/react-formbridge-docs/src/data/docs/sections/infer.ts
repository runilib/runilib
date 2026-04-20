import type { LibraryDoc } from './../../../types/index';
import { INFER_AUTODETECTION_SURFACE, INFER_OPTIONS_SURFACE } from '../constants';

export const inferSection: LibraryDoc['sections'][number] = {
  id: 'fb-infer',

  title: 'field.infer()',
  content: `\`field.infer(obj, overrides?)\` generates a complete form schema from an existing JavaScript object. It auto-detects field types based on key names and value types, so you can go from a plain object to a working form in one line.

The same helper is also exported as \`inferFromObject(obj, overrides?)\` when you prefer a direct utility import.

**How auto-detection works:**

| Strategy | Detection | Example |
| --- | --- | --- |
| Key-based | Keys containing \`email\`, \`password\`, \`phone\`, \`url\`, \`bio\`, \`description\`, \`date\`, \`active\`, \`enabled\`, \`toggle\`, … are mapped to their matching field type | \`email\` → \`field.email()\` |
| Value-based | \`boolean\` → switch, \`number\` → number, \`Array\` → select, everything else → text | \`true\` → \`field.switch()\` |
| Labels | Keys are prettified automatically | \`firstName\` → "First name", \`phone_number\` → "Phone number" |

The returned schema can be spread and selectively overridden with explicit builders - inferred fields and hand-written fields mix freely.`,
  code: {
    filename: 'InferBasic.ts',
    lang: 'ts',

    code: `import { field } from '@runilib/react-formbridge'

// Pass any object - field.infer reads keys + values to build the schema
const user = {
  firstName: 'Ava',
  email: 'ava@example.com',
  age: 32,
  active: true,
}

const schema = {
  // Infer all fields automatically
  ...field.infer(user),
  // Override a specific field with an explicit builder
  email: field.email('Email').required(),
}

// Result: firstName → text, email → email (overridden),
//         age → number, active → switch`,
  },
  subsections: [
    {
      id: 'fb-infer-overrides',
      title: 'Per-field overrides',
      content: `The second argument lets you customise individual inferred fields without replacing them entirely.

${INFER_OPTIONS_SURFACE}`,
      code: {
        filename: 'InferOverrides.ts',
        lang: 'ts',

        code: `import { field } from '@runilib/react-formbridge'

const product = {
  name: '',
  description: '',
  price: 0,
  category: '',
  inStock: true,
}

const schema = field.infer(product, {
  name:        { required: true, min: 2, max: 100 },
  description: { type: 'textarea', placeholder: 'Describe the product...' },
  price:       { required: true, min: 0, hint: 'Price in euros' },
  category:    { type: 'select', options: ['Electronics', 'Clothing', 'Books'] },
  inStock:     { label: 'Available in stock' },
})`,
      },
    },
    {
      id: 'fb-infer-edit-form',
      title: 'Edit form pattern',
      content: `\`field.infer()\` is ideal for edit/update forms where you already have the entity data. The object values become the default values of each field, so the form is pre-filled automatically.`,
      code: {
        filename: 'InferEditForm.tsx',
        lang: 'tsx',

        code: `import { field, useFormBridge } from '@runilib/react-formbridge'

function EditUserForm({ user }: { user: User }) {
  // Schema is generated from the existing user - form is pre-filled
  const schema = field.infer(user, {
    email:    { required: 'Email is required' },
    password: { hidden: true },
    role:     { type: 'select', options: ['admin', 'user', 'viewer'] },
  })

  const { Form, fields } = useFormBridge(schema)

  return (
    <Form onSubmit={(values) => updateUser(user.id, values)}>
      <fields.email />
      <fields.role />
      <Form.Submit>Save user</Form.Submit>
    </Form>
  )
}`,
      },
    },
    {
      id: 'fb-infer-notes',
      title: 'When to use inference vs explicit builders',
      content: `Inference shines for rapid scaffolding - admin panels, CRUD tools, internal dashboards, prototypes. For production user-facing forms, explicit builders give you full control over labels, validation messages, conditional logic, and UX polish.

${INFER_AUTODETECTION_SURFACE}

**Tip:** start with \`field.infer()\` to bootstrap quickly, then progressively replace inferred fields with explicit builders as your form requirements grow.`,
    },
  ],
};

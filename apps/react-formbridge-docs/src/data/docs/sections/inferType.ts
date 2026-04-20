import type { LibraryDoc } from './../../../types/index';
import { INFER_OPTIONS_SURFACE } from '../constants';

export const inferTypeSection: LibraryDoc['sections'][number] = {
  id: 'fb-infer-type',

  title: 'field.inferType()',
  content: `\`field.inferType<T>(fields)\` generates a schema purely from a TypeScript type - no object instance needed. You describe each property with its configuration, and the schema is fully typed against \`T\`.

The same helper is also exported as \`inferFromType<T>(fields)\` when you prefer a direct utility import.

This is useful when:

| Use case | Why |
| --- | --- |
| Creation form | You don't have an existing object to infer from |
| Type-first schema | You want the schema to be statically typed against a specific interface |
| Explicit defaults | You need to define default values explicitly per field |`,
  code: {
    filename: 'InferType.ts',
    lang: 'ts',

    code: `import { field } from '@runilib/react-formbridge'

type User = {
  name: string
  email: string
  age: number
  active: boolean
}

// Schema is typed as Record<keyof User, FieldDescriptor>
const schema = field.inferType<User>({
  name:   { label: 'Full name', required: true, min: 2 },
  email:  { label: 'Email', required: true },
  age:    { label: 'Age', min: 18, defaultValue: 18 },
  active: { label: 'Active', type: 'switch' },
})`,
  },
  subsections: [
    {
      id: 'fb-infer-type-defaults',
      title: 'Default values',
      content: `Each field entry accepts an optional \`defaultValue\`. The rest of the field entry surface is the same \`InferFieldOptions\` contract used by \`field.infer()\`.

${INFER_OPTIONS_SURFACE}

If \`defaultValue\` is omitted, a sensible default is derived from the field type:

| Field type | Auto-derived default |
| --- | --- |
| \`number\` | \`0\` |
| \`checkbox\` / \`switch\` | \`false\` |
| Everything else | \`''\` (empty string) |`,
      code: {
        filename: 'InferTypeDefaults.ts',
        lang: 'ts',

        code: `import { field } from '@runilib/react-formbridge'

type Settings = {
  theme: string
  fontSize: number
  notifications: boolean
}

const schema = field.inferType<Settings>({
  theme:         { label: 'Theme', type: 'select',
                   options: ['light', 'dark', 'auto'], defaultValue: 'auto' },
  fontSize:      { label: 'Font size', min: 10, max: 32, defaultValue: 16 },
  notifications: { label: 'Enable notifications', type: 'switch' },
  // notifications defaults to false (switch type)
})`,
      },
    },
    {
      id: 'fb-infer-type-vs-infer',
      title: 'field.infer() vs field.inferType()',
      content: `| | \`field.infer(obj)\` | \`field.inferType<T>(fields)\` |
|---|---|---|
| **Input** | A runtime object with values | A type + field config map |
| **Default values** | Taken from the object values | Explicit \`defaultValue\` or auto-derived |
| **Type detection** | Automatic from keys & values | You specify \`type\` manually |
| **Best for** | Edit forms, pre-filled data | Creation forms, type-first schemas |
| **Typing** | Inferred from the object shape | Explicit generic \`<T>\` |`,
    },
  ],
};

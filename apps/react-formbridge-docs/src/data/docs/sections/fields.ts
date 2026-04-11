import type { LibraryDoc } from './../../../types/index';
import {
  GENERATED_FIELD_COMMON_PROPS_SURFACE,
  GENERATED_FIELD_UI_SURFACE,
} from '../constants';

export const fieldsSection: LibraryDoc['sections'][number] = {
  id: 'fb-fields',
  title: 'Generated fields',
  content: `\`fields.name\` renders the correct platform field for each schema key.

- You never manually register inputs or bind value/error state for standard fields
- Each generated component already knows its validation, current value, hidden/disabled state, and platform renderer
- Per-render overrides stay possible for labels, hints, placeholders, and presentation without mutating the original schema
- When you need a fully custom DOM/native tree but still want the same schema field, move to \`form.fieldController(name)\` instead of rewriting the field as \`field.custom()\``,
  subsections: [
    {
      id: 'fb-field-props',
      title: 'Props',
      content: `${GENERATED_FIELD_COMMON_PROPS_SURFACE}

${GENERATED_FIELD_UI_SURFACE}`,
    },
    {
      id: 'fb-field-behavior',
      title: 'How overrides behave',
      content: `- Schema-level builder methods define the default contract for every render of that field
- Component props are useful for one-off copy or presentation overrides in a specific screen or section
- Field components do not accept value/state overrides directly; validation, visibility, disabled rules, and submit lifecycle stay owned by the form runtime`,
    },
    {
      id: 'fb-field-strategy',
      title: 'Which customization path to pick',
      content: `- Start with \`<fields.name />\` when the built-in renderer already matches the input type
- Stay in \`ui\` / \`globalStyles\` when the structure is fine and you only need visual changes
- Use \`renderPicker\` for select-like fields when only the picker/modal/sheet needs to be custom
- Use \`fieldController(name)\` when the schema field type is still right, but you want to own the trigger, shell, modal, helper row, or extra surrounding UI
- Use \`field.custom(defaultValue)\` when the value shape or interaction model itself is not one of the built-in field types`,
    },
  ],
};

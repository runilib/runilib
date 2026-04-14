import type { LibraryDoc } from './../../../types/index';
import {
  BASE_FIELD_BUILDER_REFERENCE,
  buildMethodsTable,
  STRING_FIELD_BUILDER_REFERENCE,
} from '../constants';

const MASKED_METHODS_TABLE = buildMethodsTable([
  [
    '`storeRaw()`',
    '`() => this`',
    'Stores the unformatted raw payload instead of the masked value.',
  ],
  [
    '`storeMasked()`',
    '`() => this`',
    'Explicitly keeps the formatted masked value, which is the default behavior.',
  ],
  [
    '`showPlaceholder(char?)`',
    '`char?: string`',
    'Renders placeholder characters inside the current value.',
  ],
  [
    '`showMaskInPlaceholder(charOrText?)`',
    '`charOrText?: string`',
    'Renders the mask as placeholder text while keeping the actual value empty.',
  ],
  [
    '`tokens(map)`',
    '`map: Record<string, RegExp>`',
    'Adds or overrides token characters for advanced masks.',
  ],
  [
    '`validateComplete(message?)`',
    '`message?: string`',
    'Requires the entire mask to be filled before submit.',
  ],
]);

export const maskedSection: LibraryDoc['sections'][number] = {
  id: 'fb-masked',
  title: 'field.masked()',
  content: `String input constrained by a mask pattern or preset. Ideal for credit cards, expiry dates, ZIP codes, and formatted identifiers.

- First argument is required: a built-in \`MASKS\` preset, a raw pattern string, or a \`{ pattern, tokens }\` object
- Label the field separately with \`label(...)\` since the constructor takes the mask, not the label
- The renderer adapts width and input mode to the mask profile (numeric vs alphanumeric)`,
  codeTabs: [
    {
      filename: 'Masked.tsx',
      lang: 'tsx',

      code: `import { MASKS } from '@runilib/react-formbridge'

const schema = {
  cardNumber: field
    .masked(MASKS.CARD_16)
    .label('Card number')
    .required()
    .showMaskInPlaceholder()
    .validateComplete('Card is incomplete.'),

  licensePlate: field
    .masked('LL-999-LL')
    .label('License plate')
    .tokens({
      L: /[A-Z]/,
    })
    .uppercase(),
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-masked-props',
      title: 'Defaults, inheritance & field methods',
      content: `- First argument is required: a \`MASKS\` preset, a custom pattern string, or a \`{ pattern, tokens }\` object
- defaultValue is \`''\`
- Masked values are stored by default (separators like \`/\`, \`-\`, spaces are preserved)
${BASE_FIELD_BUILDER_REFERENCE}
${STRING_FIELD_BUILDER_REFERENCE}

Mask-specific methods:
${MASKED_METHODS_TABLE}`,
    },
    {
      id: 'fb-masked-runtime',
      title: 'Adaptive mask runtime',
      content: `The built-in masked renderers now adapt to the mask instead of treating every mask like the same numeric field.

- Numeric-only masks keep numeric-friendly keyboard / input mode hints
- Alphanumeric masks stop behaving like numeric-only inputs when the token map accepts letters
- \`maxLength\` follows the visible mask length, including separators
- Short masks stay compact while longer masks can claim the width they need, which makes side-by-side layouts easier without hand-tuned widths

If you want the mask behavior but your own shell, prefix badge, trigger row, or fully custom layout, keep the field as \`field.masked(...)\` in the schema and drive the UI through \`form.fieldController(name)\`.`,
    },
    {
      id: 'fb-masked-recipes',
      title: 'Recipes',
      content: `Patterns that showcase mask-specific strengths:
- Credit card with placeholder → \`field.masked(MASKS.CARD_16).label('Card number').required().showMaskInPlaceholder().validateComplete('Card number is incomplete.')\`
- Expiry + CVV side by side → \`field.masked(MASKS.EXPIRY).label('Expiry')\` and \`field.masked(MASKS.CVV).label('CVV')\` — short masks auto-size
- Raw backup code (strip separators) → \`field.masked('9999-9999').label('Backup code').storeRaw().validateComplete()\`
- Custom plate with uppercase token → \`field.masked('LL-999-LL').label('Plate').tokens({ L: /[A-Z]/ }).uppercase()\`
- French IBAN → \`field.masked(MASKS.IBAN_FR).label('IBAN').required().validateComplete('IBAN is incomplete.')\``,
    },
    {
      id: 'fb-masked-tokens',
      title: 'Pattern syntax',
      content: `- \`9\` = digit
- \`a\` = letter
- \`*\` = any character
- Any other character is treated as a visible separator
- Use \`tokens({...})\` to add custom mask characters such as \`L\` for uppercase-only letters`,
    },
    {
      id: 'fb-masked-presets',
      title: 'Built-in MASKS presets',
      content: `Pass any of these presets as \`field.masked(MASKS.X).label('Label')\`.

Cards
- \`CARD_16\` → \`9999 9999 9999 9999\`
- \`CARD_AMEX\` → \`9999 999999 99999\`
- \`CARD_19\` → \`9999 9999 9999 9999 999\`

Security / expiry
- \`CVV\` → \`999\`
- \`CVV_AMEX\` → \`9999\`
- \`EXPIRY\` → \`99/99\`

Date / time
- \`DATE_DMY\` → \`99/99/9999\`
- \`DATE_MDY\` → \`99/99/9999\`
- \`DATE_ISO\` → \`9999-99-99\`
- \`TIME_HM\` → \`99:99\`
- \`TIME_HMS\` → \`99:99:99\`
- \`DATETIME\` → \`99/99/9999 99:99\`

Bank / finance
- \`IBAN_FR\` → \`aa99 9999 9999 9999 9999 9999 999\`
- \`IBAN_DE\` → \`aa99 9999 9999 9999 9999 99\`
- \`IBAN_GB\` → \`aa99 aaaa 9999 9999 9999 99\`
- \`IBAN\` → \`aa99 9999 9999 9999 9999 9999 9999 99\`
- \`BANK_NZ\` → \`99-9999-9999999-99\`
- \`SIREN\` → \`999 999 999\`
- \`SIRET\` → \`999 999 999 99999\`

Postal / identity
- \`ZIP_FR\` → \`99999\`
- \`ZIP_US\` → \`99999\`
- \`ZIP_US_PLUS4\` → \`99999-9999\`
- \`POSTCODE_UK\` → \`aa9 9aa\`
- \`SSN\` → \`999-99-9999\`
- \`NIR_FR\` → \`9 99 99 99 999 999 99\`

Other
- \`IP_ADDRESS\` → \`999.999.999.999\`
- \`DURATION\` → \`99:99:99.999\`
- \`NUMBER_FR\` → \`9 999 999\``,
    },
  ],
};

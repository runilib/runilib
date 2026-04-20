/**
 * Internal: autofill tokens that pair with a contact-method prefix
 * (`home`, `work`, `mobile`, `fax`, `pager`) - e.g. `home tel`, `work email`.
 *
 * See the WHATWG autofill spec for the exhaustive list:
 * {@link https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill}
 */
type FieldAutoCompleteContactToken =
  | 'tel'
  | 'tel-country-code'
  | 'tel-national'
  | 'tel-area-code'
  | 'tel-local'
  | 'tel-local-prefix'
  | 'tel-local-suffix'
  | 'tel-extension'
  | 'tel-device'
  | 'email'
  | 'impp';

/**
 * Internal: autofill tokens that pair with an address-group prefix
 * (`billing`, `shipping`) and with section names (`section-foo …`) - covers
 * names, addresses, and credit-card fields.
 */
type FieldAutoCompleteGroupedToken =
  | 'name'
  | 'honorific-prefix'
  | 'given-name'
  | 'additional-name'
  | 'family-name'
  | 'honorific-suffix'
  | 'organization'
  | 'organization-title'
  | 'street-address'
  | 'address-line1'
  | 'address-line2'
  | 'address-line3'
  | 'address-level1'
  | 'address-level2'
  | 'address-level3'
  | 'address-level4'
  | 'country'
  | 'country-name'
  | 'postal-code'
  | 'postal-address'
  | 'postal-address-country'
  | 'postal-address-extended'
  | 'postal-address-extended-postal-code'
  | 'postal-address-locality'
  | 'postal-address-region'
  | 'cc-name'
  | 'cc-given-name'
  | 'cc-middle-name'
  | 'cc-family-name'
  | 'cc-number'
  | 'cc-exp'
  | 'cc-exp-day'
  | 'cc-exp-month'
  | 'cc-exp-year'
  | 'cc-csc'
  | 'cc-type'
  | 'transaction-currency'
  | 'transaction-amount';

/**
 * Cross-platform autocomplete tokens accepted by field-level `autoComplete`
 * overrides on web and native renderers.
 *
 * This intentionally covers the shared web / React Native surface without
 * falling back to `string`, so editors can offer real suggestions.
 */
export type FieldAutoComplete =
  | 'on'
  | 'off'
  | 'name'
  | 'honorific-prefix'
  | 'given-name'
  | 'additional-name'
  | 'family-name'
  | 'honorific-suffix'
  | 'nickname'
  | 'username'
  | 'username-new'
  | 'email'
  | 'one-time-code'
  | 'sms-otp'
  | 'current-password'
  | 'new-password'
  | 'password'
  | 'password-new'
  | 'organization'
  | 'organization-title'
  | 'street-address'
  | 'address-line1'
  | 'address-line2'
  | 'address-line3'
  | 'address-level1'
  | 'address-level2'
  | 'address-level3'
  | 'address-level4'
  | 'country'
  | 'country-name'
  | 'postal-code'
  | 'postal-address'
  | 'postal-address-country'
  | 'postal-address-extended'
  | 'postal-address-extended-postal-code'
  | 'postal-address-locality'
  | 'postal-address-region'
  | 'cc-name'
  | 'cc-given-name'
  | 'cc-middle-name'
  | 'cc-family-name'
  | 'cc-number'
  | 'cc-exp'
  | 'cc-exp-day'
  | 'cc-exp-month'
  | 'cc-exp-year'
  | 'cc-csc'
  | 'cc-type'
  | 'transaction-currency'
  | 'transaction-amount'
  | 'language'
  | 'bday'
  | 'bday-day'
  | 'bday-month'
  | 'bday-year'
  | 'birthdate-day'
  | 'birthdate-month'
  | 'birthdate-year'
  | 'birthdate-full'
  | 'sex'
  | 'gender'
  | 'url'
  | 'photo'
  | 'impp'
  | 'tel'
  | 'tel-country-code'
  | 'tel-national'
  | 'tel-area-code'
  | 'tel-local'
  | 'tel-local-prefix'
  | 'tel-local-suffix'
  | 'tel-extension'
  | 'tel-device'
  | 'name-given'
  | 'name-middle'
  | 'name-family'
  | 'name-middle-initial'
  | 'name-prefix'
  | 'name-suffix'
  | `section-${string} ${FieldAutoCompleteGroupedToken | FieldAutoCompleteContactToken}`
  | `${'billing' | 'shipping'} ${FieldAutoCompleteGroupedToken}`
  | `${'home' | 'work' | 'mobile' | 'fax' | 'pager'} ${FieldAutoCompleteContactToken}`
  | `section-${string} ${'billing' | 'shipping'} ${FieldAutoCompleteGroupedToken}`
  | `section-${string} ${'home' | 'work' | 'mobile' | 'fax' | 'pager'} ${FieldAutoCompleteContactToken}`;

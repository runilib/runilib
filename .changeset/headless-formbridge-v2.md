---
'@runilib/react-formbridge': major
---

Make React FormBridge fully headless.

This removes the built-in web/native field renderers, generated `form.fields.*`
components, `Form.Submit`, host helpers, UI override types, and styling/default UI
props. `Form`, `FieldLabel`, and `FieldError` remain as minimal helpers, while
fields are now connected through `form.fieldController(name)`.

Masked and OTP fields now expose headless controller helpers such as
`displayValue`, `rawValue`, `format`, `unmask`, `digits`, `setDigit`, and
`otpComplete` so applications can wire their own inputs without losing the
form engine behavior.

Update the package README and documentation application to match the new public
surface. Guides, examples, playgrounds, navigation, homepage content, and API
metadata now use application-owned web/native controls backed by
`fieldController()`. Documentation for generated fields, `Form.Submit`, host
helpers, `globalDefaults`, renderer styling, and other removed UI APIs has been
removed.

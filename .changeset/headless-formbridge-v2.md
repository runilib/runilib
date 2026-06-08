---
'@runilib/react-formbridge': major
---

Make React FormBridge fully headless.

This removes the built-in web/native field renderers, generated `form.fields.*`
components, `Form.Submit`, host helpers, UI override types, and styling/default UI
props. `Form`, `FieldLabel`, and `FieldError` remain as minimal helpers, while
fields are now connected through `form.field(name)` / `fieldController(name)`.

Masked and OTP fields now expose headless controller helpers such as
`displayValue`, `rawValue`, `format`, `unmask`, `digits`, `setDigit`, and
`otpComplete` so applications can wire their own inputs without losing the
form engine behavior.

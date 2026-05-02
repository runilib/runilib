---
"@runilib/react-formbridge": minor
---

Add `lettersOnly()` and `alphanumeric()` charset helpers to `field.otp()`.

Both helpers mirror the existing `digitsOnly()` API: they validate the value and instruct web/native renderers to pick a matching keyboard hint and drop disallowed keystrokes before they reach form state. The accepted charset is exposed on the descriptor as `_otpCharset` (`'digits' | 'letters' | 'alphanumeric'`).

import { field } from '../core/field-builders/field';
import { ref } from '../core/validators/reference';
import { schema } from '../core/validators/schema';
import { useFormBridge as useNativeFormBridge } from '../hooks/useFormBridge.native';
import { useFormBridge as useWebFormBridge } from '../hooks/useFormBridge.web';

function WebTypingHarness() {
  const signupSchema = schema({
    name: field.text('Name'),
    bio: field.textarea('Bio'),
    country: field.select('Country').options(['FR', 'US']),
    email: field.email('Email'),
    password: field.text('Password'),
    confirmPassword: field.text('Confirm password').sameAs(ref('password')),
  });
  const form = useWebFormBridge(signupSchema);
  const nameController = form.fieldController('name');
  const countryController = form.fieldController('country');

  signupSchema.safeParse({
    password: 'secret',
    confirmPassword: 'secret',
  }).issues[0]?.code;

  <form.fields.name
    inputProps={{ maxLength: 80 }}
    autoComplete="given-name"
    inputMode="text"
  />;
  <form.fields.bio textareaProps={{ rows: 4 }} />;
  <form.fields.country
    autoFocus
    readOnly
    selectProps={{ size: 2 }}
  />;
  <form.fields.email autoComplete="section-checkout email" />;

  // @ts-expect-error text fields should not expose selectProps
  <form.fields.name selectProps={{ size: 2 }} />;
  // @ts-expect-error text fields should not expose textareaProps
  <form.fields.name textareaProps={{ rows: 4 }} />;
  // @ts-expect-error textarea fields should not expose selectProps
  <form.fields.bio selectProps={{ size: 2 }} />;
  countryController.options?.[0]?.label;
  // @ts-expect-error text controllers should not expose select options
  nameController.options;
  // @ts-expect-error text controllers should not expose OTP metadata
  nameController.otpLength;
  field.text('Work email');
  // @ts-expect-error field ui autocomplete should only accept known tokens
  <form.fields.email autoComplete="custom-email-token" />;

  return null;
}

function NativeTypingHarness() {
  const nativeSchema = schema({
    name: field.text('Name'),
    country: field.select('Country').options(['FR', 'US']),
    otp: field.otp('Code'),
  });
  const form = useNativeFormBridge(nativeSchema);
  const countryController = form.fieldController('country');
  const otpController = form.fieldController('otp');

  <form.fields.name
    inputProps={{ maxLength: 80 }}
    autoComplete="name"
  />;
  <form.fields.country
    autoFocus
    readOnly
    renderPicker={() => null}
  />;
  <form.fields.otp autoComplete="sms-otp" />;

  // @ts-expect-error native field ui should not expose web-only textareaProps
  <form.fields.name textareaProps={{ rows: 4 }} />;
  // @ts-expect-error native field ui should not expose web-only selectProps
  <form.fields.country selectProps={{ size: 2 }} />;
  // @ts-expect-error native field ui should not expose className
  <form.fields.name className="web-only" />;
  countryController.options?.[0]?.label;
  otpController.otpLength;
  // @ts-expect-error select controllers should not expose OTP metadata
  countryController.otpLength;
  // @ts-expect-error OTP controllers should not expose select options
  otpController.options;
  // @ts-expect-error native autocomplete should only accept known tokens
  <form.fields.otp autoComplete="pin-code" />;

  return null;
}

void WebTypingHarness;
void NativeTypingHarness;

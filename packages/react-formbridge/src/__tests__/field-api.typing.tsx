import { field } from '../core/field-builders/field';
import { useFormBridge as useNativeFormBridge } from '../hooks/useFormBridge.native';
import { useFormBridge as useWebFormBridge } from '../hooks/useFormBridge.web';

function WebTypingHarness() {
  const form = useWebFormBridge({
    name: field.text('Name').behavior({ autoComplete: 'name' }),
    bio: field.textarea('Bio'),
    country: field.select('Country').options(['FR', 'US']),
    email: field.email('Email').behavior({ autoComplete: 'email', inputMode: 'email' }),
  });
  const nameController = form.fieldController('name');
  const countryController = form.fieldController('country');

  <form.fields.name
    inputProps={{ maxLength: 80 }}
    autoComplete="given-name"
  />;
  <form.fields.bio textareaProps={{ rows: 4 }} />;
  <form.fields.country selectProps={{ size: 2 }} />;
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
  // @ts-expect-error autocomplete should only accept known tokens
  field.text('Work email').behavior({ autoComplete: 'work-email' });
  // @ts-expect-error field ui autocomplete should only accept known tokens
  <form.fields.email autoComplete="custom-email-token" />;

  return null;
}

function NativeTypingHarness() {
  const form = useNativeFormBridge({
    name: field.text('Name').behavior({ autoComplete: 'name' }),
    country: field.select('Country').options(['FR', 'US']),
    otp: field.otp('Code').behavior({ autoComplete: 'one-time-code' }),
  });
  const countryController = form.fieldController('country');
  const otpController = form.fieldController('otp');

  <form.fields.name
    inputProps={{ maxLength: 80 }}
    autoComplete="name"
  />;
  <form.fields.country renderPicker={() => null} />;
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

import { field } from '../core/field-descriptors/field';
import { createSchema } from '../core/validators/createSchema';
import { ref } from '../core/validators/reference';
import { useFormBridge as useNativeFormBridge } from '../hooks/useFormBridge.native';
import { useFormBridge as useWebFormBridge } from '../hooks/useFormBridge.web';

function WebTypingHarness() {
  const schemaWithApi = createSchema({
    password: field.text('Password'),
    confirmPassword: field.text('Confirm password').sameAs(ref('password')),
  });
  const signupSchema = {
    name: field.text('Name'),
    country: field.select('Country').options(['FR', 'US']),
    email: field.email('Email'),
    password: field.text('Password'),
    confirmPassword: field.text('Confirm password').sameAs(ref('password')),
    code: field.otp('Code').length(6).digitsOnly(),
    phone: field.masked('99 99 99 99 99').label('Phone').storeRaw(),
  };
  const form = useWebFormBridge(signupSchema);
  const nameController = form.field('name');
  const countryController = form.field('country');
  const codeController = form.field('code');
  const phoneController = form.field('phone');

  schemaWithApi.safeParse({
    password: 'secret',
    confirmPassword: 'secret',
  }).issues[0]?.code;

  nameController.onChange('Ada');
  countryController.options?.[0]?.label;
  codeController.otpLength;
  codeController.digits[0];
  codeController.setDigit(0, '1');
  phoneController.rawValue;
  phoneController.displayValue;
  phoneController.format('0601020304');
  phoneController.unmask('06 01 02 03 04');

  // @ts-expect-error text controllers should not expose select options
  nameController.options;
  // @ts-expect-error text controllers should not expose OTP metadata
  nameController.otpLength;
  // @ts-expect-error select controllers should not expose OTP helpers
  countryController.setDigit(0, '1');
  return null;
}

function NativeTypingHarness() {
  const nativeSchema = {
    name: field.text('Name'),
    country: field.select('Country').options(['FR', 'US']),
    otp: field.otp('Code').length(4),
  };
  const form = useNativeFormBridge(nativeSchema);
  const countryController = form.field('country');
  const otpController = form.field('otp');

  countryController.options?.[0]?.label;
  otpController.otpLength;
  otpController.clear();

  // @ts-expect-error select controllers should not expose OTP metadata
  countryController.otpLength;
  // @ts-expect-error OTP controllers should not expose select options
  otpController.options;

  return null;
}

void WebTypingHarness;
void NativeTypingHarness;

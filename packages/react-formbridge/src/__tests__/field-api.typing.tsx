import { field } from '../core/field-builders/field';
import { useFormBridge as useNativeFormBridge } from '../hooks/useFormBridge.native';
import { useFormBridge as useWebFormBridge } from '../hooks/useFormBridge.web';

function WebTypingHarness() {
  const form = useWebFormBridge({
    name: field.text('Name'),
    bio: field.textarea('Bio'),
    country: field.select('Country').options(['FR', 'US']),
  });

  <form.fields.name ui={{ inputProps: { maxLength: 80 } }} />;
  <form.fields.bio ui={{ textareaProps: { rows: 4 } }} />;
  <form.fields.country ui={{ selectProps: { size: 2 } }} />;

  // @ts-expect-error text fields should not expose selectProps
  <form.fields.name ui={{ selectProps: { size: 2 } }} />;
  // @ts-expect-error text fields should not expose textareaProps
  <form.fields.name ui={{ textareaProps: { rows: 4 } }} />;
  // @ts-expect-error textarea fields should not expose selectProps
  <form.fields.bio ui={{ selectProps: { size: 2 } }} />;
  // @ts-expect-error select fields should not expose textareaProps
  <form.fields.country ui={{ textareaProps: { rows: 4 } }} />;

  return null;
}

function NativeTypingHarness() {
  const form = useNativeFormBridge({
    name: field.text('Name'),
    country: field.select('Country').options(['FR', 'US']),
  });

  <form.fields.name ui={{ inputProps: { maxLength: 80 } }} />;
  <form.fields.country ui={{ renderPicker: () => null }} />;

  // @ts-expect-error native field props should not expose web-only textareaProps
  <form.fields.name ui={{ textareaProps: { rows: 4 } }} />;
  // @ts-expect-error native field props should not expose web-only selectProps
  <form.fields.country ui={{ selectProps: { size: 2 } }} />;
  // @ts-expect-error native field props should not expose className
  <form.fields.name className="web-only" />;

  return null;
}

void WebTypingHarness;
void NativeTypingHarness;

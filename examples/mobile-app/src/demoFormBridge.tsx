/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */

import { Pressable, Switch, Text, TextInput, View } from 'react-native';

import {
  type FormSchema,
  field,
  useFormBridge as useHeadlessFormBridge,
  useFormBridgeWizard as useHeadlessFormBridgeWizard,
} from '@runilib/react-formbridge';

export * from '@runilib/react-formbridge';

export type GlobaleDefaultsProps = Record<string, any>;
export type FieldPropsOverrides = Record<string, any>;
export type FieldController<S = any, K = any> = any;

type DemoForm = any & {
  fields: Record<string, (props?: Record<string, unknown>) => JSX.Element | null>;
  Form: any & {
    Submit: (props: Record<string, unknown>) => JSX.Element;
  };
};

function toInputValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function DemoField({
  form,
  name,
  ...props
}: { form: ReturnType<typeof useHeadlessFormBridge<FormSchema>>; name: string } & Record<
  string,
  unknown
>) {
  const controller = form.field(name) as any;

  if (!controller.visible) return null;

  const label = typeof props.label === 'string' ? props.label : controller.label || name;

  if (typeof controller.value === 'boolean') {
    return (
      <View style={{ gap: 6 }}>
        <Text>{label}</Text>
        <Switch
          value={controller.value}
          disabled={controller.disabled}
          onValueChange={controller.onChange}
          onBlur={controller.onBlur}
        />
        <form.FieldError name={name} />
      </View>
    );
  }

  return (
    <View style={{ gap: 6 }}>
      <form.FieldLabel name={name} />
      <TextInput
        value={controller.displayValue ?? toInputValue(controller.value)}
        placeholder={
          typeof props.placeholder === 'string'
            ? props.placeholder
            : controller.placeholder
        }
        editable={!controller.disabled}
        secureTextEntry={name.toLowerCase().includes('password')}
        keyboardType={name.toLowerCase().includes('email') ? 'email-address' : 'default'}
        onChangeText={controller.onChange}
        onBlur={controller.onBlur}
        style={[
          {
            borderWidth: 1,
            borderColor: controller.error ? '#ef4444' : 'rgba(37,99,235,0.18)',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            color: '#10203a',
            backgroundColor: '#fff',
          },
          props.style as object,
        ]}
      />
      {controller.hint ? <Text>{controller.hint}</Text> : null}
      <form.FieldError name={name} />
    </View>
  );
}

function attachDemoUi(form: any) {
  const demoForm = form as DemoForm;

  demoForm.fields = new Proxy(
    {},
    {
      get: (_target, key) => {
        const name = String(key);
        return (props?: Record<string, unknown>) => (
          <DemoField
            form={form}
            name={name}
            {...props}
          />
        );
      },
    },
  ) as DemoForm['fields'];

  demoForm.Form = Object.assign(form.Form, {
    Submit: ({ children, disabled, loadingText, ...props }: Record<string, unknown>) => (
      <Pressable
        {...props}
        disabled={Boolean(disabled) || form.state.isSubmitting}
        onPress={() => {
          void form.submit();
        }}
        style={{
          minHeight: 44,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor:
            Boolean(disabled) || form.state.isSubmitting ? '#c7d2fe' : '#2563eb',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>
          {String(
            form.state.isSubmitting
              ? (loadingText ?? children ?? 'Saving...')
              : (children ?? 'Submit'),
          )}
        </Text>
      </Pressable>
    ),
  });

  return demoForm;
}

export function useFormBridge<S extends FormSchema>(
  schema: S,
  options?: Record<string, any>,
) {
  return attachDemoUi(useHeadlessFormBridge(schema, options as never));
}

export function useFormBridgeWizard(...args: any[]) {
  const wizard = (useHeadlessFormBridgeWizard as any)(...args);
  return {
    ...wizard,
    currentStep: {
      ...wizard.currentStep,
      ...(wizard.currentStep ? attachDemoUi(wizard.currentStep as never) : {}),
    },
  };
}

export { field };

export function FieldHost({ field: Field, ...props }: Record<string, any>) {
  return <Field {...props} />;
}

export function FormHost({ form: Form, ...props }: Record<string, any>) {
  return <Form {...props} />;
}

export function SubmitHost({ submit: Submit, ...props }: Record<string, any>) {
  return <Submit {...props} />;
}

import type React from 'react';

import {
  type FormSchema,
  field,
  useFormBridge as useHeadlessFormBridge,
} from '@runilib/react-formbridge';

export * from '@runilib/react-formbridge';

export type GlobaleDefaultsProps = Record<string, any>;
export type FieldPropsOverrides = Record<string, any>;

function toInputValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function DemoField({
  form,
  name,
  ...props
}: { form: any; name: string } & Record<string, any>) {
  const controller = form.field(name) as any;

  if (!controller.visible) return null;

  const common = {
    id: name,
    name,
    disabled: controller.disabled,
    required: controller.required,
    className: props.className,
    style: props.style as React.CSSProperties | undefined,
    onBlur: controller.onBlur,
    onFocus: controller.onFocus,
  };

  let control: JSX.Element;

  if (controller.options?.length) {
    control = (
      <select
        {...common}
        value={toInputValue(controller.value)}
        onChange={(event) => controller.onChange(event.target.value)}
      >
        <option value="">Select...</option>
        {controller.options.map((option: any) => (
          <option
            key={String(option.value)}
            value={String(option.value)}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  } else if (typeof controller.value === 'boolean') {
    control = (
      <label>
        <input
          {...common}
          type="checkbox"
          checked={controller.value}
          onChange={(event) => controller.onChange(event.target.checked)}
        />
        {controller.label || name}
      </label>
    );
  } else {
    control = (
      <input
        {...common}
        type={name.toLowerCase().includes('email') ? 'email' : 'text'}
        value={controller.displayValue ?? toInputValue(controller.value)}
        placeholder={controller.placeholder}
        onChange={(event) => controller.onChange(event.target.value)}
      />
    );
  }

  return (
    <div>
      {typeof controller.value === 'boolean' ? null : <form.FieldLabel name={name} />}
      {control}
      <form.FieldError name={name} />
    </div>
  );
}

function attachDemoUi(form: any) {
  form.fields = new Proxy(
    {},
    {
      get: (_target, key) => {
        const name = String(key);
        return (props?: Record<string, any>) => (
          <DemoField
            form={form}
            name={name}
            {...props}
          />
        );
      },
    },
  );

  form.Form = Object.assign(form.Form, {
    Submit: ({ children, disabled, loadingText, ...props }: Record<string, any>) => (
      <button
        {...props}
        type={props.type ?? 'submit'}
        disabled={Boolean(disabled) || form.state.isSubmitting}
      >
        {String(
          form.state.isSubmitting
            ? (loadingText ?? children ?? 'Saving...')
            : (children ?? 'Submit'),
        )}
      </button>
    ),
  });

  return form;
}

export function useFormBridge<S extends FormSchema>(
  schema: S,
  options?: Record<string, any>,
) {
  return attachDemoUi(useHeadlessFormBridge(schema, options as never));
}

export function FieldHost({ field: Field, ...props }: Record<string, any>) {
  return <Field {...props} />;
}

export function FormHost({ form: Form, ...props }: Record<string, any>) {
  return <Form {...props} />;
}

export function SubmitHost({ submit: Submit, ...props }: Record<string, any>) {
  return <Submit {...props} />;
}

export { field };

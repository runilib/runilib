import type React from 'react';

import {
  type FileValue,
  type FormSchema,
  field,
  type PhoneValue,
  type UseFormBridgeOptions,
  type UseFormBridgeReturn,
  type UseFormWizardOptions,
  type UseFormWizardReturn,
  useFormBridge as useHeadlessFormBridge,
  useFormBridgeWizard as useHeadlessFormBridgeWizard,
} from '@runilib/react-formbridge';

export * from '@runilib/react-formbridge';

type DemoStyles = Record<string, React.CSSProperties | undefined>;

type DemoFieldProps = Record<string, unknown> & {
  children?: React.ReactNode;
  className?: string;
  classNames?: Record<string, string>;
  disabled?: boolean;
  highlightOnError?: boolean;
  hint?: React.ReactNode;
  label?: React.ReactNode;
  placeholder?: string;
  style?: React.CSSProperties;
  styles?: DemoStyles;
};

type DemoSubmitProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loadingText?: React.ReactNode;
};

type DemoValue = string &
  FileValue &
  FileValue[] &
  PhoneValue &
  Record<string, unknown> & {
    trim: string['trim'];
  };

type DemoValues<S extends FormSchema> = Record<keyof S & string, DemoValue> &
  Record<string, DemoValue>;

type DemoState<S extends FormSchema> = Omit<
  HeadlessForm<S>['state'],
  'errors' | 'values'
> & {
  errors: Record<keyof S & string, string | undefined> &
    Record<string, string | undefined>;
  values: DemoValues<S>;
};

type DemoUseFormOptions<S extends FormSchema> = UseFormBridgeOptions<S> &
  Record<string, unknown> & {
    globalDefaults?: GlobaleDefaultsProps | (() => GlobaleDefaultsProps);
  };

export type FieldPropsOverrides = DemoFieldProps;
export type GlobaleDefaultsProps = Record<string, unknown> & {
  field?: FieldPropsOverrides;
  submit?: DemoSubmitProps;
};
export type FieldController<S = unknown, K = unknown> = Omit<
  DemoController,
  'displayValue' | 'error' | 'hint' | 'value'
> & {
  displayValue?: string;
  error?: string | null;
  focus: () => void;
  hint?: React.ReactNode;
  registerFocusable: (node: HTMLElement | null) => void;
  schema?: S;
  key?: K;
  value: DemoValue;
};

export type SelectOption = {
  label: string;
  value: string | number;
};

type DemoController = {
  value: unknown;
  displayValue?: string;
  label?: string;
  placeholder?: string;
  hint?: React.ReactNode;
  error?: string | null;
  visible: boolean;
  disabled?: boolean;
  required?: boolean;
  options?: SelectOption[];
  otpLength?: number;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
};

type HeadlessForm<S extends FormSchema = FormSchema> = UseFormBridgeReturn<S>;

type DemoForm<S extends FormSchema = FormSchema> = Omit<
  HeadlessForm<S>,
  'field' | 'fieldController' | 'getValue' | 'getValues' | 'state' | 'watch' | 'watchAll'
> & {
  field: <K extends keyof S & string>(name: K) => FieldController<S, K>;
  fieldController: <K extends keyof S & string>(name: K) => FieldController<S, K>;
  fields: Record<string, (props?: DemoFieldProps) => JSX.Element | null> & {
    [K in keyof S]: (props?: DemoFieldProps) => JSX.Element | null;
  };
  Form: HeadlessForm<S>['Form'] & {
    Submit: (props: DemoSubmitProps) => JSX.Element;
  };
  getValue: <K extends keyof S & string>(name: K) => DemoValue;
  getValues: () => DemoValues<S>;
  state: DemoState<S>;
  watch: <K extends keyof S & string>(name: K) => DemoValue;
  watchAll: () => DemoValues<S>;
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
}: { form: HeadlessForm; name: string } & DemoFieldProps) {
  const controller = form.field(name) as unknown as DemoController;

  if (!controller.visible) return null;

  const className = [
    props.className,
    props.highlightOnError && controller.error ? 'is-invalid' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const style = props.style as React.CSSProperties | undefined;

  const label = typeof props.label === 'string' ? props.label : controller.label || name;
  const placeholder =
    typeof props.placeholder === 'string' ? props.placeholder : controller.placeholder;
  const common = {
    id: name,
    name,
    disabled: controller.disabled,
    required: controller.required,
    className,
    style,
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
        <option value="">{placeholder ?? 'Select...'}</option>
        {controller.options.map((option) => (
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
        {label}
      </label>
    );
  } else if (props.textareaProps || String(name).toLowerCase().includes('notes')) {
    control = (
      <textarea
        {...common}
        value={toInputValue(controller.value)}
        placeholder={placeholder}
        onChange={(event) => controller.onChange(event.target.value)}
      />
    );
  } else if (controller.otpLength) {
    control = (
      <input
        {...common}
        value={toInputValue(controller.value)}
        maxLength={controller.otpLength}
        placeholder={placeholder}
        onChange={(event) => controller.onChange(event.target.value)}
      />
    );
  } else {
    const inputType =
      name.toLowerCase().includes('password') || name.toLowerCase().includes('secret')
        ? 'password'
        : name.toLowerCase().includes('email')
          ? 'email'
          : 'text';
    control = (
      <input
        {...common}
        type={inputType}
        value={controller.displayValue ?? toInputValue(controller.value)}
        placeholder={placeholder}
        onChange={(event) => controller.onChange(event.target.value)}
      />
    );
  }

  return (
    <div>
      {typeof controller.value === 'boolean' ? null : <form.FieldLabel name={name} />}
      {control}
      {controller.hint ? <small>{controller.hint}</small> : null}
      <form.FieldError name={name} />
    </div>
  );
}

function attachDemoUi<S extends FormSchema>(form: HeadlessForm<S>) {
  const demoForm = form as unknown as DemoForm<S>;

  demoForm.fields = new Proxy(
    {},
    {
      get: (_target, key) => {
        const name = String(key);
        return (props?: DemoFieldProps) => (
          <DemoField
            form={form as HeadlessForm}
            name={name}
            {...props}
          />
        );
      },
    },
  ) as DemoForm<S>['fields'];

  demoForm.Form = Object.assign(form.Form, {
    Submit: ({ children, disabled, loadingText, ...props }: DemoSubmitProps) => (
      <button
        {...props}
        type={(props.type as 'button' | 'submit' | 'reset' | undefined) ?? 'submit'}
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

  return demoForm;
}

export function useFormBridge<S extends FormSchema>(
  schema: S,
  options?: DemoUseFormOptions<S>,
) {
  return attachDemoUi(useHeadlessFormBridge(schema, options as UseFormBridgeOptions<S>));
}

type DemoWizard = Omit<UseFormWizardReturn, 'currentStep'> & {
  currentStep: DemoForm;
};

export function useFormBridgeWizard(
  steps: Parameters<typeof useHeadlessFormBridgeWizard>[0],
  options: UseFormWizardOptions,
): DemoWizard {
  const wizard = useHeadlessFormBridgeWizard(steps, options) as UseFormWizardReturn;
  return {
    ...wizard,
    currentStep: attachDemoUi(wizard.currentStep),
  };
}

export { field };

export function FieldHost({ field: Field, ...props }: Record<string, unknown>) {
  const Component = Field as React.ComponentType<Record<string, unknown>>;
  return <Component {...props} />;
}

export function FormHost({ form: Form, ...props }: Record<string, unknown>) {
  const Component = Form as React.ComponentType<Record<string, unknown>>;
  return <Component {...props} />;
}

export function SubmitHost({ submit: Submit, ...props }: Record<string, unknown>) {
  const Component = Submit as React.ComponentType<Record<string, unknown>>;
  return <Component {...props} />;
}

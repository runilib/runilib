import type { ElementType } from 'react';
import { useId } from 'react';

type ManualController = {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
  label?: string;
  placeholder?: string;
  hint?: string | null;
  error?: string | null;
  disabled?: boolean;
  required?: boolean;
  options?: Array<{ label: string; value: string | number }>;
};

type FieldErrorComponent = ElementType;
type FieldLabelComponent = ElementType;

type NativeFieldProps = {
  controller: ManualController;
  FieldError: FieldErrorComponent;
  FieldLabel: FieldLabelComponent;
  type?: string;
  textarea?: boolean;
  className?: string;
  inputClassName?: string;
  selectClassName?: string;
};

function toInputValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  return typeof value === 'string' ? value : String(value);
}

export function NativeField({
  controller,
  FieldError,
  FieldLabel,
  type = 'text',
  textarea = false,
  className,
  inputClassName,
}: NativeFieldProps) {
  const id = useId();
  const value = toInputValue(controller.value);

  return (
    <div className={className}>
      <FieldLabel
        name={controller.name}
        htmlFor={id}
      />
      {textarea ? (
        <textarea
          id={id}
          value={value}
          placeholder={controller.placeholder}
          disabled={controller.disabled}
          onChange={(event) => controller.onChange(event.target.value)}
          onBlur={controller.onBlur}
          onFocus={controller.onFocus}
          className={inputClassName}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          placeholder={controller.placeholder}
          disabled={controller.disabled}
          required={controller.required}
          onChange={(event) => controller.onChange(event.target.value)}
          onBlur={controller.onBlur}
          onFocus={controller.onFocus}
          className={inputClassName}
        />
      )}
      <FieldError name={controller.name} />
    </div>
  );
}

export function NativeSelectField({
  controller,
  FieldError,
  FieldLabel,
  className,
  selectClassName,
}: NativeFieldProps) {
  const id = useId();

  return (
    <div className={className}>
      <FieldLabel
        name={controller.name}
        htmlFor={id}
      />
      <select
        id={id}
        value={toInputValue(controller.value)}
        disabled={controller.disabled}
        required={controller.required}
        onChange={(event) => controller.onChange(event.target.value)}
        onBlur={controller.onBlur}
        onFocus={controller.onFocus}
        className={selectClassName}
      >
        {controller.options?.map((option) => (
          <option
            key={String(option.value)}
            value={String(option.value)}
          >
            {option.label}
          </option>
        ))}
      </select>
      <FieldError name={controller.name} />
    </div>
  );
}

export function NativeCheckboxField({
  controller,
  FieldError,
  className,
}: NativeFieldProps) {
  const id = useId();

  return (
    <div className={className}>
      <label htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={Boolean(controller.value)}
          disabled={controller.disabled}
          onChange={(event) => controller.onChange(event.target.checked)}
          onBlur={controller.onBlur}
          onFocus={controller.onFocus}
        />
        <span>{controller.label ?? controller.name}</span>
      </label>
      <FieldError name={controller.name} />
    </div>
  );
}

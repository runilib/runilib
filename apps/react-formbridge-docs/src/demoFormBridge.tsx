import type React from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

export * from '@runilib/react-formbridge';

export { field, useFormBridge };

interface AppFieldController {
  name: string;
  value: unknown;
  label: string;
  placeholder?: string;
  hint?: string;
  error: string | null;
  visible: boolean;
  disabled: boolean;
  required: boolean;
  options?: Array<{ label: string; value: string | number }>;
  displayValue?: string;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
  registerFocusable: (
    target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null,
  ) => void;
}

interface AppFormBridge {
  fieldController: (name: string) => AppFieldController;
}

export interface AppFieldProps {
  form: unknown;
  name: string;
  kind?: 'input' | 'textarea';
  hideLabel?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  textareaStyle?: React.CSSProperties;
}

function toInputValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * UI adapter owned by the documentation application.
 * It intentionally consumes only the public headless fieldController() API.
 */
export function AppField({
  form,
  name,
  kind = 'input',
  hideLabel = false,
  inputProps,
  textareaProps,
  textareaStyle,
}: AppFieldProps) {
  const controller = (form as AppFormBridge).fieldController(name);

  if (!controller.visible) return null;

  const hasError = Boolean(controller.error);
  const describedBy =
    [controller.hint ? `${name}-hint` : null, controller.error ? `${name}-error` : null]
      .filter(Boolean)
      .join(' ') || undefined;

  let control: React.ReactNode;

  if (controller.options?.length) {
    control = (
      <select
        ref={controller.registerFocusable}
        id={name}
        name={name}
        data-fb-slot="select"
        value={toInputValue(controller.value)}
        disabled={controller.disabled}
        required={controller.required}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        onChange={(event) => controller.onChange(event.target.value)}
        onBlur={controller.onBlur}
        onFocus={controller.onFocus}
      >
        <option value="">Select…</option>
        {controller.options.map((option) => (
          <option
            key={String(option.value)}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  } else if (typeof controller.value === 'boolean') {
    control = (
      <label data-fb-slot="checkbox-label">
        <input
          ref={controller.registerFocusable}
          id={name}
          name={name}
          type="checkbox"
          data-fb-slot="checkbox-input"
          checked={controller.value}
          disabled={controller.disabled}
          required={controller.required}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          onChange={(event) => controller.onChange(event.target.checked)}
          onBlur={controller.onBlur}
          onFocus={controller.onFocus}
        />
        {controller.label}
      </label>
    );
  } else if (kind === 'textarea') {
    control = (
      <textarea
        {...textareaProps}
        ref={controller.registerFocusable}
        id={name}
        name={name}
        data-fb-slot="textarea"
        value={toInputValue(controller.value)}
        placeholder={controller.placeholder}
        disabled={controller.disabled}
        required={controller.required}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        style={textareaStyle}
        onChange={(event) => controller.onChange(event.target.value)}
        onBlur={controller.onBlur}
        onFocus={controller.onFocus}
      />
    );
  } else {
    control = (
      <input
        {...inputProps}
        ref={controller.registerFocusable}
        id={name}
        name={name}
        data-fb-slot="input"
        value={controller.displayValue ?? toInputValue(controller.value)}
        placeholder={controller.placeholder}
        disabled={controller.disabled}
        required={controller.required}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        onChange={(event) => controller.onChange(event.target.value)}
        onBlur={controller.onBlur}
        onFocus={controller.onFocus}
      />
    );
  }

  return (
    <div
      data-fb-field
      data-fb-error={hasError ? '' : undefined}
    >
      {!hideLabel && typeof controller.value !== 'boolean' ? (
        <label
          htmlFor={name}
          data-fb-slot="label"
        >
          {controller.label}
          {controller.required ? (
            <span
              data-fb-slot="required-mark"
              aria-hidden="true"
            >
              {' '}
              *
            </span>
          ) : null}
        </label>
      ) : null}
      {control}
      {controller.hint ? (
        <span
          id={`${name}-hint`}
          data-fb-slot="hint"
        >
          {controller.hint}
        </span>
      ) : null}
      {controller.error ? (
        <span
          id={`${name}-error`}
          data-fb-slot="error"
          role="alert"
        >
          {controller.error}
        </span>
      ) : null}
    </div>
  );
}

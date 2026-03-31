import React, {
  type CSSProperties,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  useMemo,
  useState,
} from 'react';

import type { PasswordStrengthMeta } from '../../core/field-builders/password/PasswordWithStrength';
import { scorePassword } from '../../core/field-builders/password/strength';
import type { ExtraFieldProps, FieldRenderProps } from '../../types';
import { defaultBorderColor, shouldHighlightOnError } from './shared';

type PasswordStrengthSlot =
  | 'root'
  | 'label'
  | 'input'
  | 'hint'
  | 'error'
  | 'toggle'
  | 'strengthRow'
  | 'strengthBar'
  | 'strengthFill'
  | 'strengthLabel'
  | 'strengthEntropy'
  | 'rulesList'
  | 'ruleItem'
  | 'ruleBullet'
  | 'ruleText'
  | 'requiredMark';

interface PasswordStrengthUiOverrides {
  id?: string;
  hideLabel?: boolean;
  highlightOnError?: boolean;
  classNames?: Partial<Record<PasswordStrengthSlot, string>> &
    Record<string, string | undefined>;
  styles?: Partial<Record<PasswordStrengthSlot, CSSProperties>> &
    Record<string, CSSProperties | undefined>;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'type'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'id'
  >;
  hintProps?: HTMLAttributes<HTMLSpanElement>;
  errorProps?: HTMLAttributes<HTMLSpanElement>;
  renderLabel?: (ctx: {
    id: string;
    label: React.ReactNode;
    required: boolean;
  }) => React.ReactNode;
  renderHint?: (ctx: { id: string; hint: React.ReactNode }) => React.ReactNode;
  renderError?: (ctx: { id: string; error: React.ReactNode }) => React.ReactNode;
  renderRequiredMark?: () => React.ReactNode;
}

interface Props extends FieldRenderProps<string> {
  strengthMeta: PasswordStrengthMeta & {
    _ui?: {
      id?: string;
      readOnly?: boolean;
      autoComplete?: string;
      autoFocus?: boolean;
      spellCheck?: boolean;
      rootClassName?: string;
      labelClassName?: string;
      inputClassName?: string;
      rootStyle?: Record<string, unknown>;
      labelStyle?: Record<string, unknown>;
      inputStyle?: Record<string, unknown>;
      highlightOnError?: boolean;
    };
  };
  extra?: ExtraFieldProps;
}

function cx(...values: Array<string | undefined | false | null>) {
  return values.filter(Boolean).join(' ');
}

function mergeStyles(
  ...styles: Array<CSSProperties | Record<string, unknown> | undefined>
): CSSProperties | undefined {
  return Object.assign({}, ...styles.filter(Boolean));
}

export const WebPasswordStrength = ({ strengthMeta: meta, extra, ...props }: Props) => {
  const required = Boolean(
    (meta as PasswordStrengthMeta & { _required?: boolean })._required,
  );
  const [show, setShow] = useState(false);
  const hasError = Boolean(props.error);
  const web = meta._ui ?? {};
  const ui = extra?.appearance as PasswordStrengthUiOverrides | undefined;
  const highlightOnError = shouldHighlightOnError(
    ui?.highlightOnError,
    web.highlightOnError,
  );
  const { rootProps, labelProps, inputProps, hintProps, errorProps } = ui ?? {};
  const {
    className: rootPropsClassName,
    style: rootPropsStyle,
    ...rootPropsRest
  } = rootProps ?? {};
  const {
    className: labelPropsClassName,
    style: labelPropsStyle,
    ...labelPropsRest
  } = labelProps ?? {};
  const {
    className: inputPropsClassName,
    style: inputPropsStyle,
    ...inputPropsRest
  } = inputProps ?? {};
  const {
    className: hintPropsClassName,
    style: hintPropsStyle,
    ...hintPropsRest
  } = hintProps ?? {};
  const {
    className: errorPropsClassName,
    style: errorPropsStyle,
    ...errorPropsRest
  } = errorProps ?? {};

  const result = useMemo(() => {
    if (!props.value) return null;
    const config = {
      ...meta._strengthConfig,
      levels: meta._strengthCustomLevels ?? meta._strengthConfig.levels,
      minAcceptableScore: meta._strengthMinAccept,
    };
    return scorePassword(props.value, config);
  }, [props.value, meta]);

  const requiredMark = ui?.renderRequiredMark?.() ?? (
    <span
      className={ui?.classNames?.requiredMark}
      style={mergeStyles({ color: '#ef4444', marginLeft: 3 }, ui?.styles?.requiredMark)}
    >
      *
    </span>
  );

  return (
    <div
      className={cx(
        extra?.className,
        web.rootClassName,
        ui?.classNames?.root,
        rootPropsClassName,
      )}
      style={mergeStyles(
        { display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 },
        extra?.style as CSSProperties | undefined,
        web.rootStyle,
        ui?.styles?.root,
        rootPropsStyle,
      )}
      {...rootPropsRest}
    >
      {!ui?.hideLabel &&
        (ui?.renderLabel ? (
          ui.renderLabel({
            id: props.name,
            label: props.label,
            required,
          })
        ) : (
          <label
            htmlFor={props.name}
            className={cx(web.labelClassName, ui?.classNames?.label, labelPropsClassName)}
            style={mergeStyles(
              { fontSize: 13, fontWeight: 600, color: '#374151' },
              web.labelStyle,
              ui?.styles?.label,
              labelPropsStyle,
            )}
            {...labelPropsRest}
          >
            {props.label}
            {required && requiredMark}
          </label>
        ))}

      <div style={{ position: 'relative' }}>
        <input
          id={props.name}
          name={props.name}
          type={show ? 'text' : 'password'}
          value={props.value || ''}
          placeholder={props.placeholder}
          disabled={props.disabled}
          readOnly={web.readOnly}
          autoComplete={web.autoComplete ?? 'new-password'}
          // biome-ignore lint/a11y/noAutofocus: form builders expose autofocus intentionally.
          autoFocus={web.autoFocus}
          spellCheck={web.spellCheck}
          onChange={(event) => props.onChange(event.target.value)}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          className={cx(web.inputClassName, ui?.classNames?.input, inputPropsClassName)}
          style={mergeStyles(
            {
              padding: '10px 13px',
              borderRadius: 8,
              border: `1.5px solid ${defaultBorderColor(
                hasError,
                highlightOnError,
                result?.acceptable === false && props.value ? '#f97316' : '#e5e7eb',
              )}`,
              fontSize: 14,
              outline: 'none',
              background: props.disabled ? '#f9fafb' : '#fff',
              color: '#111',
              width: '100%',
              paddingRight: '44px',
              transition: 'border-color 0.15s',
              boxSizing: 'border-box',
            },
            web.inputStyle,
            ui?.styles?.input,
            inputPropsStyle,
          )}
          {...inputPropsRest}
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className={ui?.classNames?.toggle}
          style={mergeStyles(
            {
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
              color: '#9ca3af',
              padding: 2,
            },
            ui?.styles?.toggle,
          )}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? '🙈' : '👁'}
        </button>
      </div>

      {meta._strengthShowBar && result && (
        <div
          className={ui?.classNames?.strengthRow}
          style={mergeStyles({ marginTop: 4 }, ui?.styles?.strengthRow)}
        >
          <div
            className={ui?.classNames?.strengthBar}
            style={mergeStyles({ display: 'flex', gap: 3 }, ui?.styles?.strengthBar)}
          >
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                style={{
                  flex: 1,
                  height: meta._strengthBarHeight,
                  borderRadius: meta._strengthBarRadius,
                  background: result.score >= level ? result.color : '#e5e7eb',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {meta._strengthShowLabel && (
              <span
                className={ui?.classNames?.strengthLabel}
                style={mergeStyles(
                  {
                    fontSize: 12,
                    fontWeight: 600,
                    color: result.color,
                    transition: 'color 0.3s',
                  },
                  ui?.styles?.strengthLabel,
                )}
              >
                {result.label}
              </span>
            )}
            {meta._strengthShowEntropy && (
              <span
                className={ui?.classNames?.strengthEntropy}
                style={mergeStyles(
                  { fontSize: 11, color: '#9ca3af' },
                  ui?.styles?.strengthEntropy,
                )}
              >
                {result.entropy} bits
              </span>
            )}
          </div>
        </div>
      )}

      {meta._strengthShowRules && result && props.value && (
        <ul
          className={ui?.classNames?.rulesList}
          style={mergeStyles(
            {
              margin: '4px 0 0',
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            },
            ui?.styles?.rulesList,
          )}
        >
          {result.rules.map((rule) => (
            <li
              key={rule.id}
              className={ui?.classNames?.ruleItem}
              style={mergeStyles(
                { display: 'flex', alignItems: 'center', gap: 7, fontSize: 12 },
                ui?.styles?.ruleItem,
              )}
            >
              <span
                className={ui?.classNames?.ruleBullet}
                style={mergeStyles(
                  {
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: rule.passed ? '#22c55e' : '#e5e7eb',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    flexShrink: 0,
                    transition: 'background 0.2s',
                    color: '#fff',
                  },
                  ui?.styles?.ruleBullet,
                )}
              >
                {rule.passed ? '✓' : ''}
              </span>
              <span
                className={ui?.classNames?.ruleText}
                style={mergeStyles(
                  {
                    color: rule.passed ? '#374151' : '#9ca3af',
                    transition: 'color 0.2s',
                  },
                  ui?.styles?.ruleText,
                )}
              >
                {rule.label}
              </span>
            </li>
          ))}
        </ul>
      )}

      {props.error
        ? (ui?.renderError?.({ id: `${props.name}-error`, error: props.error }) ?? (
            <span
              role="alert"
              className={cx(ui?.classNames?.error, errorPropsClassName)}
              style={mergeStyles(
                { fontSize: 12, color: '#ef4444' },
                ui?.styles?.error,
                errorPropsStyle,
              )}
              {...errorPropsRest}
            >
              {props.error}
            </span>
          ))
        : props.hint
          ? (ui?.renderHint?.({ id: `${props.name}-hint`, hint: props.hint }) ?? (
              <span
                className={cx(ui?.classNames?.hint, hintPropsClassName)}
                style={mergeStyles(
                  { fontSize: 12, color: '#9ca3af' },
                  ui?.styles?.hint,
                  hintPropsStyle,
                )}
                {...hintPropsRest}
              >
                {props.hint}
              </span>
            ))
          : null}
    </div>
  );
};

import type { CSSProperties } from 'react';
import { Fragment, useMemo, useState } from 'react';

import type { PasswordStrengthMeta } from '../../core/field-builders/password/PasswordWithStrength';
import { scorePassword } from '../../core/field-builders/password/strength';
import type { StrengthResult } from '../../core/field-builders/password/types';
import type { FocusableFieldHandle } from '../../types';
import type { WebPasswordFieldPropsOverrides } from '../../types/ui-web';
import type { ExtraFieldProps, FieldRenderProps } from '../../types.web';
import {
  defaultFieldRootStyle,
  defaultPasswordInputStyle,
  defaultPasswordToggleStyle,
} from './default-styles';
import { cx, mergeStyles, renderHelperSlot, renderLabelSlot } from './helpers';
import {
  defaultErrorChromeStyle,
  type ResolvedWebFieldProps,
  resolveWebInputBehavior,
  shouldHighlightOnError,
} from './shared';

interface Props extends FieldRenderProps<string> {
  strengthMeta: PasswordStrengthMeta & {
    fieldPropsFromClient?: ResolvedWebFieldProps;
  };
  extra?: ExtraFieldProps<WebPasswordFieldPropsOverrides>;
  registerFocusable?: (target: FocusableFieldHandle | null) => void;
}

function resolveText<TContext>(
  override: string | ((ctx: TContext) => string) | undefined,
  fallback: string,
  context: TContext,
): string {
  if (typeof override === 'function') {
    return override(context);
  }

  return override ?? fallback;
}

export const PasswordStrength = ({
  strengthMeta: meta,
  extra,
  registerFocusable,
  ...props
}: Props) => {
  const required = Boolean(
    (meta as PasswordStrengthMeta & { _required?: boolean })._required,
  );
  const [show, setShow] = useState(false);
  const hasError = Boolean(props.error);
  const web = meta.fieldPropsFromClient ?? {};
  const inputBehavior = resolveWebInputBehavior(extra, web);

  const {
    classNames,
    styles,
    hideLabel,
    renderLabel,
    renderError,
    renderHint,
    renderRequiredMark,
    highlightOnError: highlightOnErrorProp,
    wrapperProps,
    labelProps,
    inputProps,
    hintProps,
    errorProps,
    showPasswordText,
    hidePasswordText,
    renderToggleContent,
    renderStrengthLabel,
    renderStrengthEntropy,
    renderStrengthRowContent,
    renderStrengthRule,
  } = extra ?? {};

  const highlightOnError = shouldHighlightOnError(
    highlightOnErrorProp,
    web.highlightOnError,
  );
  const controlErrorStyle = defaultErrorChromeStyle(hasError, highlightOnError);

  const {
    className: wrapperPropsClassName,
    style: wrapperPropsStyle,
    ...wrapperPropsRest
  } = wrapperProps ?? {};
  const {
    className: inputPropsClassName,
    style: inputPropsStyle,
    ...inputPropsRest
  } = inputProps ?? {};
  const id = extra?.id ?? web.id ?? props.name;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = props.error ? errorId : props.hint ? hintId : undefined;
  const inputClassName = cx(
    classNames?.textInput,
    classNames?.passwordInput,
    inputPropsClassName,
  );

  const result = useMemo<StrengthResult | null>(() => {
    if (!props.value) return null;
    const config = {
      ...meta._strengthConfig,
      levels: meta._strengthCustomLevels ?? meta._strengthConfig.levels,
      minAcceptableScore: meta._strengthMinAccept,
    };
    return scorePassword(props.value, config);
  }, [
    meta._strengthConfig,
    meta._strengthCustomLevels,
    meta._strengthMinAccept,
    props.value,
  ]);

  const renderContext = useMemo(
    () => ({
      disabled: props.disabled,
      hasValue: Boolean(props.value),
      revealed: show,
      result,
      valueLength: props.value?.length ?? 0,
    }),
    [props.disabled, props.value, result, show],
  );
  const resolvedShowPasswordText = resolveText(showPasswordText, '👁', renderContext);
  const resolvedHidePasswordText = resolveText(hidePasswordText, '🙈', renderContext);
  const defaultToggleContent = show ? resolvedHidePasswordText : resolvedShowPasswordText;
  const resolvedToggleContent =
    renderToggleContent?.({
      ...renderContext,
      defaultContent: defaultToggleContent,
    }) ?? defaultToggleContent;
  const defaultStrengthBarContent = result ? (
    <div
      className={classNames?.passwordStrengthBar}
      style={mergeStyles(
        {
          minHeight: meta._strengthBarHeight,
        },
        styles?.passwordStrengthBar,
      )}
    >
      {[1, 2, 3, 4].map((level) => {
        const active = result.score >= level;

        return (
          <div
            key={level}
            data-fb-slot="strength-segment"
            {...(active ? { 'data-fb-active': '' } : {})}
            className={classNames?.passwordStrengthFill}
            style={mergeStyles(
              {
                // borderRadius: meta._strengthBarRadius,
                minHeight: meta._strengthBarHeight,
                ...(active ? { backgroundColor: result.color } : null),
              },
              styles?.passwordStrengthFill,
            )}
          />
        );
      })}
    </div>
  ) : null;
  const defaultStrengthLabelContent =
    meta._strengthShowLabel && result ? (
      <span
        data-fb-slot="strength-label"
        data-fb-strength-level={result.label}
        className={classNames?.passwordStrengthLabel}
        style={mergeStyles({ color: result.color }, styles?.passwordStrengthLabel)}
      >
        {result.label}
      </span>
    ) : null;
  const resolvedStrengthLabelContent =
    result && defaultStrengthLabelContent
      ? (renderStrengthLabel?.({
          ...renderContext,
          defaultContent: defaultStrengthLabelContent,
          result,
        }) ?? defaultStrengthLabelContent)
      : null;
  const defaultStrengthEntropyContent =
    meta._strengthShowEntropy && result ? (
      <span
        data-fb-slot="strength-entropy"
        className={classNames?.passwordStrengthEntropy}
        style={mergeStyles(styles?.passwordStrengthEntropy)}
      >
        {result.entropy} bits
      </span>
    ) : null;
  const resolvedStrengthEntropyContent =
    result && defaultStrengthEntropyContent
      ? (renderStrengthEntropy?.({
          ...renderContext,
          defaultContent: defaultStrengthEntropyContent,
          result,
        }) ?? defaultStrengthEntropyContent)
      : null;
  const defaultStrengthMetaContent =
    resolvedStrengthLabelContent || resolvedStrengthEntropyContent ? (
      <div
        data-fb-slot="strength-meta"
        className={classNames?.passwordStrengthMeta}
        style={mergeStyles(styles?.passwordStrengthMeta)}
      >
        {resolvedStrengthLabelContent}
        {resolvedStrengthEntropyContent}
      </div>
    ) : null;
  const defaultStrengthRowContent =
    result && (defaultStrengthBarContent || defaultStrengthMetaContent) ? (
      <div
        data-fb-slot="strength-row"
        data-fb-strength-score={result.score}
        className={classNames?.passwordStrengthRow}
        style={mergeStyles(styles?.passwordStrengthRow)}
      >
        {meta._strengthShowBar ? defaultStrengthBarContent : null}
        {defaultStrengthMetaContent}
      </div>
    ) : null;
  const resolvedStrengthRowContent =
    result && defaultStrengthRowContent
      ? (renderStrengthRowContent?.({
          ...renderContext,
          defaultBarContent: defaultStrengthBarContent,
          defaultContent: defaultStrengthRowContent,
          defaultEntropyContent: resolvedStrengthEntropyContent,
          defaultLabelContent: resolvedStrengthLabelContent,
          defaultMetaContent: defaultStrengthMetaContent,
          result,
        }) ?? defaultStrengthRowContent)
      : null;
  const shouldRenderRules =
    meta._strengthShowRules &&
    result &&
    props.value &&
    !(meta._strengthHideRulesWhenValid && result.acceptable && !props.error);

  return (
    <div
      className={cx(
        extra?.className,
        classNames?.wrapper,
        wrapperPropsClassName as string,
      )}
      style={mergeStyles(
        defaultFieldRootStyle,
        extra?.style,
        styles?.wrapper,
        wrapperPropsStyle as CSSProperties,
      )}
      {...wrapperPropsRest}
    >
      {renderLabelSlot({
        id,
        label: props.label,
        required,
        hideLabel,
        classNames: classNames as Record<string, string | undefined>,
        styles: styles as Record<string, React.CSSProperties | undefined>,
        labelProps: labelProps as Record<string, unknown>,
        renderLabel,
        name: props.name,
        renderRequiredMark,
      })}

      <div style={{ position: 'relative', width: '100%', minWidth: 0 }}>
        <input
          ref={registerFocusable}
          id={id}
          name={props.name}
          type={show ? 'text' : 'password'}
          value={props.value || ''}
          placeholder={props.placeholder}
          disabled={props.disabled}
          readOnly={inputBehavior.readOnly}
          autoComplete={inputBehavior.autoComplete ?? 'new-password'}
          // biome-ignore lint/a11y/noAutofocus: form builders expose autofocus intentionally.
          autoFocus={inputBehavior.autoFocus}
          spellCheck={inputBehavior.spellCheck}
          inputMode={inputBehavior.inputMode}
          enterKeyHint={inputBehavior.enterKeyHint}
          aria-invalid={hasError || undefined}
          aria-required={required || undefined}
          aria-readonly={inputBehavior.readOnly || undefined}
          aria-describedby={describedBy}
          aria-disabled={props.disabled || undefined}
          onChange={(event) => props.onChange(event.target.value)}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          data-fb-slot="input"
          {...(hasError && highlightOnError ? { 'data-fb-error': '' } : {})}
          {...(result?.acceptable === false && props.value
            ? { 'data-fb-unacceptable': '' }
            : {})}
          className={inputClassName}
          style={mergeStyles(
            defaultPasswordInputStyle,
            controlErrorStyle,
            styles?.textInput,
            styles?.passwordInput,
            inputPropsStyle,
          )}
          {...inputPropsRest}
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          disabled={props.disabled}
          data-fb-slot="toggle"
          className={classNames?.passwordToggle}
          style={mergeStyles(defaultPasswordToggleStyle, styles?.passwordToggle)}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {resolvedToggleContent}
        </button>
      </div>

      {resolvedStrengthRowContent}

      {shouldRenderRules && (
        <ul
          data-fb-slot="rules-list"
          className={classNames?.passwordRulesList}
          style={mergeStyles(styles?.passwordRulesList)}
        >
          {result.rules.map((rule, index) => {
            const defaultRuleContent = (
              <>
                <span
                  data-fb-slot="rule-bullet"
                  {...(rule.passed ? { 'data-fb-passed': '' } : {})}
                  className={classNames?.passwordRuleBullet}
                  style={mergeStyles(styles?.passwordRuleBullet)}
                >
                  {rule.passed ? '✓' : ''}
                </span>
                <span
                  data-fb-slot="rule-text"
                  {...(rule.passed ? { 'data-fb-passed': '' } : {})}
                  className={classNames?.passwordRuleText}
                  style={mergeStyles(styles?.passwordRuleText)}
                >
                  {rule.label}
                </span>
              </>
            );
            const customRule = renderStrengthRule?.({
              ...renderContext,
              defaultContent: defaultRuleContent,
              index,
              rule,
            });

            return customRule ? (
              <Fragment key={rule.id}>{customRule}</Fragment>
            ) : (
              <li
                key={rule.id}
                data-fb-slot="rule-item"
                {...(rule.passed ? { 'data-fb-passed': '' } : {})}
                className={classNames?.passwordRuleItem}
                style={mergeStyles(styles?.passwordRuleItem)}
              >
                {defaultRuleContent}
              </li>
            );
          })}
        </ul>
      )}

      {renderHelperSlot({
        error: props.error,
        hint: props.hint,
        name: props.name,
        errorId,
        hintId,
        classNames: classNames as Record<string, string | undefined>,
        styles: styles as Record<string, React.CSSProperties | undefined>,
        errorProps: errorProps as Record<string, unknown>,
        hintProps: hintProps as Record<string, unknown>,
        renderError,
        renderHint,
      })}
    </div>
  );
};

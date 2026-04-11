import type { CSSProperties } from 'react';
import { Fragment, useMemo, useState } from 'react';

import type { PasswordStrengthMeta } from '../../core/field-builders/password/PasswordWithStrength';
import { scorePassword } from '../../core/field-builders/password/strength';
import type { StrengthResult } from '../../core/field-builders/password/types';
import type { FocusableFieldHandle } from '../../types';
import type { WebPasswordFieldPropsOverrides } from '../../types/ui-web';
import type { ExtraFieldProps, FieldRenderProps } from '../../types.web';
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
    rootProps,
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
    className: rootPropsClassName,
    style: rootPropsStyle,
    ...rootPropsRest
  } = rootProps ?? {};
  const {
    className: inputPropsClassName,
    style: inputPropsStyle,
    ...inputPropsRest
  } = inputProps ?? {};
  const id = extra?.id ?? web.id ?? props.name;

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
      className={classNames?.strengthBar}
      style={mergeStyles(
        {
          minHeight: meta._strengthBarHeight,
        },
        styles?.strengthBar,
      )}
    >
      {[1, 2, 3, 4].map((level) => {
        const active = result.score >= level;

        return (
          <div
            key={level}
            data-fb-slot="strength-segment"
            {...(active ? { 'data-fb-active': '' } : {})}
            className={classNames?.strengthFill}
            style={mergeStyles(
              {
                borderRadius: meta._strengthBarRadius,
                minHeight: meta._strengthBarHeight,
                ...(active ? { backgroundColor: result.color } : null),
              },
              styles?.strengthFill,
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
        className={classNames?.strengthLabel}
        style={mergeStyles({ color: result.color }, styles?.strengthLabel)}
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
        className={classNames?.strengthEntropy}
        style={mergeStyles(styles?.strengthEntropy)}
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
        className={classNames?.strengthMeta}
        style={mergeStyles(styles?.strengthMeta)}
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
        className={classNames?.strengthRow}
        style={mergeStyles(styles?.strengthRow)}
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
      className={cx(extra?.className, classNames?.root, rootPropsClassName as string)}
      style={mergeStyles(extra?.style, styles?.root, rootPropsStyle as CSSProperties)}
      {...rootPropsRest}
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

      <div style={{ position: 'relative' }}>
        <input
          ref={registerFocusable}
          id={props.name}
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
          onChange={(event) => props.onChange(event.target.value)}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          data-fb-slot="input"
          {...(hasError && highlightOnError ? { 'data-fb-error': '' } : {})}
          {...(result?.acceptable === false && props.value
            ? { 'data-fb-unacceptable': '' }
            : {})}
          className={cx(classNames?.input, inputPropsClassName)}
          style={mergeStyles(controlErrorStyle, styles?.input, inputPropsStyle)}
          {...inputPropsRest}
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          data-fb-slot="toggle"
          className={classNames?.toggle}
          style={mergeStyles(styles?.toggle)}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {resolvedToggleContent}
        </button>
      </div>

      {resolvedStrengthRowContent}

      {shouldRenderRules && (
        <ul
          data-fb-slot="rules-list"
          className={classNames?.rulesList}
          style={mergeStyles(styles?.rulesList)}
        >
          {result.rules.map((rule, index) => {
            const defaultRuleContent = (
              <>
                <span
                  data-fb-slot="rule-bullet"
                  {...(rule.passed ? { 'data-fb-passed': '' } : {})}
                  className={classNames?.ruleBullet}
                  style={mergeStyles(styles?.ruleBullet)}
                >
                  {rule.passed ? '✓' : ''}
                </span>
                <span
                  data-fb-slot="rule-text"
                  {...(rule.passed ? { 'data-fb-passed': '' } : {})}
                  className={classNames?.ruleText}
                  style={mergeStyles(styles?.ruleText)}
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
                className={classNames?.ruleItem}
                style={mergeStyles(styles?.ruleItem)}
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
        errorId: `${props.name}-error`,
        hintId: `${props.name}-hint`,
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

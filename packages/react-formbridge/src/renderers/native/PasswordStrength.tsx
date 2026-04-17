import { useMemo, useState } from 'react';
import {
  Pressable,
  type StyleProp,
  Text,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import type { PasswordStrengthMeta } from '../../core/field-builders/password/PasswordWithStrength';
import { scorePassword } from '../../core/field-builders/password/strength';
import type {
  ExtraFieldProps,
  FieldRenderProps,
  FocusableFieldHandle,
  NativePasswordFieldPropsOverrides,
} from '../../types';
import {
  defaultErrorChromeStyle,
  defaultErrorTextStyle,
  defaultRequiredMarkStyle,
  type ResolvedNativeFieldProps,
  resolveNativeInputBehavior,
  shouldHighlightOnError,
  sx,
} from './shared';

type PasswordStrengthDescriptor = PasswordStrengthMeta & {
  _label: string;
  _placeholder?: string;
  _required: boolean;
  _hint?: string;
  _disabled: boolean;
  fieldPropsFromClient?: ResolvedNativeFieldProps;
};

interface Props extends FieldRenderProps<string> {
  strengthMeta: PasswordStrengthDescriptor;
  extra?: ExtraFieldProps<NativePasswordFieldPropsOverrides, 'native'>;
  registerFocusable?: (target: FocusableFieldHandle | null) => void;
}

const defaultPasswordShellStyle: ViewStyle = {
  position: 'relative',
  justifyContent: 'center',
};

const defaultPasswordInputStyle: TextStyle = {
  minHeight: 52,
  paddingRight: 92,
};

const defaultToggleStyle: ViewStyle = {
  position: 'absolute',
  right: 10,
  top: 9,
  minHeight: 34,
  minWidth: 34,
  paddingHorizontal: 12,
  // borderRadius: 999,
  borderWidth: 1,
  borderColor: '#d1d5db',
  backgroundColor: 'rgba(255,255,255,0.92)',
  alignItems: 'center',
  justifyContent: 'center',
};

const defaultToggleTextStyle: TextStyle = {
  color: '#334155',
  fontSize: 12,
  fontWeight: '700',
};

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

export const NativePasswordStrength = ({
  strengthMeta: descriptor,
  extra,
  registerFocusable,
  ...p
}: Props) => {
  const inputBehavior = resolveNativeInputBehavior(
    extra,
    descriptor.fieldPropsFromClient,
  );
  const defaultSecureTextEntry = inputBehavior.secureTextEntry ?? true;
  const {
    styles,
    hideLabel,
    wrapperProps,
    labelProps,
    inputProps,
    hintProps,
    errorProps,
    renderLabel,
    renderHint,
    renderError,
    renderRequiredMark,
    showPasswordText,
    hidePasswordText,
    renderToggleContent,
    renderStrengthLabel,
    renderStrengthEntropy,
    renderStrengthRowContent,
    renderStrengthRule,
  } = extra ?? {};

  const { style: wrapperPropsStyle, ...wrapperPropsRest } = (wrapperProps ?? {}) as {
    style?: StyleProp<ViewStyle>;
  } & Record<string, unknown>;
  const { style: labelPropsStyle, ...labelPropsRest } = (labelProps ?? {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;
  const { style: inputPropsStyle, ...inputPropsRest } = (inputProps ?? {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;
  const { style: hintPropsStyle, ...hintPropsRest } = (hintProps ?? {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;
  const { style: errorPropsStyle, ...errorPropsRest } = (errorProps ?? {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;

  const id = extra?.id ?? descriptor.fieldPropsFromClient?.id ?? p.name;
  const [visible, setVisible] = useState(!defaultSecureTextEntry);
  const hasError = Boolean(p.error);
  const highlightOnError = shouldHighlightOnError(
    extra?.highlightOnError,
    descriptor.fieldPropsFromClient?.highlightOnError,
  );
  const controlErrorStyle = defaultErrorChromeStyle(hasError, highlightOnError);

  const result = useMemo(() => {
    if (!p.value) {
      return null;
    }

    return scorePassword(p.value, {
      ...descriptor._strengthConfig,
      levels: descriptor._strengthCustomLevels ?? descriptor._strengthConfig.levels,
      minAcceptableScore: descriptor._strengthMinAccept,
    });
  }, [
    descriptor._strengthConfig,
    descriptor._strengthCustomLevels,
    descriptor._strengthMinAccept,
    p.value,
  ]);
  const renderContext = useMemo(
    () => ({
      disabled: p.disabled,
      hasValue: Boolean(p.value),
      revealed: visible,
      result,
      valueLength: p.value?.length ?? 0,
    }),
    [p.disabled, p.value, result, visible],
  );
  const resolvedShowPasswordText = resolveText(showPasswordText, 'Show', renderContext);
  const resolvedHidePasswordText = resolveText(hidePasswordText, 'Hide', renderContext);
  const defaultToggleContent = (
    <Text style={sx(defaultToggleTextStyle, styles?.passwordToggleText)}>
      {visible ? resolvedHidePasswordText : resolvedShowPasswordText}
    </Text>
  );
  const resolvedToggleContent =
    renderToggleContent?.({
      ...renderContext,
      defaultContent: defaultToggleContent,
    }) ?? defaultToggleContent;
  const defaultStrengthBarContent =
    descriptor._strengthShowBar && result ? (
      <View
        style={sx(
          {
            // borderRadius: descriptor._strengthBarRadius,
            minHeight: descriptor._strengthBarHeight,
            overflow: 'hidden',
          },
          styles?.passwordStrengthBar,
        )}
      >
        <View
          style={sx(
            {
              backgroundColor: result.color,
              // borderRadius: descriptor._strengthBarRadius,
              minHeight: descriptor._strengthBarHeight,
              width: `${result.percent}%`,
            },
            styles?.passwordStrengthFill,
          )}
        />
      </View>
    ) : null;
  const defaultStrengthLabelContent =
    descriptor._strengthShowLabel && result ? (
      <Text
        style={sx(
          {
            color: result.color,
          },
          styles?.passwordStrengthLabel,
        )}
      >
        {result.label}
      </Text>
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
    descriptor._strengthShowEntropy && result ? (
      <Text style={sx(styles?.passwordStrengthEntropy)}>{result.entropy} bits</Text>
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
      <View style={sx(styles?.passwordStrengthMeta)}>
        {resolvedStrengthLabelContent}
        {resolvedStrengthEntropyContent}
      </View>
    ) : null;
  const defaultStrengthRowContent =
    result && (defaultStrengthBarContent || defaultStrengthMetaContent) ? (
      <View style={sx(styles?.passwordStrengthRow)}>
        {defaultStrengthBarContent}
        {defaultStrengthMetaContent}
      </View>
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
    descriptor._strengthShowRules &&
    result &&
    p.value &&
    !(descriptor._strengthHideRulesWhenValid && result.acceptable && !p.error);

  const requiredMark = renderRequiredMark?.() ?? (
    <Text style={sx(defaultRequiredMarkStyle(), styles?.requiredMark)}>*</Text>
  );

  return (
    <View
      style={sx(extra?.style as StyleProp<ViewStyle>, styles?.wrapper, wrapperPropsStyle)}
      {...wrapperPropsRest}
    >
      {!hideLabel &&
        (renderLabel?.({
          id,
          label: p.label,
          required: Boolean(descriptor._required),
          name: p.name,
        }) ?? (
          <Text
            style={sx(styles?.label, labelPropsStyle)}
            {...labelPropsRest}
          >
            {p.label}
            {descriptor._required && requiredMark}
          </Text>
        ))}

      <View style={sx(defaultPasswordShellStyle)}>
        <TextInput
          nativeID={id}
          ref={registerFocusable}
          testID={inputBehavior.testID}
          value={p.value ?? ''}
          placeholder={p.placeholder ?? descriptor._placeholder}
          editable={!(p.disabled || inputBehavior.readOnly)}
          secureTextEntry={!visible}
          autoFocus={inputBehavior.autoFocus}
          autoComplete={inputBehavior.autoComplete as TextInputProps['autoComplete']}
          keyboardType={inputBehavior.keyboardType as TextInputProps['keyboardType']}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={p.onChange}
          onBlur={p.onBlur}
          onFocus={p.onFocus}
          style={sx(
            defaultPasswordInputStyle,
            styles?.passwordInput,
            inputPropsStyle,
            controlErrorStyle,
          )}
          {...(inputPropsRest as Partial<TextInputProps>)}
        />

        <Pressable
          onPress={() => setVisible((prev) => !prev)}
          style={sx(defaultToggleStyle, styles?.passwordToggle)}
        >
          {resolvedToggleContent}
        </Pressable>
      </View>

      {resolvedStrengthRowContent}

      {shouldRenderRules ? (
        <View style={sx(styles?.passwordRulesList)}>
          {result.rules.map((rule, index) => {
            const defaultRuleContent = (
              <>
                <Text style={sx(styles?.passwordRuleBullet)}>
                  {rule.passed ? '✓' : ''}
                </Text>
                <Text style={sx(styles?.passwordRuleText)}>{rule.label}</Text>
              </>
            );
            const customRule = renderStrengthRule?.({
              ...renderContext,
              defaultContent: defaultRuleContent,
              index,
              rule,
            });

            return customRule ? (
              <View
                key={rule.id}
                style={sx(styles?.passwordRuleItem)}
              >
                {customRule}
              </View>
            ) : (
              <View
                key={rule.id}
                style={sx(styles?.passwordRuleItem)}
              >
                <Text style={sx(styles?.passwordRuleBullet)}>
                  {rule.passed ? '✓' : ''}
                </Text>
                <Text style={sx(styles?.passwordRuleText)}>{rule.label}</Text>
              </View>
            );
          })}
        </View>
      ) : null}

      {p.error
        ? (renderError?.({ id, name: p.name, error: p.error }) ?? (
            <Text
              style={sx(defaultErrorTextStyle(true), styles?.error, errorPropsStyle)}
              {...errorPropsRest}
            >
              {p.error}
            </Text>
          ))
        : p.hint
          ? (renderHint?.({ id, name: p.name, hint: p.hint }) ?? (
              <Text
                style={sx(styles?.hint, hintPropsStyle)}
                {...hintPropsRest}
              >
                {p.hint}
              </Text>
            ))
          : null}
    </View>
  );
};

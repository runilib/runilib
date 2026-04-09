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
  NativePasswordFieldUiOverrides,
} from '../../types';
import {
  defaultErrorChromeStyle,
  defaultErrorTextStyle,
  defaultRequiredMarkStyle,
  type ResolvedNativeFieldUi,
  shouldHighlightOnError,
  sx,
} from './shared';

type PasswordStrengthDescriptor = PasswordStrengthMeta & {
  _label: string;
  _placeholder?: string;
  _required: boolean;
  _hint?: string;
  _disabled: boolean;
  _ui?: ResolvedNativeFieldUi;
};

interface Props extends FieldRenderProps<string> {
  strengthMeta: PasswordStrengthDescriptor;
  extra?: ExtraFieldProps<NativePasswordFieldUiOverrides, 'native'>;
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
  borderRadius: 999,
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
  strengthMeta: d,
  extra,
  registerFocusable,
  ...p
}: Props) => {
  const {
    styles,
    hideLabel,
    rootProps,
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

  const { style: rootPropsStyle, ...rootPropsRest } = (rootProps ?? {}) as {
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

  const id = d._ui?.id ?? p.name;
  const [visible, setVisible] = useState(false);
  const hasError = Boolean(p.error);
  const highlightOnError = shouldHighlightOnError(
    extra?.highlightOnError,
    d._ui?.highlightOnError,
  );
  const controlErrorStyle = defaultErrorChromeStyle(hasError, highlightOnError);

  const result = useMemo(() => {
    if (!p.value) {
      return null;
    }

    return scorePassword(p.value, {
      ...d._strengthConfig,
      levels: d._strengthCustomLevels ?? d._strengthConfig.levels,
      minAcceptableScore: d._strengthMinAccept,
    });
  }, [d._strengthConfig, d._strengthCustomLevels, d._strengthMinAccept, p.value]);
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
    <Text style={sx(defaultToggleTextStyle, styles?.toggleText)}>
      {visible ? resolvedHidePasswordText : resolvedShowPasswordText}
    </Text>
  );
  const resolvedToggleContent =
    renderToggleContent?.({
      ...renderContext,
      defaultContent: defaultToggleContent,
    }) ?? defaultToggleContent;
  const defaultStrengthBarContent =
    d._strengthShowBar && result ? (
      <View
        style={sx(
          {
            borderRadius: d._strengthBarRadius,
            minHeight: d._strengthBarHeight,
            overflow: 'hidden',
          },
          styles?.strengthBar,
        )}
      >
        <View
          style={sx(
            {
              backgroundColor: result.color,
              borderRadius: d._strengthBarRadius,
              minHeight: d._strengthBarHeight,
              width: `${result.percent}%`,
            },
            styles?.strengthFill,
          )}
        />
      </View>
    ) : null;
  const defaultStrengthLabelContent =
    d._strengthShowLabel && result ? (
      <Text
        style={sx(
          {
            color: result.color,
          },
          styles?.strengthLabel,
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
    d._strengthShowEntropy && result ? (
      <Text style={sx(styles?.strengthEntropy)}>{result.entropy} bits</Text>
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
      <View style={sx(styles?.strengthMeta)}>
        {resolvedStrengthLabelContent}
        {resolvedStrengthEntropyContent}
      </View>
    ) : null;
  const defaultStrengthRowContent =
    result && (defaultStrengthBarContent || defaultStrengthMetaContent) ? (
      <View style={sx(styles?.strengthRow)}>
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
    d._strengthShowRules &&
    result &&
    p.value &&
    !(d._strengthHideRulesWhenValid && result.acceptable && !p.error);

  const requiredMark = renderRequiredMark?.() ?? (
    <Text style={sx(defaultRequiredMarkStyle(), styles?.requiredMark)}>*</Text>
  );

  return (
    <View
      style={sx(extra?.style as StyleProp<ViewStyle>, styles?.root, rootPropsStyle)}
      {...rootPropsRest}
    >
      {!hideLabel &&
        (renderLabel?.({
          id,
          label: p.label,
          required: Boolean(d._required),
          name: p.name,
        }) ?? (
          <Text
            style={sx(styles?.label, labelPropsStyle)}
            {...labelPropsRest}
          >
            {p.label}
            {d._required && requiredMark}
          </Text>
        ))}

      <View style={sx(defaultPasswordShellStyle)}>
        <TextInput
          nativeID={id}
          ref={registerFocusable}
          testID={d._ui?.testID}
          value={p.value ?? ''}
          placeholder={p.placeholder ?? d._placeholder}
          editable={!p.disabled}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={p.onChange}
          onBlur={p.onBlur}
          onFocus={p.onFocus}
          style={sx(
            defaultPasswordInputStyle,
            controlErrorStyle,
            styles?.input,
            inputPropsStyle,
          )}
          {...(inputPropsRest as Partial<TextInputProps>)}
        />

        <Pressable
          onPress={() => setVisible((prev) => !prev)}
          style={sx(defaultToggleStyle, styles?.toggle)}
        >
          {resolvedToggleContent}
        </Pressable>
      </View>

      {resolvedStrengthRowContent}

      {shouldRenderRules ? (
        <View style={sx(styles?.rulesList)}>
          {result.rules.map((rule, index) => {
            const defaultRuleContent = (
              <>
                <Text style={sx(styles?.ruleBullet)}>{rule.passed ? '✓' : ''}</Text>
                <Text style={sx(styles?.ruleText)}>{rule.label}</Text>
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
                style={sx(styles?.ruleItem)}
              >
                {customRule}
              </View>
            ) : (
              <View
                key={rule.id}
                style={sx(styles?.ruleItem)}
              >
                <Text style={sx(styles?.ruleBullet)}>{rule.passed ? '✓' : ''}</Text>
                <Text style={sx(styles?.ruleText)}>{rule.label}</Text>
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

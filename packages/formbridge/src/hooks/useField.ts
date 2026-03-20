import { useState, useCallback, useRef } from 'react';
import { isWeb } from '../utils/platform';
import { runRules } from '../validators/rules';
import type { FieldValue, FieldRules, FieldState } from '../types';

interface UseFieldOptions<V extends FieldValue = FieldValue> {
  defaultValue?: V;
  rules?:        FieldRules<V>;
  onChange?:     (value: V) => void;
}

interface UseFieldReturn<V extends FieldValue = FieldValue> {
  value:      V;
  error:      string | null;
  touched:    boolean;
  dirty:      boolean;
  validating: boolean;
  /** Props to spread on a web <input> */
  inputProps: {
    value:    string | number | boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur:   () => void;
  };
  /** Props to spread on a RN <TextInput> */
  textInputProps: {
    value:         string;
    onChangeText:  (text: string) => void;
    onBlur:        () => void;
  };
  /** Set value programmatically */
  setValue:   (value: V, validate?: boolean) => void;
  /** Manually validate */
  validate:   () => Promise<string | null>;
  /** Reset to default */
  reset:      () => void;
}

/**
 * `useField` — standalone single-field hook.
 * Useful when you don't need a full form, or for custom components.
 *
 * @example
 * const { value, error, inputProps } = useField({ defaultValue: '', rules: { required: true } });
 * <input {...inputProps} />
 */
export function useField<V extends FieldValue = string>({
  defaultValue = '' as V,
  rules,
  onChange,
}: UseFieldOptions<V> = {}): UseFieldReturn<V> {
  const [state, setState] = useState<FieldState>({
    value:      defaultValue,
    error:      null,
    touched:    false,
    dirty:      false,
    validating: false,
  });

  const defaultRef = useRef(defaultValue);

  const doValidate = useCallback(async (val: V): Promise<string | null> => {
    if (!rules) return null;
    const err = await runRules(val, rules, { field: val });
    return err ?? null;
  }, [rules]);

  const setValue = useCallback(async (val: V, validate = false) => {
    const dirty = val !== defaultRef.current;
    let error   = state.error;

    if (validate && rules) {
      setState(s => ({ ...s, validating: true }));
      error = await doValidate(val);
    }

    setState(s => ({ ...s, value: val, dirty, error, validating: false }));
    onChange?.(val);
  }, [state.error, rules, doValidate, onChange]);

  const handleBlur = useCallback(async () => {
    if (!state.touched) {
      setState(s => ({ ...s, touched: true }));
    }
    if (rules) {
      setState(s => ({ ...s, validating: true }));
      const error = await doValidate(state.value as V);
      setState(s => ({ ...s, error, validating: false }));
    }
  }, [state.touched, state.value, rules, doValidate]);

  const validate = useCallback(() => doValidate(state.value as V), [state.value, doValidate]);

  const reset = useCallback(() => {
    setState({ value: defaultRef.current, error: null, touched: false, dirty: false, validating: false });
  }, []);

  return {
    value:      state.value as V,
    error:      state.error,
    touched:    state.touched,
    dirty:      state.dirty,
    validating: state.validating,
    inputProps: {
      value:    state.value as string | number | boolean,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const el  = e.target as HTMLInputElement;
        const val = el.type === 'checkbox' ? (el.checked as unknown as V) : (el.value as unknown as V);
        setValue(val, false);
      },
      onBlur: handleBlur,
    },
    textInputProps: {
      value:         String(state.value ?? ''),
      onChangeText:  (text: string) => setValue(text as unknown as V, false),
      onBlur:        handleBlur,
    },
    setValue,
    validate,
    reset,
  };
}

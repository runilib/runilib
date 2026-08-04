import type { ReactNode } from 'react';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';

type NativeController = {
  name: string;
  value: unknown;
  displayValue?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string | null;
  visible: boolean;
  disabled: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
};

type NativeFieldProps = {
  controller: NativeController;
  secureTextEntry?: boolean;
  multiline?: boolean;
};

function toInputValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function NativeField({
  controller,
  secureTextEntry,
  multiline,
}: NativeFieldProps) {
  if (!controller.visible) return null;

  if (typeof controller.value === 'boolean') {
    return (
      <View style={{ gap: 6 }}>
        <Text>{controller.label ?? controller.name}</Text>
        <Switch
          value={controller.value}
          disabled={controller.disabled}
          onValueChange={controller.onChange}
          onBlur={controller.onBlur}
        />
        {controller.error ? (
          <Text style={{ color: '#dc2626' }}>{controller.error}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={{ gap: 6 }}>
      <Text>{controller.label ?? controller.name}</Text>
      <TextInput
        value={controller.displayValue ?? toInputValue(controller.value)}
        placeholder={controller.placeholder}
        editable={!controller.disabled}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        keyboardType={
          controller.name.toLowerCase().includes('email') ? 'email-address' : 'default'
        }
        onChangeText={controller.onChange}
        onBlur={controller.onBlur}
        onFocus={controller.onFocus}
        style={{
          minHeight: multiline ? 96 : undefined,
          borderWidth: 1,
          borderColor: controller.error ? '#ef4444' : 'rgba(37,99,235,0.18)',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          color: '#10203a',
          backgroundColor: '#fff',
        }}
      />
      {controller.hint ? (
        <Text style={{ color: '#64748b' }}>{controller.hint}</Text>
      ) : null}
      {controller.error ? (
        <Text style={{ color: '#dc2626' }}>{controller.error}</Text>
      ) : null}
    </View>
  );
}

export function NativeSubmit({
  children,
  disabled,
  onPress,
}: {
  children: ReactNode;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={{
        minHeight: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: disabled ? '#c7d2fe' : '#2563eb',
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700' }}>{children}</Text>
    </Pressable>
  );
}

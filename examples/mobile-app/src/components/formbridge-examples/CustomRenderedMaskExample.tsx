import { useCallback, useMemo, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import type { FieldController } from '@runilib/react-formbridge';
import { field, useFormBridge } from '@runilib/react-formbridge';

import { formExampleStyles as s } from './FormExamples.styles';
import { MaskExampleCard } from './MaskExampleCard';
import { NativeField, NativeSubmit } from './nativeFormHelpers';
import { simulateSubmitDelay } from './shared';

const ACCESS_CODE_PREFIX = 'OPS';

type CustomMaskSchema = {
  workspaceName: ReturnType<typeof field.text>;
  launchAccessCode: ReturnType<typeof field.masked>;
};

type AccessCodeState = {
  inputValue: string;
  storedValue: string;
  rawValue: string;
  digits: string;
  letters: string;
  complete: boolean;
};

function buildAccessCodeState(source: string): AccessCodeState {
  const upper = source.toUpperCase().replace(/^OPS[-\s]?/, '');
  const digits = upper.replace(/\D/g, '').slice(0, 4);
  const letters = digits.length === 4 ? upper.replace(/[^A-Z]/g, '').slice(0, 2) : '';
  const inputValue = `${digits}${digits.length === 4 ? '-' : ''}${letters}`;
  const storedValue = inputValue ? `${ACCESS_CODE_PREFIX}-${inputValue}` : '';

  return {
    inputValue,
    storedValue,
    rawValue: `${digits}${letters}`,
    digits,
    letters,
    complete: digits.length === 4 && letters.length === 2,
  };
}

function CustomRenderedAccessCodeField({
  controller,
}: {
  controller: FieldController<CustomMaskSchema, 'launchAccessCode'>;
}) {
  const registerInput = useCallback(
    (node: TextInput | null) => {
      controller.registerFocusable(node);
    },
    [controller],
  );

  const meta = useMemo(
    () =>
      buildAccessCodeState(typeof controller.value === 'string' ? controller.value : ''),
    [controller.value],
  );

  const helperText =
    controller.error ??
    controller.hint ??
    'The prefix stays outside the input. Enter four digits, then two letters.';
  const helperStyle = controller.error ? s.customMaskError : s.customMaskHint;
  const statusLabel = controller.error
    ? 'Needs review'
    : meta.complete
      ? 'Ready to issue'
      : meta.rawValue.length > 0
        ? 'In progress'
        : 'Awaiting entry';
  const statusToneStyle = controller.error
    ? s.customMaskStatusError
    : meta.complete
      ? s.customMaskStatusReady
      : s.customMaskStatusIdle;
  const shellToneStyle = controller.error
    ? s.customMaskShellError
    : meta.complete
      ? s.customMaskShellReady
      : null;
  const visiblePlaceholder = (controller.placeholder ?? '2048-QA').replace(
    /^OPS[-\s]?/,
    '',
  );

  return (
    <View style={s.customMaskField}>
      <View style={s.customMaskHeader}>
        <View style={s.customMaskLabelRow}>
          <Text style={s.customMaskLabel}>{controller.label}</Text>
          <Text style={s.customMaskRequired}>*</Text>
        </View>

        <View style={[s.customMaskStatus, statusToneStyle]}>
          <Text style={s.customMaskStatusText}>{statusLabel}</Text>
        </View>
      </View>

      <View style={[s.customMaskShell, shellToneStyle]}>
        <View style={s.customMaskPrefixBadge}>
          <Text style={s.customMaskPrefixText}>{ACCESS_CODE_PREFIX}</Text>
        </View>

        <TextInput
          ref={registerInput}
          value={meta.inputValue}
          placeholder={visiblePlaceholder}
          editable={!controller.disabled}
          autoCorrect={false}
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={7}
          selectionColor="#f97316"
          placeholderTextColor="#7c6c5a"
          style={s.customMaskInput}
          onChangeText={(text) => {
            controller.onChange(buildAccessCodeState(text).storedValue);
          }}
          onBlur={controller.onBlur}
          onFocus={controller.onFocus}
        />
      </View>

      <View style={s.customMaskFooter}>
        <Text style={helperStyle}>{helperText}</Text>
        <Text style={s.customMaskMeta}>
          {meta.digits.length}/4 digits · {meta.letters.length}/2 letters
        </Text>
      </View>
    </View>
  );
}

export function CustomRenderedMaskExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);

  const formSchema = useMemo(
    (): CustomMaskSchema => ({
      workspaceName: field
        .text('Workspace')
        .required('Required')
        .placeholder('Ops bridge'),
      launchAccessCode: field
        .masked('OPS-9999-LL')
        .label('Launch access code')
        .placeholder('2048-QA')
        .hint(
          'This field is rendered manually through form.fieldController(...), so the UI is entirely custom.',
        )
        .required('Access code is required')
        .validateComplete('Complete the launch access code.'),
    }),
    [],
  );

  const form = useFormBridge(formSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  });

  const { Form, fieldController, state, watchAll } = form;
  const liveValues = watchAll();
  const launchAccessCode = fieldController('launchAccessCode');
  const codeState = buildAccessCodeState(String(liveValues.launchAccessCode ?? ''));

  return (
    <MaskExampleCard
      maskName="Custom render"
      accent="#fb7185"
      title="Own the full mobile input chrome"
      description="This example keeps FormBridge state, validation, touched state, and submit flow, while the React Native UI is rendered completely by hand from form.fieldController(...)."
      highlights={[
        'form.fieldController(...)',
        'Imperative focus()',
        'Custom prefix + status row',
      ]}
      preview={
        <>
          <Text style={s.previewValue}>
            {String(liveValues.launchAccessCode || 'OPS-2048-QA')}
          </Text>
          <Text style={s.previewText}>
            Raw suffix {codeState.rawValue || '2048QA'} ·{' '}
            {codeState.complete ? 'complete and ready' : 'still being composed'}
          </Text>
        </>
      }
      parsedSubmission={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Launch access saved for ${String(liveValues.workspaceName || 'workspace')}`
          : null
      }
      submitError={state.submitError}
      footer="With fieldController, the field still lives in the schema, but you decide every native view and still keep the same lifecycle hooks."
    >
      <Form
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <View style={s.sectionBlock}>
          <Text style={s.sectionBlockTitle}>Mission control</Text>

          <NativeField controller={fieldController('workspaceName')} />
          <CustomRenderedAccessCodeField controller={launchAccessCode} />
        </View>

        <View style={s.actionRow}>
          <TouchableOpacity
            style={s.secondaryButton}
            onPress={() => launchAccessCode.focus()}
          >
            <Text style={s.secondaryButtonText}>Focus code field</Text>
          </TouchableOpacity>

          <NativeSubmit onPress={() => void form.submit()}>Save launch code</NativeSubmit>
        </View>
      </Form>
    </MaskExampleCard>
  );
}

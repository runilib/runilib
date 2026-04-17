import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  type FieldController,
  field,
  type SelectPickerRenderContext,
  useFormBridge,
} from '@runilib/react-formbridge';

import * as Haptics from 'expo-haptics';
import { FieldVariantCard } from './FieldVariantCard';
import { formExampleStyles as s } from './FormExamples.styles';
import {
  ACCESS_ROLE_OPTIONS,
  CITY_DIRECTORY_OPTIONS,
  createNativeFormUi,
  ROUTING_MODE_OPTIONS,
  searchCityDirectory,
  simulateSubmitDelay,
  WORKSPACE_OPTIONS,
} from './shared';

type SelectVariantSchema = {
  workspace: ReturnType<typeof field.select>;
  accessRole: ReturnType<typeof field.radio>;
  cityLookup: ReturnType<typeof field.select>;
  routingMode: ReturnType<typeof field.select>;
};

function CustomRoutingModeField({
  controller,
}: {
  controller: FieldController<SelectVariantSchema, 'routingMode'>;
}) {
  const [open, setOpen] = useState(false);
  const selectedOption =
    controller.options?.find((option) => option.value === controller.value) ?? null;

  const openPicker = useCallback(() => {
    if (controller.disabled) {
      return;
    }

    setOpen(true);
    controller.onFocus();
  }, [controller]);

  const closePicker = useCallback(
    (markTouched = true) => {
      setOpen(false);

      if (markTouched) {
        controller.onBlur();
      }
    },
    [controller],
  );

  useEffect(() => {
    controller.registerFocusable({
      focus: openPicker,
      blur: () => closePicker(true),
    });

    return () => {
      controller.registerFocusable(null);
    };
  }, [closePicker, controller, openPicker]);

  return (
    <View style={s.controllerSelectField}>
      <View style={s.controllerSelectHeader}>
        <View style={s.controllerSelectLabelRow}>
          <Text style={s.controllerSelectLabel}>{controller.label}</Text>
          <Text style={s.controllerSelectRequired}>*</Text>
        </View>

        <View style={s.controllerSelectBadge}>
          <Text style={s.controllerSelectBadgeText}>controller</Text>
        </View>
      </View>

      <Pressable
        onPress={openPicker}
        disabled={controller.disabled}
        style={[
          s.controllerSelectTrigger,
          controller.error ? s.controllerSelectTriggerError : null,
        ]}
      >
        <View style={s.controllerSelectTriggerBody}>
          <Text style={s.controllerSelectCaption}>Routing mode</Text>
          <Text
            style={[
              s.controllerSelectValue,
              !selectedOption ? s.controllerSelectPlaceholder : null,
            ]}
          >
            {selectedOption?.label ?? controller.placeholder ?? 'Choose a routing mode'}
          </Text>
        </View>

        <Text style={s.controllerSelectChevron}>▾</Text>
      </Pressable>

      <View style={s.controllerSelectFooter}>
        <Text style={controller.error ? s.customMaskError : s.customMaskHint}>
          {controller.error ??
            controller.hint ??
            'This field is rendered manually from form.fieldController(...).'}
        </Text>

        <TouchableOpacity
          style={s.controllerSelectShortcut}
          onPress={() => controller.focus()}
        >
          <Text style={s.controllerSelectShortcutText}>focus()</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => closePicker(true)}
      >
        <Pressable
          style={[
            s.optionModalBackdrop,
            {
              flex: 1,
              justifyContent: 'center',
              padding: 20,
            },
          ]}
          onPress={() => closePicker(true)}
        >
          <Pressable
            style={[
              s.optionModalCard,
              {
                width: '100%',
                padding: 18,
                gap: 12,
              },
            ]}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={{ gap: 6 }}>
              <Text style={s.previewHeading}>Custom controller picker</Text>
              <Text style={s.resolverHeading}>{controller.label}</Text>
              <Text style={s.resolverText}>
                This picker is fully hand-rendered while the field still uses FormBridge
                state, validation, and focus wiring.
              </Text>
            </View>

            {(controller.options ?? []).map((option) => {
              const active = option.value === controller.value;

              return (
                <Pressable
                  key={String(option.value)}
                  style={[
                    s.controllerSelectOption,
                    active ? s.controllerSelectOptionActive : null,
                  ]}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    controller.onChange(option.value as string);
                    closePicker(true);
                  }}
                >
                  <View style={{ gap: 4 }}>
                    <Text style={s.optionLabel}>{option.label}</Text>
                    <Text style={s.controllerSelectOptionNote}>
                      Stored value: {String(option.value)}
                    </Text>
                  </View>

                  {active ? <Text style={s.controllerSelectCheck}>✓</Text> : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function renderCityPicker({
  open,
  search,
  setSearch,
  options,
  loading,
  triggerLabel,
  closePicker,
  selectOption,
}: SelectPickerRenderContext) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={closePicker}
    >
      <Pressable
        style={[
          s.optionModalBackdrop,
          {
            flex: 1,
            justifyContent: 'center',
            padding: 20,
          },
        ]}
        onPress={closePicker}
      >
        <Pressable
          style={[
            s.optionModalCard,
            {
              width: '100%',
              padding: 18,
              gap: 12,
              maxHeight: '72%',
            },
          ]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={{ gap: 6 }}>
            <Text style={s.previewHeading}>Custom city lookup</Text>
            <Text style={s.resolverHeading}>{triggerLabel}</Text>
            <Text style={s.resolverText}>
              Type to fetch matching cities inside your own modal surface.
            </Text>
          </View>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Type a city name..."
            autoFocus
            style={s.fieldInput}
          />

          <ScrollView
            style={{ maxHeight: 260 }}
            contentContainerStyle={{ gap: 10 }}
            keyboardShouldPersistTaps="handled"
          >
            {loading ? (
              <View style={s.payloadCard}>
                <Text style={s.previewText}>Loading cities…</Text>
              </View>
            ) : options.length === 0 ? (
              <View style={s.payloadCard}>
                <Text style={s.previewText}>No matching city.</Text>
              </View>
            ) : (
              options.map((option) => (
                <Pressable
                  key={String(option.value)}
                  style={[
                    s.optionRow,
                    {
                      paddingHorizontal: 14,
                      paddingVertical: 14,
                      backgroundColor: '#f8fafc',
                      borderWidth: 1,
                      borderColor: '#dbe3f0',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    },
                  ]}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    selectOption(option);
                  }}
                >
                  <Text style={s.optionLabel}>{option.label}</Text>
                  <Text
                    style={[
                      s.resolverEyebrowText,
                      {
                        color: '#2563eb',
                        letterSpacing: 0.6,
                      },
                    ]}
                  >
                    remote
                  </Text>
                </Pressable>
              ))
            )}
          </ScrollView>

          <Pressable
            style={[
              s.resolverSwitch,
              {
                alignSelf: 'flex-end',
                minWidth: 0,
              },
            ]}
            onPress={closePicker}
          >
            <Text style={s.resolverSwitchLabel}>Close</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function SelectVariantsExample() {
  const [lastSubmission, setLastSubmission] = useState<Record<string, unknown> | null>(
    null,
  );

  const schema = useMemo(
    (): SelectVariantSchema => ({
      workspace: field
        .select()
        .label('Workspace')
        .options(WORKSPACE_OPTIONS)
        .required('Required')
        .hint('Classic select with local options.'),
      accessRole: field
        .radio()
        .label('Access role')
        .options(ACCESS_ROLE_OPTIONS)
        .required('Required')
        .hint('Radio keeps every option visible.'),
      cityLookup: field
        .select()
        .label('City')
        .optionsFrom(searchCityDirectory, {
          key: 'mobile-field-variant-city-search',
          debounce: 420,
          minChars: 1,
          initialOptions: CITY_DIRECTORY_OPTIONS.slice(0, 4),
        })
        .required()
        .searchable()
        .placeholder('Search a city')
        .hint('Async search with a fully custom picker modal.'),
      routingMode: field
        .select()
        .options(ROUTING_MODE_OPTIONS)
        .defaultSelected('review')
        .label('Routing mode')
        .required('Required')
        .hint('Fully custom picker UI driven by fieldController.'),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalDefaults: () => createNativeFormUi(),
  });

  const { Form, fieldController, fields, watchAll } = form;
  const values = watchAll();
  const routingMode = fieldController('routingMode');
  const workspaceLabel =
    WORKSPACE_OPTIONS.find((option) => option.value === values.workspace)?.label ??
    'No workspace yet';
  const roleLabel =
    ACCESS_ROLE_OPTIONS.find((option) => option.value === values.accessRole)?.label ??
    'No role chosen';
  const cityLabel =
    CITY_DIRECTORY_OPTIONS.find((option) => option.value === values.cityLookup)?.label ??
    'No city selected';
  const routingLabel =
    ROUTING_MODE_OPTIONS.find((option) => option.value === values.routingMode)?.label ??
    'Manual review';

  return (
    <FieldVariantCard
      familyName="Select"
      accent="#60a5fa"
      title="Four ways to choose one value"
      description="Classic select, always-visible radio group, searchable async lookup, and a fully custom picker UI driven by fieldController."
      highlights={['local options', 'radio group', 'optionsFrom', 'fieldController']}
      preview={
        <View style={{ gap: 10 }}>
          <Text style={s.previewValue}>{routingLabel}</Text>
          <Text style={s.previewText}>
            The same family can scale from short static lists to remote searchable
            datasets, and even fully custom picker chrome when you want total control.
          </Text>
          <View style={s.chipRow}>
            <View style={s.chip}>
              <Text style={s.chipText}>{workspaceLabel}</Text>
            </View>
            <View style={s.chip}>
              <Text style={s.chipText}>{roleLabel}</Text>
            </View>
            <View style={s.chip}>
              <Text style={s.chipText}>{cityLabel}</Text>
            </View>
            <View style={s.chip}>
              <Text style={s.chipText}>{routingLabel}</Text>
            </View>
          </View>
        </View>
      }
      snapshot={lastSubmission ?? values}
      submittedLabel={
        lastSubmission
          ? `Saved ${String(lastSubmission.cityLookup ?? 'picker state')}`
          : null
      }
      footer="Use select for compact lists, radio when each choice should stay visible, renderPicker when the picker needs its own modal, and fieldController when you want to own the trigger and picker UI end to end."
    >
      <Form
        onSubmit={async (submittedValues) => {
          await simulateSubmitDelay(320);
          setLastSubmission(submittedValues as Record<string, unknown>);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      >
        <View style={s.sectionBlock}>
          <Text style={s.sectionBlockTitle}>Select family</Text>
          <fields.workspace highlightOnError />
          <fields.accessRole />
          <fields.cityLookup renderPicker={renderCityPicker} />
          <CustomRoutingModeField controller={routingMode} />
        </View>

        <Form.Submit
          style={s.submitButton}
          loadingText="Saving picker setup..."
        >
          Save picker setup
        </Form.Submit>
      </Form>
    </FieldVariantCard>
  );
}

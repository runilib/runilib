import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import {
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
  searchCityDirectory,
  simulateSubmitDelay,
  WORKSPACE_OPTIONS,
} from './shared';

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
    () => ({
      workspace: field
        .select('Workspace')
        .options(WORKSPACE_OPTIONS)
        .required('Required')
        .hint('Classic select with local options.'),
      accessRole: field
        .radio('Access role')
        .options(ACCESS_ROLE_OPTIONS)
        .required('Required')
        .hint('Radio keeps every option visible.'),
      cityLookup: field
        .select('City lookup')
        .optionsFrom(searchCityDirectory, {
          key: 'mobile-field-variant-city-search',
          debounce: 220,
          minChars: 1,
          initialOptions: CITY_DIRECTORY_OPTIONS.slice(0, 4),
        })
        .searchable()
        .placeholder('Search a city')
        .hint('Async search with a fully custom picker modal.')
        .appearance({
          renderPicker: renderCityPicker,
        }),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalAppearance: createNativeFormUi(),
  });

  const { Form, fields, watchAll } = form;
  const values = watchAll();
  const workspaceLabel =
    WORKSPACE_OPTIONS.find((option) => option.value === values.workspace)?.label ??
    'No workspace yet';
  const roleLabel =
    ACCESS_ROLE_OPTIONS.find((option) => option.value === values.accessRole)?.label ??
    'No role chosen';
  const cityLabel =
    CITY_DIRECTORY_OPTIONS.find((option) => option.value === values.cityLookup)?.label ??
    'No city selected';

  return (
    <FieldVariantCard
      familyName="Select"
      accent="#60a5fa"
      title="Three ways to choose one value"
      description="Classic select, always-visible radio group, and searchable async lookup with a custom native picker modal."
      highlights={['local options', 'radio group', 'optionsFrom', 'custom renderPicker']}
      preview={
        <View style={{ gap: 10 }}>
          <Text style={s.previewValue}>{cityLabel}</Text>
          <Text style={s.previewText}>
            The same family can scale from short static lists to remote searchable
            datasets.
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
          </View>
        </View>
      }
      snapshot={lastSubmission ?? values}
      submittedLabel={
        lastSubmission
          ? `Saved ${String(lastSubmission.cityLookup ?? 'picker state')}`
          : null
      }
      footer="Use select for compact lists, radio when each choice should stay visible, and searchable + renderPicker when the picker needs a dedicated modal or sheet."
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
          <fields.workspace />
          <fields.accessRole />
          <fields.cityLookup />
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

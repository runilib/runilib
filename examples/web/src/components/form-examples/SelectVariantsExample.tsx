import { useMemo, useState } from 'react';

import {
  field,
  type SelectPickerRenderContext,
  useFormBridge,
} from '@runilib/react-formbridge';

import { FieldVariantFrame } from './FieldVariantFrame';
import styles from './FormExamples.module.css';
import {
  ACCESS_ROLE_OPTIONS,
  CITY_DIRECTORY_OPTIONS,
  createDemoFormUi,
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
  if (!open) {
    return null;
  }

  return (
    <div className={styles.variantPickerOverlay}>
      <div className={styles.variantPickerDialog}>
        <div className={styles.variantPickerHeader}>
          <div>
            <p className={styles.previewLabel}>Custom city lookup</p>
            <p className={styles.variantPickerTitle}>{triggerLabel}</p>
          </div>

          <button
            type="button"
            className={styles.variantPickerClose}
            onClick={closePicker}
          >
            Close
          </button>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Type a city name..."
          className={styles.variantPickerSearch}
        />

        <div className={styles.variantPickerList}>
          {loading ? (
            <div className={styles.variantPickerEmpty}>Loading cities…</div>
          ) : options.length === 0 ? (
            <div className={styles.variantPickerEmpty}>No matching city.</div>
          ) : (
            options.map((option) => (
              <button
                key={String(option.value)}
                type="button"
                className={styles.variantPickerOption}
                onClick={() => selectOption(option)}
              >
                <span>{option.label}</span>
                <span className={styles.variantPickerOptionMeta}>remote option</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
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
        .required('Select a workspace')
        .hint('Classic select fed by local options.'),
      accessRole: field
        .radio('Access role')
        .options(ACCESS_ROLE_OPTIONS)
        .required('Choose an access role')
        .hint('Radio keeps every choice visible at once.'),
      cityLookup: field
        .select('City lookup')
        .optionsFrom(searchCityDirectory, {
          key: 'field-variant-city-search',
          debounce: 220,
          minChars: 1,
          initialOptions: CITY_DIRECTORY_OPTIONS.slice(0, 4),
        })
        .searchable()
        .placeholder('Search a city')
        .hint('Custom picker modal powered by remote search.')
        .behavior({
          renderPicker: renderCityPicker,
        }),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalUi: createDemoFormUi(styles),
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
    <FieldVariantFrame
      familyName="Select"
      accent="#60a5fa"
      title="Three ways to let users choose one value"
      description="This demo combines the native select renderer, the radio-group variant, and a searchable async lookup with a fully custom picker modal."
      highlights={['local options', 'radio group', 'optionsFrom', 'custom renderPicker']}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>{cityLabel}</p>
          <p className={styles.resolverPreviewMuted}>
            Current selection stack across the three select flavors.
          </p>
          <div className={styles.points}>
            <span className={styles.point}>{workspaceLabel}</span>
            <span className={styles.point}>{roleLabel}</span>
            <span className={styles.point}>{cityLabel}</span>
          </div>
        </>
      }
      snapshot={lastSubmission ?? values}
      submittedLabel={
        lastSubmission
          ? `Saved ${String(lastSubmission.cityLookup ?? 'picker state')}`
          : null
      }
      footer="Use the classic select for short lists, radio for always-visible choices, and searchable + renderPicker when the picker needs its own custom surface."
    >
      <Form
        className={styles.resolverForm}
        onSubmit={async (submittedValues) => {
          await simulateSubmitDelay(350);
          setLastSubmission(submittedValues as Record<string, unknown>);
        }}
      >
        <fields.workspace />
        <fields.accessRole />
        <fields.cityLookup />

        <Form.Submit
          className={styles.submitButton}
          loadingText="Saving picker setup…"
        >
          Save picker setup
        </Form.Submit>
      </Form>
    </FieldVariantFrame>
  );
}

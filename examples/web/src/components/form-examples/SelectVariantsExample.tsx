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
  SEAT_PACK_OPTIONS,
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
      defaultWorkspace: field
        .select()
        .options(WORKSPACE_OPTIONS)
        .label('Default workspace')
        .defaultSelected('revenue')
        .required('Select a workspace')
        .hint('Starts selected immediately. No empty option is injected on load.'),
      seatPack: field
        .select()
        .options(SEAT_PACK_OPTIONS)
        .label('Seat pack')
        .defaultSelected(12)
        .hint('Numeric options stay numbers in form state, even after changes.'),
      accessRole: field
        .radio()
        .label('Access role')
        .options(ACCESS_ROLE_OPTIONS)
        .required('Choose an access role')
        .hint('Radio keeps every choice visible at once.'),
      cityLookup: field
        .select()
        .label('City')
        .optionsFrom(searchCityDirectory, {
          key: 'field-variant-city-search',
          debounce: 220,
          minChars: 1,
          initialOptions: CITY_DIRECTORY_OPTIONS.slice(0, 4),
        })
        .searchable()
        .placeholder('Search a city')
        .hint('Custom picker modal powered by remote search.'),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalStyles: () => createDemoFormUi(styles),
  });

  const { Form, fields, watchAll } = form;
  const values = watchAll();
  const workspaceLabel =
    WORKSPACE_OPTIONS.find((option) => option.value === values.defaultWorkspace)?.label ??
    'No workspace preset';
  const seatPackLabel =
    SEAT_PACK_OPTIONS.find((option) => option.value === values.seatPack)?.label ??
    'No seat pack yet';
  const seatPackType = typeof values.seatPack;
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
      title="Preselected, numeric, radio, and remote select flows"
      description="This demo now covers the new select behavior too: a classic select can boot with a real default-selected value, numeric option values stay typed, radio still keeps every choice visible, and async search can still own a custom picker surface."
      highlights={[
        'defaultSelected',
        'numeric values preserved',
        'radio group',
        'custom renderPicker',
      ]}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>{workspaceLabel}</p>
          <p className={styles.resolverPreviewMuted}>
            Seat pack is currently stored as {seatPackLabel}, and the runtime value stays
            a {seatPackType}.
          </p>
          <div className={styles.points}>
            <span className={styles.point}>{workspaceLabel}</span>
            <span className={styles.point}>{seatPackLabel}</span>
            <span className={styles.point}>{roleLabel}</span>
            <span className={styles.point}>{cityLabel}</span>
          </div>
        </>
      }
      snapshot={lastSubmission ?? values}
      submittedLabel={
        lastSubmission
          ? `Saved ${String(lastSubmission.cityLookup ?? lastSubmission.defaultWorkspace ?? 'picker state')}`
          : null
      }
      footer="Use defaultSelected when the form should open on a meaningful choice, keep numeric option values when downstream logic expects numbers, then reach for renderPicker only when the picker genuinely needs its own UI."
    >
      <Form
        className={styles.resolverForm}
        onSubmit={async (submittedValues) => {
          await simulateSubmitDelay(350);
          setLastSubmission(submittedValues as Record<string, unknown>);
        }}
      >
        <div className={styles.formRow}>
          <fields.defaultWorkspace />
          <fields.seatPack />
        </div>
        <fields.accessRole />
        <fields.cityLookup renderPicker={renderCityPicker} />

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

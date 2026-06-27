import { useId, useMemo, useState } from 'react';

import { type FileValue, field, useFormBridge } from '@runilib/react-formbridge';

import { FieldVariantFrame } from './FieldVariantFrame';
import styles from './FormExamples.module.css';
import { simulateSubmitDelay } from './shared';

type FileVariantValues = {
  profileAsset: FileValue | null;
  launchAssets: FileValue[];
  importSheet: FileValue | null;
};

type ManualController = {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
};

function countFiles(value: FileValue | FileValue[] | null | undefined): number {
  if (!value) {
    return 0;
  }

  return Array.isArray(value) ? value.length : 1;
}

function describeFiles(value: FileValue | FileValue[] | null | undefined): string {
  if (!value) {
    return 'Nothing selected yet';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'Nothing selected yet';
    }

    if (value.length === 1) {
      return value[0]?.name ?? '1 file';
    }

    return `${value.length} files ready`;
  }

  return value.name;
}

function FileField({
  controller,
  FieldError,
  FieldLabel,
  multiple = false,
}: {
  controller: ManualController;
  FieldError: (props: { name: string }) => React.JSX.Element | null;
  FieldLabel: (props: { name: string; htmlFor: string }) => React.JSX.Element | null;
  multiple?: boolean;
}) {
  const id = useId();

  return (
    <div>
      <FieldLabel name={controller.name} htmlFor={id} />
      <input
        id={id}
        type="file"
        multiple={multiple}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          controller.onChange(multiple ? files : files[0] ?? null);
        }}
        onBlur={controller.onBlur}
        onFocus={controller.onFocus}
      />
      <FieldError name={controller.name} />
    </div>
  );
}

export function FileVariantsExample() {
  const [lastSubmission, setLastSubmission] = useState<FileVariantValues | null>(null);

  const schema = useMemo(
    () => ({
      profileAsset: field
        .file()
        .label('Profile asset')
        .accept(['image/*'])
        .required()
        .preview(88)
        .maxSize(4 * 1024 * 1024)
        .dragLabel('Drop a profile image or click to browse')
        .hint(
          'Single image upload with preview, custom drop-zone copy, and branded chrome.',
        ),
      launchAssets: field
        .file()
        .label('Launch assets')
        .accept(['image/*', 'application/pdf'])
        .multiple(4)
        .preview(72)
        .maxSize(10 * 1024 * 1024)
        .dragLabel('Collect screenshots, brochures, or supporting PDFs')
        .hint('Multiple files with custom add/remove copy and richer file metadata.'),
      importSheet: field
        .file()
        .label('Import sheet')
        .accept([
          'text/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])
        .maxSize(12 * 1024 * 1024)
        .noDragDrop()
        .dragLabel('Upload a CSV or XLSX')
        .hint('Button-first import flow with custom CTA content.'),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  });

  const { Form, FieldError, FieldLabel, fieldController, watchAll } = form;
  const values = watchAll() as Record<string, unknown>;
  const totalFiles =
    countFiles(values.profileAsset as FileValue | FileValue[] | null | undefined) +
    countFiles(values.launchAssets as FileValue | FileValue[] | null | undefined) +
    countFiles(values.importSheet as FileValue | FileValue[] | null | undefined);

  return (
    <FieldVariantFrame
      familyName="File"
      accent="#38bdf8"
      title="Uploads, previews, import flows, and custom file chrome"
      description="This set covers three common file flows: a branded image drop zone, a multi-asset uploader with custom list actions, and a button-only spreadsheet import. The goal is to show that the built-in file field stays useful even when the UI needs a lot of product-specific language."
      highlights={[
        'single image preview',
        'multiple attachments',
        'custom drop zone copy',
        'button-only import flow',
      ]}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>{totalFiles} files in play</p>
          <p className={styles.resolverPreviewMuted}>
            Avatar: {describeFiles(values.profileAsset as FileValue | FileValue[] | null | undefined)}. Assets:{' '}
            {describeFiles(values.launchAssets as FileValue | FileValue[] | null | undefined)}. Import:{' '}
            {describeFiles(values.importSheet as FileValue | FileValue[] | null | undefined)}.
          </p>
        </>
      }
      snapshot={lastSubmission ?? values}
      submittedLabel={
        lastSubmission
          ? `Saved ${totalFiles} uploaded file${totalFiles > 1 ? 's' : ''} in the recipe`
          : null
      }
      footer="Use the text callbacks when you only need product copy changes, then jump to renderDropZoneContent or renderBrowseButtonContent when the upload surface itself becomes part of the product experience."
    >
      <Form
        className={styles.resolverForm}
        onSubmit={async (submittedValues) => {
          await simulateSubmitDelay(350);
          setLastSubmission(submittedValues as FileVariantValues);
        }}
      >
        <FileField
          controller={fieldController('profileAsset') as ManualController}
          FieldError={FieldError as (props: { name: string }) => React.JSX.Element | null}
          FieldLabel={FieldLabel as (props: { name: string; htmlFor: string }) => React.JSX.Element | null}
        />

        <FileField
          controller={fieldController('launchAssets') as ManualController}
          FieldError={FieldError as (props: { name: string }) => React.JSX.Element | null}
          FieldLabel={FieldLabel as (props: { name: string; htmlFor: string }) => React.JSX.Element | null}
          multiple
        />

        <FileField
          controller={fieldController('importSheet') as ManualController}
          FieldError={FieldError as (props: { name: string }) => React.JSX.Element | null}
          FieldLabel={FieldLabel as (props: { name: string; htmlFor: string }) => React.JSX.Element | null}
        />

        <div className={styles.footerRow}>
          <p className={styles.helperText}>
            Try one field with the stock UI, one with copy callbacks, and one with full
            content overrides.
          </p>
          <button type="submit" className={styles.submitButton}>
            Save file recipe
          </button>
        </div>
      </Form>
    </FieldVariantFrame>
  );
}

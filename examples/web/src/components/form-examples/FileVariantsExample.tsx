import { useMemo, useState } from 'react';

import { type FileValue, field, useFormBridge } from '@runilib/react-formbridge';

import { FieldVariantFrame } from './FieldVariantFrame';
import styles from './FormExamples.module.css';
import { createDemoFormUi, simulateSubmitDelay } from './shared';

type FileVariantValues = {
  profileAsset: FileValue | null;
  launchAssets: FileValue[];
  importSheet: FileValue | null;
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
    globalConfigs: () => {
      const baseUi = createDemoFormUi(styles);

      return {
        ...baseUi,
        submit: {
          ...baseUi.submit,
          loadingText: 'Saving file recipe...',
        },
        field: {
          ...baseUi.field,
          styles: {
            ...baseUi.field?.styles,
            wrapper: {
              ...baseUi.field?.styles?.wrapper,
              gap: 8,
            },
            dropZone: {
              minHeight: 148,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              justifyContent: 'center',
              gap: 12,
              padding: '18px 18px 16px',
              borderRadius: 20,
              border: '1px dashed rgba(125, 211, 252, 0.22)',
              background:
                'linear-gradient(180deg, rgba(14, 165, 233, 0.10), rgba(8, 47, 73, 0.18))',
              color: '#10203a',
              textAlign: 'left',
              cursor: 'pointer',
            },
            browseButton: {
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              minHeight: 52,
              padding: '14px 18px',
              borderRadius: 16,
              border: '1px solid rgba(96, 165, 250, 0.22)',
              background: 'rgba(37, 99, 235, 0.10)',
              color: '#dbeafe',
              fontWeight: 700,
            },
            addMoreButton: {
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 46,
              padding: '12px 16px',
              borderRadius: 14,
              border: '1px solid rgba(148, 163, 184, 0.18)',
              background: '#ffffff',
              color: '#10203a',
              fontWeight: 700,
            },
            list: {
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            },
            listItem: {
              display: 'grid',
              gridTemplateColumns: '72px minmax(0, 1fr) auto',
              gap: 14,
              alignItems: 'center',
              padding: '12px 14px',
              borderRadius: 18,
              border: '1px solid rgba(148, 163, 184, 0.14)',
              background: '#ffffff',
            },
            previewImage: {
              width: 72,
              height: 72,
              objectFit: 'cover',
              borderRadius: 16,
              border: '1px solid rgba(148, 163, 184, 0.16)',
            },
            fileIcon: {
              width: 72,
              height: 72,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 16,
              border: '1px solid rgba(148, 163, 184, 0.14)',
              background: 'rgba(37, 99, 235, 0.06)',
              fontSize: 28,
            },
            fileName: {
              margin: 0,
              color: '#10203a',
              fontSize: 14,
              fontWeight: 700,
            },
            fileMeta: {
              margin: 0,
              color: '#64748b',
              fontSize: 12,
              lineHeight: 1.5,
            },
            removeButton: {
              border: '1px solid rgba(248, 113, 113, 0.18)',
              borderRadius: 12,
              background: 'rgba(127, 29, 29, 0.22)',
              color: '#fecaca',
              minHeight: 40,
              padding: '10px 12px',
              fontWeight: 700,
            },
          },
        },
      };
    },
  });

  const { Form, fields, watchAll } = form;
  const values = watchAll();
  const totalFiles =
    countFiles(values.profileAsset) +
    countFiles(values.launchAssets) +
    countFiles(values.importSheet);

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
            Avatar: {describeFiles(values.profileAsset)}. Assets:{' '}
            {describeFiles(values.launchAssets)}. Import:{' '}
            {describeFiles(values.importSheet)}.
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
        <fields.profileAsset
          {...{
            renderDropZoneIcon: () => '🧑',
            renderDropZoneContent: ({ accept, defaultIcon, dragging, maxSize }) => (
              <div style={{ display: 'grid', gap: 10 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.08)',
                    fontSize: 24,
                  }}
                >
                  {defaultIcon}
                </div>
                <div style={{ display: 'grid', gap: 4 }}>
                  <strong style={{ color: '#10203a', fontSize: 14 }}>
                    {dragging ? 'Release to update the avatar' : 'Upload a profile asset'}
                  </strong>
                  <span style={{ color: '#5f6f88', fontSize: 12.5, lineHeight: 1.5 }}>
                    {dragging
                      ? 'We keep the preview and file metadata in the same generated field.'
                      : 'Perfect for account settings, speaker headshots, or team directories.'}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    fontSize: 11.5,
                    color: '#bae6fd',
                  }}
                >
                  <span>Accepted: {accept.join(', ')}</span>
                  <span>
                    Max size:{' '}
                    {maxSize ? `${Math.round(maxSize / (1024 * 1024))} MB` : '—'}
                  </span>
                </div>
              </div>
            ),
          }}
        />

        <fields.launchAssets
          {...{
            dragActiveText: 'Release to attach the launch bundle',
            acceptedText: ({ formattedAccept }) => `Accepted assets: ${formattedAccept}`,
            maxSizeText: ({ formattedMaxSize }) => `Per-file limit: ${formattedMaxSize}`,
            browseButtonText: ({ fileCount }) =>
              fileCount > 0
                ? `📂 Add more launch assets (${fileCount})`
                : '📂 Browse launch assets',
            addMoreButtonText: ({ fileCount, maxFiles }) =>
              `Add another asset (${fileCount}/${maxFiles})`,
            removeButtonText: ({ index }) => `Remove #${index + 1}`,
            renderFileIcon: (file, ctx) => {
              if (file.type.includes('pdf')) {
                return '📘';
              }

              if (file.type.includes('image')) {
                return '🖼️';
              }

              return ctx.defaultIcon;
            },
            renderFileMeta: ({ file, formattedSize, defaultContent }) =>
              file.type.includes('pdf') ? (
                <p style={{ margin: 0, color: '#93c5fd', fontSize: 12, lineHeight: 1.5 }}>
                  PDF brief · {formattedSize}
                </p>
              ) : (
                defaultContent
              ),
          }}
        />

        <fields.importSheet
          {...{
            browseButtonText: 'Upload CSV or XLSX',
            renderBrowseButtonContent: ({ defaultContent }) => (
              <span
                style={{
                  display: 'grid',
                  justifyItems: 'start',
                  gap: 4,
                  textAlign: 'left',
                }}
              >
                <strong style={{ fontSize: 13.5 }}>{defaultContent}</strong>
                <small style={{ color: '#64748b', fontSize: 11.5 }}>
                  Keep the CTA compact while the parser remains fully typed.
                </small>
              </span>
            ),
            renderFileMeta: ({ formattedSize, file }) => (
              <p style={{ margin: 0, color: '#fcd34d', fontSize: 12, lineHeight: 1.5 }}>
                {file.type.includes('sheet') || file.type.includes('csv')
                  ? 'Spreadsheet payload'
                  : 'Imported file'}{' '}
                · {formattedSize}
              </p>
            ),
          }}
        />

        <div className={styles.footerRow}>
          <p className={styles.helperText}>
            Try one field with the stock UI, one with copy callbacks, and one with full
            content overrides.
          </p>
          <Form.Submit className={styles.submitButton}>Save file recipe</Form.Submit>
        </div>
      </Form>
    </FieldVariantFrame>
  );
}

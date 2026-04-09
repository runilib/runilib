import type React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { field } from '../../../core/field-builders/field';
import type { FileValue } from '../../../core/field-builders/file/types';
import { FileField } from '../FileField';

function renderFileField(
  builder: ReturnType<typeof field.file>,
  overrides?: Partial<React.ComponentProps<typeof FileField>>,
) {
  const descriptor = builder._build();

  return render(
    <FileField
      descriptor={descriptor}
      name="asset"
      value={descriptor._defaultValue}
      label={descriptor._label ?? ''}
      allValues={{}}
      error={null}
      touched={false}
      dirty={false}
      validating={false}
      disabled={false}
      required={Boolean(descriptor._required)}
      hint={descriptor._hint}
      onChange={() => {}}
      onBlur={() => {}}
      onFocus={() => {}}
      {...overrides}
    />,
  );
}

describe('WebFileField ui', () => {
  it('supports custom drop-zone copy without replacing the whole markup', () => {
    const { getByRole, getByText } = renderFileField(
      field.file().label('Asset').accept(['application/pdf']).maxSize(1024),
      {
        extra: {
          dropZoneText: 'Drop or browse your file',
          dragActiveText: 'Release to upload',
          acceptedText: ({ formattedAccept }) => `Allowed: ${formattedAccept}`,
          maxSizeText: ({ formattedMaxSize }) => `Limit: ${formattedMaxSize}`,
        },
      },
    );

    const dropZone = getByRole('button');

    getByText('Drop or browse your file');
    getByText('Allowed: application/pdf');
    getByText('Limit: 1.0 KB');

    fireEvent.dragOver(dropZone);

    getByText('Release to upload');
  });

  it('supports custom file actions and icon rendering', () => {
    const value: FileValue = {
      uri: 'blob:test',
      name: 'invoice.pdf',
      type: 'application/pdf',
      size: 2048,
    };

    const { getByRole, getByTestId, getByText } = renderFileField(
      field.file().label('Attachments').multiple(3).noDragDrop(),
      {
        value: [value],
        extra: {
          browseButtonText: ({ fileCount }) => `Pick files (${fileCount})`,
          addMoreButtonText: ({ fileCount, maxFiles }) =>
            `Add another (${fileCount}/${maxFiles})`,
          removeButtonText: ({ index }) => `Delete ${index + 1}`,
          renderFileIcon: (file, ctx) => (
            <span data-testid="custom-file-icon">
              {String(ctx.defaultIcon)} {file.name}
            </span>
          ),
        },
      },
    );

    getByRole('button', { name: 'Pick files (1)' });
    getByText('Add another (1/3)');
    getByText('Delete 1');
    getByRole('button', { name: 'Remove invoice.pdf' });

    expect(getByTestId('custom-file-icon').textContent).toContain('invoice.pdf');
  });
});

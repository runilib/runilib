import type React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { field } from '../../../core/field-descriptors/field';
import type { FileValue } from '../../../core/field-descriptors/file/types';
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

describe('WebFileField', () => {
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

  it('exposes all file sub-slots to runtime style overrides', () => {
    const value: FileValue = {
      uri: 'blob:test',
      name: 'invoice.pdf',
      type: 'application/pdf',
      size: 2048,
    };

    const { container } = renderFileField(
      field.file().label('Asset').accept(['application/pdf']).maxSize(1024),
      {
        value: [value],
        extra: {
          styles: {
            fileDropZoneAccept: { color: 'rgb(1, 2, 3)' },
            fileDropZoneMaxSize: { color: 'rgb(4, 5, 6)' },
            fileInfo: { display: 'grid' },
          },
        },
      },
    );

    const accept = container.querySelector('[data-fb-slot="drop-zone-accept"]');
    const maxSize = container.querySelector('[data-fb-slot="drop-zone-max-size"]');
    const fileInfo = container.querySelector('[data-fb-slot="file-info"]');

    expect(accept instanceof HTMLParagraphElement).toBe(true);
    expect(maxSize instanceof HTMLParagraphElement).toBe(true);
    expect(fileInfo instanceof HTMLDivElement).toBe(true);

    if (
      !(accept instanceof HTMLParagraphElement) ||
      !(maxSize instanceof HTMLParagraphElement) ||
      !(fileInfo instanceof HTMLDivElement)
    ) {
      throw new TypeError('Expected file field sub-slots to render.');
    }

    expect(accept.style.color).toBe('rgb(1, 2, 3)');
    expect(maxSize.style.color).toBe('rgb(4, 5, 6)');
    expect(fileInfo.style.display).toBe('grid');
  });
});

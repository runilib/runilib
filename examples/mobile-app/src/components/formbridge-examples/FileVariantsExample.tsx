import { useCallback, useMemo, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { type FileValue, field, useFormBridge } from '@runilib/react-formbridge';

import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { FieldVariantCard } from './FieldVariantCard';
import { formExampleStyles as s } from './FormExamples.styles';
import { createNativeFormUi, simulateSubmitDelay } from './shared';

type FileVariantValues = {
  avatar: FileValue | null;
  attachments: FileValue[];
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

    return `${value.length} selected asset${value.length > 1 ? 's' : ''}`;
  }

  return value.name;
}

function getFallbackFileName(
  uri: string,
  fallbackBase: string,
  extension: string,
): string {
  const lastSegment = uri.split('/').pop();

  if (lastSegment && lastSegment.trim().length > 0) {
    return lastSegment;
  }

  return `${fallbackBase}.${extension}`;
}

function toImageFileValue(
  asset: ImagePicker.ImagePickerAsset,
  options?: {
    fromCamera?: boolean;
  },
): FileValue {
  const mimeType =
    asset.mimeType ?? (asset.type === 'video' ? 'video/mp4' : 'image/jpeg');

  return {
    uri: asset.uri,
    name:
      asset.fileName ??
      getFallbackFileName(
        asset.uri,
        options?.fromCamera ? 'captured-media' : 'selected-media',
        mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg',
      ),
    type: mimeType,
    size: asset.fileSize ?? 0,
    width: asset.width || undefined,
    height: asset.height || undefined,
    base64: asset.base64 ?? undefined,
    fromCamera: options?.fromCamera,
  };
}

function toDocumentFileValue(asset: DocumentPicker.DocumentPickerAsset): FileValue {
  return {
    uri: asset.uri,
    name: asset.name,
    type: asset.mimeType ?? 'application/octet-stream',
    size: asset.size ?? 0,
  };
}

function openChoicePrompt<T extends string>({
  title,
  message,
  options,
}: {
  title: string;
  message: string;
  options: Array<{
    label: string;
    value: T;
  }>;
}): Promise<T | null> {
  return new Promise((resolve) => {
    let settled = false;

    const finish = (value: T | null) => {
      if (settled) {
        return;
      }

      settled = true;
      resolve(value);
    };

    Alert.alert(
      title,
      message,
      [
        ...options.map((option) => ({
          text: option.label,
          onPress: () => finish(option.value),
        })),
        {
          text: 'Cancel',
          style: 'cancel' as const,
          onPress: () => finish(null),
        },
      ],
      {
        cancelable: true,
        onDismiss: () => finish(null),
      },
    );
  });
}

async function ensureMediaLibraryPermission(): Promise<boolean> {
  const current = await ImagePicker.getMediaLibraryPermissionsAsync();

  if (current.granted || current.accessPrivileges === 'limited') {
    return true;
  }

  const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return requested.granted || requested.accessPrivileges === 'limited';
}

async function ensureCameraPermission(): Promise<boolean> {
  const current = await ImagePicker.getCameraPermissionsAsync();

  if (current.granted) {
    return true;
  }

  const requested = await ImagePicker.requestCameraPermissionsAsync();
  return requested.granted;
}

export function FileVariantsExample() {
  const [lastSubmission, setLastSubmission] = useState<FileVariantValues | null>(null);

  const schema = useMemo(
    () => ({
      avatar: field
        .file()
        .label('Speaker portrait')
        .accept(['image/*'])
        .required()
        .preview(84)
        .maxSize(4 * 1024 * 1024)
        .dragLabel('Choose or capture a profile image')
        .hint('Uses the real photo library or camera on your phone.'),
      attachments: field
        .file()
        .label('Launch packet')
        .accept(['image/*', 'application/pdf'])
        .multiple(4)
        .preview(72)
        .required()
        .maxSize(10 * 1024 * 1024)
        .dragLabel('Add brochure assets')
        .hint('Uses the real photo or file picker and keeps all the custom UI hooks.'),
      importSheet: field
        .file()
        .label('Catalog import')
        .accept([
          'text/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])
        .required()
        .maxSize(12 * 1024 * 1024)
        .dragLabel('Upload a pricing sheet')
        .hint('Uses the document picker for CSV and spreadsheet imports.'),
    }),
    [],
  );

  const pickAvatar = useCallback(async () => {
    const source = await openChoicePrompt({
      title: 'Add a portrait',
      message: 'Choose a real source on your device.',
      options: [
        {
          label: 'Photo library',
          value: 'library',
        },
        {
          label: 'Camera',
          value: 'camera',
        },
      ],
    });

    if (!source) {
      return null;
    }

    if (source === 'library') {
      const hasAccess = await ensureMediaLibraryPermission();

      if (!hasAccess) {
        Alert.alert(
          'Photo access required',
          'Allow access to your photo library to choose a portrait.',
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled || !result.assets?.length) {
        return null;
      }

      return toImageFileValue(result.assets[0]);
    }

    const hasAccess = await ensureCameraPermission();

    if (!hasAccess) {
      Alert.alert('Camera access required', 'Allow camera access to capture a portrait.');
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled || !result.assets?.length) {
      return null;
    }

    return toImageFileValue(result.assets[0], { fromCamera: true });
  }, []);

  const pickAttachments = useCallback(async () => {
    const source = await openChoicePrompt({
      title: 'Add attachments',
      message: 'Choose where to pick your real assets.',
      options: [
        {
          label: 'Photos',
          value: 'library',
        },
        {
          label: 'Files',
          value: 'documents',
        },
      ],
    });

    if (!source) {
      return null;
    }

    if (source === 'library') {
      const hasAccess = await ensureMediaLibraryPermission();

      if (!hasAccess) {
        Alert.alert(
          'Photo access required',
          'Allow access to your photo library to add image attachments.',
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: 4,
        orderedSelection: true,
        quality: 1,
      });

      if (result.canceled || !result.assets?.length) {
        return null;
      }

      return result.assets.map((asset) => toImageFileValue(asset));
    }

    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'],
      multiple: true,
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.length) {
      return null;
    }

    return result.assets.map((asset) => toDocumentFileValue(asset));
  }, []);

  const pickImportSheet = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      multiple: false,
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.length) {
      return null;
    }

    return toDocumentFileValue(result.assets[0]);
  }, []);

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalDefaults: () => {
      const baseUi = createNativeFormUi();

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
              gap: 8,
            },
            filePickButton: {
              minHeight: 54,
              borderWidth: 1.5,
              borderColor: 'rgba(96, 165, 250, 0.22)',
              borderRadius: 18,
              paddingHorizontal: 16,
              paddingVertical: 14,
              backgroundColor: '#ffffff',
              alignItems: 'center',
              justifyContent: 'center',
            },
            filePickButtonText: {
              color: '#10203a',
              fontSize: 14,
              fontWeight: '700',
            },
            fileList: {
              gap: 10,
            },
            fileItem: {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: 'rgba(148, 163, 184, 0.14)',
              backgroundColor: '#ffffff',
            },
            fileIcon: {
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: 'rgba(37, 99, 235, 0.06)',
              alignItems: 'center',
              justifyContent: 'center',
            },
            fileIconText: {
              fontSize: 22,
            },
            fileName: {
              flex: 1,
              color: '#10203a',
              fontSize: 14,
              fontWeight: '700',
            },
            fileMeta: {
              color: '#64748b',
              fontSize: 12,
              lineHeight: 18,
            },
            fileRemoveButton: {
              minWidth: 44,
              minHeight: 40,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(248, 113, 113, 0.20)',
              backgroundColor: 'rgba(127, 29, 29, 0.24)',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 10,
            },
            fileRemoveText: {
              color: '#fecaca',
              fontSize: 12,
              fontWeight: '700',
            },
          },
        },
      };
    },
  });

  const { Form, fields, watchAll } = form;
  const values = watchAll();
  const totalFiles =
    countFiles(values.avatar) +
    countFiles(values.attachments) +
    countFiles(values.importSheet);

  return (
    <FieldVariantCard
      familyName="File"
      accent="#38bdf8"
      title="Real phone pickers, previews, and custom file copy on native"
      description="This example opens the actual photo library, camera, and document picker on your device, so we can exercise previews, multiple attachments, custom CTA content, and list actions in a real mobile flow."
      highlights={[
        'real native pickers',
        'image preview',
        'multiple attachments',
        'custom CTA content',
      ]}
      preview={
        <>
          <Text style={s.previewValue}>{totalFiles} files staged</Text>
          <Text style={s.previewText}>
            Portrait: {describeFiles(values.avatar)}. Packet:{' '}
            {describeFiles(values.attachments)}. Import:{' '}
            {describeFiles(values.importSheet)}.
          </Text>
        </>
      }
      snapshot={lastSubmission ?? values}
      submittedLabel={
        lastSubmission
          ? `Saved ${totalFiles} selected file${totalFiles > 1 ? 's' : ''} in the recipe`
          : null
      }
      footer="The form contract stays the same whether you plug in Expo pickers or your own native bridge."
    >
      <Form
        onSubmit={async (submittedValues) => {
          await simulateSubmitDelay(320);
          setLastSubmission(submittedValues as FileVariantValues);
        }}
      >
        <fields.avatar
          {...{
            pickFiles: pickAvatar,
            pickButtonText: ({ loading }) =>
              loading ? 'Preparing portrait...' : 'Pick or capture portrait',
            renderFileIcon: (_file, ctx) =>
              ctx.file.type.includes('image') ? '🧑' : ctx.defaultIcon,
            renderFileMeta: ({ file, formattedSize }) => (
              <Text style={{ color: '#93c5fd', fontSize: 12, lineHeight: 18 }}>
                Portrait asset · {formattedSize} · {file.width}×{file.height}
              </Text>
            ),
          }}
        />

        <fields.attachments
          {...{
            pickFiles: pickAttachments,
            pickButtonText: ({ fileCount }) =>
              fileCount > 0
                ? `Add more packet assets (${fileCount})`
                : 'Add launch packet assets',
            removeButtonText: ({ index }) => `Del ${index + 1}`,
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
                <Text style={{ color: '#fcd34d', fontSize: 12, lineHeight: 18 }}>
                  PDF brief · {formattedSize}
                </Text>
              ) : (
                defaultContent
              ),
          }}
        />

        <fields.importSheet
          {...{
            pickFiles: pickImportSheet,
            renderPickButtonContent: ({ defaultContent }) => (
              <View style={{ alignItems: 'center', gap: 4 }}>
                <Text style={{ color: '#10203a', fontSize: 14, fontWeight: '700' }}>
                  {defaultContent}
                </Text>
                <Text style={{ color: '#64748b', fontSize: 12 }}>
                  Great for CSV imports or spreadsheet handoffs.
                </Text>
              </View>
            ),
            pickButtonText: 'Upload CSV or XLSX',
            renderFileMeta: ({ file, formattedSize }) => (
              <Text style={{ color: '#93c5fd', fontSize: 12, lineHeight: 18 }}>
                {file.name.endsWith('.csv') ? 'CSV payload' : 'Spreadsheet payload'} ·{' '}
                {formattedSize}
              </Text>
            ),
          }}
        />

        <Form.Submit>Save file recipe</Form.Submit>
      </Form>
    </FieldVariantCard>
  );
}

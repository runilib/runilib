import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import type { FileValue } from '../../core/field-builders/file/types';
import {
  formatBytes,
  isImageLike,
  type NativeBaseUiOverrides,
  type NativeExtraProps,
  sx,
} from './shared';

type NativeFileDescriptor = {
  _label: string;
  _required: boolean;
  _hint?: string;
  _disabled: boolean;
  _fileAccept: string[];
  _fileMaxSize: number | null;
  _fileMultiple: boolean;
  _fileMaxFiles: number;
  _filePreview: boolean;
  _filePreviewHeight: number;
  _fileBase64: boolean;
  _fileDragDropLabel: string;
};

type FilePickerAdapter = (ctx: {
  descriptor: NativeFileDescriptor;
  multiple: boolean;
}) => Promise<FileValue[] | FileValue | null>;

type NativeFileUiOverrides = NativeBaseUiOverrides & {
  styles?: NativeBaseUiOverrides['styles'] &
    Partial<{
      pickButton: StyleProp<ViewStyle>;
      pickButtonText: StyleProp<TextStyle>;
      fileList: StyleProp<ViewStyle>;
      fileItem: StyleProp<ViewStyle>;
      fileIcon: StyleProp<ViewStyle>;
      fileIconText: StyleProp<TextStyle>;
      fileName: StyleProp<TextStyle>;
      fileMeta: StyleProp<TextStyle>;
      removeButton: StyleProp<ViewStyle>;
      removeText: StyleProp<TextStyle>;
    }>;
  pickFiles?: FilePickerAdapter;
};

interface Props {
  descriptor: NativeFileDescriptor;
  value: FileValue | FileValue[] | null;
  error: string | null;
  onChange: (value: FileValue | FileValue[] | null) => void;
  onBlur: () => void;
  extra?: NativeExtraProps<NativeFileUiOverrides>;
}

export const NativeFileField: React.FC<Props> = ({
  descriptor: d,
  value,
  error,
  onChange,
  onBlur,
  extra,
}) => {
  const [loading, setLoading] = useState(false);
  const ui = extra?.appearance;
  const { rootProps, labelProps, hintProps, errorProps } = ui ?? {};
  const { style: rootPropsStyle, ...rootPropsRest } = (rootProps ?? {}) as {
    style?: StyleProp<ViewStyle>;
  } & Record<string, unknown>;
  const { style: labelPropsStyle, ...labelPropsRest } = (labelProps ?? {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;
  const { style: hintPropsStyle, ...hintPropsRest } = (hintProps ?? {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;
  const { style: errorPropsStyle, ...errorPropsRest } = (errorProps ?? {}) as {
    style?: StyleProp<TextStyle>;
  } & Record<string, unknown>;

  const currentFiles = useMemo<FileValue[]>(
    () => (value ? (Array.isArray(value) ? value : [value]) : []),
    [value],
  );

  const pickFiles = ui?.pickFiles;

  const handlePick = async () => {
    if (d._disabled || !pickFiles) return;

    setLoading(true);

    try {
      const picked = await pickFiles({
        descriptor: d,
        multiple: d._fileMultiple,
      });

      if (!picked) return;

      const nextFiles = Array.isArray(picked) ? picked : [picked];

      if (d._fileMultiple) {
        onChange([...currentFiles, ...nextFiles].slice(0, d._fileMaxFiles));
      } else {
        onChange(nextFiles[0] ?? null);
      }
    } finally {
      setLoading(false);
      onBlur();
    }
  };

  const removeFile = (index: number) => {
    if (d._fileMultiple) {
      const next = currentFiles.filter((_, i) => i !== index);
      onChange(next.length ? next : null);
      return;
    }

    onChange(null);
  };

  return (
    <View
      style={sx(
        styles.root,
        extra?.style as StyleProp<ViewStyle>,
        ui?.styles?.root,
        rootPropsStyle,
      )}
      {...rootPropsRest}
    >
      <Text
        style={sx(styles.label, ui?.styles?.label, labelPropsStyle)}
        {...labelPropsRest}
      >
        {d._label}
        {d._required && <Text style={styles.required}>*</Text>}
      </Text>

      <Pressable
        onPress={handlePick}
        style={sx(
          styles.pickButton,
          d._disabled && styles.pickButtonDisabled,
          ui?.styles?.pickButton,
        )}
      >
        <Text style={sx(styles.pickButtonText, ui?.styles?.pickButtonText)}>
          {loading ? 'Processing…' : d._fileDragDropLabel || 'Choose file'}
        </Text>
      </Pressable>

      {currentFiles.length > 0 && (
        <ScrollView contentContainerStyle={sx(styles.fileList, ui?.styles?.fileList)}>
          {currentFiles.map((file, index) => (
            <View
              key={`${file.uri}-${index.toString()}`}
              style={sx(styles.fileItem, ui?.styles?.fileItem)}
            >
              {d._filePreview && isImageLike(file.type || file.uri) ? (
                <Image
                  source={{ uri: file.uri }}
                  style={{
                    width: d._filePreviewHeight,
                    height: d._filePreviewHeight,
                    borderRadius: 8,
                  }}
                />
              ) : (
                <View style={sx(styles.fileIcon, ui?.styles?.fileIcon)}>
                  <Text style={sx(styles.fileIconText, ui?.styles?.fileIconText)}>
                    📎
                  </Text>
                </View>
              )}

              <View style={styles.fileContent}>
                <Text
                  numberOfLines={1}
                  style={sx(styles.fileName, ui?.styles?.fileName)}
                >
                  {file.name}
                </Text>
                <Text style={sx(styles.fileMeta, ui?.styles?.fileMeta)}>
                  {formatBytes(file.size)}
                  {file.width && file.height ? ` · ${file.width}×${file.height}` : ''}
                </Text>
              </View>

              <Pressable
                onPress={() => removeFile(index)}
                style={sx(styles.removeButton, ui?.styles?.removeButton)}
              >
                <Text style={sx(styles.removeText, ui?.styles?.removeText)}>✕</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      {error ? (
        <Text
          style={sx(styles.error, ui?.styles?.error, errorPropsStyle)}
          {...errorPropsRest}
        >
          {error}
        </Text>
      ) : null}
      {!error && d._hint ? (
        <Text
          style={sx(styles.hint, ui?.styles?.hint, hintPropsStyle)}
          {...hintPropsRest}
        >
          {d._hint}
        </Text>
      ) : null}
      {!pickFiles ? (
        <Text
          style={sx(styles.hint, ui?.styles?.hint, hintPropsStyle)}
          {...hintPropsRest}
        >
          No native picker adapter provided.
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    gap: 6,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  required: {
    color: '#ef4444',
  },
  pickButton: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  pickButtonDisabled: {
    opacity: 0.6,
  },
  pickButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  fileList: {
    gap: 10,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  fileIcon: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileIconText: {
    fontSize: 20,
  },
  fileContent: {
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  fileMeta: {
    fontSize: 11.5,
    color: '#9ca3af',
    marginTop: 2,
  },
  removeButton: {
    padding: 6,
  },
  removeText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    color: '#ef4444',
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

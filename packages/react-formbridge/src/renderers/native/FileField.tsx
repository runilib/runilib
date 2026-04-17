import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import type { FileValue } from '../../core/field-builders/file/types';
import type { ExtraFieldProps, NativeFileFieldPropsOverrides } from '../../types';
import {
  defaultErrorChromeStyle,
  defaultErrorTextStyle,
  defaultRequiredMarkStyle,
  formatBytes,
  isImageLike,
  resolveNativeInputBehavior,
  shouldHighlightOnError,
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

interface Props {
  descriptor: NativeFileDescriptor;
  value: FileValue | FileValue[] | null;
  error: string | null;
  label: string;
  hint?: string;
  name: string;
  onChange: (value: FileValue | FileValue[] | null) => void;
  onBlur: () => void;
  extra?: ExtraFieldProps<NativeFileFieldPropsOverrides, 'native'>;
}

function getDefaultFileIcon(file: FileValue): React.ReactNode {
  if (file.type.includes('pdf')) return '📄';
  if (file.type.includes('image')) return '🖼';
  if (file.type.includes('video')) return '🎬';
  if (file.type.includes('sheet') || file.type.includes('csv')) return '📊';
  return '📎';
}

function resolveText<TContext>(
  override: string | ((ctx: TContext) => string) | undefined,
  fallback: string,
  context: TContext,
): string {
  if (typeof override === 'function') {
    return override(context);
  }

  return override ?? fallback;
}

export const NativeFileField: React.FC<Props> = ({
  descriptor,
  value,
  error,
  label,
  hint,
  name,
  onChange,
  onBlur,
  extra,
}) => {
  const [loading, setLoading] = useState(false);
  const inputBehavior = resolveNativeInputBehavior(extra);
  const isReadOnly = Boolean(inputBehavior.readOnly);

  const {
    styles,
    hideLabel,
    wrapperProps,
    labelProps,
    hintProps,
    errorProps,
    renderLabel,
    renderHint,
    renderError,
    renderRequiredMark,
    pickFiles,
    loadingText,
    pickButtonText,
    removeButtonText,
    missingPickerNoticeText,
    renderFileIcon,
    renderPickButtonContent,
    renderRemoveButtonContent,
    renderFileMeta,
    renderMissingPickerNotice,
  } = extra ?? {};

  const { style: wrapperPropsStyle, ...wrapperPropsRest } = (wrapperProps ?? {}) as {
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

  const id = extra?.id ?? name;
  const hasError = Boolean(error);
  const highlightOnError = shouldHighlightOnError(extra?.highlightOnError);
  const controlErrorStyle = defaultErrorChromeStyle(hasError, highlightOnError);

  const currentFiles = useMemo<FileValue[]>(
    () => (value ? (Array.isArray(value) ? value : [value]) : []),
    [value],
  );
  const renderContext = {
    accept: descriptor._fileAccept,
    disabled: descriptor._disabled,
    fileCount: currentFiles.length,
    loading,
    maxFiles: descriptor._fileMaxFiles,
    maxSize: descriptor._fileMaxSize,
    multiple: descriptor._fileMultiple,
    preview: descriptor._filePreview,
    previewHeight: descriptor._filePreviewHeight,
  };
  const resolvedLoadingText = resolveText(loadingText, 'Processing...', renderContext);
  const resolvedPickButtonText = resolveText(
    pickButtonText,
    descriptor._fileDragDropLabel || 'Choose file',
    renderContext,
  );
  const resolvedMissingPickerNotice = resolveText(
    missingPickerNoticeText,
    'No native picker adapter provided.',
    renderContext,
  );
  const defaultPickButtonContent = (
    <Text style={sx(styles?.filePickButtonText)}>
      {loading ? resolvedLoadingText : resolvedPickButtonText}
    </Text>
  );
  const defaultMissingPickerNotice = (
    <Text
      style={sx(styles?.hint, hintPropsStyle)}
      {...hintPropsRest}
    >
      {resolvedMissingPickerNotice}
    </Text>
  );

  const handlePick = async () => {
    if (descriptor._disabled || isReadOnly || !pickFiles) return;

    setLoading(true);

    try {
      const picked = await pickFiles({
        descriptor: descriptor,
        multiple: descriptor._fileMultiple,
      });

      if (!picked) return;

      const nextFiles = Array.isArray(picked) ? picked : [picked];

      if (descriptor._fileMultiple) {
        onChange([...currentFiles, ...nextFiles].slice(0, descriptor._fileMaxFiles));
      } else {
        onChange(nextFiles[0] ?? null);
      }
    } finally {
      setLoading(false);
      onBlur();
    }
  };

  const removeFile = (index: number) => {
    if (descriptor._fileMultiple) {
      const next = currentFiles.filter((_, i) => i !== index);
      onChange(next.length ? next : null);
      return;
    }

    onChange(null);
  };

  const requiredMark = renderRequiredMark?.() ?? (
    <Text style={sx(defaultRequiredMarkStyle(), styles?.requiredMark)}>*</Text>
  );

  return (
    <View
      style={sx(extra?.style as StyleProp<ViewStyle>, styles?.wrapper, wrapperPropsStyle)}
      {...wrapperPropsRest}
    >
      {!hideLabel &&
        (renderLabel?.({
          id,
          label,
          required: Boolean(descriptor._required),
          name,
        }) ?? (
          <Text
            style={sx(styles?.label, labelPropsStyle)}
            {...labelPropsRest}
          >
            {label}
            {descriptor._required && requiredMark}
          </Text>
        ))}

      <Pressable
        onPress={handlePick}
        disabled={descriptor._disabled || isReadOnly}
        testID={inputBehavior.testID}
        style={sx(styles?.filePickButton, controlErrorStyle)}
      >
        {renderPickButtonContent?.({
          ...renderContext,
          defaultContent: defaultPickButtonContent,
        }) ?? defaultPickButtonContent}
      </Pressable>

      {currentFiles.length > 0 && (
        <ScrollView contentContainerStyle={sx(styles?.fileList)}>
          {currentFiles.map((file, index) => {
            const rawDefaultIcon = getDefaultFileIcon(file);
            const dimensionsLabel =
              file.width && file.height ? `${file.width}×${file.height}` : undefined;
            const itemRenderContext = {
              ...renderContext,
              defaultIcon: rawDefaultIcon,
              dimensionsLabel,
              file,
              formattedSize: formatBytes(file.size),
              index,
            };
            const resolvedFileIcon =
              renderFileIcon?.(file, itemRenderContext) ?? rawDefaultIcon;
            const defaultFileMetaContent = (
              <Text style={sx(styles?.fileMeta)}>
                {formatBytes(file.size)}
                {dimensionsLabel ? ` · ${dimensionsLabel}` : ''}
              </Text>
            );
            const defaultRemoveButtonContent = (
              <Text style={sx(styles?.fileRemoveText)}>
                {resolveText(removeButtonText, '✕', itemRenderContext)}
              </Text>
            );

            return (
              <View
                key={`${file.uri}-${index.toString()}`}
                style={sx(styles?.fileItem)}
              >
                {descriptor._filePreview && isImageLike(file.type || file.uri) ? (
                  <Image
                    source={{ uri: file.uri }}
                    style={{
                      width: descriptor._filePreviewHeight,
                      height: descriptor._filePreviewHeight,
                    }}
                  />
                ) : (
                  <View style={sx(styles?.fileIcon)}>
                    <Text style={sx(styles?.fileIconText)}>{resolvedFileIcon}</Text>
                  </View>
                )}

                <View style={sx(styles?.fileName)}>
                  <Text
                    numberOfLines={1}
                    style={sx(styles?.fileName)}
                  >
                    {file.name}
                  </Text>
                  {renderFileMeta?.({
                    ...itemRenderContext,
                    defaultContent: defaultFileMetaContent,
                  }) ?? defaultFileMetaContent}
                </View>

                <Pressable
                  onPress={() => removeFile(index)}
                  style={sx(styles?.fileRemoveButton)}
                >
                  {renderRemoveButtonContent?.({
                    ...itemRenderContext,
                    defaultContent: defaultRemoveButtonContent,
                  }) ?? defaultRemoveButtonContent}
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      )}

      {error
        ? (renderError?.({ id, name, error }) ?? (
            <Text
              style={sx(defaultErrorTextStyle(true), styles?.error, errorPropsStyle)}
              {...errorPropsRest}
            >
              {error}
            </Text>
          ))
        : hint
          ? (renderHint?.({ id, name, hint }) ?? (
              <Text
                style={sx(styles?.hint, hintPropsStyle)}
                {...hintPropsRest}
              >
                {hint}
              </Text>
            ))
          : null}

      {!pickFiles
        ? (renderMissingPickerNotice?.({
            ...renderContext,
            defaultContent: defaultMissingPickerNotice,
          }) ?? defaultMissingPickerNotice)
        : null}
    </View>
  );
};

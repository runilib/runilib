import React, {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { BuiltFileDescriptor } from '../../core/field-builders/file/FileField';
import type { FileValue } from '../../core/field-builders/file/types';
import type { FieldRenderProps, WebFileFieldUiOverrides } from '../../types';
import type { ExtraFieldProps } from '../../types.web';
import { cx, mergeStyles, renderHelperSlot, renderLabelSlot } from './helpers';
import {
  defaultErrorChromeStyle,
  type ResolvedWebFieldUi,
  shouldHighlightOnError,
} from './shared';

interface Props extends FieldRenderProps<FileValue | FileValue[] | null> {
  descriptor: BuiltFileDescriptor & {
    _ui?: ResolvedWebFieldUi;
  };
  extra?: ExtraFieldProps<WebFileFieldUiOverrides>;
}

async function fileToValue(file: File, withBase64: boolean): Promise<FileValue> {
  const uri = URL.createObjectURL(file);

  const result: FileValue = {
    uri,
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
  };

  if (withBase64) {
    result.base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const value = typeof reader.result === 'string' ? reader.result : '';
        resolve(value.includes(',') ? value.split(',')[1] : value);
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  if (file.type.startsWith('image/')) {
    await new Promise<void>((resolve) => {
      const image = new Image();

      image.onload = () => {
        result.width = image.naturalWidth;
        result.height = image.naturalHeight;
        resolve();
      };

      image.onerror = () => resolve();
      image.src = uri;
    });
  }

  return result;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getDefaultFileIcon(file: FileValue): ReactNode {
  if (file.type.includes('pdf')) return '📄';
  if (file.type.includes('image')) return '🖼';
  if (file.type.includes('video')) return '🎬';
  if (file.type.includes('sheet') || file.type.includes('csv')) return '📊';
  return '📎';
}

function getDefaultDropZoneIcon(accept: string[]): ReactNode {
  if (accept.some((type) => type.includes('image'))) return '🖼';
  if (accept.some((type) => type.includes('pdf'))) return '📄';
  return '📁';
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

export const FileField = ({ descriptor: d, extra, ...props }: Props) => {
  const reactId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const createdUrisRef = useRef<Set<string>>(new Set());

  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const web = d._ui ?? {};
  const {
    classNames,
    styles,
    hideLabel,
    rootProps,
    labelProps,
    hintProps,
    errorProps,
    renderLabel,
    renderHint,
    renderError,
    renderRequiredMark,
    loadingText,
    dropZoneText,
    dragActiveText,
    acceptedText,
    maxSizeText,
    browseButtonText,
    addMoreButtonText,
    removeButtonText,
    renderFileIcon,
    renderDropZoneIcon,
    renderDropZoneContent,
    renderBrowseButtonContent,
    renderAddMoreButtonContent,
    renderRemoveButtonContent,
    renderFileMeta,
  } = extra ?? {};

  const {
    className: rootPropsClassName,
    style: rootPropsStyle,
    ...rootPropsRest
  } = rootProps ?? {};

  const id = extra?.id ?? web.id ?? `${props.name}-${reactId}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = props.error ? errorId : props.hint ? hintId : undefined;
  const hasError = Boolean(props.error);
  const highlightOnError = shouldHighlightOnError(
    extra?.highlightOnError,
    web.highlightOnError,
  );
  const controlErrorStyle = defaultErrorChromeStyle(hasError, highlightOnError);

  const currentFiles: FileValue[] = useMemo(() => {
    if (!props.value) return [];
    return Array.isArray(props.value) ? props.value : [props.value];
  }, [props.value]);

  useEffect(() => {
    return () => {
      for (const uri of createdUrisRef.current) {
        URL.revokeObjectURL(uri);
      }
      createdUrisRef.current.clear();
    };
  }, []);

  const revokeIfOwned = useCallback((uri: string) => {
    if (!createdUrisRef.current.has(uri)) return;
    URL.revokeObjectURL(uri);
    createdUrisRef.current.delete(uri);
  }, []);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const array = Array.from(files);
      if (!array.length) return;
      if (!d._fileMultiple && array.length > 1) return;

      setLoading(true);

      try {
        const values = await Promise.all(
          array.map(async (file) => {
            const value = await fileToValue(file, d._fileBase64);
            createdUrisRef.current.add(value.uri);
            return value;
          }),
        );

        if (d._fileMultiple) {
          const merged = [...currentFiles, ...values].slice(0, d._fileMaxFiles);
          props.onChange(merged);
        } else {
          props.onChange(values[0] ?? null);
        }
      } finally {
        setLoading(false);
        props.onBlur();
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    },
    [
      currentFiles,
      d._fileBase64,
      d._fileMaxFiles,
      d._fileMultiple,
      props.onChange,
      props.onBlur,
    ],
  );

  const handleInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return;
      await processFiles(e.target.files);
    },
    [processFiles],
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setDragging(false);

      if (d._disabled) return;
      if (!e.dataTransfer.files.length) return;

      await processFiles(e.dataTransfer.files);
    },
    [d._disabled, processFiles],
  );

  const removeFile = useCallback(
    (index: number) => {
      const file = currentFiles[index];
      if (!file) return;

      revokeIfOwned(file.uri);

      if (d._fileMultiple) {
        const next = currentFiles.filter((_, i) => i !== index);
        props.onChange(next.length ? next : null);
      } else {
        props.onChange(null);
      }

      props.onBlur();
    },
    [currentFiles, d._fileMultiple, props.onBlur, props.onChange, revokeIfOwned],
  );

  const accept = d._fileAccept.join(',');

  const rootClassName = cx(
    extra?.className,
    classNames?.root,
    rootPropsClassName as string,
  );
  const renderContext = {
    accept: d._fileAccept,
    disabled: d._disabled,
    dragging,
    fileCount: currentFiles.length,
    loading,
    maxFiles: d._fileMaxFiles,
    maxSize: d._fileMaxSize,
    multiple: d._fileMultiple,
    preview: d._filePreview,
    previewHeight: d._filePreviewHeight,
  };
  const defaultDropZoneIcon = getDefaultDropZoneIcon(d._fileAccept);
  const resolvedDropZoneIcon = renderDropZoneIcon?.(renderContext) ?? defaultDropZoneIcon;
  const formattedAccept = d._fileAccept.join(', ');
  const formattedMaxSize = d._fileMaxSize ? formatBytes(d._fileMaxSize) : '';
  const resolvedLoadingText = resolveText(loadingText, 'Processing...', renderContext);
  const resolvedDropZoneText = resolveText(
    dropZoneText,
    d._fileDragDropLabel,
    renderContext,
  );
  const resolvedBrowseButtonText = resolveText(
    browseButtonText,
    '📂 Browse files',
    renderContext,
  );
  const resolvedDragActiveText = resolveText(
    dragActiveText,
    'Drop it here!',
    renderContext,
  );
  const resolvedAcceptedText =
    d._fileAccept.length > 0
      ? resolveText(acceptedText, `Accepted: ${formattedAccept}`, {
          ...renderContext,
          formattedAccept,
        })
      : null;
  const resolvedMaxSizeText = d._fileMaxSize
    ? resolveText(maxSizeText, `Max size: ${formattedMaxSize}`, {
        ...renderContext,
        formattedMaxSize,
      })
    : null;
  const defaultDropZoneContent = loading ? (
    <div data-fb-slot="drop-zone-text">⟳ {resolvedLoadingText}</div>
  ) : (
    <>
      <div
        data-fb-slot="drop-zone-icon"
        className={classNames?.dropZoneIcon}
        style={mergeStyles(styles?.dropZoneIcon)}
      >
        {resolvedDropZoneIcon}
      </div>

      <p
        data-fb-slot="drop-zone-text"
        className={classNames?.dropZoneText}
        style={mergeStyles(styles?.dropZoneText)}
      >
        {dragging ? resolvedDragActiveText : resolvedDropZoneText}
      </p>

      {resolvedAcceptedText ? (
        <p data-fb-slot="drop-zone-accept">{resolvedAcceptedText}</p>
      ) : null}

      {resolvedMaxSizeText ? (
        <p data-fb-slot="drop-zone-max-size">{resolvedMaxSizeText}</p>
      ) : null}
    </>
  );
  const defaultBrowseButtonContent = (
    <>{loading ? `⟳ ${resolvedLoadingText}` : resolvedBrowseButtonText}</>
  );
  const defaultAddMoreButtonContent = (
    <>
      {resolveText(
        addMoreButtonText,
        `+ Add more (${currentFiles.length}/${d._fileMaxFiles})`,
        renderContext,
      )}
    </>
  );

  return (
    <div
      data-fb-field="file"
      data-fb-name={props.name}
      {...(hasError ? { 'data-fb-error': '' } : {})}
      {...(d._disabled ? { 'data-fb-disabled': '' } : {})}
      className={rootClassName}
      style={mergeStyles(extra?.style, styles?.root, rootPropsStyle as CSSProperties)}
      {...rootPropsRest}
    >
      {renderLabelSlot({
        id,
        label: props.label,
        name: props.name,
        required: Boolean(d._required),
        hideLabel,
        classNames,
        styles,
        labelProps: labelProps as Record<string, unknown>,
        renderLabel,
        renderRequiredMark,
      })}

      {d._fileDragDrop ? (
        <button
          type="button"
          aria-disabled={d._disabled || undefined}
          aria-describedby={describedBy}
          data-fb-slot="drop-zone"
          {...(dragging ? { 'data-fb-dragging': '' } : {})}
          {...(loading ? { 'data-fb-loading': '' } : {})}
          className={classNames?.dropZone}
          style={mergeStyles(controlErrorStyle, styles?.dropZone)}
          onClick={() => !d._disabled && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (d._disabled) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (!d._disabled) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          {renderDropZoneContent?.({
            ...renderContext,
            defaultContent: defaultDropZoneContent,
            defaultIcon: defaultDropZoneIcon,
          }) ?? defaultDropZoneContent}
        </button>
      ) : (
        <button
          type="button"
          data-fb-slot="browse-button"
          className={classNames?.browseButton}
          style={mergeStyles(controlErrorStyle, styles?.browseButton)}
          onClick={() => !d._disabled && inputRef.current?.click()}
          disabled={d._disabled}
        >
          {renderBrowseButtonContent?.({
            ...renderContext,
            defaultContent: defaultBrowseButtonContent,
          }) ?? defaultBrowseButtonContent}
        </button>
      )}

      <input
        ref={inputRef}
        id={id}
        name={props.name}
        type="file"
        accept={accept || undefined}
        multiple={d._fileMultiple}
        disabled={d._disabled}
        onChange={handleInput}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        style={{ display: 'none' }}
        {...extra?.inputProps}
      />

      {currentFiles.length > 0 && (
        <ul
          data-fb-slot="file-list"
          className={classNames?.list}
          style={mergeStyles(styles?.list)}
        >
          {currentFiles.map((file, index) => {
            const rawDefaultIcon = getDefaultFileIcon(file);
            const dimensionsLabel =
              file.width && file.height ? `${file.width}×${file.height}px` : undefined;
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
              <p
                data-fb-slot="file-meta"
                className={classNames?.fileMeta}
                style={mergeStyles(styles?.fileMeta)}
              >
                {formatBytes(file.size)}
                {dimensionsLabel ? ` · ${dimensionsLabel}` : ''}
              </p>
            );

            return (
              <li
                key={`${file.uri}-${file.name}-${index.toString()}`}
                data-fb-slot="file-item"
                className={classNames?.listItem}
                style={mergeStyles(styles?.listItem)}
              >
                {d._filePreview && file.type.startsWith('image/') ? (
                  <img
                    src={file.uri}
                    alt={file.name}
                    data-fb-slot="preview-image"
                    className={classNames?.previewImage}
                    style={mergeStyles(styles?.previewImage)}
                  />
                ) : (
                  <div
                    data-fb-slot="file-icon"
                    className={classNames?.fileIcon}
                    style={mergeStyles(styles?.fileIcon)}
                  >
                    {resolvedFileIcon}
                  </div>
                )}

                <div data-fb-slot="file-info">
                  <p
                    data-fb-slot="file-name"
                    className={classNames?.fileName}
                    style={mergeStyles(styles?.fileName)}
                  >
                    {file.name}
                  </p>
                  {renderFileMeta?.({
                    ...itemRenderContext,
                    defaultContent: defaultFileMetaContent,
                  }) ?? defaultFileMetaContent}
                </div>

                <button
                  type="button"
                  data-fb-slot="remove-button"
                  className={classNames?.removeButton}
                  style={mergeStyles(styles?.removeButton)}
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}
                >
                  {renderRemoveButtonContent?.({
                    ...itemRenderContext,
                    defaultContent: resolveText(removeButtonText, '✕', itemRenderContext),
                  }) ?? resolveText(removeButtonText, '✕', itemRenderContext)}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {d._fileMultiple &&
        currentFiles.length > 0 &&
        currentFiles.length < d._fileMaxFiles && (
          <button
            type="button"
            data-fb-slot="add-more-button"
            className={classNames?.addMoreButton}
            style={mergeStyles(controlErrorStyle, styles?.addMoreButton)}
            onClick={() => inputRef.current?.click()}
          >
            {renderAddMoreButtonContent?.({
              ...renderContext,
              defaultContent: defaultAddMoreButtonContent,
            }) ?? defaultAddMoreButtonContent}
          </button>
        )}

      {renderHelperSlot({
        error: props.error,
        hint: props.hint,
        errorId,
        name: props.name,
        hintId,
        classNames: classNames as Record<string, string | undefined>,
        styles: styles as Record<string, CSSProperties | undefined>,
        errorProps: errorProps as Record<string, unknown>,
        hintProps: hintProps as Record<string, unknown>,
        renderError,
        renderHint,
      })}
    </div>
  );
};

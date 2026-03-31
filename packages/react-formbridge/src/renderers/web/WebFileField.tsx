import React, {
  type CSSProperties,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
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
import type { ExtraFieldProps, FieldRenderProps } from '../../types';
import { defaultBorderColor, shouldHighlightOnError } from './shared';

type FileSlot =
  | 'root'
  | 'label'
  | 'dropZone'
  | 'dropZoneIcon'
  | 'dropZoneText'
  | 'browseButton'
  | 'list'
  | 'listItem'
  | 'previewImage'
  | 'fileIcon'
  | 'fileName'
  | 'fileMeta'
  | 'removeButton'
  | 'addMoreButton'
  | 'error'
  | 'hint';

interface FileUiOverrides {
  id?: string;
  hideLabel?: boolean;
  highlightOnError?: boolean;
  classNames?: Partial<Record<FileSlot, string>>;
  styles?: Partial<Record<FileSlot, CSSProperties>>;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'type'
    | 'value'
    | 'defaultValue'
    | 'name'
    | 'id'
    | 'accept'
    | 'multiple'
    | 'disabled'
    | 'onChange'
  >;
  hintProps?: HTMLAttributes<HTMLParagraphElement>;
  errorProps?: HTMLAttributes<HTMLParagraphElement>;
  renderLabel?: (ctx: { id: string; label: ReactNode; required: boolean }) => ReactNode;
  renderError?: (ctx: { id: string; error: ReactNode }) => ReactNode;
  renderHint?: (ctx: { id: string; hint: ReactNode }) => ReactNode;
  renderRequiredMark?: () => ReactNode;
  renderFileIcon?: (file: FileValue) => ReactNode;
}

interface Props extends FieldRenderProps<FileValue | FileValue[] | null> {
  descriptor: BuiltFileDescriptor & {
    _ui?: {
      id?: string;
      readOnly?: boolean;
      autoFocus?: boolean;
      rootClassName?: string;
      labelClassName?: string;
      inputClassName?: string;
      rootStyle?: Record<string, unknown>;
      labelStyle?: Record<string, unknown>;
      inputStyle?: Record<string, unknown>;
      highlightOnError?: boolean;
    };
  };
  extra?: ExtraFieldProps;
}

function cx(...values: Array<string | undefined | false | null>) {
  return values.filter(Boolean).join(' ');
}

function mergeStyles(
  ...styles: Array<CSSProperties | Record<string, unknown> | undefined>
): CSSProperties | undefined {
  return Object.assign({}, ...styles.filter(Boolean));
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

export const WebFileField = ({ descriptor: d, extra, ...props }: Props) => {
  const reactId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const createdUrisRef = useRef<Set<string>>(new Set());

  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const web = d._ui ?? {};
  const ui = extra?.appearance as FileUiOverrides | undefined;
  const { rootProps, labelProps, hintProps, errorProps } = ui ?? {};
  const {
    className: rootPropsClassName,
    style: rootPropsStyle,
    ...rootPropsRest
  } = rootProps ?? {};
  const {
    className: labelPropsClassName,
    style: labelPropsStyle,
    ...labelPropsRest
  } = labelProps ?? {};
  const {
    className: hintPropsClassName,
    style: hintPropsStyle,
    ...hintPropsRest
  } = hintProps ?? {};
  const {
    className: errorPropsClassName,
    style: errorPropsStyle,
    ...errorPropsRest
  } = errorProps ?? {};

  const id = ui?.id ?? web.id ?? `${props.name}-${reactId}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = props.error ? errorId : props.hint ? hintId : undefined;
  const hasError = Boolean(props.error);
  const highlightOnError = shouldHighlightOnError(
    ui?.highlightOnError,
    web.highlightOnError,
  );

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
  const requiredMark = ui?.renderRequiredMark?.() ?? (
    <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>
  );

  const rootClassName = cx(
    extra?.className,
    web.rootClassName,
    ui?.classNames?.root,
    rootPropsClassName,
  );
  const labelClassName = cx(
    web.labelClassName,
    ui?.classNames?.label,
    labelPropsClassName,
  );

  return (
    <div
      className={rootClassName}
      style={mergeStyles(
        { marginBottom: 16 },
        extra?.style as CSSProperties | undefined,
        web.rootStyle,
        ui?.styles?.root,
        rootPropsStyle,
      )}
      {...rootPropsRest}
    >
      {!ui?.hideLabel &&
        (ui?.renderLabel ? (
          ui.renderLabel({
            id,
            label: props.label,
            required: Boolean(d._required),
          })
        ) : (
          <label
            htmlFor={id}
            className={labelClassName}
            style={mergeStyles(
              {
                fontSize: 13,
                fontWeight: 600,
                color: '#374151',
                display: 'block',
                marginBottom: 6,
              },
              web.labelStyle,
              ui?.styles?.label,
              labelPropsStyle,
            )}
            {...labelPropsRest}
          >
            {props.label}
            {d._required && requiredMark}
          </label>
        ))}

      {d._fileDragDrop ? (
        <button
          type="button"
          aria-disabled={d._disabled || undefined}
          // aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={ui?.classNames?.dropZone}
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
          style={mergeStyles(
            {
              border: `2px dashed ${defaultBorderColor(
                hasError,
                highlightOnError,
                dragging ? '#6366f1' : '#d1d5db',
              )}`,
              borderRadius: 12,
              padding: '28px 20px',
              textAlign: 'center',
              cursor: d._disabled ? 'not-allowed' : 'pointer',
              background: dragging ? 'rgba(99,102,241,0.04)' : '#fafafa',
              transition: 'all 0.2s',
              opacity: d._disabled ? 0.5 : 1,
              outline: 'none',
              appearance: 'none',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            },
            ui?.styles?.dropZone,
          )}
        >
          {loading ? (
            <div
              className={ui?.classNames?.dropZoneText}
              style={mergeStyles(
                { textAlign: 'center', color: '#6b7280', fontSize: 14 },
                ui?.styles?.dropZoneText,
              )}
            >
              ⟳ Processing…
            </div>
          ) : (
            <>
              <div
                className={ui?.classNames?.dropZoneIcon}
                style={mergeStyles(
                  { fontSize: 28, marginBottom: 10 },
                  ui?.styles?.dropZoneIcon,
                )}
              >
                {d._fileAccept.some((t) => t.includes('image'))
                  ? '🖼'
                  : d._fileAccept.some((t) => t.includes('pdf'))
                    ? '📄'
                    : '📁'}
              </div>

              <p
                className={ui?.classNames?.dropZoneText}
                style={mergeStyles(
                  {
                    fontSize: 14,
                    color: dragging ? '#6366f1' : '#6b7280',
                    fontWeight: dragging ? 600 : 400,
                    margin: 0,
                  },
                  ui?.styles?.dropZoneText,
                )}
              >
                {dragging ? 'Drop it here!' : d._fileDragDropLabel}
              </p>

              {d._fileAccept.length > 0 && (
                <p style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 4 }}>
                  Accepted: {d._fileAccept.join(', ')}
                </p>
              )}

              {d._fileMaxSize && (
                <p style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 2 }}>
                  Max size: {formatBytes(d._fileMaxSize)}
                </p>
              )}
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          className={ui?.classNames?.browseButton}
          onClick={() => !d._disabled && inputRef.current?.click()}
          disabled={d._disabled}
          style={mergeStyles(
            {
              padding: '10px 20px',
              borderRadius: 8,
              border: `1.5px solid ${defaultBorderColor(
                hasError,
                highlightOnError,
                '#d1d5db',
              )}`,
              background: '#fff',
              cursor: d._disabled ? 'not-allowed' : 'pointer',
              fontSize: 14,
              color: '#374151',
              fontWeight: 500,
            },
            ui?.styles?.browseButton,
          )}
        >
          📂 Browse files
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
        {...ui?.inputProps}
      />

      {currentFiles.length > 0 && (
        <ul
          className={ui?.classNames?.list}
          style={mergeStyles(
            {
              margin: '10px 0 0',
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            },
            ui?.styles?.list,
          )}
        >
          {currentFiles.map((file, index) => (
            <li
              key={`${file.uri}-${file.name}-${index.toString()}`}
              className={ui?.classNames?.listItem}
              style={mergeStyles(
                {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  background: '#f9fafb',
                  borderRadius: 9,
                  border: '1px solid #e5e7eb',
                },
                ui?.styles?.listItem,
              )}
            >
              {d._filePreview && file.type.startsWith('image/') ? (
                <img
                  src={file.uri}
                  alt={file.name}
                  className={ui?.classNames?.previewImage}
                  style={mergeStyles(
                    {
                      width: d._filePreviewHeight,
                      height: d._filePreviewHeight,
                      objectFit: 'cover',
                      borderRadius: 8,
                      flexShrink: 0,
                    },
                    ui?.styles?.previewImage,
                  )}
                />
              ) : (
                <div
                  className={ui?.classNames?.fileIcon}
                  style={mergeStyles(
                    {
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      flexShrink: 0,
                    },
                    ui?.styles?.fileIcon,
                  )}
                >
                  {ui?.renderFileIcon?.(file) ?? getDefaultFileIcon(file)}
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  className={ui?.classNames?.fileName}
                  style={mergeStyles(
                    {
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#111',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                    ui?.styles?.fileName,
                  )}
                >
                  {file.name}
                </p>

                <p
                  className={ui?.classNames?.fileMeta}
                  style={mergeStyles(
                    { fontSize: 11.5, color: '#9ca3af', margin: '2px 0 0' },
                    ui?.styles?.fileMeta,
                  )}
                >
                  {formatBytes(file.size)}
                  {file.width ? ` · ${file.width}×${file.height}px` : ''}
                </p>
              </div>

              <button
                type="button"
                className={ui?.classNames?.removeButton}
                onClick={() => removeFile(index)}
                style={mergeStyles(
                  {
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    fontSize: 18,
                    padding: '2px 4px',
                    flexShrink: 0,
                  },
                  ui?.styles?.removeButton,
                )}
                aria-label={`Remove ${file.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {d._fileMultiple &&
        currentFiles.length > 0 &&
        currentFiles.length < d._fileMaxFiles && (
          <button
            type="button"
            className={ui?.classNames?.addMoreButton}
            onClick={() => inputRef.current?.click()}
            style={mergeStyles(
              {
                marginTop: 8,
                background: 'none',
                border: '1.5px dashed #d1d5db',
                borderRadius: 8,
                padding: '8px 16px',
                cursor: 'pointer',
                color: '#6b7280',
                fontSize: 13,
              },
              ui?.styles?.addMoreButton,
            )}
          >
            + Add more ({currentFiles.length}/{d._fileMaxFiles})
          </button>
        )}

      {props.error
        ? (ui?.renderError?.({ id: errorId, error: props.error }) ?? (
            <p
              id={errorId}
              role="alert"
              className={cx(ui?.classNames?.error, errorPropsClassName)}
              style={mergeStyles(
                { fontSize: 12, color: '#ef4444', marginTop: 6 },
                ui?.styles?.error,
                errorPropsStyle,
              )}
              {...errorPropsRest}
            >
              {props.error}
            </p>
          ))
        : props.hint
          ? (ui?.renderHint?.({ id: hintId, hint: props.hint }) ?? (
              <p
                id={hintId}
                className={cx(ui?.classNames?.hint, hintPropsClassName)}
                style={mergeStyles(
                  { fontSize: 12, color: '#9ca3af', marginTop: 4 },
                  ui?.styles?.hint,
                  hintPropsStyle,
                )}
                {...hintPropsRest}
              >
                {props.hint}
              </p>
            ))
          : null}
    </div>
  );
};

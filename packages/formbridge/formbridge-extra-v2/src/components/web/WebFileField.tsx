import React, { useRef, useState, useCallback, type CSSProperties } from 'react';
import type { FileValue } from '../../fields/file/FileField';

interface FileDescriptor {
  _label:              string;
  _required:           boolean;
  _hint?:              string;
  _disabled:           boolean;
  _fileAccept:         string[];
  _fileMaxSize:        number | null;
  _fileMultiple:       boolean;
  _fileMaxFiles:       number;
  _filePreview:        boolean;
  _filePreviewHeight:  number;
  _fileBase64:         boolean;
  _fileDragDrop:       boolean;
  _fileDragDropLabel:  string;
}

interface Props {
  descriptor: FileDescriptor;
  value:      FileValue | FileValue[] | null;
  error:      string | null;
  onChange:   (v: FileValue | FileValue[] | null) => void;
  onBlur:     () => void;
}

// ─── File → FileValue converter ───────────────────────────────────────────────

async function fileToValue(file: File, withBase64: boolean): Promise<FileValue> {
  const uri    = URL.createObjectURL(file);
  const result: FileValue = {
    uri,
    name: file.name,
    type: file.type,
    size: file.size,
  };

  if (withBase64) {
    result.base64 = await new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload  = () => res((reader.result as string).split(',')[1]);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  // Get image dimensions
  if (file.type.startsWith('image/')) {
    await new Promise<void>(resolve => {
      const img = new Image();
      img.onload = () => {
        result.width  = img.naturalWidth;
        result.height = img.naturalHeight;
        URL.revokeObjectURL(img.src); // cleanup
        resolve();
      };
      img.src = uri;
    });
  }

  return result;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WebFileField({ descriptor: d, value, error, onChange, onBlur }: Props) {
  const inputRef   = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const currentFiles: FileValue[] = value
    ? (Array.isArray(value) ? value : [value])
    : [];

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (!d._fileMultiple && arr.length > 1) return;

    setLoading(true);
    try {
      const values = await Promise.all(arr.map(f => fileToValue(f, d._fileBase64)));
      if (d._fileMultiple) {
        const merged = [...currentFiles, ...values].slice(0, d._fileMaxFiles);
        onChange(merged);
      } else {
        onChange(values[0]);
      }
    } finally {
      setLoading(false);
      onBlur();
    }
  }, [d, currentFiles, onChange, onBlur]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    if (d._fileMultiple) {
      const next = currentFiles.filter((_, i) => i !== index);
      onChange(next.length ? next : null);
    } else {
      onChange(null);
    }
  };

  const hasError = Boolean(error);
  const accept   = d._fileAccept.join(',');

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Label */}
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
        {d._label}
        {d._required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
      </label>

      {/* Drop zone */}
      {d._fileDragDrop ? (
        <div
          role="button"
          tabIndex={d._disabled ? -1 : 0}
          onClick={() => !d._disabled && inputRef.current?.click()}
          onKeyDown={e => e.key === 'Enter' && !d._disabled && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); !d._disabled && setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={d._disabled ? undefined : handleDrop}
          style={dropZoneStyle(dragging, hasError, d._disabled)}
        >
          {loading ? (
            <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
              ⟳ Processing…
            </div>
          ) : (
            <>
              <div style={{ fontSize: 28, marginBottom: 10 }}>
                {d._fileAccept.some(t => t.includes('image')) ? '🖼' :
                 d._fileAccept.some(t => t.includes('pdf'))   ? '📄' : '📁'}
              </div>
              <p style={{ fontSize: 14, color: dragging ? '#6366f1' : '#6b7280', fontWeight: dragging ? 600 : 400, margin: 0 }}>
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
        </div>
      ) : (
        <button
          type="button"
          onClick={() => !d._disabled && inputRef.current?.click()}
          disabled={d._disabled}
          style={browseButtonStyle(hasError)}
        >
          📂 Browse files
        </button>
      )}

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept || undefined}
        multiple={d._fileMultiple}
        disabled={d._disabled}
        onChange={handleInput}
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      {/* Selected files list */}
      {currentFiles.length > 0 && (
        <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {currentFiles.map((file, i) => (
            <li key={file.uri} style={fileItemStyle}>
              {/* Preview */}
              {d._filePreview && file.type.startsWith('image/') && (
                <img
                  src={file.uri}
                  alt={file.name}
                  style={{
                    width:        d._filePreviewHeight,
                    height:       d._filePreviewHeight,
                    objectFit:    'cover',
                    borderRadius: 8,
                    flexShrink:   0,
                  }}
                />
              )}
              {/* File icon for non-images */}
              {(!d._filePreview || !file.type.startsWith('image/')) && (
                <div style={fileIconStyle}>
                  {file.type.includes('pdf')   ? '📄' :
                   file.type.includes('image') ? '🖼'  :
                   file.type.includes('video') ? '🎬'  :
                   file.type.includes('sheet') ? '📊'  :
                   file.type.includes('csv')   ? '📊'  : '📎'}
                </div>
              )}
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </p>
                <p style={{ fontSize: 11.5, color: '#9ca3af', margin: '2px 0 0' }}>
                  {formatBytes(file.size)}
                  {file.width && ` · ${file.width}×${file.height}px`}
                </p>
              </div>
              {/* Remove */}
              <button
                type="button"
                onClick={() => removeFile(i)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 18, padding: '2px 4px', flexShrink: 0 }}
                aria-label={`Remove ${file.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Multiple: add more button */}
      {d._fileMultiple && currentFiles.length > 0 && currentFiles.length < d._fileMaxFiles && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{ marginTop: 8, background: 'none', border: '1.5px dashed #d1d5db', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', color: '#6b7280', fontSize: 13 }}
        >
          + Add more ({currentFiles.length}/{d._fileMaxFiles})
        </button>
      )}

      {/* Error / hint */}
      {error && <p role="alert" style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{error}</p>}
      {!error && d._hint && <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{d._hint}</p>}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function dropZoneStyle(dragging: boolean, error: boolean, disabled: boolean): CSSProperties {
  return {
    border:          `2px dashed ${error ? '#ef4444' : dragging ? '#6366f1' : '#d1d5db'}`,
    borderRadius:    12,
    padding:         '28px 20px',
    textAlign:       'center',
    cursor:          disabled ? 'not-allowed' : 'pointer',
    background:      dragging ? 'rgba(99,102,241,0.04)' : '#fafafa',
    transition:      'all 0.2s',
    opacity:         disabled ? 0.5 : 1,
    outline:         'none',
    display:         'flex',
    flexDirection:   'column',
    alignItems:      'center',
  };
}

function browseButtonStyle(error: boolean): CSSProperties {
  return {
    padding:      '10px 20px',
    borderRadius: 8,
    border:       `1.5px solid ${error ? '#ef4444' : '#d1d5db'}`,
    background:   '#fff',
    cursor:       'pointer',
    fontSize:     14,
    color:        '#374151',
    fontWeight:   500,
  };
}

const fileItemStyle: CSSProperties = {
  display:      'flex',
  alignItems:   'center',
  gap:          10,
  padding:      '10px 12px',
  background:   '#f9fafb',
  borderRadius: 9,
  border:       '1px solid #e5e7eb',
};

const fileIconStyle: CSSProperties = {
  width:           40,
  height:          40,
  borderRadius:    8,
  background:      '#f3f4f6',
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
  fontSize:        20,
  flexShrink:      0,
};

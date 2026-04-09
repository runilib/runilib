/**
 * react-formbridge — File Upload Field
 * ────────────────────────────────
 * Cross-platform file upload field.
 * Web: input[type=file] with drag & drop.
 * Native: expo-image-picker + expo-document-picker (optional deps).
 */

import type { FieldDescriptor } from '../../../types/field';
import type { ConditionPredicate, FieldConditions } from '../../conditions/conditions';
import { DEFAULT_FIELD_CONDITIONS } from '../../conditions/conditions';
import type { FileFieldMeta, FileSourceType, FileValue } from './types';

// ─── Builder ──────────────────────────────────────────────────────────────────

export class FileFieldBuilder {
  private readonly _meta: FileFieldMeta;
  private _conditions: FieldConditions = {
    ...DEFAULT_FIELD_CONDITIONS,
    visible: [],
    required: [],
    disabled: [],
  };
  private _label!: string;
  private _required: boolean = false;
  private _requiredMsg: string = 'Please select a file.';
  private _hint?: string;
  private _disabled: boolean = false;
  private _hidden: boolean = false;

  constructor() {
    this._meta = {
      _fileEnabled: true,
      _fileAccept: [],
      _fileMaxSize: null,
      _fileMaxFiles: 1,
      _fileMultiple: false,
      _filePreview: false,
      _filePreviewHeight: 160,
      _fileSource: 'all',
      _fileBase64: false,
      _fileImageMaxWidth: 0,
      _fileImageMaxHeight: 0,
      _fileImageQuality: 0.9,
      _fileAllowVideo: false,
      _fileDragDrop: true,
      _fileDragDropLabel: 'Drag & drop a file here, or click to browse',
    };
  }

  // ── Standard field methods ────────────────────────────────────

  label(label: string): this {
    this._label = label;
    return this;
  }

  required(message?: string): this {
    this._required = true;
    this._requiredMsg = message ?? 'Please select a file.';
    return this;
  }

  hint(text: string): this {
    this._hint = text;
    return this;
  }

  disabled(value = true): this {
    this._disabled = value;
    return this;
  }

  hidden(value = true): this {
    this._hidden = value;
    return this;
  }

  visibleWhen(fieldOrFn: string | ConditionPredicate, value?: unknown): this {
    if (typeof fieldOrFn === 'function') {
      this._conditions.visible.push({ type: 'fn', fn: fieldOrFn });
    } else {
      this._conditions.visible.push({
        type: 'eq',
        field: fieldOrFn,
        value: value ?? true,
      });
    }

    return this;
  }

  visibleWhenNot(field: string, value: unknown): this {
    this._conditions.visible.push({ type: 'neq', field, value });
    return this;
  }

  visibleWhenTruthy(field: string): this {
    this._conditions.visible.push({ type: 'truthy', field });
    return this;
  }

  visibleWhenFalsy(field: string): this {
    this._conditions.visible.push({ type: 'falsy', field });
    return this;
  }

  visibleWhenAny(pairs: Array<[string, unknown]>): this {
    this._conditions.visible.push({
      op: 'OR',
      conditions: pairs.map(([field, pairValue]) => ({
        type: 'eq' as const,
        field,
        value: pairValue,
      })),
    });
    return this;
  }

  requiredWhen(fieldOrFn: string | ConditionPredicate, value?: unknown): this {
    if (typeof fieldOrFn === 'function') {
      this._conditions.required.push({ type: 'fn', fn: fieldOrFn });
    } else {
      this._conditions.required.push({
        type: 'eq',
        field: fieldOrFn,
        value: value ?? true,
      });
    }

    return this;
  }

  requiredWhenAny(pairs: Array<[string, unknown]>): this {
    this._conditions.required.push({
      op: 'OR',
      conditions: pairs.map(([field, pairValue]) => ({
        type: 'eq' as const,
        field,
        value: pairValue,
      })),
    });
    return this;
  }

  disabledWhen(fieldOrFn: string | ConditionPredicate, value?: unknown): this {
    if (typeof fieldOrFn === 'function') {
      this._conditions.disabled.push({ type: 'fn', fn: fieldOrFn });
    } else {
      this._conditions.disabled.push({
        type: 'eq',
        field: fieldOrFn,
        value: value ?? true,
      });
    }

    return this;
  }

  resetOnHide(): this {
    this._conditions.onHide = 'reset';
    return this;
  }

  keepOnHide(): this {
    this._conditions.onHide = 'keep';
    return this;
  }

  clearOnHide(): this {
    this._conditions.onHide = 'clear';
    return this;
  }

  // ── File-specific methods ─────────────────────────────────────

  /**
   * Accepted MIME types.
   * @example .accept(['image/jpeg', 'image/png', 'application/pdf'])
   * @example .accept(['image/*'])
   */
  accept(types: string[]): this {
    this._meta._fileAccept = types;
    return this;
  }

  /**
   * Max file size in bytes.
   * @example .maxSize(5 * 1024 * 1024)  // 5 MB
   */
  maxSize(bytes: number): this {
    this._meta._fileMaxSize = bytes;
    return this;
  }

  /** Allow multiple file selection. */
  multiple(max = 10): this {
    this._meta._fileMultiple = true;
    this._meta._fileMaxFiles = max;
    return this;
  }

  /** Show a preview of selected image(s). */
  preview(height = 160): this {
    this._meta._filePreview = true;
    this._meta._filePreviewHeight = height;
    return this;
  }

  /**
   * On native: which source to use for file selection.
   * - 'gallery'   → photo gallery
   * - 'camera'    → camera
   * - 'documents' → document picker
   * - 'all'       → show action sheet to choose (default)
   */
  source(type: FileSourceType): this {
    this._meta._fileSource = type;
    return this;
  }

  /** Request base64 encoding of selected files (needed for some upload APIs). */
  withBase64(): this {
    this._meta._fileBase64 = true;
    return this;
  }

  /**
   * Auto-resize images before selection (native only).
   * @example .resize(1920, 1080, 0.85)
   */
  resize(maxWidth: number, maxHeight: number, quality = 0.9): this {
    this._meta._fileImageMaxWidth = maxWidth;
    this._meta._fileImageMaxHeight = maxHeight;
    this._meta._fileImageQuality = quality;
    return this;
  }

  /** Allow video files in addition to images. */
  allowVideo(): this {
    this._meta._fileAllowVideo = true;
    return this;
  }

  /**
   * Disable drag & drop on web (show just the button).
   */
  noDragDrop(): this {
    this._meta._fileDragDrop = false;
    return this;
  }

  /** Custom drag & drop zone label. */
  dragLabel(label: string): this {
    this._meta._fileDragDropLabel = label;
    return this;
  }

  // ─── Convenience presets ─────────────────────────────────────

  /** Preset for profile photo upload (images only, 5MB max, preview enabled). */
  static profilePhoto(label = 'Profile photo'): FileFieldBuilder {
    return new FileFieldBuilder()
      .accept(['image/jpeg', 'image/png', 'image/webp'])
      .maxSize(5 * 1024 * 1024)
      .preview()
      .label(label)
      .source('gallery')
      .resize(1024, 1024, 0.85)
      .dragLabel('Click to upload a profile photo')
      .hint('JPG, PNG or WebP. Max 5 MB.');
  }

  /** Preset for document upload (PDF only, 10MB max). */
  static document(label = 'Document'): FileFieldBuilder {
    return new FileFieldBuilder()
      .accept(['application/pdf'])
      .maxSize(10 * 1024 * 1024)
      .source('documents')
      .label(label)
      .dragLabel('Click to upload a PDF document')
      .hint('PDF only. Max 10 MB.');
  }

  /** Preset for a generic attachment (images + PDF, multiple). */
  static attachments(label = 'Attachments', max = 5): FileFieldBuilder {
    return new FileFieldBuilder()
      .accept(['image/*', 'application/pdf'])
      .maxSize(10 * 1024 * 1024)
      .multiple(max)
      .label(label)
      .preview()
      .dragLabel(`Drag & drop up to ${max} files, or click to browse`)
      .hint(`Images or PDF. Max 10 MB each. Up to ${max} files.`);
  }

  /** Preset for CSV/Excel import. */
  static spreadsheet(label = 'Import file'): FileFieldBuilder {
    return new FileFieldBuilder()
      .accept([
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ])
      .label(label)
      .maxSize(20 * 1024 * 1024)
      .source('documents')
      .dragLabel('Drop your CSV or Excel file here')
      .hint('CSV or XLSX. Max 20 MB.');
  }

  // ─── Build descriptor ─────────────────────────────────────────

  /**
   * @internal
   */
  _build() {
    const validators: ((v: unknown) => string | null)[] = [];

    if (this._required) {
      validators.push((v: unknown) => {
        if (!v || (Array.isArray(v) && v.length === 0)) return this._requiredMsg;
        return null;
      });
    }

    if (this._meta._fileMaxSize !== null) {
      const maxBytes = this._meta._fileMaxSize;
      validators.push((v: unknown) => {
        const files = Array.isArray(v) ? (v as FileValue[]) : v ? [v as FileValue] : [];
        for (const f of files) {
          if (f.size > maxBytes) {
            const mb = (maxBytes / (1024 * 1024)).toFixed(0);
            return `File "${f.name}" is too large. Max size is ${mb} MB.`;
          }
        }
        return null;
      });
    }

    if (this._meta._fileAccept.length > 0) {
      const accepted = this._meta._fileAccept;
      validators.push((v: unknown) => {
        const files = Array.isArray(v) ? (v as FileValue[]) : v ? [v as FileValue] : [];
        for (const f of files) {
          const ok = accepted.some((pattern) => {
            if (pattern.endsWith('/*')) {
              return f.type.startsWith(pattern.replace('/*', '/'));
            }
            return f.type === pattern;
          });
          if (!ok) return `File type "${f.type}" is not accepted.`;
        }
        return null;
      });
    }

    if (this._meta._fileMultiple && this._meta._fileMaxFiles > 0) {
      const max = this._meta._fileMaxFiles;
      validators.push((v: unknown) => {
        const files = Array.isArray(v) ? v : [];
        if (files.length > max) return `You can upload at most ${max} files.`;
        return null;
      });
    }

    return {
      _type: 'file' as const,
      _label: this._label,
      _defaultValue: this._meta._fileMultiple ? [] : null,
      _required: this._required,
      _requiredMsg: this._requiredMsg,
      _hint: this._hint,
      _disabled: this._disabled,
      _hidden: this._hidden,
      _trim: false,
      _debounce: 0,
      _validators: validators,
      _conditions: {
        ...this._conditions,
        visible: [...this._conditions.visible],
        required: [...this._conditions.required],
        disabled: [...this._conditions.disabled],
      },
      ...this._meta,
    };
  }
}

export type BuiltFileDescriptor = FieldDescriptor<
  FileValue | FileValue[] | null,
  'file'
> &
  FileFieldMeta & {
    _conditions?: FieldConditions;
  };

/** Check if a descriptor is a file field */
export function isFileDescriptor(d: object): d is BuiltFileDescriptor {
  return '_fileEnabled' in d;
}

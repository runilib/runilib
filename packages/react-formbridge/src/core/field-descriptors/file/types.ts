// ─── FileValue - platform-agnostic file reference ────────────────────────────

export interface FileValue {
  /** Platform-agnostic URI (blob URL on web, file:// on native) */
  uri: string;
  /** Original file name */
  name: string;
  /** MIME type */
  type: string;
  /** File size in bytes */
  size: number;
  /** Base64 encoded data (optional, for direct upload) */
  base64?: string;
  /** Width (images only) */
  width?: number;
  /** Height (images only) */
  height?: number;
  /** Whether the file was selected from the camera */
  fromCamera?: boolean;
}

// ─── FileFieldMeta ────────────────────────────────────────────────────────────

export type FileSourceType = 'gallery' | 'camera' | 'documents' | 'all';

export interface FileFieldMeta {
  _fileEnabled: true;
  /** Accepted MIME types (e.g. ['image/jpeg', 'image/png', 'application/pdf']) */
  _fileAccept: string[];
  /** Max file size in bytes */
  _fileMaxSize: number | null;
  /** Max number of files (when multiple is true) */
  _fileMaxFiles: number;
  /** Allow multiple files */
  _fileMultiple: boolean;
  /** Show image preview after selection */
  _filePreview: boolean;
  /** Preview max height in pixels */
  _filePreviewHeight: number;
  /** Source type on native (gallery | camera | documents | all) */
  _fileSource: FileSourceType;
  /** Request base64 encoding of selected files */
  _fileBase64: boolean;
  /** Max image width/height for auto-resize on native (0 = no resize) */
  _fileImageMaxWidth: number;
  _fileImageMaxHeight: number;
  /** Image quality 0–1 for JPEG compression */
  _fileImageQuality: number;
  /** Allow selecting videos */
  _fileAllowVideo: boolean;
  /** Show a drag & drop zone on web */
  _fileDragDrop: boolean;
  /** Custom drag & drop zone label */
  _fileDragDropLabel: string;
}

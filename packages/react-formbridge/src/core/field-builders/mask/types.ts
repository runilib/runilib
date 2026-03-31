import type { FieldDescriptor } from '../../../types';

export type BuiltinMaskChar = '9' | 'a' | '*';
export type MaskChar = BuiltinMaskChar;
export type MaskTokenMap = Record<string, RegExp>;

export interface MaskToken {
  regex: RegExp;
  isInput: boolean;
  separator: string;
}

export interface MaskPatternConfig {
  pattern: string;
  tokens?: MaskTokenMap;
}

export interface MaskResult {
  display: string;
  raw: string;
  complete: boolean;
  nextCursorPos: number;
}

export interface ApplyMaskOptions {
  showPlaceholder?: boolean;
  placeholder?: string;
  tokens?: MaskTokenMap;
}

export interface MaskedFieldMeta {
  _maskPattern: string;
  _maskTokens?: MaskTokenMap;
  _maskUppercase: boolean;
  _maskLowercase: boolean;
  _maskStoreRaw: boolean;
  _maskShowPlaceholder: boolean;
  _maskShowInPlaceholder: boolean;
  _maskPlaceholder: string;
  _maskValidateComplete: boolean;
  _maskCompleteMsg: string;
}

export type MaskedDescriptor<V = string> = FieldDescriptor<V> & MaskedFieldMeta;

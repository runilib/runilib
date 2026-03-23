import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, Image,
  StyleSheet, ScrollView, Alert, ActionSheetIOS, Platform,
} from 'react-native';
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
  _fileSource:         'gallery' | 'camera' | 'documents' | 'all';
  _fileImageMaxWidth:  number;
  _fileImageMaxHeight: number;
  _fileImageQuality:   number;
  _fileAllowVideo:     boolean;
}

interface Props {
  descriptor: FileDescriptor;
  value:      FileValue | FileValue[] | null;
  error:      string | null;
  onChange:   (v: FileValue | FileValue[] | null) => void;
  onBlur:     () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024)         return `${bytes} B`;
  if (bytes < 1024 * 1024)  return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return '🖼';
  if (type.startsWith('video/')) return '🎬';
  if (type.includes('pdf'))       return '📄';
  if (type.includes('sheet') || type.includes('csv')) return '📊';
  return '📎';
}

export function NativeFileField({ descriptor: d, value, error, onChange, onBlur }: Props) {
  const [loading, setLoading] = useState(false);

  const currentFiles: FileValue[] = value
    ? (Array.isArray(value) ? value : [value])
    : [];

  const isImageOnly = d._fileAccept.every(t => t.startsWith('image/') || t === 'image/*');
  const isPdfOnly   = d._fileAccept.every(t => t.includes('pdf'));

  const openPicker = useCallback(async (sourceType: 'gallery' | 'camera' | 'documents') => {
    setLoading(true);
    try {
      let result: FileValue[] = [];

      if (sourceType === 'documents' || isPdfOnly) {
        // expo-document-picker
        try {
          const DocumentPicker = require('expo-document-picker');
          const res = await DocumentPicker.getDocumentAsync({
            type:           d._fileAccept.length ? d._fileAccept : ['*/*'],
            multiple:       d._fileMultiple,
            copyToCacheDirectory: true,
          });

          if (!res.canceled && res.assets) {
            result = res.assets.map((asset: any) => ({
              uri:  asset.uri,
              name: asset.name,
              type: asset.mimeType ?? 'application/octet-stream',
              size: asset.size ?? 0,
            }));
          }
        } catch {
          console.warn('[formura] expo-document-picker not installed. Run: npx expo install expo-document-picker');
          return;
        }
      } else {
        // expo-image-picker
        try {
          const ImagePicker = require('expo-image-picker');

          // Request permission
          if (sourceType === 'camera') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission required', 'Camera access is needed to take a photo.');
              return;
            }
          } else {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission required', 'Photo library access is needed.');
              return;
            }
          }

          const options: any = {
            mediaTypes:       d._fileAllowVideo
              ? ImagePicker.MediaTypeOptions.All
              : ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: d._fileMultiple,
            quality:          d._fileImageQuality,
            base64:           d._fileBase64,
            exif:             false,
          };

          if (d._fileImageMaxWidth > 0) {
            options.allowsEditing  = false;
            options.aspect         = undefined;
          }

          const res = sourceType === 'camera'
            ? await ImagePicker.launchCameraAsync(options)
            : await ImagePicker.launchImageLibraryAsync(options);

          if (!res.canceled && res.assets) {
            result = res.assets.map((asset: any) => ({
              uri:        asset.uri,
              name:       asset.fileName ?? `photo_${Date.now()}.jpg`,
              type:       asset.type === 'video' ? 'video/mp4' : `image/jpeg`,
              size:       asset.fileSize ?? 0,
              width:      asset.width,
              height:     asset.height,
              base64:     asset.base64,
              fromCamera: sourceType === 'camera',
            }));
          }
        } catch {
          console.warn('[formura] expo-image-picker not installed. Run: npx expo install expo-image-picker');
          return;
        }
      }

      if (result.length === 0) return;

      // Apply max files limit
      const limited = result.slice(0, d._fileMaxFiles - currentFiles.length);

      if (d._fileMultiple) {
        const merged = [...currentFiles, ...limited].slice(0, d._fileMaxFiles);
        onChange(merged);
      } else {
        onChange(limited[0]);
      }
      onBlur();
    } finally {
      setLoading(false);
    }
  }, [d, currentFiles, onChange, onBlur, isPdfOnly]);

  const handlePickPress = useCallback(() => {
    if (d._disabled) return;

    if (d._fileSource !== 'all') {
      openPicker(d._fileSource === 'gallery' ? 'gallery' : d._fileSource === 'camera' ? 'camera' : 'documents');
      return;
    }

    const isImages = isImageOnly;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: isImages
            ? ['Cancel', 'Take photo', 'Choose from library']
            : ['Cancel', 'Choose from library', 'Browse files'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) openPicker(isImages ? 'camera' : 'gallery');
          if (buttonIndex === 2) openPicker(isImages ? 'gallery' : 'documents');
        },
      );
    } else {
      // Android: simple Alert
      Alert.alert(
        'Select file',
        undefined,
        isImages
          ? [
              { text: 'Camera',  onPress: () => openPicker('camera')    },
              { text: 'Gallery', onPress: () => openPicker('gallery')   },
              { text: 'Cancel',  style: 'cancel' },
            ]
          : [
              { text: 'Files',   onPress: () => openPicker('documents') },
              { text: 'Gallery', onPress: () => openPicker('gallery')   },
              { text: 'Cancel',  style: 'cancel' },
            ],
      );
    }
  }, [d, isImageOnly, openPicker]);

  const removeFile = (index: number) => {
    if (d._fileMultiple) {
      const next = currentFiles.filter((_, i) => i !== index);
      onChange(next.length ? next : null);
    } else {
      onChange(null);
    }
  };

  const hasError = Boolean(error);

  return (
    <View style={s.wrap}>
      <Text style={s.label}>
        {d._label}
        {d._required && <Text style={s.required}> *</Text>}
      </Text>

      {/* Upload button */}
      <TouchableOpacity
        style={[s.uploadBtn, hasError && s.uploadBtnError, d._disabled && s.uploadBtnDisabled]}
        onPress={handlePickPress}
        disabled={d._disabled || loading}
        activeOpacity={0.7}
      >
        <Text style={s.uploadIcon}>
          {loading ? '⟳' : isImageOnly ? '📷' : isPdfOnly ? '📄' : '📁'}
        </Text>
        <View style={{ flex: 1 }}>
          <Text style={s.uploadTitle}>
            {loading ? 'Processing…' :
             currentFiles.length > 0 ? 'Add more files' : 'Choose file'}
          </Text>
          {d._fileAccept.length > 0 && (
            <Text style={s.uploadSub}>
              {d._fileAccept.map(t => t.split('/')[1] ?? t).join(', ').toUpperCase()}
              {d._fileMaxSize ? ` · Max ${formatBytes(d._fileMaxSize)}` : ''}
            </Text>
          )}
        </View>
        <Text style={s.uploadArrow}>›</Text>
      </TouchableOpacity>

      {/* Files list */}
      {currentFiles.length > 0 && (
        <View style={s.fileList}>
          {currentFiles.map((file, i) => (
            <View key={file.uri + i} style={s.fileItem}>
              {/* Preview */}
              {d._filePreview && file.type.startsWith('image/') ? (
                <Image
                  source={{ uri: file.uri }}
                  style={[s.preview, { height: d._filePreviewHeight }]}
                  resizeMode="cover"
                />
              ) : (
                <View style={s.fileIcon}>
                  <Text style={s.fileIconText}>{getFileIcon(file.type)}</Text>
                </View>
              )}
              {/* Info */}
              <View style={s.fileInfo}>
                <Text style={s.fileName} numberOfLines={1}>{file.name}</Text>
                <Text style={s.fileMeta}>
                  {formatBytes(file.size)}
                  {file.width ? ` · ${file.width}×${file.height}` : ''}
                </Text>
              </View>
              {/* Remove */}
              <TouchableOpacity onPress={() => removeFile(i)} style={s.removeBtn}>
                <Text style={s.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Max files indicator */}
      {d._fileMultiple && (
        <Text style={s.counter}>
          {currentFiles.length} / {d._fileMaxFiles} files
        </Text>
      )}

      {error && <Text style={s.error} accessibilityRole="alert">{error}</Text>}
      {!error && d._hint && <Text style={s.hint}>{d._hint}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  wrap:              { marginBottom: 16 },
  label:             { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  required:          { color: '#ef4444' },
  uploadBtn:         { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderWidth: 1.5, borderColor: '#d1d5db', borderStyle: 'dashed', borderRadius: 12, backgroundColor: '#fafafa' },
  uploadBtnError:    { borderColor: '#ef4444' },
  uploadBtnDisabled: { opacity: 0.5 },
  uploadIcon:        { fontSize: 24 },
  uploadTitle:       { fontSize: 14, fontWeight: '600', color: '#374151' },
  uploadSub:         { fontSize: 11.5, color: '#9ca3af', marginTop: 1 },
  uploadArrow:       { fontSize: 22, color: '#9ca3af' },
  fileList:          { marginTop: 10, gap: 8 },
  fileItem:          { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, backgroundColor: '#f9fafb', borderRadius: 9, borderWidth: 1, borderColor: '#e5e7eb' },
  preview:           { width: 56, borderRadius: 8, flexShrink: 0 },
  fileIcon:          { width: 44, height: 44, borderRadius: 8, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  fileIconText:      { fontSize: 22 },
  fileInfo:          { flex: 1 },
  fileName:          { fontSize: 13, fontWeight: '600', color: '#111' },
  fileMeta:          { fontSize: 11.5, color: '#9ca3af', marginTop: 1 },
  removeBtn:         { padding: 6 },
  removeBtnText:     { color: '#9ca3af', fontSize: 16 },
  counter:           { fontSize: 11.5, color: '#9ca3af', marginTop: 6 },
  error:             { fontSize: 12, color: '#ef4444', marginTop: 5 },
  hint:              { fontSize: 12, color: '#9ca3af', marginTop: 5 },
});

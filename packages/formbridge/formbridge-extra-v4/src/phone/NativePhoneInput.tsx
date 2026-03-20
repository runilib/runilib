import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Modal, FlatList, StyleSheet, TextInput as RNTextInput,
  SafeAreaView, Platform,
} from 'react-native';
import { COUNTRIES_SORTED, getCountry, searchCountries, buildPhoneValue } from './countries';
import type { PhoneDescriptor } from './PhoneField';
import type { PhoneValue } from './countries';
import { applyMask, extractRaw } from '../mask/masks';

interface Props {
  descriptor: PhoneDescriptor;
  value:      PhoneValue | null;
  error:      string | null;
  onChange:   (v: PhoneValue) => void;
  onBlur:     () => void;
}

export function NativePhoneInput({ descriptor: d, value, error, onChange, onBlur }: Props) {
  const defaultCountry  = getCountry(d._phoneDefaultCountry) ?? COUNTRIES_SORTED[0];
  const currentCountry  = (value?.country ? getCountry(value.country) : null) ?? defaultCountry;
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search,     setSearch]     = useState('');

  const preferred = useMemo(() =>
    d._phonePreferred.map(c => getCountry(c)).filter(Boolean) as typeof COUNTRIES_SORTED,
  [d._phonePreferred]);

  const filteredCountries = useMemo(() => {
    if (!search) return COUNTRIES_SORTED;
    return searchCountries(search);
  }, [search]);

  const displayValue = useMemo(() => {
    if (!value?.national) return '';
    const result = applyMask(extractRaw(value.national, currentCountry.mask), currentCountry.mask);
    return result.display;
  }, [value, currentCountry]);

  const handleNationalChange = useCallback((text: string) => {
    const result = applyMask(extractRaw(text, currentCountry.mask), currentCountry.mask);
    onChange(buildPhoneValue(currentCountry, result.display));
  }, [currentCountry, onChange]);

  const selectCountry = useCallback((country: typeof COUNTRIES_SORTED[0]) => {
    const existing = value?.national ?? '';
    onChange(buildPhoneValue(country, existing));
    setPickerOpen(false);
    setSearch('');
  }, [value, onChange]);

  const hasError = Boolean(error);

  return (
    <View style={s.wrap}>
      <Text style={s.label}>
        {d._label}
        {d._required && <Text style={s.required}> *</Text>}
      </Text>

      <View style={[s.row, hasError && s.rowError, d._disabled && s.rowDisabled]}>
        {/* Country button */}
        <TouchableOpacity
          style={s.countryBtn}
          onPress={() => !d._disabled && setPickerOpen(true)}
          disabled={d._disabled}
        >
          {d._phoneShowFlag && (
            <Text style={s.flag}>{currentCountry.flag}</Text>
          )}
          {d._phoneShowDialCode && (
            <Text style={s.dialCode}>+{currentCountry.dial}</Text>
          )}
          <Text style={s.chevron}>▾</Text>
        </TouchableOpacity>

        <View style={s.divider} />

        {/* Phone number input */}
        <TextInput
          style={s.input}
          value={displayValue}
          placeholder={d._placeholder}
          placeholderTextColor="#9ca3af"
          keyboardType="phone-pad"
          onChangeText={handleNationalChange}
          onBlur={onBlur}
          editable={!d._disabled}
          autoComplete="tel"
          textContentType="telephoneNumber"
        />
      </View>

      {error && <Text style={s.error} accessibilityRole="alert">{error}</Text>}
      {!error && d._hint && <Text style={s.hint}>{d._hint}</Text>}
      {value?.e164 && <Text style={s.e164}>{value.e164}</Text>}

      {/* Country picker modal */}
      <Modal
        visible={pickerOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPickerOpen(false)}
      >
        <SafeAreaView style={s.modal}>
          {/* Header */}
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Select country</Text>
            <TouchableOpacity onPress={() => setPickerOpen(false)} style={s.modalClose}>
              <Text style={s.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          {d._phoneSearchable && (
            <View style={s.searchWrap}>
              <TextInput
                style={s.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Search country…"
                placeholderTextColor="#9ca3af"
                autoFocus
                clearButtonMode="while-editing"
              />
            </View>
          )}

          {/* Preferred countries (only when no search) */}
          {!search && preferred.length > 0 && (
            <>
              <Text style={s.sectionLabel}>SUGGESTED</Text>
              {preferred.map(c => (
                <TouchableOpacity
                  key={c.code}
                  style={[s.countryRow, c.code === currentCountry.code && s.countryRowSelected]}
                  onPress={() => selectCountry(c)}
                >
                  {d._phoneShowFlag && <Text style={s.rowFlag}>{c.flag}</Text>}
                  <Text style={s.rowName}>{c.name}</Text>
                  <Text style={s.rowDial}>+{c.dial}</Text>
                  {c.code === currentCountry.code && <Text style={s.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
              <View style={s.separator} />
              <Text style={s.sectionLabel}>ALL COUNTRIES</Text>
            </>
          )}

          {/* Full list */}
          <FlatList
            data={filteredCountries}
            keyExtractor={item => item.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item: c }) => (
              <TouchableOpacity
                style={[s.countryRow, c.code === currentCountry.code && s.countryRowSelected]}
                onPress={() => selectCountry(c)}
              >
                {d._phoneShowFlag && <Text style={s.rowFlag}>{c.flag}</Text>}
                <Text style={s.rowName}>{c.name}</Text>
                <Text style={s.rowDial}>+{c.dial}</Text>
                {c.code === currentCountry.code && <Text style={s.checkmark}>✓</Text>}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={s.noResults}>No country found for "{search}"</Text>
            }
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:               { marginBottom: 16 },
  label:              { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  required:           { color: '#ef4444' },
  row:                { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 9, backgroundColor: '#fff', overflow: 'hidden' },
  rowError:           { borderColor: '#ef4444' },
  rowDisabled:        { backgroundColor: '#f9fafb', opacity: 0.7 },
  countryBtn:         { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 11, minWidth: 80 },
  flag:               { fontSize: 20 },
  dialCode:           { fontSize: 13, fontWeight: '600', color: '#374151' },
  chevron:            { fontSize: 10, color: '#9ca3af' },
  divider:            { width: 1, height: 24, backgroundColor: '#e5e7eb' },
  input:              { flex: 1, paddingHorizontal: 13, paddingVertical: 11, fontSize: 14, color: '#111', fontVariant: ['tabular-nums'] },
  error:              { fontSize: 12, color: '#ef4444', marginTop: 5 },
  hint:               { fontSize: 12, color: '#9ca3af', marginTop: 5 },
  e164:               { fontSize: 11, color: '#9ca3af', marginTop: 3, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  modal:              { flex: 1, backgroundColor: '#fff' },
  modalHeader:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  modalTitle:         { fontSize: 17, fontWeight: '700', color: '#111' },
  modalClose:         { padding: 4 },
  modalCloseText:     { fontSize: 18, color: '#9ca3af' },
  searchWrap:         { padding: 12, paddingBottom: 6 },
  searchInput:        { backgroundColor: '#f3f4f6', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#111' },
  sectionLabel:       { fontSize: 11, fontWeight: '700', color: '#9ca3af', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4, letterSpacing: 0.6 },
  separator:          { height: 1, backgroundColor: '#f3f4f6', marginVertical: 8 },
  countryRow:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 12 },
  countryRowSelected: { backgroundColor: '#eff6ff' },
  rowFlag:            { fontSize: 22 },
  rowName:            { flex: 1, fontSize: 15, color: '#111' },
  rowDial:            { fontSize: 13, color: '#9ca3af', fontVariant: ['tabular-nums'] },
  checkmark:          { fontSize: 16, color: '#6366f1', fontWeight: '700' },
  noResults:          { textAlign: 'center', padding: 32, color: '#9ca3af', fontSize: 14 },
});

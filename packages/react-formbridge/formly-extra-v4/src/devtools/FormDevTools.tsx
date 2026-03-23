/**
 * formura — DevTools
 * ──────────────────────
 * A floating dev panel that shows live form state.
 * Automatically removed from production builds.
 *
 * Web:    fixed floating div, draggable, portal
 * Native: floating View + Modal
 */

import React, { useState, useRef, useCallback, type CSSProperties } from 'react';
import type { FormState } from '../types';

export type DevToolsPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left';

export interface FormDevToolsProps {
  /** The form instance (spread the return of useForm here) */
  form:          { state: FormState<any>; getValues?: () => Record<string, unknown> };
  /** Panel position */
  position?:     DevToolsPosition;
  /** Show panel open by default */
  defaultOpen?:  boolean;
  /** Label shown in the panel header */
  title?:        string;
  /** Custom accent color */
  accentColor?:  string;
}

// ─── Web DevTools ─────────────────────────────────────────────────────────────

export function FormDevTools({
  form,
  position    = 'bottom-right',
  defaultOpen = false,
  title       = 'formura',
  accentColor = '#6366f1',
}: FormDevToolsProps) {
  // Tree-shaken in production
  if (process.env.NODE_ENV === 'production') return null;

  return typeof window !== 'undefined'
    ? <WebDevTools form={form} position={position} defaultOpen={defaultOpen} title={title} accentColor={accentColor} />
    : <NativeDevTools form={form} defaultOpen={defaultOpen} title={title} accentColor={accentColor} />;
}

// ─── Web implementation ───────────────────────────────────────────────────────

function WebDevTools({ form, position, defaultOpen, title, accentColor }: FormDevToolsProps) {
  const [open,    setOpen]    = useState(defaultOpen ?? false);
  const [tab,     setTab]     = useState<'values' | 'errors' | 'dirty' | 'touched'>('values');
  const [dragging, setDragging] = useState(false);
  const [pos,     setPos]     = useState<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const { state } = form;
  const values  = state.values  as Record<string, unknown>;
  const errors  = state.errors  as Record<string, string>;
  const dirty   = state.dirty   as Record<string, boolean>;
  const touched = state.touched as Record<string, boolean>;

  const errorCount = Object.values(errors).filter(Boolean).length;
  const dirtyCount = Object.values(dirty).filter(Boolean).length;

  // Position styles
  const posStyle: CSSProperties = pos
    ? { position: 'fixed', left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' }
    : {
        position: 'fixed',
        bottom: position?.includes('bottom') ? 16 : 'auto',
        top:    position?.includes('top')    ? 16 : 'auto',
        right:  position?.includes('right')  ? 16 : 'auto',
        left:   position?.includes('left')   ? 16 : 'auto',
      };

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragOffset.current = { x: e.clientX - (pos?.x ?? 0), y: e.clientY - (pos?.y ?? 0) };
    setDragging(true);
    const onMove = (ev: MouseEvent) => setPos({ x: ev.clientX - dragOffset.current.x, y: ev.clientY - dragOffset.current.y });
    const onUp   = () => { setDragging(false); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [pos]);

  const STATUS_COLOR: Record<string, string> = {
    idle:       '#22c55e',
    validating: '#f59e0b',
    submitting: '#6366f1',
    success:    '#22c55e',
    error:      '#ef4444',
  };

  return (
    <div style={{ ...posStyle, zIndex: 99999, fontFamily: 'monospace', fontSize: 12 }}>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display:       'flex', alignItems: 'center', gap: 6,
          padding:       '6px 12px',
          background:    accentColor,
          color:         '#fff',
          border:        'none',
          borderRadius:  open ? '8px 8px 0 0' : 8,
          cursor:        'pointer',
          fontSize:      11,
          fontWeight:    700,
          fontFamily:    'monospace',
          letterSpacing: '0.05em',
        }}
      >
        ⚡ {title}
        {errorCount > 0 && (
          <span style={{ background: '#ef4444', borderRadius: 4, padding: '1px 5px', fontSize: 10 }}>
            {errorCount} err
          </span>
        )}
        <span style={{ opacity: 0.8 }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          background:   '#1a1a2e',
          border:       `2px solid ${accentColor}`,
          borderRadius: '0 8px 8px 8px',
          width:        340,
          maxHeight:    480,
          overflow:     'hidden',
          display:      'flex',
          flexDirection:'column',
          boxShadow:    '0 8px 40px rgba(0,0,0,0.5)',
        }}>
          {/* Draggable header */}
          <div
            onMouseDown={onMouseDown}
            style={{
              background:  '#12122a',
              padding:     '8px 12px',
              cursor:      'grab',
              display:     'flex',
              alignItems:  'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              userSelect:  'none',
            }}
          >
            <div style={{ display: 'flex', gap: 16 }}>
              {/* Status */}
              <span>
                <span style={{ color: '#6b7280' }}>status </span>
                <span style={{ color: STATUS_COLOR[state.status] ?? '#fff', fontWeight: 700 }}>
                  {state.status}
                </span>
              </span>
              <span>
                <span style={{ color: '#6b7280' }}>valid </span>
                <span style={{ color: state.isValid ? '#22c55e' : '#ef4444' }}>
                  {state.isValid ? 'true' : 'false'}
                </span>
              </span>
              <span>
                <span style={{ color: '#6b7280' }}>submits </span>
                <span style={{ color: '#f0a500' }}>{state.submitCount}</span>
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {(['values', 'errors', 'dirty', 'touched'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex:         1,
                  padding:      '6px 0',
                  background:   tab === t ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color:        tab === t ? accentColor : '#6b7280',
                  border:       'none',
                  cursor:       'pointer',
                  fontSize:     11,
                  fontFamily:   'monospace',
                  fontWeight:   tab === t ? 700 : 400,
                  borderBottom: tab === t ? `2px solid ${accentColor}` : '2px solid transparent',
                }}
              >
                {t}
                {t === 'errors' && errorCount > 0 && (
                  <span style={{ marginLeft: 4, color: '#ef4444' }}>({errorCount})</span>
                )}
                {t === 'dirty' && dirtyCount > 0 && (
                  <span style={{ marginLeft: 4, color: '#f59e0b' }}>({dirtyCount})</span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ overflowY: 'auto', padding: '10px 12px', flex: 1 }}>
            {tab === 'values' && renderKV(values, accentColor!)}
            {tab === 'errors' && renderKV(
              Object.fromEntries(Object.entries(errors).filter(([, v]) => Boolean(v))),
              '#ef4444',
              'No errors ✓',
            )}
            {tab === 'dirty' && renderKV(
              Object.fromEntries(Object.entries(dirty).filter(([, v]) => v === true)),
              '#f59e0b',
              'No dirty fields',
            )}
            {tab === 'touched' && renderKV(
              Object.fromEntries(Object.entries(touched).filter(([, v]) => v === true)),
              '#22c55e',
              'No touched fields',
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding:      '5px 12px',
            borderTop:    '1px solid rgba(255,255,255,0.06)',
            fontSize:     10,
            color:        '#4b5563',
            display:      'flex',
            justifyContent: 'space-between',
          }}>
            <span>formura devtools</span>
            <span>isDirty: {String(state.isDirty)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function renderKV(obj: Record<string, unknown>, color: string, emptyMsg = 'Empty') {
  const entries = Object.entries(obj);
  if (entries.length === 0) {
    return <p style={{ color: '#4b5563', padding: '4px 0' }}>{emptyMsg}</p>;
  }
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        {entries.map(([k, v]) => (
          <tr key={k} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <td style={{ padding: '3px 8px 3px 0', color: color, fontWeight: 600, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{k}</td>
            <td style={{ padding: '3px 0', color: '#e5e7eb', wordBreak: 'break-all' }}>
              {JSON.stringify(v)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Native implementation ────────────────────────────────────────────────────

function NativeDevTools({ form, defaultOpen, title, accentColor }: Omit<FormDevToolsProps, 'position'>) {
  if (process.env.NODE_ENV === 'production') return null;

  const [open, setOpen] = useState(defaultOpen ?? false);
  const [tab,  setTab]  = useState<'values' | 'errors'>('values');

  try {
    const {
      View, Text, TouchableOpacity, Modal, ScrollView,
      SafeAreaView, StyleSheet,
    } = require('react-native');

    const { state } = form;
    const values = state.values as Record<string, unknown>;
    const errors = state.errors as Record<string, string>;
    const errorCount = Object.values(errors).filter(Boolean).length;

    return (
      <>
        {/* Floating trigger */}
        <View style={ns.trigger}>
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={[ns.triggerBtn, { backgroundColor: accentColor }]}
          >
            <Text style={ns.triggerText}>⚡ {title}</Text>
            {errorCount > 0 && (
              <View style={ns.badge}><Text style={ns.badgeText}>{errorCount}</Text></View>
            )}
          </TouchableOpacity>
        </View>

        <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView style={ns.modal}>
            <View style={[ns.header, { borderBottomColor: accentColor }]}>
              <Text style={[ns.headerTitle, { color: accentColor }]}>⚡ {title}</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={ns.close}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Status bar */}
            <View style={ns.statusBar}>
              <Text style={ns.statusItem}>status: <Text style={{ color: '#f0a500' }}>{state.status}</Text></Text>
              <Text style={ns.statusItem}>valid: <Text style={{ color: state.isValid ? '#22c55e' : '#ef4444' }}>{String(state.isValid)}</Text></Text>
              <Text style={ns.statusItem}>submits: <Text style={{ color: '#f0a500' }}>{state.submitCount}</Text></Text>
            </View>

            {/* Tabs */}
            <View style={ns.tabs}>
              {(['values', 'errors'] as const).map(t => (
                <TouchableOpacity key={t} style={[ns.tabBtn, tab === t && { borderBottomColor: accentColor }]} onPress={() => setTab(t)}>
                  <Text style={[ns.tabText, { color: tab === t ? accentColor : '#6b7280' }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView style={ns.content}>
              {Object.entries(tab === 'values' ? values : errors).map(([k, v]) => (
                <View key={k} style={ns.row}>
                  <Text style={[ns.key, { color: accentColor }]}>{k}</Text>
                  <Text style={ns.val}>{JSON.stringify(v)}</Text>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </>
    );
  } catch { return null; }
}

const ns = (() => {
  try {
    const { StyleSheet } = require('react-native');
    return StyleSheet.create({
      trigger:     { position: 'absolute', bottom: 90, right: 16, zIndex: 9999 },
      triggerBtn:  { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
      triggerText: { color: '#fff', fontWeight: '700', fontSize: 12 },
      badge:       { backgroundColor: '#ef4444', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1 },
      badgeText:   { color: '#fff', fontSize: 10, fontWeight: '700' },
      modal:       { flex: 1, backgroundColor: '#1a1a2e' },
      header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 2 },
      headerTitle: { fontSize: 16, fontWeight: '700', fontFamily: 'monospace' },
      close:       { color: '#6b7280', fontSize: 20 },
      statusBar:   { flexDirection: 'row', gap: 16, padding: 10, backgroundColor: '#12122a' },
      statusItem:  { fontSize: 11, color: '#6b7280', fontFamily: 'monospace' },
      tabs:        { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
      tabBtn:      { flex: 1, alignItems: 'center', padding: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
      tabText:     { fontSize: 12, fontFamily: 'monospace', fontWeight: '600' },
      content:     { flex: 1, padding: 12 },
      row:         { flexDirection: 'row', gap: 8, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
      key:         { fontSize: 11, fontWeight: '700', fontFamily: 'monospace', minWidth: 90 },
      val:         { flex: 1, fontSize: 11, color: '#e5e7eb', fontFamily: 'monospace' },
    });
  } catch { return {} as any; }
})();

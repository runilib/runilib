/**
 * Example — React Native
 * ──────────────────────
 * Full onboarding tour on a mobile dashboard screen.
 *
 * Install:
 *   npm install @runilib/react-walkit react-native-svg
 *   # Expo:
 *   npx expo install react-native-svg
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useWalkit, WalkitProvider, WalkitStep } from '@runilib/react-walkit';

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
      />
      <WalkitProvider
        animationType="bounce"
        spotlightPadding={10}
        spotlightBorderRadius={14}
        theme={{
          primaryButtonColor: '#6366f1',
          background: '#ffffff',
          titleColor: '#1e1e2e',
          subTitleColor: '#6b7280',
          border: '#e5e7eb',
        }}
        labels={{ next: 'Next →', prev: '← Back', finish: 'Got it! 🎉' }}
        onStart={() => console.log('Tour started!')}
        onStop={() => console.log('Tour ended!')}
        onStepChange={(step, i) => console.log(`Step ${i + 1}: ${step.id}`)}
      >
        <Dashboard />
      </WalkitProvider>
    </SafeAreaView>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const { start } = useWalkit();
  const [selectedAnim, setSelectedAnim] = useState('bounce');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <WalkitStep
        id="header"
        order={1}
        title="Welcome to MyApp 👋"
        content="Your personal dashboard — all key metrics in one place."
        placement="bottom"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>MyApp</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>Pro</Text>
          </View>
        </View>
      </WalkitStep>

      {/* Search */}
      <WalkitStep
        id="search"
        order={2}
        title="🔍 Search"
        content="Quickly find any content, user, or report in the app."
        placement="bottom"
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Search anything…"
          placeholderTextColor="#9ca3af"
        />
      </WalkitStep>

      {/* Stats */}
      <WalkitStep
        id="stats"
        order={3}
        title="📊 Your Stats"
        content="Monitor daily KPIs at a glance. Refreshed every hour."
        placement="bottom"
      >
        <View style={styles.statsRow}>
          <StatCard
            label="Users"
            value="12,430"
            trend="+8%"
          />
          <StatCard
            label="Revenue"
            value="$41.2K"
            trend="+12%"
          />
          <StatCard
            label="Tasks"
            value="94"
            trend="-3%"
            negative
          />
        </View>
      </WalkitStep>

      {/* Actions row */}
      <View style={styles.actionsRow}>
        <WalkitStep
          id="export"
          order={4}
          title="📥 Export"
          content="Download your data as CSV or PDF."
          placement="top"
        >
          <TouchableOpacity style={styles.btnSecondary}>
            <Text style={styles.btnSecondaryText}>Export</Text>
          </TouchableOpacity>
        </WalkitStep>

        <WalkitStep
          id="new-report"
          order={5}
          title="✨ New Report"
          content="Create a custom report from scratch."
          placement="top"
        >
          <TouchableOpacity style={styles.btnPrimary}>
            <Text style={styles.btnPrimaryText}>+ New Report</Text>
          </TouchableOpacity>
        </WalkitStep>
      </View>

      {/* Animation picker */}
      <Text style={styles.sectionLabel}>Animation style:</Text>
      <View style={styles.animRow}>
        {['fade', 'slide', 'zoom', 'bounce', 'flip', 'glow'].map((a) => (
          <TouchableOpacity
            key={a}
            onPress={() => setSelectedAnim(a)}
            style={[styles.animChip, selectedAnim === a && styles.animChipActive]}
          >
            <Text
              style={[
                styles.animChipText,
                selectedAnim === a && styles.animChipTextActive,
              ]}
            >
              {a}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Start button */}
      <TouchableOpacity
        style={styles.tourBtn}
        onPress={() => start()}
        activeOpacity={0.85}
      >
        <Text style={styles.tourBtnText}>🚀 Start Tour</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  trend,
  negative = false,
}: {
  label: string;
  value: string;
  trend: string;
  negative?: boolean;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={[styles.cardTrend, { color: negative ? '#ef4444' : '#10b981' }]}>
        {trend}
      </Text>
    </View>
  );
}

// ─── App with custom react-walkit ──────────────────────────────────────────────────

export function AppWithCustomTooltip() {
  const renderPopover = ({
    step,
    stepIndex,
    totalSteps,
    onNext,
    onPrev,
    onStop,
  }: any) => (
    <View>
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}
      >
        <Text style={{ fontWeight: '700', fontSize: 14, color: '#1e1e2e', flex: 1 }}>
          {step.title}
        </Text>
        <TouchableOpacity onPress={onStop}>
          <Text style={{ color: '#9ca3af' }}>✕</Text>
        </TouchableOpacity>
      </View>
      {step.text && (
        <Text style={{ color: '#6b7280', fontSize: 13, marginBottom: 12 }}>
          {step.text}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 12, color: '#9ca3af' }}>
          {stepIndex + 1} / {totalSteps}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {stepIndex > 0 && (
            <TouchableOpacity
              onPress={onPrev}
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 6,
                paddingVertical: 4,
                paddingHorizontal: 10,
              }}
            >
              <Text style={{ fontSize: 12, color: '#374151' }}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onNext}
            style={{
              backgroundColor: '#6366f1',
              borderRadius: 6,
              paddingVertical: 4,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ fontSize: 12, color: '#fff' }}>
              {stepIndex === totalSteps - 1 ? 'Done ✓' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <WalkitProvider renderPopover={renderPopover}>
      <Dashboard />
    </WalkitProvider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1e1e2e', flex: 1 },
  headerBadge: {
    backgroundColor: '#ede9fe',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  headerBadgeText: { color: '#6366f1', fontSize: 12, fontWeight: '600' },
  searchInput: {
    padding: 12,
    fontSize: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: '#1e1e2e',
    marginBottom: 20,
  },
  statsRow: { flexDirection: 'row', gap: 10 },
  card: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardValue: { fontSize: 18, fontWeight: '700', color: '#1e1e2e' },
  cardLabel: { fontSize: 11, color: '#9ca3af', marginTop: 2, marginBottom: 4 },
  cardTrend: { fontSize: 11, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  btnSecondary: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  btnSecondaryText: { color: '#374151', fontWeight: '500', fontSize: 14 },
  sectionLabel: {
    marginTop: 28,
    marginBottom: 10,
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  animRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  animChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  animChipActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  animChipText: { fontSize: 12, color: '#374151' },
  animChipTextActive: { color: '#fff' },
  tourBtn: {
    marginTop: 28,
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  tourBtnText: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 0.3 },
});

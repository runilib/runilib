import React, { useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Switch,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { WalkStep, type WalkStepProps, useWalk } from '@runilib/react-walkit';

const PROFILE_STEPS: {[key in string]: WalkStepProps} = {
  AVATAR:   { id: 'profile-avatar',   order: 1, title: 'Your profile',        text: 'Tap your avatar to update your photo and personal info.' },
  STATS:    { id: 'profile-stats',    order: 2, title: '🏆 Your achievements', text: 'Track your productivity streak, tasks completed and team ranking.' },
  SETTINGS: { id: 'profile-settings', order: 3, title: '⚙️ Preferences',       text: 'Customise notifications, theme, and sync settings from here.' },
  LIBS:     { id: 'profile-libs',     order: 4, title: '📦 Powered by',        text: 'This app is built with runilib libraries — the same code runs on web and native.' },
};

export default function ProfileScreen() {
  const { start, isRunning } = useWalk();
  const tourStarted = useRef(false);

  useEffect(() => {
    if (!tourStarted.current) {
      tourStarted.current = true;
      const t = setTimeout(() => start('profile-avatar'), 600);
      return () => clearTimeout(t);
    }
  }, [start]);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={s.tourBtn}
            onPress={() => start('profile-avatar')}
            disabled={isRunning}
          >
            <Text style={s.tourBtnText}>{isRunning ? '▶…' : '▶ Tour'}</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar card */}
        <WalkStep {...PROFILE_STEPS.AVATAR}>
          <View style={s.avatarCard}>
            <View style={s.avatarCircle}>
              <Text style={s.avatarInitials}>AK</Text>
            </View>
            <View style={s.avatarInfo}>
              <Text style={s.avatarName}>AKS</Text>
              <Text style={s.avatarRole}>Senior Frontend Engineer</Text>
              <Text style={s.avatarEmail}>aks@unikit.dev</Text>
            </View>
            <TouchableOpacity style={s.editBtn}>
              <Text style={s.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </WalkStep>

        {/* Stats */}
        <WalkStep {...PROFILE_STEPS.STATS}>
          <View style={s.statsRow}>
            {[
              { v: '14', l: 'Day streak', icon: '🔥' },
              { v: '127', l: 'Tasks done', icon: '✅' },
              { v: '#2', l: 'Team rank', icon: '🏆' },
            ].map(item => (
              <View key={item.l} style={s.statItem}>
                <Text style={s.statIcon}>{item.icon}</Text>
                <Text style={s.statVal}>{item.v}</Text>
                <Text style={s.statLabel}>{item.l}</Text>
              </View>
            ))}
          </View>
        </WalkStep>

        {/* Settings */}
        <WalkStep {...PROFILE_STEPS.SETTINGS}>
          <View style={s.section}>
            <Text style={s.sectionTitle}>Preferences</Text>
            {[
              { label: 'Push notifications', sub: 'Task reminders & mentions', on: true  },
              { label: 'Daily digest',        sub: 'Morning summary email',     on: false },
              { label: 'Dark mode',           sub: 'Auto follows system',       on: false },
              { label: 'iCloud sync',         sub: 'Sync across devices',       on: true  },
            ].map((item, i) => (
              <View key={item.label} style={[s.settingRow, i < 3 && s.settingBorder]}>
                <View style={s.settingLeft}>
                  <Text style={s.settingLabel}>{item.label}</Text>
                  <Text style={s.settingSub}>{item.sub}</Text>
                </View>
                <Switch
                  value={item.on}
                  trackColor={{ true: '#e8a020' }}
                  onValueChange={() => Haptics.selectionAsync()}
                />
              </View>
            ))}
          </View>
        </WalkStep>

        {/* Powered by runilib */}
        <WalkStep {...PROFILE_STEPS.LIBS}>
          <View style={s.libsCard}>
            <Text style={s.libsTitle}>⚡ Powered by runilib</Text>
            <Text style={s.libsSub}>Libraries used in this app</Text>
            <View style={s.libsList}>
              {[
                { name: '@runilib/react-walkit', desc: 'Onboarding tours', status: 'active' },
                { name: 'formura', desc: 'Form state', status: 'soon' },
                { name: 'toastly', desc: 'Notifications', status: 'soon' },
              ].map(lib => (
                <View key={lib.name} style={s.libRow}>
                  <View>
                    <Text style={s.libName}>{lib.name}</Text>
                    <Text style={s.libDesc}>{lib.desc}</Text>
                  </View>
                  <View style={[s.libBadge, lib.status === 'soon' && s.libBadgeSoon]}>
                    <Text style={[s.libBadgeText, lib.status === 'soon' && s.libBadgeTextSoon]}>
                      {lib.status === 'active' ? 'v1.0.0' : 'soon'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </WalkStep>

        {/* Sign out */}
        <TouchableOpacity style={s.signOutBtn} onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)}>
          <Text style={s.signOutText}>Sign out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: '#f9f5ee' },
  content:          { paddingHorizontal: 20, paddingTop: 12 },
  header:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerTitle:      { fontSize: 26, fontWeight: '700', color: '#1a1108', letterSpacing: -0.5 },
  tourBtn:          { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ede8e0', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  tourBtnText:      { fontSize: 12, fontWeight: '600', color: '#e8a020' },

  avatarCard:       { backgroundColor: '#fff', borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  avatarCircle:     { width: 60, height: 60, borderRadius: 30, backgroundColor: '#e8a020', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarInitials:   { fontSize: 22, fontWeight: '700', color: '#fff' },
  avatarInfo:       { flex: 1 },
  avatarName:       { fontSize: 17, fontWeight: '700', color: '#1a1108' },
  avatarRole:       { fontSize: 12.5, color: '#7a6e5e', marginTop: 2 },
  avatarEmail:      { fontSize: 12, color: '#b0a090', marginTop: 2 },
  editBtn:          { backgroundColor: '#f5f0e8', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 },
  editBtnText:      { fontSize: 13, fontWeight: '600', color: '#e8a020' },

  statsRow:         { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statItem:         { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', gap: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  statIcon:         { fontSize: 20 },
  statVal:          { fontSize: 22, fontWeight: '700', color: '#1a1108', letterSpacing: -0.5 },
  statLabel:        { fontSize: 11, color: '#7a6e5e' },

  section:          { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  sectionTitle:     { fontSize: 15, fontWeight: '700', color: '#1a1108', marginBottom: 14 },
  settingRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  settingBorder:    { borderBottomWidth: 1, borderBottomColor: '#f0ebe0' },
  settingLeft:      { flex: 1 },
  settingLabel:     { fontSize: 14, fontWeight: '500', color: '#1a1108' },
  settingSub:       { fontSize: 12, color: '#9a8e80', marginTop: 2 },

  libsCard:         { backgroundColor: '#1a1108', borderRadius: 18, padding: 18, marginBottom: 14 },
  libsTitle:        { fontSize: 15, fontWeight: '700', color: '#f5efe0', marginBottom: 3 },
  libsSub:          { fontSize: 12, color: '#7a6e5e', marginBottom: 14 },
  libsList:         { gap: 10 },
  libRow:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  libName:          { fontSize: 14, fontWeight: '600', color: '#f5efe0', fontVariant: ['tabular-nums'] },
  libDesc:          { fontSize: 11.5, color: '#7a6e5e', marginTop: 1 },
  libBadge:         { backgroundColor: 'rgba(232,160,32,0.15)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: 'rgba(232,160,32,0.3)' },
  libBadgeSoon:     { backgroundColor: 'rgba(120,110,90,0.15)', borderColor: 'rgba(120,110,90,0.2)' },
  libBadgeText:     { fontSize: 11, fontWeight: '600', color: '#e8a020' },
  libBadgeTextSoon: { color: '#7a6e5e' },

  signOutBtn:       { alignItems: 'center', paddingVertical: 14, marginTop: 4 },
  signOutText:      { fontSize: 14, fontWeight: '600', color: '#e05a3a' },
});

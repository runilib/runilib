import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Pressable, Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { CopilotStep, useCopilot } from 'stepwise';
import { STEPS } from '../tourConfig';

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = 'High' | 'Medium' | 'Low';
type Status   = 'active' | 'done';

interface Task {
  id:       number;
  title:    string;
  priority: Priority;
  due:      string;
  status:   Status;
  project:  string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_TASKS: Task[] = [
  { id: 1, title: 'Set up stepwise in mobile app', priority: 'High',   due: 'Today',     status: 'active', project: 'Mobile App' },
  { id: 2, title: 'Write unit tests for useForm',  priority: 'High',   due: 'Tomorrow',  status: 'active', project: 'formbridge' },
  { id: 3, title: 'Design token audit',            priority: 'Medium', due: 'Mar 22',    status: 'active', project: 'Design System' },
  { id: 4, title: 'Deploy v1.0 of stepwise',       priority: 'High',   due: 'Done',      status: 'done',   project: 'Mobile App' },
  { id: 5, title: 'Add dark mode support',         priority: 'Low',    due: 'Mar 28',    status: 'active', project: 'Design System' },
  { id: 6, title: 'Migrate auth endpoints',        priority: 'High',   due: 'Mar 25',    status: 'active', project: 'API' },
];

const PRIORITY_COLOR: Record<Priority, string> = {
  High:   '#e05a3a',
  Medium: '#e8a020',
  Low:    '#5bbf7a',
};

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [tasks,      setTasks]      = useState<Task[]>(INITIAL_TASKS);
  const [filter,     setFilter]     = useState<'all' | 'active' | 'done'>('all');
  const [activeTab,  setActiveTab]  = useState(0);
  const { start, isRunning }        = useCopilot();
  const tourStarted                 = useRef(false);

  // Auto-start tour on mount
  useEffect(() => {
    if (!tourStarted.current) {
      tourStarted.current = true;
      const t = setTimeout(() => start(), 900);
      return () => clearTimeout(t);
    }
  }, [start]);

  const toggleTask = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'active' : 'done' } : t));
  };

  const deleteTask = (id: number) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filtered = tasks.filter(t => filter === 'all' ? true : t.status === filter);
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const pct = Math.round((doneCount / tasks.length) * 100);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <CopilotStep {...STEPS.GREETING} placement="bottom">
          <View style={s.header}>
            <View>
              <Text style={s.greeting}>Good morning, AKS 👋</Text>
              <Text style={s.subGreeting}>You have {filtered.filter(t=>t.status==='active').length} active tasks</Text>
            </View>
            <TouchableOpacity
              style={s.restartBtn}
              onPress={() => start()}
              disabled={isRunning}
            >
              <Text style={s.restartBtnText}>{isRunning ? '▶…' : '▶ Tour'}</Text>
            </TouchableOpacity>
          </View>
        </CopilotStep>

        {/* ── Stats card ── */}
        <CopilotStep {...STEPS.STATS_CARD} placement="bottom">
          <View style={s.statsCard}>
            <View style={s.statsLeft}>
              <Text style={s.statsPercent}>{pct}%</Text>
              <Text style={s.statsLabel}>Completed today</Text>
              <View style={s.progressBar}>
                <View style={[s.progressFill, { width: `${pct}%` as any }]} />
              </View>
            </View>
            <View style={s.statsDivider} />
            <View style={s.statsRight}>
              {[
                { n: doneCount,                          l: 'Done',   c: '#5bbf7a' },
                { n: tasks.filter(t=>t.priority==='High' && t.status==='active').length, l: 'Urgent', c: '#e05a3a' },
                { n: tasks.length,                       l: 'Total',  c: '#e8a020' },
              ].map(item => (
                <View key={item.l} style={s.miniStat}>
                  <Text style={[s.miniStatVal, { color: item.c }]}>{item.n}</Text>
                  <Text style={s.miniStatLabel}>{item.l}</Text>
                </View>
              ))}
            </View>
          </View>
        </CopilotStep>

        {/* ── Filter bar ── */}
        <CopilotStep {...STEPS.FILTER_BAR} placement="bottom">
          <View style={s.filterRow}>
            {(['all', 'active', 'done'] as const).map(f => (
              <TouchableOpacity
                key={f}
                style={[s.filterBtn, filter === f && s.filterBtnActive]}
                onPress={() => { Haptics.selectionAsync(); setFilter(f); }}
              >
                <Text style={[s.filterBtnText, filter === f && s.filterBtnTextActive]}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </CopilotStep>

        {/* ── Section header + add button ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Tasks</Text>
          <CopilotStep {...STEPS.ADD_TASK} placement="left">
            <TouchableOpacity style={s.addBtn} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}>
              <Text style={s.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          </CopilotStep>
        </View>

        {/* ── Task list ── */}
        <View style={s.taskList}>
          {filtered.map((task, idx) => (
            <CopilotStep
              key={task.id}
              {...STEPS.TASK_ITEM}
              active={idx === 0}
              placement="bottom"
            >
              <TaskCard
                task={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
              />
            </CopilotStep>
          ))}
          {filtered.length === 0 && (
            <View style={s.emptyState}>
              <Text style={s.emptyIcon}>🎉</Text>
              <Text style={s.emptyTitle}>All clear!</Text>
              <Text style={s.emptyText}>No {filter === 'done' ? 'completed' : 'active'} tasks.</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Bottom nav ── */}
      <CopilotStep {...STEPS.BOTTOM_NAV} placement="top">
        <View style={s.bottomNav}>
          {[
            { icon: '⊞', label: 'Dashboard', idx: 0 },
            { icon: '◻', label: 'Tasks',     idx: 1 },
            { icon: '◷', label: 'Calendar',  idx: 2 },
            { icon: '◯', label: 'Profile',   idx: 3 },
          ].map(tab => (
            <TouchableOpacity
              key={tab.idx}
              style={s.tabItem}
              onPress={() => { Haptics.selectionAsync(); setActiveTab(tab.idx); }}
            >
              <Text style={[s.tabIcon, activeTab === tab.idx && s.tabIconActive]}>{tab.icon}</Text>
              <Text style={[s.tabLabel, activeTab === tab.idx && s.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </CopilotStep>
    </SafeAreaView>
  );
}

// ─── TaskCard ─────────────────────────────────────────────────────────────────

function TaskCard({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
  return (
    <View style={[s.taskCard, task.status === 'done' && s.taskCardDone]}>
      <TouchableOpacity style={s.taskCheck} onPress={onToggle}>
        <View style={[s.checkCircle, task.status === 'done' && s.checkCircleDone]}>
          {task.status === 'done' && <Text style={s.checkMark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <View style={s.taskBody}>
        <Text style={[s.taskTitle, task.status === 'done' && s.taskTitleDone]} numberOfLines={2}>
          {task.title}
        </Text>
        <View style={s.taskMeta}>
          <View style={[s.priorityDot, { backgroundColor: PRIORITY_COLOR[task.priority] }]} />
          <Text style={s.metaText}>{task.priority}</Text>
          <Text style={s.metaSep}>·</Text>
          <Text style={s.metaText}>{task.project}</Text>
          {task.due !== 'Done' && (
            <>
              <Text style={s.metaSep}>·</Text>
              <Text style={[s.metaText, task.due === 'Today' && s.metaToday]}>
                {task.due === 'Today' ? '🔥 Today' : `📅 ${task.due}`}
              </Text>
            </>
          )}
        </View>
      </View>

      <TouchableOpacity style={s.deleteBtn} onPress={onDelete}>
        <Text style={s.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const AMBER = '#e8a020';

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#f9f5ee' },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 12 },

  // Header
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  greeting:        { fontSize: 22, fontWeight: '700', color: '#1a1108', letterSpacing: -0.5 },
  subGreeting:     { fontSize: 13, color: '#7a6e5e', marginTop: 2 },
  restartBtn:      { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ede8e0', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  restartBtnText:  { fontSize: 12, fontWeight: '600', color: AMBER },

  // Stats card
  statsCard:       { backgroundColor: '#fff', borderRadius: 18, padding: 20, flexDirection: 'row', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  statsLeft:       { flex: 1 },
  statsPercent:    { fontSize: 40, fontWeight: '700', color: AMBER, letterSpacing: -1.5 },
  statsLabel:      { fontSize: 12, color: '#7a6e5e', marginBottom: 10 },
  progressBar:     { height: 6, backgroundColor: '#f0ebe0', borderRadius: 3, overflow: 'hidden' },
  progressFill:    { height: '100%', backgroundColor: AMBER, borderRadius: 3 },
  statsDivider:    { width: 1, backgroundColor: '#ede8e0', marginHorizontal: 16 },
  statsRight:      { justifyContent: 'space-around' },
  miniStat:        { alignItems: 'center' },
  miniStatVal:     { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  miniStatLabel:   { fontSize: 11, color: '#7a6e5e' },

  // Filters
  filterRow:       { flexDirection: 'row', gap: 8, marginBottom: 18 },
  filterBtn:       { flex: 1, paddingVertical: 9, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#ede8e0', alignItems: 'center' },
  filterBtnActive: { backgroundColor: AMBER, borderColor: AMBER },
  filterBtnText:   { fontSize: 13, fontWeight: '600', color: '#7a6e5e' },
  filterBtnTextActive: { color: '#fff' },

  // Section
  sectionHeader:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle:    { fontSize: 17, fontWeight: '700', color: '#1a1108', letterSpacing: -0.3 },
  addBtn:          { backgroundColor: AMBER, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7 },
  addBtnText:      { fontSize: 13, fontWeight: '700', color: '#fff' },

  // Task list
  taskList:        { gap: 8 },
  taskCard:        { backgroundColor: '#fff', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  taskCardDone:    { opacity: 0.6 },
  taskCheck:       { paddingTop: 1 },
  checkCircle:     { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#d8d0c4', alignItems: 'center', justifyContent: 'center' },
  checkCircleDone: { backgroundColor: '#5bbf7a', borderColor: '#5bbf7a' },
  checkMark:       { color: '#fff', fontSize: 12, fontWeight: '700' },
  taskBody:        { flex: 1 },
  taskTitle:       { fontSize: 14, fontWeight: '600', color: '#1a1108', marginBottom: 5, lineHeight: 20 },
  taskTitleDone:   { textDecorationLine: 'line-through', color: '#9a8e80' },
  taskMeta:        { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 5 },
  priorityDot:     { width: 7, height: 7, borderRadius: 4 },
  metaText:        { fontSize: 11.5, color: '#7a6e5e' },
  metaSep:         { fontSize: 11.5, color: '#c8c0b4' },
  metaToday:       { color: '#e05a3a', fontWeight: '600' },
  deleteBtn:       { padding: 4 },
  deleteText:      { color: '#c8c0b4', fontSize: 13 },

  // Empty state
  emptyState:      { alignItems: 'center', paddingVertical: 48 },
  emptyIcon:       { fontSize: 40, marginBottom: 12 },
  emptyTitle:      { fontSize: 17, fontWeight: '700', color: '#1a1108', marginBottom: 6 },
  emptyText:       { fontSize: 14, color: '#7a6e5e' },

  // Bottom nav
  bottomNav:       { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ede8e0', paddingBottom: Platform.OS === 'ios' ? 20 : 8, paddingTop: 10 },
  tabItem:         { flex: 1, alignItems: 'center', gap: 3 },
  tabIcon:         { fontSize: 20, color: '#c8c0b4' },
  tabIconActive:   { color: AMBER },
  tabLabel:        { fontSize: 10.5, color: '#c8c0b4', fontWeight: '500' },
  tabLabelActive:  { color: AMBER, fontWeight: '700' },
});

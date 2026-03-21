import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, SafeAreaView, Modal,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { TooltipStep, useTooltip } from '@runilib/tooltip';
import type { AnimationType } from '@runilib/tooltip';

// Showcase different animation types on this screen
const ANIMATION: AnimationType = 'slide';

const TASK_STEPS = {
  SEARCH:   { name: 'tasks-search',   order: 1, title: '🔍 Smart search',      text: 'Search by title, project or tag. Results update as you type.' },
  SORT:     { name: 'tasks-sort',     order: 2, title: '⇅ Sort & group',        text: 'Sort by priority, due date, or project. Tap to cycle through options.' },
  ADD_FORM: { name: 'tasks-add-form', order: 3, title: '✍️ Quick add',           text: 'Type a task title here and hit Enter. Priority and due date are optional.' },
  LIST:     { name: 'tasks-list',     order: 4, title: '📋 Full task list',      text: 'All your tasks across projects. Tap any card to open its details.' },
};

type SortKey = 'priority' | 'due' | 'project';

const PRIORITY_RANK: Record<string, number> = { High: 0, Medium: 1, Low: 2 };

const ALL_TASKS = [
  { id: 1,  title: 'Integrate @runilib/tooltip in mobile',  priority: 'High',   due: 'Today',    project: 'Mobile App',    done: false },
  { id: 2,  title: 'Write formura docs',          priority: 'Medium', due: 'Tomorrow', project: 'formura',    done: false },
  { id: 3,  title: 'Design token audit',             priority: 'Medium', due: 'Mar 22',   project: 'Design System', done: false },
  { id: 4,  title: 'Deploy @runilib/tooltip v1.0',           priority: 'High',   due: 'Done',     project: 'Mobile App',    done: true  },
  { id: 5,  title: 'Setup CI/CD pipeline',           priority: 'High',   due: 'Mar 24',   project: 'Infrastructure',done: false },
  { id: 6,  title: 'Migrate auth to JWT',            priority: 'High',   due: 'Mar 25',   project: 'API',           done: false },
  { id: 7,  title: 'Update color tokens',            priority: 'Low',    due: 'Mar 28',   project: 'Design System', done: false },
  { id: 8,  title: 'Code review — PR #42',           priority: 'Medium', due: 'Today',    project: 'Mobile App',    done: false },
];

export default function TasksScreen() {
  const [query,   setQuery]   = useState('');
  const [sortBy,  setSortBy]  = useState<SortKey>('priority');
  const [newTask, setNewTask] = useState('');
  const [tasks,   setTasks]   = useState(ALL_TASKS);
  const { start, isRunning }  = useTooltip();
  const tourStarted           = useRef(false);

  useEffect(() => {
    if (!tourStarted.current) {
      tourStarted.current = true;
      const t = setTimeout(() => start('tasks-search'), 600);
      return () => clearTimeout(t);
    }
  }, [start]);

  const sortLabels: Record<SortKey, string> = { priority: 'Priority', due: 'Due date', project: 'Project' };
  const cycleSortBy = () => {
    Haptics.selectionAsync();
    const keys: SortKey[] = ['priority', 'due', 'project'];
    setSortBy(prev => keys[(keys.indexOf(prev) + 1) % keys.length]);
  };

  const filteredAndSorted = tasks
    .filter(t => !query || t.title.toLowerCase().includes(query.toLowerCase()) || t.project.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'priority') return (PRIORITY_RANK[a.priority] ?? 3) - (PRIORITY_RANK[b.priority] ?? 3);
      if (sortBy === 'due')      return a.due.localeCompare(b.due);
      return a.project.localeCompare(b.project);
    });

  const addTask = () => {
    if (!newTask.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTasks(prev => [...prev, { id: Date.now(), title: newTask.trim(), priority: 'Medium', due: 'No date', project: 'Inbox', done: false }]);
    setNewTask('');
  };

  const toggleDone = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const PCOLOR: Record<string, string> = { High: '#e05a3a', Medium: '#e8a020', Low: '#5bbf7a' };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.topBar}>
        <Text style={s.title}>All Tasks</Text>
        <TouchableOpacity style={s.tourBtn} onPress={() => start('tasks-search')} disabled={isRunning}>
          <Text style={s.tourBtnText}>{isRunning ? '▶…' : '▶ Tour'}</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <TooltipStep {...TASK_STEPS.SEARCH}>
        <View style={s.searchWrap}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Search tasks…"
            placeholderTextColor="#b0a090"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={s.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </TooltipStep>

      {/* Sort + count */}
      <View style={s.toolbar}>
        <Text style={s.taskCount}>{filteredAndSorted.length} tasks</Text>
        <TooltipStep {...TASK_STEPS.SORT}>
          <TouchableOpacity style={s.sortBtn} onPress={cycleSortBy}>
            <Text style={s.sortIcon}>⇅</Text>
            <Text style={s.sortLabel}>{sortLabels[sortBy]}</Text>
          </TouchableOpacity>
        </TooltipStep>
      </View>

      {/* Quick add */}
      <TooltipStep {...TASK_STEPS.ADD_FORM} >
        <View style={s.addRow}>
          <TextInput
            style={s.addInput}
            placeholder="Add a task and press Enter…"
            placeholderTextColor="#b0a090"
            value={newTask}
            onChangeText={setNewTask}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />
          <TouchableOpacity style={s.addBtn} onPress={addTask}>
            <Text style={s.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </TooltipStep>

      {/* Task list */}
      <TooltipStep {...TASK_STEPS.LIST}>
        <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
          {filteredAndSorted.map(task => (
            <TouchableOpacity
              key={task.id}
              style={[s.taskRow, task.done && s.taskRowDone]}
              onPress={() => toggleDone(task.id)}
              activeOpacity={0.75}
            >
              <View style={[s.check, task.done && s.checkDone]}>
                {task.done && <Text style={s.checkMark}>✓</Text>}
              </View>
              <View style={s.taskBody}>
                <Text style={[s.taskTitle, task.done && s.taskTitleDone]} numberOfLines={1}>{task.title}</Text>
                <View style={s.taskMeta}>
                  <View style={[s.dot, { backgroundColor: PCOLOR[task.priority] }]} />
                  <Text style={s.metaText}>{task.project}</Text>
                  {task.due !== 'Done' && (
                    <Text style={[s.metaText, task.due === 'Today' && s.metaToday]}>· {task.due}</Text>
                  )}
                </View>
              </View>
              <View style={[s.priorityTag, { borderColor: PCOLOR[task.priority] + '40', backgroundColor: PCOLOR[task.priority] + '18' }]}>
                <Text style={[s.priorityTagText, { color: PCOLOR[task.priority] }]}>{task.priority}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {filteredAndSorted.length === 0 && (
            <View style={s.empty}>
              <Text style={s.emptyIcon}>🔍</Text>
              <Text style={s.emptyText}>No tasks match "{query}"</Text>
            </View>
          )}
          <View style={{ height: 120 }} />
        </ScrollView>
      </TooltipStep>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: '#f9f5ee' },
  topBar:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  title:            { fontSize: 26, fontWeight: '700', color: '#1a1108', letterSpacing: -0.5 },
  tourBtn:          { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ede8e0', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  tourBtnText:      { fontSize: 12, fontWeight: '600', color: '#e8a020' },
  searchWrap:       { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, marginTop: 12, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8, borderWidth: 1, borderColor: '#ede8e0' },
  searchIcon:       { fontSize: 16 },
  searchInput:      { flex: 1, fontSize: 14, color: '#1a1108' },
  clearIcon:        { fontSize: 13, color: '#b0a090', padding: 2 },
  toolbar:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 12, marginBottom: 8 },
  taskCount:        { fontSize: 13, color: '#7a6e5e', fontWeight: '500' },
  sortBtn:          { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#ede8e0' },
  sortIcon:         { fontSize: 13, color: '#7a6e5e' },
  sortLabel:        { fontSize: 12.5, fontWeight: '600', color: '#7a6e5e' },
  addRow:           { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 12, gap: 8 },
  addInput:         { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: '#1a1108', borderWidth: 1, borderColor: '#ede8e0' },
  addBtn:           { width: 44, height: 44, backgroundColor: '#e8a020', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  addBtnText:       { fontSize: 22, color: '#fff', fontWeight: '300', lineHeight: 28 },
  list:             { flex: 1, paddingHorizontal: 20 },
  taskRow:          { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 12, padding: 13, marginBottom: 7, borderWidth: 1, borderColor: '#ede8e0' },
  taskRowDone:      { opacity: 0.5 },
  check:            { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#d8d0c4', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  checkDone:        { backgroundColor: '#5bbf7a', borderColor: '#5bbf7a' },
  checkMark:        { color: '#fff', fontSize: 11, fontWeight: '700' },
  taskBody:         { flex: 1 },
  taskTitle:        { fontSize: 14, fontWeight: '500', color: '#1a1108', marginBottom: 3 },
  taskTitleDone:    { textDecorationLine: 'line-through', color: '#9a8e80' },
  taskMeta:         { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot:              { width: 7, height: 7, borderRadius: 4 },
  metaText:         { fontSize: 11.5, color: '#7a6e5e' },
  metaToday:        { color: '#e05a3a', fontWeight: '600' },
  priorityTag:      { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, borderWidth: 1 },
  priorityTagText:  { fontSize: 11, fontWeight: '600' },
  empty:            { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyIcon:        { fontSize: 36 },
  emptyText:        { fontSize: 14, color: '#7a6e5e' },
});

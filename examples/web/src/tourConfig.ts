import type { TooltipTheme, TooltipLabels } from '@runilib/tooltip';

export const TOUR_THEME: TooltipTheme = {
  primary:      '#f0a500',
  primaryText:  '#0f0e0b',
  background:   '#1c1a15',
  text:         '#f5efe0',
  subtext:      '#8a7f6a',
  border:       'rgba(255,240,200,0.1)',
  shadow:       '0 24px 64px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)',
  borderRadius: '14px',
};

export const TOUR_LABELS: TooltipLabels = {
  next:   'Next →',
  prev:   '← Back',
  finish: 'Let\'s go! 🚀',
  close:  '✕',
};

/**
 * All tour steps defined centrally.
 * Each key matches the `name` prop on <TooltipStep>.
 */
export const STEPS = {
  HEADER:       { name: 'header',       order: 1, title: 'Welcome to Taskflow 👋',     text: 'Your personal productivity command center. Let us show you around.' },
  NEW_TASK:     { name: 'new-task',     order: 2, title: '➕ Create a task',            text: 'Click here to add a new task. You can set priority, due date, and assignees.' },
  FILTERS:      { name: 'filters',      order: 3, title: '🔍 Filter & search',          text: 'Filter tasks by status, priority or assignee. Find what you need instantly.' },
  STATS:        { name: 'stats',        order: 4, title: '📊 Your progress',            text: 'Track completed tasks, deadlines and team velocity at a glance.' },
  TASK_CARD:    { name: 'task-card',    order: 5, title: '✅ Task cards',               text: 'Each card shows priority, due date, and progress. Click to expand details.' },
  SIDEBAR:      { name: 'sidebar',      order: 6, title: '🗂️ Projects',                text: 'Switch between projects here. All your work is organized by project.' },
  NOTIFICATIONS:{ name: 'notifs',       order: 7, title: '🔔 Notifications',           text: 'Stay on top of mentions, deadlines and team updates.' },
} as const;

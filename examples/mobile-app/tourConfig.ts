import type { WalkStepProps } from '@runilib/react-walkit';

export const TOUR_THEME = {
  primary:      '#e8a020',
  primaryText:  '#1a1108',
  background:   '#ffffff',
  text:         '#1a1108',
  subtext:      '#7a6e5e',
  border:       '#ede8e0',
  shadow:       '0 20px 60px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1)',
  borderRadius: '16px',
};

export const TOUR_LABELS = {
  next:   'Next →',
  prev:   '← Back',
  finish: 'Let\'s go! 🚀',
  close:  '✕',
};

export const STEPS: {[key in string]: WalkStepProps} = {
  GREETING:   { id: 'greeting',   order: 1, title: 'Welcome to Taskflow 👋',   text: 'Your portable productivity hub. We\'ll show you the key features.' },
  ADD_TASK:   { id: 'add-task',   order: 2, title: '➕ Add tasks fast',         text: 'Tap here to create a task in seconds — with priority and due date.' },
  FILTER_BAR: { id: 'filter-bar', order: 3, title: '🔍 Quick filters',          text: 'Switch between All, Active, and Done with a single tap.' },
  TASK_ITEM:  { id: 'task-item',  order: 4, title: '✅ Task actions',           text: 'Swipe left to delete. Tap the circle to complete. Long press to edit.' },
  STATS_CARD: { id: 'stats-card', order: 5, title: '📊 Progress at a glance',  text: 'See your completion rate and streak right here.' },
  BOTTOM_NAV: { id: 'bottom-nav', order: 6, title: '🗂️ Navigate sections',     text: 'Jump between Dashboard, Tasks, Calendar and Profile from here.' },
} as const;

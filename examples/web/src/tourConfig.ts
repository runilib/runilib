import type { WalkitStepProps } from '@runilib/react-walkit';

export const TOUR_THEME = {
  primaryButtonColor: '#f0a500',
  primaryButtonTextColor: '#0f0e0b',
  background: '#1c1a15',
  titleColor: '#f5efe0',
  subTitleColor: '#8a7f6a',
  border: 'rgba(255,240,200,0.1)',
  borderRadius: '5px',
};

export const TOUR_LABELS = {
  next: 'Next →',
  prev: '← Back',
  finish: "Let's go! 🚀",
  close: '✕',
};

/**
 * All tour steps defined centrally.
 * Each key matches the `name` prop on <WalkitStep>.
 */
export const STEPS: { [key in string]: WalkitStepProps } = {
  HEADER: {
    id: 'header',
    sequence: 1,
    route: '/',
    title: 'Welcome to Taskflow 👋',
    content: 'Your personal productivity command center. Let us show you around.',
    // autoStart: {
    //   mode: 'once',
    //   delay: 600,
    // },
  },
  NEW_TASK: {
    id: 'new-task',
    sequence: 2,
    route: '/',
    title: '➕ Create a task',
    content:
      'Click here to add a new task. You can set priority, due date, and assignees.',
  },
  FILTERS: {
    id: 'filters',
    sequence: 3,
    route: '/',
    title: '🔍 Filter & search',
    content:
      'Filter tasks by status, priority or assignee. Find what you need instantly.',
  },
  STATS: {
    id: 'stats',
    sequence: 4,
    route: '/',
    title: '📊 Your progress',
    content: 'Track completed tasks, deadlines and team velocity at a glance.',
  },
  TASK_CARD: {
    id: 'task-card',
    sequence: 5,
    route: '/',
    title: '✅ Task cards',
    content: 'Each card shows priority, due date, and progress. Click to expand details.',
  },
  SIDEBAR: {
    id: 'sidebar',
    sequence: 6,
    route: '/',
    title: '🗂️ Projects',
    content: 'Switch between projects here. All your work is organized by project.',
  },
  NOTIFICATIONS: {
    id: 'notifs',
    sequence: 7,
    route: '/',
    title: '🔔 Notifications',
    content: 'Stay on top of mentions, deadlines and team updates.',
  },
} as const;

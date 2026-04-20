import type { WalkitFlowStep, WalkitStepProps } from '@runilib/react-walkit';

export const TOUR_THEME = {
  primary:      '#e8a020',
  primaryText:  '#1a1108',
  background:   '#ffffff',
  text:         '#1a1108',
  subtext:      '#7a6e5e',
  border:       '#ede8e0',
  shadow:       '0 20px 60px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1)',
};

export const TOUR_LABELS = {
  next:   'Next →',
  prev:   '← Back',
  finish: 'Let\'s go!',
  close:  '✕',
};

export const HOME_STEPS: { [key in string]: WalkitStepProps } = {
  GREETING: {
    id: 'greeting',
    sequence: 1,
    route: '/walkit',
    title: 'Welcome to Taskflow 👋',
    content: "Your portable productivity hub. We'll show you the key features.",
  },
  ADD_TASK: {
    id: 'add-task',
    sequence: 2,
    route: '/walkit',
    title: '➕ Add tasks fast',
    content: 'Tap here to create a task in seconds - with priority and due date.',
  },
  FILTER_BAR: {
    id: 'filter-bar',
    sequence: 3,
    route: '/walkit',
    title: '🔍 Quick filters',
    content: 'Switch between All, Active, and Done with a single tap.',
  },
  TASK_ITEM: {
    id: 'task-item',
    sequence: 4,
    route: '/walkit',
    title: '✅ Task actions',
    content: 'Swipe left to delete. Tap the circle to complete. Long press to edit.',
  },
  STATS_CARD: {
    id: 'stats-card',
    sequence: 5,
    route: '/walkit',
    title: '📊 Progress at a glance',
    content: 'See your completion rate and streak right here.',
  },
  BOTTOM_NAV: {
    id: 'bottom-nav',
    sequence: 6,
    route: '/walkit',
    title: '🗂️ Navigate sections',
    content: 'Jump between Dashboard, Tasks, Calendar and Profile from here.',
  },
} as const;

export const PROFILE_STEPS: { [key in string]: WalkitStepProps } = {
  AVATAR: {
    id: 'profile-avatar',
    sequence: 7,
    route: '/walkit/profile',
    title: 'Your profile',
    content: 'Tap your avatar to update your photo and personal info.',
  },
  STATS: {
    id: 'profile-stats',
    sequence: 8,
    route: '/walkit/profile',
    title: '🏆 Your achievements',
    content: 'Track your productivity streak, tasks completed and team ranking.',
  },
  SETTINGS: {
    id: 'profile-settings',
    sequence: 9,
    route: '/walkit/profile',
    title: '⚙️ Preferences',
    content: 'Customise notifications, theme, and sync settings from here.',
  },
  LIBS: {
    id: 'profile-libs',
    sequence: 10,
    route: '/walkit/profile',
    title: '📦 Powered by',
    content:
      'This app is built with runilib libraries - the same code runs on web and native.',
  },
} as const;

export const APP_TOUR_STEPS: WalkitFlowStep[] = [
  HOME_STEPS.GREETING,
  HOME_STEPS.ADD_TASK,
  HOME_STEPS.FILTER_BAR,
  HOME_STEPS.BOTTOM_NAV,
  PROFILE_STEPS.AVATAR,
  PROFILE_STEPS.STATS,
  PROFILE_STEPS.SETTINGS,
  PROFILE_STEPS.LIBS,
];

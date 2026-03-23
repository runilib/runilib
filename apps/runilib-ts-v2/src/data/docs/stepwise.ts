import type { LibraryDoc } from '../../types'

export const stepwiseDocs: LibraryDoc = {
  libId: 'stepwise',
  sidebar: [
    {
      group: 'Getting started',
      items: [
        { id: 'sw-overview',    label: 'Overview' },
        { id: 'sw-install',     label: 'Installation' },
        { id: 'sw-quickstart',  label: 'Quick start' },
      ],
    },
    {
      group: 'Core API',
      color: 'amber',
      items: [
        { id: 'sw-provider',    label: 'CopilotProvider' },
        { id: 'sw-step',        label: 'CopilotStep' },
        { id: 'sw-hook',        label: 'useCopilot()' },
        { id: 'sw-animations',  label: 'Animations' },
      ],
    },
    {
      group: 'Advanced',
      color: 'amber',
      items: [
        { id: 'sw-multiscreen', label: 'Multi-screen tours' },
        { id: 'sw-persist',     label: 'Persistence' },
        { id: 'sw-conditional', label: 'Conditional steps' },
        { id: 'sw-analytics',   label: 'Analytics' },
        { id: 'sw-abtesting',   label: 'A/B Testing' },
      ],
    },
  ],
  sections: [
    {
      id: 'sw-overview',
      title: 'Overview',
      content: `stepwise is a cross-platform onboarding tour library for React and React Native.

Tag any element with CopilotStep, wrap your app with CopilotProvider, and call start().
The same code produces a native-feeling tour on both web and mobile.`,
      code: {
        filename: 'TourExample.tsx',
        lang: 'tsx',
        code: `import { CopilotProvider, CopilotStep, useCopilot } from 'stepwise'

// 1. Wrap your app
export function App() {
  return (
    <CopilotProvider
      animationType="spring"
      persist={{ key: 'main-tour-v1', storage: 'local' }}
    >
      <Dashboard />
    </CopilotProvider>
  )
}

// 2. Tag elements anywhere in your component tree
function Dashboard() {
  const { start } = useCopilot()

  return (
    <div>
      <CopilotStep name="search" order={1}
        title="Search anything"
        text="Find tasks, projects and teammates instantly.">
        <SearchBar />
      </CopilotStep>

      <CopilotStep name="new-task" order={2}
        title="Create a task"
        text="Press + to add a new task to your board.">
        <NewTaskButton />
      </CopilotStep>

      <button onClick={start}>
        Take the tour →
      </button>
    </div>
  )
}`,
      },
    },
    {
      id: 'sw-install',
      title: 'Installation',
      content: 'Install stepwise and optionally configure peer dependencies.',
      code: {
        filename: 'terminal',
        lang: 'bash',
        code: `# npm
npm install stepwise

# yarn
yarn add stepwise

# pnpm
pnpm add stepwise

# React Native peer deps (optional, for haptics)
npx expo install expo-haptics`,
      },
    },
    {
      id: 'sw-quickstart',
      title: 'Quick start',
      content: 'A complete tour with persistence, analytics, and conditional steps.',
      code: {
        filename: 'App.tsx',
        lang: 'tsx',
        code: `import { CopilotProvider } from 'stepwise'

export function App() {
  return (
    <CopilotProvider
      animationType="bounce"
      theme={{
        tooltipStyle: {
          borderRadius: 14,
          padding: '16px 20px',
        },
        backdropColor: 'rgba(0,0,0,0.7)',
      }}
      labels={{
        next:     'Next →',
        previous: '← Back',
        finish:   'Done! 🎉',
        skip:     'Skip tour',
      }}
      persist={{
        key:       'app-tour-v2',
        storage:   'local',
        ttl:       86400,
        resumable: true,
      }}
      onStart={() => analytics.track('tour_started')}
      onStop={(completed) => {
        analytics.track(completed ? 'tour_completed' : 'tour_skipped')
      }}
      onStepChange={(index, step) => {
        analytics.track('tour_step', { step: step.name, index })
      }}
    >
      <MainNavigator />
    </CopilotProvider>
  )
}`,
      },
    },
    {
      id: 'sw-provider',
      title: 'CopilotProvider',
      content: 'The root provider. Place it at the top of your app tree.',
      code: {
        filename: 'CopilotProvider.tsx',
        lang: 'tsx',
        code: `<CopilotProvider
  // Animation style
  animationType="spring"  // "fade" | "slide" | "zoom" | "bounce" | "flip" | "glow" | "spring"

  // Theme
  theme={{
    tooltipStyle:   { borderRadius: 12, backgroundColor: '#1a1a2e' },
    tooltipTextStyle: { color: '#edf2f7' },
    backdropColor:  'rgba(0,0,0,0.65)',
    primaryColor:   '#00e5c8',
    stepNumberStyle:{ display: 'none' },
  }}

  // Button labels
  labels={{ next: 'Next', previous: 'Back', finish: 'Done', skip: 'Skip' }}

  // Persistence
  persist={{ key: 'my-tour', storage: 'local', ttl: 3600, resumable: true }}

  // Navigation (for multi-screen tours)
  navigator={reactNavigationAdapter(navigation)}

  // Callbacks
  onStart={() => void}
  onStop={(completed: boolean) => void}
  onStepChange={(index: number, step: StepType) => void}
/>`,
      },
    },
    {
      id: 'sw-step',
      title: 'CopilotStep',
      content: 'Wrap any element to make it a tour step.',
      code: {
        filename: 'CopilotStep.tsx',
        lang: 'tsx',
        code: `<CopilotStep
  // Required
  name="settings-button"    // unique identifier
  order={3}                 // position in the tour

  // Content
  title="Settings"
  text="Customize your account preferences here."

  // Placement
  placement="bottom"        // "top" | "bottom" | "left" | "right" | "auto"
  placementOffset={{ x: 0, y: -8 }}

  // Conditional — skip if false
  active={isAdmin}          // hide for non-admins
  condition={(values) => values.setupComplete}

  // Screen (for multi-screen tours)
  screen="SettingsScreen"
>
  <SettingsButton />
</CopilotStep>

// Targetless step (centered modal)
<CopilotStep
  name="welcome"
  order={1}
  title="Welcome to the app! 👋"
  text="Let us show you around in 5 quick steps."
  // No children — renders as centered modal
/>`,
      },
    },
    {
      id: 'sw-hook',
      title: 'useCopilot()',
      content: 'Full programmatic control over the tour.',
      code: {
        filename: 'useCopilot.ts',
        lang: 'tsx',
        code: `const {
  // Control
  start,          // () => void — start from step 1
  stop,           // () => void — stop and close
  next,           // () => void — go to next step
  prev,           // () => void — go to previous step
  goTo,           // (name: string) => void — jump to a specific step

  // Extended API (v1.2+)
  pause,          // () => void — pause at current step
  resume,         // () => void — resume from paused
  waitForAction,  // (stepName: string) => Promise<void>
  highlight,      // (stepName: string) => void — spotlight without tooltip

  // State
  isRunning,      // boolean
  isPaused,       // boolean
  currentStep,    // StepType | null
  currentIndex,   // number
  totalSteps,     // number
  steps,          // StepType[] — all registered steps

  // Persistence
  status,         // 'not_started' | 'in_progress' | 'completed'
  markCompleted,  // () => void
  reset,          // () => void — clear persistence
} = useCopilot()

// Example: wait for user action then continue
async function handleInteractiveTour() {
  start()
  pause()
  await waitForAction('create-task')  // resolves when user taps the target
  resume()
}`,
      },
    },
    {
      id: 'sw-animations',
      title: 'Animations',
      content: '6 built-in animation types, configurable per-provider or per-step.',
      code: {
        filename: 'animations.tsx',
        lang: 'tsx',
        code: `// Global animation
<CopilotProvider animationType="spring">

// Per-step override (coming in v1.2)
<CopilotStep
  name="attention"
  animationType="glow"    // override for this step
  ...
>

// Available types:
// "fade"   — smooth opacity transition
// "slide"  — slides in from the side
// "zoom"   — scales from 0.85 to 1
// "bounce" — elastic spring bounce
// "flip"   — 3D flip effect
// "glow"   — pulsing glow effect
// "spring" — physics-based spring

// Disable animations
<CopilotProvider animationType={null}>

// Respect prefers-reduced-motion (automatic)`,
      },
    },
    {
      id: 'sw-analytics',
      title: 'Analytics',
      content: 'Track step engagement, drop-off rates, and completion metrics.',
      code: {
        filename: 'analytics.tsx',
        lang: 'tsx',
        code: `import { useCopilotEvent } from 'stepwise'

function AnalyticsLayer() {
  useCopilotEvent({
    onStepEnter: ({ step, index, totalSteps }) => {
      analytics.track('tour_step_view', {
        step:  step.name,
        index,
        total: totalSteps,
      })
    },

    onStepExit: ({ step, durationMs, skipped }) => {
      analytics.track('tour_step_exit', {
        step,
        duration: durationMs,
        skipped,
      })
    },

    onTourComplete: ({ totalDurationMs, stepCount }) => {
      analytics.track('tour_completed', {
        duration: totalDurationMs,
        steps:    stepCount,
      })
    },

    onTourAbandon: ({ lastStep, lastIndex, durationMs }) => {
      analytics.track('tour_abandoned', {
        lastStep: lastStep.name,
        at:       lastIndex,
        after:    durationMs,
      })
    },
  })

  return null
}`,
      },
    },
    {
      id: 'sw-abtesting',
      title: 'A/B Testing',
      content: 'Split users between tour variants and measure completion rates.',
      code: {
        filename: 'ab-testing.tsx',
        lang: 'tsx',
        code: `<CopilotProvider
  variants={[
    {
      id:     'control',
      weight: 50,
      steps:  CONTROL_TOUR_STEPS,
      theme:  { primaryColor: '#6366f1' },
    },
    {
      id:     'challenger',
      weight: 50,
      steps:  CHALLENGER_TOUR_STEPS,
      theme:  { primaryColor: '#00e5c8' },
    },
  ]}
  onVariantAssigned={(variantId, userId) => {
    analytics.identify(userId, { tourVariant: variantId })
  }}
>
  <App />
</CopilotProvider>

// Get A/B metrics
const { variants } = useCopilotMetrics()
// {
//   control:    { shown: 1200, completed: 480, rate: "40%" },
//   challenger: { shown: 1180, completed: 590, rate: "50%" },
// }`,
      },
    },
  ],
}

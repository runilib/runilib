import type { LibraryDoc } from "../../types";

export const reactWalkitDocs: LibraryDoc = {
  libId: "react-walkit",
  sidebar: [
    {
      group: "Getting started",
      items: [
        { id: "rw-overview", label: "Overview" },
        { id: "rw-install", label: "Installation" },
        { id: "rw-quickstart", label: "Quick start" },
      ],
    },
    {
      group: "Core API",
      color: "amber",
      items: [
        { id: "rw-provider", label: "WalkitProvider" },
        { id: "rw-step", label: "WalkitStep" },
        { id: "rw-hook", label: "useWalkit()" },
        { id: "rw-animations", label: "Animations" },
      ],
    },
    {
      group: "Advanced",
      color: "amber",
      items: [
        { id: "rw-multiscreen", label: "Multi-screen tours" },
        { id: "rw-persist", label: "Persistence" },
        { id: "rw-conditional", label: "Conditional steps" },
        { id: "rw-analytics", label: "Analytics" },
        { id: "rw-abtesting", label: "A/B Testing" },
      ],
    },
  ],
  sections: [
    {
      id: "rw-overview",
      title: "Overview",
      content: `react-walkit is a cross-platform onboarding tour library for React and React Native.

Tag any element with WalkitStep, wrap your app with WalkitProvider, and call start().
The same code produces a native-feeling tour on both web and mobile.`,
      code: {
        filename: "TourExample.tsx",
        lang: "tsx",
        code: `import { WalkitProvider, WalkitStep, useWalkit } from 'react-walkit'

// 1. Wrap your app
export function App() {
  return (
    <WalkitProvider
      animationType="spring"
      persist={{ key: 'main-tour-v1', storage: 'local' }}
    >
      <Dashboard />
    </WalkitProvider>
  )
}

// 2. Tag elements anywhere in your component tree
function Dashboard() {
  const { start } = useWalkit()

  return (
    <div>
      <WalkitStep name="search" order={1}
        title="Search anything"
        text="Find tasks, projects and teammates instantly.">
        <SearchBar />
      </WalkitStep>

      <WalkitStep name="new-task" order={2}
        title="Create a task"
        text="Press + to add a new task to your board.">
        <NewTaskButton />
      </WalkitStep>

      <button onClick={start}>
        Take the tour →
      </button>
    </div>
  )
}`,
      },
    },
    {
      id: "rw-install",
      title: "Installation",
      content: "Install react-walkit and optionally configure peer dependencies.",
      code: {
        filename: "terminal",
        lang: "bash",
        code: `# npm
npm install react-walkit

# yarn
yarn add react-walkit

# pnpm
pnpm add react-walkit

# React Native peer deps (optional, for haptics)
npx expo install expo-haptics`,
      },
    },
    {
      id: "rw-quickstart",
      title: "Quick start",
      content: "A complete tour with persistence, analytics, and conditional steps.",
      code: {
        filename: "App.tsx",
        lang: "tsx",
        code: `import { WalkitProvider } from 'react-walkit'

export function App() {
  return (
    <WalkitProvider
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
    </WalkitProvider>
  )
}`,
      },
    },
    {
      id: "rw-provider",
      title: "WalkitProvider",
      content: "The root provider. Place it at the top of your app tree.",
      code: {
        filename: "WalkitProvider.tsx",
        lang: "tsx",
        code: `<WalkitProvider
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
      id: "rw-step",
      title: "WalkitStep",
      content: "Wrap any element to make it a tour step.",
      code: {
        filename: "WalkitStep.tsx",
        lang: "tsx",
        code: `<WalkitStep
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
</WalkitStep>

// Targetless step (centered modal)
<WalkitStep
  name="welcome"
  order={1}
  title="Welcome to the app! 👋"
  text="Let us show you around in 5 quick steps."
  // No children — renders as centered modal
/>`,
      },
    },
    {
      id: "rw-hook",
      title: "useWalkit()",
      content: "Full programmatic control over the tour.",
      code: {
        filename: "useWalkit.ts",
        lang: "tsx",
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
} = useWalkit()

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
      id: "rw-animations",
      title: "Animations",
      content: "6 built-in animation types, configurable per-provider or per-step.",
      code: {
        filename: "animations.tsx",
        lang: "tsx",
        code: `// Global animation
<WalkitProvider animationType="spring">

// Per-step override (coming in v1.2)
<WalkitStep
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
<WalkitProvider animationType={null}>

// Respect prefers-reduced-motion (automatic)`,
      },
    },
    {
      id: "rw-analytics",
      title: "Analytics",
      content: "Track step engagement, drop-off rates, and completion metrics.",
      code: {
        filename: "analytics.tsx",
        lang: "tsx",
        code: `import { useWalkitEvent } from 'react-walkit'

function AnalyticsLayer() {
  useWalkitEvent({
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
      id: "rw-abtesting",
      title: "A/B Testing",
      content: "Split users between tour variants and measure completion rates.",
      code: {
        filename: "ab-testing.tsx",
        lang: "tsx",
        code: `<WalkitProvider
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
</WalkitProvider>

// Get A/B metrics
const { variants } = useWalkitMetrics()
// {
//   control:    { shown: 1200, completed: 480, rate: "40%" },
//   challenger: { shown: 1180, completed: 590, rate: "50%" },
// }`,
      },
    },
  ],
};

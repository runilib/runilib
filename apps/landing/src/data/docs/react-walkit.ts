import type { LibraryDoc } from '../../types';
import { landingPackageVersions } from '../packageVersions';

const DOC_PREVIEWS = {
  webBasic: {
    src: 'https://res.cloudinary.com/dca7plrqk/video/upload/v1775404915/web-walkit-onboarding-tour-examples_p2hogt.mov',
    alt: 'Desktop walkthrough preview with spotlight and default popover.',
    caption: 'Desktop preview of the built-in Walkit spotlight and default popover.',
    maxWidth: 720,
    maxHeight: 420,
    video: true,
  },
  nativeBasic: {
    src: 'https://res.cloudinary.com/dca7plrqk/video/upload/v1775404485/mobile-onboarding-tour-exemple_pxdui3.mov',
    alt: 'Mobile walkthrough preview with spotlight and default popover.',
    caption: 'Mobile preview of the same tour flow on React Native.',
    maxWidth: 340,
    maxHeight: 620,
    video: true,
  },
  tooltip: {
    src: 'https://res.cloudinary.com/dca7plrqk/video/upload/web-tooltip-example_q3ne1e.mp4',
    alt: 'Preview of the standalone Tooltip component.',
    caption: 'Standalone tooltip preview anchored to a single target element.',
    // maxWidth: 680,
    // maxHeight: 360,
    video: true,
  },
  tooltipNative: {
    src: 'https://res.cloudinary.com/dca7plrqk/video/upload/v1775404484/mobile-tooltip-exemple_wykp1s.mov',
    alt: 'Preview of the standalone Tooltip component on React Native.',
    caption: 'React Native tooltip preview using press interactions and custom content.',
    maxWidth: 340,
    maxHeight: 560,
    video: true,
  },
} as const;

export const reactWalkitDocs: LibraryDoc = {
  libId: 'react-walkit',
  versions: [landingPackageVersions.walkit],
  sidebar: [
    {
      group: 'Getting started',
      items: [
        { id: 'rw-overview', label: 'Overview' },
        { id: 'rw-install', label: 'Installation' },
        { id: 'rw-quickstart', label: 'Quick start' },
      ],
    },
    {
      group: 'Core API',
      color: 'amber',
      items: [
        { id: 'rw-provider', label: 'WalkitProvider' },
        { id: 'rw-step', label: 'WalkitStep' },
        { id: 'rw-tooltip', label: 'Tooltip component' },
        { id: 'rw-auto-start', label: 'Auto-start' },
        { id: 'rw-flow', label: 'Multiple pages flows' },
        { id: 'rw-hook', label: 'useWalkit()' },
        { id: 'rw-events', label: 'useWalkitEvent()' },
      ],
    },
    {
      group: 'Visuals & UX',
      color: 'amber',
      items: [
        { id: 'rw-animations', label: 'Animations' },
        { id: 'rw-theme', label: 'Theme & labels' },
        { id: 'rw-custom-popover', label: 'Custom popover' },
        { id: 'rw-spotlight', label: 'Spotlight & positioning' },
      ],
    },
    {
      group: 'Extras',
      color: 'amber',
      items: [{ id: 'rw-platform', label: 'Platform notes' }],
    },
  ],
  sections: [
    {
      id: 'rw-overview',
      title: 'Overview',
      content: `\`@runilib/react-walkit\` is a cross-platform onboarding + product tour library. One API works on React web and React Native.

- Tag any UI element with \`<WalkitStep id sequence />\` to register a step.
- Wrap the app (or a screen) in \`<WalkitProvider>\`; control the flow with \`useWalkit()\`.
- Built-in SVG (web) / react-native-svg (native) spotlight, animated popover, labels, theming, and programmatic control.
- Public surface: \`WalkitProvider\`, \`WalkitStep\`, \`useWalkit\`, \`useWalkitEvent\`, \`Tooltip\`, \`ANIMATION_TYPES\`.`,
      codeTabs: [
        {
          filename: 'TourExample.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.webBasic,
          code: `import { WalkitProvider, WalkitStep, useWalkit } from '@runilib/react-walkit'

export function App() {
  return (
    <WalkitProvider animationType="bounce">
      <Dashboard />
    </WalkitProvider>
  )
}

function Dashboard() {
  const { start } = useWalkit()

  return (
    <div>
      <WalkitStep
        id="hero"
        sequence={0}
        title="📊 Your progress"
        content="Track completed tasks, deadlines and team velocity at a glance."
      >
        <HeroCard />
      </WalkitStep>

      <WalkitStep
        id="cta"
        sequence={1}
        title="Create a project"
        content="Hit + to start a new project."
      >
        <CreateButton />
      </WalkitStep>

      <button onClick={() => start()}>Start tour</button>
    </div>
  )
}`,
        },
        {
          filename: 'QuickStart.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.nativeBasic,
          code: `import { SafeAreaView, Text, View, Button } from 'react-native'
import { WalkitProvider, WalkitStep, useWalkit } from '@runilib/react-walkit'

export function App() {
  return (
    <WalkitProvider animationType="bounce">
      <SafeAreaView style={{ flex: 1 }}>
        <Dashboard />
      </SafeAreaView>
    </WalkitProvider>
  )
}

function Dashboard() {
  const { start, next isRunning } = useWalkit()

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <WalkitStep id="hero" sequence={0} title="Welcome" content="Take a quick tour.">
        <Text style={{ fontSize: 22, fontWeight: '700' }}>Hello 👋</Text>
      </WalkitStep>

      <WalkitStep
        id="cta"
        sequence={1}
        title="Welcome to Taskflow 👋"
        content="Your portable productivity hub. We'll show you the key features."
      >
        <Button title="Next →" onPress={() => next()} />
      </WalkitStep>

      <Button
        title={isRunning ? 'Tour running…' : 'Start tour'}
        onPress={() => start()}
        disabled={isRunning}
      />
    </View>
  )
}`,
        },
      ],
    },
    {
      id: 'rw-install',
      title: 'Installation',
      content: `Install the scoped package; no additional provider is required beyond \`WalkitProvider\`.

- Web peers: \`react/react-dom\`.
- React Native peers: \`react-native\` and \`react-native-svg\`.`,
      code: {
        filename: 'terminal',
        lang: 'bash',
        code: `# npm
npm install @runilib/react-walkit

# yarn
yarn add @runilib/react-walkit

# pnpm
pnpm add @runilib/react-walkit`,
      },
      subsections: [
        {
          id: 'rw-install-entry',
          title: 'Entrypoints',
          content: `Use the same import on web and native; the bundler picks the right \`.web\` / \`.native\` build via the package exports map.`,
        },
      ],
    },
    {
      id: 'rw-quickstart',
      title: 'Quick start',
      content: `Wrap your app with \`WalkitProvider\`, register steps anywhere in the tree, and start the tour.

- Steps are sorted by \`sequence\`.
- \`start(stepId?)\` can jump directly to a specific step.
- The overlay closes when it reaches the last step or when you call \`stop()\`.`,
      codeTabs: [
        {
          filename: 'QuickStart.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.webBasic,
          code: `import { WalkitProvider, WalkitStep, useWalkit } from '@runilib/react-walkit'

export function App() {
  return (
    <WalkitProvider
      animationType="slide"
      overlayColor="rgba(15,15,25,0.72)"
      labels={{ next: 'Next', prev: 'Back', finish: 'Done', close: 'Close' }}
    >
      <Content />
    </WalkitProvider>
  )
}

function Content() {
  const { start } = useWalkit()

  return (
    <>
      <WalkitStep id="nav" sequence={0} title="Navigation" content="Everything starts here.">
        <SidebarNav />
      </WalkitStep>

      <WalkitStep id="filters" sequence={1} title="Filters" content="Narrow results quickly.">
        <Filters />
      </WalkitStep>

      <button onClick={() => start()}>Take the tour →</button>
    </>
  )
}`,
        },
        {
          filename: 'QuickStart.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.nativeBasic,
          code: `import { SafeAreaView, Text, View, Button } from 'react-native'
import { WalkitProvider, WalkitStep, useWalkit } from '@runilib/react-walkit'

export function App() {
  return (
    <WalkitProvider animationType="bounce">
      <SafeAreaView style={{ flex: 1 }}>
        <Dashboard />
      </SafeAreaView>
    </WalkitProvider>
  )
}

function Dashboard() {
  const { start, next isRunning } = useWalkit()

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <WalkitStep id="hero" sequence={0} title="Welcome" content="Take a quick tour.">
        <Text style={{ fontSize: 22, fontWeight: '700' }}>Hello 👋</Text>
      </WalkitStep>

      <WalkitStep
        id="cta"
        sequence={1}
        title="Welcome to Taskflow 👋"
        content="Your portable productivity hub. We'll show you the key features."
      >
        <Button title="Next →" onPress={() => next()} />
      </WalkitStep>

      <Button
        title={isRunning ? 'Tour running…' : 'Start tour'}
        onPress={() => start()}
        disabled={isRunning}
      />
    </View>
  )
}`,
        },
      ],
    },
    {
      id: 'rw-provider',
      title: 'WalkitProvider',
      content: `Owns the tour state, renders the overlay + popover, and exposes callbacks.

- Visual props: \`animationType\` (default 'slide'),\`overlayColor\` (default rgba(15,15,25,0.72)), \`spotlightPadding\` (default 8), \`spotlightBorderRadius\` (default 8), \`walkitStyle\`, \`theme\`, \`labels\` (next/prev/finish/close, fallback to built-ins).
- Behavior: \`stopOnOutsideClick\` (default false), \`renderPopover\` to define a global custom renderer for this provider subtree.
- Native note: on React Native Android, the built-in popover favors stability over motion and enters without a visible popover animation to avoid jitter during step transitions.
- Flow orchestration: \`steps\`, \`onFlowStepChange\`, and \`stepMountTimeoutMs\` let one tour continue across routes/screens where all target steps are not mounted at once.
- Resolution rule: provider \`renderPopover\` applies to every step by default, but a step-level \`renderPopover\` can override it for one specific step.
- If neither the provider nor the active step defines \`renderPopover\`, Walkit uses the built-in popover UI.
- Lifecycle: \`onStart\`, \`onStop\`, \`onStepChange\`.`,
      subsections: [
        {
          id: 'rw-provider-props',
          title: 'Props',
          content: `- \`children\` (ReactNode, required): subtree allowed to register steps.
- \`animationType\` ('fade' | 'slide' | 'zoom' | 'bounce' | 'flip' | 'glow', default 'slide'): popover entrance preset on web and iOS; on React Native Android the built-in popover uses a stability-first immediate entrance.
- \`overlayColor\` (string, default rgba(15,15,25,0.72)): backdrop tint.
- \`spotlightPadding\` (number, default 8): extra px around target cutout.
- \`spotlightBorderRadius\` (number, default 8): radius of spotlight cutout.
- \`walkitStyle\` (object): style overrides for default popover shell.
- \`theme\` (WalkitTheme): colors/shape for built-in popover (see Theme section).
- \`labels\` (WalkitLabels): button text overrides (next/prev/finish/close).
- \`stopOnOutsideClick\` (boolean, default false): close tour when clicking/pressing backdrop.
- \`steps\` (Array<{ id: string; sequence: number; route?: string }>): optional global flow definition when a tour spans multiple routes/screens.
- \`renderPopover\` ((RenderWalkitStepProps) => ReactNode): global custom popover renderer for all steps in this provider, unless a step overrides it locally.
- \`onFlowStepChange\` (({ action, toStep, fromStep }) => void | Promise<void>): called when the next requested flow step is not mounted and the app must navigate or reveal UI before the tour can continue.
- \`stepMountTimeoutMs\` (number, default 5000): maximum wait after \`onFlowStepChange\` for the requested target step to mount.
- \`onStart\` (() => void): fired when tour begins.
- \`onStop\` (() => void): fired when tour ends/stops.
- \`onStepChange\` ((step, index) => void): fired after each step activation.`,
        },
        {
          id: 'rw-provider-rendering-strategy',
          title: 'Choosing provider-level rendering',
          content: `Use provider \`renderPopover\` when you want one consistent popover layout across a whole screen or app section.

- Good fit for branded tours, a shared progress header, or common action buttons.
- Keep it on the provider when the structure is the same and only the step data changes.
- Add a step-level \`renderPopover\` only for exceptions such as billing, permissions, or feature announcement moments that need a very different CTA.
- If you only want to tweak colors and labels while keeping the default layout, prefer \`theme\` and \`labels\` instead of replacing the renderer.`,
        },
      ],
      codeTabs: [
        {
          filename: 'Provider.web.tsx',
          lang: 'tsx',
          code: `<WalkitProvider
  animationType="zoom"
  overlayColor="rgba(0,0,0,0.72)"
  spotlightPadding={12}
  spotlightBorderRadius={10}
  stopOnOutsideClick
  labels={{ next: 'Next', prev: 'Back', finish: 'Finish', close: 'Close' }}
  theme={{
    primaryButtonColor: '#22c55e',
    primaryButtonTextColor: '#041016',
    background: '#0f172a',
    titleColor: '#e2e8f0',
    subTitleColor: '#cbd5e1',
    border: '#1e293b',
    shadow: '0 18px 60px rgba(0,0,0,0.45)',
    borderRadius: '14px',
  }}
  onStart={() => analytics.track('tour_started')}
  onStop={() => analytics.track('tour_stopped')}
  onStepChange={(step, index) => analytics.track('tour_step', { id: step.id, index })}
>
  <AppContent />
</WalkitProvider>`,
        },
        {
          filename: 'Provider.native.tsx',
          lang: 'tsx',
          code: `<WalkitProvider
  animationType="bounce"
  overlayColor="rgba(0,0,0,0.75)"
  spotlightPadding={10}
  stopOnOutsideClick
  labels={{ next: 'Suivant', prev: 'Précédent', finish: 'Terminé', close: 'Fermer' }}
    theme={{
    primaryButtonColor: '#22c55e',
    primaryButtonTextColor: '#041016',
    background: '#0f172a',
    titleColor: '#e2e8f0',
    subTitleColor: '#cbd5e1',
    border: '#1e293b',
    shadow: '0 18px 60px rgba(0,0,0,0.45)',
    borderRadius: '14px',
  }}
  onStart={() => console.log('tour start')}
  onStop={() => console.log('tour stop')}
  onStepChange={(step, index) => analytics.track('tour_step', { id: step.id, index })}
>
  <SafeAreaView style={{ flex: 1 }}>
    <Dashboard />
  </SafeAreaView>
</WalkitProvider>`,
        },
      ],
    },
    {
      id: 'rw-step',
      title: 'WalkitStep',
      content: `Wraps the target element to measure + highlight it.

- Required: \`id\` (string), \`sequence\` (number).
- Display: \`title\`, \`content\`, \`route\`, \`placement\` ('auto' | 'top' | 'bottom' | 'left' | 'right').
- Participation: \`active\` (skip when false), \`autoStart\` (optionally start automatically when this step mounts).
- Custom UI: \`renderPopover\` can override the provider renderer for this step only.
- Web-only wrappers: \`asChild\` (reuse the child element as the ref), \`wrapperElement\` ('div' | 'span'), \`wrapperClassName\`, \`wrapperStyle\`.
- Spotlight overrides: \`spotlightPaddingOverride\`, \`spotlightBorderRadiusOverride\` per step.
- Pre-display: \`onBeforeShow\` runs before measuring; useful to scroll, expand, or stabilize UI before the popover is shown.`,
      subsections: [
        {
          id: 'rw-step-props',
          title: 'Props',
          content: `- \`id\` (string, required): unique step identifier; also used by \`start(id)\`.
- \`sequence\` (number, required): ascending sort for tour sequence.
- \`title\` (string): heading in default popover.
- \`content\` (string): body text in default popover.
- \`route\` (string): optional route/screen metadata, useful when the same step definition also participates in a provider-level cross-page flow.
- \`placement\` ('auto' | 'top' | 'bottom' | 'left' | 'right', default 'auto'): preferred popover side.
- \`active\` (boolean, default true): when false, unregisters the step.
- \`asChild\` (web, boolean, default false): reuse the child element instead of wrapping.
- \`wrapperElement\` (web, 'div' | 'span', default 'div'): tag used when not using \`asChild\`.
- \`wrapperClassName\` (web, string): class on wrapper.
- \`wrapperStyle\` (web, CSSProperties): inline styles on wrapper.
- \`onBeforeShow\` (() => void | Promise<void>): runs before measuring; can scroll, expand, or prepare layout before the step is shown.
- \`autoStart\` (boolean | 'always' | 'once' | { mode?: 'always' | 'once'; key?: string; delay?: number }): start the tour automatically from this step when it mounts.
- \`renderPopover\` ((RenderWalkitStepProps) => ReactNode): custom renderer for this step only; overrides provider \`renderPopover\` while this step is active.
- \`spotlightPaddingOverride\` (number): per-step padding for spotlight.
- \`spotlightBorderRadiusOverride\` (number): per-step radius for spotlight.`,
        },
        {
          id: 'rw-step-rendering',
          title: 'What happens when you do not set these props',
          content: `Both \`autoStart\` and \`renderPopover\` are optional.

- No \`autoStart\`: the step only participates in the tour when you call \`start()\` manually.
- No step \`renderPopover\`: the step inherits the provider \`renderPopover\` if one exists.
- No provider \`renderPopover\` and no step \`renderPopover\`: Walkit falls back to the built-in popover UI.
- Step \`renderPopover\` should be treated as an override, not the default place to define your whole tour design.`,
        },
      ],
      codeTabs: [
        {
          filename: 'Steps.web.tsx',
          lang: 'tsx',
          code: `import { WalkitStep } from '@runilib/react-walkit'

<WalkitStep
  id="search"
  sequence={0}
  title="Search"
  content="Type to filter all entities."
  placement="bottom"
  asChild
>
  <input placeholder="Search…" />
</WalkitStep>

<WalkitStep
  id="results"
  sequence={1}
  title="Results"
  content="We auto-scroll this into view before showing the popover."
  onBeforeShow={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
  spotlightPaddingOverride={12}
  spotlightBorderRadiusOverride={14}
>
  <div id="results">…</div>
</WalkitStep>`,
        },
        {
          filename: 'Steps.native.tsx',
          lang: 'tsx',
          code: `import { Text, View, Button } from 'react-native'
import { WalkitStep } from '@runilib/react-walkit'

<WalkitStep
  id="hero"
  sequence={0}
  title="Welcome"
  content="Quick tour of the mobile app."
>
  <Text style={{ fontSize: 22 }}>Hello 👋</Text>
</WalkitStep>

<WalkitStep
  id="cta"
  sequence={1}
  title="Create a task"
  content="Tap + to add your first task."
  placement="bottom"
>
  <Button title="+ New Task" onPress={() => {}} />
</WalkitStep>`,
        },
      ],
    },
    {
      id: 'rw-tooltip',

      title: 'Tooltip component',
      content: `Tooltip is the lightweight sibling of Walkit: no provider, no step registry, no walkthrough flow. Use it for one-off hints, inline help, status explainers, and action affordances attached to a single element.

- \`Tooltip\` works standalone; \`WalkitProvider\` is not required.
- Trigger source: \`children\` or \`anchor\`, each as a plain node or a render function.
- Content source: \`content\` for the built-in bubble, or \`renderContent\` for fully custom UI.
- Positioning is collision-aware on both web and native; \`placement="auto"\` picks the side that fits best and explicit sides still fall back when space is tight.
- Interaction model: \`openOnHover\` is best for desktop web, \`openOnPress\` is the default touch-friendly pattern, and render-function triggers let you call \`{ toggle, visible }\` manually.
- The Trigger render functions and Custom content receive \`{ toggle, visible }\`.`,
      codeTabs: [
        {
          filename: 'Tooltip.basic.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.tooltip,
          code: `import { Tooltip } from '@runilib/react-walkit'

export function StorageHintWeb() {
  return (
    <Tooltip
      openOnHover
      placement="right"
      content="Exports are limited to the current workspace."
      tooltipStyle={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}
    >
      <span style={{ cursor: 'help', textDecoration: 'underline' }}>
        Storage policy
      </span>
    </Tooltip>
  )
}`,
        },
        {
          filename: 'Tooltip.basic.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.tooltipNative,
          code: `import { Pressable, Text } from 'react-native'
import { Tooltip } from '@runilib/react-walkit'

export function StorageHintNative() {
  return (
    <Tooltip
      openOnPress
      placement="top"
      content="Sync only affects this device until you enable cloud backup."
    >
      <Pressable
        style={{
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 999,
          backgroundColor: '#e0f2fe',
        }}
      >
        <Text style={{ color: '#0f172a', fontWeight: '700' }}>Storage policy</Text>
      </Pressable>
    </Tooltip>
  )
}`,
        },
      ],
      subsections: [
        {
          id: 'rw-tooltip-props',
          title: 'Props and resolution rules',
          content: `- Pass either \`anchor\` or \`children\`; when both are provided, \`anchor\` wins.
- Pass either \`content\` or \`renderContent\`; when both are provided, \`renderContent\` wins.
- \`placement\`: 'auto' | 'top' | 'bottom' | 'left' | 'right' (default 'auto').
- \`offset\` (default 10): gap between trigger and bubble.
- \`disabled\`: keep the trigger mounted but never open the tooltip.
- \`openOnHover\` (default false): desktop-web hover trigger.
- \`openOnPress\` (default false): wrapper-level click / press trigger; ideal for touch UIs or quick click hints.
- \`closeOnOutsidePress\` (default true): dismiss when interacting outside the tooltip shell.
- \`maxWidth\`, \`zIndex\`: layout and stacking controls.
- \`tooltipStyle\`: styles the built-in bubble.
- \`triggerWrapperStyle\`: styles the wrapper created around the trigger.
- \`showAnchor\`, \`anchorSize\`, \`anchorColor\`: arrow visibility and appearance.
- Render-function trigger API: \`{ toggle, visible }\`.
- Render-function content API: \`{ toggle, visible }\`.`,
        },
        {
          id: 'rw-tooltip-placements',
          title: 'All placements',
          content: `Tooltip placement is shared across web and native.

- \`auto\` lets the library choose the side with the best available space.
- \`top\`, \`bottom\`, \`left\`, and \`right\` express a preferred side; the engine still flips when the preferred side cannot fit.
- \`offset\` controls the gap between the trigger and the tooltip.
- The anchor arrow follows the resolved placement, not just the preferred one.`,
          codeTabs: [
            {
              filename: 'TooltipPlacements.web.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.tooltip,
              code: `import { Tooltip } from '@runilib/react-walkit'

const chipStyle = {
  padding: '10px 14px',
  borderRadius: 12,
  border: '1px solid #cbd5e1',
  background: '#fff',
  cursor: 'pointer',
}

export function TooltipPlacementsWeb() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, max-content)',
        gap: 18,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
      }}
    >
      <div />
      <Tooltip placement="top" offset={12} openOnHover content="Placement: top">
        <button type="button" style={chipStyle}>Top</button>
      </Tooltip>
      <div />

      <Tooltip placement="left" openOnHover content="Placement: left">
        <button type="button" style={chipStyle}>Left</button>
      </Tooltip>

      <Tooltip placement="auto" openOnHover content="Placement: auto">
        <button type="button" style={chipStyle}>Auto</button>
      </Tooltip>

      <Tooltip placement="right" openOnHover content="Placement: right">
        <button type="button" style={chipStyle}>Right</button>
      </Tooltip>

      <div />
      <Tooltip placement="bottom" openOnHover content="Placement: bottom">
        <button type="button" style={chipStyle}>Bottom</button>
      </Tooltip>
      <div />
    </div>
  )
}`,
            },
            {
              filename: 'TooltipPlacements.native.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.tooltipNative,
              code: `import { Pressable, Text, View } from 'react-native';

import { Tooltip } from '@runilib/react-walkit';

const chipStyle = {
  minWidth: 82,
  alignItems: 'center',
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 5,
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#cbd5e1',
};

export function TooltipPlacementsNative() {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 68,
        padding: 24,
      }}
    >
      <View>
        <Tooltip
          placement="top"
          openOnPress
          content="Placement: top"
        >
          <Text style={chipStyle}>Top</Text>
        </Tooltip>
      </View>

      <View>
        <Tooltip
          placement="left"
          openOnPress
          content="Placement: left"
        >
          <View>
            <Text style={chipStyle}>Left</Text>
          </View>
        </Tooltip>
      </View>

      <View>
        <Tooltip
          placement="auto"
          content="Placement: auto"
          openOnPress
        >
          <Text style={chipStyle}>Auto</Text>
        </Tooltip>
      </View>
      <View>
        <Tooltip
          placement="right"
          openOnPress
          content="Placement: right"
        >
          <Text style={chipStyle}>Right</Text>
        </Tooltip>
      </View>

      <View>
        <Tooltip
          placement="bottom"
          openOnPress
          content="Placement: bottom"
        >
          <Text style={chipStyle}>Bottom</Text>
        </Tooltip>
      </View>

      <View>
        <Tooltip
          openOnPress
          anchorColor="#111827"
          placement="top"
          renderContent={({ toggle }) => (
            <View
              style={{
                backgroundColor: '#111827',
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', marginBottom: 8 }}>
                Custom native tooltip
              </Text>
              <Pressable onPress={toggle}>
                <Text style={{ color: '#ccfbf1' }}>Close</Text>
              </Pressable>
            </View>
          )}
        >
          <Text style={chipStyle}> With custom renderContent</Text>
        </Tooltip>
      </View>

      <View>
        <Tooltip
          content="Native custom tooltip with function trigger"
          tooltipStyle={{
            backgroundColor: '#1d4ed8',
            borderRadius: 5,
            paddingHorizontal: 16,
            paddingVertical: 12,
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {({ toggle }) => (
            <Pressable
              style={chipStyle}
              onPress={toggle}
            >
              <Text>With Function Trigger</Text>
            </Pressable>
          )}
        </Tooltip>
      </View>
    </View>
  );
}
`,
            },
          ],
        },
        {
          id: 'rw-tooltip-triggers',
          title: 'Trigger patterns',
          content: `There are three main trigger strategies.

- Declarative hover: use \`openOnHover\` for pointer-first desktop UI.
- Declarative press: use \`openOnPress\` when the trigger itself is passive and the wrapper should toggle the tooltip.
- Manual trigger: use a render-function trigger and call \`toggle\` yourself when the trigger needs to react to tooltip state.

Important: if your trigger render function already calls \`toggle\`, do not also set \`openOnPress\`, otherwise you duplicate the interaction handler.`,
          codeTabs: [
            {
              filename: 'TooltipTriggers.web.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.tooltip,
              code: `import { Tooltip } from '@runilib/react-walkit'

export function TooltipTriggersWeb() {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Tooltip openOnHover content="Hover is ideal for desktop help text.">
        <span style={{ cursor: 'help', textDecoration: 'underline' }}>Hover hint</span>
      </Tooltip>

      <Tooltip openOnPress content="Click once to open, click again to close.">
        <button type="button">Click hint</button>
      </Tooltip>

      <Tooltip
        renderContent={({ stop }) => (
          <div
            style={{
              background: '#111827',
              color: '#fff',
              padding: 12,
              borderRadius: 12,
              display: 'flex',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <span>Controlled with the trigger render function.</span>
            <button type="button" onClick={stop}>Close</button>
          </div>
        )}
      >
        {({ toggle, visible }) => (
          <button type="button" onClick={toggle}>
            {visible ? 'Hide manual tooltip' : 'Open manual tooltip'}
          </button>
        )}
      </Tooltip>
    </div>
  )
}`,
            },
            {
              filename: 'TooltipTriggers.native.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.tooltipNative,
              code: `import { Pressable, Text, View } from 'react-native'
import { Tooltip } from '@runilib/react-walkit'

export function TooltipTriggersNative() {
  return (
    <View style={{ gap: 16 }}>
      <Tooltip openOnPress content="Press once to open this lightweight helper.">
        <View
          style={{
            alignSelf: 'flex-start',
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 12,
            backgroundColor: '#e0f2fe',
          }}
        >
          <Text style={{ color: '#0f172a', fontWeight: '700' }}>Press hint</Text>
        </View>
      </Tooltip>

      <Tooltip
        renderContent={({ stop }) => (
          <View
            style={{
              backgroundColor: '#0f172a',
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 16,
              gap: 10,
            }}
          >
            <Text style={{ color: '#fff' }}>Manual trigger with render props.</Text>
            <Pressable onPress={stop}>
              <Text style={{ color: '#93c5fd', fontWeight: '700' }}>Close</Text>
            </Pressable>
          </View>
        )}
      >
        {({ toggle, visible }) => (
          <Pressable
            onPress={toggle}
            style={{
              alignSelf: 'flex-start',
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: visible ? '#0f172a' : '#f1f5f9',
            }}
          >
            <Text style={{ color: visible ? '#fff' : '#0f172a', fontWeight: '700' }}>
              {visible ? 'Hide manual help' : 'Open manual help'}
            </Text>
          </Pressable>
        )}
      </Tooltip>
    </View>
  )
}`,
            },
          ],
        },
        {
          id: 'rw-tooltip-anchor-trigger',
          title: 'anchor, children, and trigger render functions',
          content: `\`children\` is usually the simplest choice when the trigger already lives naturally in the component tree. \`anchor\` is an alternative prop that can be easier to read in helper wrappers or higher-level abstractions.

- Both \`anchor\` and \`children\` can be static nodes.
- Both can also be render functions that read \`visible\` and call \`start\`, \`stop\`, or \`toggle\`.
- If you provide both, \`anchor\` wins and \`children\` is ignored.`,
          codeTabs: [
            {
              filename: 'TooltipAnchor.web.tsx',
              lang: 'tsx',
              code: `import { Tooltip } from '@runilib/react-walkit'

export function TooltipAnchorWeb() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Tooltip
        anchor={
          <button
            type="button"
            aria-label="More information"
            style={{ borderRadius: 999, width: 28, height: 28 }}
          >
            ?
          </button>
        }
        openOnHover
        content="This example uses the anchor prop."
      />

      <Tooltip content="This trigger reads tooltip visibility and drives it manually.">
        {({ start, stop, visible }) => (
          <span
            onMouseEnter={start}
            onMouseLeave={stop}
            style={{
              cursor: 'help',
              color: visible ? '#2563eb' : '#475569',
              fontWeight: 700,
            }}
          >
            {visible ? 'Tooltip is open' : 'Hover for trigger API'}
          </span>
        )}
      </Tooltip>
    </div>
  )
}`,
            },
            {
              filename: 'TooltipAnchor.native.tsx',
              lang: 'tsx',
              code: `import { Pressable, Text, View } from 'react-native'
import { Tooltip } from '@runilib/react-walkit'

export function TooltipAnchorNative() {
  return (
    <View style={{ gap: 16, alignItems: 'flex-start' }}>
      <Tooltip
        openOnPress
        content="This example uses the anchor prop."
        anchor={
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              backgroundColor: '#dbeafe',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#1d4ed8', fontWeight: '800' }}>?</Text>
          </View>
        }
      />

      <Tooltip renderContent={({ stop }) => (
        <Pressable
          onPress={stop}
          style={{
            backgroundColor: '#0f172a',
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderRadius: 16,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Tap to close</Text>
        </Pressable>
      )}>
        {({ toggle, visible }) => (
          <Pressable
            onPress={toggle}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: visible ? '#0f172a' : '#e2e8f0',
            }}
          >
            <Text style={{ color: visible ? '#fff' : '#0f172a', fontWeight: '700' }}>
              {visible ? 'Hide details' : 'Open details'}
            </Text>
          </Pressable>
        )}
      </Tooltip>
    </View>
  )
}`,
            },
          ],
        },
        {
          id: 'rw-tooltip-custom-content',
          title: 'Custom content with renderContent',
          content: `Use \`renderContent\` when the tooltip needs actions, richer structure, or custom styling that should replace the built-in bubble entirely.

- The library still handles measurement, placement, outside-click dismissal, and optional anchor rendering.
- The default bubble styles are not applied when \`renderContent\` is used.
- When your custom card does not visually need the arrow, set \`showAnchor={false}\`.
- \`renderContent\` receives \`{ stop, visible }\`, so the tooltip can close itself from inside the custom UI.`,
          codeTabs: [
            {
              filename: 'TooltipCustomContent.web.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.tooltip,
              code: `import { Tooltip } from '@runilib/react-walkit'

export function TooltipCustomContentWeb() {
  return (
    <Tooltip
      placement="bottom"
      showAnchor={false}
      renderContent={({ stop, visible }) => (
        <div
          style={{
            width: 280,
            borderRadius: 16,
            background: '#111827',
            color: '#fff',
            padding: 16,
            boxShadow: '0 18px 48px rgba(15,23,42,0.35)',
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: '#93c5fd' }}>
            {visible ? 'Tooltip open' : 'Tooltip closed'}
          </p>
          <h4 style={{ margin: '6px 0 8px' }}>Custom content</h4>
          <p style={{ margin: 0, color: '#cbd5e1' }}>
            Use this pattern for CTA-heavy hints, upsells, or structured helper cards.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button type="button" onClick={stop}>Dismiss</button>
            <button type="button">Learn more</button>
          </div>
        </div>
      )}
    >
      {({ toggle }) => (
        <button type="button" onClick={toggle}>
          Open custom card
        </button>
      )}
    </Tooltip>
  )
}`,
            },
            {
              filename: 'TooltipCustomContent.native.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.tooltipNative,
              code: `import { Pressable, Text, View } from 'react-native'
import { Tooltip } from '@runilib/react-walkit'

export function TooltipCustomContentNative() {
  return (
    <Tooltip
      placement="bottom"
      showAnchor={false}
      renderContent={({ stop, visible }) => (
        <View
          style={{
            width: 280,
            borderRadius: 18,
            backgroundColor: '#111827',
            paddingHorizontal: 16,
            paddingVertical: 16,
            gap: 10,
          }}
        >
          <Text style={{ color: '#93c5fd', fontSize: 12 }}>
            {visible ? 'Tooltip open' : 'Tooltip closed'}
          </Text>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
            Custom content
          </Text>
          <Text style={{ color: '#cbd5e1' }}>
            Ideal for richer native helper cards with multiple actions.
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              onPress={stop}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: '#1e293b',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>Dismiss</Text>
            </Pressable>
            <Pressable
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: '#2563eb',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>Learn more</Text>
            </Pressable>
          </View>
        </View>
      )}
    >
      {({ toggle }) => (
        <Pressable
          onPress={toggle}
          style={{
            alignSelf: 'flex-start',
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 12,
            backgroundColor: '#dbeafe',
          }}
        >
          <Text style={{ color: '#1d4ed8', fontWeight: '800' }}>Open custom card</Text>
        </Pressable>
      )}
    </Tooltip>
  )
}`,
            },
          ],
        },
        {
          id: 'rw-tooltip-visuals',
          title: 'Visual controls and styling',
          content: `When you keep the built-in bubble, these props cover most visual customization needs.

- \`tooltipStyle\`: color, spacing, radius, borders, shadows, and other built-in bubble styling.
- \`triggerWrapperStyle\`: helpful when the wrapper itself needs spacing, padding, or a surrounding chip style.
- \`showAnchor={false}\`: remove the arrow entirely.
- \`anchorSize\` and \`anchorColor\`: tweak the arrow geometry and color.
- \`maxWidth\`: control text wrapping and card width.
- \`zIndex\`: useful when the tooltip must out-stack sticky headers, drawers, or custom overlays.
- \`disabled\`: keep the trigger visible while suppressing tooltip behavior.`,
          codeTabs: [
            {
              filename: 'TooltipStyling.web.tsx',
              lang: 'tsx',
              code: `import { Tooltip } from '@runilib/react-walkit'

export function TooltipStylingWeb() {
  const disabled = false

  return (
    <Tooltip
      disabled={disabled}
      openOnHover
      placement="bottom"
      maxWidth={340}
      zIndex={3000}
      anchorColor="#2563eb"
      anchorSize={10}
      triggerWrapperStyle={{
        display: 'inline-flex',
        padding: 4,
        borderRadius: 999,
        background: '#eff6ff',
      }}
      tooltipStyle={{
        backgroundColor: '#1d4ed8',
        color: '#eff6ff',
        border: '1px solid #93c5fd',
        borderRadius: 16,
        padding: '12px 14px',
        boxShadow: '0 18px 40px rgba(29,78,216,0.28)',
      }}
      content="Branded helper text with a larger anchor and wrapper chrome."
    >
      <button type="button">Billing policy</button>
    </Tooltip>
  )
}`,
            },
            {
              filename: 'TooltipStyling.native.tsx',
              lang: 'tsx',
              code: `import { Pressable, Text } from 'react-native'
import { Tooltip } from '@runilib/react-walkit'

export function TooltipStylingNative() {
  const disabled = false

  return (
    <Tooltip
      disabled={disabled}
      openOnPress
      placement="bottom"
      maxWidth={320}
      zIndex={12000}
      anchorColor="#0f766e"
      anchorSize={10}
      triggerWrapperStyle={{
        borderRadius: 999,
        padding: 4,
        backgroundColor: '#ccfbf1',
      }}
      tooltipStyle={{
        backgroundColor: '#0f766e',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 14,
      }}
      content={
        <Text style={{ color: '#fff', lineHeight: 20 }}>
          Branded native helper text with a custom wrapper and anchor color.
        </Text>
      }
    >
      <Pressable
        style={{
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 999,
          backgroundColor: '#ffffff',
        }}
      >
        <Text style={{ color: '#0f766e', fontWeight: '800' }}>Billing policy</Text>
      </Pressable>
    </Tooltip>
  )
}`,
            },
          ],
        },
      ],
    },
    {
      id: 'rw-auto-start',

      title: 'Auto-start',
      content: `\`autoStart\` lets a step become the entry point of a tour as soon as that step is mounted. This is useful when the page itself is already the onboarding moment and asking the user to click a separate "Start tour" button would add friction.

Typical reasons to use it:

- A first-time visit to a settings, dashboard, or setup screen.
- A contextual tour that should begin right after navigation to a feature.
- A feature announcement where the first visible step should explain the UI immediately.

Typical reasons not to use it:

- The tour is optional and should remain user-triggered.
- The screen is already busy and auto-opening a popover would feel disruptive.
- The target is not ready yet and needs more than a small \`delay\` or \`onBeforeShow\` preparation.`,
      subsections: [
        {
          id: 'rw-auto-start-modes',
          title: 'Modes and defaults',
          content: `- No \`autoStart\`: nothing starts automatically; call \`start()\` yourself.
- \`autoStart\` or \`autoStart={true}\` or \`autoStart="always"\`: start every time this step mounts.
- \`autoStart="once"\`: start only once for the current app runtime, using the step \`id\` as the default memory key.
- \`autoStart={{ mode, key, delay }}\`: explicit control over repetition and startup timing.
- \`key\` defaults to the step \`id\`.
- \`delay\` defaults to \`0\` and is clamped to a non-negative number.`,
        },
        {
          id: 'rw-auto-start-behavior',
          title: 'Behavior details',
          content: `- \`autoStart\` lives on \`WalkitStep\`, not on the provider, because Walkit needs a concrete step id to know where the tour should begin.
- The tour starts from the step that defines \`autoStart\`; users do not need to call \`start(stepId?)\` manually.
- If multiple mounted steps define \`autoStart\` at the same time, Walkit uses the first eligible step by \`sequence\`. In practice, configure one auto-start entry step per screen to keep behavior predictable.
- \`once\` is remembered in the current app runtime. A full page reload or app restart resets that memory.
- \`delay\` is especially useful after route transitions, async data loading, accordions, tabs, or scroll restoration, where the target may exist but not yet be stable on screen.`,
        },
        {
          id: 'rw-auto-start-example',
          title: 'Recommended example',
          content: `This pattern is a good default for contextual onboarding on a screen such as Settings: start automatically only once, and wait a short delay so the layout is stable before measuring the target.`,
          code: {
            filename: 'AutoStart.tsx',
            lang: 'tsx',
            code: `import { WalkitStep } from '@runilib/react-walkit'

<WalkitStep
  id="settings-profile"
  sequence={0}
  title="Your profile"
  content="Update your personal information here."
  autoStart={{ mode: 'once', key: 'settings-tour', delay: 600 }}
  onBeforeShow={() =>
    document.getElementById('profile-card')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }
>
  <section id="profile-card">
    <ProfileCard />
  </section>
</WalkitStep>`,
          },
        },
      ],
    },
    {
      id: 'rw-flow',

      title: 'Multiple pages flows',
      content: `By default, Walkit only knows about the steps currently mounted in the tree. That keeps one-screen tours simple, but it also means \`next()\` cannot continue to a step that lives on another page or screen unless the provider knows the full flow.

Use provider-level flow orchestration when a tour should start on one route and continue on another, such as Dashboard → Settings or Home → Profile.

- No provider \`steps\`: Walkit uses only mounted steps and behaves like a local screen tour.
- Provider \`steps\` only: Walkit knows the full sequence, but if the next target is not mounted it cannot continue by itself.
- Provider \`steps\` + \`onFlowStepChange\`: Walkit asks your app to navigate or reveal UI, then waits for the requested step to mount and continues automatically.
- \`route\` is metadata only. Walkit does not own routing; you can route by \`toStep.route\`, by \`toStep.id\`, or by any other rule in your app.
- On web, a common setup is to pair this with \`react-router\` and call \`navigate(toStep.route)\` inside \`onFlowStepChange\`.
- On native, the same pattern works with \`expo-router\`, \`react-navigation\`, or any other navigator that can send the user to the destination screen.`,
      subsections: [
        {
          id: 'rw-flow-why',
          title: 'Why this matters',
          content: `A multi-page tour has real product value because the user experiences one continuous onboarding flow instead of several disconnected tours.

- It is easier to teach real workflows that naturally move across screens.
- You do not need to create one separate tour per page and manually stitch them together.
- The same \`next()\` / \`prev()\` controls continue to work even when the next target lives elsewhere in the app.`,
        },
        {
          id: 'rw-flow-contract',
          title: 'Contract',
          content: `- Put the global sequence on \`<WalkitProvider steps={...} />\`.
- Give each cross-page step a stable \`id\` and \`sequence\`.
- Add optional \`route\` metadata when it helps the app decide where to navigate.
- Implement \`onFlowStepChange\` to move the user to the screen that contains the requested step.
- The navigation layer is up to your app: \`react-router\` on web, \`expo-router\`, \`react-navigation\`, or another navigator on native.
- Optionally increase \`stepMountTimeoutMs\` if the destination screen needs more time to load or animate in.`,
        },
      ],
      codeTabs: [
        {
          filename: 'CrossPageFlow.web.tsx',
          lang: 'tsx',
          code: `import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

const TOUR_STEPS = [
  { id: 'dashboard-header', sequence: 1, route: '/' },
  { id: 'dashboard-filters', sequence: 2, route: '/' },
  { id: 'settings-profile', sequence: 3, route: '/settings' },
  { id: 'settings-billing', sequence: 4, route: '/settings' },
]

function TourApp() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <WalkitProvider
      steps={TOUR_STEPS}
      onFlowStepChange={({ toStep }) => {
        if (!toStep.route || toStep.route === location.pathname) {
          return
        }

        navigate(toStep.route, { replace: true })
      }}
    >
      <Routes>
        <Route
          path="/"
          element={<Dashboard onGoToSettings={() => navigate('/settings')} />}
        />
        <Route
          path="/settings"
          element={<Settings onBack={() => navigate('/')} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </WalkitProvider>
  )
}

<BrowserRouter>
  <TourApp />
</BrowserRouter>`,
        },
        {
          filename: 'CrossPageFlow.native.tsx',
          lang: 'tsx',
          code: `const TOUR_STEPS = [
  { id: 'home-greeting', sequence: 1, route: '/' },
  { id: 'home-bottom-nav', sequence: 2, route: '/' },
  { id: 'profile-avatar', sequence: 3, route: '/profile' },
  { id: 'profile-settings', sequence: 4, route: '/profile' },
]

export function RootLayout() {
  const router = useRouter()

  return (
    <WalkitProvider
      steps={TOUR_STEPS}
      onFlowStepChange={({ toStep }) => {
        if (toStep.route) {
          router.push(toStep.route)
        }
      }}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </WalkitProvider>
  )
}`,
        },
        {
          filename: 'CrossPageStep.tsx',
          lang: 'tsx',
          code: `<WalkitStep
  id="settings-profile"
  sequence={3}
  route="/settings"
  title="Your profile"
  content="Update your personal information here."
>
  <ProfileCard />
</WalkitStep>`,
        },
      ],
    },
    {
      id: 'rw-hook',
      title: 'useWalkit()',
      content: `Programmatic control + state.

- Control: \`start(stepId?)\` (Promise), \`stop()\`, \`next()\`, \`prev()\`, \`goTo(index)\`.
- State: \`currentStep\`, \`currentRect\`, \`isRunning\`, \`totalSteps\`, \`currentIndex\`, \`isFirstStep\`, \`isLastStep\`.`,
      subsections: [
        {
          id: 'rw-usewalkit-return',
          title: 'Return shape',
          content: `- \`start(stepId?)\` => Promise<void>: begin tour, optionally from a specific step id.
- \`stop()\`: stop and hide overlay.
- \`next()\`: move forward or finish at last step.
- \`prev()\`: move back (no-op on first).
- \`goTo(index)\` => Promise<void>: jump to 0-based step index.
- \`currentStep\` (WalkitStepData | null): active step metadata.
- \`currentRect\` (TargetRect | null): measured rect of active target.
- \`isRunning\` (boolean): overlay visible.
- \`totalSteps\` (number): registered steps count.
- \`currentIndex\` (number): active 0-based index.
- \`isFirstStep\` (boolean)
- \`isLastStep\` (boolean)`,
        },
      ],
      codeTabs: [
        {
          filename: 'Controls.tsx',
          lang: 'tsx',
          code: `import { useWalkit } from '@runilib/react-walkit'

export function TourControls() {
  const { start, stop, next, prev, goTo, isRunning, currentStep, isLastStep } = useWalkit()

  return (
    <div>
      <button onClick={() => start()}>Start</button>
      <button onClick={() => start('cta')}>Jump to CTA</button>
      <button onClick={prev} disabled={!isRunning || currentStep?.sequence === 0}>Prev</button>
      <button onClick={next} disabled={!isRunning || isLastStep}>Next</button>
      <button onClick={() => goTo(2)}>Go to index 2</button>
      <button onClick={stop}>Stop</button>
    </div>
  )
}`,
        },
        {
          filename: 'Controls.native.tsx',
          lang: 'tsx',
          code: `import { View, Button } from 'react-native'
import { useWalkit } from '@runilib/react-walkit'

export function TourControlsNative() {
  const { start, stop, next, prev, goTo, isRunning, isLastStep } = useWalkit()

  return (
    <View style={{ gap: 8 }}>
      <Button title="Start" onPress={() => start()} disabled={isRunning} />
      <Button title="Jump to CTA" onPress={() => start('cta')} />
      <Button title="Prev" onPress={prev} />
      <Button title="Next" onPress={next} disabled={isLastStep} />
      <Button title="Go to index 2" onPress={() => goTo(2)} />
      <Button title="Stop" onPress={stop} />
    </View>
  )
}`,
        },
      ],
    },
    {
      id: 'rw-events',

      title: 'useWalkitEvent()',
      content: `Analytics-friendly hook that emits lifecycle events.

- Events: \`onStepEnter\`, \`onStepExit\` (with duration + skipped flag), \`onTourComplete\`, \`onTourAbandon\`.
- Works on web and native; subscribers run whenever the provider state changes.`,
      subsections: [
        {
          id: 'rw-events-props',
          title: 'Handlers',
          content: `- \`onStepEnter({ step, index, totalSteps })\`
- \`onStepExit({ step, index, totalSteps, durationMs, skipped })\`
- \`onTourComplete({ totalDurationMs, stepCount })\`
- \`onTourAbandon({ lastStep, lastIndex, durationMs })\``,
        },
        {
          id: 'rw-events-notes',
          title: 'Notes',
          content: `- Durations use \`Date.now()\` timing; handler purity recommended.
- Hook subscribes to provider context; no cleanup needed.`,
        },
      ],
      codeTabs: [
        {
          filename: 'Analytics.tsx',
          lang: 'tsx',
          code: `import { useWalkitEvent } from '@runilib/react-walkit'

export function TourAnalytics() {
  useWalkitEvent({
    onStepEnter: ({ step, index, totalSteps }) => {
      analytics.track('tour_step_enter', { id: step.id, index, totalSteps })
    },
    onStepExit: ({ step, durationMs, skipped }) => {
      analytics.track('tour_step_exit', { id: step.id, durationMs, skipped })
    },
    onTourComplete: ({ totalDurationMs, stepCount }) => {
      analytics.track('tour_complete', { totalDurationMs, stepCount })
    },
    onTourAbandon: ({ lastStep, lastIndex, durationMs }) => {
      analytics.track('tour_abandon', { lastStep: lastStep.id, lastIndex, durationMs })
    },
  })

  return null
}`,
        },
        {
          filename: 'Analytics.native.tsx',
          lang: 'tsx',
          code: `import { useWalkitEvent } from '@runilib/react-walkit'

export function TourAnalyticsNative() {
  useWalkitEvent({
    onStepEnter: ({ step }) => {
      console.log('Step enter', step.id)
    },
    onTourComplete: ({ stepCount }) => {
      console.log('Tour done', stepCount)
    },
  })
  return null
}`,
        },
      ],
    },
    {
      id: 'rw-animations',

      title: 'Animations',
      content: `Six presets for the built-in popover: \`fade\`, \`slide\`, \`zoom\`, \`bounce\`, \`flip\`, \`glow\`.

- Set globally on \`WalkitProvider\` with \`animationType\`.
- The library auto-picks direction for \`slide\` based on placement.
- On React Native Android, the built-in popover uses a stability-first immediate entrance instead of animated motion; the overlay still fades in.`,
      subsections: [
        {
          id: 'rw-animations-list',
          title: 'Preset behaviors',
          content: `- \`fade\`: opacity in (duration ~300ms).
- \`slide\`: translate from placement side (duration ~300ms).
- \`zoom\`: scale 0.85 → 1 (duration ~300ms).
- \`bounce\`: springy scale overshoot (duration ~500ms, spring curve).
- \`flip\`: perspective rotateX (duration ~320ms).
- \`glow\`: subtle scale + glow shadow (duration ~350ms).
- Platform nuance: on web and iOS these presets animate the built-in popover; on React Native Android they remain valid API values but the built-in popover intentionally skips motion to keep step-to-step rendering stable.`,
        },
      ],
      code: {
        filename: 'Animations.tsx',
        lang: 'tsx',
        code: `import { ANIMATION_TYPES, WalkitProvider } from '@runilib/react-walkit'

const animations = ANIMATION_TYPES // ['fade','slide','zoom','bounce','flip','glow']

export function AnimatedTour() {
  return (
    <WalkitProvider animationType="flip">
      <AppContent />
    </WalkitProvider>
  )
}`,
      },
    },
    {
      id: 'rw-theme',

      title: 'Theme & labels',
      content: `Adjust the default popover without reimplementing it.

- Theme keys: \`primaryButtonColor\`, \`primaryButtonTextColor\`, \`background\`, \`titleColor\`, \`subTitleColor\`, \`border\`, \`shadow\`, \`borderRadius\`.
- Labels: \`next\`, \`prev\`, \`finish\`, \`close\`.
- Overlay: \`overlayColor\`, \`stopOnOutsideClick\`.`,
      code: {
        filename: 'Theme.tsx',
        lang: 'tsx',
        code: `<WalkitProvider
  overlayColor="rgba(8,15,40,0.78)"
  stopOnOutsideClick
  labels={{ next: 'Suivant', prev: 'Précédent', finish: 'Terminé', close: 'Fermer' }}
  theme={{
    primaryButtonColor: '#f97316',
    primaryButtonTextColor: '#0b0f19',
    background: '#0b1224',
    titleColor: '#e5e7eb',
    subTitleColor: '#cbd5e1',
    border: '#1f2937',
    shadow: '0 12px 48px rgba(0,0,0,0.45)',
    borderRadius: '12px',
  }}
>
  <AppContent />
</WalkitProvider>`,
      },
    },
    {
      id: 'rw-custom-popover',

      title: 'Custom popover',
      content: `Replace the built-in content with \`renderPopover\`. You receive step metadata and control handlers; Walkit still keeps the tour flow, spotlight, positioning, and active-step logic.

- Keep \`onNext\`, \`onPrev\`, \`onStop\` wired to preserve navigation.
- Useful for brand styling, richer layouts, or embedding contextual actions inside a step.
- You can define \`renderPopover\` globally on the provider, locally on a step, or not at all and keep the built-in UI.`,
      code: {
        filename: 'CustomPopover.tsx',
        lang: 'tsx',
        code: `<WalkitProvider
  renderPopover={({ walkitStep, walkitStepIndex, totalWalkitSteps, onNext, onPrev, onStop }) => (
    <div className="my-popover">
      <p className="eyebrow">Step {walkitStepIndex + 1} / {totalWalkitSteps}</p>
      <h3>{walkitStep.title}</h3>
      <p>{walkitStep.content}</p>
      <div className="actions">
        <button onClick={onPrev} disabled={walkitStepIndex === 0}>Back</button>
        <button onClick={onNext}>{walkitStepIndex === totalWalkitSteps - 1 ? 'Finish' : 'Next'}</button>
        <button onClick={onStop}>Skip</button>
      </div>
    </div>
  )}
>
  <AppContent />
</WalkitProvider>`,
      },
      subsections: [
        {
          id: 'rw-custom-popover-resolution',
          title: 'Resolution rules',
          content: `Walkit resolves popovers in this order:

- No provider \`renderPopover\` and no step \`renderPopover\`: built-in popover UI.
- Provider \`renderPopover\` only: the same custom renderer is used for every step in that provider subtree.
- Step \`renderPopover\` only: only that step uses the custom renderer; all other steps still use the built-in UI.
- Both provider and step \`renderPopover\`: the step renderer wins while that step is active.

This makes the provider the right place for a baseline branded renderer, and the step prop the right place for one-off exceptions.`,
        },
        {
          id: 'rw-custom-popover-notes',
          title: 'Practical notes',
          content: `- Your custom renderer should expose some path to \`onNext\`, \`onPrev\`, and \`onStop\`; otherwise the user can get stuck.
- Once you render custom content, you own the wording and structure of the actions inside that content.
- A step-level override is usually best reserved for moments that genuinely deserve a different layout, such as permissions, billing, or upsell flows.`,
        },
        {
          id: 'rw-custom-popover-step',
          title: 'Per-step override example',
          content: `Use a step-level renderer when one step needs a custom CTA or a richer layout than the rest of the tour.`,
          code: {
            filename: 'StepPopover.tsx',
            lang: 'tsx',
            code: `import { WalkitStep } from '@runilib/react-walkit'

<WalkitStep
  id="billing"
  sequence={3}
  title="Billing"
  content="Update your plan and payment method."
  renderPopover={({ walkitStep, onNext, onStop }) => (
    <BillingPopover
      title={walkitStep.title}
      description={walkitStep.content}
      onNext={onNext}
      onClose={onStop}
    />
  )}
>
  <BillingCard />
</WalkitStep>`,
          },
        },
      ],
    },
    {
      id: 'rw-spotlight',

      title: 'Spotlight & positioning',
      content: `The overlay cuts a spotlight around the active target and positions the popover.

- Global controls: \`spotlightPadding\`, \`spotlightBorderRadius\`.
- Per-step overrides: \`spotlightPaddingOverride\`, \`spotlightBorderRadiusOverride\`.
- Placement: \`placement\` defaults to \`auto\`; the engine falls back to a side that fits the viewport/screen.
- Web: if a target is outside the viewport, \`WalkitStep\` auto-scrolls it into view (after running \`onBeforeShow\`).
- Backdrop dismissal: \`stopOnOutsideClick\` (web + native).`,
      subsections: [
        {
          id: 'rw-types',
          title: 'Key types',
          content: `- \`Placement\`: 'auto' | 'top' | 'bottom' | 'left' | 'right'
- \`TargetRect\`: { x, y, width, height }
- \`WalkitStepData\`: normalized step { id, sequence, title?, content?, placement?, measure, ensureVisible?, autoStart?, renderPopover?, spotlightPaddingOverride?, spotlightBorderRadiusOverride? }`,
        },
      ],
    },
    {
      id: 'rw-platform',

      title: 'Platform notes',
      content: `Web
- Overlay renders in a portal attached to \`document.body\`.
- \`asChild\`, \`wrapperElement\`, \`wrapperClassName\`, and \`wrapperStyle\` are web-only conveniences.

React Native
- Install \`react-native-svg\` (Expo: \`npx expo install react-native-svg\`).
- Overlay uses a \`Modal\` with a StatusBar set to translucent; \`stopOnOutsideClick\` works via \`TouchableWithoutFeedback\`.
- Wrap targets with \`WalkitStep\` (it renders a \`View collapsable={false}\`).

Shared
- \`onBeforeShow\` can be used on both web and native to prepare the UI before measurement.
- Steps register/unregister on mount/unmount; sequence controls sequencing.
- Measurement happens at render time; if a ref is missing, the step is skipped and a warning is logged.`,
    },
  ],
};

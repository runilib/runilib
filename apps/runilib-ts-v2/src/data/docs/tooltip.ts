import type { LibraryDoc } from '../../types'

export const tooltipDocs: LibraryDoc = {
  libId: 'tooltip',
  sidebar: [
    {
      group: 'Getting started',
      items: [
        { id: 'tt-overview',   label: 'Overview' },
        { id: 'tt-install',    label: 'Installation' },
        { id: 'tt-quickstart', label: 'Quick start' },
      ],
    },
    {
      group: 'Core API',
      color: 'teal',
      items: [
        { id: 'tt-basic',      label: 'Basic usage' },
        { id: 'tt-placement',  label: 'Placement' },
        { id: 'tt-rich',       label: 'Rich content' },
        { id: 'tt-triggers',   label: 'Triggers' },
        { id: 'tt-popover',    label: 'Popover & menu' },
      ],
    },
    {
      group: 'Advanced',
      color: 'teal',
      items: [
        { id: 'tt-spotlight',  label: 'Spotlight mode' },
        { id: 'tt-groups',     label: 'Groups & sequences' },
        { id: 'tt-help',       label: 'Help mode' },
        { id: 'tt-analytics',  label: 'Analytics' },
        { id: 'tt-theme',      label: 'Theming' },
      ],
    },
  ],
  sections: [
    {
      id: 'tt-overview',
      title: 'Overview',
      content: `@runilib/tooltip is a cross-platform tooltip and contextual help library for React and React Native.

Smart positioning, rich content, spotlight mode, grouped tooltips — one unified API for web and mobile.

No other tooltip library handles cross-platform natively. This one does.`,
      code: {
        filename: 'App.tsx',
        lang: 'tsx',
        code: `import { TooltipProvider, Tooltip, TooltipContent }
  from '@runilib/tooltip'

// Wrap your app once
export function App() {
  return (
    <TooltipProvider theme="dark">
      <MainApp />
    </TooltipProvider>
  )
}

// Use anywhere — zero config
function Dashboard() {
  return (
    <>
      {/* Simple string */}
      <Tooltip content="Archive this task" placement="top">
        <ArchiveButton />
      </Tooltip>

      {/* Rich content */}
      <Tooltip content={
        <TooltipContent
          title="Export data"
          description="Download your data as CSV or Excel."
          shortcut="⌘E"
          actions={[{ label: 'Learn more', href: '/docs/export' }]}
        />
      } trigger={['hover', 'focus']}>
        <ExportButton />
      </Tooltip>
    </>
  )
}`,
      },
    },
    {
      id: 'tt-install',
      title: 'Installation',
      content: 'Install the package and its peer dependencies.',
      code: {
        filename: 'terminal',
        lang: 'bash',
        code: `# npm
npm install @runilib/tooltip

# yarn
yarn add @runilib/tooltip

# pnpm
pnpm add @runilib/tooltip

# React Native (optional — for Lottie animations)
npx expo install lottie-react-native`,
      },
    },
    {
      id: 'tt-basic',
      title: 'Basic usage',
      content: 'The simplest usage — just wrap an element.',
      code: {
        filename: 'BasicTooltip.tsx',
        lang: 'tsx',
        code: `import { Tooltip } from '@runilib/tooltip'

// String content
<Tooltip content="Delete this item">
  <DeleteButton />
</Tooltip>

// Placement
<Tooltip content="Your profile" placement="bottom-start">
  <Avatar />
</Tooltip>

// Disabled tooltip (won't show)
<Tooltip content="Save (Ctrl+S)" disabled={!hasChanges}>
  <SaveButton />
</Tooltip>

// Error tooltip (styled red, always visible)
<Tooltip
  error={emailError}
  visible={Boolean(emailError)}
  placement="bottom"
>
  <EmailInput />
</Tooltip>

// Dynamic content based on state
<Tooltip content={({ isDisabled }) =>
  isDisabled
    ? 'You need admin rights to perform this action.'
    : 'Export all data as CSV.'
}>
  <ExportButton disabled={!isAdmin} />
</Tooltip>`,
      },
    },
    {
      id: 'tt-placement',
      title: 'Smart positioning',
      content: `The tooltip automatically detects the best position based on available viewport space.
It never clips or overflows — flipping and shifting happen automatically.`,
      code: {
        filename: 'Placement.tsx',
        lang: 'tsx',
        code: `// Auto (default) — picks the best position
<Tooltip content="Calculated automatically" placement="auto">

// Fixed with fallback
<Tooltip
  content="Prefers top, falls back if clipped"
  placement="top"
  fallbackPlacements={['bottom', 'right']}
>

// Fine-grained control
<Tooltip
  content="Custom offset"
  placement="right"
  offset={12}                    // px from element
  placementOffset={{ x: 0, y: -8 }}  // additional nudge
  arrowPlacement="start"         // "start" | "center" | "end"
  flip={false}                   // never flip sides
  shift={true}                   // allow shifting along axis
  overflow="prevent"             // keep fully in viewport
>

// Available placements:
// "auto", "top", "bottom", "left", "right"
// "top-start", "top-end"
// "bottom-start", "bottom-end"
// "left-start", "left-end"
// "right-start", "right-end"`,
      },
    },
    {
      id: 'tt-rich',
      title: 'Rich content',
      content: 'Pass any ReactNode as content — text, images, buttons, or the pre-built TooltipContent.',
      code: {
        filename: 'RichContent.tsx',
        lang: 'tsx',
        code: `import { Tooltip, TooltipContent } from '@runilib/tooltip'

// Pre-built structured tooltip
<Tooltip content={
  <TooltipContent
    title="Archive project"
    description="Moves this project to archives. You can restore it later."
    image={<img src="/icons/archive.svg" width={40} alt="" />}
    shortcut="⌘⇧A"
    actions={[
      { label: 'Learn more',      href: '/docs/archive' },
      { label: "Don't show again", onClick: () => dismiss('archive') },
    ]}
    badge="Pro"
  />
} trigger={['hover', 'focus']}>
  <ArchiveButton />
</Tooltip>

// Keyboard shortcuts list
<Tooltip content={
  <div style={{ padding: '8px 4px' }}>
    <strong style={{ display: 'block', marginBottom: 8 }}>
      Keyboard shortcuts
    </strong>
    {[
      { key: '⌘K',    label: 'Command palette' },
      { key: '⌘N',    label: 'New task' },
      { key: '⌘/',    label: 'Search' },
    ].map(({ key, label }) => (
      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
        <span>{label}</span>
        <kbd>{key}</kbd>
      </div>
    ))}
  </div>
} trigger={['click']}>
  <KeyboardHelpButton />
</Tooltip>`,
      },
    },
    {
      id: 'tt-triggers',
      title: 'Triggers',
      content: `Multiple trigger types — hover (web), click, focus, longPress (native), manual.`,
      code: {
        filename: 'Triggers.tsx',
        lang: 'tsx',
        code: `// Web — hover + focus (full accessibility)
<Tooltip content="Archive" trigger={['hover', 'focus']}>

// Click toggle (stays open)
<Tooltip content={<ProfileMenu />} trigger={['click']}>

// Long-press (mobile)
<Tooltip content="Hold for options" trigger={['longPress']} longPressDelay={500}>

// Manual control
const ref = useRef<TooltipHandle>(null)

<Tooltip ref={ref} content="Guided action!" trigger={['manual']}>
  <TargetElement />
</Tooltip>

ref.current?.show()
setTimeout(() => ref.current?.hide(), 3000)

// Context menu (right-click)
<Tooltip content={<ContextMenu />} trigger={['contextMenu']}>

// Combined triggers
<Tooltip trigger={['hover', 'focus', 'click']}>

// Hover intent (prevent flicker in dense UIs)
<Tooltip
  trigger={['hover']}
  hoverIntent={{ sensitivity: 6, interval: 100, timeout: 350 }}
  showDelay={400}
  hideDelay={200}
>`,
      },
    },
    {
      id: 'tt-spotlight',
      title: 'Spotlight mode',
      content: 'Dim the entire screen except the target element — perfect for feature announcements.',
      code: {
        filename: 'Spotlight.tsx',
        lang: 'tsx',
        code: `import { Tooltip, TooltipContent } from '@runilib/tooltip'

// Basic spotlight
<Tooltip
  spotlight={true}
  spotlightPadding={8}
  spotlightBorderRadius={12}
  content={
    <TooltipContent
      title="New: Command Palette ⚡"
      description="Press ⌘K to open the command palette from anywhere."
      badge="New"
      actions={[
        { label: 'Try it now',  onClick: openCommandPalette },
        { label: 'Later',       onClick: dismiss },
      ]}
    />
  }
  trigger={['manual']}
  visible={showFeatureAnnouncement}
  onHide={() => setShowFeatureAnnouncement(false)}
>
  <CommandPaletteButton />
</Tooltip>

// Spotlight with pulsing animation
<Tooltip
  spotlight={{
    enabled:        true,
    pulse:          true,
    pulseColor:     '#00e5c8',
    overlayOpacity: 0.65,
    overlayColor:   '#000',
  }}
  content="Complete this step to continue."
>
  <NextStepButton />
</Tooltip>`,
      },
    },
    {
      id: 'tt-theme',
      title: 'Theming',
      content: 'Complete theme customisation — works on web and React Native.',
      code: {
        filename: 'theming.tsx',
        lang: 'tsx',
        code: `import { TooltipProvider, createTheme } from '@runilib/tooltip'
import { darkTheme } from '@runilib/tooltip/themes'

// Extend an existing theme
const myTheme = createTheme(darkTheme, {
  background:   '#1a1a2e',
  color:        '#edf2f7',
  border:       '1px solid rgba(0,229,200,0.2)',
  borderRadius: 12,
  padding:      '10px 16px',
  fontSize:     13,
  fontWeight:   500,
  shadow:       '0 8px 32px rgba(0,0,0,0.4)',
  arrow: {
    size:  8,
    color: '#1a1a2e',
  },
  maxWidth: 300,
})

// Apply globally
<TooltipProvider theme={myTheme}>
  <App />
</TooltipProvider>

// Available built-in themes:
import { lightTheme, darkTheme, glassTheme, minimalTheme }
  from '@runilib/tooltip/themes'

// Per-instance override
<Tooltip theme={{ background: '#dc2626' }} content="Danger!">
  <DeleteButton />
</Tooltip>`,
      },
    },
  ],
}

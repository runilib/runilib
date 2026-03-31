> This repository is a read-only mirror of the package maintained in the main Runilib monorepo.  
> Please open code contributions in the main monorepo. 

# @runilib/react-walkit

> Cross-platform onboarding & guided tour — **same TypeScript API on React (web) and React Native**.  
> No code changes needed when switching platforms.

[![npm version](https://img.shields.io/npm/v/@runilib/react-walkit.svg)](https://www.npmjs.com/package/@runilib/react-walkit)
[![license](https://img.shields.io/npm/l/@runilib/react-walkit.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)](https://www.typescriptlang.org/)
[![platform](https://img.shields.io/badge/platform-web%20%7C%20react--native-brightgreen.svg)]()

---

## Documentation

For the full documentation, API reference, examples, and platform notes, visit:  
[https://runilib.dev/docs/react-walkit](https://runilib.dev/docs/react-walkit)

---

## Features

|     |                                                                      |
| --- | -------------------------------------------------------------------- |
| ✅  | **Truly cross-platform** — one API for React web and React Native    |
| 🎨  | **6 animation types** — `fade` `slide` `zoom` `bounce` `flip` `glow` |
| 🔦  | **Animated SVG spotlight** — smooth cutout around your elements      |
| 💅  | **Fully themeable** — colors, shapes, labels, custom @runilib/react-walkit         |
| 🧩  | **TypeScript-first** — 100% typed, no `any` in public API            |
| 🧪  | **Tested** — unit tests for all core logic                           |
| 💡  | **Zero config** — works out of the box                               |

---

## Installation

```bash
npm install @runilib/react-walkit
# or
yarn add @runilib/react-walkit
```

### Peer dependencies

**React (web)**

```bash
npm install react react-dom
```

**React Native**

```bash
npm install react react-native react-native-svg
# Expo:
npx expo install react-native-svg
```

---

## Quick Start

### 1 — Wrap your app with `<WalkitProvider>`

```tsx
import { WalkitProvider } from '@runilib/react-walkit';

export default function App() {
  return (
    <WalkitProvider animationType="slide">
      <MyScreen />
    </WalkitProvider>
  );
}
```

### 2 — Register steps with `<WalkitStep>`

```tsx
import { WalkitStep } from '@runilib/react-walkit';

function MyScreen() {
  return (
    <View>
      <WalkitStep name="logo" sequence={1} title="Welcome!" text="This is our app.">
        <Image source={logo} />
      </WalkitStep>

      <WalkitStep name="search" sequence={2} title="Search" text="Find anything here.">
        <TextInput placeholder="Search…" />
      </WalkitStep>

      <StartButton />
    </View>
  );
}
```

### 3 — Control the tour with `useWalkit`

```tsx
import { useWalkit } from '@runilib/react-walkit';

function StartButton() {
  const { start } = useWalkit();
  return <Button onPress={() => start()} title="Start Tour" />;
}
```

---

## Props Reference

### `<WalkitProvider>`

| Prop                    | Type                    | Default                 | Description                                |
| ----------------------- | ----------------------- | ----------------------- | ------------------------------------------ |
| `animationType`         | `AnimationType`         | `'slide'`               | Tooltip entrance animation                 |
| `theme`                 | `WalkitTheme`          | —                       | Color overrides                            |
| `tooltipStyle`          | `object`                | —                       | Extra styles on the @runilib/react-walkit container      |
| `overlayColor`          | `string`                | `'rgba(15,15,25,0.72)'` | Backdrop RGBA color                        |
| `spotlightPadding`      | `number`                | `8`                     | Extra space around the highlighted element |
| `spotlightBorderRadius` | `number`                | `8`                     | Corner radius of the spotlight cutout      |
| `steps`                 | `Array<{ id: string; sequence: number; route?: string }>` | — | Optional global flow definition for tours spanning multiple pages/screens |
| `stopOnOutsideClick`         | `boolean`               | `false`                 | Close the tour when clicking the backdrop  |
| `labels`                | `TooltipLabels`         | —                       | Override button labels                     |
| `renderPopover`         | `(props) => ReactNode`  | —                       | Fully custom @runilib/react-walkit renderer              |
| `onFlowStepChange`      | `({ action, toStep, fromStep }) => void \| Promise<void>` | — | Called when the next flow step is not mounted and the app must navigate or reveal UI |
| `stepMountTimeoutMs`    | `number`                | `5000`                  | How long Walkit waits for the requested target step to mount after `onFlowStepChange` |
| `onStart`               | `() => void`            | —                       | Called when the tour starts                |
| `onStop`                | `() => void`            | —                       | Called when the tour ends                  |
| `onStepChange`          | `(step, index) => void` | —                       | Called on each step change                 |

### `<WalkitStep>`

| Prop        | Type               | Default      | Description                   |
| ----------- | ------------------ | ------------ | ----------------------------- |
| `name`      | `string`           | **required** | Unique identifier             |
| `sequence`  | `number`           | **required** | Display sequence (ascending)  |
| `title`     | `string`           | —            | Tooltip title                 |
| `text`      | `string`           | —            | Tooltip description           |
| `route`     | `string`           | —            | Optional route/screen metadata used by provider-level multi-page flows |
| `placement` | `Placement` | `'auto'`     | Preferred @runilib/react-walkit side        |
| `active`    | `boolean`          | `true`       | Set `false` to skip this step |
| `autoStart` | `boolean \| 'always' \| 'once' \| { mode?: 'always' \| 'once'; key?: string; delay?: number }` | — | Auto-start the tour from this step |
| `renderPopover` | `(props) => ReactNode` | — | Custom popover renderer for this step only |

### `useWalkit()` — return values

| Property           | Type                               | Description                          |
| ------------------ | ---------------------------------- | ------------------------------------ |
| `start(stepName?)` | `(name?: string) => Promise<void>` | Start (optionally from a named step) |
| `stop()`           | `() => void`                       | Close the tour                       |
| `next()`           | `() => void`                       | Advance one step                     |
| `prev()`           | `() => void`                       | Go back one step                     |
| `goTo(index)`      | `(i: number) => Promise<void>`     | Jump to step by 0-based index        |
| `currentStep`      | `TooltipStepData \| null`          | Active step object                   |
| `isRunning`        | `boolean`                          | Whether the tour is active           |
| `totalSteps`       | `number`                           | Total registered steps               |
| `currentIndex`     | `number`                           | 0-based current index                |
| `isFirstStep`      | `boolean`                          | True on step 0                       |
| `isLastStep`       | `boolean`                          | True on the last step                |

---

## Animation Types

```tsx
type AnimationType = 'fade' | 'slide' | 'zoom' | 'bounce' | 'flip' | 'glow';
```

| Type     | Description                            |
| -------- | -------------------------------------- |
| `fade`   | Simple opacity transition              |
| `slide`  | Slides in from the placement direction |
| `zoom`   | Scales from 85% to 100%                |
| `bounce` | Springy overshoot scale-in             |
| `flip`   | 3D perspective flip on X axis          |
| `glow`   | Scale + glow shadow                    |

```tsx
<WalkitProvider animationType="bounce">
```

---

## Theming

```tsx
<WalkitProvider
  theme={{
    primary:      '#10b981',  // button + active dot
    primaryText:  '#ffffff',
    background:   '#1e1e2e',  // @runilib/react-walkit background (dark mode)
    text:         '#f9fafb',
    subtext:      '#9ca3af',
    border:       '#374151',
  }}
>
```

All keys are optional — unset keys fall back to the built-in defaults.

---

## Custom Tooltip

Replace the default @runilib/react-walkit with your own UI:

```tsx
import type { RenderWalkitStepProps } from '@runilib/react-walkit';

<WalkitProvider
  renderPopover={({
    walkitStep,
    walkitStepIndex,
    totalWalkitSteps,
    onNext,
    onPrev,
    onStop,
  }: RenderWalkitStepProps) => (
    <View style={styles.myTooltip}>
      <Text>{walkitStep.title}</Text>
      <Text>{walkitStep.content}</Text>
      <Text>{walkitStepIndex + 1} / {totalWalkitSteps}</Text>
      <Button
        onPress={onNext}
        title={walkitStepIndex === totalWalkitSteps - 1 ? 'Done' : 'Next'}
      />
    </View>
  )}
>
```

---

## Per-step custom Tooltip

Keep a global renderer on the provider, then override it for one specific step only:

```tsx
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
</WalkitStep>
```

When `WalkitStep.renderPopover` is provided, it takes priority over `WalkitProvider.renderPopover` for that active step only.

---

## Label overrides

```tsx
<WalkitProvider
  labels={{
    next:   'Suivant →',
    prev:   '← Retour',
    finish: 'Terminé 🎉',
    close:  'Fermer',
  }}
>
```

---

## Conditional steps

```tsx
const { isAdmin } = useUser();

<WalkitStep
  name="admin-panel"
  sequence={4}
  title="Admin Panel"
  text="Manage users and settings."
  active={isAdmin} // skipped when false
>
  <AdminButton />
</WalkitStep>;
```

---

## Start from a specific step

```tsx
const { start } = useWalkit();

// Jump directly to a named step
<Button onPress={() => start('settings')} title="Show Settings Step" />;
```

---

## Auto-start on page entry

```tsx
<WalkitStep
  id="settings-profile"
  sequence={1}
  title="Your profile"
  content="Update your personal information here."
  autoStart={{ mode: 'once', key: 'settings-tour', delay: 600 }}
>
  <ProfileCard />
</WalkitStep>
```

- `autoStart` or `autoStart="always"` starts the walkthrough automatically whenever this step mounts
- `autoStart="once"` starts it only once per app session
- `autoStart={{ mode: 'once', key, delay }}` lets you customize the session key and startup delay

The walkthrough starts from the step that defines `autoStart`, so users do not need to call `start()` manually when landing on that screen.

---

## Continue a tour across pages or screens

By default, Walkit only knows about the steps currently mounted in the tree. That is perfect for single-page tours, but it means `next()` cannot continue to a step that lives on another route or screen.

When a tour spans multiple pages, declare the full flow on the provider and let the app handle navigation:

- `steps` tells Walkit the global sequence, even for steps that are not mounted yet
- `onFlowStepChange` is called when the requested next/previous step is missing from the current screen
- `route` is optional metadata; Walkit does not navigate automatically, it simply passes the target step back to your app
- `stepMountTimeoutMs` lets you tune how long Walkit waits for the destination step to mount

On web, a common setup is `react-router`. On native, this works equally well with `expo-router`, `react-navigation`, or any custom navigation layer, as long as `onFlowStepChange` moves the user to the screen that contains the target step.

```tsx
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

const APP_TOUR_STEPS = [
  { id: 'dashboard-header', sequence: 1, route: '/' },
  { id: 'dashboard-filters', sequence: 2, route: '/' },
  { id: 'settings-profile', sequence: 3, route: '/settings' },
  { id: 'settings-billing', sequence: 4, route: '/settings' },
];

function TourApp() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <WalkitProvider
      steps={APP_TOUR_STEPS}
      onFlowStepChange={({ toStep }) => {
        if (!toStep.route || toStep.route === location.pathname) {
          return;
        }

        navigate(toStep.route, { replace: true });
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
  );
}

<BrowserRouter>
  <TourApp />
</BrowserRouter>;
```

```tsx
<WalkitStep
  id="settings-profile"
  sequence={3}
  route="/settings"
  title="Your profile"
  content="Update your personal information here."
>
  <ProfileCard />
</WalkitStep>
```

This is especially useful when a tour starts on a dashboard, then needs to continue inside settings, profile, billing, or any other screen without splitting the experience into multiple unrelated tours.

If you do not provide `steps`, Walkit keeps its original simple behavior and only works with the steps mounted on the current page/screen.

---

## Programmatic control

```tsx
function TourBar() {
  const { isRunning, currentIndex, totalSteps, currentStep, next, prev, stop } = useWalkit();

  if (!isRunning) return null;

  return (
    <View style={styles.bar}>
      <Text>
        {currentStep?.title} — {currentIndex + 1} / {totalSteps}
      </Text>
      <Button onPress={prev} title="← Back" />
      <Button onPress={next} title="Next →" />
      <Button onPress={stop} title="✕ Quit" />
    </View>
  );
}
```

---

## Event callbacks

```tsx
<WalkitProvider
  onStart={() => analytics.track('tour_started')}
  onStop={() => analytics.track('tour_ended')}
  onStepChange={(step, index) =>
    analytics.track('tour_step', { name: step.name, index })
  }
>
```

---

## Placement options

```tsx
type Placement = 'auto' | 'top' | 'bottom' | 'left' | 'right';
```

`'auto'` tries `bottom → top → right → left` and picks the first one that fits on screen.

---

## Caveats

**React Native:**

- `react-native-svg` is **required** for the spotlight effect.
- `<WalkitStep>` wraps the child in an extra `<View collapsable={false}>`. Override layout with a parent style if needed.
- On Android, set `<StatusBar translucent>` so the overlay covers the status bar.

**Web:**

- The overlay is a React portal rendered into `document.body`.
- The spotlight is SVG-based — no extra CSS needed.
- Tooltip uses `position: fixed` — works with `overflow: hidden` ancestors.

---

## Publishing to npm

```bash
npm run build       # compiles TypeScript → dist/
npm run test        # runs Jest test suite
npm publish --access public
```

---

## Roadmap

- [ ] Keyboard navigation (Escape, arrow keys)
- [ ] Persistent tour state (AsyncStorage / localStorage)
- [ ] Multi-screen tours (React Navigation / React Router)
- [ ] More spotlight shapes (circle, pill)
- [ ] Accessibility (ARIA live region, focus trap)

---

## Contributing

Issues and PRs are welcome.  
Please open an issue first for major changes.

---

## License

MIT © AKS

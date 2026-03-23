
```md
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
      <WalkitStep name="logo" order={1} title="Welcome!" text="This is our app.">
        <Image source={logo} />
      </WalkitStep>

      <WalkitStep name="search" order={2} title="Search" text="Find anything here.">
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
| `stopOnOutsideClick`         | `boolean`               | `false`                 | Close the tour when clicking the backdrop  |
| `labels`                | `TooltipLabels`         | —                       | Override button labels                     |
| `renderPopover`         | `(props) => ReactNode`  | —                       | Fully custom @runilib/react-walkit renderer              |
| `onStart`               | `() => void`            | —                       | Called when the tour starts                |
| `onStop`                | `() => void`            | —                       | Called when the tour ends                  |
| `onStepChange`          | `(step, index) => void` | —                       | Called on each step change                 |

### `<WalkitStep>`

| Prop        | Type               | Default      | Description                   |
| ----------- | ------------------ | ------------ | ----------------------------- |
| `name`      | `string`           | **required** | Unique identifier             |
| `order`     | `number`           | **required** | Display order (ascending)     |
| `title`     | `string`           | —            | Tooltip title                 |
| `text`      | `string`           | —            | Tooltip description           |
| `placement` | `Placement` | `'auto'`     | Preferred @runilib/react-walkit side        |
| `active`    | `boolean`          | `true`       | Set `false` to skip this step |

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
import type { RenderTooltipProps } from '@runilib/react-walkit';

<WalkitProvider
  renderPopover={({ step, stepIndex, totalSteps, onNext, onPrev, onStop }: RenderTooltipProps) => (
    <View style={styles.myTooltip}>
      <Text>{step.title}</Text>
      <Text>{step.text}</Text>
      <Text>{stepIndex + 1} / {totalSteps}</Text>
      <Button onPress={onNext} title={stepIndex === totalSteps - 1 ? 'Done' : 'Next'} />
    </View>
  )}
>
```

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
  order={4}
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

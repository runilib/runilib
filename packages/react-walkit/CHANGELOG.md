# Changelog

## 1.0.3

### Patch Changes

- [#47](https://github.com/runilib/runilib/pull/47) [`83a4cc1`](https://github.com/runilib/runilib/commit/83a4cc14b0dea01a63f50874522bd8eac217a696) Thanks [@akladekouassi](https://github.com/akladekouassi)! - update readme files

## 1.0.2

### Patch Changes

- [#45](https://github.com/runilib/runilib/pull/45) [`43e1173`](https://github.com/runilib/runilib/commit/43e117392f64af43c1f09fd9446b7581a34b1b15) Thanks [@akladekouassi](https://github.com/akladekouassi)! - update readme to support looping demo preview

## 1.0.1

### Patch Changes

- [#43](https://github.com/runilib/runilib/pull/43) [`115b0c3`](https://github.com/runilib/runilib/commit/115b0c357154fb1ba9d2793c4ffc9673ffdd85d1) Thanks [@akladekouassi](https://github.com/akladekouassi)! - add demo preview in the readme.

## 1.0.0

### Major Changes

- [#41](https://github.com/runilib/runilib/pull/41) [`f7e76fc`](https://github.com/runilib/runilib/commit/f7e76fc8ca200b2f64a02e147e89dceeaeb7673a) Thanks [@akladekouassi](https://github.com/akladekouassi)! - Initial public release of `@runilib/react-walkit`.

  Provides cross-platform product tours, onboarding walkthroughs, spotlight overlays, and contextual tooltips for React and React Native.

  - One shared API for React web and React Native
  - Guided tours with spotlight overlays and customizable popovers
  - Programmatic control with navigation and lifecycle events
  - Built-in tooltip primitive for contextual help and feature discovery

## 1.0.0

### Major Changes

- [#35](https://github.com/runilib/runilib/pull/35) [`eb16585`](https://github.com/runilib/runilib/commit/eb16585a0502a1f92db6377e8d63456f0df0b6a9) Thanks [@akladekouassi](https://github.com/akladekouassi)! - Initial public release of `@runilib/react-walkit`.

  Provides cross-platform product tours, onboarding walkthroughs, spotlight overlays, and contextual tooltips for React and React Native.

  - One shared API for React web and React Native
  - Guided tours with spotlight overlays and customizable popovers
  - Programmatic control with navigation and lifecycle events
  - Built-in tooltip primitive for contextual help and feature discovery

### Added - initial public release

`@runilib/react-walkit` is a cross-platform walkthrough and tooltip library for React and React Native. It focuses on onboarding tours, contextual guidance, and spotlight-driven product education with one shared API.

**Core walkthrough API**

- `WalkitProvider` to host the tour state, overlay, and renderer
- `WalkitStep` to register steps directly around real UI targets
- `useWalkit()` to start, stop, navigate, and inspect the current tour state
- `useWalkitEvent()` for lifecycle-driven analytics and side effects

**Tooltip primitive**

- `Tooltip` component for lightweight contextual help outside full walkthrough flows
- controlled and uncontrolled trigger patterns
- custom tooltip content via render functions and content API helpers

**Flow control**

- ordered multi-step flows with direct navigation and progress tracking
- support for conditional steps and flow change requests
- lifecycle hooks and analytics events for start, stop, step enter, step exit, and completion
- auto-start options for onboarding scenarios

**Rendering and motion**

- animated spotlight overlays on web and native
- auto-placement with viewport clamping
- built-in animation presets through `ANIMATION_TYPES`
- customizable popover rendering, labels, and theme options

**Platform support**

- one API for web and React Native
- web overlay rendering through a portal-based renderer
- native overlay rendering with platform-native primitives and `react-native-svg`
- packaged TypeScript declarations for both the default and `react-native` entry points

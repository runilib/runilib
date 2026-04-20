# Changelog

## [1.0.0] - 2026-03-17

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

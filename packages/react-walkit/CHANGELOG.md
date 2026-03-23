# Changelog

All notable changes are documented here.  
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) — versioning: [SemVer](https://semver.org/).

---

## [1.0.0] — 2026-03-17

### Added

- ✅ Initial release
- `<WalkProvider>` — wraps the app, hosts state and the overlay
- `<react-walkit>` — registers elements as tour steps, cross-platform
- `useWalk()` — TypeScript hook to control the tour programmatically
- 6 animations: `fade`, `slide`, `zoom`, `bounce`, `flip`, `glow`
- SVG animated spotlight for web (ReactDOM portal) and React Native (Modal)
- Auto-placement engine with viewport clamping (`'auto'` mode)
- Step progress dots indicator
- `renderPopover` prop for full custom react-walkit
- `theme` prop for color overrides
- `labels` prop for button label overrides
- `active` prop on `<WalkStep>` for conditional steps
- `onStart`, `onStop`, `onStepChange` lifecycle callbacks
- TypeScript-first: 100% typed source, `dist/*.d.ts` shipped
- Full unit test suite (positioning, animations, context, hook, step)
- Peer deps: React ≥ 17, react-dom (web), react-native, react-native-svg (native)

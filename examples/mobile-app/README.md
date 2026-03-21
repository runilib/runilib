# Taskflow — Mobile Example App

Demo app for **stepwise** (runilib) — a real task management app built with Expo.

## Stack
- Expo SDK 52 + React Native
- Expo Router (file-based routing)
- react-native-svg (required for stepwise spotlight)
- expo-haptics (haptic feedback)
- stepwise for onboarding

## Run

```bash
npm install
npm start          # opens Expo Go
npm run ios        # iOS simulator
npm run android    # Android emulator
```

## stepwise use cases demonstrated

1. **Auto-start on mount** — tour launches automatically after 900ms
2. **6-step tour** — greeting, stats card, filter bar, add button, task item, bottom nav
3. **Custom light theme** — warm white/amber palette
4. **Haptic feedback** — native feedback on task interactions
5. **Conditional step** — task-item step only on the first item (`active={idx === 0}`)
6. **Restart button** — tap "▶ Tour" in the header to replay
7. **onStepChange callback** — logs to Expo console on each step

## Same API as the web app

```tsx
// Exact same code as in the web app — only the wrapped element changes
<TooltipStep name="add-task" order={2} title="Add tasks" text="Tap to add.">
  <TouchableOpacity style={s.addBtn}>   {/* RN element */}
    <Text>+ Add</Text>
  </TouchableOpacity>
</TooltipStep>
```

## Project structure

```
mobile-app/
├── app/
│   ├── _layout.tsx     ← TooltipProvider wraps everything here
│   └── index.tsx       ← Main dashboard screen
├── tourConfig.ts       ← Centralised step definitions + theme
└── package.json
```

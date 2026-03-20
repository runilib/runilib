# Taskflow — Web Example App

Demo app for **stepwise** (runilib) — a real task management dashboard.

## Stack
- Vite + React 18 + TypeScript
- stepwise for onboarding

## Run

```bash
npm install
npm run dev
# → http://localhost:5173
```

## stepwise use cases demonstrated

1. **Auto-start on first visit** — tour launches automatically after 800ms
2. **7-step tour** — covers sidebar, header, stats, filters, new task button, task cards, notifications
3. **Custom dark theme** — amber palette matching the app design
4. **Restart tour** — button in the header to replay anytime
5. **Placement auto** — `auto` placement on most steps, `right` on sidebar, `bottom` on header
6. **Conditional step** — task-card step only active on the first card (`active={i === 0}`)
7. **onStepChange callback** — logs to console on each step

## How to add stepwise to your own app

```tsx
// 1. Wrap your app
<CopilotProvider animationType="bounce" theme={myTheme}>
  <App />
</CopilotProvider>

// 2. Register steps
<CopilotStep name="my-button" order={1} title="Hello" text="Click here to do X">
  <button>My Button</button>
</CopilotStep>

// 3. Start
const { start } = useCopilot();
<button onClick={() => start()}>Start Tour</button>
```

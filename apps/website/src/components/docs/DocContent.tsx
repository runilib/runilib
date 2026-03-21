import type React from "react";
import { CodeBlock } from "../ui/CodeBlock";
import styles from "./DocContent.module.css";

interface Props {
  lib: string;
  page: string;
}

export function DocContent({ page }: Props) {
  const map: Record<string, JSX.Element> = {
    introduction: <Introduction />,
    installation: <Installation />,
    "quick-start": <QuickStart />,
    provider: <Provider />,
    step: <Step />,
    "use-tooltip": <UseTooltip />,
    animations: <Animations />,
    theming: <Theming />,
    "custom-tooltip": <CustomTooltip />,
    typescript: <TypescriptGuide />,
    conditional: <Conditional />,
    callbacks: <Callbacks />,
  };
  return <article className={styles.article}>{map[page] ?? <Introduction />}</article>;
}

// ─── Shared primitives ────────────────────────────────────────────────────────
const H1 = ({ c }: { c: React.ReactNode }) => <h1 className={styles.h1}>{c}</h1>;
const Lead = ({ c }: { c: React.ReactNode }) => <p className={styles.lead}>{c}</p>;
const H2 = ({ c }: { c: React.ReactNode }) => <h2 className={styles.h2}>{c}</h2>;
const H3 = ({ c }: { c: React.ReactNode }) => <h3 className={styles.h3}>{c}</h3>;
const P = ({ c }: { c: React.ReactNode }) => <p className={styles.p}>{c}</p>;
const Tip = ({ c }: { c: React.ReactNode }) => <div className={styles.tip}>{c}</div>;
const Warn = ({ c }: { c: React.ReactNode }) => <div className={styles.warn}>{c}</div>;
const IC = ({ c }: { c: string }) => <code className="inline-code">{c}</code>;

function Table({ rows }: { rows: [string, string, string, string][] }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([prop, type, def, desc]) => (
            <tr key={prop}>
              <td>
                <IC c={prop} />
              </td>
              <td>
                <span className={styles.type}>{type}</span>
              </td>
              <td>
                <span className={styles.def}>{def}</span>
              </td>
              <td>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function Introduction() {
  return (
    <>
      <H1 c="Introduction" />
      <Lead
        c={
          <>
            <strong>tooltip</strong> is a cross-platform onboarding library. It works identically
            on React (web) and React Native — same API, same TypeScript types, same animations, same
            behavior.
          </>
        }
      />
      <H2 c="The Problem" />
      <P c="When building products for both web and mobile, developers often maintain two separate codebases for UI logic — one using DOM APIs, another using React Native primitives. Double code, double bugs, double maintenance." />
      <H2 c="The tooltip approach" />
      <P c="tooltip is built on a platform-agnostic core with thin platform adapters. The public API is 100% identical — the library detects the platform at runtime and uses the appropriate primitives automatically." />
      <Tip
        c={
          <>
            💡 You use the same import and the same props on both platforms. The only difference is
            which native element you wrap with <IC c="<TooltipStep>" />.
          </>
        }
      />
      <H2 c="Features" />
      <ul className={styles.list}>
        <li>
          6 animation types: <IC c="fade" />, <IC c="slide" />, <IC c="zoom" />, <IC c="bounce" />,{" "}
          <IC c="flip" />, <IC c="glow" />
        </li>
        <li>Animated SVG spotlight that follows each element</li>
        <li>Auto-placement engine with viewport clamping</li>
        <li>Step dots progress indicator</li>
        <li>
          Custom tooltip renderer via <IC c="renderTooltip" />
        </li>
        <li>Full theme support, label overrides, conditional steps</li>
        <li>
          100% TypeScript — zero <IC c="any" /> in the public API
        </li>
      </ul>
    </>
  );
}

function Installation() {
  return (
    <>
      <H1 c="Installation" />
      <Lead c="Install tooltip with npm or yarn. Each UniKit library is independent — install only what you use." />
      <H2 c="Install" />
      <CodeBlock code={`npm install tooltip\n# or\nyarn add tooltip`} />
      <H2 c="React (web) peer dependencies" />
      <CodeBlock code="npm install react react-dom" />
      <H2 c="React Native peer dependencies" />
      <CodeBlock
        code={`npm install react react-native react-native-svg\n\n# Expo:\nnpx expo install react-native-svg`}
      />
      <Warn
        c={
          <>
            ⚠️ <strong>react-native-svg</strong> is required on native for the animated spotlight
            overlay.
          </>
        }
      />
    </>
  );
}

function QuickStart() {
  return (
    <>
      <H1 c="Quick Start" />
      <Lead c="Get your first onboarding tour running in under 5 minutes." />
      <H3 c="1. Wrap your app" />
      <CodeBlock
        filename="App.tsx"
        code={`import { TooltipProvider } from 'tooltip';\n\nexport default function App() {\n  return (\n    <TooltipProvider animationType="bounce">\n      <MyScreen />\n    </TooltipProvider>\n  );\n}`}
      />
      <H3 c="2. Register steps" />
      <CodeBlock
        filename="MyScreen.tsx"
        code={`import { TooltipStep } from 'tooltip';\n\n<TooltipStep name="search" order={1} title="Search" text="Find anything here.">\n  <input placeholder="Search…" />\n</TooltipStep>`}
      />
      <H3 c="3. Start the tour" />
      <CodeBlock
        filename="StartButton.tsx"
        code={`import { useTooltip } from 'tooltip';\n\nfunction StartButton() {\n  const { start } = useTooltip();\n  return <button onClick={() => start()}>Start Tour</button>;\n}`}
      />
      <Tip
        c={
          <>
            💡 <IC c="useTooltip" /> must be used inside a <IC c="<TooltipProvider>" />.
          </>
        }
      />
    </>
  );
}

function Provider() {
  const rows: [string, string, string, string][] = [
    ["animationType", "AnimationType", "'slide'", "Tooltip entrance animation"],
    ["theme", "TooltipTheme", "—", "Color overrides for the tooltip"],
    ["overlayColor", "string", "'rgba(15,15,25,0.72)'", "Backdrop RGBA color"],
    ["spotlightPadding", "number", "8", "Space around the highlighted element"],
    ["spotlightBorderRadius", "number", "8", "Border radius of the spotlight cutout"],
    ["stopOnOutsideClick", "boolean", "false", "Close on backdrop click"],
    ["labels", "TooltipLabels", "—", "Override next/prev/finish/close labels"],
    ["renderTooltip", "(props) => ReactNode", "—", "Render a custom tooltip"],
    ["onStart", "() => void", "—", "Called when the tour starts"],
    ["onStop", "() => void", "—", "Called when the tour ends"],
    ["onStepChange", "(step, i) => void", "—", "Called on each step change"],
  ];
  return (
    <>
      <H1 c="TooltipProvider" />
      <Lead c="Wraps your app or a screen to enable the tour. Manages all tour state and renders the spotlight overlay." />
      <CodeBlock
        filename="App.tsx"
        code={`<TooltipProvider\n  animationType="bounce"\n  spotlightPadding={10}\n  labels={{ next: 'Next →', finish: 'Done 🎉' }}\n  onStart={() => analytics.track('tour_started')}\n>\n  <App />\n</TooltipProvider>`}
      />
      <H2 c="Props" />
      <Table rows={rows} />
    </>
  );
}

function Step() {
  const rows: [string, string, string, string][] = [
    ["name", "string", "required", "Unique step identifier"],
    ["order", "number", "required", "Display order — steps are sorted ascending"],
    ["title", "string", "—", "Tooltip title text"],
    ["text", "string", "—", "Tooltip description text"],
    ["placement", "TooltipPlacement", "'auto'", "Preferred side: auto/top/bottom/left/right"],
    ["active", "boolean", "true", "Set false to skip this step"],
  ];
  return (
    <>
      <H1 c="TooltipStep" />
      <Lead c="Wraps a UI element and registers it as a tour step. Automatically measures the element's position." />
      <CodeBlock
        filename="Screen.tsx"
        code={`<TooltipStep\n  name="avatar"\n  order={3}\n  title="Your Profile"\n  text="Manage your account from here."\n  placement="left"\n  active={isLoggedIn}\n>\n  <Avatar src={user.avatar} />\n</TooltipStep>`}
      />
      <H2 c="Props" />
      <Table rows={rows} />
      <Tip
        c={
          <>
            📱 On React Native, <IC c="<TooltipStep>" /> wraps its child in a{" "}
            <IC c="<View collapsable={false}>" /> to prevent native view flattening.
          </>
        }
      />
    </>
  );
}

function UseTooltip() {
  return (
    <>
      <H1 c="useTooltip" />
      <Lead
        c={
          <>
            Main hook to control the tour. Must be used inside a <IC c="<TooltipProvider>" />.
          </>
        }
      />
      <CodeBlock
        code={`const {\n  start,        // (stepName?: string) => Promise<void>\n  stop,         // () => void\n  next,         // () => void\n  prev,         // () => void\n  goTo,         // (index: number) => Promise<void>\n  isRunning,    // boolean\n  currentStep,  // TooltipStepData | null\n  currentIndex, // number\n  totalSteps,   // number\n  isFirstStep,  // boolean\n  isLastStep,   // boolean\n} = useTooltip();`}
      />
      <H3 c="Examples" />
      <CodeBlock
        code={`// Start from beginning\nstart();\n\n// Start from a named step\nstart('settings');\n\n// Jump to step by index\ngoTo(2);`}
      />
    </>
  );
}

function Animations() {
  const anims = [
    ["fade", "Simple opacity transition"],
    ["slide", "Slides in from the placement direction"],
    ["zoom", "Scales from 85% → 100%"],
    ["bounce", "Springy overshoot (spring physics on native)"],
    ["flip", "3D perspective flip on X axis"],
    ["glow", "Scale + glow shadow effect"],
  ];
  return (
    <>
      <H1 c="Animations" />
      <Lead c="Six built-in animation types. Each runs natively on both web (CSS keyframes) and React Native (Animated API)." />
      <div className={styles.animGrid}>
        {anims.map(([name, desc]) => (
          <div key={name} className={styles.animCard}>
            <IC c={name} />
            <p>{desc}</p>
          </div>
        ))}
      </div>
      <CodeBlock code={`<TooltipProvider animationType="bounce">`} />
    </>
  );
}

function Theming() {
  return (
    <>
      <H1 c="Theming" />
      <Lead c="Customise tooltip colors to match your brand. All keys are optional." />
      <CodeBlock
        filename="App.tsx"
        code={`<TooltipProvider\n  theme={{\n    primary:     '#10b981',  // button + active dot\n    primaryText: '#ffffff',\n    background:  '#1e1e2e',  // dark tooltip\n    text:        '#f9fafb',\n    subtext:     '#9ca3af',\n    border:      '#374151',\n  }}\n>`}
      />
      <H2 c="Dark mode" />
      <CodeBlock
        code={`const isDark = useColorScheme() === 'dark';\n\n<TooltipProvider\n  theme={isDark\n    ? { background: '#1e1e2e', text: '#f9fafb', subtext: '#9ca3af', border: '#374151' }\n    : { background: '#ffffff', text: '#1e1e2e', subtext: '#6b7280', border: '#e5e7eb' }\n  }\n>`}
      />
    </>
  );
}

function CustomTooltip() {
  return (
    <>
      <H1 c="Custom Tooltip" />
      <Lead
        c={
          <>
            Replace the default tooltip with your own component using the <IC c="renderTooltip" />{" "}
            prop.
          </>
        }
      />
      <CodeBlock
        filename="App.tsx"
        code={`import type { RenderTooltipProps } from 'tooltip';\n\n<TooltipProvider\n  renderTooltip={({ step, stepIndex, totalSteps, onNext, onPrev, onStop }: RenderTooltipProps) => (\n    <View style={styles.tooltip}>\n      <Text>{step.title}</Text>\n      <Text>{step.text}</Text>\n      <Text>{stepIndex + 1} / {totalSteps}</Text>\n      <Button onPress={onNext} title={stepIndex === totalSteps - 1 ? 'Done' : 'Next'} />\n    </View>\n  )}\n>`}
      />
      <Tip c="When using renderTooltip, you control the entire tooltip UI — arrows and dots are not rendered automatically." />
    </>
  );
}

function TypescriptGuide() {
  return (
    <>
      <H1 c="TypeScript" />
      <Lead c="tooltip is written 100% in TypeScript. All types are exported from the main entry point." />
      <CodeBlock
        code={`import type {\n  AnimationType,        // 'fade' | 'slide' | 'zoom' | 'bounce' | 'flip' | 'glow'\n  TooltipPlacement,     // 'auto' | 'top' | 'bottom' | 'left' | 'right'\n  TooltipTheme,\n  TooltipLabels,\n  TooltipStepData,\n  TooltipRect,\n  RenderTooltipProps,\n  TooltipProviderProps,\n  TooltipStepProps,\n  UseTooltipReturn,\n} from 'tooltip';`}
      />
    </>
  );
}

function Conditional() {
  return (
    <>
      <H1 c="Conditional Steps" />
      <Lead
        c={
          <>
            Use the <IC c="active" /> prop to include or exclude a step at runtime. When false, the
            step is not registered.
          </>
        }
      />
      <CodeBlock
        code={`const { isAdmin } = useUser();\n\n<TooltipStep\n  name="admin-panel"\n  order={4}\n  title="Admin Panel"\n  text="Manage users and settings."\n  active={isAdmin}\n>\n  <AdminButton />\n</TooltipStep>`}
      />
      <Tip
        c={
          <>
            💡 The <IC c="active" /> prop is reactive — it updates the step list automatically when
            it changes.
          </>
        }
      />
    </>
  );
}

function Callbacks() {
  return (
    <>
      <H1 c="Callbacks" />
      <Lead c="Integrate tooltip with your analytics, state management, or custom logic using lifecycle callbacks." />
      <H2 c="onStart / onStop" />
      <CodeBlock
        code={`<TooltipProvider\n  onStart={() => {\n    analytics.track('tour_started');\n    setTourSeen(true);\n  }}\n  onStop={() => {\n    analytics.track('tour_ended');\n  }}\n>`}
      />
      <H2 c="onStepChange" />
      <CodeBlock
        code={`<TooltipProvider\n  onStepChange={(step, index) => {\n    analytics.track('tour_step', { name: step.name, index });\n  }}\n>`}
      />
    </>
  );
}

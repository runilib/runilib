import { Link, Navigate, useParams } from "react-router-dom";
import { CodeBlock } from "../components/ui/CodeBlock";
import { LIBRARIES } from "../data/libraries";
import styles from "./LibraryPage.module.css";

export function LibraryPage() {
  const { slug } = useParams<{ slug: string }>();
  const lib = LIBRARIES.find((l) => l.slug === slug);
  if (!lib) return <Navigate to="/" replace />;
  const ok = lib.status === "stable" || lib.status === "beta";

  return (
    <main className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.back}>
          ← All Libraries
        </Link>
        <div className={styles.titleRow}>
          <div className={styles.icon} style={{ "--c": lib.color } as React.CSSProperties}>
            {lib.icon}
          </div>
          <div>
            <h1 className={styles.h1}>{lib.name}</h1>
            <p className={styles.tagline}>{lib.tagline}</p>
          </div>
        </div>
        <div className={styles.meta}>
          {lib.status === "stable" && (
            <span className={`${styles.b} ${styles.stable}`}>v{lib.version} stable</span>
          )}
          {lib.status === "coming-soon" && (
            <span className={`${styles.b} ${styles.soon}`}>Coming soon</span>
          )}
          {ok && (
            <>
              <span className={`${styles.b} ${styles.web}`}>React</span>
              <span className={`${styles.b} ${styles.native}`}>React Native</span>
              <span className={`${styles.b} ${styles.ts}`}>TypeScript</span>
            </>
          )}
        </div>

        {ok ? (
          <div className={styles.content}>
            <p className={styles.desc}>{lib.description}</p>
            <div className={styles.actions}>
              <Link to={`/docs/${lib.slug}/introduction`} className="btn-primary">
                Read the Docs →
              </Link>
              <a href={lib.github} target="_blank" rel="noreferrer" className="btn-outline">
                View on GitHub
              </a>
            </div>
            <h2 className={styles.h2}>Install</h2>
            <CodeBlock code={`npm install ${lib.npm}`} />
            <h2 className={styles.h2}>Quick usage</h2>
            <CodeBlock
              filename="App.tsx"
              code={`import { TooltipProvider, TooltipStep, useTooltip } from '${lib.npm}';\n\nexport default function App() {\n  return (\n    <TooltipProvider animationType="bounce">\n      <MyScreen />\n    </TooltipProvider>\n  );\n}\n\nfunction MyScreen() {\n  const { start } = useTooltip();\n  return (\n    <div>\n      <TooltipStep name="btn" order={1} title="Hello!" text="This is step one.">\n        <button>My Button</button>\n      </TooltipStep>\n      <button onClick={() => start()}>Start Tour</button>\n    </div>\n  );\n}`}
            />
            <div className={styles.tags}>
              {lib.tags.map((t) => (
                <span key={t} className={styles.tag}>
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.soon2}>
            <div className={styles.soonIcon}>🚧</div>
            <h2 className={styles.soonTitle}>{lib.name} is coming soon</h2>
            <p className={styles.soonDesc}>{lib.description}</p>
            <Link to="/" className="btn-outline">
              ← Back to Libraries
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

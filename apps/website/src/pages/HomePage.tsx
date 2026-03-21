import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LibCard } from "../components/home/LibCard";
import { CodeBlock } from "../components/ui/CodeBlock";
import { LIBRARIES } from "../data/libraries";
import styles from "./HomePage.module.css";

export function HomePage() {
  return (
    <main>
      <Hero />
      <Stats />
      <div className="divider" />
      <Libraries />
      <div className="divider" />
      <Why />
      <div className="divider" />
      <CodeDemo />
      <div className="divider" />
      <Cta />
    </main>
  );
}

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} />
      <div className={styles.glow2} />
      <div className={`${styles.badge} animate-fadeup`} style={{ animationDelay: "0ms" }}>
        <span>✦</span> Universal React Ecosystem
      </div>
      <h1 className={`${styles.h1} animate-fadeup`} style={{ animationDelay: "80ms" }}>
        One API.
        <br />
        <em className={styles.gradient}>Every Platform.</em>
      </h1>
      <p className={`${styles.sub} animate-fadeup`} style={{ animationDelay: "160ms" }}>
        A curated collection of cross-platform libraries that work identically on React and React
        Native — no rewrites, no compromises.
      </p>
      <div className={`${styles.actions} animate-fadeup`} style={{ animationDelay: "240ms" }}>
        <Link to="/docs/tooltip/introduction" className="btn-primary">
          Get Started →
        </Link>
        <a href="#libraries" className="btn-outline">
          Browse Libraries
        </a>
      </div>
      <div className={`${styles.platforms} animate-fadeup`} style={{ animationDelay: "320ms" }}>
        <div className={styles.pill}>
          <span className={styles.dotG} />
          React
        </div>
        <span className={styles.sep}>+</span>
        <div className={styles.pill}>
          <span className={styles.dotP} />
          React Native
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { v: "1", l: "Library released" },
    { v: "2", l: "Platforms supported" },
    { v: "0", l: "API differences" },
    { v: "TS", l: "TypeScript-first" },
  ];
  return (
    <div className="container">
      <div className={styles.statsRow}>
        {items.map((i) => (
          <div key={i.l} className={styles.statItem}>
            <div className={styles.statVal}>{i.v}</div>
            <div className={styles.statLbl}>{i.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Libraries() {
  return (
    <section id="libraries" className={`container ${styles.section}`}>
      <div className="section-label">Libraries</div>
      <h2 className={styles.h2}>
        Everything you need,
        <br />
        everywhere you build.
      </h2>
      <p className={styles.desc}>
        Each library provides an identical developer experience across platforms.
      </p>
      <div className={styles.grid}>
        {LIBRARIES.map((lib) => (
          <LibCard key={lib.slug} lib={lib} />
        ))}
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: "⚡",
    title: "Identical API",
    desc: "Same import, same props, same hooks — regardless of platform. Zero mental overhead.",
  },
  {
    icon: "🔷",
    title: "TypeScript-first",
    desc: "Full TypeScript definitions shipped with every library. Zero `any` in the public API.",
  },
  {
    icon: "🧪",
    title: "Tested & reliable",
    desc: "Comprehensive unit tests for every library. Ship to production with confidence.",
  },
  {
    icon: "🎨",
    title: "Platform-native feel",
    desc: "Uses Animated/Modal on native, DOM APIs on web. Both feel at home on their platform.",
  },
  {
    icon: "📦",
    title: "Tree-shakable",
    desc: "Every package is marked sideEffects: false. Bundle only what you use.",
  },
  {
    icon: "🔌",
    title: "Composable",
    desc: "Libraries work independently or together. No forced coupling, no shared globals.",
  },
];

function Why() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.visible);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(`.${styles.feat}`).forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 60}ms`;
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <section id="why" className={`container ${styles.section}`}>
      <div className="section-label">Why UniKit</div>
      <h2 className={styles.h2}>
        Stop writing the same
        <br />
        thing twice.
      </h2>
      <p className={styles.desc}>
        Every library follows strict principles so you can focus on your product.
      </p>
      <div className={styles.featGrid} ref={ref}>
        {FEATURES.map((f) => (
          <div key={f.title} className={styles.feat}>
            <div className={styles.featIcon}>{f.icon}</div>
            <h3 className={styles.featTitle}>{f.title}</h3>
            <p className={styles.featDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const WEB_CODE = `// React Web\nimport { TooltipProvider, TooltipStep, useTooltip } from '@runilib/tooltip';\n\nexport default function App() {\n  return (\n    <TooltipProvider animationType="bounce">\n      <Dashboard />\n    </TooltipProvider>\n  );\n}\n\nfunction Dashboard() {\n  const { start } = useTooltip();\n  return (\n    <div>\n      <TooltipStep name="search" order={1} title="Search" text="Find anything here.">\n        <input placeholder="Search…" />\n      </TooltipStep>\n      <button onClick={() => start()}>Start Tour</button>\n    </div>\n  );\n}`;

const RN_CODE = `// React Native\nimport { TooltipProvider, TooltipStep, useTooltip } from '@runilib/tooltip';\n\nexport default function App() {\n  return (\n    <TooltipProvider animationType="bounce">\n      <Dashboard />\n    </TooltipProvider>\n  );\n}\n\nfunction Dashboard() {\n  const { start } = useTooltip();\n  return (\n    <View>\n      <TooltipStep name="search" order={1} title="Search" text="Find anything here.">\n        <TextInput placeholder="Search…" />\n      </TooltipStep>\n      <TouchableOpacity onPress={() => start()}>\n        <Text>Start Tour</Text>\n      </TouchableOpacity>\n    </View>\n  );\n}`;

function CodeDemo() {
  const [tab, setTab] = useState<"web" | "native">("web");
  return (
    <section className={`container ${styles.section}`}>
      <div className="section-label">Same API</div>
      <h2 className={styles.h2}>Write once. That's it.</h2>
      <p className={styles.desc}>Switch between React and React Native — the code is identical.</p>
      <div className={styles.demo}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "web" ? styles.tabActive : ""}`}
            onClick={() => setTab("web")}
          >
            <span className={`${styles.tabIcon} ${styles.tiReact}`}>⚛</span>React Web
          </button>
          <button
            className={`${styles.tab} ${tab === "native" ? styles.tabActive : ""}`}
            onClick={() => setTab("native")}
          >
            <span className={`${styles.tabIcon} ${styles.tiNative}`}>📱</span>React Native
          </button>
        </div>
        <div className={styles.codeWrap}>
          {tab === "web" && <CodeBlock code={WEB_CODE} filename="App.tsx" />}
          {tab === "native" && <CodeBlock code={RN_CODE} filename="App.tsx" />}
        </div>
        <div className={styles.same}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Same import · Same props · Same hooks · Zero code change between platforms
        </div>
      </div>
    </section>
  );
}

function Cta() {
  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard?.writeText("npm install @runilib/tooltip");
    const b = e.currentTarget;
    b.textContent = "✓ Copied!";
    b.style.color = "var(--accent3)";
    setTimeout(() => {
      if (b) {
        b.textContent = "⎘ Copy";
        b.style.color = "";
      }
    }, 2000);
  };
  return (
    <section className={`container ${styles.section}`}>
      <div className={styles.ctaBox}>
        <div className={styles.ctaGlow} />
        <h2 className={styles.h2} style={{ marginBottom: 12 }}>
          Ready to build universal?
        </h2>
        <p className={styles.ctaDesc}>
          Install your first library and start building on both platforms today.
        </p>
        <div className={styles.installRow}>
          <div className={styles.installBox}>
            <span className={styles.prompt}>$</span>
            <span>npm install @runilib/tooltip</span>
          </div>
          <button className={styles.copyBtn} onClick={handleCopy}>
            ⎘ Copy
          </button>
        </div>
        <div className={styles.ctaActions}>
          <Link to="/docs/tooltip/introduction" className="btn-primary">
            Read the Docs →
          </Link>
          <a
            href="https://github.com/your-org/unikit"
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

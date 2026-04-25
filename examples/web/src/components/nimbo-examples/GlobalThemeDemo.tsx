import { type ThemeMode, themeStore } from './themeStore';

const MODES: ThemeMode[] = ['light', 'dark', 'sepia'];

export function GlobalThemeDemo() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <ThemeControls />
      <ThemePreview />
      <ThemeReadout />
    </div>
  );
}

function ThemeControls() {
  const mode = themeStore.use((state) => state.mode);
  const { setMode, bigger, smaller, reset } = themeStore.useActions();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {MODES.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setMode(option)}
          style={{
            padding: '8px 14px',
            borderRadius: 999,
            border: '1px solid rgba(15,23,42,0.12)',
            background: mode === option ? '#0f172a' : '#fff',
            color: mode === option ? '#fff' : '#0f172a',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          {option}
        </button>
      ))}
      <span style={{ display: 'inline-flex', gap: 6, marginLeft: 'auto' }}>
        <button
          type="button"
          onClick={smaller}
          style={pillStyle}
        >
          A−
        </button>
        <button
          type="button"
          onClick={bigger}
          style={pillStyle}
        >
          A+
        </button>
        <button
          type="button"
          onClick={reset}
          style={{ ...pillStyle, color: '#b91c1c' }}
        >
          Reset
        </button>
      </span>
    </div>
  );
}

function ThemePreview() {
  const accent = themeStore.useSelector('accent');
  const fontScale = themeStore.use((state) => state.fontScale);
  const mode = themeStore.use((state) => state.mode);

  const surface = mode === 'dark' ? '#0f172a' : mode === 'sepia' ? '#fef3c7' : '#ffffff';
  const text = mode === 'dark' ? '#f8fafc' : '#0f172a';

  return (
    <div
      style={{
        padding: 18,
        borderRadius: 16,
        border: `1px solid ${accent}33`,
        background: surface,
        color: text,
        boxShadow: `0 12px 32px ${accent}1a`,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 11 * fontScale,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: accent,
          fontWeight: 800,
        }}
      >
        Live preview
      </p>
      <h4
        style={{
          margin: `${6 * fontScale}px 0 0`,
          fontSize: 22 * fontScale,
          lineHeight: 1.2,
        }}
      >
        Same store. Read from anywhere.
      </h4>
      <p style={{ margin: `${10 * fontScale}px 0 0`, fontSize: 14 * fontScale }}>
        Both this preview and the readout below subscribe to the same global instance.
      </p>
    </div>
  );
}

function ThemeReadout() {
  const label = themeStore.useSelector('label');
  const accent = themeStore.useSelector('accent');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        borderRadius: 12,
        background: 'rgba(15,23,42,0.04)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 13,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: accent,
        }}
      />
      <span>themeStore.useView('label') → {label}</span>
    </div>
  );
}

const pillStyle = {
  padding: '8px 12px',
  borderRadius: 999,
  border: '1px solid rgba(15,23,42,0.12)',
  background: '#fff',
  color: '#0f172a',
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer',
} as const;

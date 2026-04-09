import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'RUNILIB — Cross-platform React and React Native ecosystem';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #080a0e 0%, #0d1117 50%, #101820 100%)',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: '1px solid rgba(74, 222, 192, 0.1)',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -120,
          left: -120,
          width: 500,
          height: 500,
          borderRadius: '50%',
          border: '1px solid rgba(74, 222, 192, 0.06)',
          display: 'flex',
        }}
      />

      {/* Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 16,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#4adec0',
          background: 'rgba(74, 222, 192, 0.08)',
          border: '1px solid rgba(74, 222, 192, 0.2)',
          borderRadius: 24,
          padding: '8px 20px',
          marginBottom: 32,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#4adec0',
            display: 'flex',
          }}
        />
        Open Source
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: '#e6edf3',
          letterSpacing: '-2px',
          lineHeight: 1.1,
          textAlign: 'center',
          display: 'flex',
        }}
      >
        RUNILIB
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#4adec0',
          marginTop: 12,
          display: 'flex',
        }}
      >
        React & React Native Libraries
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: 18,
          color: '#8b949e',
          marginTop: 20,
          textAlign: 'center',
          maxWidth: 820,
          lineHeight: 1.6,
          display: 'flex',
        }}
      >
        Open-source ecosystem of React and React Native libraries with shared APIs, strong
        TypeScript DX and packages built for web and mobile.
      </div>

      {/* Library pills */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginTop: 40,
        }}
      >
        {['Shared APIs', 'TypeScript DX', 'Composable packages'].map((name) => (
          <div
            key={name}
            style={{
              fontSize: 14,
              color: '#cdd9e5',
              background: 'rgba(74, 222, 192, 0.06)',
              border: '1px solid rgba(74, 222, 192, 0.15)',
              borderRadius: 20,
              padding: '6px 16px',
              letterSpacing: '0.04em',
              display: 'flex',
            }}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          fontSize: 14,
          color: '#484f58',
        }}
      >
        <span style={{ display: 'flex' }}>runilib.dev</span>
        <span style={{ display: 'flex' }}>TypeScript</span>
        <span style={{ display: 'flex' }}>Web + Native</span>
        <span style={{ display: 'flex' }}>MIT License</span>
      </div>
    </div>,
    { ...size },
  );
}

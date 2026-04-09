import { libraryInfo } from '@/data/site';

import { ImageResponse } from 'next/og';

export const alt = 'react-formbridge documentation';
export const contentType = 'image/png';
export const runtime = 'edge';
export const size = {
  width: 1200,
  height: 630,
};

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'stretch',
        background: 'linear-gradient(135deg, #08111a 0%, #0f1b2b 58%, #10263b 100%)',
        color: '#eff7ff',
        display: 'flex',
        height: '100%',
        justifyContent: 'space-between',
        padding: '56px 64px',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '68%',
        }}
      >
        <div
          style={{
            color: '#7ecff4',
            display: 'flex',
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          react-formbridge docs
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 74,
              fontWeight: 800,
              lineHeight: 1.03,
            }}
          >
            Complete docs for schema-driven React and React Native forms.
          </div>
          <div
            style={{
              color: '#c0d4e7',
              display: 'flex',
              fontSize: 30,
              lineHeight: 1.4,
            }}
          >
            {libraryInfo.shortDescription}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
          }}
        >
          {['Quick start', 'Field builders', 'Advanced patterns'].map((item) => (
            <div
              key={item}
              style={{
                alignItems: 'center',
                background: 'rgba(126, 207, 244, 0.12)',
                border: '1px solid rgba(126, 207, 244, 0.25)',
                borderRadius: 8,
                color: '#eff7ff',
                display: 'flex',
                fontSize: 24,
                padding: '14px 18px',
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          alignItems: 'flex-end',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '24%',
        }}
      >
        <div
          style={{
            border: '1px solid rgba(126, 207, 244, 0.25)',
            borderRadius: 8,
            color: '#7ecff4',
            display: 'flex',
            fontSize: 26,
            padding: '14px 18px',
          }}
        >
          v{libraryInfo.version}
        </div>

        <div
          style={{
            display: 'flex',
            height: 140,
            width: 140,
          }}
        >
          <svg
            viewBox="0 0 200 200"
            width="140"
            height="140"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>react-formbridge logo</title>
            <defs>
              <linearGradient
                id="ogBadgeBg"
                x1="16"
                y1="16"
                x2="184"
                y2="184"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0%"
                  stopColor="#0A1624"
                />
                <stop
                  offset="100%"
                  stopColor="#10253B"
                />
              </linearGradient>
            </defs>
            <rect
              x="16"
              y="16"
              width="168"
              height="168"
              rx="42"
              fill="url(#ogBadgeBg)"
            />
            <path
              d="M84 112C89 88 127 88 132 112L124 112C121 98 114 95 108 95C101 95 94 98 92 112Z"
              fill="#BDE7FF"
            />
            <rect
              x="42"
              y="104"
              width="60"
              height="40"
              rx="12"
              fill="#0F6FDC"
            />
            <rect
              x="54"
              y="116"
              width="28"
              height="5"
              rx="2.5"
              fill="#F8FBFF"
            />
            <rect
              x="54"
              y="126"
              width="38"
              height="5"
              rx="2.5"
              fill="#F8FBFF"
              opacity="0.72"
            />
            <rect
              x="118"
              y="92"
              width="38"
              height="64"
              rx="14"
              fill="#12B4A8"
            />
            <rect
              x="130"
              y="109"
              width="14"
              height="5"
              rx="2.5"
              fill="#F8FBFF"
            />
            <rect
              x="130"
              y="119"
              width="14"
              height="5"
              rx="2.5"
              fill="#F8FBFF"
              opacity="0.72"
            />
            <circle
              cx="137"
              cy="147"
              r="2.5"
              fill="#F8FBFF"
              opacity="0.86"
            />
          </svg>
        </div>
      </div>
    </div>,
    size,
  );
}

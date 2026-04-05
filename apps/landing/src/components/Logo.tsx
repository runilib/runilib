'use client';

import Link from 'next/link';
import styled, { keyframes } from 'styled-components';

const orbitCW = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const orbitCCW = keyframes`from{transform:rotate(0deg)}to{transform:rotate(-360deg)}`;
const floatY = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}`;

interface LogoIconProps {
  size?: number;
  animated?: boolean;
}

export const LogoIcon = ({ size = 36, animated = false }: LogoIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      aria-label="RUNILIB logo"
    >
      <circle
        cx="36"
        cy="36"
        r="35"
        fill="#00e5c8"
        fillOpacity="0.05"
      />
      <ellipse
        cx="36"
        cy="36"
        rx="33"
        ry="33"
        stroke="#00e5c8"
        strokeWidth="1.2"
        strokeDasharray="5 4"
        opacity="0.3"
      />
      {animated ? (
        <>
          <AnimRing1
            cx="36"
            cy="36"
            rx="25"
            ry="10"
            stroke="#00e5c8"
            strokeWidth="1"
            opacity="0.18"
          />
          <AnimRing2
            cx="36"
            cy="36"
            rx="25"
            ry="10"
            stroke="#4f8ef7"
            strokeWidth="1"
            opacity="0.18"
            style={{ transform: 'rotate(70deg)', transformOrigin: '36px 36px' }}
          />
        </>
      ) : (
        <>
          <ellipse
            cx="36"
            cy="36"
            rx="25"
            ry="10"
            stroke="#00e5c8"
            strokeWidth="1"
            opacity="0.18"
            transform="rotate(-35 36 36)"
          />
          <ellipse
            cx="36"
            cy="36"
            rx="25"
            ry="10"
            stroke="#4f8ef7"
            strokeWidth="1"
            opacity="0.18"
            transform="rotate(35 36 36)"
          />
        </>
      )}
      <circle
        cx="36"
        cy="36"
        r="16"
        fill="#00e5c8"
        fillOpacity="0.07"
        stroke="#00e5c8"
        strokeWidth="1.5"
      />
      <circle
        cx="36"
        cy="36"
        r="9"
        fill="#00e5c8"
        fillOpacity="0.16"
      />
      <circle
        cx="69"
        cy="36"
        r="3.5"
        fill="#00e5c8"
      />
      <circle
        cx="36"
        cy="3"
        r="2.5"
        fill="#f0a500"
      />
      <circle
        cx="5"
        cy="52"
        r="2.5"
        fill="#4f8ef7"
      />
      <text
        x="36"
        y="36"
        dy="-0.04em"
        fill="#f4f6fa"
        fontFamily="Sora, Arial, sans-serif"
        fontSize="11"
        fontWeight="800"
        letterSpacing="-0.03em"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        R
      </text>
    </svg>
  );
};

const AnimRing1 = styled.ellipse`
  animation: ${orbitCW} 10s linear infinite;
  transform-origin: 36px 36px;
  transform-box: fill-box;
`;
const AnimRing2 = styled.ellipse`
  animation: ${orbitCCW} 7s linear infinite;
  transform-origin: 36px 36px;
  transform-box: fill-box;
`;

interface LogoFullProps {
  size?: number;
  hideTagline?: boolean;
}

export const LogoFull = ({ size = 30, hideTagline = false }: LogoFullProps) => {
  return (
    <LogoLink href="/">
      <FloatIcon>
        <LogoIcon size={size} />
      </FloatIcon>
      <LogoText>
        <Wordmark>
          RUNI<TealPart>LIB</TealPart>
        </Wordmark>
        {!hideTagline && <TagLine>React Universal Libs</TagLine>}
      </LogoText>
    </LogoLink>
  );
};

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
`;
const FloatIcon = styled.div`animation: ${floatY} 5s ease-in-out infinite;`;
const LogoText = styled.div`display: flex; flex-direction: column; gap: 0;`;
const Wordmark = styled.div`
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: 20px;
  letter-spacing: -0.3px;
  line-height: 1.1;
  color: ${({ theme }) => theme.textPrimary};
`;
const TealPart = styled.span`color: ${({ theme }) => theme.teal};`;
const TagLine = styled.div`
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`;

import type { AnimationType, Placement } from "../types/Walk.types";

// ─── Web CSS keyframes ────────────────────────────────────────────────────────

export const WEB_KEYFRAMES = `
  @keyframes runilib-react-walkit-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes runilib-react-walkit-slide {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes runilib-react-walkit-slide-up {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes runilib-react-walkit-slide-left {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes runilib-react-walkit-slide-right {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes runilib-react-walkit-zoom {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes runilib-react-walkit-bounce {
    0%   { opacity: 0; transform: scale(0.5); }
    60%  { opacity: 1; transform: scale(1.08); }
    80%  { transform: scale(0.97); }
    100% { transform: scale(1); }
  }
  @keyframes runilib-react-walkit-flip {
    from { opacity: 0; transform: perspective(400px) rotateX(-30deg); }
    to   { opacity: 1; transform: perspective(400px) rotateX(0deg); }
  }
  @keyframes runilib-react-walkit-glow {
    0%   { opacity: 0; transform: scale(0.9); box-shadow: 0 0 0 rgba(99,102,241,0); }
    100% { opacity: 1; transform: scale(1);   box-shadow: 0 0 24px rgba(99,102,241,0.4); }
  }
  @keyframes runilib-react-walkit-overlay-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

/** Returns the CSS `animation` value for the react-walkit entrance. */
export function getWebAnimation(type: AnimationType, placement: Placement = "bottom"): string {
  const duration = type === "bounce" ? "0.5s" : "0.3s";
  const easing = type === "bounce" ? "cubic-bezier(0.34,1.56,0.64,1)" : "ease-out";

  const keyframeMap: Record<AnimationType, string> = {
    fade: "runilib-react-walkit-fade",
    zoom: "runilib-react-walkit-zoom",
    bounce: "runilib-react-walkit-bounce",
    flip: "runilib-react-walkit-flip",
    glow: "runilib-react-walkit-glow",
    slide:
      placement === "top"
        ? "runilib-react-walkit-slide-up"
        : placement === "left"
          ? "runilib-react-walkit-slide-right"
          : placement === "right"
            ? "runilib-react-walkit-slide-left"
            : "runilib-react-walkit-slide",
  };

  return `${keyframeMap[type] ?? "runilib-react-walkit-fade"} ${duration} ${easing} both`;
}

// ─── Native animation configs ─────────────────────────────────────────────────

interface SpringConfig {
  damping: number;
  stiffness: number;
  mass: number;
}

interface NativeAnimationConfig {
  useSpring: boolean;
  duration?: number;
  easing?: string;
  spring?: SpringConfig;
  scale?: { from: number; to: number };
  translateY?: { from: number; to: number };
  rotateX?: { from: string; to: string };
}

export const NATIVE_ANIMATIONS: Record<AnimationType, NativeAnimationConfig> = {
  fade: { useSpring: false, duration: 280 },
  slide: { useSpring: false, duration: 300, translateY: { from: 16, to: 0 } },
  zoom: { useSpring: false, duration: 300, scale: { from: 0.85, to: 1 } },
  bounce: {
    useSpring: true,
    spring: { damping: 12, stiffness: 180, mass: 0.8 },
    scale: { from: 0.5, to: 1 },
  },
  flip: {
    useSpring: false,
    duration: 320,
    rotateX: { from: "-20deg", to: "0deg" },
  },
  glow: { useSpring: false, duration: 350, scale: { from: 0.9, to: 1 } },
};

export const ANIMATION_TYPES: AnimationType[] = Object.keys(NATIVE_ANIMATIONS) as AnimationType[];

import { ANIMATION_TYPES, getWebAnimation, NATIVE_ANIMATIONS } from "../../src/animations";
import type { AnimationType } from "../types";

describe("getWebAnimation", () => {
  it("returns a CSS animation string containing the keyframe name", () => {
    expect(getWebAnimation("fade", "bottom")).toContain("runilib-react-walkit-fade");
    expect(getWebAnimation("zoom", "bottom")).toContain("runilib-react-walkit-zoom");
    expect(getWebAnimation("bounce", "bottom")).toContain("runilib-react-walkit-bounce");
    expect(getWebAnimation("flip", "bottom")).toContain("runilib-react-walkit-flip");
    expect(getWebAnimation("glow", "bottom")).toContain("runilib-react-walkit-glow");
  });

  it("adapts slide keyframe based on placement", () => {
    expect(getWebAnimation("slide", "bottom")).toContain("runilib-react-walkit-slide");
    expect(getWebAnimation("slide", "top")).toContain("runilib-react-walkit-slide-up");
    expect(getWebAnimation("slide", "left")).toContain("runilib-react-walkit-slide-right");
    expect(getWebAnimation("slide", "right")).toContain("runilib-react-walkit-slide-left");
  });

  it("bounce uses longer duration (0.5s)", () => {
    expect(getWebAnimation("bounce", "bottom")).toContain("0.5s");
  });

  it("non-bounce types use 0.3s duration", () => {
    (["fade", "zoom", "flip", "glow", "slide"] as AnimationType[]).forEach((t) => {
      expect(getWebAnimation(t, "bottom")).toContain("0.3s");
    });
  });

  it("bounce uses spring easing", () => {
    expect(getWebAnimation("bounce", "bottom")).toContain("cubic-bezier");
  });
});

describe("NATIVE_ANIMATIONS", () => {
  it("has an entry for every ANIMATION_TYPE", () => {
    ANIMATION_TYPES.forEach((type) => {
      expect(NATIVE_ANIMATIONS[type]).toBeDefined();
    });
  });

  it("bounce uses spring (useSpring=true)", () => {
    expect(NATIVE_ANIMATIONS.bounce.useSpring).toBe(true);
    expect(NATIVE_ANIMATIONS.bounce.spring).toBeDefined();
    expect(NATIVE_ANIMATIONS.bounce.spring?.damping).toBeGreaterThan(0);
  });

  it("non-spring types have a duration > 0", () => {
    (["fade", "slide", "zoom", "flip", "glow"] as AnimationType[]).forEach((type) => {
      expect(NATIVE_ANIMATIONS[type].useSpring).toBe(false);
      expect(NATIVE_ANIMATIONS[type].duration).toBeGreaterThan(0);
    });
  });

  it("slide has a translateY config", () => {
    expect(NATIVE_ANIMATIONS.slide.translateY).toBeDefined();
    expect(NATIVE_ANIMATIONS.slide.translateY?.from).not.toBe(0);
    expect(NATIVE_ANIMATIONS.slide.translateY?.to).toBe(0);
  });

  it("zoom and bounce have a scale config", () => {
    expect(NATIVE_ANIMATIONS.zoom.scale?.from).toBeLessThan(1);
    expect(NATIVE_ANIMATIONS.bounce.scale?.from).toBeLessThan(1);
  });

  it("flip has a rotateX config", () => {
    expect(NATIVE_ANIMATIONS.flip.rotateX?.from).toBeDefined();
    expect(NATIVE_ANIMATIONS.flip.rotateX?.to).toBe("0deg");
  });
});

describe("ANIMATION_TYPES", () => {
  it("is a non-empty array of strings", () => {
    expect(Array.isArray(ANIMATION_TYPES)).toBe(true);
    expect(ANIMATION_TYPES.length).toBeGreaterThan(0);
    ANIMATION_TYPES.forEach((t) => {
      expect(typeof t).toBe("string");
    });
  });

  it("contains all expected types", () => {
    const expected: AnimationType[] = ["fade", "slide", "zoom", "bounce", "flip", "glow"];
    expected.forEach((t) => {
      expect(ANIMATION_TYPES).toContain(t);
    });
  });
});

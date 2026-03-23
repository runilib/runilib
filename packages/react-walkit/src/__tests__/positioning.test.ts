import { describe, expect, it } from 'vitest';
import type { TargetRect } from '../types/Walkit.types';
import { getSpotlightRect } from '../utils/positioning.shared';
import { computeTooltipPosition } from '../utils/Walkit.positioning';

const SCREEN = { w: 375, h: 812 };
const TOOLTIP = { width: 300, height: 180 };

describe('computeTooltipPosition', () => {
  it('places react-walkit below target when there is room', () => {
    const target: TargetRect = { x: 37, y: 100, width: 300, height: 50 };
    const result = computeTooltipPosition(target, TOOLTIP, 'bottom', SCREEN.w, SCREEN.h);
    expect(result.placement).toBe('bottom');
    expect(result.top).toBeGreaterThan(target.y + target.height);
  });

  it('falls back to top when no room below', () => {
    const target: TargetRect = { x: 37, y: 650, width: 300, height: 50 };
    const result = computeTooltipPosition(target, TOOLTIP, 'auto', SCREEN.w, SCREEN.h);
    expect(result.placement).toBe('top');
    expect(result.top).toBeLessThan(target.y);
  });

  it('respects explicit placement', () => {
    const target: TargetRect = { x: 37, y: 100, width: 300, height: 50 };
    const result = computeTooltipPosition(target, TOOLTIP, 'top', SCREEN.w, SCREEN.h);
    expect(result.placement).toBe('top');
  });

  it('clamps left to screen padding', () => {
    const target: TargetRect = { x: 0, y: 100, width: 10, height: 10 };
    const result = computeTooltipPosition(target, TOOLTIP, 'bottom', SCREEN.w, SCREEN.h);
    expect(result.left).toBeGreaterThanOrEqual(10);
  });

  it('clamps right to screen width - react-walkit width - padding', () => {
    const target: TargetRect = { x: 350, y: 100, width: 20, height: 30 };
    const result = computeTooltipPosition(target, TOOLTIP, 'bottom', SCREEN.w, SCREEN.h);
    expect(result.left + TOOLTIP.width).toBeLessThanOrEqual(SCREEN.w);
  });

  it('places right when given explicit right and fits', () => {
    const target: TargetRect = { x: 10, y: 300, width: 40, height: 40 };
    const result = computeTooltipPosition(target, TOOLTIP, 'right', SCREEN.w, SCREEN.h);
    expect(result.placement).toBe('right');
    expect(result.left).toBeGreaterThan(target.x + target.width);
  });

  it('returns a numeric arrowOffset', () => {
    const target: TargetRect = { x: 37, y: 100, width: 100, height: 50 };
    const result = computeTooltipPosition(target, TOOLTIP, 'auto', SCREEN.w, SCREEN.h);
    expect(typeof result.arrowOffset).toBe('number');
  });
});

describe('getSpotlightRect', () => {
  it('expands rect by padding on all sides', () => {
    const rect: TargetRect = { x: 50, y: 100, width: 200, height: 40 };
    const sr = getSpotlightRect(rect, 8, 10);
    expect(sr.x).toBe(42);
    expect(sr.y).toBe(92);
    expect(sr.width).toBe(216);
    expect(sr.height).toBe(56);
    expect(sr.borderRadius).toBe(10);
  });

  it('uses default padding and radius when not provided', () => {
    const rect: TargetRect = { x: 10, y: 20, width: 100, height: 50 };
    const sr = getSpotlightRect(rect);
    expect(sr.x).toBe(2);
    expect(sr.y).toBe(12);
    expect(sr.width).toBe(116);
    expect(sr.height).toBe(66);
    expect(sr.borderRadius).toBe(8);
  });
});

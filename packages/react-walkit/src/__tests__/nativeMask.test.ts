import { describe, expect, it } from 'vitest';
import { getNativeMaskBounds } from '../utils/nativeMask';

describe('native spotlight mask', () => {
  it('uses absolute screen-space bounds for Android SVG renderers', () => {
    expect(getNativeMaskBounds(412, 915)).toEqual({
      x: 0,
      y: 0,
      width: 412,
      height: 915,
      maskUnits: 'userSpaceOnUse',
    });
  });
});

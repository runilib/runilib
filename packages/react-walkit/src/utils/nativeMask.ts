export const getNativeMaskBounds = (width: number, height: number) =>
  ({
    x: 0,
    y: 0,
    width,
    height,
    maskUnits: 'userSpaceOnUse',
  }) as const;

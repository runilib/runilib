import React from 'react';

type SvgProps = { children?: React.ReactNode; [key: string]: any };

const makeMock =
  (tag: string): React.FC<SvgProps> =>
  ({ children, ...props }) =>
    React.createElement(tag, props, children);

export const Svg = makeMock('svg');
export const Rect = makeMock('rect');
export const Defs = makeMock('defs');
export const Mask = makeMock('mask');
export const Circle = makeMock('circle');
export const ClipPath = makeMock('clipPath');
export const G = makeMock('g');
export const Path = makeMock('path');

export default Svg;

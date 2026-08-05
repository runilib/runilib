---
'@runilib/react-walkit': patch
---

Fix the React Native spotlight overlay on Android by giving the SVG mask
explicit user-space bounds. This restores the transparent cutout and highlight
ring around the active tour target on Android renderers that do not handle the
default mask bounding box consistently.

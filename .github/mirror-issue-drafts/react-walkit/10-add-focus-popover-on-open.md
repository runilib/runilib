# Add focusPopoverOnOpen support for the web walkthrough overlay

Repository: `runilib/react-walkit`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add a `focusPopoverOnOpen` option for the web walkthrough overlay so keyboard users can interact with the active popover immediately after it opens.

## Why this would help

When a walkthrough starts, focus currently does not move into the active popover by default. A small focus-management option would improve accessibility and make keyboard navigation feel much more intentional.

## Suggested implementation areas

- `src/types/Walkit.types.ts`
- `src/components/walkit/web/Overlay.web.tsx`
- `src/components/walkit/web/Walkit.web.tsx`
- web tests for focus behavior

## Acceptance Criteria

- [ ] the provider can opt into focusing the popover when it opens
- [ ] the focus target is stable and keyboard-friendly
- [ ] the behavior is web-specific in runtime but safe in shared typings
- [ ] existing behavior remains unchanged by default

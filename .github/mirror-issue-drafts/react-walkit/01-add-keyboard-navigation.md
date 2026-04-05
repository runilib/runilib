# Add keyboard navigation support to the web walkthrough overlay

Repository: `runilib/react-walkit`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add keyboard navigation support to the active web walkthrough overlay.

## Why this would help

The tooltip trigger already has some keyboard handling, but the active walkthrough itself does not expose first-class keyboard controls.

This would improve:

- accessibility
- QA and demo workflows
- keyboard-only usage of product tours

## Proposed behavior

- `ArrowRight` -> next
- `ArrowLeft` -> previous
- `Escape` -> stop

## Suggested implementation areas

- `src/components/walkit/web/Overlay.web.tsx`
- `src/components/walkit/web/Walkit.web.tsx`
- `src/types/Walkit.types.ts`
- tests for key bindings

## Acceptance Criteria

- [ ] keyboard navigation works on web
- [ ] the behavior is configurable via a provider option such as `keyboardNavigation`
- [ ] the overlay cleans up listeners correctly
- [ ] current mouse-driven behavior stays unchanged by default

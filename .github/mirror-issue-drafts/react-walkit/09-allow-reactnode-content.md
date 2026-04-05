# Allow WalkitStep content to accept ReactNode instead of string only

Repository: `runilib/react-walkit`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Allow `WalkitStep` content to accept `ReactNode` instead of being limited to strings.

## Why this would help

This would make the default popover more expressive without forcing consumers to fully replace it via `renderPopover`.

Examples:

- inline emphasis
- links
- small lists
- simple formatting

## Suggested implementation areas

- `src/types/Walkit.types.ts`
- `src/components/walkit/web/Walkit.web.tsx`
- `src/components/walkit/native/Walkit.native.tsx`
- README examples

## Acceptance Criteria

- [ ] `content` can be a `ReactNode`
- [ ] plain strings still work exactly as before
- [ ] the default popover can render richer content on both platforms
- [ ] consumers do not need to switch to `renderPopover` just for basic rich content

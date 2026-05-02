<p align="center">
  <img alt="react-walkit" src="./assets/logo.svg" width="760" />
</p>

<p align="center">
  <strong>Lead the flock. Cross-platform tours, walkthroughs, and tooltips for React and React Native.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@runilib/react-walkit"><img alt="npm version" src="https://img.shields.io/npm/v/@runilib/react-walkit?color=d97706"></a>
  <a href="https://www.npmjs.com/package/@runilib/react-walkit"><img alt="downloads per week" src="https://img.shields.io/npm/dw/@runilib/react-walkit?color=22c55e&label=downloads%2Fweek"></a>
  <a href="https://www.npmjs.com/package/@runilib/react-walkit"><img alt="total downloads" src="https://img.shields.io/npm/dt/@runilib/react-walkit?color=22c55e&label=downloads"></a>
  <a href="./LICENSE"><img alt="license" src="https://img.shields.io/npm/l/@runilib/react-walkit?color=10b981"></a>
  <a href="https://runilib.dev/libraries/walkit"><img alt="docs" src="https://img.shields.io/badge/docs-runilib.dev%2Flibraries%2Fwalkit-d97706"></a>
  <a href="https://github.com/runilib/react-walkit/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22"><img alt="good first issues" src="https://img.shields.io/github/issues-search/runilib/react-walkit?query=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22&color=7057ff&label=good%20first%20issues"></a>
</p>

# @runilib/react-walkit

> Part of the [**runilib**](https://runilib.dev) ecosystem — React & React Native libraries that share the same API on web and native.
>
> This repository is mirrored from the runilib monorepo.
> Active development happens in the monorepo.
> Open or in-progress work may appear here as automated draft PRs for visibility, and issues opened here can be mirrored back to the monorepo.

Cross-platform onboarding tours, guided walkthroughs, and standalone tooltips for React and React Native.

`@runilib/react-walkit` is the onboarding & tooltips package of runilib. It helps you highlight UI, attach contextual popovers, and run guided tours or simple feature tooltips with the same API across web and native, including cross-page and cross-screen flows.

Full documentation: <https://runilib.dev/libraries/walkit>

## Demo Previews

### React Web walkthrough

<a href="https://res.cloudinary.com/dca7plrqk/video/upload/v1775404915/web-walkit-onboarding-tour-examples_p2hogt.mov">
  <img
    src="https://res.cloudinary.com/dca7plrqk/video/upload/e_loop,fl_awebp,fl_animated,c_limit,w_720,q_auto/v1775404915/web-walkit-onboarding-tour-examples_p2hogt.webp"
    alt="Animated WebP preview of the React web walkthrough with spotlight overlay and popover."
    width="720"
  />
</a>

Desktop preview of the default Walkit onboarding flow on React web. Click the animation to open the full video.

### React Web tooltip

<a href="https://res.cloudinary.com/dca7plrqk/video/upload/web-tooltip-example_q3ne1e.mp4">
  <img
    src="https://res.cloudinary.com/dca7plrqk/video/upload/e_loop,fl_awebp,fl_animated,c_limit,w_720,q_auto/web-tooltip-example_q3ne1e.webp"
    alt="Animated WebP preview of the standalone React web tooltip."
    width="720"
  />
</a>

Desktop preview of the standalone `Tooltip` component on React web. Click the animation to open the full video.

### React Native previews

<table>
  <tr>
    <td align="center" valign="top">
      <a href="https://res.cloudinary.com/dca7plrqk/video/upload/v1775404485/mobile-onboarding-tour-exemple_pxdui3.mov">
        <img
          src="https://res.cloudinary.com/dca7plrqk/video/upload/e_loop,fl_awebp,fl_animated,c_limit,w_340,q_auto/v1775404485/mobile-onboarding-tour-exemple_pxdui3.webp"
          alt="Animated WebP preview of the React Native walkthrough with spotlight overlay and popover."
          width="340"
        />
      </a>
      <br />
      React Native walkthrough demo
    </td>
    <td align="center" valign="top">
      <a href="https://res.cloudinary.com/dca7plrqk/video/upload/v1775404484/mobile-tooltip-exemple_wykp1s.mov">
        <img
          src="https://res.cloudinary.com/dca7plrqk/video/upload/e_loop,fl_awebp,fl_animated,c_limit,w_340,q_auto/v1775404484/mobile-tooltip-exemple_wykp1s.webp"
          alt="Animated WebP preview of the standalone React Native tooltip."
          width="340"
        />
      </a>
      <br />
      React Native tooltip demo
    </td>
  </tr>
</table>

Side-by-side mobile previews of the full onboarding flow and the standalone tooltip primitive on React Native. Click an animation to open the full video.

## What It Solves

- Product tours and onboarding flows
- Standalone tooltips for contextual help and feature announcements
- Spotlight + tooltip guidance around real UI elements
- One API for React web and React Native
- Cross-page and cross-screen navigation with a shared flow model

## Install

```bash
npm install @runilib/react-walkit
```

React Native also needs `react-native-svg`.

## Quick Example

```tsx
import { WalkitProvider, WalkitStep, useWalkit } from '@runilib/react-walkit';

function StartTourButton() {
  const { start } = useWalkit();

  return <button onClick={() => start()}>Start tour</button>;
}

export function App() {
  return (
    <WalkitProvider>
      <WalkitStep
        id="search"
        sequence={1}
        title="Search"
        content="Use this field to quickly find projects and tasks."
      >
        <input placeholder="Search..." />
      </WalkitStep>

      <StartTourButton />
    </WalkitProvider>
  );
}
```

## Accessible Tooltips

Use a stable `id` when the tooltip describes a control that users may revisit.
On web, `Tooltip` applies that id to the rendered tooltip surface and links the
trigger wrapper with `aria-describedby` while the tooltip is visible by default.
Use `ariaDescribedBy="always"` when the trigger should expose the description
before the tooltip is opened.

```tsx
import { Tooltip } from '@runilib/react-walkit';

export function BillingHelp() {
  return (
    <Tooltip
      id="billing-help"
      ariaLabel="Billing help"
      closeOnEscape
      openOnPress
      content="This appears on your invoice."
    >
      <button type="button">?</button>
    </Tooltip>
  );
}
```

- Prefer `openOnPress` for keyboard, touch, TalkBack, and VoiceOver parity. Hover-only tooltips are useful as a visual enhancement, but they should not be the only way to reach important information.
- Keep descriptive tooltips non-interactive. If the content contains links, buttons, form fields, or other focusable controls, set `interactive` so web uses dialog semantics instead of `role="tooltip"`.
- Leave `closeOnEscape` enabled for web unless the tooltip is fully controlled by your own state. Escape closes the open tooltip even when focus has moved away from the trigger.
- For custom triggers, make the trigger itself focusable and named. Use a native `<button>` on web or a named pressable control on React Native whenever possible.
- On React Native, text content or `ariaLabel` is announced when the tooltip opens, and press triggers expose expansion state plus an accessibility hint when `ariaDescribedBy` is active.

## Step-level Outside Dismissal

`stopOnOutsideClick` can be configured globally on `WalkitProvider` and
overridden by a single `WalkitStep`. The current step override wins when it is
defined; otherwise Walkit uses the provider value.

```tsx
<WalkitProvider stopOnOutsideClick>
  <WalkitStep
    id="danger-zone"
    sequence={3}
    title="Review this action"
    content="Choose Next, Back, or Skip explicitly before leaving this step."
    stopOnOutsideClick={false}
  >
    <button type="button">Delete workspace</button>
  </WalkitStep>
</WalkitProvider>
```

## Testing Accessibility

- Web keyboard: tab to the trigger, open with Enter or Space, close with Escape, and confirm focus remains usable.
- Web ARIA: verify `aria-describedby` points to the tooltip `id`; use `role="tooltip"` for descriptive content and `interactive` for dialog-like content.
- Web screen readers: test with VoiceOver, NVDA, or JAWS and confirm the trigger name plus description are announced clearly.
- Native screen readers: test TalkBack and VoiceOver; focus the trigger, activate it, and confirm `content` or `ariaLabel` is announced.
- Native custom content: give every actionable `Pressable` an `accessibilityRole` and a clear `accessibilityLabel`.
- Automated checks: assert roles, ids, `aria-describedby`, Escape dismissal, `closeOnEscape={false}`, and per-step `stopOnOutsideClick` fallback/override behavior with Testing Library.

## Documentation

- Docs and guides: https://runilib.dev/libraries/walkit

## Contributing

Bug reports and feature requests are welcome in [this repo's issues](https://github.com/runilib/react-walkit/issues). They are mirrored to the monorepo where the work happens.

If you want to change the package itself, work from the monorepo and use this flow before opening a PR:

1. Make the code, docs, and test updates in `packages/react-walkit`.
2. Run `yarn changeset` from the monorepo root and include `@runilib/react-walkit`.
3. Run `yarn check:fix`, `yarn typecheck`, and `yarn test`.
4. Optionally run `npm run --prefix packages/react-walkit prepublishOnly` for an extra publish-safety check.
5. Open the PR against the monorepo `main` branch. After merge, GitHub creates a package-specific release PR so this library can be published independently from the others.

Looking for something to start with? Browse [good first issues](https://github.com/runilib/react-walkit/labels/good%20first%20issue).

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

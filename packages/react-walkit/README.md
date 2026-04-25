# @runilib/react-walkit

[![good first issues](https://img.shields.io/github/issues-search/runilib/react-walkit?query=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22&color=7057ff&label=good%20first%20issues)](https://github.com/runilib/react-walkit/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)

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

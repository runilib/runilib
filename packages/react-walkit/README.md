# @runilib/react-walkit

[![good first issues](https://img.shields.io/github/issues/runilib/react-walkit/good%20first%20issue?color=7057ff&label=good%20first%20issues)](https://github.com/runilib/react-walkit/labels/good%20first%20issue)

Cross-platform onboarding tours and guided walkthroughs for React and React Native.

`@runilib/react-walkit` helps you highlight UI, attach contextual popovers, and run guided tours with the same API across web and native, including cross-page and cross-screen flows.

Full documentation: https://runilib.dev/docs/react-walkit

> This repository is mirrored from the runilib monorepo.
> Active development happens in the monorepo.
> Open or in-progress work may appear here as automated draft PRs for visibility, and issues opened here can be mirrored back to the monorepo.

## What It Solves

- Product tours and onboarding flows
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

- Docs and guides: https://runilib.dev/docs/react-walkit
- API reference: https://runilib.dev/docs/react-walkit

## Contributing

Bug reports and feature requests are welcome in [this repo's issues](https://github.com/runilib/react-walkit/issues). They are mirrored to the monorepo where the work happens.

Looking for something to start with? Browse [good first issues](https://github.com/runilib/react-walkit/labels/good%20first%20issue).

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

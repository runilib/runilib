import React from 'react';

import { act, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WalkitStep } from '../components/walkit/web/WalkitStep.web';
import { useWalkitContext, WalkitContextProvider } from '../context/WalkitContext';
import type { WalkitContextValue } from '../types/Walkit.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CtxCapture({ onCapture }: { onCapture: (ctx: WalkitContextValue) => void }) {
  const ctx = useWalkitContext();
  React.useEffect(() => {
    onCapture(ctx);
  }, [ctx, onCapture]);
  return null;
}

const Wrapper = ({
  children,
  onCapture,
}: {
  children: React.ReactNode;
  onCapture: (c: WalkitContextValue) => void;
}) => {
  return (
    <WalkitContextProvider config={{}}>
      <CtxCapture onCapture={onCapture} />
      {children}
    </WalkitContextProvider>
  );
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('WalkitStep (web)', () => {
  it('registers itself on mount', async () => {
    let ctx!: WalkitContextValue;

    await act(async () => {
      render(
        <Wrapper
          onCapture={(c) => {
            ctx = c;
          }}
        >
          <WalkitStep
            id="btn"
            sequence={1}
            title="Click me"
            content="A button."
          >
            <button type="button">Click</button>
          </WalkitStep>
        </Wrapper>,
      );
    });

    expect(ctx.sortedSteps).toHaveLength(1);
    expect(ctx.sortedSteps[0].id).toBe('btn');
    expect(ctx.sortedSteps[0].sequence).toBe(1);
  });

  it('registers multiple steps in the correct sequence', async () => {
    let ctx!: WalkitContextValue;

    await act(async () => {
      render(
        <Wrapper
          onCapture={(c) => {
            ctx = c;
          }}
        >
          <WalkitStep
            id="b"
            sequence={2}
            title="B"
          >
            <span>B</span>
          </WalkitStep>
          <WalkitStep
            id="a"
            sequence={1}
            title="A"
          >
            <span>A</span>
          </WalkitStep>
          <WalkitStep
            id="c"
            sequence={3}
            title="C"
          >
            <span>C</span>
          </WalkitStep>
        </Wrapper>,
      );
    });

    expect(ctx.sortedSteps.map((s) => s.id)).toEqual(['a', 'b', 'c']);
  });

  it('does NOT register when active=false', async () => {
    let ctx!: WalkitContextValue;

    await act(async () => {
      render(
        <Wrapper
          onCapture={(c) => {
            ctx = c;
          }}
        >
          <WalkitStep
            id="hidden"
            sequence={1}
            title="Hidden"
            active={false}
          >
            <span>Hidden</span>
          </WalkitStep>
        </Wrapper>,
      );
    });

    expect(ctx.sortedSteps).toHaveLength(0);
  });

  it('passes title and text to the registered step', async () => {
    let ctx!: WalkitContextValue;

    await act(async () => {
      render(
        <Wrapper
          onCapture={(c) => {
            ctx = c;
          }}
        >
          <WalkitStep
            id="search"
            sequence={1}
            title="Search bar"
            content="Find content here."
            placement="bottom"
          >
            <input placeholder="Search" />
          </WalkitStep>
        </Wrapper>,
      );
    });

    const step = ctx.sortedSteps[0];
    expect(step.title).toBe('Search bar');
    expect(step.content).toBe('Find content here.');
    expect(step.placement).toBe('bottom');
  });

  it('attaches data-walkit-step attribute to the child element', async () => {
    const { container } = render(
      <WalkitContextProvider config={{}}>
        <WalkitStep
          id="logo"
          sequence={1}
          title="Logo"
        >
          <img
            alt="logo"
            src="/logo.png"
          />
        </WalkitStep>
      </WalkitContextProvider>,
    );

    await act(async () => {});
    const img = container.querySelector('[data-runilib-react-walkit-step="logo"]');
    expect(img).not.toBeNull();
  });
});

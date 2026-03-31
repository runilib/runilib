import { useEffect } from 'react';

import { act, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useWalkitContext, WalkitContextProvider } from '../context/WalkitContext';
import type { WalkitContextValue, WalkitStepData } from '../types/Walkit.types';
import { withWalkitSequence } from '../utils/sequence';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeStep(id: string, sequence: number): WalkitStepData {
  return withWalkitSequence(
    {
      id,
      title: `Step ${sequence}`,
      content: `Description ${sequence}`,
      placement: 'auto',
      measure: () => Promise.resolve({ x: 0, y: 0, width: 100, height: 50 }),
    },
    sequence,
  );
}

/** Helper component that captures the context value. */
function Inspector({ onCapture }: { onCapture: (ctx: WalkitContextValue) => void }) {
  const ctx = useWalkitContext();
  useEffect(() => {
    onCapture(ctx);
  }, [ctx, onCapture]);
  return null;
}

async function setup(config = {}) {
  let captured!: WalkitContextValue;

  await act(async () => {
    render(
      <WalkitContextProvider config={config}>
        <Inspector
          onCapture={(ctx) => {
            captured = ctx;
          }}
        />
      </WalkitContextProvider>,
    );
  });

  return { ctx: () => captured };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('WalkitContextProvider', () => {
  it('starts with visible=false and empty steps', async () => {
    const { ctx } = await setup();
    expect(ctx().visible).toBe(false);
    expect(ctx().sortedSteps).toHaveLength(0);
  });

  it('registerStep adds and sorts steps by sequence', async () => {
    const { ctx } = await setup();
    await act(async () => {
      ctx().registerStep(makeStep('b', 2));
      ctx().registerStep(makeStep('a', 1));
    });
    expect(ctx().sortedSteps).toHaveLength(2);
    expect(ctx().sortedSteps[0].id).toBe('a');
    expect(ctx().sortedSteps[1].id).toBe('b');
  });

  it('unregisterStep removes a step', async () => {
    const { ctx } = await setup();
    await act(async () => {
      ctx().registerStep(makeStep('a', 1));
      ctx().registerStep(makeStep('b', 2));
    });
    await act(async () => {
      ctx().unregisterStep('b');
    });
    expect(ctx().sortedSteps).toHaveLength(1);
    expect(ctx().sortedSteps[0].id).toBe('a');
  });

  it('start() sets visible=true and currentIndex=0', async () => {
    const { ctx } = await setup();
    await act(async () => {
      ctx().registerStep(makeStep('a', 1));
    });
    await act(async () => {
      await ctx().start();
    });
    expect(ctx().visible).toBe(true);
    expect(ctx().currentIndex).toBe(0);
  });

  it('start() with a step name jumps to that step', async () => {
    const { ctx } = await setup();
    await act(async () => {
      ctx().registerStep(makeStep('first', 1));
      ctx().registerStep(makeStep('second', 2));
      ctx().registerStep(makeStep('third', 3));
    });
    await act(async () => {
      await ctx().start('third');
    });
    expect(ctx().currentIndex).toBe(2);
  });

  it('stop() sets visible=false and resets index', async () => {
    const { ctx } = await setup();
    await act(async () => {
      ctx().registerStep(makeStep('a', 1));
      await ctx().start();
    });
    act(() => {
      ctx().stop();
    });
    expect(ctx().visible).toBe(false);
    expect(ctx().currentIndex).toBe(0);
  });

  it('calls onStart and onStop callbacks', async () => {
    const onStart = vi.fn();
    const onStop = vi.fn();
    const { ctx } = await setup({ onStart, onStop });
    await act(async () => {
      ctx().registerStep(makeStep('a', 1));
      await ctx().start();
    });
    expect(onStart).toHaveBeenCalledTimes(1);
    act(() => {
      ctx().stop();
    });
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('calls onStepChange when advancing', async () => {
    const onStepChange = vi.fn();
    const { ctx } = await setup({ onStepChange });
    await act(async () => {
      ctx().registerStep(makeStep('a', 1));
      ctx().registerStep(makeStep('b', 2));
      await ctx().start();
    });
    await act(async () => {
      await ctx().next();
    });
    expect(onStepChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'b' }),
      1,
    );
  });

  it('next() on last step calls stop()', async () => {
    const onStop = vi.fn();
    const { ctx } = await setup({ onStop });
    await act(async () => {
      ctx().registerStep(makeStep('only', 1));
      await ctx().start();
    });
    await act(async () => {
      await ctx().next();
    });
    expect(ctx().visible).toBe(false);
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('prev() does nothing on first step', async () => {
    const { ctx } = await setup();
    await act(async () => {
      ctx().registerStep(makeStep('a', 1));
      ctx().registerStep(makeStep('b', 2));
      await ctx().start();
    });
    await act(async () => {
      await ctx().prev();
    });
    expect(ctx().currentIndex).toBe(0);
  });

  it('goTo() jumps to the correct index', async () => {
    const { ctx } = await setup();
    await act(async () => {
      ctx().registerStep(makeStep('a', 1));
      ctx().registerStep(makeStep('b', 2));
      ctx().registerStep(makeStep('c', 3));
      await ctx().start();
    });
    await act(async () => {
      await ctx().goTo(2);
    });
    expect(ctx().currentIndex).toBe(2);
    expect(ctx().currentStep?.id).toBe('c');
  });

  it('goTo() does nothing for out-of-range index', async () => {
    const { ctx } = await setup();
    await act(async () => {
      ctx().registerStep(makeStep('a', 1));
      await ctx().start();
    });
    await act(async () => {
      await ctx().goTo(99);
    });
    expect(ctx().currentIndex).toBe(0);
  });
});

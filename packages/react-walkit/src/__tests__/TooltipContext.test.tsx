import { useEffect } from 'react';

import { act, render } from '@testing-library/react';
import { StepwiseContextProvider, useStepwiseContext } from '../context/StepwiseContext';
import type { StepwiseContextValue, StepwiseStepData } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeStep(name: string, order: number): StepwiseStepData {
  return {
    name,
    order,
    title: `Step ${order}`,
    text: `Description ${order}`,
    placement: 'auto',
    measure: () => Promise.resolve({ x: 0, y: 0, width: 100, height: 50 }),
  };
}

/** Helper component that captures the context value. */
function Inspector({ onCapture }: { onCapture: (ctx: StepwiseContextValue) => void }) {
  const ctx = useStepwiseContext();
  useEffect(() => {
    onCapture(ctx);
  });
  return null;
}

async function setup(config = {}) {
  let captured!: StepwiseContextValue;

  await act(async () => {
    render(
      <StepwiseContextProvider config={config}>
        <Inspector
          onCapture={(ctx) => {
            captured = ctx;
          }}
        />
      </StepwiseContextProvider>,
    );
  });

  return { ctx: () => captured };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('StepwiseContextProvider', () => {
  it('starts with visible=false and empty steps', async () => {
    const { ctx } = await setup();
    expect(ctx().visible).toBe(false);
    expect(ctx().sortedSteps).toHaveLength(0);
  });

  it('registerStep adds and sorts steps by order', async () => {
    const { ctx } = await setup();
    await act(async () => {
      ctx().registerStep(makeStep('b', 2));
      ctx().registerStep(makeStep('a', 1));
    });
    expect(ctx().sortedSteps).toHaveLength(2);
    expect(ctx().sortedSteps[0].name).toBe('a');
    expect(ctx().sortedSteps[1].name).toBe('b');
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
    expect(ctx().sortedSteps[0].name).toBe('a');
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
    const onStart = jest.fn();
    const onStop = jest.fn();
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
    const onStepChange = jest.fn();
    const { ctx } = await setup({ onStepChange });
    await act(async () => {
      ctx().registerStep(makeStep('a', 1));
      ctx().registerStep(makeStep('b', 2));
      await ctx().start();
    });
    await act(async () => {
      await ctx().next();
    });
    expect(onStepChange).toHaveBeenCalledWith(expect.objectContaining({ name: 'b' }), 1);
  });

  it('next() on last step calls stop()', async () => {
    const onStop = jest.fn();
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
    expect(ctx().currentStep?.name).toBe('c');
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

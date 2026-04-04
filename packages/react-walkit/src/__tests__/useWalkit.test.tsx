import { useEffect } from 'react';

import { act, render, waitFor } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { useWalkitContext, WalkitContextProvider } from '../context/WalkitContext';
import { useWalkit } from '../hooks/useWalkit';
import type {
  UseWalkitReturn,
  WalkitContextValue,
  WalkitStepData,
} from '../types/Walkit.types';
import { withWalkitSequence } from '../utils/sequence';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeStep(id: string, sequence: number): WalkitStepData {
  return withWalkitSequence(
    {
      id,
      title: `Title ${sequence}`,
      content: `Text ${sequence}`,
      placement: 'auto',
      measure: () => Promise.resolve({ x: 0, y: 0, width: 80, height: 40 }),
    },
    sequence,
  );
}

/** Captures both the public hook API and the raw context (for registerStep). */
function Harness({
  onApi,
  onCtx,
}: {
  onApi: (api: UseWalkitReturn) => void;
  onCtx: (ctx: WalkitContextValue) => void;
}) {
  const api = useWalkit();
  const ctx = useWalkitContext();
  useEffect(() => {
    onApi(api);
    onCtx(ctx);
  }, [api, ctx, onApi, onCtx]);
  return null;
}

async function setup(config = {}) {
  let api!: UseWalkitReturn;
  let ctx!: WalkitContextValue;

  await act(async () => {
    render(
      <WalkitContextProvider config={config}>
        <Harness
          onApi={(a) => {
            api = a;
          }}
          onCtx={(c) => {
            ctx = c;
          }}
        />
      </WalkitContextProvider>,
    );
  });

  return { getApi: () => api, getCtx: () => ctx };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useWalkit', () => {
  it('defaults: isRunning=false, totalSteps=0', async () => {
    const { getApi } = await setup();
    expect(getApi().isRunning).toBe(false);
    expect(getApi().totalSteps).toBe(0);
    expect(getApi().currentStep).toBeNull();
  });

  it('start() sets isRunning=true', async () => {
    const { getApi, getCtx } = await setup();
    await act(async () => {
      getCtx().registerStep(makeStep('a', 1));
      await getApi().start();
    });
    expect(getApi().isRunning).toBe(true);
  });

  it('stop() sets isRunning=false', async () => {
    const { getApi, getCtx } = await setup();
    await act(async () => {
      getCtx().registerStep(makeStep('a', 1));
      await getApi().start();
    });
    act(() => {
      getApi().stop();
    });
    expect(getApi().isRunning).toBe(false);
  });

  it('isFirstStep=true and isLastStep=true when only one step', async () => {
    const { getApi, getCtx } = await setup();
    await act(async () => {
      getCtx().registerStep(makeStep('only', 1));
      await getApi().start();
    });
    expect(getApi().isFirstStep).toBe(true);
    expect(getApi().isLastStep).toBe(true);
  });

  it('isLastStep=false when more steps remain', async () => {
    const { getApi, getCtx } = await setup();
    await act(async () => {
      getCtx().registerStep(makeStep('a', 1));
      getCtx().registerStep(makeStep('b', 2));
      await getApi().start();
    });
    expect(getApi().isFirstStep).toBe(true);
    expect(getApi().isLastStep).toBe(false);
  });

  it('next() advances currentIndex', async () => {
    const { getApi, getCtx } = await setup();
    await act(async () => {
      getCtx().registerStep(makeStep('a', 1));
      getCtx().registerStep(makeStep('b', 2));
      await getApi().start();
    });
    await act(async () => {
      getApi().next();
    });
    await waitFor(() => {
      expect(getApi().currentIndex).toBe(1);
      expect(getApi().currentStep?.id).toBe('b');
    });
  });

  it('prev() decrements currentIndex', async () => {
    const { getApi, getCtx } = await setup();
    await act(async () => {
      getCtx().registerStep(makeStep('a', 1));
      getCtx().registerStep(makeStep('b', 2));
      await getApi().start();
    });
    await act(async () => {
      getApi().next();
    });
    await act(async () => {
      getApi().prev();
    });
    await waitFor(() => {
      expect(getApi().currentIndex).toBe(0);
    });
  });

  it('goTo() jumps directly to the index', async () => {
    const { getApi, getCtx } = await setup();
    await act(async () => {
      getCtx().registerStep(makeStep('a', 1));
      getCtx().registerStep(makeStep('b', 2));
      getCtx().registerStep(makeStep('c', 3));
      await getApi().start();
    });
    await act(async () => {
      getApi().goTo(2);
    });
    expect(getApi().currentIndex).toBe(2);
    expect(getApi().isLastStep).toBe(true);
  });

  it('totalSteps reflects registered steps', async () => {
    const { getApi, getCtx } = await setup();
    await act(async () => {
      getCtx().registerStep(makeStep('a', 1));
      getCtx().registerStep(makeStep('b', 2));
      getCtx().registerStep(makeStep('c', 3));
    });
    expect(getApi().totalSteps).toBe(3);
  });

  it('calls onStart when tour starts', async () => {
    const onStart = vi.fn();
    const { getApi, getCtx } = await setup({ onStart });
    await act(async () => {
      getCtx().registerStep(makeStep('a', 1));
      await getApi().start();
    });
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('calls onStop when tour stops', async () => {
    const onStop = vi.fn();
    const { getApi, getCtx } = await setup({ onStop });
    await act(async () => {
      getCtx().registerStep(makeStep('a', 1));
      await getApi().start();
    });
    act(() => {
      getApi().stop();
    });
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('throws when used outside WalkitProvider', () => {
    function Broken() {
      useWalkit();
      return null;
    }

    expect(() => renderToStaticMarkup(<Broken />)).toThrow(
      '[runilib/react-walkit] useWalkitContext must be used inside <WalkitProvider>.',
    );
  });
});

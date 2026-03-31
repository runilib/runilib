import { type ReactNode, useEffect } from 'react';

import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SharedWalkitOverlayBridge } from '../components/walkit/overlay-bridge/SharedWalkitOverlayBridge';
import { useWalkitContext, WalkitContextProvider } from '../context/WalkitContext';
import type {
  OverlayProps,
  RenderWalkitStepProps,
  WalkitContextValue,
  WalkitStepData,
} from '../types/Walkit.types';
import { withWalkitSequence } from '../utils/sequence';

function Inspector({ onCapture }: { onCapture: (ctx: WalkitContextValue) => void }) {
  const ctx = useWalkitContext();

  useEffect(() => {
    onCapture(ctx);
  }, [ctx, onCapture]);

  return null;
}

function makeStep(
  id: string,
  sequence: number,
  renderPopover?: (props: RenderWalkitStepProps) => ReactNode,
): WalkitStepData {
  return withWalkitSequence(
    {
      id,
      title: `Step ${sequence}`,
      content: `Description ${sequence}`,
      placement: 'auto',
      measure: () => Promise.resolve({ x: 0, y: 0, width: 100, height: 50 }),
      renderPopover,
    },
    sequence,
  );
}

afterEach(() => {
  cleanup();
});

describe('Walkit renderPopover resolution', () => {
  it('prefers the step-level renderer over the provider renderer', async () => {
    let ctx!: WalkitContextValue;
    let overlayProps!: OverlayProps;

    const providerRenderPopover = vi.fn(() => null);
    const stepRenderPopover = vi.fn(() => null);

    await act(async () => {
      render(
        <WalkitContextProvider config={{}}>
          <Inspector
            onCapture={(nextCtx) => {
              ctx = nextCtx;
            }}
          />
          <SharedWalkitOverlayBridge
            OverlayComponent={(props) => {
              overlayProps = props;
              return null;
            }}
            animationType="slide"
            spotlightPadding={8}
            spotlightBorderRadius={8}
            stopOnOutsideClick={false}
            labels={{}}
            renderPopover={providerRenderPopover}
          />
        </WalkitContextProvider>,
      );
    });

    await act(async () => {
      ctx.registerStep(makeStep('account', 1));
      ctx.registerStep(makeStep('billing', 2, stepRenderPopover));
      await ctx.start('billing');
    });

    expect(overlayProps.currentWalkitStep?.id).toBe('billing');
    expect(overlayProps.renderPopover).toBe(stepRenderPopover);
  });

  it('falls back to the provider renderer when the active step has no override', async () => {
    let ctx!: WalkitContextValue;
    let overlayProps!: OverlayProps;

    const providerRenderPopover = vi.fn(() => null);
    const stepRenderPopover = vi.fn(() => null);

    await act(async () => {
      render(
        <WalkitContextProvider config={{}}>
          <Inspector
            onCapture={(nextCtx) => {
              ctx = nextCtx;
            }}
          />
          <SharedWalkitOverlayBridge
            OverlayComponent={(props) => {
              overlayProps = props;
              return null;
            }}
            animationType="slide"
            spotlightPadding={8}
            spotlightBorderRadius={8}
            stopOnOutsideClick={false}
            labels={{}}
            renderPopover={providerRenderPopover}
          />
        </WalkitContextProvider>,
      );
    });

    await act(async () => {
      ctx.registerStep(makeStep('account', 1));
      ctx.registerStep(makeStep('billing', 2, stepRenderPopover));
      await ctx.start('account');
    });

    expect(overlayProps.currentWalkitStep?.id).toBe('account');
    expect(overlayProps.renderPopover).toBe(providerRenderPopover);
  });
});

import React from 'react';

import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WalkitStep } from '../components/walkit/web/WalkitStep.web';
import { useWalkit } from '../hooks/useWalkit';
import { WalkitProvider } from '../providers/WalkitProvider.web';
import type { UseWalkitReturn, WalkitAutoStart } from '../types/Walkit.types';
import { resetWalkitAutoStartSession } from '../utils/autoStart';

function CaptureWalkitApi({ onCapture }: { onCapture: (api: UseWalkitReturn) => void }) {
  const api = useWalkit();

  React.useEffect(() => {
    onCapture(api);
  });

  return null;
}

const TestScreen = ({
  autoStart,
  capture,
  showAutoStartStep = true,
}: {
  autoStart?: WalkitAutoStart;
  capture: (api: UseWalkitReturn) => void;
  showAutoStartStep?: boolean;
}) => {
  return (
    <WalkitProvider>
      <CaptureWalkitApi onCapture={capture} />

      {showAutoStartStep ? (
        <WalkitStep
          id="settings-profile"
          sequence={1}
          title="Profile"
          content="Manage your profile."
          autoStart={autoStart}
        >
          <button type="button">Profile</button>
        </WalkitStep>
      ) : null}

      <WalkitStep
        id="settings-billing"
        sequence={2}
        title="Billing"
        content="Manage your billing."
      >
        <button type="button">Billing</button>
      </WalkitStep>
    </WalkitProvider>
  );
};

async function flushTimers(): Promise<void> {
  await act(async () => {
    await vi.runOnlyPendingTimersAsync();
  });
}

const VISIBLE_RECT = {
  x: 120,
  y: 120,
  left: 120,
  top: 120,
  width: 180,
  height: 44,
  right: 300,
  bottom: 164,
  toJSON() {
    return this;
  },
} satisfies DOMRect;

const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;

describe('Walkit autoStart', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetWalkitAutoStartSession();
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      () => VISIBLE_RECT,
    );
    HTMLElement.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(performance.now());
      return 0;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});
    vi.stubGlobal(
      'ResizeObserver',
      class ResizeObserver {
        observe() {
          console.log('observe');
        }
        unobserve() {
          console.log('unobserve');
        }
        disconnect() {
          console.log('disconnect');
        }
      },
    );
  });

  afterEach(() => {
    cleanup();
    resetWalkitAutoStartSession();
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('starts automatically from the configured step', async () => {
    let api!: UseWalkitReturn;

    render(
      <TestScreen
        autoStart
        capture={(nextApi) => {
          api = nextApi;
        }}
      />,
    );

    await flushTimers();

    expect(api.isRunning).toBe(true);
    expect(api.currentStep?.id).toBe('settings-profile');
  });

  it('supports delayed auto-start', async () => {
    let api!: UseWalkitReturn;

    render(
      <TestScreen
        autoStart={{ delay: 600 }}
        capture={(nextApi) => {
          api = nextApi;
        }}
      />,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(599);
    });

    expect(api.isRunning).toBe(false);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    await flushTimers();

    expect(api.isRunning).toBe(true);
    expect(api.currentStep?.id).toBe('settings-profile');
  });

  it('does not auto-start again when mode is once', async () => {
    let api!: UseWalkitReturn;

    const view = render(
      <TestScreen
        autoStart={{ mode: 'once', key: 'settings-tour' }}
        capture={(nextApi) => {
          api = nextApi;
        }}
      />,
    );

    await flushTimers();

    expect(api.isRunning).toBe(true);
    expect(api.currentStep?.id).toBe('settings-profile');

    act(() => {
      api.stop();
    });

    expect(api.isRunning).toBe(false);

    view.rerender(
      <TestScreen
        autoStart={{ mode: 'once', key: 'settings-tour' }}
        capture={(nextApi) => {
          api = nextApi;
        }}
        showAutoStartStep={false}
      />,
    );

    view.rerender(
      <TestScreen
        autoStart={{ mode: 'once', key: 'settings-tour' }}
        capture={(nextApi) => {
          api = nextApi;
        }}
      />,
    );

    await flushTimers();

    expect(api.isRunning).toBe(false);
  });
});

import { act, render } from "@testing-library/react";
import { useEffect } from "react";

import { StepwiseContextProvider, useStepwiseContext } from "../../src/context/StepwiseContext";
import { useStepwise } from "../../src/hooks/useStepwise";
import type { StepwiseContextValue, StepwiseStepData, UseStepwiseReturn } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeStep(name: string, order: number): StepwiseStepData {
  return {
    name,
    order,
    title: `Title ${order}`,
    text: `Text ${order}`,
    placement: "auto",
    measure: () => Promise.resolve({ x: 0, y: 0, width: 80, height: 40 }),
  };
}

/** Captures both the public hook API and the raw context (for registerStep). */
function Harness({
  onApi,
  onCtx,
}: {
  onApi: (api: UseStepwiseReturn) => void;
  onCtx: (ctx: StepwiseContextValue) => void;
}) {
  const api = useStepwise();
  const ctx = useStepwiseContext();
  useEffect(() => {
    onApi(api);
    onCtx(ctx);
  });
  return null;
}

async function setup(config = {}) {
  let api!: UseStepwiseReturn;
  let ctx!: StepwiseContextValue;

  await act(async () => {
    render(
      <StepwiseContextProvider config={config}>
        <Harness
          onApi={(a) => {
            api = a;
          }}
          onCtx={(c) => {
            ctx = c;
          }}
        />
      </StepwiseContextProvider>
    );
  });

  return { getApi: () => api, getCtx: () => ctx };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useWalk", () => {
  it("defaults: isRunning=false, totalSteps=0", async () => {
    const { getApi } = await setup();
    expect(getApi().isRunning).toBe(false);
    expect(getApi().totalSteps).toBe(0);
    expect(getApi().currentStep).toBeNull();
  });

  it("start() sets isRunning=true", async () => {
    const { getApi, getCtx } = await setup();
    await act(async () => {
      getCtx().registerStep(makeStep("a", 1));
      await getApi().start();
    });
    expect(getApi().isRunning).toBe(true);
  });

  it("stop() sets isRunning=false", async () => {
    const { getApi, getCtx } = await setup();
    await act(async () => {
      getCtx().registerStep(makeStep("a", 1));
      await getApi().start();
    });
    act(() => {
      getApi().stop();
    });
    expect(getApi().isRunning).toBe(false);
  });

  it("isFirstStep=true and isLastStep=true when only one step", async () => {
    const { getApi, getCtx } = await setup();
    await act(async () => {
      getCtx().registerStep(makeStep("only", 1));
      await getApi().start();
    });
    expect(getApi().isFirstStep).toBe(true);
    expect(getApi().isLastStep).toBe(true);
  });

  it("isLastStep=false when more steps remain", async () => {
    const { getApi, getCtx } = await setup();
    await act(async () => {
      getCtx().registerStep(makeStep("a", 1));
      getCtx().registerStep(makeStep("b", 2));
      await getApi().start();
    });
    expect(getApi().isFirstStep).toBe(true);
    expect(getApi().isLastStep).toBe(false);
  });

  it("next() advances currentIndex", async () => {
    const { getApi, getCtx } = await setup();
    await act(async () => {
      getCtx().registerStep(makeStep("a", 1));
      getCtx().registerStep(makeStep("b", 2));
      await getApi().start();
    });
    await act(async () => {
      getApi().next();
    });
    expect(getApi().currentIndex).toBe(1);
    expect(getApi().currentStep?.name).toBe("b");
  });

  it("prev() decrements currentIndex", async () => {
    const { getApi, getCtx } = await setup();
    await act(async () => {
      getCtx().registerStep(makeStep("a", 1));
      getCtx().registerStep(makeStep("b", 2));
      await getApi().start();
    });
    await act(async () => {
      getApi().next();
    });
    await act(async () => {
      getApi().prev();
    });
    expect(getApi().currentIndex).toBe(0);
  });

  it("goTo() jumps directly to the index", async () => {
    const { getApi, getCtx } = await setup();
    await act(async () => {
      getCtx().registerStep(makeStep("a", 1));
      getCtx().registerStep(makeStep("b", 2));
      getCtx().registerStep(makeStep("c", 3));
      await getApi().start();
    });
    await act(async () => {
      getApi().goTo(2);
    });
    expect(getApi().currentIndex).toBe(2);
    expect(getApi().isLastStep).toBe(true);
  });

  it("totalSteps reflects registered steps", async () => {
    const { getApi, getCtx } = await setup();
    await act(async () => {
      getCtx().registerStep(makeStep("a", 1));
      getCtx().registerStep(makeStep("b", 2));
      getCtx().registerStep(makeStep("c", 3));
    });
    expect(getApi().totalSteps).toBe(3);
  });

  it("calls onStart when tour starts", async () => {
    const onStart = jest.fn();
    const { getApi, getCtx } = await setup({ onStart });
    await act(async () => {
      getCtx().registerStep(makeStep("a", 1));
      await getApi().start();
    });
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("calls onStop when tour stops", async () => {
    const onStop = jest.fn();
    const { getApi, getCtx } = await setup({ onStop });
    await act(async () => {
      getCtx().registerStep(makeStep("a", 1));
      await getApi().start();
    });
    act(() => {
      getApi().stop();
    });
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it("throws when used outside WalkProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    function Broken() {
      useStepwise();
      return null;
    }
    expect(() => render(<Broken />)).toThrow("[universal-copilot]");
    spy.mockRestore();
  });
});

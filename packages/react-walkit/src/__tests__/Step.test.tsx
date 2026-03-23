import { act, render } from "@testing-library/react";
import React from "react";

import { Stepwise } from "../components/Step";
import { StepwiseContextProvider, useStepwiseContext } from "../context/StepwiseContext";
import type { StepwiseContextValue } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CtxCapture({ onCapture }: { onCapture: (ctx: StepwiseContextValue) => void }) {
  const ctx = useStepwiseContext();
  React.useEffect(() => {
    onCapture(ctx);
  });
  return null;
}

function Wrapper({
  children,
  onCapture,
}: {
  children: React.ReactNode;
  onCapture: (c: StepwiseContextValue) => void;
}) {
  return (
    <StepwiseContextProvider config={{}}>
      <CtxCapture onCapture={onCapture} />
      {children}
    </StepwiseContextProvider>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("WalkStep (web)", () => {
  it("registers itself on mount", async () => {
    let ctx!: StepwiseContextValue;

    await act(async () => {
      render(
        <Wrapper
          onCapture={(c) => {
            ctx = c;
          }}
        >
          <Stepwise name="btn" order={1} title="Click me" text="A button.">
            <button type="button">Click</button>
          </Stepwise>
        </Wrapper>
      );
    });

    expect(ctx.sortedSteps).toHaveLength(1);
    expect(ctx.sortedSteps[0].name).toBe("btn");
    expect(ctx.sortedSteps[0].order).toBe(1);
  });

  it("registers multiple steps in the correct order", async () => {
    let ctx!: StepwiseContextValue;

    await act(async () => {
      render(
        <Wrapper
          onCapture={(c) => {
            ctx = c;
          }}
        >
          <Stepwise name="b" order={2} title="B">
            <span>B</span>
          </Stepwise>
          <Stepwise name="a" order={1} title="A">
            <span>A</span>
          </Stepwise>
          <Stepwise name="c" order={3} title="C">
            <span>C</span>
          </Stepwise>
        </Wrapper>
      );
    });

    expect(ctx.sortedSteps.map((s) => s.name)).toEqual(["a", "b", "c"]);
  });

  it("does NOT register when active=false", async () => {
    let ctx!: StepwiseContextValue;

    await act(async () => {
      render(
        <Wrapper
          onCapture={(c) => {
            ctx = c;
          }}
        >
          <Stepwise name="hidden" order={1} title="Hidden" active={false}>
            <span>Hidden</span>
          </Stepwise>
        </Wrapper>
      );
    });

    expect(ctx.sortedSteps).toHaveLength(0);
  });

  it("passes title and text to the registered step", async () => {
    let ctx!: StepwiseContextValue;

    await act(async () => {
      render(
        <Wrapper
          onCapture={(c) => {
            ctx = c;
          }}
        >
          <Stepwise
            name="search"
            order={1}
            title="Search bar"
            text="Find content here."
            placement="bottom"
          >
            <input placeholder="Search" />
          </Stepwise>
        </Wrapper>
      );
    });

    const step = ctx.sortedSteps[0];
    expect(step.title).toBe("Search bar");
    expect(step.text).toBe("Find content here.");
    expect(step.placement).toBe("bottom");
  });

  it("attaches data-copilot-step attribute to the child element", async () => {
    const { container } = render(
      <StepwiseContextProvider config={{}}>
        <Stepwise name="logo" order={1} title="Logo">
          <img alt="logo" src="/logo.png" />
        </Stepwise>
      </StepwiseContextProvider>
    );

    await act(async () => {});
    const img = container.querySelector('[data-copilot-step="logo"]');
    expect(img).not.toBeNull();
  });
});

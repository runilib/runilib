
import type { TooltipStepProps } from "../../types";
import { isWeb } from "../../utils/platform";
import { NativeTooltipStep } from "./TooltipStep.native";
import { WebTooltipStep } from "./TooltipStep.web";

/**
 * `TooltipStep`
 * ─────────────
 * Wraps a UI element and registers it as a step in the onboarding tour.
 * The wrapped child must accept a `ref` (DOM element on web, native View on RN).
 *
 * @example
 * <TooltipStep name="search" order={2} title="Search" text="Find anything here.">
 *   <input placeholder="Search..." />
 * </TooltipStep>
 */
export const TooltipStep = (props:TooltipStepProps) => {
  return isWeb ? <WebTooltipStep {...props} /> : <NativeTooltipStep {...props} />;
};

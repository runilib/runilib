import type { ComponentType } from "react";

import type { OverlayProps } from "../types";
import { isWeb } from "../utils/platform";
import { type BridgeProps, CopilotOverlayBridgeShared } from "./TooltipOverlayBridge.shared";

const OverlayComponent: ComponentType<OverlayProps> = isWeb
  ? (
      require("./web/Overlay") as {
        WebOverlay: ComponentType<OverlayProps>;
      }
    ).WebOverlay
  : (
      require("./native/Overlay") as {
        NativeOverlay: ComponentType<OverlayProps>;
      }
    ).NativeOverlay;

export const CopilotOverlayBridge =(props: BridgeProps)=> {
  return <CopilotOverlayBridgeShared {...props} OverlayComponent={OverlayComponent} />;
}

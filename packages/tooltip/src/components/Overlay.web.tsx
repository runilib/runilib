import { type BridgeProps, TooltipOverlayBridgeShared } from "./TooltipOverlayBridge.shared";
import { WebOverlay } from "./web/Overlay.web";

export const TooltipOverlayBridge = (props: BridgeProps) => {
  return <TooltipOverlayBridgeShared {...props} OverlayComponent={WebOverlay} />;
};

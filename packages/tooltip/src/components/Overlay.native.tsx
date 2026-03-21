import { NativeOverlay } from "./native/Overlay.native";
import { type BridgeProps, TooltipOverlayBridgeShared } from "./TooltipOverlayBridge.shared";

export const TooltipOverlayBridge = (props: BridgeProps) => {
  return <TooltipOverlayBridgeShared {...props} OverlayComponent={NativeOverlay} />;
};

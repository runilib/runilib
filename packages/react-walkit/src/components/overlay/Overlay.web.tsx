import { WebOverlay } from "../walk/web/Overlay.web";
import { type BridgeProps, WalkOverlayBridgeShared } from "./WalkOverlayBridge.shared";

export const WalkOverlayBridge = (props: BridgeProps) => {
  return <WalkOverlayBridgeShared {...props} OverlayComponent={WebOverlay} />;
};

import { NativeOverlay } from "../walk/native/Overlay.native";
import { type BridgeProps, WalkOverlayBridgeShared } from "./WalkOverlayBridge.shared";

export const WalkOverlayBridge = (props: BridgeProps) => {
  return <WalkOverlayBridgeShared {...props} OverlayComponent={NativeOverlay} />;
};

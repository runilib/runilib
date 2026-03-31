import { NativeOverlay } from '../native/Overlay.native';
import { type BridgeProps, SharedWalkitOverlayBridge } from './SharedWalkitOverlayBridge';

export const WalkitOverlayBridge = (props: BridgeProps) => {
  return (
    <SharedWalkitOverlayBridge
      {...props}
      OverlayComponent={NativeOverlay}
    />
  );
};

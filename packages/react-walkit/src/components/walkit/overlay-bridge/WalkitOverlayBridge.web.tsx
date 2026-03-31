import { WebOverlay } from '../web/Overlay.web';
import { type BridgeProps, SharedWalkitOverlayBridge } from './SharedWalkitOverlayBridge';

export const WalkitOverlayBridge = (props: BridgeProps) => {
  return (
    <SharedWalkitOverlayBridge
      {...props}
      OverlayComponent={WebOverlay}
    />
  );
};

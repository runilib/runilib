import type { View } from 'react-native';

let walkitNativeHost: View | null = null;

export function setWalkitNativeHost(nextHost: View | null): void {
  walkitNativeHost = nextHost;
}

export function getWalkitNativeHost(): View | null {
  return walkitNativeHost;
}

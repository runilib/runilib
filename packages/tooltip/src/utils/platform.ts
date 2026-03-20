let _isWeb = false;

try {
  const RN = require("react-native");
  _isWeb = RN.Platform.OS === "web";
} catch {
  _isWeb = typeof document !== "undefined";
}

export const isWeb: boolean = _isWeb;
export const isNative: boolean = !_isWeb;

export function getPlatformValue<T>(webValue: T, nativeValue: T): T {
  return isWeb ? webValue : nativeValue;
}

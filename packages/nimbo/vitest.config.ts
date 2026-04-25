import { mergeConfig } from "vitest/config";
import { sharedVitestConfig } from "../../vitest.shared";

export default mergeConfig(sharedVitestConfig, {
  test: {
    name: "nimbo",
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});

import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts", // Web
    "index.native": "src/index.native.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  target: "es2019",
  outDir: 'dist',
  external: ["react", "react-dom", "react-native", "react-native-web"],
  tsconfig: "./tsconfig-build.json",
});
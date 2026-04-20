import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts", // Web
    "index.native": "src/index.native.ts",
    // Server-safe entry for schema/builders used by strict server/client runtimes.
    // Keeping it separate avoids routing server-only imports through the root
    // bundle, which also exports React hooks and components.
    schema: "src/schema.ts",
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

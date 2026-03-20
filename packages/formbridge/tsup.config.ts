import { defineConfig } from 'tsup';
export default defineConfig({
  entry: ['src/index.ts'], format: ['cjs', 'esm'],
  dts: true, sourcemap: true, clean: true, treeshake: true,
  external: ['react', 'react-dom', 'react-native'],
  esbuildOptions(o) { o.jsx = 'automatic'; },
});

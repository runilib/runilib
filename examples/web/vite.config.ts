import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "react-native$": "react-native-web",
    },
    extensions: [
      ".web.tsx",
      ".web.ts",
      ".web.jsx",
      ".web.js",
      ".web.mjs",
      ".web.mts",
      ".tsx",
      ".ts",
      ".jsx",
      ".js",
      ".json",
    ],
    dedupe: ["react", "react-dom", "react-native-web"],
  },
  optimizeDeps: {
    exclude: ["@runilib/tooltip"],
  },
})

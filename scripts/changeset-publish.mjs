#!/usr/bin/env node

import { spawn } from "node:child_process";

const withPublishedSourcemaps = process.argv.includes("--with-published-sourcemaps");

const child = spawn("yarn", ["exec", "changeset", "publish"], {
  stdio: "inherit",
  env: {
    ...process.env,
    RUNILIB_PUBLISH_SOURCEMAPS: withPublishedSourcemaps ? "true" : "false",
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

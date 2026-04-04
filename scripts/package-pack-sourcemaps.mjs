#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const command = process.argv[2];
const packageDir = process.cwd();
const distDir = path.join(packageDir, "dist");
const tempRootDir = path.join(packageDir, ".pack-tmp");
const tempMapsDir = path.join(tempRootDir, "sourcemaps");
const manifestPath = path.join(tempRootDir, "sourcemaps-manifest.json");

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function walkFiles(targetDir) {
  const entries = await fs.readdir(targetDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkFiles(entryPath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

async function restoreSourcemaps() {
  if (!(await pathExists(manifestPath))) {
    return;
  }

  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

  for (const relativeFile of manifest.files) {
    const sourcePath = path.join(tempMapsDir, relativeFile);
    const destinationPath = path.join(packageDir, relativeFile);

    if (!(await pathExists(sourcePath))) {
      continue;
    }

    await fs.mkdir(path.dirname(destinationPath), { recursive: true });
    await fs.rename(sourcePath, destinationPath);
  }

  await fs.rm(tempRootDir, { recursive: true, force: true });
}

async function hideSourcemaps() {
  await restoreSourcemaps();

  if (process.env.RUNILIB_PUBLISH_SOURCEMAPS !== "false") {
    return;
  }

  if (!(await pathExists(distDir))) {
    return;
  }

  const distFiles = await walkFiles(distDir);
  const mapFiles = distFiles.filter((filePath) => filePath.endsWith(".map"));

  if (mapFiles.length === 0) {
    return;
  }

  await fs.mkdir(tempMapsDir, { recursive: true });

  const manifest = {
    files: [],
  };

  for (const filePath of mapFiles) {
    const relativeFile = path.relative(packageDir, filePath);
    const destinationPath = path.join(tempMapsDir, relativeFile);

    await fs.mkdir(path.dirname(destinationPath), { recursive: true });
    await fs.rename(filePath, destinationPath);
    manifest.files.push(relativeFile);
  }

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
}

async function main() {
  if (command === "hide") {
    await hideSourcemaps();
    return;
  }

  if (command === "restore") {
    await restoreSourcemaps();
    return;
  }

  throw new Error('Expected "hide" or "restore" as the first argument.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

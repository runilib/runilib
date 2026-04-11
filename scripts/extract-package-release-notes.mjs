#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const usage = [
  "Usage:",
  "  node ./scripts/extract-package-release-notes.mjs --package-path <path> --version <x.y.z> [--output <file>]",
].join("\n");

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const value = argv[index + 1];

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for argument "${token}".`);
    }

    args[key] = value;
    index += 1;
  }

  return args;
}

function trimEmptyLines(lines) {
  let start = 0;
  let end = lines.length;

  while (start < end && lines[start].trim() === "") {
    start += 1;
  }

  while (end > start && lines[end - 1].trim() === "") {
    end -= 1;
  }

  return lines.slice(start, end);
}

function extractReleaseNotes(changelogContent, version) {
  const lines = changelogContent.split(/\r?\n/);
  const versionHeading = new RegExp(`^## \\[${version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\](?:\\s*[—-]\\s*.+)?$`);
  const nextHeading = /^## \[[^\]]+\](?:\s*[—-]\s*.+)?$/;

  const sectionStart = lines.findIndex((line) => versionHeading.test(line.trim()));

  if (sectionStart === -1) {
    throw new Error(`Could not find version "${version}" in CHANGELOG.md.`);
  }

  let sectionEnd = lines.length;

  for (let index = sectionStart + 1; index < lines.length; index += 1) {
    if (nextHeading.test(lines[index].trim())) {
      sectionEnd = index;
      break;
    }
  }

  const bodyLines = trimEmptyLines(lines.slice(sectionStart + 1, sectionEnd));

  if (bodyLines.length === 0) {
    return `Release ${version}.`;
  }

  return `${bodyLines.join("\n").trim()}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const packagePath = args["package-path"];
  const version = args.version;
  const outputPath = args.output;

  if (!packagePath || !version) {
    throw new Error(usage);
  }

  const changelogPath = path.resolve(process.cwd(), packagePath, "CHANGELOG.md");
  const changelogContent = await readFile(changelogPath, "utf8");
  const releaseNotes = extractReleaseNotes(changelogContent, version);

  if (outputPath) {
    await writeFile(path.resolve(process.cwd(), outputPath), releaseNotes, "utf8");
    return;
  }

  process.stdout.write(releaseNotes);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

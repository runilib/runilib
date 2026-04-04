#!/usr/bin/env node

import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const packagesRoot = path.join(repoRoot, "packages");
const defaultBudgetFile = path.join(repoRoot, "size-budgets.json");
const defaultMarkdownFile = path.join(repoRoot, "SIZE_REPORT.md");

const budgetMetricDefinitions = {
  publishedTarballSize: {
    label: "published tarball",
    getValue: (report) => report.published.tarballSize,
  },
  publishedUnpackedSize: {
    label: "published unpacked size",
    getValue: (report) => report.published.unpackedSize,
  },
  publishedWebRuntimeSize: {
    label: "published web runtime",
    getValue: (report) => report.published.web?.runtimeSize ?? null,
  },
  publishedNativeRuntimeSize: {
    label: "published react-native runtime",
    getValue: (report) => report.published.native?.runtimeSize ?? null,
  },
  localWebRuntimeGzip: {
    label: "local web runtime gzip",
    getValue: (report) => report.local.webRuntimeStats?.gzip ?? null,
  },
  localNativeRuntimeGzip: {
    label: "local react-native runtime gzip",
    getValue: (report) => report.local.nativeRuntimeStats?.gzip ?? null,
  },
  localWebRuntimeBrotli: {
    label: "local web runtime brotli",
    getValue: (report) => report.local.webRuntimeStats?.brotli ?? null,
  },
  localNativeRuntimeBrotli: {
    label: "local react-native runtime brotli",
    getValue: (report) => report.local.nativeRuntimeStats?.brotli ?? null,
  },
};

function formatBytes(bytes) {
  if (bytes === null || bytes === undefined || Number.isNaN(bytes)) {
    return "n/a";
  }

  const units = ["B", "kB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function normalizePackPath(filePath) {
  return filePath.replace(/\\/g, "/").replace(/^\.\//, "");
}

function normalizeManifestPath(filePath) {
  if (!filePath || typeof filePath !== "string") {
    return null;
  }

  return normalizePackPath(filePath);
}

function toRelativeRepoPath(targetPath) {
  return path.relative(repoRoot, targetPath).replace(/\\/g, "/");
}

function modeLabel(stripPublishedSourcemaps) {
  return stripPublishedSourcemaps
    ? "published package simulated without sourcemaps"
    : "published package with sourcemaps";
}

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

async function resolveWorkspaceDirectories() {
  const entries = await fs.readdir(packagesRoot, { withFileTypes: true });
  const workspaceDirs = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const packageDir = path.join(packagesRoot, entry.name);
    const packageJsonPath = path.join(packageDir, "package.json");

    if (await pathExists(packageJsonPath)) {
      workspaceDirs.push(packageDir);
    }
  }

  return workspaceDirs.sort();
}

async function loadWorkspaceIndex() {
  const workspaceDirs = await resolveWorkspaceDirectories();
  const index = new Map();

  for (const packageDir of workspaceDirs) {
    const packageJsonPath = path.join(packageDir, "package.json");
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));

    index.set(packageJson.name, {
      packageDir,
      packageJson,
    });

    index.set(path.basename(packageDir), {
      packageDir,
      packageJson,
    });
  }

  return {
    workspaceDirs,
    index,
  };
}

async function resolveTargets(rawTargets) {
  const { workspaceDirs, index } = await loadWorkspaceIndex();

  if (rawTargets.length === 0 || rawTargets.includes("--all")) {
    return workspaceDirs;
  }

  const resolved = [];

  for (const rawTarget of rawTargets) {
    if (index.has(rawTarget)) {
      resolved.push(index.get(rawTarget).packageDir);
      continue;
    }

    const absolutePath = path.isAbsolute(rawTarget)
      ? rawTarget
      : path.resolve(repoRoot, rawTarget);

    if (await pathExists(path.join(absolutePath, "package.json"))) {
      resolved.push(absolutePath);
      continue;
    }

    throw new Error(
      `Unknown package target "${rawTarget}". Use a workspace name like "@runilib/react-walkit", a folder name like "react-walkit", or a path like "packages/react-walkit".`,
    );
  }

  return resolved;
}

function sumSizes(files) {
  return files.reduce((total, file) => total + file.size, 0);
}

async function getPackInfo(packageDir, options) {
  const tempCacheDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "runilib-package-size-"),
  );

  try {
    const { stdout } = await execFileAsync(
      "npm",
      ["pack", "--dry-run", "--json", "--cache", tempCacheDir],
      {
        cwd: packageDir,
        env: {
          ...process.env,
          RUNILIB_PUBLISH_SOURCEMAPS: options.stripPublishedSourcemaps
            ? "false"
            : process.env.RUNILIB_PUBLISH_SOURCEMAPS ?? "true",
        },
        maxBuffer: 10 * 1024 * 1024,
      },
    );

    const parsed = JSON.parse(stdout);
    return parsed[0];
  } finally {
    await fs.rm(tempCacheDir, { recursive: true, force: true });
  }
}

async function getFileCompressionStats(filePath) {
  if (!filePath || !(await pathExists(filePath))) {
    return null;
  }

  const buffer = await fs.readFile(filePath);

  return {
    raw: buffer.byteLength,
    gzip: gzipSync(buffer).byteLength,
    brotli: brotliCompressSync(buffer, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 11,
      },
    }).byteLength,
  };
}

function makeEntryGroup(label, runtimePackPath, typesPackPath, filesByPath) {
  if (!runtimePackPath && !typesPackPath) {
    return null;
  }

  const runtimeFile = runtimePackPath ? filesByPath.get(runtimePackPath) : null;
  const mapFile = runtimePackPath ? filesByPath.get(`${runtimePackPath}.map`) : null;
  const typesFile = typesPackPath ? filesByPath.get(typesPackPath) : null;

  return {
    label,
    runtimePackPath,
    typesPackPath,
    runtimeSize: runtimeFile?.size ?? 0,
    mapSize: mapFile?.size ?? 0,
    typesSize: typesFile?.size ?? 0,
    totalPublishedSize:
      (runtimeFile?.size ?? 0) + (mapFile?.size ?? 0) + (typesFile?.size ?? 0),
  };
}

async function analyzePackage(packageDir, options) {
  const packageJsonPath = path.join(packageDir, "package.json");
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
  const distDir = path.join(packageDir, "dist");
  const hasDist = await pathExists(distDir);
  const distFiles = hasDist ? await walkFiles(distDir) : [];
  const distStats = await Promise.all(
    distFiles.map(async (filePath) => {
      const stat = await fs.stat(filePath);
      return {
        absolutePath: filePath,
        relativePath: path.relative(packageDir, filePath).replace(/\\/g, "/"),
        size: stat.size,
      };
    }),
  );

  const packInfo = await getPackInfo(packageDir, options);
  const packedFiles = packInfo.files.map((file) => ({
    path: normalizePackPath(file.path),
    size: file.size,
  }));
  const packedFilesByPath = new Map(packedFiles.map((file) => [file.path, file]));

  const webRuntimePackPath = normalizeManifestPath(packageJson.main);
  const webTypesPackPath = normalizeManifestPath(packageJson.types);
  const nativeRuntimePackPath =
    normalizeManifestPath(packageJson["react-native"]) ||
    normalizeManifestPath(packageJson.exports?.["."]?.["react-native"]?.default);
  const nativeTypesPackPath = normalizeManifestPath(
    packageJson.exports?.["."]?.["react-native"]?.types,
  );

  const webGroup = makeEntryGroup(
    "web",
    webRuntimePackPath,
    webTypesPackPath,
    packedFilesByPath,
  );
  const nativeGroup = makeEntryGroup(
    "react-native",
    nativeRuntimePackPath,
    nativeTypesPackPath,
    packedFilesByPath,
  );

  const accountedPackPaths = new Set();

  for (const group of [webGroup, nativeGroup]) {
    if (!group) {
      continue;
    }

    if (group.runtimePackPath) {
      accountedPackPaths.add(group.runtimePackPath);
      accountedPackPaths.add(`${group.runtimePackPath}.map`);
    }

    if (group.typesPackPath) {
      accountedPackPaths.add(group.typesPackPath);
    }
  }

  const publishedDistFiles = packedFiles.filter((file) => file.path.startsWith("dist/"));
  const sharedDistFiles = publishedDistFiles.filter(
    (file) => !accountedPackPaths.has(file.path),
  );
  const nonDistPublishedFiles = packedFiles.filter(
    (file) => !file.path.startsWith("dist/"),
  );

  const webRuntimeStats = await getFileCompressionStats(
    webRuntimePackPath ? path.join(packageDir, webRuntimePackPath) : null,
  );
  const nativeRuntimeStats = await getFileCompressionStats(
    nativeRuntimePackPath ? path.join(packageDir, nativeRuntimePackPath) : null,
  );

  return {
    packageName: packageJson.name,
    packageDir,
    hasDist,
    distFiles: distStats,
    mode: {
      stripPublishedSourcemaps: options.stripPublishedSourcemaps,
    },
    packInfo,
    published: {
      tarballSize: packInfo.size,
      unpackedSize: packInfo.unpackedSize,
      entryCount: packInfo.entryCount,
      nonDistSize: sumSizes(nonDistPublishedFiles),
      distTotalSize: sumSizes(publishedDistFiles),
      sharedDistSize: sumSizes(sharedDistFiles),
      web: webGroup,
      native: nativeGroup,
    },
    local: {
      distTotalSize: distStats.reduce((total, file) => total + file.size, 0),
      webRuntimeStats,
      nativeRuntimeStats,
    },
  };
}

function parseArgs(argv) {
  const options = {
    stripPublishedSourcemaps: false,
    outputJson: false,
    outputMarkdown: false,
    writeMarkdownPath: null,
    checkBudget: false,
    budgetFilePath: defaultBudgetFile,
    targets: [],
    showHelp: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    switch (arg) {
      case "--help":
      case "-h":
        options.showHelp = true;
        break;
      case "--json":
        options.outputJson = true;
        break;
      case "--markdown":
        options.outputMarkdown = true;
        break;
      case "--write-markdown": {
        const nextArg = argv[index + 1];
        if (nextArg && !nextArg.startsWith("--")) {
          options.writeMarkdownPath = path.resolve(repoRoot, nextArg);
          index += 1;
        } else {
          options.writeMarkdownPath = defaultMarkdownFile;
        }
        break;
      }
      case "--check-budget":
        options.checkBudget = true;
        break;
      case "--budget-file": {
        const nextArg = argv[index + 1];
        if (!nextArg) {
          throw new Error("--budget-file expects a path.");
        }

        options.budgetFilePath = path.resolve(repoRoot, nextArg);
        index += 1;
        break;
      }
      case "--without-published-sourcemaps":
        options.stripPublishedSourcemaps = true;
        break;
      default:
        options.targets.push(arg);
        break;
    }
  }

  return options;
}

async function loadBudgetConfig(filePath) {
  if (!(await pathExists(filePath))) {
    return null;
  }

  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function evaluateBudgets(reports, budgetConfig, options) {
  if (!budgetConfig) {
    return {
      failures: options.checkBudget
        ? [`Budget file not found at ${toRelativeRepoPath(options.budgetFilePath)}.`]
        : [],
      summary: [],
    };
  }

  const failures = [];
  const summary = [];
  const expectedMode = budgetConfig.mode?.stripPublishedSourcemaps;

  if (
    typeof expectedMode === "boolean" &&
    expectedMode !== options.stripPublishedSourcemaps
  ) {
    failures.push(
      `Budget file expects stripPublishedSourcemaps=${expectedMode}, but the script ran with stripPublishedSourcemaps=${options.stripPublishedSourcemaps}.`,
    );
  }

  for (const report of reports) {
    const packageBudget = budgetConfig.packages?.[report.packageName];

    if (!packageBudget) {
      failures.push(
        `Missing budget entry for ${report.packageName} in ${toRelativeRepoPath(options.budgetFilePath)}.`,
      );
      continue;
    }

    const packageSummary = [];

    for (const [metricName, budgetValue] of Object.entries(packageBudget)) {
      if (metricName.startsWith("_comment") || metricName === "$comment") {
        continue;
      }

      const metric = budgetMetricDefinitions[metricName];

      if (!metric) {
        failures.push(
          `Unknown budget metric "${metricName}" for ${report.packageName}.`,
        );
        continue;
      }

      const actualValue = metric.getValue(report);

      if (actualValue === null || actualValue === undefined) {
        failures.push(
          `${report.packageName} is missing "${metric.label}" data, so the budget cannot be checked.`,
        );
        continue;
      }

      packageSummary.push({
        metricName,
        label: metric.label,
        actualValue,
        budgetValue,
        withinBudget: actualValue <= budgetValue,
      });

      if (actualValue > budgetValue) {
        failures.push(
          `${report.packageName} exceeds ${metric.label}: actual ${formatBytes(actualValue)} > budget ${formatBytes(budgetValue)}.`,
        );
      }
    }

    summary.push({
      packageName: report.packageName,
      metrics: packageSummary,
    });
  }

  return {
    failures,
    summary,
  };
}

function printCompressionStats(label, stats) {
  if (!stats) {
    console.log(`  ${label}: n/a`);
    return;
  }

  console.log(
    `  ${label}: raw ${formatBytes(stats.raw)} | gzip ${formatBytes(stats.gzip)} | brotli ${formatBytes(stats.brotli)}`,
  );
}

function printPublishedGroup(label, group) {
  if (!group) {
    console.log(`  ${label}: n/a`);
    return;
  }

  console.log(
    `  ${label}: total ${formatBytes(group.totalPublishedSize)} | runtime ${formatBytes(group.runtimeSize)} | map ${formatBytes(group.mapSize)} | types ${formatBytes(group.typesSize)}`,
  );
}

function printReport(report) {
  console.log(`\n${report.packageName}`);
  console.log(`path: ${toRelativeRepoPath(report.packageDir)}`);

  if (!report.hasDist) {
    console.log(
      "warning: dist/ is missing, run the package build before trusting local entry sizes.",
    );
  }

  console.log(`published package (${modeLabel(report.mode.stripPublishedSourcemaps)}):`);
  console.log(
    `  tarball: ${formatBytes(report.published.tarballSize)} | unpacked: ${formatBytes(report.published.unpackedSize)} | files: ${report.published.entryCount}`,
  );
  console.log(
    `  published dist total: ${formatBytes(report.published.distTotalSize)} | docs/meta: ${formatBytes(report.published.nonDistSize)} | shared dist: ${formatBytes(report.published.sharedDistSize)}`,
  );
  printPublishedGroup("web", report.published.web);
  printPublishedGroup("react-native", report.published.native);

  console.log("local dist:");
  console.log(
    `  total dist size: ${formatBytes(report.local.distTotalSize)} across ${report.distFiles.length} files`,
  );
  printCompressionStats("web runtime", report.local.webRuntimeStats);
  printCompressionStats("react-native runtime", report.local.nativeRuntimeStats);
}

function printJson(reports) {
  console.log(JSON.stringify(reports, null, 2));
}

function buildMarkdown(reports, options) {
  const lines = [
    "# Package Size Report",
    "",
    `Generated with \`yarn size:markdown\`.`,
    "",
    `Mode: ${modeLabel(options.stripPublishedSourcemaps)}.`,
    "",
    "| Package | Tarball | Unpacked | Web Published | React Native Published | Web Gzip | Native Gzip | Shared Dist | Docs/Meta |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];

  for (const report of reports) {
    lines.push(
      `| ${report.packageName} | ${formatBytes(report.published.tarballSize)} | ${formatBytes(report.published.unpackedSize)} | ${formatBytes(report.published.web?.totalPublishedSize ?? null)} | ${formatBytes(report.published.native?.totalPublishedSize ?? null)} | ${formatBytes(report.local.webRuntimeStats?.gzip ?? null)} | ${formatBytes(report.local.nativeRuntimeStats?.gzip ?? null)} | ${formatBytes(report.published.sharedDistSize)} | ${formatBytes(report.published.nonDistSize)} |`,
    );
  }

  lines.push(
    "",
    "Notes:",
    "- `Web Published` and `React Native Published` include runtime, type declarations, and any published sourcemaps for that entry.",
    "- `Web Gzip` and `Native Gzip` are measured from the local runtime entry files in `dist/`.",
    "- This file is meant to be tracked in Git so size evolution stays visible in diffs and history.",
  );

  return `${lines.join("\n")}\n`;
}

function printHelp() {
  console.log(`Usage:
  yarn size
  yarn size @runilib/react-walkit
  yarn size --without-published-sourcemaps
  yarn size --check-budget --without-published-sourcemaps
  yarn size --markdown
  yarn size --write-markdown
  yarn size --write-markdown SIZE_REPORT.md
  yarn size --json @runilib/react-walkit

Options:
  --without-published-sourcemaps  Simulate npm pack/publish with sourcemaps removed.
  --check-budget                  Compare current sizes against size-budgets.json.
  --budget-file <path>            Use a custom budget file.
  --markdown                      Print a Markdown table to stdout.
  --write-markdown [path]         Write the Markdown report to SIZE_REPORT.md or a custom path.
  --json                          Print structured JSON.
`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.showHelp) {
    printHelp();
    return;
  }

  const packageDirs = await resolveTargets(options.targets);
  const reports = [];

  for (const packageDir of packageDirs) {
    reports.push(await analyzePackage(packageDir, options));
  }

  const budgetConfig =
    options.checkBudget || options.outputMarkdown || options.writeMarkdownPath
      ? await loadBudgetConfig(options.budgetFilePath)
      : null;
  const budgetResult =
    options.checkBudget || budgetConfig
      ? evaluateBudgets(reports, budgetConfig, options)
      : { failures: [], summary: [] };

  if (options.outputJson) {
    printJson(reports);
  } else if (options.outputMarkdown || options.writeMarkdownPath) {
    const markdown = buildMarkdown(reports, options);

    if (options.outputMarkdown) {
      process.stdout.write(markdown);
    }

    if (options.writeMarkdownPath) {
      await fs.writeFile(options.writeMarkdownPath, markdown, "utf8");
      console.log(
        `Wrote Markdown size report to ${toRelativeRepoPath(options.writeMarkdownPath)}.`,
      );
    }
  } else {
    for (const report of reports) {
      printReport(report);
    }
  }

  if (options.checkBudget) {
    if (budgetResult.failures.length === 0) {
      console.log(
        `\nAll package budgets passed for ${modeLabel(options.stripPublishedSourcemaps)}.`,
      );
    } else {
      console.error("\nSize budget check failed:");
      for (const failure of budgetResult.failures) {
        console.error(`- ${failure}`);
      }
      process.exitCode = 1;
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

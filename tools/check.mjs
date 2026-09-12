import { readFile, readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const manifest = JSON.parse(await readFile(path.join(root, "module.json"), "utf8"));
const packageData = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));

if (manifest.id !== "no-chat-pan") fail("Unexpected module id");
if (manifest.version !== packageData.version) fail("Manifest and package versions differ");
if (manifest.compatibility.minimum !== "13") fail("Foundry v13 minimum is required");
if (manifest.compatibility.verified !== "14.367") fail("Foundry v14.367 verification is required");
if (manifest.compatibility.maximum !== "14") fail("Foundry v14 maximum is required");
if (manifest.relationships?.requires?.length) fail("The module must have no dependencies");
if (manifest.protected !== false) fail("The public module must not be protected");
if (!manifest.manifest?.includes("/main/module.json")) fail("Public manifest URL is missing");
if (!manifest.download?.includes(`/v${manifest.version}/${manifest.id}-${manifest.version}.zip`)) {
  fail("Release download URL does not match the package version");
}

for (const relative of manifest.esmodules ?? []) {
  await readFile(path.join(root, relative));
}

const files = await collectFiles(root, ["scripts", "tests", "tools"]);
for (const file of files.filter((entry) => /\.(?:js|mjs)$/.test(entry))) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) fail(result.stderr || result.stdout);
}

process.stdout.write("Manifest, compatibility, imports, and JavaScript are valid.\n");

async function collectFiles(base, directories) {
  const result = [];
  for (const directory of directories) await visit(path.join(base, directory), result);
  return result;
}

async function visit(directory, result) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await visit(target, result);
    else result.push(target);
  }
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

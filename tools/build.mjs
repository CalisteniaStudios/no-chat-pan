import { cp, mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const manifest = JSON.parse(await readFile(path.join(root, "module.json"), "utf8"));
const outputDirectory = path.join(root, "outputs");
const output = path.join(outputDirectory, `${manifest.id}-${manifest.version}.zip`);
const staging = await mkdtemp(path.join(os.tmpdir(), "no-chat-pan-"));

try {
  for (const relative of [
    "module.json",
    "LICENSE",
    "README.md",
    "INSTALL.md",
    "CHANGELOG.md",
    "scripts"
  ]) {
    await cp(path.join(root, relative), path.join(staging, relative), { recursive: true });
  }
  await mkdir(outputDirectory, { recursive: true });
  await rm(output, { force: true });
  const zip = spawnSync("zip", ["-q", "-r", output, "."], {
    cwd: staging,
    encoding: "utf8"
  });
  if (zip.status !== 0) throw new Error(zip.stderr || zip.stdout || "ZIP creation failed");
  process.stdout.write(`${output}\n`);
} finally {
  await rm(staging, { recursive: true, force: true });
}

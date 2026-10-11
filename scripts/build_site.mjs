import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const researchPath = path.join(projectRoot, "docs", "seo");
let backupRoot;
let preservedPath;

try {
  if (fs.existsSync(researchPath)) {
    const preservationRoot = path.join(projectRoot, ".runtime");
    fs.mkdirSync(preservationRoot, { recursive: true });
    backupRoot = fs.mkdtempSync(path.join(preservationRoot, "docs-seo-"));
    preservedPath = path.join(backupRoot, "seo");
    fs.renameSync(researchPath, preservedPath);
  }
  const astro = path.join(projectRoot, "node_modules", ".bin", "astro");
  const result = spawnSync(astro, ["build"], { cwd: projectRoot, stdio: "inherit" });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  if (preservedPath) {
    fs.mkdirSync(path.dirname(researchPath), { recursive: true });
    if (fs.existsSync(researchPath)) {
      throw new Error(`Build created ${researchPath}; preserved research remains at ${preservedPath}`);
    }
    fs.renameSync(preservedPath, researchPath);
    fs.rmdirSync(backupRoot);
  }
}

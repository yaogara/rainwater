import fs from "node:fs";
import path from "node:path";

function option(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

async function readSource(source) {
  if (/^https?:\/\//.test(source)) {
    const response = await fetch(source, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Download failed: HTTP ${response.status}`);
    return response.text();
  }
  return fs.readFileSync(source, "utf8");
}

export function validateRainfall(data) {
  if (!data || !data.metadata || !Array.isArray(data.states)) throw new Error("Expected metadata and states array");
  for (const key of ["source", "source_url", "period", "unit", "verified_at"]) {
    if (!data.metadata[key]) throw new Error(`Missing rainfall metadata.${key}`);
  }
  if (data.metadata.unit !== "inches") throw new Error("Rainfall unit must be inches");
  if (data.states.length < 50) throw new Error(`Expected at least 50 jurisdictions; received ${data.states.length}`);
  const names = new Set();
  for (const row of data.states) {
    if (!row.name || names.has(row.name)) throw new Error(`Missing or duplicate state: ${row.name || "unknown"}`);
    if (!Number.isFinite(row.inches) || row.inches <= 0 || row.inches > 250) throw new Error(`Invalid rainfall for ${row.name}`);
    names.add(row.name);
  }
  return data;
}

async function main() {
  const output = option("--output", "src/data/rainfall.json");
  const source = option("--source", process.env.RAINFALL_SOURCE_URL || output);
  const parsed = validateRainfall(JSON.parse(await readSource(source)));
  const outputDir = path.dirname(output);
  fs.mkdirSync(outputDir, { recursive: true });
  const temporary = `${output}.tmp-${process.pid}`;
  try {
    fs.writeFileSync(temporary, `${JSON.stringify(parsed, null, 2)}\n`);
    fs.renameSync(temporary, output);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
  console.log(`Validated and saved ${parsed.states.length} rainfall records from ${source}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  main().catch((error) => {
    console.error(`Rainfall update aborted; existing output preserved: ${error.message}`);
    process.exit(1);
  });
}

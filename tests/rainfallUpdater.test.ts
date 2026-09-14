import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

describe("rainfall updater", () => {
  it("preserves the last valid output when source validation fails", () => {
    const directory = mkdtempSync(join(tmpdir(), "rainwater-rainfall-"));
    const source = join(directory, "bad.json");
    const output = join(directory, "rainfall.json");
    writeFileSync(source, JSON.stringify({ states: [] }));
    writeFileSync(output, "last-valid\n");
    const result = spawnSync(process.execPath, ["scripts/updateRainfall.js", "--source", source, "--output", output], { encoding: "utf8" });
    assert.notEqual(result.status, 0);
    assert.equal(readFileSync(output, "utf8"), "last-valid\n");
  });
});

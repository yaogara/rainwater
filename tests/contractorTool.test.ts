import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

test("contractor upserts preserve fields, evidence, and one record", () => {
  const script = String.raw`
import json
from scripts.contractor_tool import merge_installer
existing = {"name":"Acme","phone":"123","services":["Design"],"evidence":{"reviews":{"status":"verified"}}}
incoming = {"name":"Acme","website":"https://example.org","evidence":{"entity":{"status":"verified"}}}
first = merge_installer(existing, incoming)
second = merge_installer(first, incoming)
print(json.dumps(second))
`;
  const result = JSON.parse(execFileSync("python3", ["-c", script], { encoding: "utf8" }));
  assert.equal(result.phone, "123");
  assert.equal(result.website, "https://example.org");
  assert.deepEqual(Object.keys(result.evidence).sort(), ["entity", "reviews"]);
});

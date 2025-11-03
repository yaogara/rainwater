import fs from "fs";
import fetch from "node-fetch";

const NOAA_URL = "https://www.ncei.noaa.gov/pub/data/normals/1981-2010/products/state/ann-prcp.txt";

async function main() {
  console.log("🌧️  Fetching NOAA annual state precipitation normals...");
  const res = await fetch(NOAA_URL);

  if (!res.ok) {
    console.error(`❌ Failed to fetch NOAA dataset: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const text = await res.text();
  const results = {};

  for (const line of text.split("\n")) {
    if (!line.includes(":")) continue;
    const [state, val] = line.split(":").map((s) => s.trim());
    const num = parseFloat(val);
    if (state && !isNaN(num)) results[state] = num;
  }

  fs.writeFileSync("src/data/rainfall.json", JSON.stringify(results, null, 2));
  console.log(`✅ Updated src/data/rainfall.json with ${Object.keys(results).length} states`);
}

main().catch((err) => {
  console.error("❌ Error updating rainfall:", err);
  process.exit(1);
});
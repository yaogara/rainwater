import fs from "fs";
import fetch from "node-fetch";

const NOAA_ENDPOINT = "https://www.ncei.noaa.gov/access/services/data/v1";

const STATE_CODE_TO_NAME = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas",
  KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts",
  MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana",
  NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico",
  NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

const STATES = Object.keys(STATE_CODE_TO_NAME);

async function getRainfallForState(stateCode) {
  const year = new Date().getFullYear() - 1; // last calendar year
  const params = new URLSearchParams({
    dataset: "daily-summaries",
    dataTypes: "PRCP",
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
    state: stateCode,
    units: "standard",
    format: "json",
    limit: "10000",
  });

  const res = await fetch(`${NOAA_ENDPOINT}?${params}`, {
    headers: { token: process.env.NOAA_TOKEN },
  });

  if (!res.ok) {
    console.error(`❌ Failed for ${stateCode}: ${res.status} ${res.statusText}`);
    return null;
  }

  const data = await res.json();
  const values = data
    .map((d) => parseFloat(d.PRCP || 0))
    .filter((v) => Number.isFinite(v) && v > 0);
  if (!values.length) return null;

  const avgDaily = values.reduce((a, b) => a + b, 0) / values.length;
  const annual = avgDaily * 365;
  return +annual.toFixed(1);
}

async function main() {
  if (!process.env.NOAA_TOKEN) {
    console.error("NOAA_TOKEN is not set. Set it in the environment or GitHub Actions secret.");
    process.exit(1);
  }
  const out = {};
  for (const code of STATES) {
    const name = STATE_CODE_TO_NAME[code];
    console.log(`Fetching rainfall for ${name} (${code})...`);
    const val = await getRainfallForState(code);
    if (val != null) out[name] = val;
  }
  fs.writeFileSync("src/data/rainfall.json", JSON.stringify(out, null, 2));
  console.log("✅ Updated src/data/rainfall.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

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
  // Map state abbreviations to FIPS codes
const FIPS = {
  AL:"01", AK:"02", AZ:"04", AR:"05", CA:"06", CO:"08", CT:"09", DE:"10", FL:"12", GA:"13",
  HI:"15", ID:"16", IL:"17", IN:"18", IA:"19", KS:"20", KY:"21", LA:"22", ME:"23", MD:"24",
  MA:"25", MI:"26", MN:"27", MS:"28", MO:"29", MT:"30", NE:"31", NV:"32", NH:"33", NJ:"34",
  NM:"35", NY:"36", NC:"37", ND:"38", OH:"39", OK:"40", OR:"41", PA:"42", RI:"44", SC:"45",
  SD:"46", TN:"47", TX:"48", UT:"49", VT:"50", VA:"51", WA:"53", WV:"54", WI:"55", WY:"56"
};

const params = new URLSearchParams({
  dataset: "NORMAL_DLY",
  dataTypes: "PRCP",
  startDate: `${new Date().getFullYear() - 1}-01-01`,
  endDate: `${new Date().getFullYear() - 1}-12-31`,
  locationid: `FIPS:${FIPS[state]}`,
  units: "standard",
  format: "json",
  limit: "10000"
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

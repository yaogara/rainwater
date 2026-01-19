import fs from "fs";
import path from "path";
import csv from "csvtojson";

// Source and destination
const sourcePath = path.resolve("data/installers_mvp_ready.csv");
const outputPath = path.resolve("data/installers_mvp_ready.cleaned.csv");

const stateSet = new Set([
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming",
  // Territories we’ll allow
  "Puerto Rico", "Guam", "U.S. Virgin Islands", "American Samoa", "Northern Mariana Islands"
]);

const parseNumber = (value) => {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isNaN(n) ? null : n;
};

// Extract first numeric float from a string, return null if none.
const firstFloat = (value) => {
  if (value === undefined || value === null) return null;
  const s = String(value);
  const m = s.match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isNaN(n) ? null : n;
};

const normalizeWebsite = (url) => {
  if (!url) return undefined;
  const u = String(url).trim();
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
};

const parseList = (value) => {
  if (value === undefined || value === null) return [];
  const trimmed = String(value).trim();
  if (!trimmed || trimmed === "[]") return [];
  // Try python-style single-quoted list first
  const matches = [...trimmed.matchAll(/'([^']+)'/g)].map((m) => m[1].trim());
  if (matches.length > 0) return matches.filter(Boolean);
  // Fallback to comma separated
  return trimmed
    .replace(/^\[+|\]+$/g, "")
    .split(",")
    .map((e) => e.trim().replace(/^"|"$/g, ""))
    .filter(Boolean);
};

const listToPythonLike = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return "[]";
  // Deduplicate while preserving order
  const seen = new Set();
  const deduped = [];
  for (const item of arr) {
    if (!seen.has(item)) { seen.add(item); deduped.push(item); }
  }
  return `[${deduped.map((v) => `'${String(v).replace(/'/g, "\\'")}'`).join(", ")}]`;
};

const csvEscape = (value) => {
  if (value === undefined || value === null) return "";
  const s = String(value);
  const needsQuotes = /[",\n\r]/.test(s);
  if (!needsQuotes) return s;
  return '"' + s.replace(/"/g, '""') + '"';
};

const run = async () => {
  if (!fs.existsSync(sourcePath)) {
    console.error(`CSV not found at ${sourcePath}`);
    process.exit(1);
  }

  const rows = await csv().fromFile(sourcePath);

  const cleaned = [];
  const issues = [];
  let dropped = 0;

  for (let i = 0; i < rows.length; i++) {
    const line = i + 2; // header is line 1
    const r = rows[i];

    const state = (r.state || "").trim();
    const city = (r.city || "").trim();
    const name = (r.name || "").trim() || "Unknown Installer";

    if (!state || !city) {
      issues.push({ line, msg: "Missing state or city", state, city, name });
      dropped += 1;
      continue;
    }

    // Coordinates: extract first float and attempt fix/swap
    let lat = firstFloat(r.lat);
    let lng = firstFloat(r.lng);
    // If looks swapped (lat out of range, lng in range), swap
    if (lat !== null && Math.abs(lat) > 90 && lng !== null && Math.abs(lng) <= 90) {
      const tmp = lat; lat = lng; lng = tmp;
      issues.push({ line, msg: "Swapped lat/lng", state, city, name, lat, lng });
    }
    // If only one is present and >90, treat as lng and leave lat null
    if (lat !== null && Math.abs(lat) > 90 && (lng === null || Math.abs(lng) > 180)) {
      issues.push({ line, msg: "Invalid lat; clearing", state, city, name, lat });
      lat = null;
    }
    if (lng !== null && Math.abs(lng) > 180) {
      issues.push({ line, msg: "Invalid lng; clearing", state, city, name, lng });
      lng = null;
    }

    const rating = parseNumber(r.rating);
    const reviews_count = parseNumber(r.reviews_count);

    const services = parseList(r.services);
    const service_area = parseList(r.service_area);

    const website = normalizeWebsite(r.website);

    const record = {
      state,
      city,
      name,
      phone: (r.phone || "").trim() || "",
      email: (r.email || "").trim() || "",
      website: website || "",
      address: (r.address || "").trim() || "",
      rating: rating ?? "",
      reviews_count: reviews_count ?? "",
      services: listToPythonLike(services),
      certifications: (r.certifications || "").trim() || "",
      audiences: (r.audiences || "").trim() || "",
      service_area: listToPythonLike(service_area),
      lat: lat ?? "",
      lng: lng ?? "",
    };

    // Optionally warn about city equal to state name (suspicious, but keep it)
    if (stateSet.has(city)) {
      issues.push({ line, msg: "City equals a state name (check)", state, city, name });
    }
    if (!stateSet.has(state)) {
      issues.push({ line, msg: "Non-standard state (allowed)", state, city, name });
    }

    cleaned.push(record);
  }

  // Write cleaned CSV with the same column order
  const headers = [
    "state","city","name","phone","email","website","address","rating","reviews_count","services","certifications","audiences","service_area","lat","lng"
  ];

  const lines = [headers.join(",")];
  for (const r of cleaned) {
    lines.push([
      csvEscape(r.state),
      csvEscape(r.city),
      csvEscape(r.name),
      csvEscape(r.phone),
      csvEscape(r.email),
      csvEscape(r.website),
      csvEscape(r.address),
      r.rating === "" ? "" : String(r.rating),
      r.reviews_count === "" ? "" : String(r.reviews_count),
      csvEscape(r.services),
      csvEscape(r.certifications),
      csvEscape(r.audiences),
      csvEscape(r.service_area),
      r.lat === "" ? "" : String(r.lat),
      r.lng === "" ? "" : String(r.lng)
    ].join(","));
  }

  fs.writeFileSync(outputPath, lines.join("\n"), "utf8");

  console.log(`✅ Wrote cleaned CSV: ${outputPath}`);
  console.log(`Rows in: ${rows.length}, rows out: ${cleaned.length}, dropped: ${dropped}`);
  if (issues.length) {
    console.log(`Notes (${issues.length}):`);
    for (const it of issues.slice(0, 50)) {
      console.log(`- line ${it.line}: ${it.msg} [${it.state}/${it.city}] ${it.name}`);
    }
    if (issues.length > 50) console.log(`...and ${issues.length - 50} more`);
  }
};

run().catch((err) => {
  console.error("Failed to validate/fix CSV:", err);
  process.exit(1);
});


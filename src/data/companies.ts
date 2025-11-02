import fs from "fs";
import Papa from "papaparse";

type Company = {
  company: string;
  state: string;
  city: string;
  trend?: string;
  rainfall?: string;
  link?: string;
};

function parseCsvIfExists(path: string): any[] {
  if (!fs.existsSync(path)) return [];
  const file = fs.readFileSync(path, "utf8");
  const { data } = Papa.parse(file, { header: true });
  return Array.isArray(data) ? data : [];
}

function normalizeRow(r: any): Company | null {
  if (!r) return null;
  const company = r.company || r.Company || r.name || r.Name || "";
  const state = r.state || r.State || "";
  const city = r.city || r.City || "";
  if (!company || !state || !city) return null;
  return {
    company,
    state,
    city,
    trend: r.Trend || r.trend || r.interest_index || "",
    rainfall: r.Rainfall || r.rainfall || "",
    link: r.Website || r.website || r.link || "",
  };
}

// Try sources in order. First present source wins.
const sources = [
  "./data/google trends rainwater harvesting metros .csv",
  "./data/google trends rainwater harvesting states .csv.csv",
  "./data/installers_mvp_ready.csv",
  "./data/installers.csv",
];

let parsed: any[] = [];
for (const src of sources) {
  const rows = parseCsvIfExists(src);
  if (rows.length) {
    parsed = rows;
    break;
  }
}

export const companies: Company[] = parsed
  .map(normalizeRow)
  .filter((r): r is Company => !!r);


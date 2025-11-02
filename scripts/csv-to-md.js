import fs from "fs";
import path from "path";
import csv from "csvtojson";

const sourcePath = path.resolve("data/installers_mvp_ready.csv");
const outputDir = path.resolve("src/content/installers");

const ensureDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const parseList = (value) => {
  if (value === undefined || value === null) {
    return [];
  }

  const trimmed = String(value).trim();

  if (!trimmed || trimmed === "[]") {
    return [];
  }

  const matches = [...trimmed.matchAll(/'([^']+)'/g)].map((match) => match[1].trim());
  if (matches.length > 0) {
    return matches.filter(Boolean);
  }

  return trimmed
    .replace(/^[\[\]]+/g, "")
    .replace(/[\[\]]+$/g, "")
    .split(",")
    .map((entry) => entry.trim().replace(/^"|"$/g, ""))
    .filter(Boolean);
};

const parseNumber = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = String(value).trim();
  if (!trimmed) {
    return null;
  }

  const numberValue = Number(trimmed);
  if (Number.isNaN(numberValue)) {
    return null;
  }

  return numberValue;
};

const escapeString = (value) => String(value).replace(/"/g, '\\"');

const slugify = (state, city) => {
  const base = `${state}-${city}`.toLowerCase();
  return base
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
};

const formatInstaller = (installer) => {
  const lines = [`  - name: "${escapeString(installer.name)}"`];

  const addLine = (key, value) => {
    if (value === undefined || value === null) {
      return;
    }
    const stringValue = String(value);
    if (!stringValue.trim()) {
      return;
    }
    lines.push(`    ${key}: "${escapeString(stringValue)}"`);
  };

  const addNumberLine = (key, value) => {
    if (value === undefined || value === null) {
      return;
    }
    lines.push(`    ${key}: ${value}`);
  };

  const addArray = (key, values) => {
    if (!Array.isArray(values) || values.length === 0) {
      return;
    }
    lines.push(`    ${key}:`);
    values.forEach((entry) => {
      lines.push(`      - "${escapeString(entry)}"`);
    });
  };

  addLine("phone", installer.phone);
  addLine("email", installer.email);
  addLine("website", installer.website);
  addLine("address", installer.address);
  addNumberLine("rating", installer.rating);
  addNumberLine("reviews_count", installer.reviews_count);
  addArray("services", installer.services);
  addLine("certifications", installer.certifications);
  addLine("audiences", installer.audiences);
  addArray("service_area", installer.service_area);
  addNumberLine("lat", installer.lat);
  addNumberLine("lng", installer.lng);

  return lines.join("\n");
};

const run = async () => {
  if (!fs.existsSync(sourcePath)) {
    console.error(`CSV file not found at ${sourcePath}`);
    process.exit(1);
  }

  ensureDirectory(outputDir);

  const rows = await csv().fromFile(sourcePath);

  const groups = new Map();
  let installerCount = 0;

  rows.forEach((row) => {
    const state = row.state ? row.state.trim() : "";
    const city = row.city ? row.city.trim() : "";

    if (!state || !city) {
      return;
    }

    const key = `${state}|||${city}`;
    if (!groups.has(key)) {
      groups.set(key, {
        state,
        city,
        installers: [],
      });
    }

    const installersList = groups.get(key).installers;

    const installer = {
      name: row.name ? row.name.trim() : "",
      phone: row.phone ? row.phone.trim() : undefined,
      email: row.email ? row.email.trim() : undefined,
      website: row.website ? row.website.trim() : undefined,
      address: row.address ? row.address.trim() : undefined,
      rating: parseNumber(row.rating),
      reviews_count: parseNumber(row.reviews_count),
      services: parseList(row.services),
      certifications: row.certifications ? row.certifications.trim() : undefined,
      audiences: row.audiences ? row.audiences.trim() : undefined,
      service_area: parseList(row.service_area),
      lat: parseNumber(row.lat),
      lng: parseNumber(row.lng),
    };

    installer.name = installer.name || "Unknown Installer";

    installersList.push(installer);
    installerCount += 1;
  });

  groups.forEach(({ state, city, installers }) => {
    const slug = slugify(state, city);
    const filePath = path.join(outputDir, `${slug}.md`);

    const frontmatterLines = [
      "---",
      `state: "${escapeString(state)}"`,
      `city: "${escapeString(city)}"`,
      `summary: "Leading rainwater harvesting installers in ${escapeString(city)}, ${escapeString(state)}."`,
      "installers:",
    ];

    installers.forEach((installer) => {
      frontmatterLines.push(formatInstaller(installer));
    });

    frontmatterLines.push("---", "");

    fs.writeFileSync(filePath, frontmatterLines.join("\n"), "utf8");
  });

  const cityCount = new Set([...groups.keys()].map((key) => key.split("|||")[1])).size;
  const stateCount = new Set([...groups.keys()].map((key) => key.split("|||")[0])).size;

  console.log(
    `✅ Imported ${installerCount} installers across ${cityCount} cities and ${stateCount} states from installers_mvp_ready.csv`
  );
};

run().catch((error) => {
  console.error("Failed to convert CSV:", error);
  process.exit(1);
});

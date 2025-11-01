import fs from "fs";
import csv from "csvtojson";

const sourcePath = "data/installers.csv";
const outputDir = "src/content/installers";

if (!fs.existsSync("data")) {
  console.error("data directory not found");
  process.exit(1);
}

csv()
  .fromFile(sourcePath)
  .then((rows) => {
    rows.forEach((row) => {
      const slug = `${row.state}-${row.city}`
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/&/g, "and");
      const services = row.services
        ? row.services
            .split(",")
            .map((service) => `"${service.trim()}"`)
            .join(", ")
        : "";
      const content = `---\ntitle: "Rainwater Harvesting Installers in ${row.city}, ${row.state}"\nstate: "${row.state}"\ncity: "${row.city}"\nsummary: "Top rainwater installers serving ${row.city}, ${row.state}."\ninstallers:\n  - name: "${row.name}"\n    phone: "${row.phone ?? ""}"\n    website: "${row.website ?? ""}"\n    rating: ${row.rating ?? 0}\n    services: [${services}]\n---\n`;
      fs.writeFileSync(`${outputDir}/${slug}.md`, content);
    });
    console.log(`Created ${rows.length} installer pages.`);
  })
  .catch((error) => {
    console.error("Failed to convert CSV:", error);
    process.exit(1);
  });

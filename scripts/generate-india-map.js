/**
 * Generate real India state SVG paths from GeoJSON using d3-geo.
 * Usage: node scripts/generate-india-map.js
 */
const fs = require("fs");
const path = require("path");
const { geoMercator, geoPath } = require("d3-geo");

const root = path.join(__dirname, "..");
const geoPathFile = path.join(root, "data", "india-states.geojson");
const outFile = path.join(root, "lib", "india-map-data.ts");

const geo = JSON.parse(fs.readFileSync(geoPathFile, "utf8"));

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const SLUG_MAP = {
  "jammu & kashmir": "jammu-and-kashmir",
  "jammu and kashmir": "jammu-and-kashmir",
  "andaman & nicobar": "andaman-and-nicobar",
  "andaman and nicobar": "andaman-and-nicobar",
  "andaman and nicobar islands": "andaman-and-nicobar",
  "dadra and nagar haveli and daman and diu": "dadra-nagar-haveli-daman-diu",
  "dadra & nagar haveli and daman & diu": "dadra-nagar-haveli-daman-diu",
  "dadra and nagar haveli": "dadra-nagar-haveli-daman-diu",
  "daman and diu": "dadra-nagar-haveli-daman-diu",
  "nct of delhi": "delhi",
  delhi: "delhi",
  odisha: "odisha",
  orissa: "odisha",
  pondicherry: "puducherry",
  puducherry: "puducherry",
  telangana: "telangana",
  "andhra pradesh": "andhra-pradesh",
};

const width = 800;
const height = 920;
const projection = geoMercator().fitExtent(
  [
    [12, 12],
    [width - 12, height - 12],
  ],
  geo
);
const pathGen = geoPath(projection);

const states = geo.features
  .map((f) => {
    const name =
      f.properties.ST_NM ||
      f.properties.st_nm ||
      f.properties.NAME_1 ||
      f.properties.name ||
      "Unknown";
    const key = String(name).toLowerCase().trim();
    const slug = SLUG_MAP[key] || slugify(name);
    const d = pathGen(f);
    if (!d) return null;
    const c = pathGen.centroid(f);
    return {
      name: String(name),
      slug,
      d,
      cx: Math.round(c[0] * 10) / 10,
      cy: Math.round(c[1] * 10) / 10,
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name));

const header = `/**
 * Auto-generated real India state boundaries projected to SVG.
 * Source: open India states GeoJSON, projected with d3-geo Mercator.
 * Regenerate: node scripts/generate-india-map.js
 */

export type IndiaStatePath = {
  name: string;
  slug: string;
  d: string;
  cx: number;
  cy: number;
};

export const INDIA_MAP_VIEWBOX = "0 0 ${width} ${height}";
export const INDIA_MAP_WIDTH = ${width};
export const INDIA_MAP_HEIGHT = ${height};

export const INDIA_STATES: IndiaStatePath[] = `;

const footer = `;

export function getStateBySlug(slug: string) {
  return INDIA_STATES.find((s) => s.slug === slug);
}
`;

fs.writeFileSync(
  outFile,
  header + JSON.stringify(states, null, 2) + footer,
  "utf8"
);

console.log(`Wrote ${states.length} states → ${outFile}`);
console.log(states.map((s) => `${s.name} → ${s.slug}`).join("\n"));
console.log("Size KB:", Math.round(fs.statSync(outFile).size / 1024));

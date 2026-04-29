// Regenerate the default OG image PNG from the source SVG.
// Run with: node scripts/og.mjs
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const sources = [
  { in: "public/og/default.svg", out: "public/og/default.png" },
];

for (const { in: inPath, out } of sources) {
  const svg = readFileSync(join(root, inPath));
  await sharp(svg, { density: 144 }).resize(1200, 630).png().toFile(join(root, out));
  console.log(`✓ ${out}`);
}

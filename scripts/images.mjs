// Turn source masters in /art into site outputs in /assets, at the widths in
// ASSETS.md:
//   wide (landscape source)     1600 and 2560 WebP, plus a 1920 JPG fallback
//   portrait (upright source)    900 and 1440 WebP, plus a 1000 JPG fallback
// SVGs are copied as-is (layered SVG keeps its layer ids).
//
// Usage:
//   npm run images                    process every file in /art
//   npm run images -- hero-wide       only sources whose name contains "hero-wide"
//   npm run images -- --force         overwrite outputs that already exist
//   npm run images -- --out=/tmp/x    write somewhere else (for comparing settings)
//
// Existing outputs are skipped unless --force, so approved assets are never
// re-encoded by accident. Sources are never upscaled.

import { readdir, mkdir, copyFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ART = path.join(ROOT, "art");

const args = process.argv.slice(2);
const force = args.includes("--force");
const outArg = args.find((a) => a.startsWith("--out="));
const OUT = outArg ? path.resolve(outArg.slice(6)) : path.join(ROOT, "assets");
const filters = args.filter((a) => !a.startsWith("--"));

const SHAPES = {
  wide: { webp: [1600, 2560], jpg: 1920 },
  portrait: { webp: [900, 1440], jpg: 1000 },
};
const WEBP = { quality: 78, effort: 6 };
const JPG = { quality: 80, mozjpeg: true };
// One hero image is about 40-100KB. Warn well before a single file threatens
// the 1.5MB page budget.
const WARN_BYTES = 250 * 1024;

const kb = (n) => `${Math.round(n / 1024)}KB`;

async function processRaster(file) {
  const src = path.join(ART, file);
  const name = path.parse(file).name;
  const meta = await sharp(src).metadata();
  const shape = meta.width >= meta.height ? "wide" : "portrait";
  const spec = SHAPES[shape];
  console.log(`\n${file}  ${meta.width}x${meta.height}  -> ${shape}`);

  const jobs = [
    ...spec.webp.map((w) => ({ width: w, out: `${name}-${w}.webp`, fmt: "webp" })),
    { width: spec.jpg, out: `${name}.jpg`, fmt: "jpg" },
  ];

  for (const job of jobs) {
    const dest = path.join(OUT, job.out);
    if (existsSync(dest) && !force) {
      console.log(`  skip   ${job.out} (exists; --force to overwrite)`);
      continue;
    }
    if (meta.width < job.width) {
      console.log(`  WARN   ${job.out}: source is only ${meta.width}px wide, not upscaling; supply a larger master`);
    }
    let img = sharp(src).resize({ width: job.width, withoutEnlargement: true });
    img = job.fmt === "webp" ? img.webp(WEBP) : img.flatten({ background: { r: 255, g: 255, b: 255 } }).jpeg(JPG);
    const info = await img.toFile(dest);
    const flag = info.size > WARN_BYTES ? "  WARN over 250KB, check the budget" : "";
    console.log(`  write  ${job.out}  ${info.width}x${info.height}  ${kb(info.size)}${flag}`);
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const files = (await readdir(ART)).filter(
    (f) => !f.startsWith(".") && (filters.length === 0 || filters.some((q) => f.includes(q)))
  );
  if (files.length === 0) {
    console.log("No matching files in /art.");
    return;
  }
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if ([".png", ".jpg", ".jpeg", ".tif", ".tiff", ".webp"].includes(ext)) {
      await processRaster(file);
    } else if (ext === ".svg") {
      const dest = path.join(OUT, file);
      if (existsSync(dest) && !force) { console.log(`\n${file}\n  skip   (exists)`); continue; }
      await copyFile(path.join(ART, file), dest);
      console.log(`\n${file}\n  copy   ${file}  ${kb((await stat(dest)).size)}`);
    } else {
      console.log(`\n${file}\n  skip   unsupported type`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

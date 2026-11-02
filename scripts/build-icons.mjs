// Genera src/components/icons/ph-data.ts con SOLO los iconos Phosphor (duotono, MIT) que usa la app.
// Uso: node scripts/build-icons.mjs <carpeta con los SVG de phosphor-icons/core/assets/duotone>
import fs from "node:fs";
import path from "node:path";

const svgDir = process.argv[2];
const src = path.resolve("src");
const available = new Set(fs.readdirSync(svgDir).filter((f) => f.endsWith("-duotone.svg")).map((f) => f.replace("-duotone.svg", "")));
const used = new Set(["package"]);
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(f) && !f.startsWith("ph-data")) {
      for (const m of fs.readFileSync(p, "utf8").matchAll(/"([a-z0-9-]+)"/g)) if (available.has(m[1])) used.add(m[1]);
    }
  }
})(src);
const entries = [...used].sort().map((n) => {
  const svg = fs.readFileSync(path.join(svgDir, `${n}-duotone.svg`), "utf8");
  const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  return `  "${n}": ${JSON.stringify(inner)},`;
});
fs.writeFileSync(
  path.join(src, "components/icons/ph-data.ts"),
  `// GENERADO por scripts/build-icons.mjs — no editar a mano.\n// Iconos: Phosphor Icons (https://phosphoricons.com), licencia MIT © 2023 Phosphor Icons.\nexport const PH: Record<string, string> = {\n${entries.join("\n")}\n};\n`,
);
console.log(`${used.size} iconos`);

import { build } from "esbuild";
import { execSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
rmSync("dist-cjs", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });

const common = {
  entryPoints: ["src/index.ts"],
  bundle: false,
  platform: "neutral",
  target: "es2020",
  sourcemap: true,
};

await build({ ...common, format: "esm", outfile: "dist/index.mjs" });
await build({ ...common, format: "cjs", outfile: "dist/index.cjs" });

execSync("npx tsc -p tsconfig.types.json", { stdio: "inherit" });
console.log("[inopay-web] build OK");

import * as esbuild from "esbuild";
import watchModePlugin from "./plugins/watch-mode-plugin.mjs";

const context = await esbuild.context({
  entryPoints: ["src/js/index.js"],
  bundle: true,
  sourcemap: "inline",
  outdir: "dist",
  plugins: [watchModePlugin]
});

await context.watch();

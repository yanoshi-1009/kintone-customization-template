import * as esbuild from "esbuild";
import { parseArgs } from "node:util";
import serveModePlugin from "./plugins/serve-mode-plugin.ts";

const {
  values: { mode = "development" }
} = parseArgs({
  options: {
    mode: {
      type: "string",
      default: "development"
    }
  },
  allowPositionals: false
});

if (!["production", "development"].includes(mode)) {
  console.error(
    "\x1b[31mError: Please specify the mode as 'production' or 'development'.\x1b[0m"
  );
  throw new Error("Invalid mode specified. Use 'production' or 'development'.");
}

const context = await esbuild.context({
  entryPoints: ["src/index.ts", "src/styles/style.css"],
  bundle: true,
  plugins: [serveModePlugin],
  minify: mode === "production",
  sourcemap: mode === "production" ? false : "inline",
  legalComments: mode === "production" ? "eof" : "none",
  outdir: "dist"
});

const runServeMode = async () => {
  try {
    await context.rebuild();
    const serveResult = await context.serve({
      host: "localhost",
      port: 9000,
      servedir: "dist",
      keyfile: ".cert/private.key",
      certfile: ".cert/private.cert"
    });

    console.log("\x1b[36m========================================\x1b[0m");
    console.log(
      `\x1b[32m🚀 Server is running at: \x1b[1m\x1b[4mhttps://localhost:${serveResult.port}\x1b[0m`
    );
    console.log("\x1b[36m========================================\x1b[0m");
  } catch (error) {
    console.error("\x1b[31mError during watch mode:\x1b[0m", error);
    throw error;
  }
};

const runProductionBuild = async () => {
  try {
    await context.rebuild();
    console.log("\x1b[32mProduction build completed successfully.\x1b[0m");
  } catch (error) {
    console.error("\x1b[31mError during production build:\x1b[0m", error);
    throw error;
  }
};

switch (mode) {
  case "development":
    await runServeMode();
    break;
  case "production":
    await runProductionBuild();
    throw new Error("Production build completed. Exiting.");
}

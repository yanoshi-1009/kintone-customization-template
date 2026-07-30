import * as esbuild from "esbuild";
import { parseArgs } from "node:util";
import buildLogPlugin from "./plugins/build-log-plugin.ts";

type Mode = "development" | "production";

const MODE_LABEL: Record<Mode, string> = {
  development: "development server",
  production: "production build"
};

const isMode = (value: string): value is Mode =>
  value === "development" || value === "production";

const createBuildOptions = (mode: Mode): esbuild.BuildOptions => ({
  entryPoints: [
    "src/index.ts",
    "src/mobile.ts",
    "src/styles/style.css",
    "src/styles/mobile.css"
  ],
  bundle: true,
  target: "es2025",
  plugins: [buildLogPlugin],
  minify: mode === "production",
  sourcemap: mode === "production" ? false : "inline",
  legalComments: mode === "production" ? "eof" : "none",
  outdir: "dist"
});

// One-shot API: the esbuild service is released automatically, so the process exits.
const runProductionBuild = async () => {
  await esbuild.build(createBuildOptions("production"));
  console.log("\x1b[32mProduction build completed successfully.\x1b[0m");
};

// Long-running API: the context keeps the process alive on purpose,
// so it must be disposed when startup fails.
const runDevServer = async () => {
  const context = await esbuild.context(createBuildOptions("development"));

  try {
    await context.watch();
    const { port } = await context.serve({
      host: "localhost",
      port: 9000,
      servedir: "dist",
      keyfile: ".cert/private.key",
      certfile: ".cert/private.cert"
    });

    console.log("\x1b[36m========================================\x1b[0m");
    console.log(
      `\x1b[32m🚀 Server is running at: \x1b[1m\x1b[4mhttps://localhost:${port}\x1b[0m`
    );
    console.log("\x1b[36m========================================\x1b[0m");
  } catch (error: unknown) {
    await context.dispose();
    throw error;
  }
};

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

const main = async () => {
  if (!isMode(mode)) {
    console.error(
      "\x1b[31mError: Please specify the mode as 'production' or 'development'.\x1b[0m"
    );
    process.exitCode = 1;
    return;
  }

  try {
    if (mode === "production") {
      await runProductionBuild();
      return;
    }
    await runDevServer();
  } catch (error: unknown) {
    console.error(`\x1b[31mError during ${MODE_LABEL[mode]}:\x1b[0m`, error);
    process.exitCode = 1;
  }
};

await main();

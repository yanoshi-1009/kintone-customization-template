import { execSync } from "node:child_process";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  mkdirSync(".cert", { recursive: true });
  execSync(
    "mkcert -key-file .cert/private.key -cert-file .cert/private.cert localhost 127.0.0.1",
    { stdio: "inherit" }
  );
  execSync("pnpm install", { stdio: "inherit" });
} catch (error: unknown) {
  const status =
    typeof error === "object" && error !== null && "status" in error
      ? Number(error.status)
      : 1;
  process.exit(status || 1);
}

const targets = [
  join(__dirname, "../renovate.json"),
  join(__dirname, "../.gitkeep")
];

for (const file of targets) {
  if (existsSync(file)) {
    unlinkSync(file);
    console.log(`Deleted: ${file}`);
  } else {
    console.log(`Not found: ${file}`);
  }
}

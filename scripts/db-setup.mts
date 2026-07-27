/**
 * scripts/db-setup.mts
 *
 * src/lib/db/schema.sql を Vercel Postgres / Neon に適用する。
 *
 * 使い方:
 *   POSTGRES_URL=postgres://... pnpm db:setup
 *   # または .env.local に POSTGRES_URL を入れて
 *   pnpm db:setup
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { neon } from "@neondatabase/serverless";

async function loadDotenvLocal(): Promise<void> {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  try {
    const raw = await readFile(resolve(repoRoot, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!m) continue;
      const [, key, valRaw] = m;
      if (process.env[key]) continue;
      const val = valRaw.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
      process.env[key] = val;
    }
  } catch {
    // .env.local が無くても OK
  }
}

async function main() {
  await loadDotenvLocal();
  const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!url) {
    console.error(
      "[db-setup] POSTGRES_URL is not set. Run `vercel env pull` or set it in .env.local",
    );
    process.exit(1);
  }

  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const ddl = await readFile(resolve(repoRoot, "src/lib/db/schema.sql"), "utf8");

  const sql = neon(url);
  // schema.sql は ; で複数文に分かれているが、Neon HTTP は複数文をひとつの
  // クエリで実行できる。`sql.unsafe` で文字列をそのまま渡す。
  console.log("[db-setup] Applying schema.sql ...");
  await sql.query(ddl);
  console.log("[db-setup] Done.");
}

main().catch((err) => {
  console.error("[db-setup] Failed:", err);
  process.exit(1);
});

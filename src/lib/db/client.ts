import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

import { postgresUrl } from "@/lib/env";

let cached: NeonQueryFunction<false, false> | null = null;

/**
 * Neon HTTP クライアント。@neondatabase/serverless は Edge と Node.js の
 * 両ランタイムで動作する。タグ付きテンプレートでクエリを発行する：
 *
 *   const sql = getSql();
 *   const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
 *
 * POSTGRES_URL が未設定だとここで例外を投げる。呼び出し元はクエリ時に
 * 例外が出ることを前提に握りつぶしてもよい（例：開発時の OAuth 未設定）。
 */
export function getSql(): NeonQueryFunction<false, false> {
  if (cached) return cached;
  const url = postgresUrl();
  if (!url) {
    throw new Error("POSTGRES_URL is not set. Run `vercel env pull` or configure your .env.local");
  }
  cached = neon(url);
  return cached;
}

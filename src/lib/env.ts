/**
 * 環境変数アクセスの一元化。
 *
 * Auth.js v5 は AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET / AUTH_SECRET を自動で
 * 読み込むため、ここでは Mirror 固有のサーバ変数のみ取り扱う。
 *
 * 値が無い場合の挙動:
 *  - 必須の DB 接続文字列は "" を返す。実際にクエリを発行する箇所で
 *    投げる（ビルドや module load 時には落とさない）。
 *  - これにより `pnpm build` や OAuth 未設定での dev 起動が可能になる。
 */

export function postgresUrl(): string {
  return process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? "";
}

export function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

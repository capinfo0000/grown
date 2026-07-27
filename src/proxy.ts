/**
 * Next.js 16 では従来の `middleware.ts` が `proxy.ts` にリネームされました。
 * Auth.js v5 から提供される `auth` 関数をそのまま proxy として再エクスポート
 * することで、リクエストごとに JWT セッションが復元されます（保護そのものは
 * 各 Server Component / Server Action で `auth()` を呼んで判定します）。
 *
 * 参考: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 */
export { auth as proxy } from "@/auth";

export const config = {
  // Next.js が静的アセット等で proxy を実行しないように除外
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

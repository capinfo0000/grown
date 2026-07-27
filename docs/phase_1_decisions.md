# Phase 1 技術選択・実装メモ

確認日：2026-05-07
確定者：運営者（ユーザー）／確認方法：Claude Code 上の AskUserQuestion

## 確定した技術選択

| 項目 | 選択 |
| --- | --- |
| Auth.js v5 セッション戦略 | **JWT** ストラテジー（DB セッション保存なし） |
| Google OAuth スコープ | **Phase 1 で `drive.file` まで一括要求**（Phase 2 で再同意不要） |
| 新規サインインの初期 user_type | **`owner`**（招待コード経由で `member` になる Phase 7） |

## 重要な仕様変更（指示書からの差分）

### `@vercel/postgres` → `@neondatabase/serverless`

`@vercel/postgres` パッケージは **deprecated**。Vercel Postgres は現在
Neon との統合に変更されており、推奨 SDK は `@neondatabase/serverless`。
本プロジェクトでは HTTP ベースの Neon SDK を使用する：

- Edge ランタイム互換（proxy.ts や Server Component から呼び出せる）
- 接続文字列は同じ（`POSTGRES_URL` または `DATABASE_URL`）
- ローカル開発は `vercel env pull` で値を取得して `.env.local` に保存

### Next.js 16 の `middleware.ts` → `proxy.ts`

Next.js 16 では `middleware` ファイル規約が **`proxy`** にリネームされた。
本プロジェクトでも `src/proxy.ts` を採用し、`auth` を `proxy` として
re-export している。挙動は従来の middleware と同じ。

参考：`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`

## 認証フローの設計

```
[ ユーザー ]
   │ "Google でサインイン" を押下
   ▼
[ /api/auth/signin/google ] ── Auth.js v5 が処理
   │
   │ Google OAuth 同意（scope: openid email profile drive.file
   │                       prompt=consent, access_type=offline）
   ▼
[ /api/auth/callback/google ] ── Auth.js v5 が処理
   │
   │ signIn callback（Mirror）：
   │   - users へ upsert（id=UUID, user_type=owner で新規）
   │ jwt callback（Mirror）：
   │   - JWT に userId / userType / google access_token / refresh_token /
   │     expires_at を埋め込む
   │
   ▼
[ JWT cookie 発行（AUTH_SECRET で JWE 暗号化）]
   │
   │ proxy.ts で各リクエストに対して JWT 復号 → req.auth に注入
   ▼
[ /dashboard ] ── auth() で session 取得 → 表示
```

## サーバが持つもの・持たないもの（再確認）

| 持つ | 持たない |
| --- | --- |
| `users` テーブル（id / email / display_name / user_type / google_account_id） | プロファイル JSON |
| 課金状態（Phase 11） | 対話履歴 |
| 招待コードハッシュ（Phase 7） | API キー（暗号化済みでも） |
| クローン主・メンバーの紐付け（Phase 7） | 学習データ |

JWT cookie に Google access_token を入れている点について：これはユーザー
ごとの cookie であり、Mirror サーバ側 DB には保存しない。ユーザーの
ブラウザに JWE で暗号化されて保管され、リクエストごとに復号される。

## ファイル構成（Phase 1 で追加されたもの）

```
src/
├── auth.ts                              # Auth.js v5 設定（JWT, Google, signIn upsert）
├── proxy.ts                             # Next.js 16 middleware 互換
├── types/next-auth.d.ts                 # Session/JWT 型拡張
├── lib/
│   ├── env.ts                           # 環境変数アクセス
│   └── db/
│       ├── client.ts                    # Neon HTTP クライアント
│       ├── schema.sql                   # users / subscriptions / invite_codes / clone_member_links
│       └── users.ts                     # upsertUserByGoogleAccount
├── app/
│   ├── page.tsx                         # ランディング（Sign in with Google）
│   ├── dashboard/page.tsx               # 保護されたダッシュボード
│   └── api/auth/[...nextauth]/route.ts  # Auth.js のハンドラ再エクスポート
└── ...

scripts/
└── db-setup.mts                         # `pnpm db:setup` で schema.sql を適用
```

## 動作確認

| 確認 | 結果 |
| --- | --- |
| `pnpm lint` | ✅ |
| `pnpm format:check` | ✅ |
| `pnpm build` | ✅（5 ルート、proxy 認識） |
| `pnpm dev` → `GET /` | ✅ HTTP 200 ランディング表示 |
| `pnpm dev` → `GET /dashboard`（未ログイン） | ✅ HTTP 307 リダイレクト |
| `pnpm dev` → `GET /api/auth/providers` | ✅ Google provider JSON 返却 |
| 実際の Google OAuth フロー | ⏳ AUTH_GOOGLE_ID/SECRET 設定後に運営者側で確認 |

## 運営者の手動セットアップ作業（Phase 1 完了後にやること）

実装はリポジトリにコミットされたが、実際にサインインできるようにするには
以下の手作業が必要：

1. **Google Cloud Console**
   - OAuth クライアント ID を作成（Web application）
   - 承認済みリダイレクト URI に
     - `http://localhost:3000/api/auth/callback/google`
     - `https://<vercel-domain>/api/auth/callback/google`（後で）
   - Drive API を有効化（drive.file スコープを使うため）
   - 同意画面でスコープ追加：
     - `openid`, `email`, `profile`
     - `https://www.googleapis.com/auth/drive.file`

2. **Vercel**
   - プロジェクトを link（`pnpm dlx vercel link`）
   - Vercel Postgres（Neon 統合）を作成 → 自動で env 注入
   - 環境変数を Dashboard で設定：
     - `AUTH_SECRET`（`pnpm dlx auth secret` で生成）
     - `AUTH_GOOGLE_ID`
     - `AUTH_GOOGLE_SECRET`
   - ローカルで `vercel env pull .env.local` を実行

3. **DB スキーマ適用**
   - `.env.local` を取得後、`pnpm db:setup` を実行
   - `users` / `subscriptions` / `invite_codes` / `clone_member_links` が作成される

## Phase 2 への申し送り

- Drive スコープは Phase 1 で取得済み（再同意不要）
- access_token は JWT に格納済み（`session.accessToken` で参照可）
- **未実装**：access_token の自動 refresh ロジック
  → Phase 2 で `googleapis` 導入時に追加する。jwt callback で
    `googleAccessTokenExpiresAt` を見て期限切れなら refresh_token で
    再取得する処理を入れる。

# Mirror

> 「忙しい本人の壁打ち相手を、分身させる」

特定の人物（クローン主）の判断パターン・経験・知識を学習させた壁打ち用 AI クローンを作成し、それを許可した相手（メンバー）と共有することで、本人の時間を奪わずに思考整理・相談を行えるサービスです。

## ステータス

**Phase 0: プロジェクトセットアップ** — 進行中

実装計画は [`docs/claude_code_instructions.md`](docs/claude_code_instructions.md) を参照。

## 仕様書

| ドキュメント                                                                                 | 内容                                |
| -------------------------------------------------------------------------------------------- | ----------------------------------- |
| [`docs/claude_code_instructions.md`](docs/claude_code_instructions.md)                       | 実装指示書（Phase 0〜13）           |
| [`docs/要件定義書_v4_1.md`](docs/要件定義書_v4_1.md)                                         | 要件定義書（第4.1版）               |
| [`docs/data_schema_v1.md`](docs/data_schema_v1.md)                                           | JSON / DB スキーマ                  |
| [`docs/setup_questionnaire_v2_1_with_memo.md`](docs/setup_questionnaire_v2_1_with_memo.md)   | セットアップアンケート v2.1（30問） |
| [`docs/prompt_design_v1_clone_response.md`](docs/prompt_design_v1_clone_response.md)         | クローン応答プロンプト v1           |
| [`docs/prompt_design_v1_profile_extraction.md`](docs/prompt_design_v1_profile_extraction.md) | プロファイル抽出プロンプト v1       |
| [`docs/phase_0_decisions.md`](docs/phase_0_decisions.md)                                     | Phase 0 技術選択の記録              |

## 技術スタック

- **フロントエンド**：Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- **認証**：NextAuth.js (Auth.js v5)（Phase 1 で導入）
- **DB**：Vercel Postgres（認証情報のみ。Phase 1 で導入）
- **ストレージ**：Google Drive API（ユーザー所有のドライブ。Phase 2 で導入）
- **LLM**：Anthropic Claude API（Phase 5 で導入）
- **決済**：Stripe Subscriptions（Phase 11 で導入）
- **ホスティング**：Vercel
- **パッケージマネージャ**：pnpm

> ユーザーのプロファイル・対話履歴は Mirror サーバに **一切保存しない**。
> 全ユーザーデータはユーザー自身の Google Drive に保管される。

## 開発

### 必要環境

- Node.js 20 以上（推奨：22）
- pnpm 10 以上

### 起動

```bash
pnpm install
cp .env.example .env.local   # 後で本物の値を入れる（Phase 1 以降）
pnpm dev
```

`http://localhost:3000` にアクセス。

### スクリプト

| コマンド            | 内容                        |
| ------------------- | --------------------------- |
| `pnpm dev`          | 開発サーバ起動（Turbopack） |
| `pnpm build`        | プロダクションビルド        |
| `pnpm start`        | プロダクション起動          |
| `pnpm lint`         | ESLint 実行                 |
| `pnpm format`       | Prettier で整形             |
| `pnpm format:check` | Prettier の差分確認         |

## デプロイ

Vercel でのデプロイを想定。Phase 11（課金）まで本番デプロイは不要だが、早期に Preview 環境を立ち上げて動作確認することを推奨。

```bash
# 初回のみ
pnpm dlx vercel link

# Preview デプロイ
pnpm dlx vercel
```

環境変数は Vercel Dashboard で設定（`.env.example` を参照）。

## ライセンス

未定（MVP リリース前に決定）。

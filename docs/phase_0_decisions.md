# Phase 0 技術選択決定事項

確認日：2026-05-07
確定者：運営者（ユーザー）
確認方法：Claude Code 上での AskUserQuestion

## 確定した技術選択

| 項目 | 選択 | 備考 |
|---|---|---|
| 認証情報DB | **Vercel Postgres** | Phase 1 で実装。Phase 0 では `.env.example` に項目記載のみ |
| Google OAuth 実装方式 | **NextAuth.js (Auth.js v5)** | Phase 1 で実装。Drive API スコープも追加で対応 |
| パッケージマネージャ | **pnpm** | Phase 0 で `pnpm-lock.yaml` を生成 |

## 開始タイミング

**残り4仕様書の受領後に Phase 0 を開始する**：

- [ ] `data_schema_v1.md`
- [ ] `setup_questionnaire_v2_1_with_memo.md`
- [ ] `prompt_design_v1_clone_response.md`
- [ ] `prompt_design_v1_profile_extraction.md`

理由：指示書 §14「開始時の確認」で「関連ドキュメント（5つ）を確認した」をチェックする規定があり、これに準拠する。

## 受領済みドキュメント

- ✅ `docs/要件定義書_v4_1.md`（第4.1版・差分版）
- ✅ `docs/claude_code_instructions.md`（Phase 0 開始の主指示書）

## 未受領ドキュメント

- ⏳ 要件定義書（第4版）— 4.1版の前提となる本体
- ⏳ `data_schema_v1.md`
- ⏳ `setup_questionnaire_v2_1_with_memo.md`
- ⏳ `prompt_design_v1_clone_response.md`
- ⏳ `prompt_design_v1_profile_extraction.md`

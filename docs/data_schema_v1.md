# Mirror データ構造仕様書（JSONスキーマ）

## 概要

Mirrorで扱うすべてのJSONデータ構造を定義する。
これらのデータはユーザーのGoogleドライブ内に保管される。
Mirrorのサーバには認証情報のみ保管、本データは保管しない。

---

## 全体構造

```
[クローン主のGドライブ]
└── /Mirror/
    ├── profile.json              ← クローン主のプロファイル（中核）
    ├── api_key.encrypted         ← APIキー（暗号化保管、本人パスワード由来）
    ├── raw/                      ← 学習データの原本
    │   ├── resume.pdf
    │   ├── notes_001.txt
    │   └── ...
    ├── escalations/              ← エスカレ学習履歴
    │   ├── esc_001.json
    │   └── ...
    └── memos/                    ← メモ機能
        └── memos.json            ← メモのリスト

[メンバーのGドライブ]
└── /Mirror/
    └── conversations/            ← 自分とクローンの対話履歴
        ├── conv_001.json
        ├── conv_002.json
        └── ...

[Mirror本体（サーバ）]
└── ユーザー認証情報・課金状態・招待コードのみ
```

---

## 1. profile.json（クローン主の中核データ）

クローン主のプロファイル全体。クローンの応答時に使われる。

```json
{
  "version": "2.1",
  "schema_version": "mirror-profile-v1",
  "created_at": "2026-05-05T10:00:00Z",
  "updated_at": "2026-05-08T15:30:00Z",

  "identity": {
    "name": "山田太郎",
    "age_range": "30代",
    "occupation": "エンジニアリングマネージャー",
    "industry": "IT",
    "position": "マネージャー"
  },

  "values": {
    "core_values": [
      "誠実さ・正直さ",
      "成長・学び続ける",
      "人との繋がり・関係性"
    ],
    "non_negotiable": [
      "自分の信念",
      "他者への尊重",
      "約束・コミットメント"
    ],
    "avoid": [
      "嘘・ごまかし",
      "停滞・成長の停止"
    ],
    "decision_focus": [
      "人の感情・関係性",
      "長期的な意義",
      "顧客・相手の利益"
    ],
    "stress_triggers": [
      "不確実性が高いとき",
      "一人で抱え込むとき"
    ]
  },

  "principles": {
    "when_consulted": [
      "否定から入らない",
      "まず話を最後まで聞く",
      "質問の意図を確認する"
    ],
    "when_deciding": [
      "複数の視点で考える",
      "後戻りできるか確認する"
    ],
    "when_giving_feedback": [
      "良い点から伝える",
      "行動に対してのみコメント",
      "具体的に伝える"
    ],
    "when_failing": [
      "原因を冷静に分析する",
      "学びとして言語化する",
      "自分を責めすぎない"
    ],
    "first_meeting": [
      "相手の話を多く聞く",
      "相手のペースに合わせる"
    ],
    "with_juniors": [
      "結論を押し付けない",
      "考える機会を奪わない",
      "個性を尊重する"
    ],
    "when_down": [
      "一人で抱え込まない",
      "完璧を求めない"
    ],
    "avoid_when_answering": [
      "上から目線",
      "一方的な押し付け",
      "あいまいな表現"
    ],
    "under_pressure": [
      "落ち着くために深呼吸する",
      "タスクを細分化する"
    ],
    "in_conflict": [
      "相手の言い分を最後まで聞く",
      "「正しさ」より「建設的か」を優先"
    ],
    "when_delegating": [
      "結果より過程を信じる",
      "失敗の責任は自分が取る覚悟"
    ],
    "urgent_request": [
      "まず本当に急ぎか確認する",
      "断ることも選択肢として持つ"
    ],
    "when_praising": [
      "具体的に褒める",
      "結果よりプロセスを褒める"
    ],
    "when_angry": [
      "その場で反応しない",
      "感情を相手にぶつけない"
    ],
    "custom_principles": [
      "人を待たせるときは必ず一報を入れる"
    ]
  },

  "self_perception": {
    "perceived_strengths": [
      "論理的思考",
      "全体俯瞰",
      "巻き込む力"
    ],
    "perceived_weaknesses": [
      "細かい作業",
      "完璧主義になりがち"
    ],
    "common_impressions": [
      "落ち着いている",
      "頼りになる"
    ]
  },

  "boundaries": {
    "no_response_topics": [
      "家族・プライベートの話",
      "お金・収入の話",
      "政治・宗教の話"
    ],
    "clone_instructions": "結論から先に伝えてほしい。気を遣いすぎないで率直に。"
  },

  "extracted_from_data": {
    "speaking_style": {
      "first_person": "俺",
      "ending_pattern": "〜だね、〜と思う",
      "verbal_habits": ["なるほど", "そうだね"],
      "formality": "タメ口寄り",
      "emoji_usage": "控えめ",
      "writing_style": "短文派"
    },
    "decision_patterns": [
      {
        "situation": "クライアントから値下げ要求",
        "judgment_axis": "短期売上より長期信頼",
        "tendency": "値下げせず代替案を提案"
      }
    ],
    "extracted_strengths": [
      {
        "label": "巻き込み力",
        "description": "プロジェクトで人を動かすときに信頼される",
        "evidence_type": "mixed"
      }
    ],
    "interests": ["読書", "プログラミング", "ランニング"],
    "communication_preference": {
      "with_juniors": "考えさせる質問を返すスタイル",
      "feedback_style": "良い点から伝えてから改善点"
    }
  },

  "masking_keywords": [
    "佐藤",
    "鈴木",
    "TechCorp"
  ],

  "memos": [
    {
      "id": "memo_001",
      "content": "Aさんとは関係性が深いから、対応は柔らかく",
      "tags": ["対人配慮", "関係性"],
      "created_at": "2026-05-05T10:30:00Z",
      "updated_at": "2026-05-05T10:30:00Z"
    }
  ],

  "growth_settings": {
    "escalation_learning": "on",
    "auto_apply_to_profile": true
  }
}
```

---

## 2. api_key.encrypted（APIキー保管）

クローン主のClaude APIキーを暗号化保管。

```json
{
  "version": "1.0",
  "encryption_method": "AES-256-GCM",
  "key_derivation": "PBKDF2-SHA256-100k-iterations",
  "salt": "base64_encoded_salt",
  "iv": "base64_encoded_iv",
  "encrypted_data": "base64_encoded_encrypted_api_key",
  "created_at": "2026-05-05T10:00:00Z"
}
```

復号にはユーザーのMirrorパスワードが必要。サーバはパスワードを持たないため復号不可。

---

## 3. raw/ ディレクトリ（学習データ原本）

ユーザーがアップロードした原本ファイル。形式は問わない。

- 履歴書PDF
- テキストファイル
- ノート、判断ログなど

これらはMirrorが触らない。プロファイル抽出時のみブラウザに読み込まれる。

---

## 4. escalations/esc_xxx.json（エスカレ学習履歴）

メンバーが本人にエスカレして、本人が回答した記録。

```json
{
  "id": "esc_001",
  "schema_version": "mirror-escalation-v1",
  "created_at": "2026-05-08T14:00:00Z",
  "member_id_hash": "ハッシュ化されたメンバー識別子",

  "abstracted_question": "値下げ要求への対応方針について",
  "owner_response": "短期売上より長期信頼を優先する判断をした。具体的には...",
  "response_recorded_at": "2026-05-08T16:30:00Z",

  "applied_to_profile": true,
  "applied_at": "2026-05-08T16:35:00Z",

  "masking_applied": true,
  "original_member_question_redacted": true
}
```

このログは要約後にprofile.jsonに統合される。生のメンバー質問は記録しない（抽象化済みのみ）。

---

## 5. memos/memos.json（メモリスト）

クローン主が後から追加した「クローンへのメモ」リスト。

```json
{
  "version": "1.0",
  "schema_version": "mirror-memos-v1",
  "memos": [
    {
      "id": "memo_001",
      "content": "Aさんとは関係性が深いから、対応は柔らかく",
      "tags": ["対人配慮", "関係性"],
      "created_at": "2026-05-05T10:30:00Z",
      "updated_at": "2026-05-05T10:30:00Z",
      "active": true
    },
    {
      "id": "memo_002",
      "content": "最近、新しいプロジェクトを始めた",
      "tags": ["状況変化", "仕事"],
      "created_at": "2026-05-08T15:20:00Z",
      "updated_at": "2026-05-08T15:20:00Z",
      "active": true
    }
  ]
}
```

注：profile.jsonの`memos`フィールドはこのファイルからの抜粋。実態はmemos.jsonに保管。

---

## 6. conversations/conv_xxx.json（メンバー側の対話履歴）

メンバーのGドライブに保管される、対話履歴。

```json
{
  "id": "conv_001",
  "schema_version": "mirror-conversation-v1",
  "created_at": "2026-05-08T14:00:00Z",
  "updated_at": "2026-05-08T14:30:00Z",

  "clone_owner_name": "山田太郎",
  "clone_owner_id_hash": "ハッシュ化されたクローン主識別子",

  "title": "値下げ要求への対応",
  "messages": [
    {
      "id": "msg_001",
      "role": "member",
      "content": "クライアントから値下げ要求があって、どう対応すべきか迷っています",
      "timestamp": "2026-05-08T14:00:00Z"
    },
    {
      "id": "msg_002",
      "role": "clone",
      "content": "山田さんは、値下げ要求に対して「短期売上より長期信頼」を重視する傾向がある...最終的には本人（山田太郎さん）に確認してね。",
      "timestamp": "2026-05-08T14:00:30Z",
      "pattern_used": "A",
      "abstracted_references": ["過去の値下げ判断パターン"]
    }
  ],

  "escalations": [
    {
      "message_id": "msg_005",
      "escalated_at": "2026-05-08T14:20:00Z",
      "escalation_id": "esc_001"
    }
  ]
}
```

---

## 7. Mirror本体サーバの認証情報スキーマ

Mirrorのサーバが持つ唯一のユーザーデータ。

```sql
-- ユーザーテーブル
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  user_type ENUM('owner', 'member'),
  google_account_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 課金情報テーブル（クローン主のみ）
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  status ENUM('trial', 'active', 'past_due', 'canceled'),
  trial_ends_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 招待コードテーブル
CREATE TABLE invite_codes (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES users(id),
  code_hash VARCHAR(255) UNIQUE,
  display_name VARCHAR(100),
  expires_at TIMESTAMP,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP
);

-- メンバーとクローン主の紐付けテーブル
CREATE TABLE clone_member_links (
  id UUID PRIMARY KEY,
  member_id UUID REFERENCES users(id),
  owner_id UUID REFERENCES users(id),
  invite_code_id UUID REFERENCES invite_codes(id),
  joined_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);
```

ユーザーデータ（プロファイル・対話履歴等）はサーバに一切保管しない。

---

## データフロー

### クローン作成時

```
1. ユーザーがアンケート回答
2. 学習データをアップロード（Gドライブの/Mirror/raw/に保存）
3. ブラウザがraw/から読み込み、Claude APIで抽出処理
4. profile.jsonを生成して/Mirror/に保存
5. APIキーを暗号化して/Mirror/api_key.encryptedに保存
```

### メンバーが対話するとき

```
1. メンバーがログイン（招待コードで紐付き済み）
2. Mirrorがメンバーのアクセス権でクローン主のprofile.jsonを取得
3. Claude APIに「プロファイル＋メンバー質問」を送信
4. 応答を受信、マスキング処理
5. 対話履歴をメンバーのGドライブの/Mirror/conversations/に保存
```

### メンバーがエスカレするとき

```
1. メンバーがエスカレボタン押下
2. メンバー質問を抽象化（クローン主のGドライブに送信用）
3. クローン主のescalations/に新規エントリー作成（質問のみ）
4. クローン主に通知
5. クローン主がGドライブ上で回答記述
6. 同意ONなら、自動でprofile.jsonに統合
```

### メモ追加するとき

```
1. ユーザーがメモを入力
2. クローン（LLM）が内容分析、タグを自動付与
3. memos.jsonに追加
4. profile.jsonのmemosフィールドを更新（または参照）
```

---

## バリデーションルール

### profile.json

- 必須：identity.name, identity.age_range, identity.occupation
- 推奨：values.*, principles.* のうち最低3項目
- 任意：その他全部

### memos.json

- 1メモあたり最大500文字
- タグは最大10個（1タグ最大20文字）
- 1ユーザーあたり最大100メモ

### escalations

- 抽象化済みのメンバー質問のみ保存（生のメンバー質問は不可）
- 本人回答は最大2000文字

---

## バージョニング戦略

スキーマ変更時：

- `schema_version` を更新
- 古いバージョンのデータは自動マイグレーション
- 不可逆な変更は事前告知

---

## 次のステップ

1. このスキーマをClaude Code向け指示書に組み込む
2. プロンプト設計と整合性チェック
3. 実装時のサンプルデータを準備

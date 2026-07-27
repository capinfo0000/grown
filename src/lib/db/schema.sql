-- Mirror — server-side schema (auth & billing only)
--
-- このファイルは Mirror サーバ側 DB（Vercel Postgres / Neon）の DDL です。
-- ユーザーのプロファイル・対話履歴は一切保存しません（Google Drive 側）。
--
-- 適用方法:
--   POSTGRES_URL=... pnpm db:setup
--
-- 仕様: docs/data_schema_v1.md §7

-- ============================================================================
-- ENUM types
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE user_type AS ENUM ('owner', 'member');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'past_due', 'canceled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- users
-- ============================================================================
-- Mirror が持つ唯一の本人特定情報。
-- google_account_id は Google の "sub" クレーム（不変）を保管。

CREATE TABLE IF NOT EXISTS users (
  id                 UUID PRIMARY KEY,
  email              VARCHAR(255) UNIQUE NOT NULL,
  display_name       VARCHAR(100),
  user_type          user_type NOT NULL DEFAULT 'owner',
  google_account_id  VARCHAR(255) UNIQUE NOT NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);

-- ============================================================================
-- subscriptions  (Phase 11 で本格使用)
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id                       UUID PRIMARY KEY,
  user_id                  UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  stripe_customer_id       VARCHAR(255),
  stripe_subscription_id   VARCHAR(255),
  status                   subscription_status NOT NULL,
  trial_ends_at            TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions (user_id);

-- ============================================================================
-- invite_codes  (Phase 7 で本格使用)
-- ============================================================================

CREATE TABLE IF NOT EXISTS invite_codes (
  id             UUID PRIMARY KEY,
  owner_id       UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  code_hash      VARCHAR(255) UNIQUE NOT NULL,
  display_name   VARCHAR(100),
  expires_at     TIMESTAMPTZ,
  max_uses       INTEGER,
  current_uses   INTEGER NOT NULL DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS invite_codes_owner_id_idx ON invite_codes (owner_id);

-- ============================================================================
-- clone_member_links  (Phase 7 / Phase 8 で本格使用)
-- ============================================================================

CREATE TABLE IF NOT EXISTS clone_member_links (
  id              UUID PRIMARY KEY,
  member_id       UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  invite_code_id  UUID REFERENCES invite_codes (id) ON DELETE SET NULL,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (member_id, owner_id)
);

CREATE INDEX IF NOT EXISTS clone_member_links_member_id_idx ON clone_member_links (member_id);
CREATE INDEX IF NOT EXISTS clone_member_links_owner_id_idx ON clone_member_links (owner_id);

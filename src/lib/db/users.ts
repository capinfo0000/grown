import { getSql } from "@/lib/db/client";

export type UserType = "owner" | "member";

export interface UserRow {
  id: string;
  email: string;
  display_name: string | null;
  user_type: UserType;
  google_account_id: string;
  created_at: string;
  updated_at: string;
}

interface UpsertInput {
  email: string;
  displayName: string | null;
  googleAccountId: string;
  /** 新規ユーザーの場合に設定する user_type。既存ユーザーの場合は変更しない。 */
  defaultUserType?: UserType;
}

/**
 * Google OAuth でサインインしたユーザーを users テーブルに upsert する。
 *
 * - google_account_id をキーに突合（不変な Google "sub" クレーム）
 * - 既存ユーザーは display_name と updated_at のみ更新（user_type は不変）
 * - 新規ユーザーは渡された defaultUserType (デフォルト 'owner') で作成
 *
 * 戻り値は upsert 後の行。
 */
export async function upsertUserByGoogleAccount({
  email,
  displayName,
  googleAccountId,
  defaultUserType = "owner",
}: UpsertInput): Promise<UserRow> {
  const sql = getSql();
  const id = crypto.randomUUID();
  const rows = (await sql`
    INSERT INTO users (id, email, display_name, user_type, google_account_id)
    VALUES (${id}, ${email}, ${displayName}, ${defaultUserType}, ${googleAccountId})
    ON CONFLICT (google_account_id) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      email = EXCLUDED.email,
      updated_at = NOW()
    RETURNING id, email, display_name, user_type, google_account_id, created_at, updated_at
  `) as UserRow[];
  return rows[0]!;
}

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { upsertUserByGoogleAccount } from "@/lib/db/users";

/**
 * Mirror で使う OAuth スコープ。
 * - openid email profile：ユーザー識別とメール
 * - drive.file：Phase 2 以降で /Mirror/ フォルダ配下のファイルを読み書き
 *   （アプリが作成・開いたファイルのみ。ユーザー全体の Drive は触らない）
 */
const GOOGLE_SCOPES = ["openid", "email", "profile", "https://www.googleapis.com/auth/drive.file"];

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Google({
      authorization: {
        params: {
          scope: GOOGLE_SCOPES.join(" "),
          // refresh_token を確実に取得するため
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    /**
     * 初回サインイン時に Mirror サーバ側 users テーブルへ upsert。
     * Drive 上のデータには触らない（サーバには認証情報のみ）。
     */
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return false;
      const googleAccountId = (profile?.sub as string | undefined) ?? account.providerAccountId;
      const email = profile?.email ?? user.email;
      if (!googleAccountId || !email) return false;

      try {
        await upsertUserByGoogleAccount({
          email,
          displayName: (profile?.name as string | undefined) ?? user.name ?? null,
          googleAccountId,
          defaultUserType: "owner",
        });
      } catch (err) {
        // DB 未設定（dev で .env.local が無い場合など）では明示的にサインインを拒否。
        console.error("[auth] users upsert failed:", err);
        return false;
      }
      return true;
    },

    /**
     * JWT に Mirror 固有のクレームと Google トークンを埋め込む。
     * 初回（account が渡ってくる）だけ DB から user 情報を再取得して保存する。
     */
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const googleAccountId = (profile.sub as string | undefined) ?? account.providerAccountId;
        const email = profile.email;
        if (googleAccountId && email) {
          try {
            const row = await upsertUserByGoogleAccount({
              email,
              displayName: (profile.name as string | undefined) ?? null,
              googleAccountId,
              defaultUserType: "owner",
            });
            token.userId = row.id;
            token.userType = row.user_type;
          } catch (err) {
            console.error("[auth] jwt upsert lookup failed:", err);
          }
        }

        // Google トークン（Phase 2 以降の Drive 呼び出しで使用）
        if (account.access_token) {
          token.googleAccessToken = account.access_token;
        }
        if (account.refresh_token) {
          token.googleRefreshToken = account.refresh_token;
        }
        if (account.expires_at) {
          token.googleAccessTokenExpiresAt = account.expires_at * 1000;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.userId) session.userId = token.userId;
      if (token.userType) session.userType = token.userType;
      // accessToken は Phase 2 以降で Drive 呼び出しの Server Action / Route Handler から
      // 参照する。クライアントには露出しないよう注意（Server Component 内のみで使う）。
      if (token.googleAccessToken) session.accessToken = token.googleAccessToken;
      return session;
    },
  },
});

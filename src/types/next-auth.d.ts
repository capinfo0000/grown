import "next-auth";
import "next-auth/jwt";

import type { UserType } from "@/lib/db/users";

declare module "next-auth" {
  interface Session {
    userId?: string;
    userType?: UserType;
    /** Phase 2 以降で Google Drive 呼び出しに使う access_token。Server 側でのみ参照する。 */
    accessToken?: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    userType?: UserType;
    googleAccessToken?: string;
    googleRefreshToken?: string;
    /** UNIX time in milliseconds. */
    googleAccessTokenExpiresAt?: number;
    error?: string;
  }
}

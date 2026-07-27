import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.userId) {
    redirect("/");
  }

  const name = session.user?.name ?? "（名前なし）";
  const email = session.user?.email ?? "（メールなし）";
  const userType = session.userType ?? "owner";

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="pointer-events-none absolute -top-32 right-1/2 h-[28rem] w-[28rem] translate-x-1/2 rounded-full bg-purple-700/15 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col gap-10">
        <header className="flex flex-col gap-2">
          <p className="text-xs tracking-[0.4em] text-purple-300/80 uppercase">Mirror Dashboard</p>
          <h1 className="text-3xl font-semibold text-zinc-50">
            ようこそ、
            {name}
            さん。
          </h1>
        </header>

        <section className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 backdrop-blur">
          <h2 className="mb-4 text-sm font-semibold tracking-wider text-purple-300/80 uppercase">
            アカウント情報
          </h2>
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-[8rem_1fr]">
            <dt className="text-zinc-400">表示名</dt>
            <dd>{name}</dd>
            <dt className="text-zinc-400">メール</dt>
            <dd className="break-all">{email}</dd>
            <dt className="text-zinc-400">アカウント種別</dt>
            <dd>{userType === "owner" ? "クローン主（owner）" : "メンバー（member）"}</dd>
          </dl>
        </section>

        <section className="rounded-2xl border border-dashed border-zinc-800/60 bg-zinc-900/20 p-6 text-sm leading-6 text-zinc-400">
          <p className="mb-2 font-medium text-zinc-200">次の Phase の準備中</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Phase 2：Google Drive 連携（Mirror フォルダの自動作成）</li>
            <li>Phase 3：セットアップアンケート（30 問・5 セクション）</li>
            <li>Phase 4：API キー暗号化保管</li>
          </ul>
        </section>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="rounded-full border border-zinc-700/80 px-5 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
          >
            サインアウト
          </button>
        </form>
      </div>
    </main>
  );
}

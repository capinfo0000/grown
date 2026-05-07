import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";

export default async function Home() {
  const session = await auth();
  if (session?.userId) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-purple-700/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-15%] h-[28rem] w-[28rem] rounded-full bg-fuchsia-700/15 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-10 text-center">
        <header className="flex flex-col gap-3">
          <p className="text-xs tracking-[0.4em] text-purple-300/80 uppercase">Mirror</p>
          <h1 className="bg-gradient-to-br from-zinc-50 via-purple-200 to-fuchsia-300 bg-clip-text text-4xl leading-tight font-semibold text-transparent">
            忙しい本人の壁打ち相手を、
            <br />
            分身させる。
          </h1>
          <p className="text-sm leading-6 text-zinc-400">
            あなたの判断パターン・経験を学習した壁打ち用 AI クローンを、
            <br />
            信頼する相手と共有できるサービスです。
          </p>
        </header>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
          className="w-full"
        >
          <button
            type="submit"
            className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-purple-900/40 transition hover:from-purple-500 hover:to-fuchsia-500"
          >
            <GoogleIcon />
            Google でサインイン
          </button>
        </form>

        <p className="text-xs leading-5 text-zinc-500">
          サインインにより、Google Drive 上に Mirror 専用フォルダを作成する許可をお願いします。
          <br />
          Mirror サーバはあなたの認証情報のみを保持し、プロファイルや対話履歴は保存しません。
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="#FFFFFF"
        d="M21.35 11.1H12v2.92h5.35c-.23 1.4-1.62 4.11-5.35 4.11-3.21 0-5.83-2.66-5.83-5.94S8.79 6.25 12 6.25c1.83 0 3.05.77 3.75 1.43l2.55-2.45C16.78 3.81 14.6 2.92 12 2.92 6.94 2.92 2.85 7.01 2.85 12s4.09 9.08 9.15 9.08c5.28 0 8.78-3.71 8.78-8.94 0-.6-.07-1.06-.43-1.04Z"
      />
    </svg>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const AUTH_KEY = "hannune_demo_auth";
const DEMO_ID = "admin";
const DEMO_PASSWORD = "hannune";

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!userId.trim() || !password) {
      setError("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    if (userId !== DEMO_ID || password !== DEMO_PASSWORD) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    setIsSubmitting(true);
    window.localStorage.setItem(AUTH_KEY, "true");
    window.localStorage.setItem("hannune_demo_user", userId);
    router.replace("/");
  };

  return (
    <main className="relative h-screen w-full overflow-y-auto bg-slate-950 text-slate-100 selection:bg-blue-500/30">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1600px] lg:grid-cols-[1.15fr_0.85fr]">
        <section className="hidden min-h-screen flex-col justify-between border-r border-slate-800/70 px-12 py-12 lg:flex xl:px-20 xl:py-16">
          <div>
            <div className="mb-16 inline-flex items-center gap-3 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-[11px] font-bold tracking-[0.22em] text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.9)]" />
              SNOW REMOVAL CONTROL SYSTEM
            </div>

            <div className="max-w-3xl">
              <div className="mb-7 flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10 shadow-[0_0_40px_rgba(37,99,235,0.16)]">
                  <svg viewBox="0 0 64 64" className="h-9 w-9 text-blue-300" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M32 8v48M11 20l42 24M53 20 11 44" />
                    <path d="m32 8-5 6m5-6 5 6M11 20l8 1m-8-1 3 7M53 20l-8 1m8-1-3 7M11 44l8-1m-8 1 3-7M53 44l-8-1m8 1-3-7M32 56l-5-6m5 6 5-6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold tracking-[0.24em] text-slate-500">INTEGRATED CONTROL PLATFORM</p>
                  <h1 className="mt-1 text-5xl font-black tracking-[-0.05em] text-white xl:text-6xl">Hannune</h1>
                </div>
              </div>

              <p className="max-w-2xl text-2xl font-bold leading-relaxed text-slate-200 xl:text-3xl">
                제설 현장을 한 화면에서 빠르게 판단하고,
                <span className="block text-blue-400">즉시 대응할 수 있는 통합 관제 플랫폼</span>
              </p>

              <p className="mt-7 max-w-xl text-sm leading-7 text-slate-500">
                제설 차량 위치, 작업 상태, 현장 영상, 기상 정보와 자재 현황을 실시간으로 통합 관리합니다.
              </p>
            </div>
          </div>

          <div className="grid max-w-2xl grid-cols-3 gap-3">
            {[
              ["REAL-TIME", "Vehicle Tracking"],
              ["LIVE", "Field Monitoring"],
              ["SMART", "Operation Support"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-sm">
                <p className="text-[10px] font-black tracking-[0.18em] text-blue-400">{title}</p>
                <p className="mt-2 text-xs font-bold text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-12 xl:px-20">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10">
                <svg viewBox="0 0 64 64" className="h-7 w-7 text-blue-300" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M32 8v48M11 20l42 24M53 20 11 44" />
                </svg>
              </div>
              <h1 className="text-4xl font-black tracking-[-0.04em] text-white">Hannune</h1>
              <p className="mt-2 text-xs font-bold tracking-[0.18em] text-slate-500">SNOW REMOVAL CONTROL SYSTEM</p>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-xs font-black tracking-[0.18em] text-blue-400">SECURE ACCESS</p>
              <h2 className="text-3xl font-black tracking-tight text-white">시스템 로그인</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">관제 시스템에 접속하려면 관리자 계정으로 로그인해 주세요.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="userId" className="mb-2 block text-xs font-bold text-slate-400">아이디</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    id="userId"
                    name="userId"
                    type="text"
                    autoComplete="username"
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                    placeholder="아이디를 입력하세요"
                    className="h-13 w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3.5 pl-12 pr-4 text-sm font-medium text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-bold text-slate-400">비밀번호</label>
                  <span className="text-[10px] font-bold tracking-wide text-slate-600">ADMIN ONLY</span>
                </div>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    className="h-13 w-full rounded-xl border border-slate-800 bg-slate-900/80 py-3.5 pl-12 pr-16 text-sm font-medium text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 px-4 text-[11px] font-bold text-slate-500 transition hover:text-slate-300"
                  >
                    {showPassword ? "숨김" : "보기"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-black text-white shadow-[0_12px_40px_rgba(37,99,235,0.25)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "접속 중..." : "로그인"}
                {!isSubmitting && (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                )}
              </button>
            </form>

            <div className="mt-7 rounded-xl border border-blue-500/15 bg-blue-500/[0.06] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black tracking-[0.16em] text-blue-400">PROTOTYPE ACCOUNT</p>
                  <p className="mt-1 text-xs text-slate-400">현재 UI 확인을 위한 임시 로그인 계정입니다.</p>
                </div>
                <div className="shrink-0 text-right font-mono text-xs font-bold text-slate-300">
                  <p>admin</p>
                  <p className="mt-1 text-slate-500">hannune</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-800/80 pt-5 text-[10px] font-medium text-slate-600">
              <span>Hannune Control Platform</span>
              <span>Prototype v0.1</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

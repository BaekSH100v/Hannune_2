"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const AUTH_KEY = "hannune_demo_auth";
const DEMO_ID = "admin";
const DEMO_PASSWORD = "hannune";

const snowflakes = [
  { left: "5%", size: 3, duration: 16, delay: 0 },
  { left: "12%", size: 5, duration: 18, delay: 5 },
  { left: "21%", size: 4, duration: 14, delay: 2 },
  { left: "30%", size: 3, duration: 17, delay: 7 },
  { left: "41%", size: 5, duration: 20, delay: 4 },
  { left: "53%", size: 3, duration: 15, delay: 1 },
  { left: "65%", size: 4, duration: 19, delay: 8 },
  { left: "75%", size: 3, duration: 16, delay: 3 },
  { left: "86%", size: 5, duration: 21, delay: 6 },
  { left: "94%", size: 4, duration: 15, delay: 2 },
];

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
    <>
      <main className="relative h-screen w-full overflow-y-auto bg-slate-950 text-slate-100 selection:bg-blue-500/30">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/login-background.png')" }}
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.10)_0%,rgba(2,6,23,0.16)_37%,rgba(2,6,23,0.62)_61%,rgba(2,6,23,0.94)_79%,rgba(2,6,23,0.98)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.06)_0%,rgba(2,6,23,0.12)_58%,rgba(2,6,23,0.48)_100%)]" />
          <div className="absolute inset-y-0 right-0 w-[46%] bg-[radial-gradient(circle_at_60%_48%,rgba(37,99,235,0.10),transparent_62%)]" />

          {snowflakes.map((flake, index) => (
            <span
              key={`snow-${index}`}
              className="snowflake"
              style={{
                left: flake.left,
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                animationDuration: `${flake.duration}s`,
                animationDelay: `${flake.delay}s`,
              }}
            />
          ))}

          <div className="road-light absolute bottom-[21%] left-[19%] h-[2px] w-[35%] origin-left -rotate-[10deg] bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent blur-[1px]" />
          <div className="absolute bottom-[30%] left-[15%] h-20 w-20 rounded-full bg-blue-200/10 blur-2xl animate-pulse" />
          <div className="absolute bottom-[30%] left-[21%] h-20 w-20 rounded-full bg-blue-100/10 blur-2xl animate-pulse [animation-delay:400ms]" />
        </div>

        <div className="relative mx-auto flex min-h-screen w-full max-w-[1720px] items-center justify-end px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
          <div className="absolute left-8 top-8 hidden items-center gap-3 rounded-full border border-cyan-300/20 bg-slate-950/25 px-4 py-2 text-[10px] font-black tracking-[0.22em] text-cyan-200 backdrop-blur-md lg:flex xl:left-14 xl:top-12">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
            SNOW REMOVAL CONTROL SYSTEM
          </div>

          <section className="relative z-10 w-full max-w-[450px]">
            <div className="rounded-[28px] border border-slate-600/50 bg-slate-950/64 p-7 shadow-[0_30px_100px_rgba(2,6,23,0.58)] backdrop-blur-2xl sm:p-8 lg:p-9">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10 shadow-[0_0_32px_rgba(37,99,235,0.18)]">
                  <svg viewBox="0 0 64 64" className="h-8 w-8 text-blue-300" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M32 8v48M11 20l42 24M53 20 11 44" />
                    <path d="m32 8-5 6m5-6 5 6M11 20l8 1m-8-1 3 7M53 20l-8 1m8-1-3 7M11 44l8-1m-8 1 3-7M53 44l-8-1m8 1-3-7M32 56l-5-6m5 6 5-6" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] text-blue-300">INTEGRATED CONTROL PLATFORM</p>
                  <h1 className="mt-1 text-4xl font-black tracking-[-0.05em] text-white">Hannune</h1>
                </div>
              </div>

              <div className="mb-8">
                <p className="mb-2 text-xs font-black tracking-[0.18em] text-blue-300">SECURE ACCESS</p>
                <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">시스템 로그인</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">제설관제시스템에 접속하려면 관리자 계정으로 로그인해 주세요.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="userId" className="mb-2 block text-xs font-bold text-slate-300">아이디</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
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
                      className="h-13 w-full rounded-xl border border-slate-700/80 bg-slate-900/75 py-3.5 pl-12 pr-4 text-sm font-medium text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-bold text-slate-300">비밀번호</label>
                    <span className="text-[10px] font-bold tracking-wide text-slate-600">ADMIN ONLY</span>
                  </div>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
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
                      className="h-13 w-full rounded-xl border border-slate-700/80 bg-slate-900/75 py-3.5 pl-12 pr-16 text-sm font-medium text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10"
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
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-black text-white shadow-[0_12px_40px_rgba(37,99,235,0.28)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "접속 중..." : "로그인"}
                  {!isSubmitting && (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  )}
                </button>
              </form>

              <div className="mt-7 rounded-xl border border-blue-500/15 bg-blue-500/[0.07] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.16em] text-blue-300">PROTOTYPE ACCOUNT</p>
                    <p className="mt-1 text-xs text-slate-400">현재 UI 확인을 위한 임시 계정입니다.</p>
                  </div>
                  <div className="shrink-0 text-right font-mono text-xs font-bold text-slate-300">
                    <p>admin</p>
                    <p className="mt-1 text-slate-500">hannune</p>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-slate-700/70 pt-5 text-[10px] font-medium text-slate-500">
                <span>Hannune Control Platform</span>
                <span>Prototype v0.2</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .snowflake {
          position: absolute;
          top: -5%;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 8px rgba(191, 219, 254, 0.5);
          opacity: 0;
          animation-name: snowfall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .road-light {
          animation: roadPulse 4.5s ease-in-out infinite;
        }

        @keyframes snowfall {
          0% {
            transform: translate3d(0, -8vh, 0);
            opacity: 0;
          }
          12% {
            opacity: 0.75;
          }
          100% {
            transform: translate3d(26px, 112vh, 0);
            opacity: 0;
          }
        }

        @keyframes roadPulse {
          0%, 100% {
            opacity: 0.12;
            transform: rotate(-10deg) scaleX(0.9);
          }
          50% {
            opacity: 0.72;
            transform: rotate(-10deg) scaleX(1.08);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .snowflake,
          .road-light {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}

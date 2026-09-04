"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const AUTH_KEY = "hannune_demo_auth";
const USER_KEY = "hannune_demo_user";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isLoginPage = pathname === "/login";
    const isAuthenticated = window.localStorage.getItem(AUTH_KEY) === "true";

    if (isLoginPage && isAuthenticated) {
      router.replace("/");
      return;
    }

    if (!isLoginPage && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    setReady(true);
  }, [pathname, router]);

  useEffect(() => {
    const handleLogoutClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest("button");
      if (!button) return;

      const normalizedText = button.textContent?.replace(/\s/g, "").toUpperCase() ?? "";
      if (!normalizedText.includes("LOGOUT")) return;

      // 기존 프로토타입 버튼의 alert 핸들러보다 먼저 처리합니다.
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const shouldLogout = window.confirm("로그아웃 하시겠습니까?");
      if (!shouldLogout) return;

      window.localStorage.removeItem(AUTH_KEY);
      window.localStorage.removeItem(USER_KEY);
      setReady(false);
      router.replace("/login");
    };

    document.addEventListener("click", handleLogoutClick, true);
    return () => document.removeEventListener("click", handleLogoutClick, true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-300">
        <div className="flex flex-col items-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-200">Hannune</p>
            <p className="mt-1 text-[10px] font-bold tracking-[0.18em] text-slate-600">CHECKING ACCESS</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

import type { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/hannune-login-background-hd.webp?v=20260904-hd')",
          backgroundPosition: "center center",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.06)_0%,rgba(2,6,23,0.10)_42%,rgba(2,6,23,0.40)_66%,rgba(2,6,23,0.78)_100%)]"
      />
      <div className="relative z-10 [&>main]:!bg-transparent">{children}</div>
    </div>
  );
}

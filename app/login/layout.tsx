import type { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/hannune-login-background.webp')",
          backgroundPosition: "42% center",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.08)_0%,rgba(2,6,23,0.16)_44%,rgba(2,6,23,0.58)_67%,rgba(2,6,23,0.9)_100%)]"
      />
      <div className="relative z-10 [&>main]:!bg-transparent">{children}</div>
    </div>
  );
}

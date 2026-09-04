"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menus = [
    { name: '대시보드', href: '/sup' },
    { name: '보고서관리', href: '/sup/report' },
    { name: '차량관리', href: '/sup/vehicle' },
    { name: '재고관리', href: '/sup/stock' },
    { name: '마이페이지', href: '/sup/mypage' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-blue-500/30">
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/85 backdrop-blur-md px-5 lg:px-7 flex items-center justify-between shrink-0 sticky top-0 z-50 shadow-sm">
        <Link href="/sup" className="flex items-center gap-3 cursor-pointer group shrink-0">
          <div className="w-8 h-8 rounded-lg border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.12)] group-hover:bg-blue-500/15 transition">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black tracking-[-0.03em] text-white">Hannune</span>
            <span className="hidden sm:inline text-[10px] font-black tracking-[0.14em] text-blue-400">OPERATION SUPPORT</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 bg-slate-950/55 p-1 rounded-xl border border-slate-800">
          {menus.map((menu) => {
            const isActive = pathname === menu.href;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`px-4 xl:px-5 py-1.5 rounded-lg text-xs xl:text-sm font-bold transition-all duration-200 inline-block ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {menu.name}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold px-3.5 py-2 rounded-lg border border-slate-700 transition-colors shadow-inner flex items-center gap-2 shrink-0"
        >
          <span className="text-blue-500">←</span>
          <span className="hidden sm:inline">관제 화면</span>
          <span className="sm:hidden">관제</span>
        </Link>
      </header>

      <div className="flex-1 flex flex-col min-h-0">
        {children}
      </div>
    </div>
  );
}

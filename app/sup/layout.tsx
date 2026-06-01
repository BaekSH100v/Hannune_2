"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 메뉴명과 실제 이동할 URL 주소 매핑
  const menus = [
    { name: '대시보드', href: '/sup' },
    { name: '보고서관리', href: '/sup/report' },
    { name: '차량관리', href: '/sup/vehicle' },
    { name: '재고관리', href: '/sup/stock' },
    { name: '마이페이지', href: '/sup/mypage' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-blue-500/30">
      
      {/* 상단 네비게이션 헤더 (GNB) - 기존 디자인 100% 유지 */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-50 shadow-sm">
        
        {/* 좌측 로고 영역 */}
        <Link href="/sup" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white shadow-lg group-hover:scale-105 transition-transform">
            한
          </div>
          <span className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            한누네 <span className="text-blue-400 font-bold text-sm bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-900/50">업무지원</span>
          </span>
        </Link>

        {/* 💡 중앙 서브 메뉴 영역 (실제 주소 Link 기반으로 고도화) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/50 p-1 rounded-xl border border-slate-800">
          {menus.map((menu) => {
            // 현재 브라우저 주소와 메뉴 링크가 정확히 맞는지 체크
            const isActive = pathname === menu.href;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 inline-block ${
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

        {/* 우측 메인 복귀 버튼 */}
        <a 
          href="/" 
          className="text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold px-4 py-2 rounded-lg border border-slate-700 transition-colors shadow-inner flex items-center gap-2"
        >
          <span className="text-blue-500">←</span> 관제탑 복귀
        </a>
      </header>

      {/* 서브 페이지 콘텐츠가 채워질 컨테이너 영역 */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
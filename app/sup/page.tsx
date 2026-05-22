// app/sup/page.tsx
'use strict';
import React from 'react';

export default function SupportPage() {
  // 샘플 데이터: 자재 신청 현황
  const supplyRequests = [
    { id: 'REQ-042', item: '염화칼슘 (톤)', qty: '5.0', location: '서초 제3저장소', status: '승인완료', date: '2026-05-21' },
    { id: 'REQ-041', item: '친환경 제설제 (포)', qty: '200', location: '강남 대기소', status: '배송중', date: '2026-05-21' },
    { id: 'REQ-040', item: '모래 주머니 (개)', qty: '500', location: '송파 오륜사거리', status: '대기중', date: '2026-05-20' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* 상단 네비게이션 헤더 */}
      <header className="h-16 border-b border-slate-800/60 bg-slate-900/50 backdrop-blur px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-tight text-white">한누네 <span className="text-blue-500 font-medium text-sm">제설업무지원</span></span>
        </div>
        <a href="/" className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors">
          ⬅️ 메인 관제탑으로 돌아가기
        </a>
      </header>

      {/* 메인 대시보드 콘텐츠 영역 */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* 타이틀 섹션 */}
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">현장 업무 지원 센터</h1>
          <p className="text-xs text-slate-400 mt-1">제설 자재 신청, 비상 소통망 및 실시간 행정 지원을 관리합니다.</p>
        </div>

        {/* 3분할 퀵 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
            <span className="text-[11px] font-bold text-slate-500 block">오늘의 자재 요청</span>
            <span className="text-2xl font-mono font-black text-blue-400 mt-1 block">3 건</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
            <span className="text-[11px] font-bold text-slate-500 block">비상 동원 인력</span>
            <span className="text-2xl font-mono font-black text-emerald-400 mt-1 block">42 명 / 대기중</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
            <span className="text-[11px] font-bold text-slate-500 block">염화칼슘 잔여량</span>
            <span className="text-2xl font-mono font-black text-amber-400 mt-1 block">142.5 톤</span>
          </div>
        </div>

        {/* 하단 업무 그리드: 좌측(자재 신청 현황) / 우측(비상 연락망) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 좌측: 자재 신청 현황 테이블 (2칸 차지) */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">📦 실시간 자재 보급 및 보충 신청 현황</h2>
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg shadow-md transition-colors">
                + 신규 자재 신청
              </button>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                    <th className="p-3">요청번호</th>
                    <th className="p-3">요청 물품</th>
                    <th className="p-3">수량</th>
                    <th className="p-3">요청 구역</th>
                    <th className="p-3">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {supplyRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-mono text-slate-500">{req.id}</td>
                      <td className="p-3 font-bold text-slate-200">{req.item}</td>
                      <td className="p-3 font-mono font-semibold text-slate-300">{req.qty}</td>
                      <td className="p-3 text-slate-400">{req.location}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.status === '승인완료' ? 'bg-blue-950 text-blue-400 border border-blue-900/50' :
                          req.status === '배송중' ? 'bg-amber-950 text-amber-400 border border-amber-900/50' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 우측: 비상 연락망 센터 (1칸 차지) */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">🚨 비상 상황 소통 센터</h2>
            
            <div className="space-y-2.5">
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200">종합 관제 상황실</span>
                  <span className="text-[10px] text-red-400 bg-red-950/50 px-1.5 py-0.5 rounded border border-red-900/30 font-bold">24H 대기</span>
                </div>
                <span className="text-xs font-mono text-slate-400 font-medium">02-1234-5678</span>
              </div>

              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200">강남구청 도로과 (제설대책반)</span>
                </div>
                <span className="text-xs font-mono text-slate-400 font-medium">02-555-9988</span>
              </div>

              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200">서초구청 도로관리소</span>
                </div>
                <span className="text-xs font-mono text-slate-400 font-medium">02-444-1122</span>
              </div>
            </div>

            <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold py-2.5 rounded-xl transition-colors mt-auto shadow-sm">
              📢 전체 기사님 비상 문자 발송
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
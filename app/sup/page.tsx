"use client";

import React, { useState } from 'react';

export default function SupportDashboardPage() {
  const [weatherOpen, setWeatherOpen] = useState(true);

  // 샘플 데이터 복구 (단 1바이트도 수정하지 않음)
  const supplyRequests = [
    { id: 'REQ-042', item: '염화칼슘 (톤)', qty: '5.0', location: '서초 제3저장소', status: '승인완료', date: '2026-05-21' },
    { id: 'REQ-041', item: '친환경 제설제 (포)', qty: '200', location: '강남 대기소', status: '배송중', date: '2026-05-21' },
    { id: 'REQ-040', item: '모래 주머니 (개)', qty: '500', location: '송파 오륜사거리', status: '대기중', date: '2026-05-20' },
  ];

  return (
    <main className="flex-1 p-6 max-w-[1400px] w-full mx-auto space-y-6 animate-in fade-in duration-500">
      {/* 타이틀 섹션 */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">현장 업무 통합 대시보드</h1>
        <p className="text-xs text-slate-400 mt-1">제설 자재 신청, 비상 소통망 및 실시간 행정 지원을 한눈에 관리합니다.</p>
      </div>

      {/* 3분할 퀵 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-colors"></div>
          <span className="text-xs font-bold text-slate-500 block mb-2">오늘의 자재 요청</span>
          <span className="text-3xl font-mono font-black text-white flex items-baseline gap-1">
            3 <span className="text-sm font-bold text-blue-400 font-sans">건</span>
          </span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-colors"></div>
          <span className="text-xs font-bold text-slate-500 block mb-2">비상 동원 인력</span>
          <span className="text-3xl font-mono font-black text-white flex items-baseline gap-1">
            42 <span className="text-sm font-bold text-emerald-400 font-sans">명 대기중</span>
          </span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl shadow-lg backdrop-blur-sm relative overflow-hidden group hover:border-amber-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-amber-500/20 transition-colors"></div>
          <span className="text-xs font-bold text-slate-500 block mb-2">염화칼슘 전체 잔여량</span>
          <span className="text-3xl font-mono font-black text-white flex items-baseline gap-1">
            142.5 <span className="text-sm font-bold text-amber-400 font-sans">톤</span>
          </span>
        </div>
      </div>

      {/* 하단 업무 그리드: 좌측(자재 신청 현황) / 우측(비상 연락망) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 좌측: 자재 신청 현황 테이블 */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">📦 실시간 자재 보급 및 보충 신청 현황</h2>
            <button onClick={() => alert("준비 중")} className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-2 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all active:scale-95">
              + 신규 자재 신청
            </button>
          </div>
          
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <th className="p-3.5">요청번호</th>
                  <th className="p-3.5">요청 물품</th>
                  <th className="p-3.5">수량</th>
                  <th className="p-3.5">요청 구역</th>
                  <th className="p-3.5">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {supplyRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition-colors group cursor-pointer">
                    <td className="p-3.5 font-mono text-slate-500 group-hover:text-blue-400 transition-colors">{req.id}</td>
                    <td className="p-3.5 font-bold text-slate-200">{req.item}</td>
                    <td className="p-3.5 font-mono font-black text-slate-300">{req.qty}</td>
                    <td className="p-3.5 text-slate-400">{req.location}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wide inline-block ${
                        req.status === '승인완료' ? 'bg-blue-950 text-blue-400 border border-blue-900/50' :
                        req.status === '배송중' ? 'bg-amber-950 text-amber-400 border border-amber-900/50' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
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

        {/* 우측: 비상 연락망 센터 */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">🚨 비상 상황 소통 센터</h2>
          
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/60 flex flex-col gap-1.5 hover:border-red-500/30 transition-colors cursor-pointer group">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-200 group-hover:text-white">종합 관제 상황실</span>
                <span className="text-[9px] text-red-400 bg-red-950/50 px-1.5 py-0.5 rounded border border-red-900/30 font-black animate-pulse">24H 대기</span>
              </div>
              <span className="text-sm font-mono text-slate-400 font-bold group-hover:text-blue-400 transition-colors">02-1234-5678</span>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/60 flex flex-col gap-1.5 hover:border-blue-500/30 transition-colors cursor-pointer group">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-200 group-hover:text-white">강남구청 도로과 (대책반)</span>
              </div>
              <span className="text-sm font-mono text-slate-400 font-bold group-hover:text-blue-400 transition-colors">02-555-9988</span>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/60 flex flex-col gap-1.5 hover:border-blue-500/30 transition-colors cursor-pointer group">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-200 group-hover:text-white">서초구청 도로관리소</span>
              </div>
              <span className="text-sm font-mono text-slate-400 font-bold group-hover:text-blue-400 transition-colors">02-444-1122</span>
            </div>
          </div>

          <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold py-3 rounded-xl transition-all active:scale-95 mt-auto shadow-sm flex items-center justify-center gap-2">
            <span>📢</span> 전체 기사님 비상 문자 발송
          </button>
        </div>

      </div>
    </main>
  );
}
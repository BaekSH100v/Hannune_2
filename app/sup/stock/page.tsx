"use client";

import React, { useState } from 'react';

const monthlyStats = [
  { month: '1월', inbound: 210, outbound: 132 },
  { month: '2월', inbound: 168, outbound: 118 },
  { month: '3월', inbound: 124, outbound: 96 },
  { month: '4월', inbound: 88, outbound: 62 },
  { month: '5월', inbound: 76, outbound: 48 },
  { month: '6월', inbound: 118, outbound: 81 },
  { month: '7월', inbound: 92, outbound: 74 },
  { month: '8월', inbound: 108, outbound: 86 },
  { month: '9월', inbound: 156, outbound: 112 },
  { month: '10월', inbound: 214, outbound: 164 },
  { month: '11월', inbound: 286, outbound: 208 },
  { month: '12월', inbound: 332, outbound: 246 },
];

const stockWarehouses = [
  { id: 'WH-01', name: '서초 제3 자재창고', manager: '박물류', phone: '010-1111-2222', total: '142.5톤' },
  { id: 'WH-02', name: '강남 율현 자재창고', manager: '이창고', phone: '010-3333-4444', total: '86.2톤' },
  { id: 'WH-03', name: '송파 장지 자재창고', manager: '김재고', phone: '010-5555-6666', total: '31.4톤' },
  { id: 'WH-04', name: '강동 비상 자재창고', manager: '최보급', phone: '010-7777-8888', total: '58.0톤' },
];

const initialStockLogs = [
  { id: 'LOG-101', date: '2026-06-01 10:30', type: '입고', item: '염화칼슘', qty: 50, unit: '톤', manager: '박물류', region: '서초 제3 자재창고' },
  { id: 'LOG-102', date: '2026-06-01 11:15', type: '출고', item: '모래주머니', qty: 200, unit: '개', manager: '김재고', region: '송파 장지 자재창고' },
  { id: 'LOG-103', date: '2026-06-01 13:40', type: '입고', item: '친환경 제설제', qty: 100, unit: '포', manager: '이창고', region: '강남 율현 자재창고' },
  { id: 'LOG-104', date: '2026-06-01 14:20', type: '출고', item: '염화칼슘', qty: 15, unit: '톤', manager: '최보급', region: '강동 비상 자재창고' },
  { id: 'LOG-105', date: '2026-06-01 16:00', type: '요청', item: '모래주머니', qty: 500, unit: '개', manager: '박물류', region: '서초 제3 자재창고' },
];

export default function StockPage() {
  const [currentYear, setCurrentYear] = useState('2026');
  const [stockLogs, setStockLogs] = useState(initialStockLogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    type: '입고',
    region: stockWarehouses[0].name,
    item: '염화칼슘',
    qty: 0,
  });

  const handleModalChange = (field: string, value: string | number) => {
    setModalForm({ ...modalForm, [field]: value });
  };

  const handleModalSubmit = () => {
    if (modalForm.qty <= 0) {
      window.alert('수량을 1 이상 입력해주세요.');
      return;
    }

    let unit = '개';
    if (modalForm.item === '염화칼슘') unit = '톤';
    if (modalForm.item === '친환경 제설제') unit = '포';

    const warehouse = stockWarehouses.find((item) => item.name === modalForm.region);
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      type: modalForm.type,
      item: modalForm.item,
      qty: modalForm.qty,
      unit,
      manager: warehouse?.manager ?? '시스템 관리자',
      region: modalForm.region,
    };

    setStockLogs([newLog, ...stockLogs]);
    setIsModalOpen(false);
    setModalForm({ ...modalForm, qty: 0 });
  };

  return (
    <main className="flex-1 p-6 max-w-[1800px] w-full mx-auto space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30 shrink-0">
            <span className="text-2xl">📦</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">지역별 재고 통합 관리</h2>
            <p className="text-xs text-slate-500 mt-1">
              자재 창고별 재고와 입출고 이력을 관리하고 운영 현황을 확인합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm font-bold text-slate-200 outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="2026">2026년</option>
            <option value="2025">2025년</option>
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all active:scale-95"
          >
            + 수동 입출고 등록
          </button>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          📊 {currentYear}년 월별 자재 입출고 현황
        </h3>

        <div className="flex items-end justify-between h-48 pt-4 gap-2 border-b border-slate-800 pb-2">
          {monthlyStats.map((stat) => {
            const inHeight = Math.min((stat.inbound / 350) * 100, 100);
            const outHeight = Math.min((stat.outbound / 350) * 100, 100);

            return (
              <div key={stat.month} className="flex flex-col items-center gap-2 flex-1 group">
                <div className="flex gap-1 w-full justify-center items-end h-full">
                  <div
                    className="w-1/3 bg-blue-600 rounded-t-sm transition-all duration-700 group-hover:bg-blue-500"
                    style={{ height: `${inHeight}%` }}
                    title={`입고: ${stat.inbound}`}
                  />
                  <div
                    className="w-1/3 bg-amber-500 rounded-t-sm transition-all duration-700 group-hover:bg-amber-400"
                    style={{ height: `${outHeight}%` }}
                    title={`출고: ${stat.outbound}`}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{stat.month}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-4">
          <span className="text-[10px] text-slate-400 flex items-center gap-1"><span className="w-3 h-3 bg-blue-600 rounded-sm" /> 입고량</span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded-sm" /> 출고량</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex justify-between items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">🏬 재고 관리</h3>
              <p className="mt-1 text-[10px] text-slate-500">담당자 정보는 마이페이지 등록 정보와 연동 예정입니다.</p>
            </div>
            <button
              onClick={() => window.alert('자재 창고 등록·수정 기능은 개발 연동 단계에서 연결합니다.')}
              className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded hover:bg-slate-700 transition-colors shrink-0"
            >
              관리
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800">
            <div className="grid grid-cols-[1.35fr_0.8fr] gap-x-3 border-b border-slate-800 bg-slate-950 px-3 py-2 text-[9px] font-bold text-slate-600">
              <span>자재 창고명</span>
              <span className="text-right">총 수량</span>
            </div>
            <div className="divide-y divide-slate-800/60">
              {stockWarehouses.map((warehouse) => (
                <div key={warehouse.id} className="p-3 bg-slate-950/45 hover:bg-slate-950/70 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black text-slate-200">{warehouse.name}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500">
                        <span className="font-bold text-slate-400">담당자 {warehouse.manager}</span>
                        <span className="text-slate-700">·</span>
                        <span className="font-mono">{warehouse.phone}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-sm font-black text-blue-300">{warehouse.total}</p>
                      <p className="mt-1 text-[9px] font-bold text-slate-600">총 수량</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-slate-800/70 bg-slate-950/35 p-3 text-center">
            <div>
              <p className="text-[9px] font-bold text-slate-600">창고</p>
              <p className="mt-1 font-mono text-sm font-black text-white">{stockWarehouses.length}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-600">담당자</p>
              <p className="mt-1 font-mono text-sm font-black text-white">{new Set(stockWarehouses.map((item) => item.manager)).size}</p>
            </div>
            <div className="col-span-2 border-l border-slate-800 pl-2">
              <p className="text-[9px] font-bold text-slate-600">관리 기준</p>
              <p className="mt-1 text-[10px] font-bold text-slate-400">창고별 재고 · 담당자 · 연락처</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">📝 실시간 입출고 및 요청 로그</h3>
            <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] rounded font-bold">전체 보기</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 h-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">일시</th>
                  <th className="p-3">구분</th>
                  <th className="p-3">자재 창고</th>
                  <th className="p-3">자재명</th>
                  <th className="p-3 text-right">수량</th>
                  <th className="p-3 text-center">담당자</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stockLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono text-slate-500">{log.date}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.type === '입고' ? 'bg-blue-950/50 text-blue-400 border-blue-900' :
                        log.type === '출고' ? 'bg-amber-950/50 text-amber-400 border-amber-900' :
                        'bg-red-950/50 text-red-400 border-red-900'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 font-bold">{log.region}</td>
                    <td className="p-3 text-slate-300">{log.item}</td>
                    <td className="p-3 text-right font-mono font-black text-slate-200">
                      {log.type === '출고' ? '-' : '+'}{log.qty} <span className="text-[10px] font-sans text-slate-500 font-normal">{log.unit}</span>
                    </td>
                    <td className="p-3 text-center text-slate-400">{log.manager}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2"><span>➕</span> 자재 수동 입출고 등록</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">구분</label>
                <div className="flex gap-2">
                  <button onClick={() => handleModalChange('type', '입고')} className={`flex-1 py-2 rounded-lg font-bold text-sm border transition-colors ${modalForm.type === '입고' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'}`}>입고</button>
                  <button onClick={() => handleModalChange('type', '출고')} className={`flex-1 py-2 rounded-lg font-bold text-sm border transition-colors ${modalForm.type === '출고' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'}`}>출고</button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">자재 창고</label>
                <select value={modalForm.region} onChange={(e) => handleModalChange('region', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-200 outline-none focus:border-blue-500 transition-colors">
                  {stockWarehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.name}>{warehouse.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">자재명</label>
                <select value={modalForm.item} onChange={(e) => handleModalChange('item', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-200 outline-none focus:border-blue-500 transition-colors">
                  <option value="염화칼슘">염화칼슘 (단위: 톤)</option>
                  <option value="친환경 제설제">친환경 제설제 (단위: 포)</option>
                  <option value="모래주머니">모래주머니 (단위: 개)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">수량</label>
                <input type="number" min="0" value={modalForm.qty === 0 ? '' : modalForm.qty} onChange={(e) => handleModalChange('qty', Number(e.target.value))} placeholder="0" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-200 outline-none focus:border-blue-500 transition-colors font-mono" />
              </div>
            </div>

            <div className="bg-slate-950/50 px-6 py-4 border-t border-slate-800 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-lg border border-slate-700 transition-colors text-sm">취소</button>
              <button onClick={handleModalSubmit} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition-colors shadow-md text-sm">등록 완료</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
